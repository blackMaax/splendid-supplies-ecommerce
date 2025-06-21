"use client"

import { useState, useEffect } from 'react'
import { Cookie, X, Settings, Check, Shield, BarChart3, Palette } from 'lucide-react'
import Link from 'next/link'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  preferences: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    preferences: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(cookieConsent)
        setPreferences(savedPreferences)
        // Apply preferences
        applyCookiePreferences(savedPreferences)
      } catch (error) {
        console.error('Error parsing cookie preferences:', error)
        setShowBanner(true)
      }
    }
  }, [])

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Analytics cookies (Google Analytics, etc.)
    if (prefs.analytics) {
      // Enable analytics tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        })
      }
      // Set analytics cookie
      document.cookie = "analytics_enabled=true; path=/; max-age=31536000; SameSite=Lax"
    } else {
      // Disable analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied'
        })
      }
      // Remove analytics cookie
      document.cookie = "analytics_enabled=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }

    // Preferences cookies
    if (prefs.preferences) {
      document.cookie = "preferences_enabled=true; path=/; max-age=31536000; SameSite=Lax"
    } else {
      document.cookie = "preferences_enabled=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }

    // Marketing cookies
    if (prefs.marketing) {
      document.cookie = "marketing_enabled=true; path=/; max-age=31536000; SameSite=Lax"
    } else {
      document.cookie = "marketing_enabled=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }

    // Always set essential cookies (these are necessary for the site to function)
    document.cookie = "essential_enabled=true; path=/; max-age=31536000; SameSite=Lax"
  }

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    applyCookiePreferences(prefs)
    setPreferences(prefs)
    setShowBanner(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      preferences: true,
      marketing: true
    }
    savePreferences(allAccepted)
  }

  const acceptEssentialOnly = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      preferences: false,
      marketing: false
    }
    savePreferences(essentialOnly)
  }

  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === 'essential') return // Essential cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const saveCustomPreferences = () => {
    savePreferences(preferences)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-blue-500 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          {!showSettings ? (
            /* Main Banner */
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    We use cookies to improve your experience
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    We use cookies to enhance your browsing experience, analyze site traffic, and provide 
                    personalized content. You can choose which cookies to accept or reject them all.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={acceptAll}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Accept All
                    </button>
                    
                    <button
                      onClick={acceptEssentialOnly}
                      className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Essential Only
                    </button>
                    
                    <button
                      onClick={() => setShowSettings(true)}
                      className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Customize</span>
                    </button>
                    
                    <Link
                      href="/cookies"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Learn more about cookies
                    </Link>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowBanner(false)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            /* Settings Panel */
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Cookie Preferences</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-shrink-0 mt-1">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-900">Essential Cookies</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-700">Always Active</span>
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-green-800 text-sm">
                      These cookies are necessary for the website to function and cannot be disabled. 
                      They include shopping cart, user sessions, and security features.
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex-shrink-0 mt-1">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">Analytics Cookies</h4>
                      <button
                        onClick={() => handlePreferenceChange('analytics')}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Help us understand how visitors interact with our website to improve performance 
                      and user experience. Data is anonymized and used for statistical purposes only.
                    </p>
                  </div>
                </div>

                {/* Preferences Cookies */}
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex-shrink-0 mt-1">
                    <Palette className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">Preference Cookies</h4>
                      <button
                        onClick={() => handlePreferenceChange('preferences')}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          preferences.preferences ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          preferences.preferences ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Remember your settings and preferences to provide a personalized experience, 
                      such as language preferences and recently viewed items.
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex-shrink-0 mt-1">
                    <Cookie className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">Marketing Cookies</h4>
                      <button
                        onClick={() => handlePreferenceChange('marketing')}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          preferences.marketing ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Used to track visitors across websites to display relevant advertisements 
                      and measure the effectiveness of marketing campaigns.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <Link
                  href="/cookies"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View our full Cookie Policy
                </Link>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCustomPreferences}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 