import type { ServiceError } from "../../types/auth";
import { API_BASE_URL } from "../config/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export async function httpRequest<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  token?: string
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error?.message ||
      (Array.isArray(data?.errors) ? data.errors[0]?.msg : null) ||
      "Erro na requisição.";
    const err: ServiceError = { message, code: data?.code };
    throw err;
  }

  return data as T;
}
