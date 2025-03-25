import { notFound } from 'next/navigation';
import PostContent from '@/components/PostContent';
import LazyTOC from '@/components/LazyTOC';
import ExcerptCard from '@/components/ExcerptCard';
import Navbar from '@/components/navigation/Navbar';
import { getCachedHeadings } from '@/lib/cache';
import MobileTOC from '@/components/MobileTOC';
import ScrollToTop from '@/components/ScrollToTop';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { useMemo } from 'react';

// export async function generateMetadata({ params }: { params: { categorySlug: string; slug: string } }) {
//     const post = await prisma.post.findFirst({
//         where: {
//             slug: params.slug,
//             category: { slug: params.categorySlug }
//         },
//         select: { title: true, excerpt: true },
//     });

//     if (!post) return {};

//     return {
//         title: post.title,
//         description: post.excerpt,
//     };
// }

// 清理重复代码块的工具函数
function cleanDuplicateCodeBlocks(content: string): string {
    if (!content) return '';
    
    // 处理JavaScript函数重复
    let cleaned = content.replace(
        /(function\s+\w+\(.*?\)\s*{[\s\S]*?}\s*)(\s*\1){2}/g,
        '$1'
    );
    
    // 处理HTML pre标签重复
    cleaned = cleaned.replace(
        /(<pre class="language-\w+"[\s\S]*?<\/pre>)(\s*\1){2}/g,
        '$1'
    );
    
    return cleaned;
}

const PostPage: React.FC<{ params: { categorySlug: string; slug: string } }> = async ({ params }) => {
    const post = await prisma.post.findFirst({
        where: {
            slug: params.slug,
            category: { slug: params.categorySlug }
        },
        include: { user: { select: { username: true, avatar: true } } },
    });

    if (!post) {
        console.error('Post not found:', {
            categorySlug: params.categorySlug,
            slug: params.slug,
            availablePosts: await prisma.post.findMany({
                select: { 
                    slug: true, 
                    category: { 
                        select: { 
                            slug: true 
                        } 
                    }  // 这里之前缺少了逗号
                }      // 这里之前缺少了右大括号
            })         // 这里之前缺少了右括号
        });
        notFound();
    }

    // 获取缓存数据
    const cacheData = await getCachedHeadings(params.slug).catch(e => {
        console.error('Cache error:', e);
        return null;
    });
    console.log("post", post);
    const headings = cacheData?.headings || [];
    const rawContent = cacheData?.contentHtml || post?.contentHtml || '';

    // 清理重复内容
    const cleanedContent = cleanDuplicateCodeBlocks(rawContent);

    return (
        <div className="min-h-screen dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="lg:flex lg:gap-8">
                    {/* 文章内容 */}
                    <article className="lg:flex-1 rounded-lg shadow-sm p-8">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                                {post.title}
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    {post.user.avatar && (
                                        <Image
                                            src={post.user.avatar}
                                            className="w-8 h-8 rounded-full"
                                            alt={post.user.username}
                                            width={32}
                                            height={32}
                                        />
                                    )}
                                    <span>{post.user.username}</span>
                                </div>
                                <span>•</span>
                                <time>
                                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                                </time>
                            </div>
                        </div>

                        {post.excerpt && <ExcerptCard excerpt={post.excerpt} />}

                        <PostContent 
                            contentHtml={cleanedContent} 
                            theme={post.themeConfig || 'cyanosis'} 
                        />
                    </article>

                    {/* 目录导航 */}
                    <aside className="hidden lg:block lg:w-64 xl:w-80 lg:sticky lg:top-20 lg:self-start">
                        {headings.length > 0 && <LazyTOC headings={headings} />}
                    </aside>
                </div>
            </div>
            
            <MobileTOC headings={headings} />
            <ScrollToTop />
        </div>
    );
};

export default PostPage;