/*!
 * Copyright (c) 2023-2025 Digital Bazaar, Inc. All rights reserved.
 */
import * as didMethodKey from '@interop/did-method-key'
import * as EcdsaMultikey from '@interop/ecdsa-multikey'
import {
  citizenshipV4RC1Context,
  controllerDocEcdsaMultikey,
  ecdsaMultikeyKeyPair,
  mockPublicEcdsaMultikey
} from './mock-data.js'
import { CachedResolver } from '@interop/did-io'
import { securityLoader } from '@interop/security-document-loader'

// `securityLoader()` already bundles the common security contexts (Multikey,
// Data Integrity v2, DID v1, VC v1/v2). Only the contexts it does not bundle
// are added statically below.
export const loader = securityLoader()

const resolver = new CachedResolver()
const didKeyDriver = didMethodKey.driver()
didKeyDriver.use({
  multibaseMultikeyHeader: 'zDna',
  fromMultibase: EcdsaMultikey.from
})
didKeyDriver.use({
  multibaseMultikeyHeader: 'z82L',
  fromMultibase: EcdsaMultikey.from
})
resolver.use(didKeyDriver)
loader.setDidResolver(resolver)

loader.addStatic(ecdsaMultikeyKeyPair.controller, controllerDocEcdsaMultikey)
loader.addStatic(mockPublicEcdsaMultikey.id, mockPublicEcdsaMultikey)

loader.addStatic('https://www.w3.org/ns/credentials/examples/v2', {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/credentials/examples#'
  }
})

loader.addStatic('https://w3id.org/citizenship/v4rc1', citizenshipV4RC1Context)
