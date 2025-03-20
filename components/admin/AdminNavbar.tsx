// components/admin/AdminNavbar.tsx
'use client';
import { signOut } from 'next-auth/react';

export default function AdminNavbar() {
  const handleLogout = async () => {
    await signOut({ 
      redirect: false,
      callbackUrl: '/auth/login'
    });
    // 强制清除客户端 Cookie
    document.cookie = 'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/auth/login';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">管理后台</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-100"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}