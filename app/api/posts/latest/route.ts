import { NextResponse } from 'next/server'
import { getLatestPosts } from '@/lib/api'

export const dynamic = 'force-dynamic' // 确保动态获取

export async function GET() {
  try {
    const posts = await getLatestPosts()
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}