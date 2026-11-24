"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useStore } from "./store-provider";
import type { CategoryId } from "@/lib/types";

/** Select a catalog category and bring the shop grid into view from any page. */
export function useCategoryNav() {
  const { setCategory } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  return useCallback(
    (category: CategoryId | "all") => {
      setCategory(category);
      if (pathname === "/") {
        document.getElementById("shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        router.push("/#shop");
      }
    },
    [pathname, router, setCategory],
  );
}
