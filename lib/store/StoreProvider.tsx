"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  Banner,
  CargoType,
  CustomsAd,
  QuickLink,
  SaleAd,
  ServiceRequest,
  TransportAd,
  User,
} from "@/lib/types";
import { genId } from "@/lib/utils";
import {
  seedBanners,
  seedCargoTypes,
  seedCustomsAds,
  seedQuickLinks,
  seedSaleAds,
  seedServiceRequests,
  seedTransportAds,
  seedUsers,
} from "@/lib/seed";

const DB_KEY = "glx:db:v1";

export interface DB {
  users: User[];
  transportAds: TransportAd[];
  customsAds: CustomsAd[];
  saleAds: SaleAd[];
  serviceRequests: ServiceRequest[];
  banners: Banner[];
  quickLinks: QuickLink[];
  cargoTypes: CargoType[];
}

function seedDb(): DB {
  return {
    users: seedUsers,
    transportAds: seedTransportAds,
    customsAds: seedCustomsAds,
    saleAds: seedSaleAds,
    serviceRequests: seedServiceRequests,
    banners: seedBanners,
    quickLinks: seedQuickLinks,
    cargoTypes: seedCargoTypes,
  };
}

function upsert<T extends { id: string }>(arr: T[], item: T): T[] {
  const i = arr.findIndex((x) => x.id === item.id);
  if (i === -1) return [item, ...arr];
  const copy = arr.slice();
  copy[i] = item;
  return copy;
}

function removeById<T extends { id: string }>(arr: T[], id: string): T[] {
  return arr.filter((x) => x.id !== id);
}

interface StoreContextValue extends DB {
  ready: boolean;
  // ads
  addTransportAd: (data: Omit<TransportAd, "id" | "createdAt" | "category">) => TransportAd;
  addCustomsAd: (data: Omit<CustomsAd, "id" | "createdAt" | "category">) => CustomsAd;
  addSaleAd: (data: Omit<SaleAd, "id" | "createdAt" | "category">) => SaleAd;
  deleteAd: (category: "transport" | "customs" | "sale", id: string) => void;
  // service requests
  addServiceRequest: (data: Omit<ServiceRequest, "id" | "createdAt">) => ServiceRequest;
  deleteServiceRequest: (id: string) => void;
  // admin-managed content
  saveBanner: (b: Banner) => void;
  deleteBanner: (id: string) => void;
  saveQuickLink: (q: QuickLink) => void;
  deleteQuickLink: (id: string) => void;
  saveCargoType: (c: CargoType) => void;
  deleteCargoType: (id: string) => void;
  // users
  addUser: (u: User) => void;
  updateUser: (u: User) => void;
  deleteUser: (id: string) => void;
  // utility
  resetDemo: () => void;
  newId: () => string;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(seedDb);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) {
        setDb({ ...seedDb(), ...(JSON.parse(raw) as Partial<DB>) } as DB);
      } else {
        localStorage.setItem(DB_KEY, JSON.stringify(seedDb()));
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {
      // Likely quota exceeded (too many/large images stored as data URLs).
      console.warn("تعذّر حفظ البيانات محلياً (قد تكون المساحة ممتلئة).", e);
    }
  }, [db, ready]);

  const value = useMemo<StoreContextValue>(() => {
    const newId = () => genId();
    const now = () => new Date().toISOString();

    return {
      ...db,
      ready,
      newId,
      addTransportAd: (data) => {
        const ad: TransportAd = { ...data, category: "transport", id: newId(), createdAt: now() };
        setDb((d) => ({ ...d, transportAds: [ad, ...d.transportAds] }));
        return ad;
      },
      addCustomsAd: (data) => {
        const ad: CustomsAd = { ...data, category: "customs", id: newId(), createdAt: now() };
        setDb((d) => ({ ...d, customsAds: [ad, ...d.customsAds] }));
        return ad;
      },
      addSaleAd: (data) => {
        const ad: SaleAd = { ...data, category: "sale", id: newId(), createdAt: now() };
        setDb((d) => ({ ...d, saleAds: [ad, ...d.saleAds] }));
        return ad;
      },
      deleteAd: (category, id) =>
        setDb((d) => {
          if (category === "transport") return { ...d, transportAds: removeById(d.transportAds, id) };
          if (category === "customs") return { ...d, customsAds: removeById(d.customsAds, id) };
          return { ...d, saleAds: removeById(d.saleAds, id) };
        }),
      addServiceRequest: (data) => {
        const req: ServiceRequest = { ...data, id: newId(), createdAt: now() };
        setDb((d) => ({ ...d, serviceRequests: [req, ...d.serviceRequests] }));
        return req;
      },
      deleteServiceRequest: (id) =>
        setDb((d) => ({ ...d, serviceRequests: removeById(d.serviceRequests, id) })),
      saveBanner: (b) => setDb((d) => ({ ...d, banners: upsert(d.banners, b) })),
      deleteBanner: (id) => setDb((d) => ({ ...d, banners: removeById(d.banners, id) })),
      saveQuickLink: (q) => setDb((d) => ({ ...d, quickLinks: upsert(d.quickLinks, q) })),
      deleteQuickLink: (id) => setDb((d) => ({ ...d, quickLinks: removeById(d.quickLinks, id) })),
      saveCargoType: (c) => setDb((d) => ({ ...d, cargoTypes: upsert(d.cargoTypes, c) })),
      deleteCargoType: (id) => setDb((d) => ({ ...d, cargoTypes: removeById(d.cargoTypes, id) })),
      addUser: (u) => setDb((d) => ({ ...d, users: [u, ...d.users] })),
      updateUser: (u) => setDb((d) => ({ ...d, users: upsert(d.users, u) })),
      deleteUser: (id) => setDb((d) => ({ ...d, users: removeById(d.users, id) })),
      resetDemo: () => {
        const fresh = seedDb();
        setDb(fresh);
        try {
          localStorage.setItem(DB_KEY, JSON.stringify(fresh));
        } catch {
          /* ignore */
        }
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
