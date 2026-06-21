'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

const GRADES = ['Premium', 'A', 'B', 'Unripe']

export default function AddProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    name: '', variety: '', grade: 'A',
    price_per_kg: '', stock_kg: '', description: '',
  })

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createSupabaseBrowserClient()
    let image_url: string | null = null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, imageFile, { contentType: imageFile.type })

      if (uploadError) {
        setError('Image upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }

      image_url = supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
    }

    const { error: insertError } = await supabase.from('products').insert({
      name: form.name.trim(),
      variety: form.variety.trim(),
      grade: form.grade,
      price_per_kg: parseFloat(form.price_per_kg),
      stock_kg: parseFloat(form.stock_kg),
      description: form.description.trim() || null,
      image_url,
    })

    if (insertError) {
      setError('Failed to save product: ' + insertError.message)
      setLoading(false)
      return
    }

    setForm({ name: '', variety: '', grade: 'A', price_per_kg: '', stock_kg: '', description: '' })
    setImageFile(null)
    setLoading(false)
    router.refresh()
  }

  const inputClass =
    'rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 w-full'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Name *</span>
          <input required value={form.name} onChange={field('name')} placeholder="Alphonso" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Variety *</span>
          <input required value={form.variety} onChange={field('variety')} placeholder="Alphonso" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Price / kg (₹) *</span>
          <input required type="number" min="1" step="0.01" value={form.price_per_kg} onChange={field('price_per_kg')} placeholder="899" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Stock (kg) *</span>
          <input required type="number" min="0" step="0.5" value={form.stock_kg} onChange={field('stock_kg')} placeholder="50" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Grade *</span>
          <select required value={form.grade} onChange={field('grade')} className={inputClass}>
            {GRADES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-sm text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-amber-700 hover:file:bg-amber-100"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-600">Description</span>
        <textarea value={form.description} onChange={field('description')} rows={2} placeholder="Optional" className={inputClass} />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Saving…' : 'Add product'}
      </button>
    </form>
  )
}
