// app/admin/layout.tsx
import Link from 'next/link'

type AdminLayoutProps = {
  children: React.ReactNode
  params?: {
    category: string
  }
}

export default function AdminLayout({ children, params }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-6">
          <Link
            href="/admin/posts"
            className={`px-3 py-2 rounded ${
              params?.category === 'posts' 
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100'
            }`}
          >
            文章管理
          </Link>
          <Link
            href="/admin/media"
            className={`px-3 py-2 rounded ${
              params?.category === 'media' 
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100'
            }`}
          >
            媒体管理
          </Link>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}