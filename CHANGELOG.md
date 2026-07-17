# @interop/ecdsa-signature Changelog

## 2.0.5 - 2026-07

### Changed

- Update to `@interop/data-integrity-core@8.3.0` and related.

## 2.0.4 - 2026-06-13

### Changed

- Update to `@interop/data-integrity-core@8.0.0`, http-client and related.
- Import dynamically `canonicalize` (fixes ESM-only issues).

## 2.0.3 - 2026-06-13

### Changed

- Update to `@interop/data-integrity-core@8.0.0` and related.

## 2.0.2 - 2026-06-09

### Changed

- Update to `@interop/data-integrity-core@7.0.0` and related.

## 2.0.0-2.0.1 - 2026-06-08

### Changed

- **BREAKING**: Renamed the package to `@interop/ecdsa-signature` and merged the
  `@digitalbazaar/ecdsa-jcs-2019-cryptosuite` library in, so one package now
  provides both the `ecdsa-rdfc-2019` and `ecdsa-jcs-2019` cryptosuites.
- **BREAKING**: Switched runtime dependencies to the `@interop/*` forks
  (`@interop/ecdsa-multikey`, `@interop/jsonld`) and adopted
  `@interop/data-integrity-core` / `@interop/data-integrity-proof` types.
- Reorganized `src/` into a thin shared `core/` plus per-suite
  `ecdsa-rdfc-2019/` and `ecdsa-jcs-2019/` directories, each with its own
  subpath export (`@interop/ecdsa-signature/ecdsa-rdfc-2019`,
  `@interop/ecdsa-signature/ecdsa-jcs-2019`).
- **BREAKING**: Require Node.js >= 24.
- Convert the library source to TypeScript; the package now ships a built
  `dist/` (with `.d.ts` type declarations) instead of raw `lib/` sources. The
  public API and return shapes are unchanged.
- Migrate the toolchain to the isomorphic-lib-template infrastructure: pnpm,
  Vite/Vitest (Node tests), Playwright (browser tests), ESLint flat config, and
  Prettier 3.

### Added

- `ecdsa-jcs-2019` cryptosuite via `createSignCryptosuite()` /
  `createVerifyCryptosuite()`.
- `EcdsaJcs2019` -- a `DataIntegrityProof` subclass that bakes in the
  `ecdsa-jcs-2019` sign cryptosuite, for consumers that instantiate a suite by
  class (e.g. `@interop/ezcap`'s `ZcapClient`).
- The RDFC suite is now exported as `ecdsaRdfc2019`. The previous `cryptosuite`
  export is retained as a backward-compatible alias of it.

## 1.3.0 - 2026-02-05

### Changed

- Update dependencies:
  - `jsonld@9`.
  - `jsonld-signatures@11.6.0`.
  - `rdf-canonize@5`.
- **NOTE**: The `jsonld` update may have rare edge case compatibility issues.
  The important related `rdf-canonize` issues were addressed with the update in
  v1.1.0.

## 1.2.0 - 2024-11-25

### Added

- Add support for `@direction`.

## 1.1.1 - 2024-08-26

### Fixed

- Ensure SHA-384 is used when using P-384 keys.

## 1.1.0 - 2024-08-01

### Changed

- Use `rdf-canonize` directly to use `RDFC-1.0` algorithm.

## 1.0.1 - 2023-11-13

### Fixed

- Fix release version.

## 1.0.0 - 2023-11-13

### Added

- Initial version.
