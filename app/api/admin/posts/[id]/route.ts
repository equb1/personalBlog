// app/api/admin/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    // 权限验证
    if (!session?.user?.id || !session?.user?.roles?.includes('ADMIN')) {
      return NextResponse.json({ message: '需要管理员权限' }, { status: 403 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { tags: true, category: true },
    });

    if (!post) {
      return NextResponse.json({ message: '文章不存在' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('[POST_GET]', error);
    return NextResponse.json(
      { message: '服务器错误，请查看日志' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId'); // 获取路径参数
    const payload = await request.json();

    // 校验文章ID有效性
    if (!postId || !validateUUID(postId)) {
      return NextResponse.json(
        { code: 'INVALID_ID', message: '无效的文章ID' },
        { status: 400 }
      );
    }

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id: postId }
    });
    if (!existingPost) {
      return NextResponse.json(
        { code: 'POST_NOT_FOUND', message: '文章不存在' },
        { status: 404 }
      );
    }

    // 检查slug唯一性（排除当前文章）
    if (payload.slug !== existingPost.slug) {
      const slugConflict = await prisma.post.findUnique({
        where: { slug: payload.slug }
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
      where: { id: postId },
      data: {
        title: payload.title.trim(),
        slug: payload.slug, // 使用新slug
        content: payload.content,
        status: payload.status,
        excerpt: payload.excerpt,
        contentHtml: payload.contentHtml, // 更新HTML内容
        themeConfig: payload.themeConfig
      },
      include: { category: true, tags: true }
    });

    console.log('数据库更新结果:', JSON.stringify(updatedPost, null, 2));
    return NextResponse.json({ code: 'SUCCESS', data: updatedPost });

  } catch (error) {
    console.error('[PUT_POST_ERROR]', error);
    return NextResponse.json(
      { code: 'SERVER_ERROR', message: '服务器错误' },
      { status: 500 }
    );
  }
}

// UUID校验函数
function validateUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    // 权限验证
    if (!session?.user?.id || !session?.user?.roles?.includes('ADMIN')) {
      return NextResponse.json({ message: '需要管理员权限' }, { status: 403 });
    }

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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 增强权限验证
    if (!session?.user?.id || !session.user.roles?.includes('ADMIN')) {
      return NextResponse.json(
        { code: 'FORBIDDEN', message: '需要管理员权限' },
        { status: 403 }
      );
    }

    const payload = await request.json(); // 唯一一次解析
    console.log('完整请求数据:', JSON.stringify(payload, null, 2));

    // 强制校验slug存在性
    if (!payload.slug) {
      return NextResponse.json(
        { code: 'MISSING_SLUG', error: 'slug为必填字段' },
        { status: 400 }
      );
    }

    // 完整字段验证
    const requiredFields = [
      'title',
      'slug',    // 必须包含前端生成的slug
      'content',
      'categoryId',
      'excerpt',
      'status',
      "contentHtml",
      "themeConfig",
    ];

    const missingFields = requiredFields.filter(field => !payload[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          code: 'MISSING_FIELDS',
          message: '缺少必要字段',
          fields: missingFields
        },
        { status: 400 }
      );
    }

    // 验证分类有效性
    const categoryExists = await prisma.category.findUnique({
      where: { id: payload.categoryId }
    });
    if (!categoryExists) {
      return NextResponse.json(
        { code: 'INVALID_CATEGORY', message: '无效的文章分类' },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.post.findUnique({
      where: { slug: payload.slug }
    });
    if (existingSlug) {
      console.error(`Slug冲突: ${payload.slug}`);
      return NextResponse.json(
        { code: 'SLUG_CONFLICT', message: 'URL标识符已存在' },
        { status: 409 }
      );
    }


    // 创建完整文章数据
    const newPost = await prisma.post.create({
      data: {
        title: payload.title.trim(),
        slug: payload.slug, // 添加兜底逻辑
        content: payload.content,
        excerpt: payload.excerpt,
        coverImage: payload.coverImage || null,
        status: payload.status,
        contentHtml: payload.contentHtml,
        themeConfig: payload.themeConfig,
        metaTitle: payload.metaTitle || payload.title,
        metaDescription: payload.metaDescription || payload.excerpt,
        keywords: Array.isArray(payload.keywords)
          ? payload.keywords.join(',')
          : (payload.keywords || '').toString(), // 兼容字符串输入
        categoryId: payload.categoryId,
        userId: session.user.id,
        tags: {
          connect: payload.tags?.map((tagId: string) => ({ id: tagId })) || []
        }
      },
      include: {
        category: true,
        tags: true
      }
    });
    console.log('数据库写入结果:', JSON.stringify(newPost, null, 2));
    return NextResponse.json({
      code: 'SUCCESS',
      data: {
        ...newPost,
        keywords: newPost.keywords ? newPost.keywords.split(',').filter(Boolean) : []

      }
    }, { status: 201 });

  } catch (error) {
    console.error('[POSTS_API_ERROR]', error);
    return NextResponse.json(
      {
        code: 'SERVER_ERROR',
        message: '服务器错误，请查看日志'
      },
      { status: 500 }
    );
  }
}
