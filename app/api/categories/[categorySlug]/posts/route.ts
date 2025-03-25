// app/api/categories/[categorySlug]/posts/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 明确声明为动态路由
export const dynamic = 'force-dynamic' 
export const revalidate = 0

export async function GET(
  request: Request,
  { params }: { params: { categorySlug: string } }
) {
  const data = await prisma.post.findMany({
    where: { 
      category: { slug: params.categorySlug } 
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: { select: { name: true } }
    }
  })

  return NextResponse.json(data)
}