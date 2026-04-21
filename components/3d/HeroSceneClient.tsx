"use client";

import dynamic from "next/dynamic";
import { CanvasFallback } from "./CanvasFallback";

const MichelinHeroScene = dynamic(
  () => import("./MichelinHeroScene").then((mod) => mod.MichelinHeroScene),
  {
    ssr: false,
    loading: () => <CanvasFallback />
  }
);

export function HeroSceneClient() {
  return <MichelinHeroScene />;
}
