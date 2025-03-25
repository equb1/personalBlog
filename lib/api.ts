// lib/api.ts
import prisma from '@/lib/prisma';

export async function getCarouselPosts() {
  try {
    return await prisma.post.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
        coverImage: { not: null }
      },
      take: 3,
      select: {
        id: true,
        title: true,
        excerpt: true,
        coverImage: true,
        slug: true,
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        user: {
          select: {
            username: true,
            avatar: true
          }
        },
        content: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })
  } catch (error) {
    console.error('获取轮播图数据失败:', error)
    return []
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
      tags: true
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: 4
  });
  return posts;
}

export async function getPostBySlug(slug: string) {
  return await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      content: true,
      contentHtml: true,
      themeConfig: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      createdAt: true,
      publishedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      },
      category: {
        select: {
          id: true,
          name: true
        }
      },
      tags: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}

