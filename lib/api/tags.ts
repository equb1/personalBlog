// lib/api/tags.ts
export async function getTags() {
  try {
    const res = await fetch('/api/tags', {
      next: { tags: ['tags'] } // 可选：Next.js缓存标记
    })
    
    if (!res.ok) {
      throw new Error(`获取标签失败: ${res.statusText}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('获取标签失败:', error)
    return []
  }
}