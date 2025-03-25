import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(request: Request, { params }: { params: { categorySlug: string, slug: string } }) {
  try {
    const { categorySlug, slug } = params;

    const post = await prisma.post.findFirst({
      where: {
        slug,
        category: { slug: categorySlug },
        isPublished: true,
        status: 'PUBLISHED'
      },
      include: {
        user: { select: { username: true, avatar: true } },
        category: { select: { slug: true } },
        tags: true
      }
    });

    if (!post) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 });
    }

    // 更新浏览量
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    return new NextResponse(JSON.stringify(post), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}