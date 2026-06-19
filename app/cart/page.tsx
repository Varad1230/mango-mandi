'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-4">
        <p className="text-2xl">🛒</p>
        <p className="text-lg font-semibold text-amber-900">Your cart is empty</p>
        <Link
          href="/shop"
          className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
        >
          Browse mangoes
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-amber-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold text-amber-900">Your Cart</h1>

        <ul className="mt-6 flex flex-col gap-4">
          {items.map(({ product, quantity_kg }) => (
            <li
              key={product.id}
              className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm"
            >
              <span className="text-4xl">🥭</span>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-amber-900 truncate">{product.name}</p>
                <p className="text-sm text-amber-600">₹{product.price_per_kg.toLocaleString('en-IN')} / kg</p>
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center rounded-lg border border-amber-200 overflow-hidden">
                <button
                  onClick={() => updateQuantity(product.id, quantity_kg - 0.5)}
                  className="px-2.5 py-1.5 text-amber-700 hover:bg-amber-50 font-bold text-sm"
                >
                  −
                </button>
                <span className="w-14 text-center text-sm font-semibold text-amber-900">
                  {quantity_kg} kg
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantity_kg + 0.5)}
                  className="px-2.5 py-1.5 text-amber-700 hover:bg-amber-50 font-bold text-sm"
                >
                  +
                </button>
              </div>

              {/* Line total */}
              <p className="w-24 text-right font-semibold text-amber-800">
                ₹{(product.price_per_kg * quantity_kg).toLocaleString('en-IN')}
              </p>

              <button
                onClick={() => removeItem(product.id)}
                className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                aria-label="Remove"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <div className="mt-6 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-lg font-bold text-amber-900">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">Prices are per kg · delivery calculated at checkout</p>

          <Link
            href="/checkout"
            className="mt-4 block w-full rounded-xl bg-amber-500 py-3 text-center text-sm font-semibold text-white hover:bg-amber-600 active:bg-amber-700 transition-colors"
          >
            Proceed to checkout →
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-sm text-amber-600 hover:text-amber-800"
          >
            ← Continue shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
