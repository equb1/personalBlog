// // app/api/tags/route.ts
// import { NextResponse } from 'next/server'
// import prisma from '@/lib/prisma'

// export async function GET() {
//   try {
//     const tags = await prisma.tag.findMany()
//     return NextResponse.json(tags)
//   } catch (error) {
//     return NextResponse.json(
//       { error: '获取标签失败' },
//       { status: 500 }
//     )
//   }
// }