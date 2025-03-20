// components/MobileTOC.tsx
'use client';

import { useState } from 'react';
import { Heading } from '@/types';
import LazyTOC from '@/components/LazyTOC';

export default function MobileTOC({ headings }: { headings: Heading[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed right-4 bottom-16 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 目录抽屉 */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-72 bg-white/95 dark:bg-gray-800/95 p-4 shadow-xl backdrop-blur-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 mt-16">
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              <LazyTOC 
              headings={headings}
              onClick={() => setIsOpen(false)}  
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}