"use client";

import Link from "next/link";
import { useAuthGate } from "@/lib/auth/useAuthGate";

/**
 * A Next <Link> that only navigates for authenticated users. Guests are sent to
 * the login page with a `redirect` back to `href`.
 */
export function GuardedLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { requireAuth } = useAuthGate();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (!requireAuth(href)) e.preventDefault();
      }}
    >
      {children}
    </Link>
  );
}
