// app/admin/books/new/page.tsx
'use client';

import { BookForm } from '@/components/admin/books/BookForm';

export default function NewBookPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">添加新书籍</h1>
      <BookForm />
    </div>
  );
}