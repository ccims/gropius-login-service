# Docs

## Goal

Give gropius client access to resources of user at gropius resource server and IMS resource server.

## Parties

| Party                    | Description                                                                | Example                                  |
|--------------------------|----------------------------------------------------------------------------|------------------------------------------|
| user                     | owner of resources at gropius resource server and IMS resource server      | modeler                                  |
| (browser) gropius client | public oauth client for gropius auth server running in the browser         | gropius-frontend, gropius-login-frontend |
| (machine) gropius client | private oauth client for gropius auth server running, e.g., as CLI command | gropius template importer                |
| gropius auth server      | oauth auth server                                                          | gropius-login-backend                    |
| gropius resource server  | oauth resource server of gropius auth server                               | gropius-backend, gropius-login-backend   |
| IMS client               | private oauth client for IMS auth server                                   | gropius-login-backend                    |
| IMS auth server          | oauth auth server                                                          | github, jira, gitlab                     |
| IMS resource server      | oauth resource server of IMS auth server                                   | github, jira, gitlab                     |

Thereby, "oauth" is relaxed to "oauth, openid connect, provider-specific variations"

## Accounts

| Resource        | Description                    | Owner |
|-----------------|--------------------------------|-------|
| gropius account | account at gropius auth server | user  |
| IMS account     | account at IMS auth server     | user  |

## Flow: Browser Gropius Client Accesses Gropius Resource Server

Oauth authorization code flow with pkce for gropius client running in the browser as usual.

- `REDIRECT GET {gropius auth server}/auth/oauth/authorize`
- `FLOW {user grants access at gropius auth server}`
- `REDIRECT GET {gropius client}/{redirect uri}`
- `API POST {gropius auth server}/auth/oauth/token`

Resource server can then be accessed with access token as usual.
Further, refresh token can be used to get new access token as usual.
The browser gropius client shall not store any tokens in a persistent way, but only in memory.


## Flow: Gropius Client refreshes Access Token

Refresh token flow as usual.


## Flow: Machine Gropius Client Accesses Gropius Resource Server

Client credentials flow for gropius client running, e.g., as CLI application, as usual.

- `API POST {gropius auth server}/auth/oauth/token`

An access token for the resources of the user who is linked to the oauth client is returned.


## Flow: User grants access at Gropius Auth Server

- `FLOW {user authenticates at gropius auth server}`
- `REDIRECT GET {gropius auth server}/auth/flow/prompt`
- `REDIRECT POST {gropius auth server}/auth/api/internal/auth/prompt/callback`

The consent prompt is skipped if user already granted access to gropius client in an earlier flow or if gropius client is configured to not require prompt.


## Flow: User authenticates at Gropius Auth Server

- `REDIRECT GET {gropius auth server}/auth/flow/login`
- one of the following flows
  - `FLOW {user registers at gropius auth server via passport-local}`
  - `FLOW {user registers at gropius auth server via IMS auth server}`
  - `FLOW {user authenticates at gropius auth server via IMS auth server}`
  - `FLOW {user authenticates at gropius auth server via passport-local}`

The user is authenticated after a registration.
The authentication is persisted in a session cookie and used for further requests to the gropius auth server.


## Flow: User registers at Gropius Auth Server via passport-local

> TODO: register via passport-local

## Flow: User registers at Gropius Auth Server via IMS auth server
 
> TODO: register via IMS auth server


## Flow: User authenticates at Gropius Auth Server via passport-local

- `REDIRECT GET {gropius auth server}/auth/api/internal/auth/submit/{strategy id}/login`


## Flow: User authenticates at Gropius Auth Server via IMS auth server

- passport.js specific flows for the IMS auth server

- `REDIRECT GET {gropius auth server}/auth/api/internal/auth/redirect/{strategy id}/login`
- `FLOW {user authenticates at IMS auth server}`
- `REDIRECT GET {gropius auth server}/auth/api/internal/callback/{strategy id}`

> TODO: endpoints


## Flow: User authenticates at IMS auth server

The IMS auth server authenticates the user using any IMS specific flow.


## Flow: IMS client accesses IMS resource server

The IMS client uses credentials granted during `FLOW {user authenticates at gropius auth server via IMS auth server}`.

## Flow: User links IMS account to gropius account

> TODO: can also link gropius account (ie passport-local) to gropius account?!

- `FLOW {user authenticates at gropius auth server}`
- `HTTP GET {gropius auth server}/auth/flow/register-additional`

- `REDIRECT GET {gropius auth server}/auth/api/internal/auth/redirect/{strategy id}/{register,register-sync}`
- `REDIRECT GET {IMS auth server}/auth/oauth/authorize`
- `FLOW {user authenticates at IMS auth server}`
- `REDIRECT GET {gropius auth server}/auth/api/internal/callback/{strategy id}`
- `REDIRECT GET {gropius auth server}/auth/flow/register`
- `REDIRECT GET {gropius auth server}/auth/api/internal/register/callback`

- `REDIRECT GET {gropius auth server}/auth/flow/account`

## Flow: User logs out at gropius client

The gropius client deletes all tokens.
The gropius client should keep the state that the user manually logged out and should not automatically start a new `FLOW {gropius client accesses gropius resource server}` without explicit user interaction.
Otherwise, since the user might still be logged in at the gropius auth server and the user might be directly logged in again at the gropius client.


## Flow: User logs out at gropius auth server (current session)

This will delete the current session token and ActiveLogin.

- `API POST {gropius auth server}/auth/api/internal/auth/logout/current`


## Flow: User logs out at gropius auth server (every session)

This will delete the current session token and all ActiveLogins of the user.

- `API POST {gropius auth server}/auth/api/internal/auth/logout/everywhere`


## Data

> TODO: talk about session and database

| Record               | Storage  | Description     |
|----------------------|----------|-----------------|
| LoginUser            | Postgres | gropius account |
| UserLoginData        | Postgres |                 |
| UserLoginDataIMSUser | Postgres |                 |
| ActiveLogin          | Postgres |                 |
| Session              | Cookie   |                 |
|                      | Neo4j    |                 |


## Notes

- never manually visit `HTTP GET {gropius auth server}/auth/flow/login` but only via `HTTP GET {gropius auth server}/auth/flow/account`
- never manually visit `HTTP GET {gropius auth server}/auth/flow/register` but only via `HTTP GET {gropius auth server}/auth/flow/account`
