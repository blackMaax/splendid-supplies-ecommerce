import Header from '../components/Header'
import Footer from '../components/Footer'
import { Shield, Eye, Lock, Users, FileText, AlertCircle } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">
              Your privacy is important to us. This policy explains how we collect, use, and protect your data.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Quick Overview */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-8">
            <div className="flex items-start">
              <Eye className="w-6 h-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Overview</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• We only collect data necessary to process your orders and improve our service</li>
                  <li>• We never sell your personal information to third parties</li>
                  <li>• You can request to see, update, or delete your data at any time</li>
                  <li>• We use industry-standard security measures to protect your information</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Information We Collect */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Information We Collect</h2>
              </div>
              
              <div className="bg-white border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><strong>Contact Details:</strong> Name, email address, phone number</li>
                  <li><strong>Billing & Shipping:</strong> Addresses for order processing and delivery</li>
                  <li><strong>Payment Information:</strong> Processed securely by Stripe (we don't store card details)</li>
                  <li><strong>Order History:</strong> Purchase records for customer service and warranty purposes</li>
                </ul>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Information</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><strong>Website Usage:</strong> Pages visited, time spent, browser type</li>
                  <li><strong>Device Information:</strong> IP address, device type, operating system</li>
                  <li><strong>Cookies:</strong> Small files to improve your browsing experience</li>
                </ul>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">How We Use Your Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">Order Processing</h3>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Process and fulfill your orders</li>
                    <li>• Send order confirmations and updates</li>
                    <li>• Arrange delivery and handle returns</li>
                    <li>• Provide customer support</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3">Service Improvement</h3>
                  <ul className="text-purple-800 text-sm space-y-1">
                    <li>• Improve our website and services</li>
                    <li>• Analyze usage patterns</li>
                    <li>• Prevent fraud and abuse</li>
                    <li>• Comply with legal requirements</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Protection */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Lock className="w-6 h-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">How We Protect Your Data</h2>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Encryption</h3>
                    <p className="text-gray-600 text-sm">All data is encrypted in transit and at rest using industry-standard SSL/TLS protocols.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Secure Storage</h3>
                    <p className="text-gray-600 text-sm">Data is stored on secure servers with restricted access and regular security audits.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Limited Access</h3>
                    <p className="text-gray-600 text-sm">Only authorized personnel can access your data, and only when necessary for service delivery.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights (GDPR)</h2>
              <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Access & Control</h3>
                    <ul className="text-gray-600 text-sm space-y-2">
                      <li>• <strong>Right to Access:</strong> Request a copy of your data</li>
                      <li>• <strong>Right to Rectification:</strong> Correct inaccurate information</li>
                      <li>• <strong>Right to Erasure:</strong> Request deletion of your data</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Processing Rights</h3>
                    <ul className="text-gray-600 text-sm space-y-2">
                      <li>• <strong>Right to Portability:</strong> Transfer your data elsewhere</li>
                      <li>• <strong>Right to Object:</strong> Opt out of certain processing</li>
                      <li>• <strong>Right to Restrict:</strong> Limit how we use your data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookies & Tracking</h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <p className="text-yellow-800 mb-4">
                  We use cookies to improve your browsing experience and analyze website performance. 
                  You can control cookies through your browser settings.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-yellow-900">Essential Cookies</h4>
                    <p className="text-yellow-800">Required for website functionality</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900">Analytics Cookies</h4>
                    <p className="text-yellow-800">Help us understand usage patterns</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900">Preference Cookies</h4>
                    <p className="text-yellow-800">Remember your settings and choices</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-1 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Questions About Your Privacy?</h3>
                  <p className="text-blue-800 mb-3">
                    If you have questions about this privacy policy or want to exercise your rights, contact us:
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
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 