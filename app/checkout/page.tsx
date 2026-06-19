'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'

type Step = 'form' | 'processing' | 'success'

interface OrderForm {
  customer_name: string
  phone: string
  city: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState<OrderForm>({ customer_name: '', phone: '', city: '' })
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [snapshot, setSnapshot] = useState<{ name: string; quantity_kg: number; price_per_kg: number }[]>([])

  if (items.length === 0 && step === 'form') {
    return (
      <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-4">
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStep('processing')

    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 2200))

    const id = crypto.randomUUID()
    const { error: dbError } = await supabase
      .from('orders')
      .insert({
        id,
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        items: items.map((i) => ({
          product_id: i.product.id,
          name: i.product.name,
          variety: i.product.variety,
          quantity_kg: i.quantity_kg,
          price_per_kg: i.product.price_per_kg,
        })),
        total,
        status: 'demo_order',
      })

    if (dbError) {
      setStep('form')
      setError('Something went wrong saving your order. Please try again.')
      return
    }

    setOrderId(id)
    setSnapshot(items.map((i) => ({ name: i.product.name, quantity_kg: i.quantity_kg, price_per_kg: i.product.price_per_kg })))
    clearCart()
    setStep('success')
  }

  // ── Processing screen ────────────────────────────────────────────────────
  if (step === 'processing') {
    return (
      <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-6">
        <div className="h-14 w-14 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
        <div className="text-center">
          <p className="text-lg font-semibold text-amber-900">Processing mock payment…</p>
          <p className="mt-1 text-sm text-amber-500">Please wait, do not refresh</p>
        </div>
      </main>
    )
  }

  // ── Success screen ───────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-amber-100 bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-amber-900">Order confirmed!</h1>
          <p className="mt-2 text-sm text-gray-500">
            This is a demo order — no real payment was charged.
          </p>

          <div className="mt-6 rounded-xl bg-amber-50 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-500 mb-3">
              Order summary
            </p>
            <ul className="flex flex-col gap-1.5">
              {snapshot.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name} <span className="text-gray-400">× {item.quantity_kg} kg</span>
                  </span>
                  <span className="font-medium text-amber-800">
                    ₹{(item.price_per_kg * item.quantity_kg).toLocaleString('en-IN')}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-amber-100 pt-3 flex justify-between text-sm font-bold text-amber-900">
              <span>Total</span>
              <span>₹{snapshot.reduce((s, i) => s + i.price_per_kg * i.quantity_kg, 0).toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-gray-400 mt-3 break-all">
              Order ID: {orderId?.slice(0, 8)}…
            </p>
          </div>

          <Link
            href="/shop"
            className="mt-6 block rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            Back to shop
          </Link>
        </div>
      </main>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-amber-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold text-amber-900">Checkout</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-4">
            <h2 className="font-semibold text-amber-800">Delivery details</h2>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
            )}

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Full name</span>
              <input
                type="text"
                required
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="Varad Dhavan"
                className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Phone number</span>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">City</span>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Mumbai"
                className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </label>

            <button
              type="submit"
              className="mt-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white hover:bg-amber-600 active:bg-amber-700 transition-colors"
            >
              Place order · ₹{total.toLocaleString('en-IN')}
            </button>

            <p className="text-center text-xs text-gray-400">
              🔒 Demo only — no real payment will be charged
            </p>
          </form>

          {/* Order summary sidebar */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-amber-800 mb-3">Your order</h2>
              <ul className="flex flex-col gap-2">
                {items.map(({ product, quantity_kg }) => (
                  <li key={product.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {product.name}{' '}
                      <span className="text-gray-400">× {quantity_kg} kg</span>
                    </span>
                    <span className="font-medium text-amber-800">
                      ₹{(product.price_per_kg * quantity_kg).toLocaleString('en-IN')}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-amber-100 pt-3 flex justify-between font-bold text-amber-900">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
