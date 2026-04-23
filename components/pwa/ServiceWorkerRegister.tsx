"use client";

import { useEffect } from "react";
import { canUseServiceWorker } from "@/lib/pwa";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!canUseServiceWorker()) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      Promise.all([
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) =>
            Promise.all(registrations.map((registration) => registration.unregister()))
          )
          .then((results) => results.some(Boolean))
          .catch(() => false),
        "caches" in window
          ? window.caches
              .keys()
              .then((keys) =>
                Promise.all(keys.map((key) => window.caches.delete(key))).then(
                  () => keys.length > 0
                )
              )
              .catch(() => false)
          : Promise.resolve(false)
      ]).then(([removedServiceWorker, removedCaches]) => {
        const cleanupKey = "michelin-dev-pwa-cleaned";

        if (
          (removedServiceWorker || removedCaches) &&
          window.sessionStorage.getItem(cleanupKey) !== "1"
        ) {
          window.sessionStorage.setItem(cleanupKey, "1");
          window.location.reload();
        }
      }).catch(() => {
        // Local PWA cleanup should never block development.
      });

      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // PWA should never block the demo.
    });
  }, []);

  return null;
}
