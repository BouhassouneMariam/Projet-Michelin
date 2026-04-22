"use client";

import Link from "next/link";
import { FormEvent, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

type AuthFormCardProps = {
  buttonLabel: string;
  children: ReactNode;
  errorMessage: string;
  isLoading: boolean;
  loadingLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitDisabled: boolean;
  switchHref: string;
  switchLabel: string;
  switchText: string;
};

export function AuthFormCard({
  buttonLabel,
  children,
  errorMessage,
  isLoading,
  loadingLabel,
  onSubmit,
  submitDisabled,
  switchHref,
  switchLabel,
  switchText
}: AuthFormCardProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid w-full max-w-md gap-5 rounded-lg border border-ink/10 bg-white/80 p-5 shadow-premium backdrop-blur"
    >
      {children}

      {errorMessage ? (
        <p className="rounded-lg border border-rouge/20 bg-rouge/10 px-3 py-2 text-sm font-medium text-rouge">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={submitDisabled}
        className="h-12 bg-rouge hover:bg-[#9d2626]"
      >
        {isLoading ? loadingLabel : buttonLabel}
        <ArrowRight size={18} />
      </Button>

      <p className="text-center text-sm text-ink/55">
        {switchText}{" "}
        <Link href={switchHref} className="font-semibold text-rouge">
          {switchLabel}
        </Link>
      </p>
    </form>
  );
}
