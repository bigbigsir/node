"use strict";importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"),importScripts("https://cdn.60kg.top/web/precache-manifest.ee293605f92e25492a92b342d5551f31.js"),self.addEventListener("message",function(e){e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),workbox.core.clientsClaim(),self.__precacheManifest=[].concat(self.__precacheManifest||[]),workbox.precaching.precacheAndRoute(self.__precacheManifest,{}),workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("https://cdn.60kg.top/web/index.html"),{blacklist:[/^\/_/,/\/[^/?]+\.[^/]+$/]});