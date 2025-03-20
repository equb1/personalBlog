// app/auth/error/page.tsx
'use client'
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// 定义一个单独的组件来处理搜索参数
function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-2xl font-bold mb-6 text-center">登录错误</h1>
      <p className="text-red-600">{error}</p>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={<div className="bg-white p-8 rounded-lg shadow-md w-96">加载中...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
