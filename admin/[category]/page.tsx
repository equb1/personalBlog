import { categories } from "@/lib/admin-config"
import AdminLayout from "../layout"
import { DataTable } from "@/components/DataTable"
import { generateColumns } from "@/lib/generateColumns"

// app/admin/[category]/page.tsx
export default async function AdminPage({
  params
}: {
  params: { category: string }
}) {
  // 异步解码参数
  const decodedCategory = decodeURIComponent(params.category).toLowerCase() as CategoryKey

  // 分类有效性验证
  if (!Object.keys(categories).includes(decodedCategory)) {
    return (
      <AdminLayout params={{ category: decodedCategory }}>
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          无效分类：{decodedCategory}
        </div>
      </AdminLayout>
    )
  }

  // 使用解码后的分类名称
  const config = categories[decodedCategory]

  return (
    <AdminLayout params={{ category: decodedCategory }}>
      <DataTable
        model={config.model}
        apiPath={config.apiPath}
        columns={generateColumns([...config.fields])}
        createHref={`/admin/${decodedCategory}/create`}
      />
    </AdminLayout>
  )
}