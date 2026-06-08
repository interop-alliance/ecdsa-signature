/*!
 * Copyright (c) 2023-2024 Digital Bazaar, Inc. All rights reserved.
 */
/**
 * Concatenates two Uint8Arrays into a new one.
 *
 * @param buffer1 - The first array.
 * @param buffer2 - The second array.
 *
 * @returns The concatenation of `buffer1` followed by `buffer2`.
 */
export function concat(buffer1: Uint8Array, buffer2: Uint8Array): Uint8Array {
  const combined = new Uint8Array(buffer1.length + buffer2.length)
  combined.set(buffer1, 0)
  combined.set(buffer2, buffer1.length)
  return combined
}
