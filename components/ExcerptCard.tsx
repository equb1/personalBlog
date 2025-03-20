// components/ExcerptCard.tsx
'use client';

import { useState } from 'react';

interface ExcerptCardProps {
  excerpt: string;
}

export default function ExcerptCard({ excerpt }: ExcerptCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-blue-200 dark:border-gray-600 shadow-sm">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
          文章摘要
        </h3>
        <svg
          className={`w-5 h-5 transform transition-transform duration-500 ${
            !isCollapsed ? 'rotate-180' : ''
          } text-blue-600 dark:text-blue-300`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {!isCollapsed && (
        <div className="px-4 pb-4 transition-all duration-500 ease-in-out">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {excerpt}
          </p>
        </div>
      )}
    </div>
  );
}