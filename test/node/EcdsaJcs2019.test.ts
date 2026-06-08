/*!
 * Copyright (c) 2026 Interop Alliance. All rights reserved.
 */
import { describe, it, expect } from 'vitest'
import { DataIntegrityProof } from '@interop/data-integrity-proof'
import jsigs from '@interop/jsonld-signatures'
import * as EcdsaMultikey from '@interop/ecdsa-multikey'
import { EcdsaJcs2019 } from '../../src/index.js'
import { createVerifyCryptosuite } from '../../src/ecdsa-jcs-2019/index.js'
import { credential, ecdsaMultikeyKeyPair } from '../mock-data.js'
import { loader } from '../documentLoader.js'

const {
  purposes: { AssertionProofPurpose }
} = jsigs as any

const documentLoader = loader.build()

describe('EcdsaJcs2019 suite class', () => {
  it('signs via `new EcdsaJcs2019({ signer })` (ecdsa-jcs-2019 proof)', async () => {
    const keyPair: any = await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair })
    const signer = keyPair.signer()

    const signed: any = await jsigs.sign(
      { ...JSON.parse(JSON.stringify(credential)) },
      {
        suite: new EcdsaJcs2019({ signer }),
        purpose: new AssertionProofPurpose(),
        documentLoader
      }
    )

    expect(signed.proof.type).toBe('DataIntegrityProof')
    expect(signed.proof.cryptosuite).toBe('ecdsa-jcs-2019')

    const result: any = await jsigs.verify(signed, {
      suite: new DataIntegrityProof({ cryptosuite: createVerifyCryptosuite() }),
      purpose: new AssertionProofPurpose(),
      documentLoader
    })
    expect(result.verified).toBe(true)
  })

  it('honors the supplied `date` as proof.created', async () => {
    const keyPair: any = await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair })
    const signer = keyPair.signer()
    const date = '2020-01-01T19:23:24Z'

    const signed: any = await jsigs.sign(
      { ...JSON.parse(JSON.stringify(credential)) },
      {
        suite: new EcdsaJcs2019({ signer, date }),
        purpose: new AssertionProofPurpose(),
        documentLoader
      }
    )

    expect(signed.proof.created).toBe(date)
  })
})
