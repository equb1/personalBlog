// 合并类名的函数，过滤掉假值并将有效类名用空格连接
export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// 格式化日期的函数，将日期字符串或日期对象格式化为 'YYYY-MM-DD' 格式
export function formatDate(dateString?: string | Date) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
  });
}

// 导入 GridCardData 和 TechCategory 类型
import { GridCardData, TechCategory } from '@/types/content';

// 将数据转换为 GridCardData 类型的函数
export const convertToGridCardData = (item: GridCardData): GridCardData => ({
  ...item,
  cover: item.cover ?? (item.thumbnail ? { 
      src: item.thumbnail, 
      alt: item.title 
  } : undefined),
  techStack: item.techStack?.map(tech => ({
      name: tech.name,
      proficiency: typeof tech.proficiency === 'number' ? tech.proficiency : 0,
      category: tech.category as TechCategory
  }))
});