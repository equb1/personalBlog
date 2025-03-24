// 使用 React Hooks 获取数据
import { Suspense } from 'react';
import { SectionWrapper } from '@/components/cards-section/SectionWrapper';
import { SectionCardData, TechCategory, Post, Tag } from '@/types/content';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import { formatDate } from '@/lib/utils';
import convertCategorySlug from '@/lib/convertCategorySlug';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner'; // 引入加载组件
import SkeletonLoader from '@/components/SkeletonLoader'; // 引入骨架屏组件

const subMenuItems = [
  { name: '学习笔记', route: '/categories/学习笔记/posts' },
  { name: '笔试面试', route: '/categories/笔试面试/posts' },
  { name: '项目实践', route: '/categories/项目实践/posts' },
];

// 定义一个服务端函数来获取数据
const fetchPosts = async (categorySlug: string): Promise<SectionCardData[]> => {
  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) {
    throw new Error('Base URL is not configured');
  }

  const response = await fetch(`${baseUrl}/api/categories/${categorySlug}/posts`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const posts: Post[] = await response.json();

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    description: post.excerpt || post.content.slice(0, 100) + '...',
    metaTitle: post.metaTitle || post.title,
    href: `/posts/${convertCategorySlug(post.category.name)}/${post.slug}`,
    cover: {
      src: post.coverImage || '/default-article.jpg',
      alt: post.title,
    },
    techStack: post.tags.map((tag: Tag) => ({
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
        value: post.category?.name || '未分类',
        href: post.category ? `/category/${convertCategorySlug(post.category.slug)}` : '#'
      },
      {
        label: '发布日期',
        value: formatDate(post.publishedAt || post.createdAt)
      }
    ]
  }));
};

// 页面组件
const PostsPage = async () => {
  const sectionsData: Record<string, SectionCardData[]> = {};

  for (const item of subMenuItems) {
    const englishSlug = convertCategorySlug(item.name);
    console.log('Sending categorySlug:', englishSlug);
    sectionsData[item.name] = await fetchPosts(englishSlug);
  }

  return (
    <div>
      <Navbar />
      <SectionWrapper
        sections={Object.entries(sectionsData).map(([categoryName, items]) => ({
          title: categoryName,
          route: `/categories/${convertCategorySlug(categoryName)}/posts`,
          items: items.map(item => ({
            ...item,
            _hoverTitle: item.metaTitle
          }))
        }))}
      />
    </div>
  );
};

export default PostsPage;