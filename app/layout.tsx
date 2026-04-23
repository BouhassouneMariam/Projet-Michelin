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
  description: "A premium mobile-first Michelin collections experience.",
  metadataBase: new URL(getSiteUrl()),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/Etoile_Michelin-1.png",
    apple: "/icons/Etoile_Michelin-1.png",
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
    title: "Michelin"
  }
};

export const viewport: Viewport = {
  themeColor: "#12100d",
  width: "device-width",
  initialScale: 1
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
