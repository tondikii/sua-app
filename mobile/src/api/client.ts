import { secureStorage } from '../lib/secureStorage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/v1';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  requiresAuth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = await secureStorage.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (response.status === 204) return undefined as T;

  const data = await response.json();

  if (!response.ok) {
    const error = data?.error ?? {};
    throw new ApiError(response.status, error.code ?? 'UNKNOWN', error.message ?? 'Request failed');
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, auth = true) => request<T>('GET', path, undefined, auth),
  post: <T>(path: string, body: unknown, auth = true) => request<T>('POST', path, body, auth),
  put: <T>(path: string, body: unknown, auth = true) => request<T>('PUT', path, body, auth),
  delete: <T>(path: string, auth = true) => request<T>('DELETE', path, undefined, auth),
};
