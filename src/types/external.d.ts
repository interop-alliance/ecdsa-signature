/*
 * Ambient type shims for untyped runtime dependencies. These cover only the
 * surface this library actually uses; they are not full type definitions.
 */
declare module '@digitalbazaar/ecdsa-multikey' {
  export function from(key: any): Promise<any>
}

declare module 'jsonld' {
  const jsonld: any
  export default jsonld
}

declare module 'rdf-canonize' {
  export function canonize(dataset: any, options?: any): Promise<string>
}
