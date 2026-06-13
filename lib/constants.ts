import type {
  CustomsKind,
  SaleKind,
  ShippingKind,
  TransportScope,
} from "./types";

// Demo OTP code used by the mock Authentica flow.
export const DEMO_OTP = "1234";

// Saudi cities for dropdowns
export const SAUDI_CITIES = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الظهران",
  "الجبيل",
  "ينبع",
  "تبوك",
  "أبها",
  "خميس مشيط",
  "حائل",
  "بريدة",
  "الطائف",
  "نجران",
  "جازان",
  "الأحساء",
  "عرعر",
  "سكاكا",
] as const;

// Saudi ports
export const SAUDI_PORTS = [
  "ميناء جدة الإسلامي",
  "ميناء الملك عبدالعزيز - الدمام",
  "ميناء الملك عبدالله - رابغ",
  "ميناء ينبع التجاري",
  "ميناء جازان",
  "ميناء ضباء",
  "ميناء رأس الخير",
  "ميناء الجبيل التجاري",
] as const;

export const TRANSPORT_SCOPES: { value: TransportScope; label: string }[] = [
  { value: "domestic", label: "داخل المملكة" },
  { value: "international", label: "دولي" },
];

export const CUSTOMS_KINDS: { value: CustomsKind; label: string }[] = [
  { value: "import", label: "وارد" },
  { value: "export", label: "صادر" },
  { value: "transit", label: "ترانزيت" },
  { value: "vehicles", label: "سيارات" },
];

export const SHIPPING_KINDS: { value: ShippingKind; label: string }[] = [
  { value: "dry_containers", label: "حاويات جاف" },
  { value: "refrigerated_containers", label: "حاويات مبرد" },
  { value: "vehicles", label: "سيارات ومعدات" },
  { value: "equipment", label: "معدات" },
  { value: "jumbo_bags", label: "أكياس جامبو" },
  { value: "wood", label: "أخشاب" },
];

export const SALE_KINDS: { value: SaleKind; label: string }[] = [
  { value: "truck", label: "شاحنة" },
  { value: "equipment", label: "معدات" },
  { value: "flatbed", label: "سطحة" },
];

export const SHIPMENT_TYPES = [
  "حاويات جاف 20 قدم",
  "حاويات جاف 40 قدم",
  "حاويات مبرد",
  "بضائع سائبة",
  "بضائع مبردة",
  "سيارات ومعدات",
  "مواد خطرة",
] as const;

// Main navigation (desktop header)
export const MAIN_NAV = [
  { label: "الرئيسية", href: "/" },
  { label: "الخدمات", href: "/services" },
  { label: "إعلانات النقل", href: "/ads/transport" },
  { label: "إعلانات التخليص", href: "/ads/customs" },
  { label: "بيع الشاحنات والمعدات", href: "/ads/sale" },
  { label: "تواصل معنا", href: "/contact" },
];

// Mobile bottom navigation
export const MOBILE_NAV = [
  { label: "الرئيسية", href: "/", icon: "home" },
  { label: "الخدمات", href: "/services", icon: "grid" },
  { label: "أضف إعلان", href: "/add-ad", icon: "plus" },
  { label: "الإعلانات", href: "/ads/transport", icon: "megaphone" },
  { label: "حسابي", href: "/dashboard", icon: "user" },
] as const;

export const SERVICE_LABELS: Record<string, string> = {
  transport: "النقل",
  customs: "التخليص الجمركي",
  shipping: "الشحن والتخزين",
};

export const AD_CATEGORY_LABELS: Record<string, string> = {
  transport: "إعلانات النقل",
  customs: "إعلانات التخليص",
  sale: "بيع الشاحنات والمعدات",
};

export function labelOf(
  list: { value: string; label: string }[],
  value?: string,
): string {
  return list.find((i) => i.value === value)?.label ?? value ?? "";
}
