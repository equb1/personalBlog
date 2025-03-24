import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SegmentParams = { categorySlug: string; postSlug: string };
type RouteContext = { params: Promise<SegmentParams> };

export async function GET(request: NextRequest, context: RouteContext) {
    const { categorySlug, postSlug } = await context.params; // 使用 await 解析 params
    console.log('Received categorySlug:', categorySlug);
    console.log('Received postSlug:', postSlug);

    try {
        const category = await prisma.category.findUnique({
            where: { slug: categorySlug },
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        const post = await prisma.post.findFirst({
            where: {
                slug: postSlug,
                categoryId: category.id
            },
            include: {
                user: true,
                category: true,
                tags: true
            }
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const response = NextResponse.json(post);
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}