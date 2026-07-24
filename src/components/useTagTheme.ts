"use client";

import { useEffect } from "react";
import type { TagDef } from "@/lib/types";

const KEYS = ["--accent", "--accent-soft", "--cover-a", "--cover-b"] as const;

/**
 * Pushes the active tag's palette onto :root so the whole page
 * (sidebar, chips, links, covers) re-themes, and restores defaults on unmount.
 */
export function useTagTheme(tag: TagDef) {
  useEffect(() => {
    const root = document.documentElement;
    const prev = KEYS.map((k) => root.style.getPropertyValue(k));
    root.style.setProperty("--accent", tag.accent);
    root.style.setProperty("--accent-soft", tag.accentSoft);
    root.style.setProperty("--cover-a", tag.coverFrom);
    root.style.setProperty("--cover-b", tag.coverTo);
    return () => {
      KEYS.forEach((k, i) => {
        if (prev[i]) root.style.setProperty(k, prev[i]);
        else root.style.removeProperty(k);
      });
    };
  }, [tag]);
}

export function resetTagTheme() {
  // no-op placeholder kept for callers; defaults come from CSS / first tag
}
