import { notFound } from 'next/navigation';
import { cache } from 'react';
import dynamic from 'next/dynamic';
import { PrismaClient } from '@prisma/client';
import PostContent from '@/components/PostContent';
import ExcerptCard from '@/components/ExcerptCard';
import Navbar from '@/components/navigation/Navbar';
import { getCachedHeadings } from '@/lib/cache';
import ScrollToTop from '@/components/ScrollToTop';
import Image from 'next/image';

const prisma = new PrismaClient();

// 类型安全的数据获取
const getPostData = cache(async (slug: string, categorySlug: string) => {
  const [post, cacheData] = await Promise.all([
    prisma.post.findFirst({
      where: {
        slug,
        category: { slug: categorySlug },
        isPublished: true,
        status: 'PUBLISHED'
      },
      include: { 
        user: { select: { username: true, avatar: true } },
        category: { select: { slug: true } }
      },
    }),
    getCachedHeadings(slug)
  ]);

  return { 
    post,
    contentHtml: cacheData?.contentHtml ?? post?.contentHtml ?? '',
    headings: cacheData?.headings ?? []
  };
});

// 动态加载组件
const LazyTOC = dynamic(() => import('@/components/LazyTOC'), {
  ssr: false,
  loading: () => <div className="w-64 h-64 bg-gray-100 animate-pulse rounded" />
});

const MobileTOC = dynamic(() => import('@/components/MobileTOC'), { ssr: false });

// 静态生成配置
export const revalidate = 60;

export async function generateStaticParams() {
  const popularPosts = await prisma.post.findMany({
    where: { 
      isPublished: true,
      status: 'PUBLISHED',
      category: { isNot: null },
      views: { gt: 100 }
    },
    select: { 
      slug: true,
      category: { select: { slug: true } } 
    },
    take: 50,
    orderBy: { views: 'desc' }
  });

  return popularPosts.map(post => ({
    categorySlug: post.category!.slug,
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: { params: { categorySlug: string; slug: string } }) {
  const { post } = await getPostData(params.slug, params.categorySlug);
  return post ? { 
    title: post.title, 
    description: post.excerpt ?? undefined 
  } : {};
}

export default async function PostPage({ params }: { params: { categorySlug: string; slug: string } }) {
  const { post, contentHtml, headings } = await getPostData(params.slug, params.categorySlug);
  if (!post) notFound();

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="lg:flex lg:gap-8">
          <article className="lg:flex-1 rounded-lg shadow-sm p-8">
            <header className="mb-12 text-center">
              <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {post.user.avatar && (
                  <Image
                    src={post.user.avatar}
                    priority
                    className="w-8 h-8 rounded-full"
                    alt={post.user.username}
                    width={32}
                    height={32}
                  />
                )}
                <span>{post.user.username}</span>
                <span>•</span>
                <time>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                </time>
              </div>
            </header>

            {post.excerpt && <ExcerptCard excerpt={post.excerpt} />}

            <PostContent 
              contentHtml={contentHtml} 
              theme={post.themeConfig ?? 'cyanosis'} 
            />
          </article>

          <aside className="hidden lg:block lg:w-64 xl:w-80 lg:sticky lg:top-20 lg:self-start">
            <LazyTOC headings={headings} />
          </aside>
        </div>
      </div>

      <MobileTOC headings={headings} />
      <ScrollToTop />
    </div>
  );
}