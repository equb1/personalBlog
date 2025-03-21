import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import ServiceWorker from '@/components/ServiceWorker'; // 引入 ServiceWorker 组件
import './globals.css'; // 引入全局 CSS 样式文件

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "技术博客 | 前沿开发实践",
  description: "探索全栈开发与架构设计的最佳实践",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* 预加载主题样式 */}
        <link rel="stylesheet" href="/themes/cyanosis.css" />
        {/* 预加载其他静态资源 */}
        <link rel="preload" href="/_next/static/chunks/main-app.js" as="script" />
        <link rel="preload" href="/_next/static/chunks/app-pages-internals.js" as="script" />
        <link rel="preload" href="/_next/static/chunks/app/layout.js" as="script" />
        <link rel="preload" href="/_next/static/chunks/app/page.js" as="script" />
      </head>
      <body className={` antialiased flex flex-col min-h-screen`}>
        <Providers>
          {children}
        </Providers>
        <ServiceWorker />
      </body>
    </html>
  );
}