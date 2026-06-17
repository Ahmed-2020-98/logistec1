"use client";

import { StoreProvider } from "@/lib/store/StoreProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <ToastProvider>{children}</ToastProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
