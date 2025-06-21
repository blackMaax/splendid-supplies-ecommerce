import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Returns Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our 30-Day Return Promise</h2>
            <p className="text-gray-600 mb-6">
              We want you to be completely satisfied with your purchase. If you're not happy with your order, 
              you can return it within 30 days of delivery for a full refund.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Return Conditions</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Items must be unused and in original packaging</li>
              <li>Returns must be initiated within 30 days of delivery</li>
              <li>Original receipt or order confirmation required</li>
              <li>Customer is responsible for return shipping costs unless item is defective</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Return</h2>
            <ol className="list-decimal pl-6 text-gray-600 mb-6 space-y-2">
              <li>Contact us at Sales@SplendidCasa.uk with your order number</li>
              <li>We'll provide a return authorization and instructions</li>
              <li>Package items securely and include return authorization</li>
              <li>Send to our returns address (provided with authorization)</li>
            </ol>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Refund Timeline</h2>
            <p className="text-gray-600 mb-6">
              Once we receive your return, we'll inspect the items and process your refund within 5-7 business days. 
              Refunds will be issued to your original payment method.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Damaged or Defective Items</h2>
            <p className="text-gray-600 mb-6">
              If you receive a damaged or defective item, please contact us immediately. We'll arrange free return 
              shipping and provide a full refund or replacement at no cost to you.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-800">
                Contact our customer service team at <strong>0207 101 3408</strong> or 
                <strong> Sales@SplendidCasa.uk</strong> for assistance with returns.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 