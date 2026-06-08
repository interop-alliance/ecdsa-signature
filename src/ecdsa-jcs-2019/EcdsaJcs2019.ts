/*!
 * Copyright (c) 2026 Interop Alliance. All rights reserved.
 */
import { DataIntegrityProof } from '@interop/data-integrity-proof'
import type { ISigner } from '@interop/data-integrity-core'
import { createSignCryptosuite } from './index.js'

/**
 * A ready-to-instantiate signing suite for the `ecdsa-jcs-2019` cryptosuite.
 *
 * The `ecdsa-jcs-2019` cryptosuite itself ships as factory functions
 * (`createSignCryptosuite()` / `createVerifyCryptosuite()`) that are fed into
 * `new DataIntegrityProof({ cryptosuite, signer })`. This thin subclass bakes
 * the sign cryptosuite in, exposing a `new SuiteClass({ signer, date })`
 * constructor contract. That lets consumers which instantiate a suite by class
 * (e.g. `@interop/ezcap`'s `ZcapClient`) select `ecdsa-jcs-2019` by passing
 * this class.
 *
 * Use {@link createVerifyCryptosuite} for the verification side.
 *
 * The signer carries its own `algorithm` ('P-256' | 'P-384', set by
 * `@interop/ecdsa-multikey`), which `DataIntegrityProof` validates against the
 * suite's `requiredAlgorithm`; no wrapping is needed.
 *
 * No static `CONTEXT` / `CONTEXT_URL` are exposed: JCS canonicalization is pure
 * JSON (no JSON-LD expansion), so signing does not require the data-integrity
 * context to be served by a document loader. The base class still sets
 * `this.contextUrl` to the data-integrity context and appends it to the signed
 * document for downstream verifiers.
 */
export class EcdsaJcs2019 extends DataIntegrityProof {
  constructor({
    signer,
    date
  }: {
    signer?: ISigner
    date?: string | Date | number | null
  } = {}) {
    super({
      signer,
      date,
      cryptosuite: createSignCryptosuite()
    })
  }
}
