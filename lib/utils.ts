// ===== Shared helpers =====

/** Join class names, dropping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Generate a short unique id. */
export function genId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Normalize a Saudi mobile number to the +9665XXXXXXXX format.
 * Accepts: 05XXXXXXXX, 5XXXXXXXX, 9665XXXXXXXX, +9665XXXXXXXX.
 */
export function normalizePhone(raw: string): string {
  let digits = (raw || "").replace(/[^\d+]/g, "");
  digits = digits.replace(/^\+/, "");
  if (digits.startsWith("966")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  // now should be 5XXXXXXXX
  return `+966${digits}`;
}

/** Validate a Saudi mobile number (05XXXXXXXX / +9665XXXXXXXX, etc.). */
export function isValidSaudiPhone(raw: string): boolean {
  const normalized = normalizePhone(raw);
  return /^\+9665\d{8}$/.test(normalized);
}

/** Display a normalized phone in local 05XXXXXXXX form. */
export function displayPhone(phone: string): string {
  const n = normalizePhone(phone);
  const local = n.replace("+966", "");
  return `0${local}`;
}

/** Build a wa.me link from a (possibly local) phone number. */
export function whatsappLink(phone: string, text?: string): string {
  const intl = normalizePhone(phone).replace("+", "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${intl}${q}`;
}

export function telLink(phone: string): string {
  return `tel:${normalizePhone(phone)}`;
}

const SAR = new Intl.NumberFormat("ar-SA", {
  maximumFractionDigits: 0,
});

/** Format a price with the Saudi Riyal label. */
export function formatPrice(value: string | number): string {
  const num = typeof value === "number" ? value : Number(String(value).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(num) || num === 0) return String(value || "");
  return `${SAR.format(num)} ر.س`;
}

/** Format an ISO date as a localized Arabic date. */
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Relative "time ago" in Arabic (rough). */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `قبل ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `قبل ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `قبل ${days} يوم`;
  return formatDate(iso);
}

/** Read a File as a data URL (for image previews stored in localStorage). */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
