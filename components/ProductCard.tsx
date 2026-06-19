'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

const gradeBadgeClass: Record<string, string> = {
  Premium: 'bg-amber-500 text-white',
  A: 'bg-green-600 text-white',
  B: 'bg-blue-600 text-white',
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-col rounded-2xl border border-amber-100 bg-white shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative h-48 w-full bg-amber-50 flex items-center justify-center">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-7xl select-none">🥭</span>
        )}
        <span
          className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            gradeBadgeClass[product.grade] ?? 'bg-gray-400 text-white'
          }`}
        >
          {product.grade}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h2 className="text-lg font-bold text-amber-900">{product.name}</h2>
        <p className="text-sm text-amber-600">{product.variety}</p>
        <p className="mt-1 text-xl font-semibold text-amber-800">
          ₹{product.price_per_kg.toLocaleString('en-IN')}
          <span className="text-sm font-normal text-amber-500"> / kg</span>
        </p>
        {product.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        )}
      </div>

      {/* Quantity + Add */}
      <div className="flex items-center gap-2 px-4 pb-4">
        <div className="flex items-center rounded-lg border border-amber-200 overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(0.5, q - 0.5))}
            className="px-3 py-2 text-amber-700 hover:bg-amber-50 active:bg-amber-100 font-bold"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-semibold text-amber-900">
            {qty} kg
          </span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock_kg, q + 0.5))}
            className="px-3 py-2 text-amber-700 hover:bg-amber-50 active:bg-amber-100 font-bold"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors ${
            added ? 'bg-green-500' : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
          }`}
        >
          {added ? '✓ Added' : 'Add to cart'}
        </button>
      </div>
    </div>
  )
}
