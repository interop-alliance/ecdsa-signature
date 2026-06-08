/*!
 * Copyright (c) 2023-2025 Digital Bazaar, Inc. All rights reserved.
 */
import * as didMethodKey from '@digitalbazaar/did-method-key'
import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey'
import {
  citizenshipV4RC1Context,
  controllerDocEcdsaMultikey,
  ecdsaMultikeyKeyPair,
  mockPublicEcdsaMultikey
} from './mock-data.js'
import { CachedResolver } from '@digitalbazaar/did-io'
import dataIntegrityContext from '@digitalbazaar/data-integrity-context'
import multikeyContext from '@digitalbazaar/multikey-context'
import { securityLoader } from '@digitalbazaar/security-document-loader'

export const loader = securityLoader()

const resolver = new CachedResolver()
const didKeyDriver = didMethodKey.driver()
console.log('didKeyDriver', didKeyDriver)
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

loader.addStatic(
  dataIntegrityContext.constants.CONTEXT_URL,
  dataIntegrityContext.contexts.get(dataIntegrityContext.constants.CONTEXT_URL)
)

loader.addStatic(
  multikeyContext.constants.CONTEXT_URL,
  multikeyContext.contexts.get(multikeyContext.constants.CONTEXT_URL)
)

loader.addStatic('https://www.w3.org/ns/credentials/examples/v2', {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/credentials/examples#'
  }
})

loader.addStatic('https://w3id.org/citizenship/v4rc1', citizenshipV4RC1Context)
