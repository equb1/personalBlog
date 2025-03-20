// app/components/ServiceWorker.tsx
'use client';

import { useEffect } from 'react';

export default function ServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker 注册成功:', registration);
        })
        .catch((error) => {
          console.error('Service Worker 注册失败:', error);
        });
    }
  }, []);

  return null; // 该组件不需要渲染任何内容
}