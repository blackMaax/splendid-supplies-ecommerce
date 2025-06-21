"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { CheckCircle, Package, Truck, Mail } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Clear cart from localStorage after successful payment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing your order...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        
        {/* Order Details */}
        {sessionId && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h2>
            <div className="text-sm text-gray-600">
              <p><strong>Session ID:</strong> {sessionId}</p>
              <p className="mt-2"><strong>Status:</strong> <span className="text-green-600">Confirmed</span></p>
            </div>
          </div>
        )}
        
        {/* Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Confirmation Email</h3>
            <p className="text-sm text-gray-600">
              You'll receive an email confirmation within 5 minutes.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Processing</h3>
            <p className="text-sm text-gray-600">
              Your order will be processed within 1-2 business days.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Truck className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Delivery</h3>
            <p className="text-sm text-gray-600">
              Free UK delivery takes 2-3 business days.
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-x-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            Continue Shopping
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
          >
            Contact Support
          </Link>
        </div>
        
        {/* Payment Security Notice */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
            </svg>
            <span>Payment processed securely by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <Suspense fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
      
      <Footer />
    </div>
  )
} 