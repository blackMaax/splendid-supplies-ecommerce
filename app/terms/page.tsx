import Header from '../components/Header'
import Footer from '../components/Footer'
import { Scale, FileText, AlertTriangle, CheckCircle, ShoppingCart, Truck } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms & Conditions</h1>
            <p className="text-xl text-gray-600">
              Please read these terms carefully before using our services or making a purchase.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Key Points */}
          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg mb-8">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Key Points</h3>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• By using our website, you agree to these terms</li>
                  <li>• We reserve the right to refuse service for any reason</li>
                  <li>• All prices include VAT where applicable</li>
                  <li>• Returns accepted within 30 days in original condition</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Agreement to Terms */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Agreement to Terms</h2>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  By accessing and using the Splendid Supplies website, placing orders, or using our services, 
                  you agree to be bound by these Terms and Conditions. If you do not agree to these terms, 
                  please do not use our website or services.
                </p>
                <p className="text-gray-600">
                  These terms apply to all visitors, users, and customers of Splendid Supplies, 
                  operating from London, UK.
                </p>
              </div>
            </div>

            {/* Products and Services */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <ShoppingCart className="w-6 h-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Products & Services</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">Product Information</h3>
                  <ul className="text-blue-800 text-sm space-y-2">
                    <li>• We strive for accurate product descriptions and images</li>
                    <li>• Specifications may vary slightly from descriptions</li>
                    <li>• Colors may appear different on various screens</li>
                    <li>• We reserve the right to discontinue products</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-3">Pricing & Availability</h3>
                  <ul className="text-orange-800 text-sm space-y-2">
                    <li>• All prices are in GBP and include VAT where applicable</li>
                    <li>• Prices may change without notice</li>
                    <li>• Product availability is subject to stock levels</li>
                    <li>• We reserve the right to limit quantities</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Orders and Payment */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders & Payment</h2>
              
              <div className="bg-white border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Process</h3>
                <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                  <li>Add items to your cart and proceed to checkout</li>
                  <li>Provide accurate billing and shipping information</li>
                  <li>Review your order and complete payment via Stripe</li>
                  <li>Receive order confirmation via email</li>
                  <li>Your order will be processed within 1-2 business days</li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-3">Payment Terms</h3>
                <ul className="text-yellow-800 text-sm space-y-2">
                  <li>• Payment is processed securely by Stripe</li>
                  <li>• We accept major credit and debit cards</li>
                  <li>• Payment must be received before order dispatch</li>
                  <li>• We reserve the right to cancel orders for non-payment</li>
                  <li>• Fraudulent orders will be reported to authorities</li>
                </ul>
              </div>
            </div>

            {/* Returns and Refunds */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Returns & Refunds</h2>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">30-Day Return Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Conditions for Returns:</h4>
                    <ul className="text-green-700 space-y-1">
                      <li>• Items must be unused and in original packaging</li>
                      <li>• Returns must be initiated within 30 days</li>
                      <li>• Original receipt or order confirmation required</li>
                      <li>• Customer pays return shipping unless item is defective</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Refund Process:</h4>
                    <ul className="text-green-700 space-y-1">
                      <li>• Contact us for return authorization</li>
                      <li>• Return items to our specified address</li>
                      <li>• Refunds processed within 5-7 business days</li>
                      <li>• Refunds issued to original payment method</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Important Legal Notice</h3>
                    <div className="text-red-800 text-sm space-y-2">
                      <p>
                        Our liability is limited to the purchase price of the product. We are not liable for:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Indirect, consequential, or special damages</li>
                        <li>Loss of profits, data, or business opportunities</li>
                        <li>Damages arising from misuse of products</li>
                        <li>Events beyond our reasonable control (force majeure)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Governing Law</h2>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <p className="text-purple-800">
                  These terms are governed by the laws of England and Wales. Any disputes will be resolved 
                  in the courts of England and Wales. If any provision of these terms is found to be 
                  unenforceable, the remaining provisions will continue in full force.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Questions About These Terms?</h3>
              <p className="text-blue-800 mb-3">
                If you have questions about these terms and conditions, please contact us:
              </p>
              <div className="text-blue-800 text-sm space-y-1">
                <p><strong>Email:</strong> Sales@SplendidCasa.uk</p>
                <p><strong>Phone:</strong> 0207 101 3408</p>
                <p><strong>Address:</strong> London, UK</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 