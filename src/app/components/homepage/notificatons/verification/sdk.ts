// import { Address } from '@santander/rp-client-typescript/lib/model/claims/verifying/address';
// import { TotalBalance } from '@santander/rp-client-typescript/lib/model/claims/verifying/total-balance';
// import { VerifiedIdClient } from '@santander/rp-client-typescript/lib/verifyidclient';
// import { InitiateAuthorizeRequestBuilder } from '@santander/rp-client-typescript/lib/model/initiate-authorize-requestBuilder';
// import { TokenRequestBuilder } from '@santander/rp-client-typescript/lib/model/token/token-requestBuilder';
// import { AssertionClaims } from '@santander/rp-client-typescript/lib/model/claims/verifying/assertion-claims';
// import { Claims } from '@santander/rp-client-typescript/lib/model/claims/sharing/claims';
import { Model, Client } from '@santander/rp-client-typescript';
import { resolve } from 'path';

export async function getRequestUri() {
    // export async function getRequestUri(): Promise<string> {
    const verifyidclient = await createInstance();
    await verifyidclient.setUpClient();

    const request = new Client.InitiateAuthorizeRequestBuilder()
        .withRedirectURI('https://www.sainsburys.co.uk')
        .withAssertionClaims(ageAddressBalanceAssertionClaims())
        .withClaims(bothNamesAgePhoneClaims())
        .withPurpose('top level purpose')
        .build();

    // try {
    //     const initiateAuthorize = await verifyidclient.initiateAuthorize(request);
    //     const uri = initiateAuthorize.redirectionUri;

    //     return uri.slice(uri.indexOf('request_uri='));
    // } catch (e) {
    //     console.error(e.response.data.error);
    //     console.error(e.response.data.error_description);
    // }
}

// export async function getTokenResponse(code: string): Promise<any> {
//     const verifyidclient = await createInstance();
//     await verifyidclient.setUpClient();

//     const request = new TokenRequestBuilder()
//         .withRedirectUri('https://www.sainsburys.co.uk')
//         .withCode(code)
//         .build();

//     try {
//         const token = await verifyidclient.token(request);
//         return token;
//     } catch (e) {
//         console.error(e);
//     }
// }

async function createInstance() {
    return await Client.VerifiedIdClient.createInstance({
        wellKnownURI: 'https://op-iamid-verifiedid-pro.e4ff.pro-eu-west-1.openshiftapps.com/.well-known/openid-configuration',
        privateJWK: resolve('./private.json'),
        clientId: 'TEST-2754efa75e8c4d11a6d7f95b90cd8e40-TEST'
    });
}

function ageAddressBalanceAssertionClaims() {
    const assertionClaims = new Model.AssertionClaims();

    assertionClaims.age().gt(130).withPurpose('This is a purpose for age'); // Mismatch
    assertionClaims.address().withAssertion(Model.Address.postalCode().eq('CE0YYW')).withPurpose('This is a purpose for postcode'); // Match
    assertionClaims.totalBalance().withAssertion(Model.TotalBalance.currency().eq('GBP')).withEssential(true); // Match
    assertionClaims.totalBalance().withAssertion(Model.TotalBalance.amount().gte(1)).withEssential(true); // Match
    return assertionClaims;
}

function bothNamesAgePhoneClaims() {
    const sharingClaims = new Model.Claims();

    sharingClaims.givenName().withEssential(true);
    sharingClaims.familyName().withEssential(true).withPurpose('We want your family name please.');
    sharingClaims.age().withEssential(true);
    sharingClaims.phoneNumber().withEssential(true);
    sharingClaims.email().withEssential(true);
    return sharingClaims;
}
