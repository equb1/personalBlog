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
  return await prisma.post.findMany({
    where: { 
      isPublished: true,
      status: 'PUBLISHED'
    },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      slug: true,
      coverImage: true,
      metaTitle: true,
      publishedAt: true,
      createdAt: true,
      user: {
        select: {
          username: true,
          avatar: true
        }
      },
      category: {
        select: {
          name: true,
          slug: true
        }
      },
      tags: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: 6 // 获取6篇最新文章
  })
}

// export async function getFeaturedPosts() {
//   return await prisma.post.findMany({
//     where: {
//       isPublished: true,
//       status: 'PUBLISHED',
//       isFeatured: true
//     },
//     select: {
//       id: true,
//       title: true,
//       summary: true,
//       difficulty: true,
//       coverImage: true,
//       tags: {
//         select: {
//           name: true
//         }
//       }
//     },
//     take: 2 // 获取2篇精选文章
//   })
// }

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

