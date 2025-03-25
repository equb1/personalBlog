'use client';

import { SectionCardData } from '@/types/content';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Metadata {
  label: string;
  value: string;
}

const findMetadataValue = (metadata: Metadata[], label: string) => {
  return metadata.find((m) => m.label === label)?.value;
};

interface Props {
  data: SectionCardData;
}

export const Card = ({ data }: Props) => {
  // 从 techStack 获取标签数据
  const tags = data.techStack?.map(tech => ({
    id: tech.name, // 使用name作为临时ID
    name: tech.name,
    slug: tech.name.toLowerCase().replace(/\s+/g, '-') // 生成slug
  })) || [];

  return (
    <Link
      href={data.href}
      className="block group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-3 focus:ring-blue-400"
      title={data.metaTitle}
    >
      {/* 封面图片 */}
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

        {/* 修改后的标签展示部分 - 使用 techStack 数据 */}
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full shadow-sm hover:bg-blue-200 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-400">暂无标签</div>
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