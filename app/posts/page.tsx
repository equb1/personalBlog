"use client"
import { useEffect, useState } from 'react';
import { SectionWrapper } from '@/components/cards-section/SectionWrapper';
import { SectionCardData, TechCategory, Post, Tag } from '@/types/content';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import { formatDate } from '@/lib/utils';
import convertCategorySlug from '@/lib/convertCategorySlug';
import Image from 'next/image'; // 引入 next/image

const subMenuItems = [
  { name: '学习笔记', route: '/categories/学习笔记/posts' },
  { name: '笔试面试', route: '/categories/笔试面试/posts' },
  { name: '项目实践', route: '/categories/项目实践/posts' },
];

const PostsPage: React.FC = () => {
  const [sectionsData, setSectionsData] = useState<Record<string, SectionCardData[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryPromises = subMenuItems.map(async (item) => {
          const englishSlug = convertCategorySlug(item.name);
          console.log('Sending categorySlug:', englishSlug); // 输出传递的 categorySlug
          const response = await fetch(`/api/categories/${englishSlug}/posts`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const posts: Post[] = await response.json();

          const items: SectionCardData[] = posts.map((post) => ({
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

          return {
            categoryName: item.name,
            items
          };
        });

        const results = await Promise.all(categoryPromises);

        const newSectionsData = results.reduce((acc, result) => {
          acc[result.categoryName] = result.items;
          return acc;
        }, {} as Record<string, SectionCardData[]>);

        setSectionsData(newSectionsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex justify-center space-x-4 my-8">
        {subMenuItems.map((item) => (
          <Link key={item.route} href={item.route.replace(item.name, convertCategorySlug(item.name))} className="text-blue-600 hover:text-blue-800">{item.name}</Link>
        ))}
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
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
      )}
    </div>
  );
};

export default PostsPage;