"use client"

import { useEffect } from 'react'
import Script from 'next/script'
import { useCookies } from '../../hooks/use-cookies'

// Replace with your actual Google Analytics ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'

export default function Analytics() {
  const { canUseAnalytics, hasConsent } = useCookies()

  useEffect(() => {
    if (hasConsent && canUseAnalytics()) {
      // Initialize Google Analytics with consent
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        })
        
        (window as any).gtag('config', GA_MEASUREMENT_ID, {
          page_title: document.title,
          page_location: window.location.href,
        })
      }
    } else if (hasConsent) {
      // User has made a choice but denied analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied'
        })
      }
    }
  }, [hasConsent, canUseAnalytics])

  // Only render scripts if user consents to analytics
  if (!hasConsent || !canUseAnalytics()) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          // Set default consent state
          gtag('consent', 'default', {
            analytics_storage: 'granted'
          });
          
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}

// Utility function to track events (only if analytics consent is given)
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    // Check if analytics are enabled
    const analyticsEnabled = document.cookie.includes('analytics_enabled=true')
    
    if (analyticsEnabled) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }
}

// Utility function to track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    // Check if analytics are enabled
    const analyticsEnabled = document.cookie.includes('analytics_enabled=true')
    
    if (analyticsEnabled) {
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
        page_title: title || document.title,
      })
    }
  }
} 