/*
 * Ambient type shims for untyped test-only dependencies. These cover only the
 * surface the test suite uses; they are not full type definitions.
 */
declare module '@digitalbazaar/data-integrity' {
  export class DataIntegrityProof {
    constructor(options?: any)
    [key: string]: any
  }
}

declare module 'jsonld-signatures' {
  const jsigs: any
  export default jsigs
}

declare module '@digitalbazaar/did-method-key' {
  export function driver(options?: any): any
}

declare module '@digitalbazaar/did-io' {
  export class CachedResolver {
    constructor(options?: any)
    [key: string]: any
  }
}

declare module '@digitalbazaar/data-integrity-context' {
  const context: any
  export default context
}

declare module '@digitalbazaar/multikey-context' {
  const context: any
  export default context
}

declare module '@digitalbazaar/security-document-loader' {
  export function securityLoader(options?: any): any
}
