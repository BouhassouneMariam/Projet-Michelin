import type { Metadata, Viewport } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { AuthProvider } from "@/features/users/AuthProvider";
import { isAdmin, isAuthenticated } from "@/lib/auth";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Michelin Next Gen",
  description: "Le Guide Michelin interactif pour decouvrir, filtrer et retrouver la bonne table.",
  applicationName: "Michelin Next Gen",
  metadataBase: new URL(getSiteUrl()),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/pwa-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/pwa-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  },
  openGraph: {
    siteName: "Michelin Next Gen",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  appleWebApp: {
    capable: true,
    startupImage: [
      {
        url: "/splash/apple-splash-1170x2532.png",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
      },
      {
        url: "/splash/apple-splash-1290x2796.png",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
      },
      {
        url: "/splash/apple-splash-1536x2048.png",
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
      }
    ],
    statusBarStyle: "default",
    title: "Michelin"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  themeColor: "#12100d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialIsAuthenticated = isAuthenticated();
  const initialIsAdmin = await isAdmin();

  return (
    <html lang="fr">
      <body>
        <ServiceWorkerRegister />
        <AuthProvider
          initialIsAuthenticated={initialIsAuthenticated}
          initialIsAdmin={initialIsAdmin}
        >
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
