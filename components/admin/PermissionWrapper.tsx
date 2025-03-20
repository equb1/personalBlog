'use client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function PermissionWrapper({
  requiredRoles = ['ADMIN'],
  children
}: {
  requiredRoles?: string[]
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      const userRoles = session.user?.roles || []
      const hasPermission = requiredRoles.some(role => 
        userRoles.includes(role.toUpperCase())
      )
      
      if (!hasPermission) {
        router.replace('/admin/unauthorized')
      }
    }
  }, [status, session, requiredRoles, router]) // 添加 router 到依赖数组

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}