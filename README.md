# منصة الخليج للخدمات اللوجستية

منصّة لوجستية عربية (RTL) للمملكة العربية السعودية: خدمات النقل والتخليص الجمركي والشحن والتخزين،
مع نظام إعلانات (نقل / تخليص / بيع شاحنات ومعدات)، لوحة تحكم للمستخدم، ولوحة إدارة كاملة.

**تطبيق متكامل (Full-stack):** واجهة أمامية **Next.js** + واجهة برمجية **Laravel** مع قاعدة بيانات.
الإنتاج: الواجهة على `https://a7mdgmal.online` والـ API على `https://api.a7mdgmal.online`.
التحقق عبر **Authentica** (SMS) في الإنتاج، ومع بديل محلي (رمز `1234`) أثناء التطوير.

البنية: الواجهة في جذر المشروع، والـ API في مجلد **`backend/`** (Laravel). راجع **`DEPLOYMENT.md`** للنشر.

## التشغيل محلياً

```bash
# 1) الـ API (Laravel) — في نافذة طرفية
cd backend
composer install
php artisan migrate:fresh --seed
php artisan serve                 # http://localhost:8000

# 2) الواجهة (Next.js) — في نافذة أخرى من جذر المشروع
npm install --legacy-peer-deps
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
npm run dev                       # http://localhost:3000
```

أوامر إضافية: `npm run build` و`npm run lint` للواجهة، و`php artisan test` للـ API.

> ملاحظة بيئة التطوير: تستخدم الواجهة المحلية SQLite للـ API افتراضياً (مضبوط في `backend/.env`)،
> ورمز OTP أثناء التطوير هو `1234` (يظهر في `backend/storage/logs/laravel.log`).

## الحسابات التجريبية (من الـ Seeder)

| الدور    | رقم الجوال     | كلمة المرور |
| -------- | -------------- | ----------- |
| مستخدم   | `0512345678`   | `user1234`  |
| مدير     | `0500000000`   | `admin123`  |

- لوحة الإدارة على المسار `/admin` (تتطلب حساب مدير) — غيّر كلمة مرور المدير في الإنتاج.
- زر **إعادة تعيين البيانات التجريبية** في لوحة الإدارة (متاح في غير بيئة الإنتاج).

## أبرز الميزات

- **المصادقة:** تسجيل (الاسم، جوال سعودي، كلمة المرور) ← تحقق OTP ← تسجيل دخول.
- **الرئيسية:** بانر رئيسي، بطاقات الخدمات الثلاث مع خياراتها الفرعية، روابط سريعة لمواقع الجهات،
  وأحدث إعلانات النقل/التخليص/البيع.
- **طلب خدمة:** نماذج ديناميكية (نقل / تخليص / شحن وتخزين) تُحفظ وتظهر في لوحة الإدارة ولوحة المستخدم.
- **إضافة إعلان:** نقل / تخليص / بيع (مع صور متعددة لإعلانات البيع).
- **صفحة تفاصيل الإعلان:** معرض صور + زرّا واتساب والاتصال.
- **لوحة المستخدم:** نظرة عامة، طلباتي، إعلاناتي، الملف الشخصي، تغيير كلمة المرور.
- **لوحة الإدارة:** إحصائيات + إدارة المستخدمين، البانرات، الروابط السريعة، أنواع الحمولات،
  طلبات الخدمة، والإعلانات.
- **تصميم متجاوب** مع شريط تنقّل سفلي للجوال ودعم كامل لاتجاه RTL.

## التقنيات

- **الواجهة:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 (سمة كحلي/أزرق، خطوط Cairo / Tajawal).
- **الـ API:** Laravel + Sanctum (توكنات Bearer) + MySQL (الإنتاج) / SQLite (التطوير).
- **التحقق:** Authentica SMS OTP (مع بديل محلي للتطوير).
- الواجهة تستهلك الـ API عبر `lib/api.ts`؛ الحالة تُدار في `lib/store/StoreProvider.tsx` و`lib/auth/AuthProvider.tsx`.

## بنية المشروع

```
app/                 # صفحات Next.js: (site) العامة، auth، dashboard، admin
components/          # المكوّنات (layout, ui, forms, ads, home, admin, auth)
lib/                 # api.ts, types, constants, utils, store/, auth/
backend/            # واجهة Laravel البرمجية
  app/Http/Controllers/Api  # Auth, Ad, ServiceRequest, Public, Admin/*
  app/Http/Resources         # تحويل JSON بصيغة camelCase مطابقة للواجهة
  app/Services/AuthenticaService.php
  routes/api.php, database/migrations, database/seeders
```

## ملاحظات حول الإنتاج

- ضع مفتاح **Authentica** في `backend/.env` (`AUTHENTICA_ENABLED=true` + `AUTHENTICA_API_KEY`).
- اضبط `FRONTEND_URL` (للـ CORS) و`NEXT_PUBLIC_API_URL` على نطاقي الإنتاج.
- كلمات المرور تُخزَّن مُجزّأة (bcrypt) عبر Laravel. غيّر كلمة مرور المدير الافتراضية.
- خطوات النشر الكاملة على Hostinger في **`DEPLOYMENT.md`**.
