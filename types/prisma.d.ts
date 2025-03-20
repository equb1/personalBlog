// types/prisma.d.ts
export type Post = {
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
    drafts: string | null;
    userId: string;
    categoryId: string;
    status: string;
    declineReason: string | null;
  };