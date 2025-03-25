import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
      const tags = await prisma.tag.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: {
              posts: true,
              books: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
  
      return NextResponse.json(tags, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    } catch (error) {
      console.error('Error fetching tags:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tags' },
        { status: 500 }
      )
    }
  }
export async function POST(request: Request) {
  try {
    const { name, slug } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const newTag = await prisma.tag.create({
      data: {
        name,
        slug
      }
    })

    return NextResponse.json(newTag, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}