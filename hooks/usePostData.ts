// hooks/usePostData.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Tag } from '@prisma/client';
import { getCategories } from '@/lib/api/categories';
import { getTags } from '@/lib/api/tags';

// 添加数据缓存
let cachedCategories: Category[] | null = null;
let cachedTags: Tag[] | null = null;

export const usePostData = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(cachedCategories || []);
  const [tags, setTags] = useState<Tag[]>(cachedTags || []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 优先使用缓存
        if (!cachedCategories || !cachedTags) {
          const [cats, tags] = await Promise.all([
            getCategories(),
            getTags()
          ]);
          
          // 更新缓存
          cachedCategories = cats;
          cachedTags = tags;
          
          setCategories(cats);
          setTags(tags);
        } else {
          setCategories(cachedCategories);
          setTags(cachedTags);
        }
      } catch (error) {
        router.replace('/admin/posts');
      }
    };
    
    // 添加请求中止控制器
    const controller = new AbortController();
    loadData();
    
    return () => controller.abort();
  }, [router]);

  return { categories, tags };
};