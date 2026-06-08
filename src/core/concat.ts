/*!
 * Copyright (c) 2023-2024 Digital Bazaar, Inc. All rights reserved.
 */
/**
 * Concatenates two Uint8Arrays into a new one.
 *
 * @param b1 - The first array.
 * @param b2 - The second array.
 *
 * @returns The concatenation of `b1` followed by `b2`.
 */
export function concat(b1: Uint8Array, b2: Uint8Array): Uint8Array {
  const rval = new Uint8Array(b1.length + b2.length)
  rval.set(b1, 0)
  rval.set(b2, b1.length)
  return rval
}
