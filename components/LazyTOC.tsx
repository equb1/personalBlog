// components/LazyTOC.tsx
'use client';

import dynamic from 'next/dynamic';
import { Heading } from '@/types'; // 假设你有一个类型定义文件

const TableOfContents = dynamic(() => import('@/components/TableOfContents'), {
  ssr: false,
  loading: () => <div>加载目录中...</div>,
});

interface LazyTOCProps {
  headings: Heading[];
  onClick?: () => void; // 添加 onClick 属性
}

export default function LazyTOC({ headings, onClick }: LazyTOCProps) {
  return <TableOfContents headings={headings} onClick={onClick} />;
}