// const { Claims, AssertionClaims, Address, Balance } = require('@santander/rp-client-typescript').Model
// const { VerifiedIdClient, InitiateAuthorizeRequestBuilder, TokenRequestBuilder } = require('@santander/rp-client-typescript').Client

const Address = require('@santander/rp-client-typescript/lib/model/claims/verifying/address');
const VerifiedIdClient = require('@santander/rp-client-typescript/lib/verifyidclient');
const InitiateAuthorizeRequestBuilder = require('@santander/rp-client-typescript/lib/model/initiate-authorize-requestBuilder');
// const resolve = require('path');
const TokenRequestBuilder = require('@santander/rp-client-typescript/lib/model/token/token-requestBuilder');
const AssertionClaims = require('@santander/rp-client-typescript/lib/model/claims/verifying/assertion-claims');
const Claims = require('@santander/rp-client-typescript/lib/model/claims/sharing/claims');
const resolve = require('path').resolve

const claims = new Claims()
claims.email().withEssential(true).withPurpose('email purpose')
claims.givenName().withIAL(2)
claims.lastYearMoneyIn().withPurpose('Last year money in purpose')

const assertionClaims = new AssertionClaims()
assertionClaims.age().gt(21).withPurpose('age purpose')
assertionClaims.address()
    .withAssertion(Address.postalCode().eq('MK9 1BB'))
    .withAssertion(Address.country().eq('UK'))
    .withPurpose('Address purpose')

assertionClaims.lastYearMoneyIn().withPurpose('Last year money in purpose')
    .withAssertion(Balance.amount().gt(200))


// doInitAuthorize()
// tokenExample()

module.exports = async function initAuth() {
    try {
        const verifyidclient = await VerifiedIdClient.createInstance({
            wellKnownURI: 'https://op-iamid-verifiedid-pro.e4ff.pro-eu-west-1.openshiftapps.com/.well-known/openid-configuration',
            privateJWK: resolve('./secrets/quick-jobs.json'),
            clientId: '7jKl-X6KmF3l-uDFjfsYX'
        })
        await verifyidclient.setUpClient()
        const request = new InitiateAuthorizeRequestBuilder()
            .withRedirectURI('http://localhost:4201/digital-id')
            .withAssertionClaims(assertionClaims)
            .withClaims(claims)
            .withPurpose('top level purpose')
            .build()
        const initiateAuthorize = await verifyidclient.initiateAuthorize(request)
        console.log(`code verifier: ${initiateAuthorize.codeVerifier}`)
        console.log(`click here: ${initiateAuthorize.redirectionUri}`)
    } catch (e) {
        console.error(e)
    }
}

async function tokenExample() {
    try {
        // const verifyidclient = await VerifiedIdClient.createInstance({
        //   wellKnownURI: 'https://op-iamid-verifiedid-pro.e4ff.pro-eu-west-1.openshiftapps.com/.well-known/openid-configuration',
        //   privateJWK: resolve('./secrets/private.json'),
        //   clientId: 'TEST-2754efa75e8c4d11a6d7f95b90cd8e40-TEST'
        // })
        const verifyidclient = await VerifiedIdClient.createInstance({
            wellKnownURI: 'https://op-iamid-verifiedid-pro.e4ff.pro-eu-west-1.openshiftapps.com/.well-known/openid-configuration',
            privateJWK: resolve('./secrets/quick-jobs.json'),
            clientId: '7jKl-X6KmF3l-uDFjfsYX'
        })
        await verifyidclient.setUpClient()
        const request = new TokenRequestBuilder()
            // .withRedirectUri('https://www.sainsburys.co.uk')
            .withRedirectUri('http://localhost:4201/digital-id')
            // .withCodeVerifier('gekBHnGA5NLuX2z-fVNIrdpbPAFfUj0hthCwYPXji7d')
            .withCode('pkd_FwueJuC_Cs1oJ24xsbyN2p338uMtOEaXoDzWwzD')
            .build()
        const token = await verifyidclient.token(request)
        console.log('token', token)
    } catch (e) {
        console.error(e)
    }
}
