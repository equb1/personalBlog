// PostList.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 定义 handleDelete 函数
  const handleDelete = useCallback(async (postId: string) => {
    const confirmed = confirm("确定删除这篇文章吗？");
    if (confirmed) {
      try {
        const res = await fetch(`/api/admin/posts?id=${postId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          await fetchPosts();
        } else {
          throw new Error("删除文章失败");
        }
      } catch (error) {
        console.error("删除文章失败:", error);
        setError("删除文章失败，请重试");
      }
    }
  }, []);

  // 获取文章数据
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const postsResponse = await fetch("/api/admin/posts");
      if (!postsResponse.ok) {
        throw new Error("获取文章数据失败");
      }
      const { posts } = await postsResponse.json();
      setPosts(Array.isArray(posts) ? posts : []);
      setError(null);
    } catch (error) {
      console.error("获取文章数据失败:", error);
      setError("获取文章数据失败，请刷新重试");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 使用 useMemo 缓存 columns 配置
  const columns = useMemo(() => {
    return getColumns(handleDelete) as Column[];
  }, [handleDelete]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return <div className="p-6">加载中...</div>;
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-red-500">{error}</div>
        <Button onClick={fetchPosts}>重试</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">文章管理</h2>
        <Button asChild>
          <Link href="/admin/posts/edit/new">新建文章</Link>
        </Button>
      </div>
      
      <DataTable 
        columns={columns}
        data={posts}
        searchKey="title"
        filters={[
          { label: "草稿", value: "DRAFT" },
          { label: "待审核", value: "PENDING" },
          { label: "已发布", value: "PUBLISHED" }
        ]}
        onDelete={handleDelete}
      />
    </div>
  );
}