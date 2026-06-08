/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import { expect, test } from '@playwright/test'

// Smoke test: prove the browser bundle loads and the browser-specific SHA path
// (the `sha-browser` module backed by Web Crypto, selected via the package
// `browser` field) works in a real browser.
test('hashes a string via Web Crypto in-browser', async ({ page }) => {
  await page.goto('/test/index.html')

  const hex = await page.evaluate(async () => {
    const { sha } = await import('/src/sha-browser.ts')
    const digest = await sha({ algorithm: 'SHA-256', string: 'abc' })
    return Array.from(digest)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  })

  // Known SHA-256 digest of the string "abc".
  expect(hex).toBe(
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
  )
})
