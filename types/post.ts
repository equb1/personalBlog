import { PostTags, Tag, PostStatus } from "@prisma/client";

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
  drafts: any;
  userId: string;
  categoryId: string;
  status: PostStatus;
  declineReason: string | null;
  tags: Tag[];
  contentHtml: string | null;
  themeConfig: string | null;
  // 添加 tagIds 作为可选属性
  tagIds?: string[];
};