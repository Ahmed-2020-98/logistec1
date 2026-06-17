"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Banner,
  CargoType,
  CustomsAd,
  QuickLink,
  SaleAd,
  SaleKind,
  ServiceRequest,
  TransportAd,
  User,
} from "@/lib/types";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthProvider";

interface DB {
  users: User[];
  transportAds: TransportAd[];
  customsAds: CustomsAd[];
  saleAds: SaleAd[];
  serviceRequests: ServiceRequest[];
  banners: Banner[];
  quickLinks: QuickLink[];
  cargoTypes: CargoType[];
}

const EMPTY: DB = {
  users: [],
  transportAds: [],
  customsAds: [],
  saleAds: [],
  serviceRequests: [],
  banners: [],
  quickLinks: [],
  cargoTypes: [],
};

// ---- Input payloads for create/update ----
type TransportInput = Omit<TransportAd, "id" | "createdAt" | "category" | "userId">;
type CustomsInput = Omit<CustomsAd, "id" | "createdAt" | "category" | "userId">;
type SaleInput = {
  kind: SaleKind;
  title: string;
  price: string;
  location: string;
  description: string;
  phone: string;
  imageFiles: File[];
};
type RequestInput = Omit<ServiceRequest, "id" | "createdAt" | "userId">;
type BannerInput = { id?: string } & Omit<Banner, "id">;
type QuickLinkInput = { id?: string } & Omit<QuickLink, "id">;

interface StoreContextValue extends DB {
  ready: boolean;
  addTransportAd: (data: TransportInput) => Promise<TransportAd | null>;
  addCustomsAd: (data: CustomsInput) => Promise<CustomsAd | null>;
  addSaleAd: (data: SaleInput) => Promise<SaleAd | null>;
  deleteAd: (category: "transport" | "customs" | "sale", id: string) => Promise<void>;
  addServiceRequest: (data: RequestInput) => Promise<ServiceRequest | null>;
  deleteServiceRequest: (id: string) => Promise<void>;
  saveBanner: (b: BannerInput) => Promise<boolean>;
  deleteBanner: (id: string) => Promise<void>;
  saveQuickLink: (q: QuickLinkInput) => Promise<boolean>;
  deleteQuickLink: (id: string) => Promise<void>;
  saveCargoType: (c: { id?: string; name: string }) => Promise<boolean>;
  deleteCargoType: (id: string) => Promise<void>;
  updateUser: (u: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetDemo: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, ready: authReady } = useAuth();
  const [db, setDb] = useState<DB>(EMPTY);
  const [ready, setReady] = useState(false);

  const patch = useCallback((p: Partial<DB>) => setDb((d) => ({ ...d, ...p })), []);

  // Public collections — loaded once on mount.
  useEffect(() => {
    (async () => {
      const [b, q, c, t, cu, s] = await Promise.all([
        api.get<{ data: Banner[] }>("/banners"),
        api.get<{ data: QuickLink[] }>("/quick-links"),
        api.get<{ data: CargoType[] }>("/cargo-types"),
        api.get<{ data: TransportAd[] }>("/ads/transport"),
        api.get<{ data: CustomsAd[] }>("/ads/customs"),
        api.get<{ data: SaleAd[] }>("/ads/sale"),
      ]);
      patch({
        banners: b.ok ? b.data.data : [],
        quickLinks: q.ok ? q.data.data : [],
        cargoTypes: c.ok ? c.data.data : [],
        transportAds: t.ok ? t.data.data : [],
        customsAds: cu.ok ? cu.data.data : [],
        saleAds: s.ok ? s.data.data : [],
      });
      setReady(true);
    })();
  }, [patch]);

  // Protected collections — depend on the authenticated user.
  useEffect(() => {
    if (!authReady) return;
    (async () => {
      if (!user) {
        patch({ serviceRequests: [], users: [] });
        return;
      }
      if (isAdmin) {
        const [sr, us] = await Promise.all([
          api.get<{ data: ServiceRequest[] }>("/admin/service-requests"),
          api.get<{ data: User[] }>("/admin/users"),
        ]);
        patch({
          serviceRequests: sr.ok ? sr.data.data : [],
          users: us.ok ? us.data.data : [],
        });
      } else {
        const sr = await api.get<{ data: ServiceRequest[] }>("/me/service-requests");
        patch({ serviceRequests: sr.ok ? sr.data.data : [], users: [] });
      }
    })();
  }, [authReady, user, isAdmin, patch]);

