// app/page.tsx
import { Metadata } from 'next'
import HomePage from './HomePage'
import { getLatestPosts } from '@/lib/api'

export const revalidate = 3600 // 1小时重新验证
export const dynamic = 'force-static' // 尽可能静态生成

export default async function Page() {
  const latestPosts = await getLatestPosts()
  return <HomePage initialPosts={latestPosts} />
}

export const metadata: Metadata = {
  title: '首页',
  description: '欢迎访问我的博客'
}