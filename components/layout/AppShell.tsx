import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-porcelain/80">
      <Header />
      <div className="min-h-[calc(100dvh-68px)] pb-20 md:pb-0">{children}</div>
      <BottomNav />
    </div>
  );
}
