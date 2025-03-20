'use client'
import { useMemo } from 'react';
import { GridCardData } from '@/types/content'
import { GridCard } from './GridCard'
import { convertToGridCardData } from '@/lib/utils';

interface GridWrapperProps {
  items: GridCardData[]
}

export const GridWrapper = ({ items }: GridWrapperProps) => {
  const uniqueTechStacks = useMemo(() => {
    return Array.from(new Set(
      items.flatMap(i => 
        i.techStack?.map(t => t.name) ?? []
      )
    ));
  }, [items]);

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          技术全景展示
          <span className="text-blue-600 ml-2 text-lg">({items.length}个重点方案)</span>
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {items.map((item) => (
            <GridCard 
              key={item.id} 
              data={convertToGridCardData(item)} 
            />
          ))}
        </div>
        <div className="mt-12 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-4">技术栈覆盖：</span>
            {uniqueTechStacks.slice(0,8).map(techName => (
              <span key={techName} className="mx-1">#{techName}</span>
            ))}
            {uniqueTechStacks.length > 8 && (
              <span className="text-blue-600 ml-2">
                +{uniqueTechStacks.length - 8}项技术
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}