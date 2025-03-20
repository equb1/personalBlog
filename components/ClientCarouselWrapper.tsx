'use client';

import dynamic from 'next/dynamic';
import { CarouselImage } from '@/types/content';

const ClientCarousel = dynamic(() => import('@/components/Carousel'), {
  ssr: false, // 只在客户端渲染
  loading: () => (
    <div className="h-[60vh] bg-gray-100 animate-pulse rounded-xl min-h-[400px] w-full" />
  ),
});

interface ClientCarouselWrapperProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ClientCarouselWrapper({
  images,
  autoPlay,
  interval,
}: ClientCarouselWrapperProps) {
  return (
    <ClientCarousel images={images} autoPlay={autoPlay} interval={interval} />
  );
}