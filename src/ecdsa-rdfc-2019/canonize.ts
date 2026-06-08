/*!
 * Copyright (c) 2023-2024 Digital Bazaar, Inc. All rights reserved.
 */
import * as rdfCanonize from 'rdf-canonize'
import jsonld from '@interop/jsonld'

/**
 * Canonizes the given input using RDFC-1.0 and n-quads.
 *
 * @param input - The JSON-LD document to canonize.
 * @param options - The canonize options (e.g. `documentLoader`,
 *   `messageDigestAlgorithm`).
 *
 * @returns The canonized n-quads string.
 */
export async function canonize(
  input: unknown,
  options?: unknown
): Promise<string> {
  // convert to RDF dataset and do canonicalization
  const merged: Record<string, unknown> = {
    algorithm: 'RDFC-1.0',
    format: 'application/n-quads',
    base: null,
    safe: true,
    ...(options as Record<string, unknown> | undefined)
  }
  const opts: Record<string, unknown> = {
    rdfDirection: 'i18n-datatype',
    ...merged,
    produceGeneralizedRdf: false
  }
  delete opts.format
  const dataset = await jsonld.toRDF(input, opts)
  return rdfCanonize.canonize(dataset, merged)
}
