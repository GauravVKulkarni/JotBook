export const checkPWAStatus = async () => {
  // Check if service worker is supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker is not supported');
    return;
  }

  try {
    // Get all service worker registrations
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log('Service Worker Registrations:', registrations);

    // Get all caches
    const cacheNames = await caches.keys();
    console.log('Cache Names:', cacheNames);

    // For each cache, show its contents
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      console.log(`Cache "${cacheName}" contains:`, keys.map(req => req.url));
    }
  } catch (error) {
    console.error('Error checking PWA status:', error);
  }
};