import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

    // 解析请求体
    const payload = await request.json();
    console.log('服务端收到数据:', JSON.stringify(payload, null, 2));

    // 增强字段校验
    const requiredFields = [
      'title', 
      'slug', 
      'content', 
      'categoryId',
      'excerpt',
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
        slug: payload.slug,
        content: payload.content,
        categoryId: payload.categoryId,
        userId: session.user.id,
        status: payload.status,
        excerpt: payload.excerpt,
        contentHtml: payload.contentHtml || '',
        coverImage: payload.coverImage,
        themeConfig: payload.themeConfig,
        metaTitle: payload.metaTitle || payload.title,
        metaDescription: payload.metaDescription || payload.excerpt,
        keywords: Array.isArray(payload.keywords) 
          ? payload.keywords.join(',') 
          : (payload.keywords || ''),
        // 处理标签关联
        tags: payload.tagIds ? {
          connect: payload.tagIds.map((id: string) => ({ id }))
        } : undefined
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
        keywords: newPost.keywords?.split(',').filter(Boolean) || [],
        // 确保返回标签ID数组
        tagIds: newPost.tags?.map(tag => tag.id) || []
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

// 更新 PUT 方法以支持标签
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    if (!postId) return new NextResponse('Missing post ID', { status: 400 });

    const payload = await request.json();

    // 更新文章并处理标签
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: payload.title?.trim(),
        slug: payload.slug,
        content: payload.content,
        categoryId: payload.categoryId,
        status: payload.status,
        excerpt: payload.excerpt,
        contentHtml: payload.contentHtml,
        coverImage: payload.coverImage,
        themeConfig: payload.themeConfig,
        metaTitle: payload.metaTitle,
        metaDescription: payload.metaDescription,
        keywords: Array.isArray(payload.keywords) 
          ? payload.keywords.join(',') 
          : (payload.keywords || ''),
        // 更新标签关联 - 完全替换现有标签
        tags: payload.tagIds ? {
          set: payload.tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        category: true,
        tags: true
      }
    });

    return NextResponse.json({
      code: 'SUCCESS',
      data: {
        ...updatedPost,
        keywords: updatedPost.keywords?.split(',').filter(Boolean) || [],
        tagIds: updatedPost.tags?.map(tag => tag.id) || []
      }
    });

  } catch (error: unknown) {
    console.error('[POSTS_PUT_ERROR]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}

// 获取所有文章
// export async function GET() {
//   try {
//     const posts = await prisma.post.findMany({
//       include: {
//         category: true,
//         tags: true
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });

//     return NextResponse.json({
//       data: posts.map(post => ({
//         ...post,
//         keywords: post.keywords?.split(',').filter(Boolean) || [],
//         tagIds: post.tags?.map(tag => tag.id) || []
//       }))
//     });

//   } catch (error) {
//     console.error('[POSTS_GET_ERROR]', error);
//     return NextResponse.json(
//       { error: '获取文章列表失败' },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json({ posts });
}
// 删除文章
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({ error: '缺少文章 ID' }, { status: 400 });
    }

    // 先删除关联的标签关系
    await prisma.postTags.deleteMany({
      where: { postId }
    });

    // 再删除文章
    await prisma.post.delete({ where: { id: postId } });
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[POSTS_DELETE_ERROR]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '删除文章失败' },
      { status: 500 }
    );
  }
}
