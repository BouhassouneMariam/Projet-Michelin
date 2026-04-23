import type { Metadata, Viewport } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { AuthProvider } from "@/features/users/AuthProvider";
import { isAuthenticated } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Michelin Next Gen",
  description: "A premium mobile-first Michelin collections experience.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/Etoile_Michelin-1.png",
    apple: "/icons/Etoile_Michelin-1.png",
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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialIsAuthenticated = isAuthenticated();

  return (
    <html lang="fr">
      <body>
        <ServiceWorkerRegister />
        <AuthProvider initialIsAuthenticated={initialIsAuthenticated}>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
