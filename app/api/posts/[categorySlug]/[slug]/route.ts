// app/api/posts/[categorySlug]/[slug]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { categorySlug: string, slug: string } }) {
  try {
    const { categorySlug, slug } = params;

    // 在数据库中查找文章
    const post = await prisma.post.findFirst({
      where: {
        slug,
        category: {
          slug: categorySlug
        },
        isPublished: true,
        status: 'PUBLISHED'
      },
      include: {
        user: true,
        category: true,
        tags: true
      }
    });

    if (!post) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}