/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import { beforeAll, describe, expect, it } from 'vitest'

import jsigs from '@interop/jsonld-signatures'
const {
  purposes: { AssertionProofPurpose }
} = jsigs as any

import * as EcdsaMultikey from '@interop/ecdsa-multikey'
import {
  createSignCryptosuite,
  createVerifyCryptosuite
} from '../../src/index.js'
import {
  credential,
  ecdsaMultikeyKeyPair,
  ecdsaSecp256KeyPair
} from '../mock-data.js'
import { DataIntegrityProof } from '@interop/data-integrity-proof'

import { loader } from '../documentLoader.js'

const documentLoader = loader.build()

describe('ecdsa-jcs-2019', () => {
  describe('exports', () => {
    it('it should have proper exports', async () => {
      // sign cryptosuite
      let ecdsa2019Cryptosuite = createSignCryptosuite()
      expect(ecdsa2019Cryptosuite).toBeDefined()
      expect(ecdsa2019Cryptosuite.name).toBe('ecdsa-jcs-2019')
      expect(ecdsa2019Cryptosuite.requiredAlgorithm).toEqual(['P-256', 'P-384'])
      expect(typeof ecdsa2019Cryptosuite.canonize).toBe('function')
      expect(typeof ecdsa2019Cryptosuite.createVerifier).toBe('function')
      expect(typeof ecdsa2019Cryptosuite.createVerifyData).toBe('function')
      // verify cryptosuite
      ecdsa2019Cryptosuite = createVerifyCryptosuite() as any
      expect(ecdsa2019Cryptosuite.name).toBe('ecdsa-jcs-2019')
      expect(ecdsa2019Cryptosuite.requiredAlgorithm).toEqual(['P-256', 'P-384'])
      expect(typeof ecdsa2019Cryptosuite.canonize).toBe('function')
      expect(typeof ecdsa2019Cryptosuite.createVerifier).toBe('function')
      expect(typeof ecdsa2019Cryptosuite.createVerifyData).toBe('function')
    })

    it('sign cryptosuite throws if createVerifier is called', () => {
      const cs = createSignCryptosuite()
      expect(() => cs.createVerifier()).toThrow()
    })
  })

  describe('canonize()', () => {
    it('should canonize using JCS', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential))
      const ecdsa2019Cryptosuite = createSignCryptosuite()

      let result
      let error: any
      try {
        result = await ecdsa2019Cryptosuite.canonize(unsignedCredential)
      } catch (e) {
        console.log('e', e)
        error = e
      }

      expect(error).toBeUndefined()
      expect(result).toBeDefined()
      const expectedResult = `{"@context":["https://www.w3.org/2018/credentials/v1",{"AlumniCredential":"https://schema.org#AlumniCredential","alumniOf":"https://schema.org#alumniOf"},"https://w3id.org/security/data-integrity/v2"],"credentialSubject":{"alumniOf":"Example University","id":"https://example.edu/students/alice"},"id":"http://example.edu/credentials/1872","issuanceDate":"2010-01-01T19:23:24Z","issuer":"https://example.edu/issuers/565049","type":["VerifiableCredential","AlumniCredential"]}`
      expect(result).toBe(expectedResult)
    })
  })

  describe('createVerifier()', () => {
    it('should create a verifier with ECDSA Multikey', async () => {
      let verifier: any
      let error: any
      try {
        const ecdsa2019Cryptosuite = createVerifyCryptosuite()
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
        const ecdsa2019Cryptosuite = createVerifyCryptosuite()
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
        const ecdsa2019Cryptosuite = createVerifyCryptosuite()
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
      const ecdsa2019Cryptosuite = createSignCryptosuite()
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

    it('should still sign even with undefined term as JCS does not check terms', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential))
      unsignedCredential.undefinedTerm = 'foo'

      const keyPair: any = await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair })
      const date = '2023-03-01T21:29:24Z'
      const ecdsa2019Cryptosuite = createSignCryptosuite()
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

    it('should still sign even with relative type URL as JCS does not check relative type URL', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential))
      unsignedCredential.type.push('UndefinedType')

      const keyPair: any = await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair })
      const date = '2023-03-01T21:29:24Z'
      const ecdsa2019Cryptosuite = createSignCryptosuite()
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

    it('should fail to sign with incorrect signer algorithm', async () => {
      const keyPair: any = await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair })
      const date = '2023-03-01T21:29:24Z'
      const signer = keyPair.signer()
      signer.algorithm = 'wrong-algorithm'

      const ecdsa2019Cryptosuite = createSignCryptosuite()
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
        `"${ecdsa2019Cryptosuite.requiredAlgorithm.join(', ')}".`

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
      const ecdsa2019Cryptosuite = createSignCryptosuite()
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
      const ecdsa2019Cryptosuite = createVerifyCryptosuite()
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
      const ecdsa2019Cryptosuite = createVerifyCryptosuite()
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
      const ecdsa2019Cryptosuite = createVerifyCryptosuite()
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
      const ecdsa2019Cryptosuite = createVerifyCryptosuite()
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
    })

    it('should fail verification if proof type is not DataIntegrityProof', async () => {
      const ecdsa2019Cryptosuite = createVerifyCryptosuite()
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
