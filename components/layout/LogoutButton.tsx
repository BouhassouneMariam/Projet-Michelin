"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/features/users/AuthProvider";

export function LogoutButton() {
  const { setUnauthenticated } = useAuth();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST"
    });

    setUnauthenticated();
    window.location.assign("/");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink/10 px-4 text-sm font-semibold text-ink/70 transition hover:bg-ink/5"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}
