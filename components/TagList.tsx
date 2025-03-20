// components/TagList.tsx
import Link from 'next/link'

interface Tag {
  id: string
  name: string
  slug: string
}

export function TagList({ tags }: { tags: Tag[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-gray-500">标签：</span>
      {tags.map(tag => (
        <Link
          key={tag.id}
          href={`/tags/${tag.slug}`}
          className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-sm"
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  )
}
