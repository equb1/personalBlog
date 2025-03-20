// components/admin/Breadcrumb.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  return (
    <nav className="mx-auto px-4 py-8 max-w-6xl" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`
          const isLast = index === pathSegments.length - 1

          return (
            <li key={segment}>
              <div className="flex items-center">
                {index > 0 && (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {isLast ? (
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    {segment}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {segment}
                  </Link>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}