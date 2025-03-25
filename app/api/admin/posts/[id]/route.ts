import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// UUID校验函数
function validateUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    // 权限验证
    if (!session?.user?.id || !session?.user?.roles?.includes('ADMIN')) {
      return NextResponse.json({ message: '需要管理员权限' }, { status: 403 });
    }

    // 验证ID格式
    if (!validateUUID(params.id)) {
      return NextResponse.json({ message: '无效的文章ID格式' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { 
        tags: true, 
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
    });

    if (!post) {
      return NextResponse.json({ message: '文章不存在' }, { status: 404 });
    }

    // 返回格式化数据
    return NextResponse.json({
      ...post,
      tagIds: post.tags.map(tag => tag.id), // 添加tagIds字段方便前端使用
      keywords: post.keywords?.split(',').filter(Boolean) || []
    });

  } catch (error) {
    console.error('[POST_GET]', error);
    return NextResponse.json(
      { message: '服务器错误，请查看日志' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // 权限验证
    if (!session?.user?.id || !session?.user?.roles?.includes('ADMIN')) {
      return NextResponse.json(
        { code: 'FORBIDDEN', message: '需要管理员权限' },
        { status: 403 }
      );
    }

    // 验证ID格式
    if (!validateUUID(params.id)) {
      return NextResponse.json(
        { code: 'INVALID_ID', message: '无效的文章ID格式' },
        { status: 400 }
      );
    }

    const payload = await request.json();

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
      include: { tags: true }
    });
    
    if (!existingPost) {
      return NextResponse.json(
        { code: 'POST_NOT_FOUND', message: '文章不存在' },
        { status: 404 }
      );
    }

    // 检查slug唯一性（排除当前文章）
    if (payload.slug && payload.slug !== existingPost.slug) {
      const slugConflict = await prisma.post.findFirst({
        where: { 
          slug: payload.slug,
          NOT: { id: params.id }
        }
      });
      if (slugConflict) {
        return NextResponse.json(
          { code: 'SLUG_CONFLICT', message: 'URL标识符已存在' },
          { status: 409 }
        );
      }
    }

    // 执行更新操作
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: payload.title?.trim(),
        slug: payload.slug,
        content: payload.content,
        status: payload.status,
        excerpt: payload.excerpt,
        contentHtml: payload.contentHtml,
        themeConfig: payload.themeConfig,
        coverImage: payload.coverImage,
        metaTitle: payload.metaTitle,
        metaDescription: payload.metaDescription,
        keywords: Array.isArray(payload.keywords) 
          ? payload.keywords.join(',') 
          : payload.keywords,
        categoryId: payload.categoryId,
        // 处理标签更新 - 完全替换现有标签
        tags: payload.tagIds ? {
          set: payload.tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: { 
        category: true, 
        tags: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ 
      code: 'SUCCESS', 
      data: {
        ...updatedPost,
        tagIds: updatedPost.tags.map(tag => tag.id), // 添加tagIds字段
        keywords: updatedPost.keywords?.split(',').filter(Boolean) || []
      }
    });

  } catch (error) {
    console.error('[PUT_POST_ERROR]', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR', message: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    // 权限验证
    if (!session?.user?.id || !session?.user?.roles?.includes('ADMIN')) {
      return NextResponse.json({ message: '需要管理员权限' }, { status: 403 });
    }

    // 验证ID格式
    if (!validateUUID(params.id)) {
      return NextResponse.json(
        { message: '无效的文章ID格式' },
        { status: 400 }
      );
    }

    // 先删除关联的标签关系
    await prisma.postTags.deleteMany({
      where: { postId: params.id }
    });

    // 再删除文章
    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: '删除成功' });

  } catch (error) {
    console.error('[POST_DELETE]', error);
    return NextResponse.json(
      { message: '服务器错误，请查看日志' },
      { status: 500 }
    );
  }
}