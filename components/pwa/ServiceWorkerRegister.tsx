"use client";

import { useEffect } from "react";
import { canUseServiceWorker } from "@/lib/pwa";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!canUseServiceWorker()) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister();
        });
      }).catch(() => {
        // Local PWA cleanup should never block development.
      });

      if ("caches" in window) {
        window.caches.keys().then((keys) => {
          keys.forEach((key) => {
            void window.caches.delete(key);
          });
        }).catch(() => {
          // Local cache cleanup should never block development.
        });
      }

      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // PWA should never block the demo.
    });
  }, []);

  return null;
}
