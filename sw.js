/* App Nelore MRA — guarda as telas no aparelho pra abrir sem internet.
   Páginas: tenta a internet primeiro (pega a versão nova) e cai pro guardado se estiver sem sinal.
   Bibliotecas (Firebase, Excel): usa o guardado e atualiza quando der. Dados do Firebase NÃO passam por aqui
   (o próprio Firebase guarda e envia quando a internet volta). */
const CACHE = 'app-nelore-mra-v54';
const PAGINAS = ['./', './index.html', './logo.webp', './icon-192.png', './manifest.webmanifest',
  './barra-app.js', './teclado.js', './caderneta/index.html', './estoque/index.html', './iatf/index.html', './custos/index.html', './contabil/index.html'];
const LIBS = [
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
];
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all([...PAGINAS, ...LIBS].map(u => fetch(u, u.startsWith('http') ? {mode: 'no-cors'} : {})
      .then(r => c.put(u, r)).catch(() => {})));
    self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (/googleapis\.com|firebaseio\.com|identitytoolkit|securetoken/.test(url.host)) return; // dados e login: direto
  const mesmoSite = url.origin === self.location.origin;
  if (mesmoSite) {
    // internet primeiro; sem sinal, usa o que está guardado
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
      .catch(async () => (await caches.match(req, {ignoreSearch: true})) || (await caches.match('./index.html'))));
  } else if (/gstatic\.com|jsdelivr\.net|cdnjs\.cloudflare\.com/.test(url.host)) {
    e.respondWith(caches.match(req).then(g => g || fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })));
  }
});
