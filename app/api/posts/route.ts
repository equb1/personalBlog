// app/api/latest-posts/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 假设你在 @/lib/prisma 中初始化了 PrismaClient
import { getLatestPosts } from '@/lib/api/posts';



export async function GET() {
    try {
        const latestPosts = await getLatestPosts();
        return NextResponse.json(latestPosts);
    } catch (error) {
        console.error('Error fetching latest posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}