"use client"

import { useState, useEffect } from 'react'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  preferences: boolean
  marketing: boolean
}

export function useCookies() {
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences | null>(null)
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Load cookie preferences from localStorage
    const loadPreferences = () => {
      try {
        const consent = localStorage.getItem('cookie-consent')
        if (consent) {
          const preferences = JSON.parse(consent)
          setCookiePreferences(preferences)
          setHasConsent(true)
        } else {
          setHasConsent(false)
        }
      } catch (error) {
        console.error('Error loading cookie preferences:', error)
        setHasConsent(false)
      }
    }

    loadPreferences()

    // Listen for changes to localStorage (when user updates preferences)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie-consent') {
        loadPreferences()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Helper functions to check specific cookie types
  const canUseAnalytics = () => {
    return cookiePreferences?.analytics === true
  }

  const canUsePreferences = () => {
    return cookiePreferences?.preferences === true
  }

  const canUseMarketing = () => {
    return cookiePreferences?.marketing === true
  }

  // Helper to get a cookie value
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null
    
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  }

  // Helper to set a cookie (respects consent)
  const setCookie = (
    name: string, 
    value: string, 
    type: 'essential' | 'analytics' | 'preferences' | 'marketing' = 'essential',
    options: {
      maxAge?: number
      path?: string
      secure?: boolean
      sameSite?: 'Strict' | 'Lax' | 'None'
    } = {}
  ) => {
    // Always allow essential cookies
    if (type === 'essential') {
      const {
        maxAge = 31536000, // 1 year default
        path = '/',
        secure = true,
        sameSite = 'Lax'
      } = options

      document.cookie = `${name}=${value}; max-age=${maxAge}; path=${path}; ${secure ? 'secure;' : ''} SameSite=${sameSite}`
      return true
    }

    // Check consent for non-essential cookies
    const canSet = 
      (type === 'analytics' && canUseAnalytics()) ||
      (type === 'preferences' && canUsePreferences()) ||
      (type === 'marketing' && canUseMarketing())

    if (canSet) {
      const {
        maxAge = 31536000, // 1 year default
        path = '/',
        secure = true,
        sameSite = 'Lax'
      } = options

      document.cookie = `${name}=${value}; max-age=${maxAge}; path=${path}; ${secure ? 'secure;' : ''} SameSite=${sameSite}`
      return true
    }

    console.warn(`Cookie "${name}" not set - user has not consented to ${type} cookies`)
    return false
  }

  // Helper to remove a cookie
  const removeCookie = (name: string, path: string = '/') => {
    document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }

  // Update preferences (for settings page)
  const updatePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setCookiePreferences(newPreferences)
    setHasConsent(true)

    // Apply the preferences immediately
    applyPreferences(newPreferences)
  }

  // Apply cookie preferences (enable/disable tracking)
  const applyPreferences = (prefs: CookiePreferences) => {
    // Analytics cookies
    if (prefs.analytics) {
      // Enable analytics tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        })
      }
      setCookie('analytics_enabled', 'true', 'analytics')
    } else {
      // Disable analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied'
        })
      }
      removeCookie('analytics_enabled')
    }

    // Preferences cookies
    if (prefs.preferences) {
      setCookie('preferences_enabled', 'true', 'preferences')
    } else {
      removeCookie('preferences_enabled')
    }

    // Marketing cookies
    if (prefs.marketing) {
      setCookie('marketing_enabled', 'true', 'marketing')
    } else {
      removeCookie('marketing_enabled')
    }

    // Always enable essential cookies
    setCookie('essential_enabled', 'true', 'essential')
  }

  // Reset all preferences (for testing/admin)
  const resetPreferences = () => {
    localStorage.removeItem('cookie-consent')
    localStorage.removeItem('cookie-consent-date')
    setCookiePreferences(null)
    setHasConsent(false)
    
    // Remove all non-essential cookies
    removeCookie('analytics_enabled')
    removeCookie('preferences_enabled')
    removeCookie('marketing_enabled')
  }

  return {
    // State
    cookiePreferences,
    hasConsent,
    
    // Consent checkers
    canUseAnalytics,
    canUsePreferences,
    canUseMarketing,
    
    // Cookie management
    getCookie,
    setCookie,
    removeCookie,
    
    // Preference management
    updatePreferences,
    resetPreferences
  }
}

// Utility function to check if we can use a specific cookie type (for use outside components)
export const checkCookieConsent = (type: 'analytics' | 'preferences' | 'marketing'): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) return false
    
    const preferences = JSON.parse(consent)
    return preferences[type] === true
  } catch {
    return false
  }
}

// Utility to get cookie consent status
export const getCookieConsentStatus = (): CookiePreferences | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const consent = localStorage.getItem('cookie-consent')
    return consent ? JSON.parse(consent) : null
  } catch {
    return null
  }
} 