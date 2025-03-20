// components/ui/badge.tsx
'use client'

import { cn } from '@/lib/utils'

export function Badge({
  variant = 'default',
  className,
  children,
}: {
  variant?: 'default' | 'secondary'
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' 
          ? 'bg-blue-100 text-blue-800'
          : 'bg-gray-100 text-gray-800',
        className
      )}
    >
      {children}
    </span>
  )
}