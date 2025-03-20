const CACHE_NAME = 'my-cache-v1';
// 缓存的资源列表
const urlsToCache = [
  '/',
  '/index.html',
  '/themes/cyanosis.css',
  '/_next/static/chunks/main-app.js',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/app-pages-internals.js',
  '/_next/static/chunks/app/layout.js',
  '/_next/static/chunks/app/page.js'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('缓存资源:', urlsToCache);
      return cache.addAll(urlsToCache).catch((error) => {
        console.error('缓存失败:', error);
      });
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // 如果网络请求失败，尝试从缓存中获取
      return caches.match(event.request);
    })
  );
});

// 检查并更新缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('清除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});