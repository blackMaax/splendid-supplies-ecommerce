import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { promises as fs } from 'fs'
import path from 'path'
import { rateLimit, getClientIP } from '../../../../lib/auth'
import type { Product } from '../../../types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const PRODUCTS_FILE = path.join(process.cwd(), 'app/data/products.json')

async function readProductsFile() {
  try {
    const fileContents = await fs.readFile(PRODUCTS_FILE, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error reading products file:', error)
    return { products: [], categories: [] }
  }
}

async function writeProductsFile(data: any) {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing products file:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for webhook endpoint
    const clientIP = getClientIP(request)
    if (!rateLimit(`webhook-${clientIP}`, 30, 60000)) {
      console.warn(`Webhook rate limit exceeded for IP: ${clientIP}`)
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.warn(`Webhook missing signature from IP: ${clientIP}`)
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
    }

    // Validate webhook secret is configured
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      console.warn(`Invalid webhook signature from IP: ${clientIP}`)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Log successful webhook verification
    console.log(`Webhook verified successfully: ${event.type} from IP: ${clientIP}`)

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

    try {
      // Get the line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product']
      })

      // Update stock for each item
      const data = await readProductsFile()
      
      for (const item of lineItems.data) {
        const quantity = item.quantity || 1
        
        // Get product from Stripe to access metadata
        const stripeProduct = item.price?.product as Stripe.Product
        const productId = stripeProduct?.metadata?.product_id
        
        if (productId) {
          const productIndex = data.products.findIndex((p: Product) => p.id === productId)
          
          if (productIndex !== -1) {
            data.products[productIndex].stock -= quantity
            data.products[productIndex].inStock = data.products[productIndex].stock > 0
            data.products[productIndex].updatedAt = new Date().toISOString()
            
            console.log(`Updated stock for ${data.products[productIndex].name}: ${data.products[productIndex].stock} remaining`)
          }
        }
      }

      await writeProductsFile(data)
      console.log('Stock updated successfully after payment')
      
    } catch (error) {
      console.error('Error updating stock after payment:', error)
    }
  }

  return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
} 