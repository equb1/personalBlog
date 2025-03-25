'use client';
import { useState } from 'react';
import { SectionWrapper } from '@/components/cards-section/SectionWrapper';
import Navbar from '@/components/navigation/Navbar';
import Image from 'next/image';
import { TechCategory } from '@/types/content';

interface PostsClientProps {
    initialData: Record<string, Array<{
      id: string;
      title: string;
      description: string;
      href: string;
      cover: { src: string; alt: string };
      techCategories?: TechCategory[];
      techStack?: {
        name: string;
        proficiency: number;
        category: TechCategory;
      }[];
      metadata: Array<{
        label: string;
        value: string;
        icon?: string | null;
      }>;
      // 添加 categorySlug 字段
      categorySlug: string;
    }>>;
}

export default function PostsClient({ initialData }: PostsClientProps) {
    const [sectionsData] = useState(initialData);
  
    return (
      <div>
        <Navbar />
        <SectionWrapper
          sections={Object.entries(sectionsData).map(([categoryName, items]) => ({
            title: categoryName,
            // 使用从数据中获取的 categorySlug 而不是手动生成
            route: `/posts/${items[0]?.categorySlug || 'default'}`,
            items: items.map(item => ({
              ...item,
              techCategories: item.techCategories || [TechCategory.TAG],
              metadata: item.metadata.map(meta => ({
                ...meta,
                icon: meta.icon === '[AVATAR]' ? (
                  <Image
                    src={items.find(i => i.id === item.id)?.metadata[0].value || ''}
                    width={16}
                    height={16}
                    alt=""
                    className="rounded-full"
                  />
                ) : null
              }))
            }))
          }))}
        />
      </div>
    );
}