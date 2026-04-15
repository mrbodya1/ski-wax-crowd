// WaxSense Service Worker
const CACHE_NAME = 'waxsense-v3';

// НЕ кэшируем эти URL (пропускаем напрямую)
const BYPASS_URLS = [
  'supabase.co',
  'anysqgzlkwjzbkphmsdb'
];

// Установка
self.addEventListener('install', event => {
  console.log('🛠️ SW: install');
  self.skipWaiting();
});

// Активация
self.addEventListener('activate', event => {
  console.log('🛠️ SW: activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Проверяем, нужно ли пропустить URL
  const shouldBypass = BYPASS_URLS.some(bypass => url.includes(bypass));
  
  if (shouldBypass) {
    // Пропускаем запросы к Supabase — пусть идут напрямую
    console.log('🔄 SW: bypass', url.substring(0, 60));
    return;
  }
  
  // Для всех остальных — обычная обработка
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
