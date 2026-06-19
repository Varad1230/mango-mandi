import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Json } from '@/types/database.types'

function itemCount(items: Json): number {
  if (!Array.isArray(items)) return 0
  return items.length
}

export default async function AdminOrdersPage() {
  const supabase = await createSupabaseServerClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Order ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Phone</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">City</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">Items</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Total</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders?.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">
                  {o.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{o.customer_name}</td>
                <td className="px-4 py-3 text-gray-600">{o.phone}</td>
                <td className="px-4 py-3 text-gray-600">{o.city}</td>
                <td className="px-4 py-3 text-center text-gray-600">{itemCount(o.items)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">
                  ₹{o.total.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(o.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
            {!orders?.length && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
