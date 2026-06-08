# @digitalbazaar/ecdsa-rdfc-2019-cryptosuite Changelog

## 1.3.1 - TBD

### Changed

- **BREAKING**: Require Node.js >= 24.
- Convert the library source to TypeScript; the package now ships a built
  `dist/` (with `.d.ts` type declarations) instead of raw `lib/` sources. The
  public API and return shapes are unchanged.
- Migrate the toolchain to the isomorphic-lib-template infrastructure: pnpm,
  Vite/Vitest (Node tests), Playwright (browser tests), ESLint flat config, and
  Prettier 3.

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
