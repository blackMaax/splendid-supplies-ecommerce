"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { Product, CartItem, CartContextType } from "../types"

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return state.map((item) => (item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...state, { ...action.payload, quantity: 1 }]

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload)

    case "UPDATE_QUANTITY":
      return state
        .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
        .filter((item) => item.quantity > 0)

    case "CLEAR_CART":
      return []

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

// Helper functions for localStorage
const CART_STORAGE_KEY = 'splendid-supplies-cart'

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
      return []
    }
  }
  return []
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage()
    if (savedCart.length > 0) {
      dispatch({ type: "LOAD_CART", payload: savedCart })
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_TO_CART", payload: product })
  }

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } })
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getShippingCost = () => {
    const subtotal = getSubtotal()
    const FREE_SHIPPING_THRESHOLD = 50
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99
  }

  const getTotalWithShipping = () => {
    return getSubtotal() + getShippingCost()
  }

  const isEligibleForFreeShipping = () => {
    return getSubtotal() >= 50
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
        getSubtotal,
        getShippingCost,
        getTotalWithShipping,
        isEligibleForFreeShipping,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
