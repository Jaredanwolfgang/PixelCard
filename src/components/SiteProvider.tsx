"use client";

import { createContext, useContext } from "react";
import type { SiteConfig, TagDef } from "@/lib/types";

const SiteContext = createContext<SiteConfig | null>(null);

export function SiteProvider({
  config,
  children,
}: {
  config: SiteConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteContext.Provider value={config}>{children}</SiteContext.Provider>
  );
}

export function useSiteConfig(): SiteConfig {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error("useSiteConfig must be used within SiteProvider");
  }
  return ctx;
}

export function useTags(): TagDef[] {
  return useSiteConfig().tags;
}

export function useTag(id: string | null | undefined): TagDef {
  const tags = useTags();
  return tags.find((t) => t.id === id) ?? tags[0];
}
