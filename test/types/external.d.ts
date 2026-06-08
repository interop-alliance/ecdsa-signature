/*
 * Ambient type shims for untyped test-only dependencies. These cover only the
 * surface the test suite uses; they are not full type definitions.
 * (`@interop/data-integrity-proof`, `@interop/jsonld-signatures`,
 * `@interop/security-document-loader` and `@interop/ecdsa-multikey` ship their
 * own types and so are intentionally absent here.)
 */
declare module '@interop/did-method-key' {
  export function driver(options?: any): any
}

declare module '@interop/did-io' {
  export class CachedResolver {
    constructor(options?: any)
    [key: string]: any
  }
}
