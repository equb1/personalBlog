// app/admin/posts/edit/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PostForm } from '@/components/admin/posts/PostForm';
import { PostWithTags } from '@/types/post';

export default function EditPostPage() {
  const { id } = useParams();
  const [postData, setPostData] = useState<PostWithTags | null>(null);
  const [loading, setLoading] = useState(true); // 添加加载状态

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);
        if (!res.ok) throw new Error('Failed to load post');
        const data = await res.json();
        setPostData(data);
      } catch (error) {
        console.error('加载文章失败:', error);
      } finally {
        setLoading(false); // 确保最终设置加载状态为false
      }
    };
    loadPost();
  }, [id]);

  if (loading) return <div className="text-center py-8">加载中...</div>;
  if (!postData) return <div className="text-red-500 text-center py-8">文章加载失败</div>;

  return (
    <div className="mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 px-4">编辑文章</h1>
      {postData && <PostForm initialData={postData} isEditMode={true} />}
    </div>
  );
}