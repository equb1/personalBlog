// app/api/categories/[categorySlug]/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { categorySlug: string } }) {
    try {
        const { categorySlug } = await params;
        const decodedCategorySlug = decodeURIComponent(categorySlug);
        //console.log('Decoded categorySlug:', decodedCategorySlug);

        const category = await prisma.category.findUnique({
            where: { slug: decodedCategorySlug },
        });

        if (!category) {
            //console.log('Category not found in database for slug:', decodedCategorySlug);
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        const posts = await prisma.post.findMany({
            where: { categoryId: category.id },
            include: {
                user: true,
                category: true,
                tags: true
            }
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}