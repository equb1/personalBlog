'use client'

import { useMemo } from 'react';
import Link from 'next/link'
import { Card } from './Card'
import { SectionCardData } from '@/types/content'
import { TechCategory } from '@/types/techCategory'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

// 分类标签映射
const TechCategoryLabels: Record<TechCategory, string> = {
  [TechCategory.FRONTEND]: '前端技术',
  [TechCategory.BACKEND]: '后端框架',
  [TechCategory.TOOLING]: '开发工具',
  [TechCategory.TAG]: '文章标签'
} as const;

interface SectionWrapperProps {
  sections: {
    title: string;
    route: string;
    items: SectionCardData[];
  }[];
}

export const SectionWrapper = ({ sections }: SectionWrapperProps) => {
  const processSectionData = (item: SectionCardData) => ({
    ...item,
    cover: {
      src: item.cover?.src || '/default-cover.png',
      alt: item.cover?.alt || item.title,
      width: item.cover?.width,
      height: item.cover?.height,
    },
    techStack: item.techStack?.map((tech) => ({
      ...tech,
      category: (tech.category || TechCategory.TOOLING) as TechCategory,
    })) || [],
  });

  const memoizedSections = useMemo(() => {
    return sections.map(section => {
      const uniqueCategories = Array.from(
        new Set(
          section.items.flatMap(i =>
            i.techStack?.map(t => t.category) || []
          )
        )
      );
      return {
        ...section,
        uniqueCategories
      };
    });
  }, [sections]);

  return (
    <div className="space-y-16 py-16">
      {memoizedSections.map((section) => (
        <section key={section.title} className="container mx-auto px-4">
          {/* 标题行 */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-6">
              <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                <Link href={section.route}>
                  {section.title}
                  {section.items[0]?.techStack?.[0]?.category && (
                    <span className="ml-2 text-sm font-normal text-blue-600">
                      ({TechCategoryLabels[section.items[0].techStack[0].category]})
                    </span>
                  )}
                </Link>
              </h2>

              {/* 分类导航 */}
              <nav className="hidden md:flex space-x-4">
                {section.uniqueCategories.map((category) => {
                  if (category !== undefined) {
                    return (
                      <Link
                        key={category}
                        href={`/${section.route}?category=${category}`}
                        className="text-gray-500 hover:text-blue-500 text-sm px-3 py-1 rounded-lg hover:bg-gray-100 transition-all"
                      >
                        {TechCategoryLabels[category]}
                      </Link>
                    );
                  }
                  return null;
                })}
              </nav>
            </div>

            {/* 更多链接 */}
            <Link
              href={section.route}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
            >
              <span className="hidden sm:inline">更多</span>
              <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 卡片网格 */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {section.items.map((item) => (
              <Card
                key={item.id}
                data={processSectionData(item)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};