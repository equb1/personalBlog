// lib/api/categories.ts
export async function getCategories() {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('获取分类失败');
      return res.json();
    } catch (error) {
      console.error('获取分类失败:', error);
      return [];
    }
  }