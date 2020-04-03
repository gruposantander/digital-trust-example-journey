const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Claims, AssertionClaims, Address } = require('@gruposantander/rp-client-typescript').Model
const { VerifiedIdClient, InitiateAuthorizeRequestBuilder, TokenRequestBuilder } = require('@gruposantander/rp-client-typescript').Client

const resolve = require('path').resolve

const port = 8000;
const wellKnown = 'https://op-iamid-verifiedid-pro.e4ff.pro-eu-west-1.openshiftapps.com/.well-known/openid-configuration';
const clientId = 'IIvRB-z9e0mTVDfrXpAsy';

let verified = false;

let userDetails = {
    title: "Mrs",
    given_name: "Laura",
    family_name: "Lavine",
    country_of_birth: "GB",
    address: {
        street_address: '91, Savannah Falls',
        locality: 'Rotherham',
        postal_code: 'CE0YYW',
        country: 'United Kingdom',
    }
}

app.use(bodyParser.json());

app.get('/initiate-authorize', async (req, res) => {
    const claims = new Claims()
    claims.email()
        .withEssential(true)
        .withPurpose('Please share the email address that you wish for us and any recruitment teams to contact you on.')
    claims.phoneNumber()
        .withEssential(true)
        .withPurpose('Please share the phone number that you wish for us and any recruitment teams to contact you on.')
    claims.address()
        .withEssential(true)

    const assertionClaims = new AssertionClaims()
    assertionClaims.givenName()
        .equal(userDetails.given_name)
        .withEssential(true)
        .withPurpose('We want to verify that we have your correct first name, so that we can address any correspondence with you, and between yourself and any future employers correctly.')
    assertionClaims.familyName()
        .equal(userDetails.family_name)
        .withEssential(true)
        .withPurpose('We want to verify that we have your correct surname, so that we can address any correspondence with you, and between yourself and any future employers correctly.')
    assertionClaims.title()
        .equal(userDetails.title)
        .withPurpose('We want to verify your title is correct, so that we can address any correspondence with you, and between yourself and any future employers correctly in a professional manner.')
    assertionClaims.address()
        .withAssertion(Address.streetAddress().eq(userDetails.address.street_address))
        .withAssertion(Address.locality().eq(userDetails.address.locality))
        .withAssertion(Address.postalCode().eq(userDetails.address.postal_code))
        .withAssertion(Address.country().eq(userDetails.address.country))
        .withPurpose('We want to verify your address is correct, so that we can address any correspondence with you, and between yourself and any future employers correctly in a professional manner. We also need to ensure that you have a place of residence within the UK.')

    try {
        const verifyidclient = await VerifiedIdClient.createInstance({
            wellKnownURI: wellKnown,
            privateJWK: resolve('./private.json'),
            clientId: clientId,
        })
        await verifyidclient.setUpClient();

        const request = new InitiateAuthorizeRequestBuilder()
            .withRedirectURI('http://localhost:4201/profile')
            .withAssertionClaims(assertionClaims)
            .withClaims(claims)
            .withPurpose('We want to check your details are correct before allowing you to formally accept any job offers.')
            .build()

        const initiateAuthorize = await verifyidclient.initiateAuthorize(request)

        res.status(200).json(initiateAuthorize.redirectionUri);
    } catch (e) {
        // console.log(e);
        res.status(503).json(e);
    }
});

app.post('/token', async (req, res) => {
    if (!req.body.code) {
        res.status(400).json({ error: 'No code has been sent' });
    }

    try {
        const verifyidclient = await VerifiedIdClient.createInstance({
            wellKnownURI: wellKnown,
            privateJWK: resolve('./private.json'),
            clientId: clientId
        });
        await verifyidclient.setUpClient();
        const request = new TokenRequestBuilder()
            .withRedirectUri('http://localhost:4201/profile')
            .withCode(req.body.code)
            .build();
        const token = await verifyidclient.token(request);

        await addSharedData(token);

        if (checkAssertions(token.assertion_claims)) {
            verified = true;
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    } catch (e) {
        res.status(400).json(e);
    }
});

app.get('/user-info', async (req, res) => {
    res.status(200).json(userDetails);
});

app.get('/verified', async (req, res) => {
    if (verified) {
        res.status(200).send();
    } else {
        res.status(400).send();
    }
});

async function addSharedData(tokenObject) {
    if (tokenObject.email) userDetails.email = tokenObject.email;
    if (tokenObject.phone_number) userDetails.phone_number = tokenObject.phone_number;
}

async function checkAssertions(assertionClaims) {
    let success = true;

    Object.values(assertionClaims).forEach(element => {
        if (!element.result) {
            success = false;
        }
    });

    return success;
}

app.listen(port, () => { console.log('Started on port', port) });
