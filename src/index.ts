/*!
 * Copyright (c) 2023-2024 Digital Bazaar, Inc. All rights reserved.
 */
export { ecdsaRdfc2019 } from './ecdsa-rdfc-2019/index.js'
export {
  createSignCryptosuite,
  createVerifyCryptosuite
} from './ecdsa-jcs-2019/index.js'
export { EcdsaJcs2019 } from './ecdsa-jcs-2019/EcdsaJcs2019.js'
export { createVerifier } from './core/createVerifier.js'

// Backward-compat: prior versions exposed the RDFC suite as `cryptosuite`.
export { ecdsaRdfc2019 as cryptosuite } from './ecdsa-rdfc-2019/index.js'
