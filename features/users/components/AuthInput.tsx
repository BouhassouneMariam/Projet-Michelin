"use client";

import { InputHTMLAttributes, ReactNode } from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: ReactNode;
  label: string;
};

export function AuthInput({ icon, label, ...props }: AuthInputProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <span className="flex h-12 items-center gap-3 rounded-lg border border-ink/10 bg-white px-3 text-ink/50 focus-within:border-rouge focus-within:ring-4 focus-within:ring-rouge/10">
        {icon}
        <input
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
          {...props}
        />
      </span>
    </label>
  );
}
