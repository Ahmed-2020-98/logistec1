// ===== Domain types for منصة الخليج للخدمات اللوجستية =====

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  fullName: string;
  phone: string; // normalized +9665XXXXXXXX
  password: string; // mock only — never do this in production
  isVerified: boolean;
  role: UserRole;
  createdAt: string;
}

// ---- Service requests ----
export type ServiceType = "transport" | "customs" | "shipping";

export type TransportScope = "domestic" | "international";
export type CustomsKind = "import" | "export" | "transit" | "vehicles";
export type ShippingKind =
  | "dry_containers"
  | "refrigerated_containers"
  | "vehicles"
  | "equipment"
  | "jumbo_bags"
  | "wood";

export interface ServiceRequest {
  id: string;
  type: ServiceType;
  // transport
  scope?: TransportScope;
  fromCity?: string;
  toCity?: string;
  cargoType?: string;
  // customs
  customsKind?: CustomsKind;
  // shipping
  shippingKind?: ShippingKind;
  // common
  name: string;
  mobile: string;
  notes?: string;
  userId?: string | null;
  createdAt: string;
}

// ---- Advertisements ----
export type AdCategory = "transport" | "customs" | "sale";

export interface TransportAd {
  id: string;
  category: "transport";
  fromCity: string;
  toCity: string;
  cargoType: string;
  weight: string;
  weightWithTrailer: string;
  phone: string;
  description: string;
  userId?: string | null;
  createdAt: string;
}

export interface CustomsAd {
  id: string;
  category: "customs";
  portName: string;
  arrivalDate: string;
  containersCount: string;
  shipmentType: string;
  blNumber: string;
  phone: string;
  notes: string;
  userId?: string | null;
  createdAt: string;
}

export type SaleKind = "truck" | "equipment" | "flatbed";

export interface SaleAd {
  id: string;
  category: "sale";
  kind: SaleKind;
  title: string;
  price: string;
  location: string;
  description: string;
  images: string[]; // data URLs
  phone: string;
  userId?: string | null;
  createdAt: string;
}

export type Advertisement = TransportAd | CustomsAd | SaleAd;

// ---- Admin-managed content ----
export interface Banner {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  url: string;
}

export interface QuickLink {
  id: string;
  image: string; // emoji or data URL
  title: string;
  url: string;
}

export interface CargoType {
  id: string;
  name: string;
}
