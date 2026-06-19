'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CartNav() {
  const { items, total } = useCart()
  const itemCount = items.length

  return (
    <header className="sticky top-0 z-10 border-b border-amber-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-amber-800 hover:text-amber-900">
          🥭 Mango Mandi
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/shop" className="text-sm font-medium text-amber-700 hover:text-amber-900">
            Shop
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
          >
            Cart
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-amber-600">
                {itemCount}
              </span>
            )}
            {itemCount > 0 && (
              <span className="hidden sm:inline">
                · ₹{total.toLocaleString('en-IN')}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
