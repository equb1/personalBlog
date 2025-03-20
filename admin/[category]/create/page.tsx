// app/admin/[category]/create/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import AdminLayout from '../layout'

export default function CreatePage({
  params
}: {
  params: { category: string }
}) {
  const router = useRouter()
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/${params.category}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        router.push(`/admin/${params.category}`)
      }
    } catch (error) {
      console.error('创建失败:', error)
    }
  }

  return (
    <AdminLayout params={{ category: params.category }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">新建{params.category}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">标题</label>
            <input
              {...register('title')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">内容</label>
            <textarea
              {...register('content')}
              className="w-full p-2 border rounded h-40"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            创建
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}
