"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * Gate guest actions behind login. `requireAuth(destination)` returns true when
 * the visitor is allowed to proceed; otherwise it redirects to the login page
 * with a `redirect` back to `destination` and returns false.
 */
export function useAuthGate() {
  const { user, ready } = useAuth();
  const router = useRouter();

  const requireAuth = useCallback(
    (destination: string): boolean => {
      if (!ready) return false;
      if (user) return true;
      router.push(`/auth/login?redirect=${encodeURIComponent(destination)}`);
      return false;
    },
    [user, ready, router],
  );

  return { requireAuth, isGuest: ready && !user };
}
