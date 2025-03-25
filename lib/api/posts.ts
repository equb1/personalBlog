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

export async function getLatestPosts() {
  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      status: 'PUBLISHED'
    },
    include: {
      user: true,
      category: true,
      tags: true // 确保包含标签
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: 4
  });

  // 将数据序列化为纯 JavaScript 对象
  const serializedPosts = posts.map(post => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt?.toISOString() || null,
    tags: post.tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug
    }))
  }));

  return serializedPosts;
}