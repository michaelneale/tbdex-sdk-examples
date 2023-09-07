import { DevTools } from '@tbd54566975/tbdex'

const issuer = await DevTools.createDid()

const putin = await DevTools.createDid()

const { credential, signedCredential } = await DevTools.createCredential({
  issuer  : issuer,
  subject : putin.did,
  type    : 'SanctionsCredential',
  data    : {
    subject: {
      fullName : 'Vladimir Vladimirovich Putin',
      country  : 'US'
    },
    screening: {
      vendor     : 'Castellum',
      watchLists : [
        'UN Sanctions',
        'US Fincen 311 Actions',
        'US OFAC Non-SDN',
        'US OFAC SDN',
        'US OFAC SSI',
        'US State Department Cuba Restricted List',
        'US State Department Terrorist Exclusion'
      ],
      cadence             : 'Daily',
      fuzzyLogicParameter : '85%',
      screeningResult     : 'UNSANCTIONED'
    }
  }
})

console.log('CRED', JSON.stringify(credential, null, 2))
console.log('SIGNED CREDENTIAL', JSON.stringify(signedCredential))


// we can require that we see a VC from this trusted issuer
const vcRequirements = {
    id                : '7ce4004c-3c38-4853-968b-e411bafcd945',
    input_descriptors : [{
      id          : 'bbdb9b7c-5754-4f46-b63b-590bada959e0',
      constraints : {
        fields: [{
          path   : ['$.type'],
          filter : {
            type  : 'string',
            const : 'SanctionsCredential'
          }
        }, {
          path   : ['$.issuer'],
          filter : {
            type  : 'string',
            const : issuer.did
          }
        }]
      }
    }]
  }

  console.log(vcRequirements)