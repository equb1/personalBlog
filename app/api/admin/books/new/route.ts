// app/api/admin/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, author, coverImage, isbn, publisher, publishYear, pages, description, readingProgress, categoryId, tags, bookFileUrl, userId } = data;

    // 使用 upsert 方法处理书籍的创建和更新
    const book = await prisma.book.upsert({
      where: {
        isbn: isbn, // 唯一标识符
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
        tags,
        bookFileUrl,
        userId, // 确保包含 userId
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
        tags,
        bookFileUrl,
        userId, // 确保包含 userId
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