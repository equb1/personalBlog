// components/admin/Sidebar.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { IconMenu2, IconBook, IconArticle, IconPhoto, IconUsers, IconSettings } from '@tabler/icons-react'

// 优化后的菜单项配置
const menuItems = [
  {
    name: '文章管理',
    path: '/admin/posts',
    icon: <IconArticle className="w-5 h-5" />
  },
  {
    name: '媒体管理',
    path: '/admin/media',
    icon: <IconPhoto className="w-5 h-5" />
  },
  {
    name: '书籍管理',
    path: '/admin/books',
    icon: <IconBook className="w-5 h-5" />
  },
  {
    name: '用户管理',
    path: '/admin/users',
    icon: <IconUsers className="w-5 h-5" />
  },
  {
    name: '系统设置',
    path: '/admin/settings',
    icon: <IconSettings className="w-5 h-5" />
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 持久化侧边栏状态
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState) setIsCollapsed(JSON.parse(savedState))
  }, [])

  const toggleSidebar = () => {
    setIsTransitioning(true)
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
    
    // 等待过渡动画完成
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <aside className={cn(
      "bg-white border-r h-screen fixed left-0 top-0",
      "transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b flex items-center justify-between h-16">
        {/* 标题添加过渡效果 */}
        <h2 className={cn(
          "text-lg font-semibold overflow-hidden",
          "transition-all duration-300",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}>
          管理后台
        </h2>
        <button
          onClick={toggleSidebar}
          className="hover:bg-gray-100 p-2 rounded-lg shrink-0"
        >
          <IconMenu2 className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md group relative',
              'transition-colors duration-200',
              pathname.startsWith(item.path)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
            title={item.name}
          >
            {item.icon}
            
            {/* 文字容器添加过渡效果 */}
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              "whitespace-nowrap", // 防止文字换行
              isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
            )}>
              <span className="text-sm ml-2">{item.name}</span>
            </div>

            {/* 折叠提示优化 */}
            {isCollapsed && !isTransitioning && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
                {item.name}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  )
}