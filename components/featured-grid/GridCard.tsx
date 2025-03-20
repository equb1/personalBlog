// GridCard.tsx
'use client'

import { HeartIcon } from '@heroicons/react/24/solid'
import { GridCardData } from '@/types/content'
import Image from 'next/image'

interface Props {
  data: GridCardData;
}

export const GridCard = ({ data }: Props) => {
  return (
    <div className="group relative h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl border-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* 动态比例图片容器 */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
        {data.cover?.src && (
          <Image
            src={data.cover.src}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="absolute top-2 right-2">
        <button className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full backdrop-blur-sm hover:bg-red-100 dark:hover:bg-red-800/20">
          <HeartIcon className="w-5 h-5 text-gray-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
            {data.title}
          </h3>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full">
            难度 Lv.{data.difficulty}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
          {data.summary}
        </p>

        {/* 新增：显示文章核心亮点 */}
        {data.keyPoints && (
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            <strong>核心亮点：</strong>
            {data.keyPoints.map((point, index) => (
              <span key={index}>{point} </span>
            ))}
          </div>
        )}

        {/* 新增：显示作者权威信息 */}
        {data.authorInfo && (
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            <strong>作者：</strong>{data.authorInfo.name} ({data.authorInfo.title})
          </div>
        )}

        {/* 新增：显示阅读量和点赞数 */}
        {data.stats && (
          <div className="flex text-gray-600 dark:text-gray-400 text-sm">
            <span>阅读量：{data.stats.views}</span>
            <span className="ml-4">点赞数：{data.stats.likes}</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {data.techStack?.map((skill, index) => (
            <SkillBar
              key={`${skill.name}-${index}`}
              skill={skill.name}
              percent={skill.proficiency ?? 0} // 使用 nullish coalescing 来确保有默认值
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface SkillBarProps {
  skill: string;
  percent: number;
}



const SkillBar = ({ skill, percent }: SkillBarProps) => (
  <div className="w-full space-y-1">
    <span className="text-sm text-gray-600 dark:text-gray-400">{skill}</span>

    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative">
      <div
        style={{ width: `${percent}%` }}
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-purple-500 dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-600 transition-all duration-[800ms] ease-out animate-glowing-bar"
      />
    </div>

    <span className="text-xs text-blue-600 dark:text-blue-300 font-medium">{percent}%</span>
  </div>
)