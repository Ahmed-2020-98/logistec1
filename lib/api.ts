// ===== HTTP client for the Laravel API =====

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "glx:auth:token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
  error?: string;
}

function firstValidationError(json: unknown): string | undefined {
  const errors = (json as { errors?: Record<string, string[]> })?.errors;
  if (errors) {
    const key = Object.keys(errors)[0];
    return errors[key]?.[0];
  }
  return undefined;
}

async function apiFetch<T>(
  path: string,
  init: { method?: string; body?: unknown; form?: FormData } = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (init.form) {
    body = init.form;
  } else if (init.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.body);
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { method: init.method ?? "GET", headers, body });
  } catch {
    return { ok: false, status: 0, data: null as T, error: "تعذّر الاتصال بالخادم" };
  }

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    const error =
      (json as { message?: string })?.message ||
      firstValidationError(json) ||
      "حدث خطأ غير متوقع";
    return { ok: false, status: res.status, data: json as T, error };
  }

  return { ok: true, status: res.status, data: json as T };
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "POST", body }),
  postForm: <T>(path: string, form: FormData) => apiFetch<T>(path, { method: "POST", form }),
  put: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "PUT", body }),
  del: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
