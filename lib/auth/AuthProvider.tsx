"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@/lib/types";
import { api, getToken, setToken } from "@/lib/api";

const PENDING_KEY = "glx:auth:pending";

type Result = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  ready: boolean;
  pendingPhone: string | null;
  register: (data: { fullName: string; phone: string; password: string }) => Promise<Result>;
  requestOtp: (phone: string) => Promise<Result>;
  verifyOtp: (code: string) => Promise<Result>;
  resetPassword: (code: string, newPassword: string) => Promise<Result>;
  login: (phone: string, password: string) => Promise<Result>;
  logout: () => Promise<void>;
  updateProfile: (data: { fullName: string; phone: string }) => Promise<Result>;
  changePassword: (current: string, next: string) => Promise<Result>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);

  useEffect(() => {
    try {
      setPendingPhone(localStorage.getItem(PENDING_KEY));
    } catch {
      /* ignore */
    }
    (async () => {
      if (getToken()) {
        const res = await api.get<{ user: User }>("/auth/me");
        if (res.ok) setUser(res.data.user);
        else setToken(null);
      }
      setReady(true);
    })();
  }, []);

  const persistPending = useCallback((phone: string | null) => {
    setPendingPhone(phone);
    try {
      if (phone) localStorage.setItem(PENDING_KEY, phone);
      else localStorage.removeItem(PENDING_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAdmin: user?.role === "admin",
      ready,
      pendingPhone,
      register: async ({ fullName, phone, password }) => {
        const res = await api.post("/auth/register", { fullName, phone, password });
        if (!res.ok) return { ok: false, error: res.error! };
        persistPending(phone);
        return { ok: true };
      },
      requestOtp: async (phone) => {
        const res = await api.post("/auth/request-otp", { phone });
        if (!res.ok) return { ok: false, error: res.error! };
        persistPending(phone);
        return { ok: true };
      },
      verifyOtp: async (code) => {
        if (!pendingPhone) return { ok: false, error: "انتهت الجلسة، الرجاء إعادة المحاولة" };
        const res = await api.post<{ token: string; user: User }>("/auth/verify-otp", {
          phone: pendingPhone,
          code,
        });
        if (!res.ok) return { ok: false, error: res.error! };
        setToken(res.data.token);
        setUser(res.data.user);
        persistPending(null);
        return { ok: true };
      },
      resetPassword: async (code, newPassword) => {
        if (!pendingPhone) return { ok: false, error: "انتهت الجلسة، الرجاء إعادة المحاولة" };
        const res = await api.post("/auth/reset-password", {
          phone: pendingPhone,
          code,
          password: newPassword,
        });
        if (!res.ok) return { ok: false, error: res.error! };
        persistPending(null);
        return { ok: true };
      },
      login: async (phone, password) => {
        const res = await api.post<{ token: string; user: User }>("/auth/login", { phone, password });
        if (!res.ok) {
          // Account not verified — remember the phone for the OTP screen.
          if (res.status === 403) persistPending(phone);
          return { ok: false, error: res.error! };
        }
        setToken(res.data.token);
        setUser(res.data.user);
        return { ok: true };
      },
      logout: async () => {
        await api.post("/auth/logout").catch(() => undefined);
        setToken(null);
        setUser(null);
      },
      updateProfile: async ({ fullName, phone }) => {
        const res = await api.put<{ user: User }>("/auth/profile", { fullName, phone });
        if (!res.ok) return { ok: false, error: res.error! };
        setUser(res.data.user);
        return { ok: true };
      },
      changePassword: async (current, next) => {
        const res = await api.put("/auth/password", { current, password: next });
        if (!res.ok) return { ok: false, error: res.error! };
        return { ok: true };
      },
    };
  }, [user, ready, pendingPhone, persistPending]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
