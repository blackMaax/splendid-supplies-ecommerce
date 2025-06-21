import Header from '../components/Header'
import Footer from '../components/Footer'
import { Truck, Clock, MapPin, Package } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Shipping Information</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Truck className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-green-900">Free UK Delivery Over £50</h2>
              </div>
              <p className="text-green-800">
                Free standard delivery on orders over £50 to mainland UK addresses. Orders under £50 incur a £4.99 shipping charge.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Clock className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-blue-900">Fast Processing</h2>
              </div>
              <p className="text-blue-800">
                Orders placed before 2PM Monday-Friday are processed the same day.
              </p>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delivery Times</h2>
            <div className="bg-white border rounded-lg p-6 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Standard Delivery</span>
                  <span className="text-gray-600">2-3 business days</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2 text-sm">
                  <span className="text-gray-600">• Free on orders over £50</span>
                  <span className="text-gray-600">• £4.99 on orders under £50</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Express Delivery</span>
                  <span className="text-gray-600">Next business day (£9.99)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Saturday Delivery</span>
                  <span className="text-gray-600">Available (£14.99)</span>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delivery Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Included Areas
                </h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>England (mainland)</li>
                  <li>Scotland (mainland)</li>
                  <li>Wales</li>
                  <li>Northern Ireland</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-orange-600" />
                  Special Delivery
                </h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Scottish Highlands (additional 1-2 days)</li>
                  <li>Islands (please contact us)</li>
                  <li>Large/heavy items may require special arrangement</li>
                </ul>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Tracking</h2>
            <p className="text-gray-600 mb-6">
              Once your order is dispatched, you'll receive a tracking number via email. You can track your 
              delivery progress through our courier's website or by contacting us directly.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delivery Requirements</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Someone must be available to receive the delivery</li>
              <li>Photo ID may be required for high-value items</li>
              <li>Safe place delivery available on request</li>
              <li>Signature required for items over £100</li>
            </ul>
            
            <div className="bg-yellow-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-yellow-900 mb-2">Delivery Issues?</h3>
              <p className="text-yellow-800">
                If your delivery is delayed or there's an issue, please contact us at <strong>0207 101 3408</strong> 
                or <strong>Sales@SplendidCasa.uk</strong> and we'll resolve it quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 