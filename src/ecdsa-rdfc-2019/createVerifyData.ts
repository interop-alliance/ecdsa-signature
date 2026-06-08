/*!
 * Copyright (c) 2023-2024 Digital Bazaar, Inc. All rights reserved.
 */
import { sha } from '../core/sha.js'
import { concat } from '../core/concat.js'
import { getHashAlgorithm } from '../core/hashAlgorithm.js'

/**
 * Creates the verify data for the ecdsa-rdfc-2019 cryptosuite: the hash of the
 * canonized proof options concatenated with the hash of the canonized document.
 * Both halves use RDFC-1.0 canonicalization and the curve-derived digest.
 *
 * @param options - The options to use.
 *
 * @returns The concatenated digest.
 */
export async function createVerifyData({
  cryptosuite,
  document,
  proof,
  documentLoader,
  dataIntegrityProof,
  verificationMethod
}: {
  cryptosuite?: any
  document?: any
  proof?: any
  documentLoader?: any
  dataIntegrityProof?: any
  verificationMethod?: any
} = {}): Promise<Uint8Array> {
  const algorithm = await getHashAlgorithm({
    verificationMethod,
    dataIntegrityProof
  })

  const c14nOptions = {
    documentLoader,
    safe: true,
    base: null,
    skipExpansion: false,
    messageDigestAlgorithm: algorithm
  }

  // await both c14n proof hash and c14n document hash
  const [proofHash, docHash] = await Promise.all([
    // canonize and hash proof
    _canonizeProof(proof, {
      document,
      cryptosuite,
      dataIntegrityProof,
      c14nOptions
    }).then(c14nProofOptions => sha({ algorithm, string: c14nProofOptions })),
    // canonize and hash document
    cryptosuite
      .canonize(document, c14nOptions)
      .then((c14nDocument: string) => sha({ algorithm, string: c14nDocument }))
  ])
  // concatenate hash of c14n proof options and hash of c14n document
  return concat(proofHash, docHash)
}

async function _canonizeProof(
  proof: any,
  {
    document,
    cryptosuite,
    dataIntegrityProof,
    c14nOptions
  }: {
    document?: any
    cryptosuite?: any
    dataIntegrityProof?: any
    c14nOptions?: any
  }
): Promise<string> {
  // `proofValue` must not be included in the proof options
  proof = {
    '@context': document['@context'],
    ...proof
  }
  dataIntegrityProof.ensureSuiteContext({
    document: proof,
    addSuiteContext: true
  })
  delete proof.proofValue
  return cryptosuite.canonize(proof, c14nOptions)
}
