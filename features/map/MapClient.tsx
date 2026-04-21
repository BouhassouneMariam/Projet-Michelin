"use client";

import { useEffect, useState } from "react";
import { MapView } from "./MapView";
import type { RestaurantDto } from "@/types/api";

function MapLoading() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="h-[68vh] min-h-[520px] rounded-lg border border-ink/10 bg-white/70 p-5 shadow-sm">
        <div className="h-full rounded-lg bg-porcelain" />
      </div>
      <div className="rounded-lg border border-ink/10 bg-white/70 p-5 text-sm font-semibold text-ink/60 shadow-sm">
        Loading map...
      </div>
    </div>
  );
}

export function MapClient({ restaurants }: { restaurants: RestaurantDto[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <MapLoading />;
  }

  return <MapView restaurants={restaurants} />;
}
