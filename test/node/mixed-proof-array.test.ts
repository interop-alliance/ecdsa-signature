/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { DataIntegrityProof } from '@interop/data-integrity-proof'
import jsigs from '@interop/jsonld-signatures'
import * as EcdsaMultikey from '@interop/ecdsa-multikey'
import { ecdsaRdfc2019 } from '../../src/ecdsa-rdfc-2019/index.js'
import {
  createSignCryptosuite,
  createVerifyCryptosuite
} from '../../src/ecdsa-jcs-2019/index.js'
import { credential, ecdsaMultikeyKeyPair } from '../mock-data.js'
import { loader } from '../documentLoader.js'

const {
  purposes: { AssertionProofPurpose }
} = jsigs as any

const documentLoader = loader.build()

// One credential carrying both an ecdsa-rdfc-2019 (RDFC-1.0) and an
// ecdsa-jcs-2019 (JCS) proof. The mock credential's @context already includes
// the Data Integrity context required by both suites.
describe('mixed proof array (one VC, two ecdsa cryptosuites)', () => {
  let signed: any

  beforeAll(async () => {
    const keyPair: any = await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair })

    // 1) ecdsa-rdfc-2019 (DataIntegrityProof, RDFC-1.0)
    signed = await jsigs.sign(
      { ...JSON.parse(JSON.stringify(credential)) },
      {
        suite: new DataIntegrityProof({
          cryptosuite: ecdsaRdfc2019,
          signer: keyPair.signer()
        }),
        purpose: new AssertionProofPurpose(),
        documentLoader
      }
    )

    // 2) ecdsa-jcs-2019 (DataIntegrityProof, JCS) -- appends to the proof set
    signed = await jsigs.sign(signed, {
      suite: new DataIntegrityProof({
        cryptosuite: createSignCryptosuite(),
        signer: keyPair.signer()
      }),
      purpose: new AssertionProofPurpose(),
      documentLoader
    })
  })

  it('accumulates both proofs into a proof set', () => {
    expect(Array.isArray(signed.proof)).toBe(true)
    expect(signed.proof).toHaveLength(2)

    const rdfc = signed.proof.find(
      (proof: any) => proof.cryptosuite === 'ecdsa-rdfc-2019'
    )
    const jcs = signed.proof.find(
      (proof: any) => proof.cryptosuite === 'ecdsa-jcs-2019'
    )

    expect(rdfc.type).toBe('DataIntegrityProof')
    expect(jcs.type).toBe('DataIntegrityProof')
  })

  it('verifies both proofs in a single jsigs.verify call', async () => {
    const result: any = await jsigs.verify(signed, {
      suite: [
        new DataIntegrityProof({ cryptosuite: ecdsaRdfc2019 }),
        new DataIntegrityProof({ cryptosuite: createVerifyCryptosuite() })
      ],
      purpose: new AssertionProofPurpose(),
      documentLoader
    })

    expect(result.verified).toBe(true)
    expect(result.results).toHaveLength(2)
    for (const oneResult of result.results) {
      expect(oneResult.verified).toBe(true)
    }
  })

  // jsigs proof-set verify returns verified=true if *any* matched proof
  // verifies, so tampering one proof flips that proof's own per-proof result
  // rather than the overall result. Assert at that granularity.
  it('reports a tampered proof as failed in its per-proof result', async () => {
    const tampered = JSON.parse(JSON.stringify(signed))
    const rdfcProof = tampered.proof.find(
      (proof: any) => proof.cryptosuite === 'ecdsa-rdfc-2019'
    )
    const value = rdfcProof.proofValue
    rdfcProof.proofValue =
      value.slice(0, -2) + (value.slice(-2) === 'aa' ? 'bb' : 'aa')

    const result: any = await jsigs.verify(tampered, {
      suite: [
        new DataIntegrityProof({ cryptosuite: ecdsaRdfc2019 }),
        new DataIntegrityProof({ cryptosuite: createVerifyCryptosuite() })
      ],
      purpose: new AssertionProofPurpose(),
      documentLoader
    })

    const rdfcResult = result.results.find(
      (oneResult: any) => oneResult.proof?.cryptosuite === 'ecdsa-rdfc-2019'
    )
    expect(rdfcResult).toBeTruthy()
    expect(rdfcResult!.verified).toBe(false)

    const others = result.results.filter(
      (oneResult: any) => oneResult.proof?.cryptosuite !== 'ecdsa-rdfc-2019'
    )
    expect(others).toHaveLength(1)
    for (const oneResult of others) {
      expect(oneResult.verified).toBe(true)
    }
  })
})
