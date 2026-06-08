/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey'

/**
 * Creates a verifier for the given verification method.
 *
 * @param options - The options to use.
 * @param options.verificationMethod - The verification method (a multikey).
 *
 * @returns The verifier.
 */
export async function createVerifier({
  verificationMethod
}: {
  verificationMethod: any
}): Promise<any> {
  const key = await EcdsaMultikey.from(verificationMethod)
  const verifier = key.verifier()
  return verifier
}
