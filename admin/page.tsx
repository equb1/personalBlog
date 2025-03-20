// app/admin/page.tsx
import Link from 'next/link'
import AdminLayout from './layout'

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">欢迎来到管理后台</h1>
        <div className="grid grid-cols-2 gap-6">
          <Link
            href="/admin/posts"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">📝 文章管理</h2>
            <p className="text-gray-600">管理博客文章内容</p>
          </Link>
          
          <Link
            href="/admin/media"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">🎥 媒体管理</h2>
            <p className="text-gray-600">管理图片、视频等媒体资源</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
