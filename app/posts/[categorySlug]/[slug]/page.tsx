import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import PostContent from '@/components/PostContent';
import LazyTOC from '@/components/LazyTOC';
import ExcerptCard from '@/components/ExcerptCard';
import Navbar from '@/components/navigation/Navbar';
import { getCachedHeadings } from '@/lib/cache';
import MobileTOC from '@/components/MobileTOC';
import ScrollToTop from '@/components/ScrollToTop';
import Image from 'next/image'; // 引入 next/image
import prisma from '@/lib/prisma';

// interface Post {
//     id: string;
//     title: string;
//     contentHtml: string;
//     themeConfig?: string;
//     user: { username: string; avatar?: string };
//     publishedAt?: Date;
//     createdAt: Date;
//     excerpt?: string;
//     slug: string;
// }

export async function generateMetadata({ params }: { params: { categorySlug: string; slug: string } }) {
    const post = await prisma.post.findFirst({
        where: {
            slug: params.slug,
            category: { slug: params.categorySlug }
        },
        select: { title: true, excerpt: true },
    });

    if (!post) return {};

    return {
        title: post.title,
        description: post.excerpt,
    };
}

const PostPage: React.FC<{ params: { categorySlug: string; slug: string } }> = async ({ params }) => {
    console.log('当前 categorySlug:', params.categorySlug, '当前 slug:', params.slug);

    const post = await prisma.post.findFirst({
        where: {
            slug: params.slug,
            category: { slug: params.categorySlug }
        },
        include: { user: { select: { username: true, avatar: true } } },
    });

    if (!post) {
        console.log('未找到文章，categorySlug:', params.categorySlug, 'slug:', params.slug);
        notFound();
    }

    // 使用缓存获取目录和更新后的 contentHtml
    const cacheData = await getCachedHeadings(params.slug);
    const headings = cacheData?.headings || [];
    const contentHtml = cacheData?.contentHtml || post?.contentHtml || '';

    console.log('获取到的目录数据:', headings);

    return (
        <div className="min-h-screen  dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="lg:flex lg:gap-8">
                    {/* 文章内容 */}
                    <article className="lg:flex-1   rounded-lg shadow-sm p-8">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                                {post?.title}
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    {post?.user.avatar && (
                                        <Image
                                            src={post.user.avatar}
                                            className="w-8 h-8 rounded-full"
                                            alt={post.user.username}
                                            width={32}
                                            height={32}
                                        />
                                    )}
                                    <span>{post?.user.username}</span>
                                </div>
                                <span>•</span>
                                <time>
                                    {new Date(post?.publishedAt || post?.createdAt || new Date()).toLocaleDateString()}
                                </time>
                            </div>
                        </div>

                        {post?.excerpt && <ExcerptCard excerpt={post.excerpt} />}

                        <PostContent contentHtml={contentHtml} theme={post?.themeConfig || 'cyanosis'} />
                    </article>

                    {/* 目录导航 */}
                    <aside className="hidden lg:block lg:w-64 xl:w-80 lg:sticky lg:top-20 lg:self-start">
                        {headings && <LazyTOC headings={headings} />}
                    </aside>
                </div>
            </div>
            {/* 移动端目录入口 */}
            <MobileTOC headings={headings} />

            {/* 返回顶部按钮 */}
            <ScrollToTop />
        </div>
    );
};

export default PostPage;