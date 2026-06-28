/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
/**
 * Canonizes the given input using the JSON Canonicalization Scheme (JCS,
 * RFC 8785). Unlike RDFC-1.0 this does not expand JSON-LD, so no
 * `documentLoader` is required; any options are ignored.
 *
 * @param input - The document to canonize.
 *
 * @returns The canonical JSON string.
 */
export async function canonize(input: unknown): Promise<string> {
  // Imported dynamically: canonicalize@3 is ESM-only and its exports map
  // declares no `default`/`require` condition, so a static import keeps it in
  // the module graph and breaks CJS-path resolvers (e.g. tsx). Awaiting it here
  // resolves via the native ESM `import` condition instead.
  const { default: canonicalize } = await import('canonicalize')
  const result = canonicalize(input)
  if (result === undefined) {
    throw new TypeError('JCS canonicalize returned undefined for input')
  }
  return result
}
