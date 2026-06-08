/*
 * Copyright (c) 2022-2024 Digital Bazaar, Inc. All rights reserved.
 */
import crypto from 'node:crypto'

/**
 * Hashes a string of data using SHA-256 or SHA-384.
 *
 * @param options - The options to use.
 * @param options.algorithm - The algorithm to use.
 * @param options.string - The string to hash.
 *
 * @returns The hash digest.
 */
export async function sha({
  algorithm,
  string
}: {
  algorithm: string
  string: string
}): Promise<Uint8Array> {
  algorithm = algorithm === 'SHA-256' ? 'sha256' : 'sha384'
  return new Uint8Array(crypto.createHash(algorithm).update(string).digest())
}
