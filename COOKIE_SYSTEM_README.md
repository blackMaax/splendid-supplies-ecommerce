# Cookie Management System

## Overview

This project implements a comprehensive, GDPR-compliant cookie management system for the Splendid Supplies e-commerce website. The system provides granular control over different types of cookies and respects user privacy preferences.

## Features

### 🍪 Cookie Categories
- **Essential Cookies**: Always active, required for basic functionality
- **Analytics Cookies**: Google Analytics and performance tracking (optional)
- **Preference Cookies**: User settings and personalization (optional)
- **Marketing Cookies**: Advertising and social media tracking (optional)

### 🎛️ User Controls
- **Cookie Consent Banner**: Professional, non-intrusive banner with granular controls
- **Cookie Settings Page**: Dedicated page for managing preferences
- **Quick Actions**: Accept All, Essential Only, and Custom settings
- **Persistent Storage**: Preferences saved in localStorage

### 🔒 Privacy Compliance
- **GDPR Compliant**: Granular consent with clear explanations
- **Opt-in by Default**: Only essential cookies enabled initially
- **Easy Withdrawal**: Users can change preferences anytime
- **Clear Documentation**: Comprehensive cookie policy

## File Structure

```
app/
├── components/
│   ├── CookieConsent.tsx        # Main cookie banner component
│   └── Analytics.tsx            # Google Analytics with consent
├── cookie-settings/
│   └── page.tsx                 # Dedicated settings page
├── cookies/
│   └── page.tsx                 # Cookie policy page
└── layout.tsx                   # Updated with cookie components

hooks/
└── use-cookies.ts               # Custom hook for cookie management

lib/
└── preferences.ts               # User preferences with consent checks
```

## Components

### CookieConsent Component
- **Location**: `app/components/CookieConsent.tsx`
- **Features**:
  - Professional overlay design
  - Two-stage consent (banner → detailed settings)
  - Animated toggle switches
  - Responsive design
  - Links to full cookie policy

### Cookie Settings Page
- **Location**: `app/cookie-settings/page.tsx`
- **Features**:
  - Detailed explanation of each cookie type
  - Visual toggle controls
  - Quick action buttons
  - Save notifications
  - Links to cookie policy

### Analytics Component
- **Location**: `app/components/Analytics.tsx`
- **Features**:
  - Conditional Google Analytics loading
  - Consent-aware event tracking
  - Page view tracking utilities
  - Proper consent API integration

## Hooks and Utilities

### useCookies Hook
```typescript
const {
  cookiePreferences,    // Current user preferences
  hasConsent,          // Whether user has made a choice
  canUseAnalytics,     // Check analytics consent
  canUsePreferences,   // Check preferences consent
  canUseMarketing,     // Check marketing consent
  setCookie,           // Set cookie with consent check
  getCookie,           // Get cookie value
  updatePreferences,   // Update user preferences
  resetPreferences     // Reset all preferences
} = useCookies()
```

### Preference Management
```typescript
import { 
  addToRecentlyViewed,
  getUserPreferences,
  setDisplayMode,
  checkCookieConsent 
} from '../lib/preferences'

// Only works if user consented to preference cookies
addToRecentlyViewed('product-123')
setDisplayMode('grid')
```

## Implementation Details

### Cookie Types and Storage

#### Essential Cookies
- **Name**: `essential_enabled`
- **Purpose**: Core functionality
- **Consent**: Always granted
- **Examples**: Shopping cart, user sessions, security

#### Analytics Cookies
- **Name**: `analytics_enabled`
- **Purpose**: Website analytics
- **Consent**: User choice
- **Integration**: Google Analytics with consent API

#### Preference Cookies
- **Name**: `preferences_enabled`
- **Purpose**: User customization
- **Consent**: User choice
- **Storage**: localStorage for user preferences

#### Marketing Cookies
- **Name**: `marketing_enabled`
- **Purpose**: Advertising and social media
- **Consent**: User choice
- **Integration**: Ready for ad platforms

### Consent Storage
- **Key**: `cookie-consent`
- **Location**: localStorage
- **Format**: JSON object with boolean flags
- **Expiry**: Persistent until user changes

### Google Analytics Integration
```typescript
// Only loads if user consents
if (canUseAnalytics()) {
  gtag('consent', 'update', {
    analytics_storage: 'granted'
  })
}

// Event tracking with consent check
trackEvent('purchase', 'ecommerce', 'product-123', 99.99)
```

## Usage Examples

