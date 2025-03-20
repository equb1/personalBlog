// lib/api/tags.ts
export async function getTags() {
    try {
      const res = await fetch('/api/tags');
      if (!res.ok) throw new Error('获取标签失败');
      return res.json();
    } catch (error) {
      console.error('获取标签失败:', error);
      return [];
    }
  }