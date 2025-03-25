// app/api/admin/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, author, coverImage, isbn, publisher, publishYear, pages, description, readingProgress, categoryId, tags, bookFileUrl, userId } = data;

    const book = await prisma.book.upsert({
      where: {
        isbn: isbn,
      },
      update: {
        title,
        author,
        coverImage,
        publisher,
        publishYear,
        pages,
        description,
        readingProgress,
        categoryId,
        tags: {
          set: tags.map((tag: string) => ({ name: tag })),
        },
        bookFileUrl,
        userId,
      },
      create: {
        title,
        author,
        coverImage,
        isbn,
        publisher,
        publishYear,
        pages,
        description,
        readingProgress,
        categoryId,
        tags: {
          create: tags.map((tag: string) => ({ name: tag })),
        },
        bookFileUrl,
        userId,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error('添加书籍失败:', error);
    return NextResponse.json({ error: '添加书籍失败' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, title, author, coverImage, isbn, publisher, publishYear, pages, description, readingProgress, categoryId, tags, bookFileUrl, userId } = data;

    // 更新书籍信息
    const book = await prisma.book.update({
      where: {
        id: id,
      },
      data: {
        title,
        author,
        coverImage,
        isbn,
        publisher,
        publishYear,
        pages,
        description,
        readingProgress,
        categoryId,
        tags,
        bookFileUrl,
        userId, // 确保包含 userId
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error('更新书籍失败:', error);
    return NextResponse.json({ error: '更新书籍失败' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const books = await prisma.book.findMany();
    return NextResponse.json(books);
  } catch (error) {
    console.error('获取书籍数据失败:', error);
    return NextResponse.json({ error: '获取书籍数据失败' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}