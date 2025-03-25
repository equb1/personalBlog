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
      techCategories?: TechCategory[]; // 添加可选字段
      techStack?: {      // 如果需要也添加
        name: string;
        proficiency: number;
        category: TechCategory;
      }[];
      metadata: Array<{
        label: string;
        value: string;
        icon?: string | null;
      }>;
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
            route: `/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}/posts`,
            items: items.map(item => ({
              ...item,
              techCategories: item.techCategories || [TechCategory.TAG], // 确保存在
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