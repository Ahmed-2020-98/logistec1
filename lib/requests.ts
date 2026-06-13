import type { ServiceRequest } from "./types";
import {
  CUSTOMS_KINDS,
  SERVICE_LABELS,
  SHIPPING_KINDS,
  TRANSPORT_SCOPES,
  labelOf,
} from "./constants";
import { displayPhone } from "./utils";

/** Build a human-readable title + field list for a service request. */
export function describeRequest(r: ServiceRequest): {
  title: string;
  lines: [string, string][];
} {
  const lines: [string, string][] = [];

  if (r.type === "transport") {
    if (r.scope) lines.push(["نوع النقل", labelOf(TRANSPORT_SCOPES, r.scope)]);
    if (r.fromCity) lines.push(["من", r.fromCity]);
    if (r.toCity) lines.push(["إلى", r.toCity]);
    if (r.cargoType) lines.push(["نوع الحمولة", r.cargoType]);
  } else if (r.type === "customs") {
    if (r.customsKind) lines.push(["نوع التخليص", labelOf(CUSTOMS_KINDS, r.customsKind)]);
  } else if (r.type === "shipping") {
    if (r.shippingKind) lines.push(["نوع الشحن", labelOf(SHIPPING_KINDS, r.shippingKind)]);
  }

  lines.push(["الاسم", r.name]);
  lines.push(["الجوال", displayPhone(r.mobile)]);
  if (r.notes) lines.push(["ملاحظات", r.notes]);

  return { title: SERVICE_LABELS[r.type], lines };
}
