const CACHE_NAME = 'calorie-tracker-v1'; // ขยับเวอร์ชันเพื่อให้เบราว์เซอร์รู้ว่ามีไฟล์ใหม่
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './cal.png'
];

// ติดตั้ง Service Worker
self.addEventListener('install', event => {
    self.skipWaiting(); // บังคับให้ Service Worker ตัวใหม่อัปเดตทำงานทันที
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// เปิดใช้งาน Service Worker และลบ Cache เก่า
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // เข้าควบคุมหน้าเว็บทันทีโดยไม่ต้องรอ Reload
    );
});

// ดักจับการร้องขอข้อมูล (Fetch)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then(
                    response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                            
                        return response;
                    }
                );
            })
    );
});
