import { Message, OrderStatus, Rfq, PfiRestClient, DevTools, Offering } from "@tbd54566975/tbdex"
import { sign } from "crypto"


const issuer = await DevTools.createDid()

const putin = await DevTools.createDid()

const pfi = await DevTools.createDid()






// we can require that we see a VC from this trusted issuer
const requiredClaims = {
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



    const offeringData = {
      description  : 'Selling BTC for USD',
      baseCurrency : {
        currencyCode : 'BTC',
        maxSubunits  : '99952611'
      },
      quoteCurrency: {
        currencyCode: 'USD'
      },
      quoteUnitsPerBaseUnit : '26043.40',
      payinMethods          : [{
        kind                   : 'DEBIT_CARD',
        requiredPaymentDetails : {
          $schema    : 'http://json-schema.org/draft-07/schema',
          type       : 'object',
          properties : {
            cardNumber: {
              type        : 'string',
              description : 'The 16-digit debit card number',
              minLength   : 16,
              maxLength   : 16
            },
            expiryDate: {
              type        : 'string',
              description : 'The expiry date of the card in MM/YY format',
              pattern     : '^(0[1-9]|1[0-2])\\/([0-9]{2})$'
            },
            cardHolderName: {
              type        : 'string',
              description : 'Name of the cardholder as it appears on the card'
            },
            cvv: {
              type        : 'string',
              description : 'The 3-digit CVV code',
              minLength   : 3,
              maxLength   : 3
            }
          },
          required             : ['cardNumber', 'expiryDate', 'cardHolderName', 'cvv'],
          additionalProperties : false
        }
      }],
      payoutMethods: [{
        kind                   : 'BTC_ADDRESS',
        requiredPaymentDetails : {
          $schema    : 'http://json-schema.org/draft-07/schema',
          type       : 'object',
          properties : {
            btcAddress: {
              type        : 'string',
              description : 'your Bitcoin wallet address'
            }
          },
          required             : ['btcAddress'],
          additionalProperties : false
        }
      }],
      requiredClaims: requiredClaims
    }

var offering = Offering.create({
    metadata : { from: pfi.did },
    data     : offeringData
})
  

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

  console.log(credential)



  const rfqData = {
    offeringId  : offering.id,
    payinMethod : {
      kind           : 'DEBIT_CARD',
      paymentDetails : {
        'cardNumber'     : '1234567890123456',
        'expiryDate'     : '12/22',
        'cardHolderName' : 'Ephraim Bartholomew Winthrop',
        'cvv'            : '123'
      }
    },
    payoutMethod: {
      kind           : 'BTC_ADDRESS',
      paymentDetails : {
        btcAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      }
    },
    quoteAmountSubunits : '20000',
    claims                 : [signedCredential]
  }

  var rfq= Rfq.create({
    metadata : { from: putin.did, to: pfi.did },
    data     : rfqData
  })



  rfq.verifyClaims(offering);
  console.log("claims are satisfied");

