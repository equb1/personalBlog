// app/api/posts/page.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const currentPage = parseInt(searchParams.get('page') || '1');
  const pageSize = 10;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: { category: true, tags: true }
    }),
    prisma.post.count()
  ]);

  return NextResponse.json({ posts, total });
}