### Basic Cookie Check
```typescript
import { checkCookieConsent } from '../hooks/use-cookies'

if (checkCookieConsent('analytics')) {
  // Track user behavior
  gtag('event', 'page_view')
}
```

### Setting Cookies Safely
```typescript
import { useCookies } from '../hooks/use-cookies'

const { setCookie } = useCookies()

// This will only set if user consented to preferences
setCookie('user_theme', 'dark', 'preferences')
```

### User Preferences
```typescript
import { addToRecentlyViewed } from '../lib/preferences'

// Only saves if preference cookies are enabled
const success = addToRecentlyViewed('product-456')
if (!success) {
  console.log('User has not consented to preference cookies')
}
```

## GDPR Compliance Features

### Legal Requirements Met
- ✅ **Informed Consent**: Clear explanation of each cookie type
- ✅ **Granular Control**: Individual consent for each category
- ✅ **Easy Withdrawal**: Settings page accessible anytime
- ✅ **No Pre-ticked Boxes**: Opt-in required for non-essential
- ✅ **Clear Language**: Plain English explanations
- ✅ **Documented Policy**: Comprehensive cookie policy page

### User Rights Supported
- **Right to Information**: Detailed cookie policy
- **Right to Consent**: Granular consent controls
- **Right to Withdraw**: Easy preference changes
- **Right to Object**: Can disable non-essential cookies

## Browser Compatibility
- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Mobile Browsers**: Responsive design works on all devices
- **JavaScript Disabled**: Graceful degradation
- **LocalStorage**: Fallback handling for unsupported browsers

## Setup Instructions

### 1. Install Dependencies
```bash
npm install lucide-react
```

### 2. Add Components to Layout
```typescript
// app/layout.tsx
import CookieConsent from './components/CookieConsent'
import Analytics from './components/Analytics'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}
```

### 3. Configure Google Analytics
```typescript
// app/components/Analytics.tsx
const GA_MEASUREMENT_ID = 'G-YOUR-GA-ID'
```

### 4. Test Implementation
1. Visit the site - cookie banner should appear
2. Test different consent combinations
3. Verify analytics only loads with consent
4. Check preference storage works correctly
5. Test settings page functionality

## Customization

### Styling
The system uses Tailwind CSS classes. Key customization points:
- Banner colors: `bg-blue-600`, `border-blue-500`
- Toggle switches: `bg-blue-600` when active
- Category colors: Green (essential), Blue (analytics), Purple (preferences), Orange (marketing)

### Cookie Categories
To add new cookie categories:
1. Update `CookiePreferences` interface
2. Add new toggle in consent banner
3. Update settings page
4. Add consent check functions

### Analytics Providers
To integrate other analytics providers:
1. Update `Analytics.tsx` component
2. Add provider-specific consent handling
3. Update consent API calls

## Troubleshooting

### Common Issues
1. **Banner not showing**: Check localStorage for existing consent
2. **Analytics not loading**: Verify consent is granted and GA ID is correct
3. **Preferences not saving**: Check preference cookie consent
4. **Mobile display issues**: Test responsive breakpoints

### Debug Mode
Add to localStorage for debugging:
```javascript
localStorage.setItem('cookie-debug', 'true')
```

## Legal Considerations

### GDPR Compliance
- This system provides technical implementation
- Legal review recommended for full compliance
- Consider data processing agreements
- Update privacy policy to reflect cookie usage

### Cookie Policy Updates
- Review policy annually
- Update when adding new cookie types
- Notify users of significant changes
- Keep records of consent

## Performance Impact

### Bundle Size
- Cookie system adds ~15KB to bundle
- Analytics loads conditionally
- No impact on essential functionality

### Runtime Performance
- Minimal performance impact
- localStorage operations are fast
- No blocking operations
- Progressive enhancement approach

## Future Enhancements

### Planned Features
- [ ] Cookie expiry management
- [ ] Consent renewal prompts
- [ ] Advanced analytics integration
- [ ] A/B testing framework
- [ ] Consent API v2 support

### Integration Opportunities
- [ ] Marketing automation platforms
- [ ] Social media pixels
- [ ] Chat widgets
- [ ] Third-party analytics
- [ ] Advertising networks

---

## Support

For questions about the cookie system implementation:
- Check the component documentation
- Review the cookie policy page
- Test in the cookie settings page
- Verify consent handling in browser dev tools

This system provides a solid foundation for GDPR-compliant cookie management while maintaining excellent user experience and performance. 