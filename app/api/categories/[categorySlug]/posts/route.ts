import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 改用全局共享的 Prisma 实例

export async function GET(
  request: Request,
  { params }: { params: { categorySlug: string } }
) {
  try {
    const { categorySlug } = params; // 直接解构，无需 await
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
      include: { user: true, category: true, tags: true },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}