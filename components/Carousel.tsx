// components/Carousel.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"

export interface CarouselImage {
  id: string
  src: string
  alt: string
  href?: string
  overlay?: {
    title: string
    description: string
    metadata?: Array<{
      label: string
      value: string
      href?: string
      icon?: React.ReactNode
    }>
  }
}

interface CarouselProps {
  images: CarouselImage[]
  autoPlay?: boolean
  interval?: number
}

export default function Carousel({
  images,
  autoPlay = true,
  interval = 5000
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay)

  useEffect(() => {
    if (!isAutoPlay || images.length <= 1) return
    
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [isAutoPlay, images.length, interval, currentSlide])

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % images.length)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), interval)
  }

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + images.length) % images.length)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), interval)
  }

  if (!images.length) {
    return (
      <div className="h-[60vh] bg-gray-100 flex items-center justify-center rounded-xl">
        <p className="text-gray-500">暂无精选内容</p>
      </div>
    )
  }

  return (
    <section className="relative h-[60vh] overflow-hidden bg-gradient-to-r from-gray-900 to-gray-900/50">
      <div className="h-full w-[80vw] mx-auto px-4">
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          <div
            className="flex h-full transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${images.length * 100}%`
            }}
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="h-full w-full flex-shrink-0 relative"
              >
                {/* 包裹链接 */}
                <Link
                  href={image.href || '#'}
                  className="block h-full w-full"
                  aria-label={`查看文章：${image.overlay?.title}`}
                >
                  <div className="h-full w-full relative overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="80vw"
                      className="object-cover object-center"
                      priority={currentSlide === 0}
                    />
                  </div>
                </Link>

                {/* 覆盖层内容 */}
                {image.overlay && (
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="max-w-4xl mx-auto">
                      <h2 className="text-4xl font-bold text-white mb-2">
                        {image.overlay.title}
                      </h2>
                      <p className="text-gray-200 text-lg mb-4">
                        {image.overlay.description}
                      </p>
                      
                      <div className="flex gap-4 text-sm">
                        {image.overlay.metadata?.map((meta, i) => (
                          meta.href ? (
                            <Link
                              key={i}
                              href={meta.href}
                              className="flex items-center gap-2 hover:text-blue-300 transition-colors text-white/80 hover:text-white"
                            >
                              {meta.icon && (
                                <span className="shrink-0">{meta.icon}</span>
                              )}
                              <span>{meta.label}：</span>
                              <span className="font-medium">{meta.value}</span>
                            </Link>
                          ) : (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-white/80"
                            >
                              {meta.icon && (
                                <span className="shrink-0">{meta.icon}</span>
                              )}
                              <span>{meta.label}：</span>
                              <span className="font-medium">{meta.value}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 导航指示器 */}
          {images.length > 1 && (
            <>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentSlide === index
                        ? 'bg-white scale-125'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`跳转到第 ${index + 1} 张`}
                  />
                ))}
              </div>

              {/* 导航按钮 */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all shadow-lg hover:scale-105"
                aria-label="上一张"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all shadow-lg hover:scale-105"
                aria-label="下一张"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
