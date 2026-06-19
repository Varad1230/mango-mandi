import { createSupabaseServerClient } from '@/lib/supabase-server'
import AddProductForm from '@/components/admin/AddProductForm'

export default async function AdminProductsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Products</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Product list */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Grade</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">₹/kg</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Stock (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products?.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.variety}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.grade}</td>
                    <td className="px-4 py-3 text-right text-gray-800">
                      ₹{p.price_per_kg.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{p.stock_kg}</td>
                  </tr>
                ))}
                {!products?.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      No products yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add product form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 h-fit">
          <h2 className="font-semibold text-gray-900 mb-4">Add product</h2>
          <AddProductForm />
        </div>
      </div>
    </div>
  )
}
