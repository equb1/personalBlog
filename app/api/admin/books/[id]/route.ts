

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 获取单本书籍的详细信息
export async function GET(request: NextRequest, { params }: { params: any }) {
  const { id } = params; // 直接解构 params，不需要 await
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        user: true,
        tags: true,
        category: true,
      },
    });
    if (!book) {
      return NextResponse.json({ error: "书籍不存在" }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (error) {
    console.error("获取书籍失败:", error);
    return NextResponse.json({ error: "获取书籍失败" }, { status: 500 });
  }
}

// 编辑书籍信息
export async function PUT(request: NextRequest, { params }: { params: any }) {
  const { id } = params; // 直接解构 params，不需要 await
  const data = await request.json();
  try {
    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title: data.title,
        author: data.author,
        coverImage: data.coverImage,
        isbn: data.isbn,
        publisher: data.publisher,
        publishYear: data.publishYear,
        pages: data.pages,
        description: data.description,
        readingProgress: data.readingProgress,
        categoryId: data.categoryId,
        tags: {
          set: data.tags.map((tagId: string) => ({ id: tagId })), // 更新标签关联
        },
      },
    });
    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("更新书籍失败:", error);
    return NextResponse.json({ error: "更新书籍失败" }, { status: 500 });
  }
}

// 删除书籍
export async function DELETE(request: NextRequest, { params }: { params: any }) {
  const { id } = params; // 直接解构 params，不需要 await
  try {
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ message: "书籍删除成功" });
  } catch (error) {
    console.error("删除书籍失败:", error);
    return NextResponse.json({ error: "删除书籍失败" }, { status: 500 });
  }
}