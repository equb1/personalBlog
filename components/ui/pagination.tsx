'use client'

import Link from 'next/link'

export function Pagination({
  currentPage,
  totalPages
}: {
  currentPage: number
  totalPages: number
}) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }, (_, i) => (
        <Link
          key={i + 1}
          href={`/?page=${i + 1}`}
          className={`px-4 py-2 rounded ${
            currentPage === i + 1
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {i + 1}
        </Link>
      ))}
    </div>
  )
}