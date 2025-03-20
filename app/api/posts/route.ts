// app/api/latest-posts/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 假设你在 @/lib/prisma 中初始化了 PrismaClient

export async function getLatestPosts() {
    const posts = await prisma.post.findMany({
        
        where: {
            isPublished: true,
            status: 'PUBLISHED'
        },
        include: {
            user: true,
            category: true,
            tags: true
        },
        orderBy: {
            publishedAt: 'desc'
        },
        take: 4
    });
    console.log('Returned posts:', posts); // 打印返回的文章数据
    return posts;
}

export async function GET() {
    try {
        const latestPosts = await getLatestPosts();
        return NextResponse.json(latestPosts);
    } catch (error) {
        console.error('Error fetching latest posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}