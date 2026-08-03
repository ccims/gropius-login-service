# Login-Service Backend

## Description

Nodejs/Nestjs service that does the user management and authentication for the gropius-backend. It will generate tokens for the user to use to identify against the api

## Installation

```bash
$ npm install
```

### Graphql Model Generation
Queries and mutations live next to the code that runs them, written as `graphql(...)` tagged templates.
Fragments shared between several of them are in `src/model/graphql/fragments`. Both are collected into
the typed client in `src/model/graphql/generated`, which is checked in and has to be regenerated
whenever an operation or the backend schema changes:
1. Make sure, the api-internal service is running on `http://localhost:8081/graphql` (or another url)
2. Check that the value of the `schema` field in codegen.ts matches the API endpoint under which the api-internal is running
3. Run `GROPIUS_INTERNAL_BACKEND_TOKEN=<the token of the api-internal> npm run generate-model`,
   the api-internal rejects introspection without it

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build  # Build the sources
$ npm run init-database  # Run all database migrations to get database to current version
$ npm run start:prod  # Start the production version of the app
```

## Debug/Try out
The login service deploys a swagger UI on `http://HOSTNAME:3001/login-api-doc#/` which has some ability to interact with the API

Additionally, for easier and more intuitive debugging and testing of the login API and especially of the OAuth flow etc., an interactive UI is deployed on `http://HOSTNAME:3001/login-debug/`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```