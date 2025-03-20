// app/admin/books/[id]/page.tsx
'use client';

import { BookForm } from '@/components/admin/books/BookForm';
import { useParams } from 'next/navigation';

export default function EditBookPage() {
  const params = useParams();
  const id = params.id; // 使用 useParams 获取动态路由参数

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">编辑书籍</h1>
      <BookForm initialData={{ id: id as string }} isEditMode={true} />
    </div>
  );
}