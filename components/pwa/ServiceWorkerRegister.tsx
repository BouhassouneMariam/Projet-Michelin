"use client";

import { useEffect } from "react";
import { canUseServiceWorker } from "@/lib/pwa";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!canUseServiceWorker()) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister()))
        )
        .catch(() => {
          // Development cleanup should not block the app.
        });

      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .catch(() => {
          // Development cleanup should not block the app.
        });

      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // PWA should never block the demo.
    });
  }, []);

  return null;
}
