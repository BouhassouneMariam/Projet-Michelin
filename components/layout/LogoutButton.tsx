"use client";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST"
    });

    window.location.assign("/login");
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
