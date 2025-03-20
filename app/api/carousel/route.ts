// app/api/carousel/route.ts
import prisma from '@/lib/prisma'


export async function GET() {
    const items = await prisma.carouselItem.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        content: true,
        category: true,
        createdAt: true
      }
    })

// interface CarouselImage {
//   id: string
//   src: string
//   alt: string
//   href?: string
//   overlay?: {
//     title: string
//     description: string
//     metadata?: Array<{
//       label: string
//       value: string
//       href?: string
//       icon?: React.ReactNode
//     }>
//   }
// }
}
