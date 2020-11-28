# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.25.

You can use this repo as an example for implementing an end to end application interacting with the Digital Trust Protocol server. It uses the [DTP Typescript SDK](https://github.com/gruposantander/digital-trust-typescript-sdk) and is connected the DTP Sandbox.

To learn more about DTP, register your test client application and try/learn the calls and endpoints the SDK will be interacting with, please refer to the additional documentation that can be found [here](https://gruposantander.github.io/digital-trust-docs/).

This repo consists in both front-end and backend (the one interacting with DTP using the SDK). You can run both in isolation or use the Dockerfile to expose both as a single application.

### Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4201/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Backend

### Setup environment variables

Since the backend relies in some environment variables, you need to create a new `.env` file. Use `cp .env.example .env` inside the `backend` folder to add your own configuration variables.

### Setup npm token

Since we host some [dependencies](https://github.com/gruposantander/digital-trust-example-journey/blob/ab48fa797d5a5c7e34714cfcee473e28c3d65661/backend/package.json#L14) in GitHub, you need to create a [personal access token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) with the `read:packages` scope selected. Upon creation, change the value `NPM_CONFIG_TOKEN` in `backend/.env` for your own token.

### Running backend

`cd backend/` to get into the backend folder. Run `npm run start:watch` to get nodemon to start running on port 8000. Running with nodemon means any changes saved, update and rerun the local server. If you face issues making requests - unset proxies in terminal, make sure you're out of the VPN and check computer clock is correct (JWT needs correct time).

### Registering your own application

In case you want to use this project to register your own application, make sure to follow the [generation keys steps from our documentation.](https://gruposantander.github.io/digital-trust-docs/docs/quick_development_guide#annex-5-generate-your-publicprivate-keys). Afterwards, you can populate `.env` with your `APP_*` values and run our tasks `register:create` and `register:submit` to submit your application to our OpenId Provider (OP).

Modify the file `registration-tmpl.js` if you also want to change your logo, policy or terms and conditions links.

Your credentials will be written in `backend/registration-reponse.json`. Make sure to update your `CLIENT_ID` inside your `.env` from that file before restarting the application.

### Interacting with the backend

Use these credentials for the Santander login to use the dummy account associated with this profile: 
```
{
	"user": "hilton",
	"pass": "123"
}
```

####  GET /user-info
Retrieve the information stored about the default user. 

####  POST /user-info
Set the information stored about the default user inside the quickjobs system. This is the data that is used for the assertions that are made in the consent flow. Request body: 
```
{
    given_name: string,
    family_name: string,
    country_of_birth: string,
    title: string,
    address: {
        street_address: string,
        locality: string,
        postal_code: string,
        country: string,
    }
}
``` 
All fields are essential, and there is validation to ensure this is followed.

####  POST /verified
Attach a query param of `value=${VERIFIED_VALUE}` to this endpoint. Anything apart from `true` (including not attaching a query param) will result in `verified = false`.

#### PATCH /reset
Resets to default values for userDetails and verified returns to false. The default userDetails are as follows:

```json
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
```

### Backend endpoints in quickjobs application

#### GET /initiate-authorize
Returns the url required for the user to consent in the flow. Uses the SDK to create the request body to start the flow, create the client and execute.

#### POST /token
Request body sends the code that is returned to the frontend from the digital ID flow. The endpoint uses the SDK to translate the returned JWT to a readble JSON object. Checks are done on the assertions returned to make sure that the essential fields were returned correctly.
