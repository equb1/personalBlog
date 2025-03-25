"use client"
import { Metadata } from 'next'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/navigation/Navbar'
import { GridWrapper } from '@/components/featured-grid'
import { SectionWrapper } from '@/components/cards-section/SectionWrapper'
import { GridCardData, SectionCardData } from '@/types/content'
import Footer from '@/components/Footer'
import { formatDate } from '@/lib/utils'
import { TechCategory } from '@/types/techCategory'
import convertCategorySlug from '@/lib/convertCategorySlug'
import { Skeleton } from '@/components/ui/skeleton'



const FEATURED_ITEMS: GridCardData[] = [
  {
    id: 'g1',
    title: '高并发架构设计',
    summary: '基于微服务的分布式系统实战经验',
    difficulty: 3,
    thumbnail: '/arch.jpg',
    techStack: [
      {
        name: 'Kubernetes',
        proficiency: 85,
        category: 'tooling',
      },
      {
        name: 'Node.js',
        proficiency: 90,
        category: 'backend',
      },
    ],
    keyPoints: ["12344r"]
  },
  {
    id: 'g2',
    title: '高并发架构',
    thumbnail: '/arch.jpg',
    summary: '基于微服务架构的分布式系统实践经验...',
    difficulty: 3,
    techStack: [
      {
        name: 'Kubernetes',
        proficiency: 85,
      },
    ],
  },
]

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch('/api/posts/latest')
        if (!response.ok) {
          throw new Error('获取文章失败')
        }
        const data = await response.json()
        setLatestPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误')
        console.error('Fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestPosts()
  }, [])

  const sectionItems: SectionCardData[] = latestPosts.map((post) => {
    let categoryName = '未分类'
    let categorySlug = '#'
    if (post.category) {
      categoryName = post.category.name
      categorySlug = post.category.slug
    }

    return {
      id: post.id,
      title: post.title,
      description: post.excerpt || post.content.slice(0, 100) + '...',
      metaTitle: post.metaTitle || post.title,
      href: `/posts/${convertCategorySlug(categoryName)}/${post.slug}`,
      cover: {
        src: post.coverImage || '/default-article.jpg',
        alt: post.title,
      },
      techStack: post.tags.map((tag: { name: any }) => ({
        name: tag.name,
        proficiency: 80,
        category: TechCategory.TAG
      })),
      techCategories: [TechCategory.TAG],
      metadata: [
        {
          label: '作者',
          value: post.user.username,
          icon: post.user.avatar ? (
            <Image
              src={post.user.avatar}
              className="w-4 h-4 rounded-full"
              alt={post.user.username}
              width={16}
              height={16}
            />
          ) : null,
          href: `/user/${post.user.username}`
        },
        {
          label: '分类',
          value: categoryName,
          href: categorySlug === '#' ? '#' : `/category/${categorySlug}`
        },
        {
          label: '发布日期',
          value: formatDate(post.publishedAt || post.createdAt)
        }
      ]
    }
  })

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 mt-16 text-center py-8">
          <div className="text-red-500">加载失败: {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重试
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mt-16">
        <GridWrapper items={FEATURED_ITEMS} />
        
        {isLoading ? (
          <div className="px-4 py-8">
            <h2 className="text-xl font-bold mb-4">最新文章</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <SectionWrapper
            sections={[
              {
                title: '最新文章',
                route: '/posts',
                items: sectionItems.map(item => ({
                  ...item,
                  _hoverTitle: item.metaTitle 
                }))
              },
            ]}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}