/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import canonicalize from 'canonicalize'

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
  const result = canonicalize(input)
  if (result === undefined) {
    throw new TypeError('JCS canonicalize returned undefined for input')
  }
  return result
}
