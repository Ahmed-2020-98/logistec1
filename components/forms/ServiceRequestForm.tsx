"use client";

import { useState } from "react";
import { OptionPills } from "./OptionPills";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store/StoreProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import {
  CUSTOMS_KINDS,
  SAUDI_CITIES,
  SERVICE_LABELS,
  SHIPPING_KINDS,
  TRANSPORT_SCOPES,
} from "@/lib/constants";
import { isValidSaudiPhone, normalizePhone } from "@/lib/utils";
import type {
  CustomsKind,
  ServiceType,
  ShippingKind,
  TransportScope,
} from "@/lib/types";

export function ServiceRequestForm({
  type,
  onSuccess,
}: {
  type: ServiceType;
  onSuccess?: () => void;
}) {
  const store = useStore();
  const { user } = useAuth();
  const toast = useToast();

  const [scope, setScope] = useState<TransportScope>("domestic");
  const [customsKind, setCustomsKind] = useState<CustomsKind>("import");
  const [shippingKind, setShippingKind] = useState<ShippingKind>("dry_containers");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [name, setName] = useState(user?.fullName ?? "");
  const [mobile, setMobile] = useState(user ? user.phone : "");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("الرجاء إدخال الاسم");
    if (!isValidSaudiPhone(mobile)) return setError("رقم الجوال غير صحيح");
    if (type === "transport" && (!fromCity || !toCity))
      return setError("الرجاء تحديد مدينتي الانطلاق والوصول");

    const created = await store.addServiceRequest({
      type,
      scope: type === "transport" ? scope : undefined,
      fromCity: type === "transport" ? fromCity : undefined,
      toCity: type === "transport" ? toCity : undefined,
      cargoType: type === "transport" ? cargoType : undefined,
      customsKind: type === "customs" ? customsKind : undefined,
      shippingKind: type === "shipping" ? shippingKind : undefined,
      name: name.trim(),
      mobile: normalizePhone(mobile),
      notes: notes.trim(),
    });
    if (!created) return setError("تعذّر إرسال الطلب، حاول مرة أخرى");
    toast("تم إرسال طلبك بنجاح، سنتواصل معك قريباً");
    onSuccess?.();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">
        طلب خدمة: {SERVICE_LABELS[type]}
      </p>

      {type === "transport" && (
        <>
          <Field label="نوع النقل" required>
            <OptionPills options={TRANSPORT_SCOPES} value={scope} onChange={setScope} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="من مدينة" required>
              <Select value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
                <option value="">اختر المدينة</option>
                {SAUDI_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="إلى مدينة" required>
              <Select value={toCity} onChange={(e) => setToCity(e.target.value)}>
                <option value="">اختر المدينة</option>
                {SAUDI_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="نوع الحمولة">
            <Select value={cargoType} onChange={(e) => setCargoType(e.target.value)}>
              <option value="">اختر نوع الحمولة</option>
              {store.cargoTypes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
        </>
      )}

      {type === "customs" && (
        <Field label="نوع التخليص" required>
          <OptionPills options={CUSTOMS_KINDS} value={customsKind} onChange={setCustomsKind} columns={4} />
        </Field>
      )}

      {type === "shipping" && (
        <Field label="نوع الشحن / التخزين" required>
          <OptionPills options={SHIPPING_KINDS} value={shippingKind} onChange={setShippingKind} columns={3} />
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="الاسم" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" />
        </Field>
        <Field label="رقم الجوال" required>
          <Input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="05XXXXXXXX"
            inputMode="tel"
          />
        </Field>
      </div>

      <Field label="ملاحظات">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="أضف أي تفاصيل إضافية..." />
      </Field>

      {error && <p className="text-sm font-bold text-red-600">{error}</p>}

      <Button type="submit" size="lg" className="w-full">
        إرسال الطلب
      </Button>
    </form>
  );
}
