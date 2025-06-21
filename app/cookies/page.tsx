import Header from '../components/Header'
import Footer from '../components/Footer'
import { Cookie, Settings, Eye, BarChart3, Shield, AlertCircle } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Cookie Policy</h1>
            <p className="text-xl text-gray-600">
              Learn about how we use cookies to improve your browsing experience.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* What are Cookies */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-8">
            <div className="flex items-start">
              <Eye className="w-6 h-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">What are Cookies?</h3>
                <p className="text-blue-800">
                  Cookies are small text files that are stored on your device when you visit our website. 
                  They help us provide you with a better browsing experience by remembering your preferences 
                  and analyzing how our website is used.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Types of Cookies */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Types of Cookies We Use</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="font-semibold text-green-900">Essential Cookies</h3>
                  </div>
                  <p className="text-green-800 text-sm mb-4">
                    These cookies are necessary for the website to function properly and cannot be disabled.
                  </p>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Shopping cart functionality</li>
                    <li>• User authentication</li>
                    <li>• Security features</li>
                    <li>• Form submissions</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="font-semibold text-blue-900">Analytics Cookies</h3>
                  </div>
                  <p className="text-blue-800 text-sm mb-4">
                    Help us understand how visitors interact with our website to improve performance.
                  </p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Page views and traffic</li>
                    <li>• User behavior patterns</li>
                    <li>• Popular content</li>
                    <li>• Error tracking</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Settings className="w-6 h-6 text-purple-600 mr-3" />
                    <h3 className="font-semibold text-purple-900">Preference Cookies</h3>
                  </div>
                  <p className="text-purple-800 text-sm mb-4">
                    Remember your settings and preferences to provide a personalized experience.
                  </p>
                  <ul className="text-purple-700 text-sm space-y-1">
                    <li>• Language preferences</li>
                    <li>• Display settings</li>
                    <li>• Recently viewed items</li>
                    <li>• Search history</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Managing Cookies */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Managing Your Cookie Preferences</h2>
              
              {/* Cookie Settings Link */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Manage Your Cookie Settings</h3>
                    <p className="text-yellow-800 text-sm">
                      You can customize your cookie preferences at any time using our cookie settings page.
                    </p>
                  </div>
                  <a
                    href="/cookie-settings"
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                  >
                    Cookie Settings
                  </a>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Browser Settings</h3>
                <p className="text-gray-600 mb-4">
                  You can control and manage cookies through your browser settings. Here's how to do it in popular browsers:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Desktop Browsers</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• <strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                      <li>• <strong>Firefox:</strong> Preferences → Privacy & Security</li>
                      <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                      <li>• <strong>Edge:</strong> Settings → Site permissions → Cookies</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Mobile Browsers</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• <strong>Chrome Mobile:</strong> Settings → Site settings → Cookies</li>
                      <li>• <strong>Safari Mobile:</strong> Settings → Safari → Privacy</li>
                      <li>• <strong>Firefox Mobile:</strong> Settings → Data Management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact of Disabling */}
            <div className="mb-8">
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-600 mt-1 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Impact of Disabling Cookies</h3>
                    <p className="text-red-800 mb-3">
                      Disabling certain cookies may affect your experience on our website:
                    </p>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Shopping cart may not function properly</li>
                      <li>• You may need to re-enter information repeatedly</li>
                      <li>• Some features may not work as expected</li>
                      <li>• We won't be able to improve our services based on usage data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Questions About Cookies?</h3>
              <p className="text-blue-800 mb-3">
                If you have questions about our use of cookies or this policy, please contact us:
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