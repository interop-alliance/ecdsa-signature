/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import { canonize } from './canonize.js'
import { createVerifier } from '../core/createVerifier.js'
import { requiredAlgorithm } from '../core/requiredAlgorithm.js'
import {
  createVerifyDataFn,
  type CreateVerifyDataFn
} from './createVerifyData.js'
import type { Cryptosuite } from '@interop/data-integrity-proof'

const NAME = 'ecdsa-jcs-2019'

function throwSignUsageError(): never {
  throw new Error(
    'This cryptosuite must only be used with "sign". ' +
      'Use createVerifyCryptosuite() for verification.'
  )
}

export interface JcsSignCryptosuite extends Cryptosuite {
  name: string
  canonize: typeof canonize
  requiredAlgorithm: string[]
  createVerifier: () => never
  createVerifyData: CreateVerifyDataFn
}

export interface JcsVerifyCryptosuite extends Cryptosuite {
  name: string
  canonize: typeof canonize
  requiredAlgorithm: string[]
  createVerifier: typeof createVerifier
  createVerifyData: CreateVerifyDataFn
}

/**
 * Creates the sign-mode `ecdsa-jcs-2019` cryptosuite. `createVerifier` throws;
 * use {@link createVerifyCryptosuite} for verification.
 *
 * @returns The sign cryptosuite.
 */
export function createSignCryptosuite(): JcsSignCryptosuite {
  return {
    name: NAME,
    canonize,
    requiredAlgorithm,
    createVerifier: throwSignUsageError,
    createVerifyData: createVerifyDataFn('sign')
  }
}

/**
 * Creates the verify-mode `ecdsa-jcs-2019` cryptosuite.
 *
 * @returns The verify cryptosuite.
 */
export function createVerifyCryptosuite(): JcsVerifyCryptosuite {
  return {
    name: NAME,
    canonize,
    requiredAlgorithm,
    createVerifier,
    createVerifyData: createVerifyDataFn('verify')
  }
}
