import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''

  try {
    return NextResponse.json(MediaList)
  } catch (error) {
    if (error) {
      console.error('[MEDIA_GET_ERROR]', error)
    } else {
      console.error('[MEDIA_GET_ERROR] Unknown error')
    }
  
    return NextResponse.json(
      { error: "Failed to fetch media data" },
      { status: 500 }
    )
  }
  
}
