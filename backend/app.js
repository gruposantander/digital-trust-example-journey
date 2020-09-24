const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Claims, AssertionClaims, Address, Balance} = require('@gruposantander/rp-client-typescript').Model
const { VerifiedIdClient, InitiateAuthorizeRequestBuilder, TokenRequestBuilder } = require('@gruposantander/rp-client-typescript').Client
const Joi = require('@hapi/joi');
const resolve = require('path').resolve;
const schedule = require('node-schedule');

const port = process.env.PORT || 8000;
const wellKnown = process.env.WELL_KNOWN_URL || 'https://live.iamid.io/.well-known/openid-configuration';
const clientId = process.env.CLIENT_ID || 'Ds2UChhNmck7Jcakyxvgi';
const redirectUri = process.env.REDIRECT_URI ||  'http://localhost:4201/profile';
const staticsFolderRelativePath = process.env.STATICS_FOLDER || '/../dist/digital-id-example-frontend';
const cronSchedule = process.env.CRON_RESET_SCHEDULE || '*/10 * * * *';

let verified = false;
let resetScheduler = schedule.scheduleJob(cronSchedule, function(){
    verified = false;
    userDetails = defaultUserDetails;
  });

let defaultUserDetails = {
    "title": "Mrs",
    "given_name": "Yost",
    "family_name": "Hilton",
    "country_of_birth": "GB",
    "address": {
        "street_address": "19 Kacey Forest",
        "locality": "Redding",
        "postal_code": "QZBAD9",
        "country": "United Kingdom"
    }
}
let userDetails = 
    {
        "title": "Mrs",
        "given_name": "Yost",
        "family_name": "Hilton",
        "country_of_birth": "GB",
        "address": {
            "street_address": "19 Kacey Forest",
            "locality": "Redding",
            "postal_code": "QZBAD9",
            "country": "United Kingdom"
        }
    }


app.use( express.static( __dirname + staticsFolderRelativePath))
app.use('/profile', express.static( __dirname + staticsFolderRelativePath))

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.get('/initiate-authorize', async (req, res) => {
    const claims = new Claims();
    claims.email()
        .withEssential(true)
        .withPurpose('Please share the email address that you wish for us and any recruitment teams to contact you on.')
    claims.phoneNumber()
        .withEssential(true)
        .withPurpose('Please share the phone number that you wish for us and any recruitment teams to contact you on.')

    const assertionClaims = new AssertionClaims();
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
    // assertionClaims.lastYearMoneyIn()
    //     .withAssertion(Balance.currency().eq("GBP"))
    //     .withAssertion(Balance.amount().gt(30000.00))
    //     .withIAL(3)
    let verifyidclient;
    try {
        verifyidclient = await VerifiedIdClient.createInstance({
            wellKnownURI: wellKnown,
            privateJWK: resolve('./private.json'),
            clientId: clientId,
        });
        await verifyidclient.setUpClient();
    } catch (e) {
        res.status(500).json({ error: e, error_description: 'Unable to create client instance - unset proxies' });
        return;
    }

    try {
        const request = new InitiateAuthorizeRequestBuilder()
            .withRedirectURI(redirectUri)
            .withAssertionClaims(assertionClaims)
            .withClaims(claims)
            .withPurpose('We want to check your details are correct before allowing you to formally accept any job offers.')
            .build()

        const initiateAuthorize = await verifyidclient.initiateAuthorize(request)
        res.status(200).json(initiateAuthorize.redirectionUri);
    } catch (err) {
        console.log(err);
        res.status(503).json({});
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
            .withRedirectUri(redirectUri)
            .withCode(req.body.code)
            .build();
        const token = await verifyidclient.token(request);

        addSharedData(token);

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

app.post('/user-info', async (req, res) => {
    try {
        const { error } = userValidation(req.body);
        if (error) res.status(400).json({ message: error.message });

        userDetails = req.body;
        verified = false;
        res.status(200).json(userDetails);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.get('/verified', async (req, res) => {
    if (verified) {
        res.status(200).send();
    } else {
        res.status(400).send();
    }
});

app.post('/verified', async (req, res) => {
    try {
        verified = req.query.value === 'true';
        res.status(200).send(verified);
    } catch (err) {
        res.status(400).json({ error: 'Not valid value for verified', message: 'Provide a query param with a boolean eg. ?value=true' })
    }
});

app.patch('/reset', async (req, res) => {
    userDetails = defaultUserDetails;
    verified = false;
    res.status(200).send('Successfully reset');
});

function addSharedData(tokenObject) {
    if (tokenObject.email) userDetails.email = tokenObject.email;
    if (tokenObject.phone_number) userDetails.phone_number = tokenObject.phone_number;
}

function checkAssertions(returnedAssertionClaims) {
    const essentialFields = ['family_name', 'given_name'];
    let claims = [];
    let success = true;

    Object.keys(returnedAssertionClaims).forEach(name => claims.push(name));

    essentialFields.forEach(field => {
        if (!claims.includes(field)) { success = false; }
    });

    if (success) {
        Object.entries(returnedAssertionClaims).forEach(element => {
            if (!element[1].result && essentialFields.includes(element[0])) {
                success = false;
            }
        });
    }

    return success;
}

const userValidation = data => {
    const schema = Joi.object({
        given_name: Joi.string()
            .required(),
        family_name: Joi.string()
            .required(),
        country_of_birth: Joi.string()
            .required(),
        title: Joi.string()
            .required(),
        address: Joi.object({
            street_address: Joi.string()
                .required(),
            locality: Joi.string()
                .required(),
            postal_code: Joi.string()
                .required(),
            country: Joi.string()
                .required(),
        }).required(),
    })

    return schema.validate(data);
}

app.listen(port, () => { console.log('Started on port', port) });


