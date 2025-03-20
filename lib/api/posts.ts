// lib/api/posts.ts
import prisma from '@/lib/prisma'
import { Post } from '@prisma/client'

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: { 
        category: true,
        tags: true 
      }
    })
    return { posts }
  } catch  {
    return { 
      posts: [],
      error: '获取文章失败'
    }
  }
}
// lib/api/posts.ts
export const getPostById = async (id: string) => {
  const response = await fetch(`/api/admin/posts/${id}`);
  if (!response.ok) {
    throw new Error('获取文章数据失败');
  }
  return response.json();
};

export const savePost = async (id: string, data: Partial<Post>) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export async function updatePost(id: string, data: { title: string; content: string }) {
  try {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('更新文章失败');
    return res.json();
  } catch (error) {
    console.error('更新文章失败:', error);
    return null;
  }
}