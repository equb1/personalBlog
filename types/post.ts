import { PostTags } from "@prisma/client"

import { Tag, PostStatus } from "@prisma/client";

export type PostWithTags = {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  views: number;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  drafts: any; // 根据你的实际类型调整
  userId: string;
  categoryId: string;
  status: PostStatus;
  declineReason: string | null;
  tags: Tag[]; // 明确声明 tags 属性
  contentHtml: string | null;
  themeConfig:  string | null;
};
  
