const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);
  if (res.status === 204) return undefined as T;
  const body = await res.json();
  if (!res.ok) {
    const message = body?.error?.message ?? res.statusText;
    throw Object.assign(new Error(message), { status: res.status, code: body?.error?.code });
  }
  return body.data as T;
}
