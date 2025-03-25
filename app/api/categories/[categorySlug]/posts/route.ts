import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { categorySlug: string } }
) {
  try {
    const { categorySlug } = params;
    const decodedSlug = decodeURIComponent(categorySlug);

    const category = await prisma.category.findUnique({
      where: { slug: decodedSlug },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' }, 
        { status: 404 }
      );
    }

    const posts = await prisma.post.findMany({
        where: { categoryId: category.id },
        include: {
          user: { select: { id: true, username: true, avatar: true } }, // 只选择必要字段
          category: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }, // 避免全表扫描
        take: 20 // 限制返回数量
      });

    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}