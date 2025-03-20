// app/admin/books/[id]/page.tsx
'use client'

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // 使用 next/navigation
import { useSession } from "next-auth/react";
import { Book, Tag } from "@prisma/client";

export default function EditBookPage() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split('/').pop(); // 从路径中提取书籍 ID
  const [book, setBook] = useState<Book | null>(null);
  const { data: session } = useSession(); // 获取当前会话

  useEffect(() => {
    async function fetchBook() {
      if (!id) return;
      const res = await fetch(`/api/admin/books/${id}`);
      if (!res.ok) {
        console.error("获取书籍失败");
        return;
      }
      const data: Book = await res.json();
      setBook(data);
    }
    fetchBook();
  }, [id]);

  if (!book) return <div>加载中...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !session.user || !session.user.id) {
      console.error("未获取到当前用户信息");
      return;
    }

    const res = await fetch(`/api/admin/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        isbn: book.isbn,
        publisher: book.publisher,
        publishYear: book.publishYear,
        pages: book.pages,
        description: book.description,
        readingProgress: book.readingProgress,
        categoryId: book.categoryId,
        tags: book.tags.map((tag: Tag) => tag.id),
        userId: session.user.id, // 使用当前用户的 ID
      }),
    });
    if (!res.ok) {
      console.error("更新书籍失败");
      return;
    }
    router.push("/admin/books");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">编辑书籍</h1>
      <form onSubmit={handleSubmit}>
        {/* 表单字段与添加书籍页面类似，使用 book 数据填充 */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          保存修改
        </button>
      </form>
    </div>
  );
}