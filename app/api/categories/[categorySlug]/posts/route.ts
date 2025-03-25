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
      include: { user: true, category: true, tags: true },
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