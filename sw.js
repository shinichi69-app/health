const CACHE_NAME = 'calorie-tracker-v1.1';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json'
    '/cal.png'
];

// ติดตั้ง Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// เปิดใช้งาน Service Worker
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
        })
    );
});

// ดักจับการร้องขอ
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // คืนค่าจาก cache ถ้ามี
                if (response) {
                    return response;
                }
                
                // ถ้าไม่มีใน cache ให้ fetch จาก network
                return fetch(event.request).then(
                    response => {
                        // ตรวจสอบว่า response ถูกต้อง
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone response
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
