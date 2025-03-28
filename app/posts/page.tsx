import { Post, TechCategory } from '@/types/content';
import prisma from '@/lib/prisma';
import PostsClient from './PostsClient';

// 更新本地类型定义以匹配 PostsClient 的期望
interface PostItem {
  id: string;
  title: string;
  description: string;
  href: string;
  cover: { src: string; alt: string };
  techCategories: TechCategory[];
  techStack?: {
    name: string;
    proficiency: number;
    category: TechCategory;
  }[];
  metadata: Array<{ label: string; value: string; icon?: string | null }>;
  categorySlug: string; // 添加这个必填字段
}

interface SectionData {
  [categoryName: string]: PostItem[];
}

export default async function PostsPage() {
  // 1. 获取所有分类
  const categories = await prisma.category.findMany({
    where: { slug: { in: ['learning-notes', 'interviews', 'projects'] } },
    select: { id: true, name: true, slug: true }
  });

  // 2. 并行获取每个分类的文章
  const categoryPosts = await Promise.all(
    categories.map(async (category) => {
      const posts = await prisma.post.findMany({
        where: { categoryId: category.id },
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          slug: true,
          coverImage: true,
          publishedAt: true,
          createdAt: true,
          user: { select: { username: true, avatar: true } },
          tags: { select: { name: true } },
          category: { select: { name: true, slug: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return { category, posts };
    })
  );

  // 构建符合类型要求的数据
  const sectionsData: SectionData = {};
  categoryPosts.forEach(({ category, posts }) => {
    sectionsData[category.name] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.excerpt || post.content.slice(0, 100) + '...',
      href: `/posts/${category.slug}/${post.slug}`,
      cover: {
        src: post.coverImage || '/default-article.jpg',
        alt: post.title
      },
      techStack: post.tags.map(tag => ({
        name: tag.name,
        proficiency: 80,
        category: TechCategory.TAG
      })),
      techCategories: [TechCategory.TAG],
      metadata: [
        {
          label: '作者',
          value: post.user.username,
          icon: post.user.avatar ? '[AVATAR]' : null
        },
        { label: '分类', value: category.name },
        { 
          label: '发布日期', 
          value: new Date(post.publishedAt || post.createdAt).toLocaleDateString() 
        }
      ],
      categorySlug: category.slug // 添加缺失的 categorySlug
    }));
  });

  return <PostsClient initialData={sectionsData} />;
}