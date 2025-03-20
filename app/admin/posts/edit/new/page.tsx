//app/admin/posts/edit/new/page.tsx
'use client';

import { PostForm } from '@/components/admin/posts/PostForm';
import { getCategories } from '@/lib/api/categories';
import { getTags } from '@/lib/api/tags';
import { useEffect } from 'react';

export default function NewPostPage() {
    // 页面加载时预取数据
    useEffect(() => {
      const prefetchData = async () => {
        await Promise.allSettled([getCategories(), getTags()]);
      };
      prefetchData();
    }, []);
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">创建新文章</h1>
        <PostForm />
      </div>
    );
  }