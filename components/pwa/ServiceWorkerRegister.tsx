"use client";

import { useEffect } from "react";
import { canUseServiceWorker } from "@/lib/pwa";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!canUseServiceWorker()) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // PWA should never block the demo.
    });
  }, []);

  return null;
}
