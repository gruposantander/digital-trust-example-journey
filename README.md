# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.25.

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

`cd backend/` to get into the backend folder. Run `npm run start:watch` to get nodemon to start running on port 8000. Running with nodemon means any changes saved, update and rerun the local server. If you face issues making requests - unset proxies in terminal, make sure you're out of the VPN and check computer clock is correct (JWT needs correct time).

### Interacting with the backend

Use these credentials for the Santander login to use the dummy account associated with this profile: 
```
{
	"user": "MB6anukh7u9",
	"pass": "Testing123!"
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
```
{
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
```

### Backend endpoints in quickjobs application

#### GET /initiate-authorize
Returns the url required for the user to consent in the flow. Uses the SDK to create the request body to start the flow, create the client and execute.

#### POST /token
Request body sends the code that is returned to the frontend from the digital ID flow. The endpoint uses the SDK to translate the returned JWT to a readble JSON object. Checks are done on the assertions returned to make sure that the essential fields were returned correctly.
