export const isBrowser = typeof window !== "undefined";

export function canUseServiceWorker() {
  return isBrowser && "serviceWorker" in navigator;
}

export type DeferredInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export function isStandaloneDisplay() {
  if (!isBrowser) {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function isIos() {
  if (!isBrowser) {
    return false;
  }

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function isSafari() {
  if (!isBrowser) {
    return false;
  }

  return /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(
    window.navigator.userAgent
  );
}
