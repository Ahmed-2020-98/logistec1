"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="size-10 animate-spin rounded-full border-4 border-line border-t-brand-600" />
    </div>
  );
}

function Gate({
  icon,
  title,
  description,
  children,
}: {
  icon: "shield" | "user";
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon name={icon} className="size-7" />
        </div>
        <h2 className="text-xl font-extrabold text-navy-900">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
        <div className="mt-6 flex justify-center gap-3">{children}</div>
      </Card>
    </div>
  );
}

export function RequireAuth({
  children,
  admin = false,
}: {
  children: React.ReactNode;
  admin?: boolean;
}) {
  const { user, isAdmin, ready } = useAuth();
  const pathname = usePathname();

  if (!ready) return <Loading />;

  if (!user) {
    const loginHref = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
    return (
      <Gate icon="user" title="تسجيل الدخول مطلوب" description="الرجاء تسجيل الدخول للمتابعة.">
        <Link href={loginHref} className={buttonClass("primary", "md")}>
          تسجيل الدخول
        </Link>
        <Link href="/auth/register" className={buttonClass("outline", "md")}>
          حساب جديد
        </Link>
      </Gate>
    );
  }

  if (admin && !isAdmin) {
    return (
      <Gate icon="shield" title="صلاحية الإدارة مطلوبة" description="هذه الصفحة مخصصة لمدير المنصة فقط.">
        <Link href="/" className={buttonClass("primary", "md")}>
          العودة للرئيسية
        </Link>
      </Gate>
    );
  }

  return <>{children}</>;
}
