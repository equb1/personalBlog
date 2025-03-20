// components/TableOfContents.tsx
'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  onClick?: () => void;
}

// 在组件顶部添加清理哈希的逻辑
const useHashCleanup = () => {
  useEffect(() => {
    // 清除URL中的哈希
    if (window.location.hash) {
      window.history.replaceState(null, '', ' ');
    }
  }, []);
};


export default function TableOfContents({ headings, onClick }: TableOfContentsProps) {
  useHashCleanup(); // 使用清理逻辑

  // 处理锚点点击
  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 100; // 根据你的导航栏高度调整
      const offsetPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // 状态：当前活动的锚点
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  // 监听滚动事件，更新活动锚点
  useEffect(() => {
    let isMounted = true;
    const handleScroll = () => {
      
      let newActiveHeading: string | null = null;
      let minDistance = Infinity;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = rect.top;

          // 找到最接近视口顶部的锚点
          if (distance >= 0 && distance < minDistance) {
            minDistance = distance;
            newActiveHeading = heading.id;
          }
        }
      }

      if (newActiveHeading !== activeHeading) {
        setActiveHeading(newActiveHeading);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, activeHeading]);

  return (
    <nav className="bg-custom-beige  dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        目录导航
      </h3>
      <div className="space-y-2">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault(); // 阻止默认跳转行为
              onClick?.();
              handleHeadingClick(heading.id);
            }}
            className={`block text-sm ${
              heading.level === 1 ? 'pl-0' : heading.level === 2 ? 'pl-3' : 'pl-6'
            } text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 ${
              activeHeading === heading.id ? 'font-bold text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </nav>
  );
}