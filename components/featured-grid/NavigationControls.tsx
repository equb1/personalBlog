// components/featured-section/NavigationControls.tsx
'use client'

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid'

interface NavigationControlsProps {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
}

/**
 * 导航控制组件，包含：
 * - 前进/后退按钮
 * - 分页指示器
 * - 键盘导航支持
 */
export const NavigationControls = ({
  current,
  total,
  onPrev,
  onNext
}: NavigationControlsProps) => {
  return (
    <div className="mt-6 flex items-center justify-center space-x-6">
      {/* 上一步按钮 */}
      <button
        onClick={onPrev}
        className="p-2 rounded-full bg-white shadow-md hover:shadow-lg 
                   transition-shadow disabled:opacity-50"
        disabled={current === 0}
        aria-label="Previous item"
      >
        <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
      </button>

      {/* 分页指示器 */}
      <div className="flex space-x-2">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors 
                       ${index === current 
                        ? 'bg-blue-500' 
                        : 'bg-gray-300 hover:bg-gray-400'}`}
          />
        ))}
      </div>

      {/* 下一步按钮 */}
      <button
        onClick={onNext}
        className="p-2 rounded-full bg-white shadow-md hover:shadow-lg 
                   transition-shadow disabled:opacity-50"
        disabled={current === total - 1}
        aria-label="Next item"
      >
        <ArrowRightIcon className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  )
}
