import { checkCookieConsent } from '../hooks/use-cookies'

// Types for user preferences
export interface UserPreferences {
  recentlyViewed: string[]
  favoriteCategories: string[]
  preferredLanguage: string
  displayMode: 'grid' | 'list'
  currency: string
}

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  recentlyViewed: [],
  favoriteCategories: [],
  preferredLanguage: 'en',
  displayMode: 'grid',
  currency: 'GBP'
}

// Get user preferences from localStorage (only if consent given)
export const getUserPreferences = (): UserPreferences | null => {
  if (typeof window === 'undefined') return null
  
  // Check if user has consented to preference cookies
  if (!checkCookieConsent('preferences')) {
    return null
  }

  try {
    const stored = localStorage.getItem('user-preferences')
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error('Error loading user preferences:', error)
  }
  
  return DEFAULT_PREFERENCES
}

// Save user preferences (only if consent given)
export const saveUserPreferences = (preferences: Partial<UserPreferences>): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check if user has consented to preference cookies
  if (!checkCookieConsent('preferences')) {
    console.warn('Cannot save preferences - user has not consented to preference cookies')
    return false
  }

  try {
    const current = getUserPreferences() || DEFAULT_PREFERENCES
    const updated = { ...current, ...preferences }
    localStorage.setItem('user-preferences', JSON.stringify(updated))
    return true
  } catch (error) {
    console.error('Error saving user preferences:', error)
    return false
  }
}

// Add product to recently viewed list
export const addToRecentlyViewed = (productId: string): boolean => {
  const preferences = getUserPreferences()
  if (!preferences) return false

  const recentlyViewed = preferences.recentlyViewed.filter(id => id !== productId)
  recentlyViewed.unshift(productId)
  
  // Keep only the last 10 items
  if (recentlyViewed.length > 10) {
    recentlyViewed.splice(10)
  }

  return saveUserPreferences({ recentlyViewed })
}

// Get recently viewed products
export const getRecentlyViewed = (): string[] => {
  const preferences = getUserPreferences()
  return preferences?.recentlyViewed || []
}

// Add category to favorites
export const addFavoriteCategory = (category: string): boolean => {
  const preferences = getUserPreferences()
  if (!preferences) return false

  const favoriteCategories = [...preferences.favoriteCategories]
  if (!favoriteCategories.includes(category)) {
    favoriteCategories.push(category)
    return saveUserPreferences({ favoriteCategories })
  }
  
  return true
}

// Remove category from favorites
export const removeFavoriteCategory = (category: string): boolean => {
  const preferences = getUserPreferences()
  if (!preferences) return false

  const favoriteCategories = preferences.favoriteCategories.filter(cat => cat !== category)
  return saveUserPreferences({ favoriteCategories })
}

// Get favorite categories
export const getFavoriteCategories = (): string[] => {
  const preferences = getUserPreferences()
  return preferences?.favoriteCategories || []
}

// Set display mode
export const setDisplayMode = (mode: 'grid' | 'list'): boolean => {
  return saveUserPreferences({ displayMode: mode })
}

// Get display mode
export const getDisplayMode = (): 'grid' | 'list' => {
  const preferences = getUserPreferences()
  return preferences?.displayMode || 'grid'
}

// Set preferred language
export const setPreferredLanguage = (language: string): boolean => {
  return saveUserPreferences({ preferredLanguage: language })
}

// Get preferred language
export const getPreferredLanguage = (): string => {
  const preferences = getUserPreferences()
  return preferences?.preferredLanguage || 'en'
}

// Clear all preferences (for privacy compliance)
export const clearAllPreferences = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user-preferences')
  }
}

// Hook for React components
export const useUserPreferences = () => {
  const preferences = getUserPreferences()
  
  return {
    preferences,
    addToRecentlyViewed,
    getRecentlyViewed,
    addFavoriteCategory,
    removeFavoriteCategory,
    getFavoriteCategories,
    setDisplayMode,
    getDisplayMode,
    setPreferredLanguage,
    getPreferredLanguage,
    savePreferences: saveUserPreferences,
    clearPreferences: clearAllPreferences,
    hasPreferenceConsent: checkCookieConsent('preferences')
  }
} 