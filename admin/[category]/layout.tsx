import type { CategoryKey } from '@/lib/admin-config'
import { categories } from '@/lib/admin-config'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { category: string }
}) {
  // 使用 await 获取解析后的参数
  const resolvedParams = await params
  // 自动解码路由参数（Next.js 15+ 自动处理）
  const rawCategory = resolvedParams.category.toLowerCase()
  const category = decodeURIComponent(rawCategory) as CategoryKey

  // 分类有效性验证（带类型保护）
  const isValidCategory = (value: string): value is CategoryKey => {
    return Object.keys(categories).includes(value)
  }

  if (!isValidCategory(category)) {
    return (
      <div className="p-8 bg-red-50 border-2 border-red-200 rounded-lg">
        <h2 className="text-red-600 font-medium">无效的分类: {category}</h2>
        <p className="mt-2 text-red-500">可用分类: {Object.keys(categories).join(', ')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
     
      
      {/* 子内容 */}
      <section className="space-y-4">
        {children}
      </section>
    </div>
  )
}