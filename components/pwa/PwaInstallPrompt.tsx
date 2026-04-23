"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Share2, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  canUseServiceWorker,
  isIos,
  isSafari,
  isStandaloneDisplay,
  type DeferredInstallPrompt
} from "@/lib/pwa";

const DISMISS_KEY = "michelin-pwa-install-dismissed";

export function PwaInstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [deferredPrompt, setDeferredPrompt] =
    useState<DeferredInstallPrompt | null>(null);

  useEffect(() => {
    setMounted(true);

    if (!canUseServiceWorker()) {
      return;
    }

    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as DeferredInstallPrompt);
    };

    const handleInstalled = () => {
      window.localStorage.setItem(DISMISS_KEY, "1");
      setDeferredPrompt(null);
      setDismissed(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const standalone = useMemo(
    () => (mounted ? isStandaloneDisplay() : false),
    [mounted]
  );

  const showIosHint = mounted && !standalone && !deferredPrompt && isIos() && isSafari();
  const showNativePrompt = mounted && !standalone && deferredPrompt !== null;

  if (!mounted || dismissed || standalone || (!showIosHint && !showNativePrompt)) {
    return null;
  }

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice.catch(() => null);

    if (choice?.outcome === "accepted") {
      window.localStorage.setItem(DISMISS_KEY, "1");
      setDismissed(true);
    }

    setDeferredPrompt(null);
  }

  function handleDismiss() {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <section className="border-b border-[#E8E1D8] bg-[#F7F2E8]">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-3 px-5 py-3 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rouge/10 text-rouge">
            <Smartphone size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">
              Installer Michelin Next Gen
            </p>
            <p className="text-sm leading-6 text-[#6F675F]">
              {showNativePrompt
                ? "Ajoute l'app a ton ecran d'accueil pour une experience plus fluide, plein ecran et plus rapide."
                : "Sur iPhone, ouvre Partager puis choisis Ajouter a l'ecran d'accueil pour installer l'app."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showNativePrompt ? (
            <Button
              onClick={handleInstall}
              className="h-10 rounded bg-rouge px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#9d2626]"
            >
              <Download size={16} />
              Installer
            </Button>
          ) : (
            <span className="inline-flex h-10 items-center gap-2 rounded-full border border-[#DDDDDD] bg-white/85 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink">
              <Share2 size={14} />
              Partager puis ecran d&apos;accueil
            </span>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6F675F] transition hover:bg-black/5 hover:text-ink"
            aria-label={"Fermer l'invitation d'installation"}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
