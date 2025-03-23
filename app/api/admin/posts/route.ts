import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

    // 唯一一次解析请求体
    const payload = await request.json();
    //console.log('服务端收到数据:', JSON.stringify(payload, null, 2));

    // 增强字段校验
    const requiredFields = [
      'title', 
      'slug', 
      'content', 
      'categoryId',
      'excerpt', // 添加摘要为必填字段
      'contentHtml',
      'themeConfig'
    ];

    const missingFields = requiredFields.filter(field => !payload[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          code: 'MISSING_FIELDS',
          error: `缺少必填字段: ${missingFields.join(', ')}`,
          fields: missingFields
        },
        { status: 400 }
      );
    }

    // 强制校验slug存在性
    if (!payload.slug) {
      return NextResponse.json(
        { code: 'MISSING_SLUG', error: 'slug为必填字段' },
        { status: 400 }
      );
    }

    // 检查slug唯一性
    const existing = await prisma.post.findUnique({
      where: { slug: payload.slug }
    });
    if (existing) {
      console.error(`Slug冲突: ${payload.slug}`);
      return NextResponse.json(
        { code: 'SLUG_CONFLICT', error: 'URL标识符已存在' },
        { status: 409 }
      );
    }

    // 创建记录
    const newPost = await prisma.post.create({
      data: {
        title: payload.title.trim(),
        slug: payload.slug, // 使用payload中的slug
        content: payload.content,
        categoryId: payload.categoryId,
        userId: session.user.id,
        status: payload.status,
        excerpt: payload.excerpt,
        contentHtml: payload.contentHtml || '', // 新增字段
        coverImage: payload.coverImage,
        themeConfig: payload.themeConfig,
        metaTitle: payload.metaTitle || payload.title,
        metaDescription: payload.metaDescription || payload.excerpt,
        keywords: Array.isArray(payload.keywords) 
          ? payload.keywords.join(',') 
          : (payload.keywords || '')
      },
      include: {
        category: true,
        tags: true
      }
    });

    return NextResponse.json({
      code: 'SUCCESS',
      data: {
        ...newPost,
        keywords: newPost.keywords?.split(',').filter(Boolean) || []
      }
    }, { status: 201 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[POSTS_POST_ERROR]', error);
      return NextResponse.json(
        { error: error.message || '服务器错误' },
        { status: 500 }
      );
    } else {
      console.error('[POSTS_POST_ERROR]', error);
      return NextResponse.json(
        { error: '服务器错误' },
        { status: 500 }
      );
    }
  }
}

// 获取所有文章
export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json({ posts });
}

// 删除文章
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('id');

  if (!postId) {
    return NextResponse.json({ error: '缺少文章 ID' }, { status: 400 });
  }

  await prisma.post.delete({ where: { id: postId } });
  return NextResponse.json({ success: true });
}