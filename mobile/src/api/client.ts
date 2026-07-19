import type { ErrorResponse } from '@atur-perjalanan/shared-types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/v1';

/** Error raised for any non-2xx API response. Carries the backend `code` + `x-request-id`. */
export class ApiError extends Error {
  readonly requestId?: string;
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.requestId = requestId;
  }
}

// --- Injected by AuthProvider -------------------------------------------------

/** Synchronous access-token getter (AuthProvider keeps a live ref). */
type TokenGetter = () => string | null;
let tokenGetter: TokenGetter = () => null;

/** 401 handler — AuthProvider wires this to sign-out + redirect. The backend
 *  issues a 24h JWT with no refresh endpoint, so 401 = clear & re-authenticate. */
type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler = () => {};

export function setTokenGetter(getter: TokenGetter): void {
  tokenGetter = getter;
}

export function setOnUnauthorized(handler: UnauthorizedHandler): void {
  onUnauthorized = handler;
}

// -----------------------------------------------------------------------------

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  requiresAuth = true,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (requiresAuth) {
    const token = tokenGetter();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      err instanceof Error ? err.message : 'Network request failed',
    );
  }

  const requestId = response.headers.get('x-request-id') ?? undefined;

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const isEnvelope = (v: unknown): v is ErrorResponse =>
      typeof v === 'object' &&
      v !== null &&
      'error' in v &&
      typeof (v as ErrorResponse).error === 'object';

    const code = isEnvelope(data) ? data.error.code ?? 'UNKNOWN' : 'UNKNOWN';
    const message = isEnvelope(data) ? data.error.message ?? 'Request failed' : 'Request failed';

    if (response.status === 401) onUnauthorized();
    throw new ApiError(response.status, code, message, requestId);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, auth = true) => request<T>('GET', path, undefined, auth),
  post: <T>(path: string, body?: unknown, auth = true) => request<T>('POST', path, body, auth),
  put: <T>(path: string, body?: unknown, auth = true) => request<T>('PUT', path, body, auth),
  delete: <T>(path: string, auth = true) => request<T>('DELETE', path, undefined, auth),
};
