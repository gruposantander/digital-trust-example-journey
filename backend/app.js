const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Claims, AssertionClaims } = require('@santander/rp-client-typescript').Model
const { VerifiedIdClient, InitiateAuthorizeRequestBuilder } = require('@santander/rp-client-typescript').Client

const resolve = require('path').resolve

const port = 8000;

app.use(bodyParser.json());

app.get('/initiate-authorize', async (req, res) => {
    const claims = new Claims()
    claims.email().withEssential(true).withPurpose('email purpose')
    // claims.givenName().withIAL(2)
    // claims.lastYearMoneyIn().withPurpose('Last year money in purpose')

    const assertionClaims = new AssertionClaims()
    assertionClaims.age().gt(21).withPurpose('age purpose')
    // assertionClaims.address()
    //     .withAssertion(Address.postalCode().eq('MK9 1BB'))
    //     .withAssertion(Address.country().eq('UK'))
    //     .withPurpose('Address purpose')

    // assertionClaims.lastYearMoneyIn().withPurpose('Last year money in purpose')
    //     .withAssertion(Balance.amount().gt(200))

    try {
        const verifyidclient = await VerifiedIdClient.createInstance({
            wellKnownURI: 'https://op-iamid-verifiedid-pro.e4ff.pro-eu-west-1.openshiftapps.com/.well-known/openid-configuration',
            privateJWK: resolve('./private.json'),
            clientId: 'mHlL0csGBbaYAj2Baj4Fw'
        })
        await verifyidclient.setUpClient()
        const request = new InitiateAuthorizeRequestBuilder()
            .withRedirectURI('http://localhost:4201/profile')
            .withAssertionClaims(assertionClaims)
            .withClaims(claims)
            .withPurpose('top level purpose')
            .build()
        const initiateAuthorize = await verifyidclient.initiateAuthorize(request)
        console.log(`code verifier: ${initiateAuthorize.codeVerifier}`)
        console.log(`click here: ${initiateAuthorize.redirectionUri}`)

        res.status(200).json(initiateAuthorize.redirectionUri);
    } catch (e) {
        res.status(503).json(e);
        console.trace(e)
    }
});

app.listen(port, () => { console.log('Started on port', port) })
