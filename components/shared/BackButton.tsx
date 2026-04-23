"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

type BackButtonProps = {
  className?: string;
  fallback?: string;
};

export function BackButton({ className, fallback = "/" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // If we have history, go back. Otherwise go to fallback.
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur transition hover:bg-white/20",
        className
      )}
      aria-label="Back"
    >
      <ArrowLeft size={18} />
    </button>
  );
}
