import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  try {
    const carouselItems = await prisma.carousel.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        image: true,
        altText: true,
        articleId: true
      }
    });
    res.status(200).json(carouselItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch carousel' });
  }
}
