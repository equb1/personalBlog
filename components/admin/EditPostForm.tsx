'use client';
import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/Button';
import { PostWithTags } from '@/types/post';
import { useRouter } from 'next/navigation';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { getCategories } from '@/lib/api/categories';
import { Category } from '@prisma/client';

interface EditPostFormProps {
  postId: string;
}

export default function EditPostForm({ postId }: EditPostFormProps) {
  const [post, setPost] = useState<PostWithTags | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postData, cats] = await Promise.all([
          fetch(`/api/posts/${postId}`).then(res => res.json()),
          getCategories()
        ]);

        if (!postData.id) throw new Error('文章不存在');
        
        setPost(postData);
        setCategories(cats);
      } catch (error) {
        console.error('加载失败:', error);
        router.replace('/admin/posts');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [postId, router]);

  const handleSubmit = async () => {
    if (!post) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });

      if (!res.ok) throw new Error('更新失败');
      router.refresh();
      alert('更新成功');
    } catch (error) {
      console.error('提交失败:', error);
      alert('更新失败');
    }
  };

  if (isLoading) return <div>加载中...</div>;
  if (!post) return <div>文章不存在</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <input
        value={post.title}
        onChange={e => setPost({ ...post, title: e.target.value })}
        className="text-2xl font-bold w-full border rounded p-2"
      />
      
      <Select
        value={post.categoryId || ''}
        onValueChange={value => setPost({ ...post, categoryId: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="选择分类" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(cat => (
            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <MDEditor
        value={post.content}
        onChange={value => setPost({ ...post, content: value || '' })}
        height={500}
      />

      <Button onClick={handleSubmit}>保存修改</Button>
    </div>
  );
}