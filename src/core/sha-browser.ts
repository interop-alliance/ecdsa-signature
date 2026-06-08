/*
 * Copyright (c) 2022-2024 Digital Bazaar, Inc. All rights reserved.
 */
const crypto =
  self && (self.crypto || (self as unknown as { msCrypto: Crypto }).msCrypto)

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
  const bytes = new TextEncoder().encode(string)
  return new Uint8Array(await crypto.subtle.digest(algorithm, bytes))
}
