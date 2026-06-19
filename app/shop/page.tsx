import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

export default async function ShopPage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('grade', { ascending: true })
    .order('price_per_kg', { ascending: true })

  if (error) {
    return (
      <main className="min-h-screen bg-amber-50 px-4 py-12 text-center">
        <p className="text-red-500">Failed to load products. Please try again.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-amber-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-amber-900">Our Mangoes</h1>
        <p className="mt-1 text-amber-600">
          Farm-fresh, direct from our orchard — harvested to order.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  )
}
