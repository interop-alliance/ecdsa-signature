# @interop/ecdsa-signature

[![Node.js CI](https://github.com/interop-alliance/ecdsa-signature/workflows/CI/badge.svg)](https://github.com/interop-alliance/ecdsa-signature/actions?query=workflow%3A%22CI%22)
[![NPM Version](https://img.shields.io/npm/v/@interop/ecdsa-signature.svg)](https://npm.im/@interop/ecdsa-signature)

> ECDSA Data Integrity cryptosuites for use with
> [`jsonld-signatures`](https://github.com/digitalbazaar/jsonld-signatures), in
> TypeScript.

One package providing both ECDSA Verifiable Credential proof flavors, unified on
the `DataIntegrityProof` container model:

| Suite             | `proof.type`         | `proof.cryptosuite` | Canonicalization |
| ----------------- | -------------------- | ------------------- | ---------------- |
| `ecdsa-rdfc-2019` | `DataIntegrityProof` | `ecdsa-rdfc-2019`   | RDFC-1.0         |
| `ecdsa-jcs-2019`  | `DataIntegrityProof` | `ecdsa-jcs-2019`    | JCS (RFC 8785)   |

Both suites support the P-256 and P-384 curves; the message digest (SHA-256 for
P-256, SHA-384 for P-384) is selected from the signing/verification key.

This package merges and renames `@digitalbazaar/ecdsa-rdfc-2019-cryptosuite` and
`@digitalbazaar/ecdsa-jcs-2019-cryptosuite` into one library, switched onto the
`@interop/*` forks and types.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Subpath imports](#subpath-imports)
- [Usage](#usage)
  - [`ecdsa-rdfc-2019`](#ecdsa-rdfc-2019)
  - [`ecdsa-jcs-2019`](#ecdsa-jcs-2019)
  - [Verifying a mixed proof set](#verifying-a-mixed-proof-set)
- [API asymmetry across suites](#api-asymmetry-across-suites)
- [Contribute](#contribute)
- [License](#license)

## Background

Lets a downstream consumer issue and verify both ECDSA Data Integrity proof
types -- as they appear, possibly mixed, in VC `proof` arrays -- through one
package, one container concept (`DataIntegrityProof`), and one key library
([`@interop/ecdsa-multikey`](https://github.com/interop-alliance/ecdsa-multikey)).

The difference between the suites is canonicalization: `ecdsa-rdfc-2019` uses
RDF Dataset Canonicalization (RDFC-1.0) over the JSON-LD-expanded document,
while `ecdsa-jcs-2019` uses the JSON Canonicalization Scheme (JCS, RFC 8785)
directly over the JSON. JCS therefore does not require a `documentLoader` for
canonicalization and does not reject undefined terms or relative type URLs.

Related spec:
[Verifiable Credential Data Integrity / ECDSA Cryptosuites](https://w3c.github.io/vc-di-ecdsa/).

## Install

Node.js 24+ and modern browsers are supported. This package is ESM-only.

```
npm install @interop/ecdsa-signature
```

`@interop/jsonld-signatures` is an optional peer dependency -- install it
alongside if you use the `jsigs.sign` / `jsigs.verify` entry points shown below.

## Subpath imports

Each suite has its own subpath export, so a JCS-only consumer is not forced to
pull in the `@interop/jsonld` / `rdf-canonize` machinery that only the RDFC
suite needs (the package is `sideEffects: false` for tree-shaking). Prefer the
leaf-scoped import for the suite you actually use:

```js
import { ecdsaRdfc2019 } from '@interop/ecdsa-signature/ecdsa-rdfc-2019'
import {
  createSignCryptosuite,
  createVerifyCryptosuite
} from '@interop/ecdsa-signature/ecdsa-jcs-2019'
```

The root entry re-exports everything for convenience (and keeps a `cryptosuite`
alias of `ecdsaRdfc2019` for backward compatibility with the former
`@digitalbazaar/ecdsa-rdfc-2019-cryptosuite` package):

```js
import {
  ecdsaRdfc2019,
  createSignCryptosuite,
  createVerifyCryptosuite,
  cryptosuite // === ecdsaRdfc2019
} from '@interop/ecdsa-signature'
```

## Usage

### `ecdsa-rdfc-2019`

`ecdsaRdfc2019` is a single static cryptosuite object used for both signing and
verification:

```js
import * as EcdsaMultikey from '@interop/ecdsa-multikey'
import { DataIntegrityProof } from '@interop/data-integrity-proof'
import { ecdsaRdfc2019 } from '@interop/ecdsa-signature/ecdsa-rdfc-2019'
import jsigs from '@interop/jsonld-signatures'
const {
  purposes: { AssertionProofPurpose }
} = jsigs

const keyPair = await EcdsaMultikey.from({
  '@context': 'https://w3id.org/security/multikey/v1',
  type: 'Multikey',
  controller: 'https://example.edu/issuers/565049',
  id: 'https://example.edu/issuers/565049#zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9',
  publicKeyMultibase: 'zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9',
  secretKeyMultibase: 'z42tqZ5smVag3DtDhjY9YfVwTMyVHW6SCHJi2ZMrD23DGYS3'
})

// sign
const signed = await jsigs.sign(unsignedCredential, {
  suite: new DataIntegrityProof({
    signer: keyPair.signer(),
    cryptosuite: ecdsaRdfc2019
  }),
  purpose: new AssertionProofPurpose(),
  documentLoader
})

// verify
const result = await jsigs.verify(signed, {
  suite: new DataIntegrityProof({ cryptosuite: ecdsaRdfc2019 }),
  purpose: new AssertionProofPurpose(),
  documentLoader
})
```

### `ecdsa-jcs-2019`

The JCS suite is exposed as two factory functions -- `createSignCryptosuite()`
and `createVerifyCryptosuite()` -- because the sign and verify paths reconcile
proof/document `@context` differently (a security-sensitive ordering check on
verify). Calling `createVerifier()` on the sign cryptosuite throws.

```js
import { DataIntegrityProof } from '@interop/data-integrity-proof'
import {
  createSignCryptosuite,
  createVerifyCryptosuite
} from '@interop/ecdsa-signature/ecdsa-jcs-2019'

// sign
const signed = await jsigs.sign(unsignedCredential, {
  suite: new DataIntegrityProof({
    signer: keyPair.signer(),
    cryptosuite: createSignCryptosuite()
  }),
  purpose: new AssertionProofPurpose(),
  documentLoader
})

// verify
const result = await jsigs.verify(signed, {
  suite: new DataIntegrityProof({ cryptosuite: createVerifyCryptosuite() }),
  purpose: new AssertionProofPurpose(),
  documentLoader
})
```

#### `EcdsaJcs2019` suite class

For consumers that instantiate a suite **by class** rather than by passing a
cryptosuite -- e.g.
[`@interop/ezcap`](https://github.com/interop-alliance/ezcap)'s `ZcapClient` --
`EcdsaJcs2019` is a thin `DataIntegrityProof` subclass that bakes in the sign
cryptosuite, exposing a `new EcdsaJcs2019({ signer, date })` constructor. Use
`createVerifyCryptosuite()` for the verification side.

```js
import { EcdsaJcs2019 } from '@interop/ecdsa-signature'

const signed = await jsigs.sign(unsignedCredential, {
  suite: new EcdsaJcs2019({ signer: keyPair.signer() }),
  purpose: new AssertionProofPurpose(),
  documentLoader
})
```

### Verifying a mixed proof set

A single credential can carry both an `ecdsa-rdfc-2019` and an `ecdsa-jcs-2019`
proof. Pass an array of suites to `jsigs.verify`; each proof is matched to its
suite by `proof.cryptosuite`:

```js
const result = await jsigs.verify(signed, {
  suite: [
    new DataIntegrityProof({ cryptosuite: ecdsaRdfc2019 }),
    new DataIntegrityProof({ cryptosuite: createVerifyCryptosuite() })
  ],
  purpose: new AssertionProofPurpose(),
  documentLoader
})
```

## API asymmetry across suites

The two suites expose intentionally different shapes, because the specs do:

- `ecdsa-rdfc-2019` is a single static object (`ecdsaRdfc2019`) used for both
  signing and verifying.
- `ecdsa-jcs-2019` is a pair of factories (`createSignCryptosuite()` /
  `createVerifyCryptosuite()`), because its sign and verify paths reconcile
  proof/document `@context` differently.

Both are consumed the same way: `new DataIntegrityProof({ cryptosuite })`.

For the JCS suite there is additionally an `EcdsaJcs2019` class -- a
`DataIntegrityProof` subclass with the sign cryptosuite baked in -- for callers
that select a suite by class rather than by cryptosuite (e.g. `@interop/ezcap`'s
`ZcapClient`). It is sign-side only; verification still uses
`new DataIntegrityProof({ cryptosuite: createVerifyCryptosuite() })`. The RDFC
suite needs no such class: its single static object already works wherever a
cryptosuite is expected.

## Contribute

PRs accepted.

See [CONTRIBUTING.md](CONTRIBUTING.md) -- code style and contribution
conventions.

## License

[New BSD License (3-clause)](LICENSE) © 2023 Digital Bazaar
