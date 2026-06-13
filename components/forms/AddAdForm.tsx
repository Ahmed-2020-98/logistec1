"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { OptionPills } from "./OptionPills";
import { ImageUploader } from "./ImageUploader";
import { useStore } from "@/lib/store/StoreProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import {
  SALE_KINDS,
  SAUDI_CITIES,
  SAUDI_PORTS,
  SHIPMENT_TYPES,
} from "@/lib/constants";
import { isValidSaudiPhone, normalizePhone } from "@/lib/utils";
import type { AdCategory, SaleKind } from "@/lib/types";

const TABS: { value: AdCategory; label: string; icon: IconName }[] = [
  { value: "transport", label: "إعلان نقل", icon: "truck" },
  { value: "customs", label: "إعلان تخليص", icon: "clearance" },
  { value: "sale", label: "إعلان بيع", icon: "tag" },
];

export function AddAdForm({ defaultCategory = "transport" }: { defaultCategory?: AdCategory }) {
  const router = useRouter();
  const store = useStore();
  const { user } = useAuth();
  const toast = useToast();
  const [category, setCategory] = useState<AdCategory>(defaultCategory);

  return (
    <div>
      <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl bg-white p-1.5 shadow-[var(--shadow-card)]">
        {TABS.map((t) => {
          const active = t.value === category;
          return (
            <button
              key={t.value}
              onClick={() => setCategory(t.value)}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                active ? "bg-brand-600 text-white shadow-sm" : "text-navy-700 hover:bg-navy-900/5"
              }`}
            >
              <Icon name={t.icon} className="size-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {category === "transport" && (
        <TransportForm
          phone={user?.phone ?? ""}
          onSubmit={(data) => {
            const ad = store.addTransportAd({ ...data, userId: user?.id ?? null });
            toast("تم نشر إعلان النقل بنجاح");
            router.push(`/ads/transport/${ad.id}`);
          }}
          cargoTypes={store.cargoTypes.map((c) => c.name)}
        />
      )}
      {category === "customs" && (
        <CustomsForm
          phone={user?.phone ?? ""}
          onSubmit={(data) => {
            const ad = store.addCustomsAd({ ...data, userId: user?.id ?? null });
            toast("تم نشر إعلان التخليص بنجاح");
            router.push(`/ads/customs/${ad.id}`);
          }}
        />
      )}
      {category === "sale" && (
        <SaleForm
          phone={user?.phone ?? ""}
          onSubmit={(data) => {
            const ad = store.addSaleAd({ ...data, userId: user?.id ?? null });
            toast("تم نشر إعلان البيع بنجاح");
            router.push(`/ads/sale/${ad.id}`);
          }}
        />
      )}
    </div>
  );
}

function useForm(initialPhone: string) {
  const [error, setError] = useState("");
  const [phone, setPhone] = useState(initialPhone);
  return { error, setError, phone, setPhone };
}

// ---- Transport ad form ----
function TransportForm({
  phone: initialPhone,
  cargoTypes,
  onSubmit,
}: {
  phone: string;
  cargoTypes: string[];
  onSubmit: (data: {
    fromCity: string;
    toCity: string;
    cargoType: string;
    weight: string;
    weightWithTrailer: string;
    phone: string;
    description: string;
  }) => void;
}) {
  const { error, setError, phone, setPhone } = useForm(initialPhone);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [weightWithTrailer, setWeightWithTrailer] = useState("");
  const [description, setDescription] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!fromCity || !toCity || !cargoType) return setError("الرجاء تعبئة الحقول المطلوبة");
    if (!isValidSaudiPhone(phone)) return setError("رقم الجوال غير صحيح");
    onSubmit({ fromCity, toCity, cargoType, weight, weightWithTrailer, phone: normalizePhone(phone), description });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="من مدينة" required>
          <CitySelect value={fromCity} onChange={setFromCity} />
        </Field>
        <Field label="إلى مدينة" required>
          <CitySelect value={toCity} onChange={setToCity} />
        </Field>
      </div>
      <Field label="نوع الحمولة" required>
        <Select value={cargoType} onChange={(e) => setCargoType(e.target.value)}>
          <option value="">اختر نوع الحمولة</option>
          {cargoTypes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="الوزن">
          <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="مثال: 25 طن" />
        </Field>
        <Field label="الوزن مع المقطورة">
          <Input value={weightWithTrailer} onChange={(e) => setWeightWithTrailer(e.target.value)} placeholder="مثال: 40 طن" />
        </Field>
      </div>
      <PhoneField phone={phone} setPhone={setPhone} />
      <Field label="الوصف">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="تفاصيل إضافية عن الإعلان..." />
      </Field>
      <FormError error={error} />
      <Button type="submit" size="lg" className="w-full">
        نشر الإعلان
      </Button>
    </form>
  );
}

// ---- Customs ad form ----
function CustomsForm({
  phone: initialPhone,
  onSubmit,
}: {
  phone: string;
  onSubmit: (data: {
    portName: string;
    arrivalDate: string;
    containersCount: string;
    shipmentType: string;
    blNumber: string;
    phone: string;
    notes: string;
  }) => void;
}) {
  const { error, setError, phone, setPhone } = useForm(initialPhone);
  const [portName, setPortName] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [containersCount, setContainersCount] = useState("");
  const [shipmentType, setShipmentType] = useState("");
  const [blNumber, setBlNumber] = useState("");
  const [notes, setNotes] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!portName || !arrivalDate) return setError("الرجاء تعبئة الحقول المطلوبة");
    if (!isValidSaudiPhone(phone)) return setError("رقم الجوال غير صحيح");
    onSubmit({ portName, arrivalDate, containersCount, shipmentType, blNumber, phone: normalizePhone(phone), notes });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="اسم الميناء" required>
        <Select value={portName} onChange={(e) => setPortName(e.target.value)}>
          <option value="">اختر الميناء</option>
          {SAUDI_PORTS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="تاريخ الوصول" required>
          <Input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} />
        </Field>
        <Field label="عدد الحاويات">
          <Input
            type="number"
            min={1}
            value={containersCount}
            onChange={(e) => setContainersCount(e.target.value)}
            placeholder="مثال: 5"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="نوع الشحنة">
          <Select value={shipmentType} onChange={(e) => setShipmentType(e.target.value)}>
            <option value="">اختر النوع</option>
            {SHIPMENT_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="رقم البوليصة">
          <Input value={blNumber} onChange={(e) => setBlNumber(e.target.value)} placeholder="Bill of Lading No." dir="ltr" className="text-start" />
        </Field>
      </div>
      <PhoneField phone={phone} setPhone={setPhone} />
      <Field label="ملاحظات">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="تفاصيل إضافية..." />
      </Field>
      <FormError error={error} />
      <Button type="submit" size="lg" className="w-full">
        نشر الإعلان
      </Button>
    </form>
  );
}

// ---- Sale ad form ----
function SaleForm({
  phone: initialPhone,
  onSubmit,
}: {
  phone: string;
  onSubmit: (data: {
    kind: SaleKind;
    title: string;
    price: string;
    location: string;
    description: string;
    images: string[];
    phone: string;
  }) => void;
}) {
  const { error, setError, phone, setPhone } = useForm(initialPhone);
  const [kind, setKind] = useState<SaleKind>("truck");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !price.trim() || !location) return setError("الرجاء تعبئة الحقول المطلوبة");
    if (!isValidSaudiPhone(phone)) return setError("رقم الجوال غير صحيح");
    onSubmit({
      kind,
      title: title.trim(),
      price: price.trim(),
      location,
      description: description.trim(),
      images: images.length ? images : ["https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=70"],
      phone: normalizePhone(phone),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="التصنيف" required>
        <OptionPills options={SALE_KINDS} value={kind} onChange={setKind} columns={3} />
      </Field>
      <Field label="عنوان الإعلان" required>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: شاحنة فولفو 2020 بحالة ممتازة" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="السعر (ر.س)" required>
          <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="مثال: 250000" />
        </Field>
        <Field label="الموقع" required>
          <CitySelect value={location} onChange={setLocation} />
        </Field>
      </div>
      <Field label="الصور">
        <ImageUploader value={images} onChange={setImages} onError={(m) => setError(m)} />
      </Field>
      <PhoneField phone={phone} setPhone={setPhone} />
      <Field label="الوصف">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="تفاصيل الحالة، الموديل، الكيلومترات..." />
      </Field>
      <FormError error={error} />
      <Button type="submit" size="lg" className="w-full">
        نشر الإعلان
      </Button>
    </form>
  );
}

// ---- shared bits ----
function CitySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">اختر المدينة</option>
      {SAUDI_CITIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </Select>
  );
}

function PhoneField({ phone, setPhone }: { phone: string; setPhone: (v: string) => void }) {
  return (
    <Field label="رقم الجوال للتواصل" required>
      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XXXXXXXX" inputMode="tel" dir="ltr" className="text-start" />
    </Field>
  );
}

function FormError({ error }: { error: string }) {
  if (!error) return null;
  return <p className="text-sm font-bold text-red-600">{error}</p>;
}
