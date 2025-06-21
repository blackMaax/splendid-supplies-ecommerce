"use client"

import { useState, useEffect } from 'react'
import { Cookie, Shield, BarChart3, Palette, Save, RotateCcw, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useCookies } from '../../hooks/use-cookies'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  preferences: boolean
  marketing: boolean
}

export default function CookieSettingsPage() {
  const { cookiePreferences, hasConsent, updatePreferences, resetPreferences } = useCookies()
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    preferences: false,
    marketing: false
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const [showAcceptAllNotification, setShowAcceptAllNotification] = useState(false)
  const [showRejectAllNotification, setShowRejectAllNotification] = useState(false)
  const [showResetNotification, setShowResetNotification] = useState(false)
  const [toggleFeedback, setToggleFeedback] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    if (cookiePreferences) {
      setLocalPreferences(cookiePreferences)
    }
  }, [cookiePreferences])

  useEffect(() => {
    if (cookiePreferences) {
      const hasChanged = 
        localPreferences.analytics !== cookiePreferences.analytics ||
        localPreferences.preferences !== cookiePreferences.preferences ||
        localPreferences.marketing !== cookiePreferences.marketing
      setHasChanges(hasChanged)
    }
  }, [localPreferences, cookiePreferences])

  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === 'essential') return // Essential cookies cannot be disabled
    
    setLocalPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))

    // Show toggle feedback
    setToggleFeedback(prev => ({ ...prev, [type]: true }))
    setTimeout(() => {
      setToggleFeedback(prev => ({ ...prev, [type]: false }))
    }, 1000)
  }

  const savePreferences = () => {
    updatePreferences(localPreferences)
    setHasChanges(false)
    setShowSaveNotification(true)
    setTimeout(() => setShowSaveNotification(false), 3000)
  }

  const resetToDefaults = () => {
    const defaults = {
      essential: true,
      analytics: false,
      preferences: false,
      marketing: false
    }
    setLocalPreferences(defaults)
    setShowResetNotification(true)
    setTimeout(() => setShowResetNotification(false), 3000)
  }

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      preferences: true,
      marketing: true
    }
    setLocalPreferences(allAccepted)
    setShowAcceptAllNotification(true)
    setTimeout(() => setShowAcceptAllNotification(false), 3000)
  }

  const rejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      preferences: false,
      marketing: false
    }
    setLocalPreferences(essentialOnly)
    setShowRejectAllNotification(true)
    setTimeout(() => setShowRejectAllNotification(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Cookie className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Cookie Settings</h1>
              <p className="text-gray-600">Manage your cookie preferences and privacy settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Status Banners */}
          {showSaveNotification && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3 animate-in fade-in duration-300">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Your cookie preferences have been saved successfully!</span>
            </div>
          )}
          
          {showAcceptAllNotification && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-3 animate-in fade-in duration-300">
              <Check className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">All cookies have been accepted! Don't forget to save your preferences.</span>
            </div>
          )}
          
          {showRejectAllNotification && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center space-x-3 animate-in fade-in duration-300">
              <X className="w-5 h-5 text-orange-600" />
              <span className="text-orange-800 font-medium">Only essential cookies are now enabled. Don't forget to save your preferences.</span>
            </div>
          )}
          
          {showResetNotification && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center space-x-3 animate-in fade-in duration-300">
              <RotateCcw className="w-5 h-5 text-purple-600" />
              <span className="text-purple-800 font-medium">Settings have been reset to defaults. Don't forget to save your preferences.</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={acceptAll}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Accept All Cookies
              </button>
              <button
                onClick={rejectAll}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Essential Only
              </button>
              <button
                onClick={resetToDefaults}
                className="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          </div>

          {/* Cookie Categories */}
          <div className="space-y-6">
            {/* Essential Cookies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 bg-green-50 border-b border-green-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-green-900">Essential Cookies</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-700 font-medium">Always Active</span>
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-green-800">
                      These cookies are necessary for the website to function properly and cannot be disabled. 
                      They are usually set in response to actions you take, such as setting privacy preferences, 
                      logging in, or filling in forms.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-800 mb-3">What we use essential cookies for:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Shopping cart functionality</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>User authentication and security</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Form submission and validation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Load balancing and performance</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Analytics Cookies</h3>
                      <button
                        onClick={() => handlePreferenceChange('analytics')}
                        className={`w-14 h-7 rounded-full transition-all duration-300 relative ${
                          localPreferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                        } ${toggleFeedback.analytics ? 'ring-4 ring-blue-200 scale-105' : ''}`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${
                          localPreferences.analytics ? 'translate-x-7' : 'translate-x-0.5'
                        } ${toggleFeedback.analytics ? 'scale-110' : ''}`} />
                      </button>
                    </div>
                    <p className="text-gray-600">
                      These cookies help us understand how visitors interact with our website by collecting 
                      and reporting information anonymously. This helps us improve our website performance 
                      and user experience.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-800 mb-3">What we use analytics cookies for:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Understanding which pages are most popular</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Tracking website performance and loading times</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Identifying technical issues and errors</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Anonymous usage statistics and trends</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Preferences Cookies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Preference Cookies</h3>
                      <button
                        onClick={() => handlePreferenceChange('preferences')}
                        className={`w-14 h-7 rounded-full transition-all duration-300 relative ${
                          localPreferences.preferences ? 'bg-blue-600' : 'bg-gray-300'
                        } ${toggleFeedback.preferences ? 'ring-4 ring-purple-200 scale-105' : ''}`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${
                          localPreferences.preferences ? 'translate-x-7' : 'translate-x-0.5'
                        } ${toggleFeedback.preferences ? 'scale-110' : ''}`} />
                      </button>
                    </div>
                    <p className="text-gray-600">
                      These cookies remember your preferences and settings to provide a more personalized 
                      experience when you return to our website.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-800 mb-3">What we use preference cookies for:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Remembering your language preferences</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Saving your recently viewed products</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Customizing your browsing experience</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Storing your display preferences</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <Cookie className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Marketing Cookies</h3>
                      <button
                        onClick={() => handlePreferenceChange('marketing')}
                        className={`w-14 h-7 rounded-full transition-all duration-300 relative ${
                          localPreferences.marketing ? 'bg-blue-600' : 'bg-gray-300'
                        } ${toggleFeedback.marketing ? 'ring-4 ring-orange-200 scale-105' : ''}`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${
                          localPreferences.marketing ? 'translate-x-7' : 'translate-x-0.5'
                        } ${toggleFeedback.marketing ? 'scale-110' : ''}`} />
                      </button>
                    </div>
                    <p className="text-gray-600">
                      These cookies are used to track visitors across websites to display relevant 
                      advertisements and measure the effectiveness of marketing campaigns.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-800 mb-3">What we use marketing cookies for:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span>Showing relevant advertisements on other websites</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span>Measuring advertising campaign effectiveness</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span>Retargeting visitors with personalized ads</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span>Social media integration and sharing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">You have unsaved changes</h3>
                  <p className="text-gray-600 text-sm">Save your preferences to apply the new settings.</p>
                </div>
                <button
                  onClick={savePreferences}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Additional Information</h3>
            <div className="text-blue-800 text-sm space-y-2">
              <p>
                • You can change your cookie preferences at any time by returning to this page.
              </p>
              <p>
                • Some features of our website may not function properly if you disable certain cookies.
              </p>
              <p>
                • Your preferences are stored locally and will persist across browser sessions.
              </p>
              <p>
                • For more information about how we use cookies, please read our{' '}
                <Link href="/cookies" className="underline hover:no-underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-blue-600 hover:underline font-medium"
            >
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 