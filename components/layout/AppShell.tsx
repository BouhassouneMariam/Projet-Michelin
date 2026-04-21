import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-porcelain/80 shadow-premium">
      <Header />
      <div className="min-h-screen pb-20 md:pb-0">{children}</div>
      <BottomNav />
    </div>
  );
}
