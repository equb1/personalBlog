import { Metadata } from 'next';
import Navbar from '@/components/navigation/Navbar';
import { GridWrapper } from '@/components/featured-grid';
import { SectionWrapper } from '@/components/cards-section/SectionWrapper';
import { GridCardData, SectionCardData } from '@/types/content';
import Footer from '@/components/Footer';
import { getLatestPosts } from '@/lib/api';
import { formatDate } from '@/lib/utils'; // 需要创建日期格式化工具函数
import { TechCategory } from '@/types/techCategory';
import convertCategorySlug from '@/lib/convertCategorySlug';
import Image from 'next/image';

// 辅助函数定义
function generateCalendarData() {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - i);
    return {
      date: date.toISOString().split('T')[0], // 只取日期部分，不包含时间
      count: Math.floor(Math.random() * 4)
    };
  }).reverse();
}

function generateVisitsData() {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000 + 200));
}

function getRealVisitCount() {
  return 12345;
}

export const metadata: Metadata = {
  title: '技术博客 | 前沿开发实践',
  description: '探索全栈开发与架构设计的最佳实践',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    images: [{ url: '/og-carousel.png', width: 1200, height: 630 }],
  },
};

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
    keyPoints: [
      "12344r"
    ]
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
];

export default async function Home() {
  const latestPosts = await getLatestPosts();
  console.log("lastpost", latestPosts);

  const sectionItems: SectionCardData[] = latestPosts.map((post) => {
    let categoryName = '未分类';
    let categorySlug = '#';
    if (post.category) {
      categoryName = post.category.name;
      categorySlug = post.category.slug;
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
    };
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mt-16">
        <GridWrapper items={FEATURED_ITEMS} />
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
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}