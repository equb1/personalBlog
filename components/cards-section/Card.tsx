'use client';

import { SectionCardData } from '@/types/content';
import { TechCategory } from '@/types/techCategory';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// 定义 Metadata 类型
interface Metadata {
  label: string;
  value: string;
}

// 提取查找元数据的公共函数
const findMetadataValue = (metadata: Metadata[], label: string) => {
  return metadata.find((m) => m.label === label)?.value;
};

interface Props {
  data: SectionCardData;
  techCategories?: TechCategory[];
}

export const Card = ({ data, techCategories = [] }: Props) => {
  return (
    <Link
      href={data.href} // 使用 Link 包裹整个卡片
      className="block group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-3 focus:ring-blue-400"
      title={data.metaTitle}
    >
      {/* 卡片内容 */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {data.cover?.src && (
          <Image
            src={data.cover.src}
            alt={data.cover.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={data.isFeatured || false}
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/default-cover.png';
            }}
          />
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
            {data.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {data.description}
          </p>
        </div>

        {techCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techCategories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full shadow-sm"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500">
          <span className="inline-flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {findMetadataValue(data.metadata, '发布日期')}
          </span>
          <span className="mx-2">•</span>
          <span>{findMetadataValue(data.metadata, '作者')}</span>
        </div>
      </div>
    </Link>
  );
};