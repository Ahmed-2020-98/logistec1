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
import { useStore } from "@/lib/store/StoreProvider";
import { DEMO_OTP } from "@/lib/constants";
import { genId, isValidSaudiPhone, normalizePhone } from "@/lib/utils";

const UID_KEY = "glx:auth:uid";
const PENDING_KEY = "glx:auth:pending";

type Result = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  ready: boolean;
  pendingPhone: string | null;
  register: (data: { fullName: string; phone: string; password: string }) => Result;
  requestOtp: (phone: string) => Result;
  verifyOtp: (code: string) => Result;
  resetPassword: (code: string, newPassword: string) => Result;
  login: (phone: string, password: string) => Result;
  logout: () => void;
  updateProfile: (data: { fullName: string; phone: string }) => Result;
  changePassword: (current: string, next: string) => Result;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const store = useStore();
  const [uid, setUid] = useState<string | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);

  useEffect(() => {
    try {
      setUid(localStorage.getItem(UID_KEY));
      setPendingPhone(localStorage.getItem(PENDING_KEY));
    } catch {
      /* ignore */
    }
  }, []);

  const persistUid = useCallback((id: string | null) => {
    setUid(id);
    try {
      if (id) localStorage.setItem(UID_KEY, id);
      else localStorage.removeItem(UID_KEY);
    } catch {
      /* ignore */
    }
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

  const user = useMemo(
    () => store.users.find((u) => u.id === uid) ?? null,
    [store.users, uid],
  );

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAdmin: user?.role === "admin",
      ready: store.ready,
      pendingPhone,
      register: ({ fullName, phone, password }) => {
        if (!fullName.trim()) return { ok: false, error: "الرجاء إدخال الاسم الكامل" };
        if (!isValidSaudiPhone(phone))
          return { ok: false, error: "رقم الجوال غير صحيح (مثال: 05XXXXXXXX)" };
        if (password.length < 6)
          return { ok: false, error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
        const normalized = normalizePhone(phone);
        if (store.users.some((u) => u.phone === normalized))
          return { ok: false, error: "رقم الجوال مسجّل مسبقاً" };
        const newUser: User = {
          id: genId(),
          fullName: fullName.trim(),
          phone: normalized,
          password,
          isVerified: false,
          role: "user",
          createdAt: new Date().toISOString(),
        };
        store.addUser(newUser);
        persistPending(normalized);
        return { ok: true };
      },
      requestOtp: (phone) => {
        const normalized = normalizePhone(phone);
        if (!store.users.some((u) => u.phone === normalized))
          return { ok: false, error: "لا يوجد حساب بهذا الرقم" };
        persistPending(normalized);
        // Mock Authentica send: a real integration would POST to the API here.
        return { ok: true };
      },
      verifyOtp: (code) => {
        if (!pendingPhone) return { ok: false, error: "انتهت الجلسة، الرجاء إعادة التسجيل" };
        if (code.trim() !== DEMO_OTP)
          return { ok: false, error: `رمز التحقق غير صحيح (رمز التجربة: ${DEMO_OTP})` };
        const target = store.users.find((u) => u.phone === pendingPhone);
        if (!target) return { ok: false, error: "تعذّر العثور على الحساب" };
        store.updateUser({ ...target, isVerified: true });
        persistUid(target.id);
        persistPending(null);
        return { ok: true };
      },
      resetPassword: (code, newPassword) => {
        if (!pendingPhone) return { ok: false, error: "انتهت الجلسة، الرجاء إعادة المحاولة" };
        if (code.trim() !== DEMO_OTP)
          return { ok: false, error: `رمز التحقق غير صحيح (رمز التجربة: ${DEMO_OTP})` };
        const target = store.users.find((u) => u.phone === pendingPhone);
        if (!target) return { ok: false, error: "تعذّر العثور على الحساب" };
        if (newPassword.length < 6)
          return { ok: false, error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
        // Reset the password (and mark verified) without logging in;
        // the user then signs in with the new password.
        store.updateUser({ ...target, password: newPassword, isVerified: true });
        persistPending(null);
        return { ok: true };
      },
      login: (phone, password) => {
        const normalized = normalizePhone(phone);
        const target = store.users.find((u) => u.phone === normalized);
        if (!target || target.password !== password)
          return { ok: false, error: "رقم الجوال أو كلمة المرور غير صحيحة" };
        if (!target.isVerified) {
          persistPending(normalized);
          return { ok: false, error: "الحساب غير مُفعّل، الرجاء التحقق من رقم الجوال" };
        }
        persistUid(target.id);
        return { ok: true };
      },
      logout: () => persistUid(null),
      updateProfile: ({ fullName, phone }) => {
        if (!user) return { ok: false, error: "غير مسجّل الدخول" };
        if (!isValidSaudiPhone(phone)) return { ok: false, error: "رقم الجوال غير صحيح" };
        const normalized = normalizePhone(phone);
        if (store.users.some((u) => u.phone === normalized && u.id !== user.id))
          return { ok: false, error: "رقم الجوال مستخدم في حساب آخر" };
        store.updateUser({ ...user, fullName: fullName.trim(), phone: normalized });
        return { ok: true };
      },
      changePassword: (current, next) => {
        if (!user) return { ok: false, error: "غير مسجّل الدخول" };
        if (user.password !== current) return { ok: false, error: "كلمة المرور الحالية غير صحيحة" };
        if (next.length < 6) return { ok: false, error: "كلمة المرور الجديدة قصيرة جداً" };
        store.updateUser({ ...user, password: next });
        return { ok: true };
      },
    };
  }, [user, pendingPhone, store, persistUid, persistPending]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
