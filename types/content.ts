// types/content.ts
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import { TechCategory } from './techCategory'
import { ReactNode } from 'react'
export interface Tag {
  id: string | number;
  name: string;
  slug: string;
}
// 🌟 Core Unified Interface 🌟
export interface BaseContent {
  id: string | number
  title: string
  summary?: string
  isFeatured?:boolean,
  tags?: Tag[]; // 修改为 tags 数组
  cover?: {
    src: string | StaticImport
    alt: string
    width?: number
    height?: number
  }
  techStack?: Array<{
    name: string
    proficiency?: number
    category?: TechCategory
  }>
}

// 🎛️ Specialized Extensions 🎛️  
export interface GridCardData extends BaseContent {

  thumbnail?: string
  difficulty?: 1 | 2 | 3 | 4 | 5
  highlightColor?: [string, string]
  gridLayout?: 'horizontal' | 'vertical'
  href?: never
  keyPoints?: string[]; // 新增：文章核心亮点
  authorInfo?: {
    name: string;
    title: string;
  }; // 新增：作者权威信息
  stats?: {
    views: number;
    likes: number;
  }; // 新增：阅读量和点赞数
}

export interface SectionCardData extends BaseContent {
  [x: string]: any
  description: string
  href: string
  techCategories: (TechCategory | undefined)[]
  difficulty?: never
  metaTitle?: string  // 新增metaTitle属性
}

// 🎠 新增轮播图类型
export interface CarouselImage {
  id: string
  src: string
  alt: string
  href?: string
  overlay?: {
    title: string
    description: string
    metadata?: Array<{
      label: string
      value: string
      href?: string
      icon?: ReactNode
    }>
  }
  content?: string; 
}

// 📝 补充文章内容类型
declare global {
  namespace PrismaJson {
    type DraftHistory = Array<{
      content: string
      savedAt: Date
    }>
  }
}

export type PostContent = {
  content: string
  drafts?: PrismaJson.DraftHistory
}
export { TechCategory }


// @/types/content.ts
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  coverImage: string;
  slug: string;
  category: {
    name: string;
    slug: string;
  };
  tags: Tag[];
  user: {
    username: string;
    avatar: string;
  };
  publishedAt: string;
  createdAt: string;
}

export interface Tag {
  name: string;
}