  const value = useMemo<StoreContextValue>(() => {
    return {
      ...db,
      ready,
      addTransportAd: async (data) => {
        const res = await api.post<{ data: TransportAd }>("/ads/transport", data);
        if (!res.ok) return null;
        setDb((d) => ({ ...d, transportAds: [res.data.data, ...d.transportAds] }));
        return res.data.data;
      },
      addCustomsAd: async (data) => {
        const res = await api.post<{ data: CustomsAd }>("/ads/customs", data);
        if (!res.ok) return null;
        setDb((d) => ({ ...d, customsAds: [res.data.data, ...d.customsAds] }));
        return res.data.data;
      },
      addSaleAd: async (data) => {
        const fd = new FormData();
        fd.append("kind", data.kind);
        fd.append("title", data.title);
        fd.append("price", data.price);
        fd.append("location", data.location);
        fd.append("description", data.description);
        fd.append("phone", data.phone);
        data.imageFiles.forEach((f) => fd.append("images[]", f));
        const res = await api.postForm<{ data: SaleAd }>("/ads/sale", fd);
        if (!res.ok) return null;
        setDb((d) => ({ ...d, saleAds: [res.data.data, ...d.saleAds] }));
        return res.data.data;
      },
      deleteAd: async (category, id) => {
        const res = await api.del(`/ads/${category}/${id}`);
        if (!res.ok) return;
        setDb((d) => ({
          ...d,
          transportAds: category === "transport" ? d.transportAds.filter((a) => a.id !== id) : d.transportAds,
          customsAds: category === "customs" ? d.customsAds.filter((a) => a.id !== id) : d.customsAds,
          saleAds: category === "sale" ? d.saleAds.filter((a) => a.id !== id) : d.saleAds,
        }));
      },
      addServiceRequest: async (data) => {
        const res = await api.post<{ data: ServiceRequest }>("/service-requests", data);
        if (!res.ok) return null;
        setDb((d) => ({ ...d, serviceRequests: [res.data.data, ...d.serviceRequests] }));
        return res.data.data;
      },
      deleteServiceRequest: async (id) => {
        const res = await api.del(`/service-requests/${id}`);
        if (res.ok) setDb((d) => ({ ...d, serviceRequests: d.serviceRequests.filter((r) => r.id !== id) }));
      },
      saveBanner: async (b) => {
        const payload = { title: b.title, description: b.description, buttonText: b.buttonText, url: b.url, image: b.image };
        const res = b.id
          ? await api.post<{ data: Banner }>(`/admin/banners/${b.id}`, payload)
          : await api.post<{ data: Banner }>("/admin/banners", payload);
        if (!res.ok) return false;
        const saved = res.data.data;
        setDb((d) => ({
          ...d,
          banners: b.id ? d.banners.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...d.banners],
        }));
        return true;
      },
      deleteBanner: async (id) => {
        const res = await api.del(`/admin/banners/${id}`);
        if (res.ok) setDb((d) => ({ ...d, banners: d.banners.filter((x) => x.id !== id) }));
      },
      saveQuickLink: async (q) => {
        const payload = { title: q.title, url: q.url, image: q.image };
        const res = q.id
          ? await api.post<{ data: QuickLink }>(`/admin/quick-links/${q.id}`, payload)
          : await api.post<{ data: QuickLink }>("/admin/quick-links", payload);
        if (!res.ok) return false;
        const saved = res.data.data;
        setDb((d) => ({
          ...d,
          quickLinks: q.id ? d.quickLinks.map((x) => (x.id === saved.id ? saved : x)) : [...d.quickLinks, saved],
        }));
        return true;
      },
      deleteQuickLink: async (id) => {
        const res = await api.del(`/admin/quick-links/${id}`);
        if (res.ok) setDb((d) => ({ ...d, quickLinks: d.quickLinks.filter((x) => x.id !== id) }));
      },
      saveCargoType: async (c) => {
        const res = c.id
          ? await api.put<{ data: CargoType }>(`/admin/cargo-types/${c.id}`, { name: c.name })
          : await api.post<{ data: CargoType }>("/admin/cargo-types", { name: c.name });
        if (!res.ok) return false;
        const saved = res.data.data;
        setDb((d) => ({
          ...d,
          cargoTypes: c.id ? d.cargoTypes.map((x) => (x.id === saved.id ? saved : x)) : [...d.cargoTypes, saved],
        }));
        return true;
      },
      deleteCargoType: async (id) => {
        const res = await api.del(`/admin/cargo-types/${id}`);
        if (res.ok) setDb((d) => ({ ...d, cargoTypes: d.cargoTypes.filter((x) => x.id !== id) }));
      },
      updateUser: async (u) => {
        const res = await api.put<{ user: User }>(`/admin/users/${u.id}`, {
          role: u.role,
          isVerified: u.isVerified,
        });
        if (res.ok) setDb((d) => ({ ...d, users: d.users.map((x) => (x.id === u.id ? res.data.user : x)) }));
      },
      deleteUser: async (id) => {
        const res = await api.del(`/admin/users/${id}`);
        if (res.ok) setDb((d) => ({ ...d, users: d.users.filter((x) => x.id !== id) }));
      },
      resetDemo: async () => {
        await api.post("/admin/reset-demo");
        // reload everything
        window.location.reload();
      },
    };
  }, [db, ready]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
