/*!
 * Copyright (c) 2023-2024 Digital Bazaar, Inc. All rights reserved.
 */
/* Note: This file contains data generated from the vc-di-ecdsa specification
test vectors. */

export const curveFixtures: any[] = [
  {
    curve: 'P-256',
    keyMaterial: {
      publicKeyMultibase: 'zDnaepBuvsQ8cpsWrVKw8fbpGpvPeNSjVPTWoq6cRqaYzBKVP',
      secretKeyMultibase: 'z42twTcNeSYcnqg1FLuSFs2bsGH3ZqbRHFmvS9XMsYhjxvHN'
    },
    signedFixture: {
      '@context': [
        'https://www.w3.org/ns/credentials/v2',
        'https://www.w3.org/ns/credentials/examples/v2'
      ],
      id: 'urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33',
      type: ['VerifiableCredential', 'AlumniCredential'],
      name: 'Alumni Credential',
      description: 'A minimum viable example of an Alumni Credential.',
      issuer: 'https://vc.example/issuers/5678',
      validFrom: '2023-01-01T00:00:00Z',
      credentialSubject: {
        id: 'did:example:abcdefgh',
        alumniOf: 'The School of Examples'
      },
      proof: {
        type: 'DataIntegrityProof',
        cryptosuite: 'ecdsa-rdfc-2019',
        created: '2023-02-24T23:36:38Z',
        verificationMethod:
          'did:key:zDnaepBuvsQ8cpsWrVKw8fbpGpvPeNSjVPTWoq6cRqaYzBKVP#zDnaepBuvsQ8cpsWrVKw8fbpGpvPeNSjVPTWoq6cRqaYzBKVP',
        proofPurpose: 'assertionMethod',
        proofValue:
          'zaHXrr7AQdydBk3ahpCDpWbxfLokDqmCToYm2dyWvpcFVyWooC2he63w1f7UNQoAMKdhaRtcnaE2KTo5o5vTCcfw'
      }
    }
  },
  {
    curve: 'P-384',
    keyMaterial: {
      publicKeyMultibase:
        'z82LkuBieyGShVBhvtE2zoiD6Kma4tJGFtkAhxR5pfkp5QPw4LutoYWhvQCnGjdVn14kujQ',
      secretKeyMultibase:
        'z2fanyY7zgwNpZGxX5fXXibvScNaUWNprHU9dKx7qpVj7mws9J8LLt4mDB5TyH2GLHWkUc'
    },
    signedFixture: {
      '@context': [
        'https://www.w3.org/ns/credentials/v2',
        'https://www.w3.org/ns/credentials/examples/v2'
      ],
      id: 'urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33',
      type: ['VerifiableCredential', 'AlumniCredential'],
      name: 'Alumni Credential',
      description: 'A minimum viable example of an Alumni Credential.',
      issuer: 'https://vc.example/issuers/5678',
      validFrom: '2023-01-01T00:00:00Z',
      credentialSubject: {
        id: 'did:example:abcdefgh',
        alumniOf: 'The School of Examples'
      },
      proof: {
        type: 'DataIntegrityProof',
        cryptosuite: 'ecdsa-rdfc-2019',
        created: '2023-02-24T23:36:38Z',
        verificationMethod:
          'did:key:z82LkuBieyGShVBhvtE2zoiD6Kma4tJGFtkAhxR5pfkp5QPw4LutoYWhvQCnGjdVn14kujQ#z82LkuBieyGShVBhvtE2zoiD6Kma4tJGFtkAhxR5pfkp5QPw4LutoYWhvQCnGjdVn14kujQ',
        proofPurpose: 'assertionMethod',
        proofValue:
          'z967Mvv5bxtmLNqTzPZ8KmJjFmFXaAKeQNzq7GWnQkMcLtaGSSmuozE5WtJ8PipMe178B1tE28K1vsJur9bGVJhz6jgSJsRHFSQeqgH8hhjcg8gZDFJC1b9FsR5ggNmDBqHv'
      }
    }
  },
  {
    curve: 'P-384',
    keyMaterial: {
      publicKeyMultibase:
        'z82LkuBieyGShVBhvtE2zoiD6Kma4tJGFtkAhxR5pfkp5QPw4LutoYWhvQCnGjdVn14kujQ',
      secretKeyMultibase:
        'z2fanyY7zgwNpZGxX5fXXibvScNaUWNprHU9dKx7qpVj7mws9J8LLt4mDB5TyH2GLHWkUc'
    },
    signedFixture: {
      '@context': [
        'https://www.w3.org/ns/credentials/v2',
        'https://w3id.org/citizenship/v4rc1'
      ],
      type: [
        'VerifiableCredential',
        'EmploymentAuthorizationDocumentCredential'
      ],
      issuer: {
        id: 'did:key:zDnaegE6RR3atJtHKwTRTWHsJ3kNHqFwv7n9YjTgmU7TyfU76',
        image:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgUPr/HwADaAIhG61j/AAAAABJRU5ErkJggg=='
      },
      credentialSubject: {
        type: ['Person', 'EmployablePerson'],
        givenName: 'JOHN',
        additionalName: 'JACOB',
        familyName: 'SMITH',
        image:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2Ng+M/wHwAEAQH/7yMK/gAAAABJRU5ErkJggg==',
        gender: 'Male',
        residentSince: '2015-01-01',
        birthCountry: 'Bahamas',
        birthDate: '1999-07-17',
        employmentAuthorizationDocument: {
          type: 'EmploymentAuthorizationDocument',
          identifier: '83627465',
          lprCategory: 'C09',
          lprNumber: '999-999-999'
        }
      },
      name: 'Employment Authorization Document',
      description: 'Example Employment Authorization Document.',
      validFrom: '2019-12-03T00:00:00Z',
      validUntil: '2029-12-03T00:00:00Z',
      proof: {
        type: 'DataIntegrityProof',
        cryptosuite: 'ecdsa-rdfc-2019',
        created: '2023-02-24T23:36:38Z',
        verificationMethod:
          'did:key:z82LkuBieyGShVBhvtE2zoiD6Kma4tJGFtkAhxR5pfkp5QPw4LutoYWhvQCnGjdVn14kujQ#z82LkuBieyGShVBhvtE2zoiD6Kma4tJGFtkAhxR5pfkp5QPw4LutoYWhvQCnGjdVn14kujQ',
        proofPurpose: 'assertionMethod',
        proofValue:
          'zz3ca1oME3iYPHM8SgApWFUFVQjiaL9moPqCZ1NAENj3biEQ34qc1ex5VJNLD4jh4N4MY2cmDyDCYGv7EyD87yCGYwag8wRwiJE1xiHKLhTEhDQFNfuNMsgLiZnqpkCDJPye'
      }
    }
  }
]
