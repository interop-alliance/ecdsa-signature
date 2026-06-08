/*!
 * Copyright (c) 2023-2024 Digital Bazaar, Inc. All rights reserved.
 */
import { beforeAll, describe, expect, it } from 'vitest'

import jsigs from '@interop/jsonld-signatures'
const {
  purposes: { AssertionProofPurpose }
} = jsigs as any

import * as EcdsaMultikey from '@interop/ecdsa-multikey'
import {
  credential,
  ecdsaMultikeyKeyPair,
  ecdsaSecp256KeyPair
} from '../mock-data.js'
import { DataIntegrityProof } from '@interop/data-integrity-proof'
import { ecdsaRdfc2019 as ecdsa2019Cryptosuite } from '../../src/index.js'

import { loader } from '../documentLoader.js'

const documentLoader = loader.build()

describe('ecdsa-rdfc-2019', () => {
  describe('exports', () => {
    it('it should have proper exports', async () => {
      expect(ecdsa2019Cryptosuite).toBeDefined()
      expect(ecdsa2019Cryptosuite.name).toBe('ecdsa-rdfc-2019')
      expect(ecdsa2019Cryptosuite.requiredAlgorithm).toEqual(['P-256', 'P-384'])
      expect(typeof ecdsa2019Cryptosuite.canonize).toBe('function')
      expect(typeof ecdsa2019Cryptosuite.createVerifier).toBe('function')
    })
  })

  describe('canonize()', () => {
    it('should canonize using RDFC-1.0 w/ n-quads', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential))

      let result
      let error: any
      try {
        result = await ecdsa2019Cryptosuite.canonize(unsignedCredential, {
          documentLoader
        })
      } catch (e) {
        console.log('e', e)
        error = e
      }

      expect(error).toBeUndefined()
      expect(result).toBeDefined()
      const expectedResult = `<http://example.edu/credentials/1872> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://schema.org#AlumniCredential> .
<http://example.edu/credentials/1872> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .
<http://example.edu/credentials/1872> <https://www.w3.org/2018/credentials#credentialSubject> <https://example.edu/students/alice> .
<http://example.edu/credentials/1872> <https://www.w3.org/2018/credentials#issuanceDate> "2010-01-01T19:23:24Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<http://example.edu/credentials/1872> <https://www.w3.org/2018/credentials#issuer> <https://example.edu/issuers/565049> .
<https://example.edu/students/alice> <https://schema.org#alumniOf> "Example University" .\n`
      expect(result).toBe(expectedResult)
    })
  })

  describe('createVerifier()', () => {
    it('should create a verifier with ECDSA Multikey', async () => {
      let verifier: any
      let error: any
      try {
        verifier = await ecdsa2019Cryptosuite.createVerifier({
          verificationMethod: { ...ecdsaMultikeyKeyPair } as any
        })
      } catch (e) {
        error = e
      }

      expect(error).toBeUndefined()
      expect(verifier).toBeDefined()
      expect(verifier.algorithm).toBe('P-256')
      expect(verifier.id).toBe(
        'https://example.edu/issuers/565049#zDnaekGZTb' +
          'QBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9'
      )
      expect(typeof verifier.verify).toBe('function')
    })

    it('should create a verifier with EcdsaSecp256r1VerificationKey2019', async () => {
      let verifier: any
      let error: any
      const keyPair: any = await EcdsaMultikey.from({ ...ecdsaSecp256KeyPair })
      try {
        verifier = await ecdsa2019Cryptosuite.createVerifier({
          verificationMethod: keyPair
        })
      } catch (e) {
        error = e
      }

      expect(error).toBeUndefined()
      expect(verifier).toBeDefined()
      expect(verifier.algorithm).toBe('P-256')
      expect(verifier.id).toBe(
        'https://example.edu/issuers/565049#zDnaekG' +
          'ZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9'
      )
      expect(typeof verifier.verify).toBe('function')
    })

    it('should fail to create a verifier w/ unsupported key type', async () => {
      let verifier: any
      let error: any
      const keyPair: any = await EcdsaMultikey.from({ ...ecdsaSecp256KeyPair })
      keyPair.type = 'BadKeyType'
      try {
        verifier = await ecdsa2019Cryptosuite.createVerifier({
          verificationMethod: keyPair
        })
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
      expect(verifier).toBeUndefined()
      expect(error.message).toBe('Unsupported key type "BadKeyType".')
    })
  })

  describe('sign()', () => {
    it('should sign a document', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential))
      const keyPair: any = await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair })
      const date = '2023-03-01T21:29:24Z'
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(),
        date,
        cryptosuite: ecdsa2019Cryptosuite
      })

      let error: any
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        })
      } catch (e) {
        error = e
      }

      expect(error).toBeUndefined()
    })

    it('should fail to sign with undefined term', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential))
      unsignedCredential.undefinedTerm = 'foo'

      const keyPair: any = await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair })
      const date = '2023-03-01T21:29:24Z'
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(),
        date,
        cryptosuite: ecdsa2019Cryptosuite
      })

      let error: any
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        })
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
      expect(error.name).toBe('jsonld.ValidationError')
    })

    it('should fail to sign with relative type URL', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential))
      unsignedCredential.type.push('UndefinedType')

      const keyPair: any = await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair })
      const date = '2023-03-01T21:29:24Z'
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(),
        date,
        cryptosuite: ecdsa2019Cryptosuite
      })

      let error: any
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        })
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
      expect(error.name).toBe('jsonld.ValidationError')
    })

    it('should fail to sign with incorrect signer algorithm', async () => {
      const keyPair: any = await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair })
      const date = '2023-03-01T21:29:24Z'
      const signer = keyPair.signer()
      signer.algorithm = 'wrong-algorithm'

      let error: any
      try {
        new DataIntegrityProof({
          signer,
          date,
          cryptosuite: ecdsa2019Cryptosuite
        })
      } catch (e) {
        error = e
      }

      const errorMessage =
        `The signer's algorithm "${signer.algorithm}" ` +
        `is not a supported algorithm for the cryptosuite. The supported ` +
        `algorithms are: ` +
        `"${(ecdsa2019Cryptosuite.requiredAlgorithm as string[]).join(', ')}".`

      expect(error).toBeDefined()
      expect(error.message).toBe(errorMessage)
    })
  })

  describe('verify()', () => {
    let signedCredential: any

    beforeAll(async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential))

      const keyPair: any = await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair })
      const date = '2023-03-01T21:29:24Z'
      const suite = new DataIntegrityProof({
        signer: keyPair.signer(),
        date,
        cryptosuite: ecdsa2019Cryptosuite
      })

      signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      })
    })

    it('should verify a document', async () => {
      const suite = new DataIntegrityProof({
        cryptosuite: ecdsa2019Cryptosuite
      })
      const result: any = await jsigs.verify(signedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      })

      expect(result.verified).toBe(true)
    })

    it('should fail verification if "proofValue" is not string', async () => {
      const suite = new DataIntegrityProof({
        cryptosuite: ecdsa2019Cryptosuite
      })
      const signedCredentialCopy = JSON.parse(JSON.stringify(signedCredential))
      // intentionally modify proofValue type to not be string
      signedCredentialCopy.proof.proofValue = {}

      const result: any = await jsigs.verify(signedCredentialCopy, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      })

      const { error } = result.results[0]

      expect(result.verified).toBe(false)
      expect(error.name).toBe('TypeError')
      expect(error.message).toBe(
        'The proof does not include a valid "proofValue" property.'
      )
    })

    it('should fail verification if "proofValue" is not given', async () => {
      const suite = new DataIntegrityProof({
        cryptosuite: ecdsa2019Cryptosuite
      })
      const signedCredentialCopy = JSON.parse(JSON.stringify(signedCredential))
      // intentionally modify proofValue to be undefined
      signedCredentialCopy.proof.proofValue = undefined

      const result: any = await jsigs.verify(signedCredentialCopy, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      })

      const { error } = result.results[0]

      expect(result.verified).toBe(false)
      expect(error.name).toBe('TypeError')
      expect(error.message).toBe(
        'The proof does not include a valid "proofValue" property.'
      )
    })

    it('should fail verification if proofValue string does not start with "z"', async () => {
      const suite = new DataIntegrityProof({
        cryptosuite: ecdsa2019Cryptosuite
      })
      const signedCredentialCopy = JSON.parse(JSON.stringify(signedCredential))
      // intentionally modify proofValue to not start with 'z'
      signedCredentialCopy.proof.proofValue = 'a'

      const result: any = await jsigs.verify(signedCredentialCopy, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      })

      const { errors } = result.error

      expect(result.verified).toBe(false)
      expect(errors[0].name).toBe('Error')
      expect(errors[0].message).toContain('base58btc')
    })

    it('should fail verification if proof type is not DataIntegrityProof', async () => {
      const suite = new DataIntegrityProof({
        cryptosuite: ecdsa2019Cryptosuite
      })
      const signedCredentialCopy = JSON.parse(JSON.stringify(signedCredential))
      // intentionally modify proof type to be InvalidSignature2100
      signedCredentialCopy.proof.type = 'InvalidSignature2100'

      const result: any = await jsigs.verify(signedCredentialCopy, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      })

      const { errors } = result.error

      expect(result.verified).toBe(false)
      expect(errors[0].name).toBe('NotFoundError')
    })
  })
})
