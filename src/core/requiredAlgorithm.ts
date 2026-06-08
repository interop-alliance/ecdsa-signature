/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
// ECDSA Data Integrity suites support both the P-256 and P-384 curves; the
// digest (SHA-256 vs SHA-384) is selected per key. See ./hashAlgorithm.ts.
export const requiredAlgorithm = ['P-256', 'P-384']
