"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PostViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname?.startsWith("/post/")) return;

    const slug = pathname.split("/").pop();
    if (!slug) return;

    const storageKey = `impression:${slug}`;
    if (typeof window === "undefined" || sessionStorage.getItem(storageKey)) return;

    sessionStorage.setItem(storageKey, "1");
    fetch(`/api/posts/${slug}/impression`, { method: "POST" }).catch((error) => {
      console.error("Failed to record impression", error);
      sessionStorage.removeItem(storageKey);
    });
  }, [pathname]);

  return null;
}
