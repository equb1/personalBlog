// app/api/categories/[categorySlug]/posts/[postSlug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { categorySlug: string; postSlug: string } }) {
    console.log('Received categorySlug:', params.categorySlug);
    console.log('Received postSlug:', params.postSlug);
    try {
        const category = await prisma.category.findUnique({
            where: { slug: params.categorySlug },
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        const post = await prisma.post.findFirst({
            where: {
                slug: params.postSlug,
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

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}