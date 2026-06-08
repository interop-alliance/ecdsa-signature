/*!
 * Copyright (c) 2023-2024 Digital Bazaar, Inc. All rights reserved.
 */
import { canonize } from './canonize.js'
import { createVerifyData } from './createVerifyData.js'
import { createVerifier } from '../core/createVerifier.js'
import { requiredAlgorithm } from '../core/requiredAlgorithm.js'
import type { Cryptosuite } from '@interop/data-integrity-proof'

/**
 * The `ecdsa-rdfc-2019` Data Integrity cryptosuite -- a single static
 * cryptosuite object used for both signing and verification with
 * `DataIntegrityProof`. Canonicalization is RDFC-1.0 (n-quads).
 */
export const ecdsaRdfc2019: Cryptosuite = {
  name: 'ecdsa-rdfc-2019',
  canonize,
  createVerifier,
  createVerifyData,
  requiredAlgorithm
}
