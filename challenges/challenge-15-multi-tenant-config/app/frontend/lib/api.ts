const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const body = await res.text();
    const err = Object.assign(new Error(body || res.statusText), { status: res.status });
    throw err;
  }
  return res.json() as Promise<T>;
}
