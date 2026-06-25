// Service Worker do Escala do Louvor
// Necessário para o Chrome/Android oferecer "Instalar app".
// Mantém cache simples do shell do app para abrir mais rápido / funcionar offline.

const CACHE_NAME = 'escala-louvor-v1';
const ARQUIVOS_PARA_CACHE = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_PARA_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NAME)
          .map((nome) => caches.delete(nome))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Estratégia: tenta a rede primeiro (dados do Firebase precisam ser sempre atuais);
  // se falhar (sem internet), tenta servir do cache.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
