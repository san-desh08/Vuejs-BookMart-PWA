//name of the cache
var cacheName = "Bookmart-cache-v1";
//files to cache in the service worker
var filesToCache = [
    "index.html",
    "https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-law-book-100.png",
    "src/main.js",
    "src/assets/main.css",
    "src/assets/base.css",
    "src/assets/style.css",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-art-book-100.png ",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-business-book-100.png ",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-coding-book-100.png ",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-english-book-100.png ",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-geography-book-100.png ",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-history-book-100.png ",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-health-book-100.png ",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-law-book-100.png ",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-math-book-100.png ",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-music-book-100.png ",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-physics-book-100.png ",
    " https://bookmart.eu-north-1.elasticbeanstalk.com/Icons/icons8-sport-book-100.png ",
];

// install the service worker and cache the files
self.addEventListener("install", function (e) {
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[Service Worker] Caching files");
            return cache.addAll(filesToCache);
        })
    );
});

//activate the service worker
self.addEventListener("fetch", function (e) {
    e.respondWith(
        caches.match(e.request).then(function (cachedFile) {
            //if the file is in the cache, retrieve it from there
            if (cachedFile) {
                console.log("[Service Worker] Resource fetched from the cache for: " + e.request.url);
                return cachedFile;
            } else {//if the file is not in the cache, download the file
                return fetch(e.request).then(function (response) {
                    return caches.open(cacheName).then(function (cache) {
                        //add the new file to the cache
                        cache.put(e.request, response.clone());
                        console.log("[Service Worker] Resource fetched and saved in the cache for: " +
                            e.request.url);
                        return response;
                    });
                });
            }
        })
    );
});