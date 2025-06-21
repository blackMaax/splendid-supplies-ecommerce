import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { promises as fs } from 'fs'
import path from 'path'
import type { Product } from '../../types'

// Initialize Stripe with secret key
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

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    // Validate that items exist
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    // Validate stock levels before creating checkout session
    const data = await readProductsFile()
    const stockIssues: string[] = []

    for (const item of items) {
      const product = data.products.find((p: Product) => p.id === item.id)
      if (!product) {
        stockIssues.push(`Product ${item.name} is no longer available`)
        continue
      }
      
      if (product.stock < item.quantity) {
        stockIssues.push(`${product.name}: Only ${product.stock} available, but ${item.quantity} requested`)
      }
    }

    if (stockIssues.length > 0) {
      return NextResponse.json(
        { error: 'Stock validation failed', details: stockIssues },
        { status: 400 }
      )
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      // Process image URL for Stripe compatibility
      let imageUrl = null
      if (item.image) {
        if (item.image.startsWith('http')) {
          // Already a full URL (Unsplash, Vercel Blob, etc.)
          imageUrl = item.image
        } else if (item.image.startsWith('/')) {
          // Relative path from public directory
          imageUrl = `${process.env.NEXT_PUBLIC_DOMAIN}${item.image}`
        } else {
          // Assume it's a filename in public directory
          imageUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/${item.image}`
        }
        
        // Ensure the URL is properly formatted for Stripe
        try {
          new URL(imageUrl)
        } catch (error) {
          console.error(`Invalid image URL for Stripe: ${imageUrl}`)
          imageUrl = null // Don't send invalid URLs to Stripe
        }
      }

      // Debug logging for image URL processing
      console.log(`Processing item: ${item.name}`)
      console.log(`Original image: ${item.image}`)
      console.log(`Processed imageUrl: ${imageUrl}`)
      console.log(`NEXT_PUBLIC_DOMAIN: ${process.env.NEXT_PUBLIC_DOMAIN}`)

      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
            description: item.description,
            images: imageUrl ? [imageUrl] : [],
            metadata: {
              product_id: item.id,
            },
          },
          unit_amount: Math.round(item.price * 100), // Convert to pence
        },
        quantity: item.quantity,
      }
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cart`,
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE'],
      },
      billing_address_collection: 'required',
      metadata: {
        source: 'splendid-supplies-ecommerce',
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 