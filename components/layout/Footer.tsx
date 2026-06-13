import Link from "next/link";
import { Logo } from "./Logo";
import { MAIN_NAV } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 bg-navy-900 text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Logo variant="light" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
            منصة الخليج للخدمات اللوجستية تجمع خدمات النقل والتخليص الجمركي والشحن والتخزين في مكان
            واحد، وتربط أصحاب الحمولات بالناقلين والمخلصين في جميع مناطق المملكة العربية السعودية.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-extrabold text-white">روابط سريعة</h4>
          <ul className="space-y-2 text-sm">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/60 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-extrabold text-white">حسابي</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/auth/login" className="text-white/60 transition-colors hover:text-white">
                تسجيل الدخول
              </Link>
            </li>
            <li>
              <Link href="/auth/register" className="text-white/60 transition-colors hover:text-white">
                إنشاء حساب
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-white/60 transition-colors hover:text-white">
                لوحة التحكم
              </Link>
            </li>
            <li>
              <Link href="/add-ad" className="text-white/60 transition-colors hover:text-white">
                أضف إعلان
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/50 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} منصة الخليج للخدمات اللوجستية — جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
