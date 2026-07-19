/**
 * Platform-abstracted token storage.
 *
 * This base file exists ONLY so TypeScript can resolve the bare import
 * `'@/lib/secureStorage'`. Metro selects the platform-specific sibling at
 * bundle time — `secureStorage.native.ts` on native, `secureStorage.web.ts`
 * on web — and never bundles this file. See `tokenStorage.types.ts`.
 */
export type { TokenStorage } from './tokenStorage.types';
export { secureStorage } from './secureStorage.native';
