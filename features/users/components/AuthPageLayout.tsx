import { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { BadgePill } from "@/components/shared/BadgePill";

type AuthPageLayoutProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export function AuthPageLayout({
  children,
  description,
  title
}: AuthPageLayoutProps) {
  return (
    <main className="grid min-h-[calc(100vh-5rem)] gap-8 px-5 py-8 md:grid-cols-[minmax(0,1fr)_28rem] md:items-center md:px-8">
      <section className="max-w-2xl space-y-5">
        <BadgePill icon={<Sparkles size={14} />}>Michelin Next Gen</BadgePill>
        <div className="space-y-3">
          <h1 className="max-w-[10ch] text-5xl font-semibold leading-[0.95] text-ink sm:text-6xl">
            {title}
          </h1>
          <p className="max-w-lg text-base leading-7 text-ink/65">
            {description}
          </p>
        </div>
      </section>

      <section className="flex justify-center md:justify-end">{children}</section>
    </main>
  );
}
