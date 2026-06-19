import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import LogoutButton from '@/components/admin/LogoutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  // No session → render children bare (the login page handles its own layout)
  if (!session) return <>{children}</>

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="text-lg font-bold text-amber-700">🥭 Mango Mandi</Link>
          <p className="text-xs text-gray-400 mt-0.5">Admin</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <Link
            href="/admin/products"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
          >
            Orders
          </Link>
        </nav>
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 truncate mb-2">{session.user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
