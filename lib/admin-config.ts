// lib/admin-config.ts
import { Prisma } from "@prisma/client"

type FieldType = 'text' | 'richtext' | 'image' | 'select' | 'datetime'

interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: readonly string[]
}

interface CategoryConfig<T extends string> {
  model: T
  icon: string
  apiPath: string
  fields: readonly FieldConfig[]
}

// 使用明确的类型定义
export const categories = {
  posts: {
    model: 'Post',
    icon: '📝',
    apiPath: 'posts',
    fields: [
      { name: 'title', label: '标题', type: 'text', required: true },
      { name: 'content', label: '内容', type: 'richtext' },
      { name: 'coverImage', label: '封面图', type: 'image' },
      { name: 'categoryId', label: '分类', type: 'select', options: ['tech', 'design'] as const }
    ] as const
  },
  media: {
    model: 'Media',
    icon: '🎥',
    apiPath: 'media',
    fields: [
      { name: 'title', label: '标题', type: 'text' },
      { name: 'type', label: '类型', type: 'select', options: ['video', 'audio'] as const },
      { name: 'cover', label: '封面', type: 'image' }
    ] as const
  }
} as const satisfies Record<string, CategoryConfig<string>>

export type CategoryKey = keyof typeof categories
export type CategoryConfigType<T extends CategoryKey> = typeof categories[T]

// 类型守卫函数
export function isValidCategory(key: string): key is CategoryKey {
  return key in categories
}