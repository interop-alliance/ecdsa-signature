// Type declarations for untyped runtime dependencies.
//
// `@interop/data-integrity-proof` ships its own types (DataIntegrityProof,
// Cryptosuite) and `@interop/data-integrity-core` supplies ISigner / IVerifier /
// IVerificationMethod / IProofDescription, and `@interop/ecdsa-multikey` ships
// its own types, so none of those need an ambient declaration here. Only the
// genuinely untyped runtime deps below remain.

declare module 'canonicalize' {
  function canonicalize(value: unknown): string | undefined
  export default canonicalize
}

declare module 'rdf-canonize' {
  export function canonize(dataset: unknown, options: unknown): Promise<string>
}

declare module '@interop/jsonld' {
  const jsonld: {
    toRDF(input: unknown, options?: unknown): Promise<unknown>
    [key: string]: unknown
  }
  export default jsonld
}
