export const isBrowser = typeof window !== "undefined";

export function canUseServiceWorker() {
  return isBrowser && "serviceWorker" in navigator;
}
