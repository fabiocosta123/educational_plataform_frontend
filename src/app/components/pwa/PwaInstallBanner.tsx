"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIosDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone));

  return isIos && !isStandalone;
}

export default function PwaInstallBanner() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // O next-pwa gera o SW no build de produção.
      });
    }

    const alreadyDismissed =
      window.sessionStorage.getItem("pwa-install-dismissed") === "1";

    if (alreadyDismissed) {
      setDismissed(true);
    }

    setShowIosHelp(isIosDevice());

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  function dismiss() {
    setDismissed(true);
    setInstallEvent(null);
    setShowIosHelp(false);
    window.sessionStorage.setItem("pwa-install-dismissed", "1");
  }

  async function handleInstall() {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice;
    dismiss();
  }

  if (dismissed || (!installEvent && !showIosHelp)) {
    return null;
  }

  return (
    <div className="fixed right-3 bottom-3 z-[80] max-w-sm rounded-xl bg-[#163E72] p-4 text-white shadow-lg">
      <p className="text-sm font-semibold">Instalar o app Anexa</p>

      {installEvent ? (
        <p className="mt-1 text-xs text-white/90">
          Adicione à tela inicial e use como um aplicativo.
        </p>
      ) : (
        <p className="mt-1 text-xs text-white/90">
          No iPhone, toque em Compartilhar e depois em Adicionar à Tela de
          Início.
        </p>
      )}

      <div className="mt-3 flex gap-2">
        {installEvent && (
          <button
            type="button"
            onClick={handleInstall}
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[#163E72]"
          >
            Instalar
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg px-3 py-1.5 text-sm text-white/90"
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
