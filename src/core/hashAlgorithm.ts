/*!
 * Copyright (c) 2023-2024 Digital Bazaar, Inc. All rights reserved.
 */
import * as EcdsaMultikey from '@interop/ecdsa-multikey'

/**
 * Determines the digest algorithm ('SHA-256' for P-256, 'SHA-384' for P-384)
 * from the key used for the operation -- either a `verificationMethod` (verify)
 * or the `dataIntegrityProof`'s `signer` (sign). Shared by both cryptosuites'
 * `createVerifyData` implementations.
 *
 * @param options - The options to use.
 * @param options.verificationMethod - The verification method (verify path).
 * @param options.dataIntegrityProof - The proof instance (sign path; its
 *   `signer.algorithm` is used).
 *
 * @returns The digest algorithm: 'SHA-256' or 'SHA-384'.
 */
export async function getHashAlgorithm({
  verificationMethod,
  dataIntegrityProof
}: {
  verificationMethod?: unknown
  dataIntegrityProof?: { signer?: { algorithm?: string } }
}): Promise<'SHA-256' | 'SHA-384'> {
  let keyAlgorithm: string | undefined
  if (verificationMethod) {
    const key = await EcdsaMultikey.from(verificationMethod as never)
    const verifier = key.verifier()
    keyAlgorithm = verifier.algorithm
  } else if (dataIntegrityProof?.signer?.algorithm) {
    keyAlgorithm = dataIntegrityProof.signer.algorithm
  }
  if (!keyAlgorithm) {
    throw new Error(
      'Either "verificationMethod" or "signer" with "algorithm" must be ' +
        'passed to cryptosuite to determine hash algorithm.'
    )
  }
  return keyAlgorithm === 'P-256' ? 'SHA-256' : 'SHA-384'
}
