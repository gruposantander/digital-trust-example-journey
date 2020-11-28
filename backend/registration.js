require('dotenv').config()
const template = require('./registration-tmpl')
const jwk = require(`./public-jwk.json`)

const app = {
  name: process.env.APP_NAME,
  uris: [
    process.env.REDIRECT_URI
  ],
  kid: process.env.APP_KID,
  jwk
}

console.log(JSON.stringify(template.registrationPayload(app)));
