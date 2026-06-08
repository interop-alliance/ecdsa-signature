/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import type {
  IVerifier,
  IVerificationMethod
} from '@interop/data-integrity-core'
import * as EcdsaMultikey from '@interop/ecdsa-multikey'

/**
 * Creates a verifier for the given verification method. Shared by both the
 * ecdsa-rdfc-2019 and ecdsa-jcs-2019 cryptosuites.
 *
 * @param options - The options to use.
 * @param options.verificationMethod - The verification method (a multikey).
 *
 * @returns The verifier (carries `algorithm`, one of 'P-256' | 'P-384').
 */
export async function createVerifier({
  verificationMethod
}: {
  verificationMethod: IVerificationMethod
}): Promise<IVerifier> {
  const key = await EcdsaMultikey.from(verificationMethod as never)
  return key.verifier()
}
