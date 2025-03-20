import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true }
  })
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const data = await request.json()
  
  try {
    const newPost = await prisma.post.create({
      data: {
        ...data,
        isPublished: false // 默认存为草稿
      }
    })
    return NextResponse.json(newPost)
  } catch (error) {
    return NextResponse.json(
      { error: '创建失败' },
      { status: 500 }
    )
  }
}