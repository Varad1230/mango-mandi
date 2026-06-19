'use client'

import { createContext, useContext, useState } from 'react'
import type { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

export type CartItem = {
  product: Product
  quantity_kg: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product, quantity_kg: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity_kg: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(product: Product, quantity_kg: number) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity_kg: i.quantity_kg + quantity_kg }
            : i
        )
      }
      return [...prev, { product, quantity_kg }]
    })
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  function updateQuantity(productId: string, quantity_kg: number) {
    if (quantity_kg <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity_kg } : i))
    )
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce(
    (sum, i) => sum + i.product.price_per_kg * i.quantity_kg,
    0
  )

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
