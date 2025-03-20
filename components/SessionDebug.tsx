// components/SessionDebug.tsx
'use client'
import { useSession } from 'next-auth/react'

export default function SessionDebug() {
  const { data: session, status } = useSession()

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">会话状态</h3>
      <pre className="text-sm">
        {JSON.stringify({ status, session }, null, 2)}
      </pre>
    </div>
  )
}