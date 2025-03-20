"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getColumns } from "../posts/columns"; // 确保导入正确的 getColumns 函数

// 定义 Column 和 Book 类型
interface Column {
  header: string;
  key: string;
  // 根据实际需求添加其他字段
}

interface Book {
  id: string;
  title: string;
  author: string;
  status: string; // 例如 "DRAFT", "PENDING", "PUBLISHED"
  // 根据实际需求添加其他字段
}

export default function BookList() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 定义 handleDelete 函数
  const handleDelete = async (bookId: string) => {
    const confirmed = confirm("确定删除这本书吗？");
    if (confirmed) {
      try {
        const res = await fetch(`/api/admin/books/${bookId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          // 重新获取书籍数据
          await fetchBooks();
        } else {
          console.error("删除书籍失败");
          setError("删除书籍失败");
        }
      } catch (error) {
        console.error("删除书籍失败:", error);
        setError("删除书籍失败");
      }
    }
  };

  // 获取书籍数据
  const fetchBooks = async () => {
    try {
      const booksResponse = await fetch("/api/admin/books");
      if (!booksResponse.ok) {
        throw new Error("获取书籍数据失败");
      }
      const books = await booksResponse.json();
      setBooks(books); // 假设返回的数据是书籍数组
    } catch (error) {
      console.error("获取书籍数据失败:", error);
      setError("获取书籍数据失败");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchBooks(); // 获取书籍数据
        const columns = getColumns(handleDelete) as Column[];
        setColumns(columns); // 设置表格列数据
      } catch (error) {
        console.error("获取数据失败:", error);
        setError("获取数据失败");
      } finally {
        setLoading(false); // 数据加载完成
      }
    };

    fetchData();
  }, [handleDelete]); // 添加 handleDelete 到依赖数组

  if (loading) {
    return <div>加载中...</div>; // 显示加载状态
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // 显示错误信息
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">书籍管理</h2>
        <Button asChild>
          <Link href="/admin/books/edit/new">新建书籍</Link>
        </Button>
      </div>
      {/* 等待 columns 数据加载完再渲染 DataTable */}
      {columns.length > 0 ? (
        <DataTable
          columns={columns} // 动态加载的 columns
          data={books}
          searchKey="title"
          filters={[
            { label: "草稿", value: "DRAFT" },
            { label: "待审核", value: "PENDING" },
            { label: "已发布", value: "PUBLISHED" },
          ]}
          onDelete={handleDelete}
        />
      ) : (
        <div>未找到列数据</div> // 处理列数据为空的情况
      )}
    </div>
  );
}