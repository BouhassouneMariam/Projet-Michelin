import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-porcelain/80">
      <Header />
      <PwaInstallPrompt />
      <div className="min-h-[calc(100dvh-68px)] pb-20 md:pb-0">{children}</div>
      <BottomNav />
    </div>
  );
}
