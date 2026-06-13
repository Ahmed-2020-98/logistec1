import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Icon } from "@/components/ui/Icon";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-navy-900 lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=70"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo variant="light" />
          <div>
            <h2 className="text-4xl font-black leading-tight">
              منصة الخليج
              <br />
              للخدمات اللوجستية
            </h2>
            <p className="mt-4 max-w-md text-white/75">
              انضم إلى آلاف الناقلين والمخلّصين وأصحاب الحمولات في المملكة، وأدر خدماتك وإعلاناتك من
              مكان واحد.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              {["نقل وتخليص وشحن في منصة واحدة", "نشر الإعلانات والوصول لآلاف العملاء", "تواصل مباشر عبر واتساب والاتصال"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Icon name="check" className="size-4 text-accent-400" />
                    {t}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div />
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center bg-surface px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo />
          </div>
          {children}
          <p className="mt-8 text-center text-sm text-muted">
            <Link href="/" className="font-bold text-brand-700 hover:underline">
              ← العودة للرئيسية
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
