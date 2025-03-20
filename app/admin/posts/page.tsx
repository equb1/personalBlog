"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getColumns } from "./columns"; // 导入 getColumns 函数

// 定义 Column 和 Post 类型
interface Column {
  header: string;
  key: string;
  // 根据实际需求添加其他字段
}

interface Post {
  id: string;
  title: string;
  status: string; // 例如 "DRAFT", "PENDING", "PUBLISHED"
  // 根据实际需求添加其他字段
}

export default function PostList() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 定义 handleDelete 函数
  const handleDelete = async (postId: string) => {
    const confirmed = confirm("确定删除这篇文章吗？");
    if (confirmed) {
      try {
        const res = await fetch(`/api/admin/posts?id=${postId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          // 重新获取文章数据
          await fetchPosts();
        } else {
          console.error("删除文章失败");
        }
      } catch (error) {
        console.error("删除文章失败:", error);
      }
    }
  };

  // 获取文章数据
  const fetchPosts = async () => {
    try {
      const postsResponse = await fetch("/api/admin/posts");
      if (!postsResponse.ok) {
        throw new Error("获取文章数据失败");
      }
      const { posts } = await postsResponse.json();
      setPosts(posts);
    } catch (error) {
      console.error("获取文章数据失败:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPosts(); // 获取文章数据
        const columns = getColumns(handleDelete) as Column[];
        setColumns(columns); // 设置表格列数据
      } catch (error) {
        console.error("获取数据失败:", error);
      } finally {
        setLoading(false); // 数据加载完成
      }
    };

    fetchData();
  }, [handleDelete]); // 添加 handleDelete 到依赖数组

  if (loading) {
    return <div>加载中...</div>; // 显示加载状态
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">文章管理</h2>
        <Button asChild>
          <Link href="/admin/posts/edit/new">新建文章</Link>
        </Button>
      </div>
      {/* 等待 columns 数据加载完再渲染 DataTable */}
      {columns.length > 0 ? (
        <DataTable 
          columns={columns} // 动态加载的 columns
          data={posts}
          searchKey="title"
          filters={[
            { label: "草稿", value: "DRAFT" },
            { label: "待审核", value: "PENDING" },
            { label: "已发布", value: "PUBLISHED" }
          ]}
          onDelete={handleDelete}
        />
      ) : (
        <div>未找到列数据</div> // 处理列数据为空的情况
      )}
    </div>
  );
}