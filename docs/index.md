# Docs

## Goal

Give gropius client access to resources of user at gropius resource server and IMS resource server.

## Parties

| Party                    | Description                                                                | Example                                  |
|--------------------------|----------------------------------------------------------------------------|------------------------------------------|
| user                     | owner of resources at gropius resource server and IMS resource server      | gropius end-user                         |
| (browser) gropius client | public oauth client for gropius auth server running in the browser         | gropius-frontend, gropius-login-frontend |
| (machine) gropius client | private oauth client for gropius auth server running, e.g., as CLI command | gropius template importer                |
| gropius auth server      | oauth auth server                                                          | gropius-login-backend                    |
| gropius resource server  | oauth resource server of gropius auth server                               | gropius-backend, gropius-login-backend   |
| IMS client               | private oauth client for IMS auth server                                   | gropius-login-backend                    |
| IMS auth server          | oauth auth server                                                          | github, jira, gitlab                     |
| IMS resource server      | oauth resource server of IMS auth server                                   | github, jira, gitlab                     |

Thereby, "oauth" is relaxed to oauth, openid connect, and any provider-specific variations of a flow to grant access of resources to a third party and to authenticate a user.

## Accounts

| Resource        | Description                    | Owner |
|-----------------|--------------------------------|-------|
| gropius account | account at gropius auth server | user  |
| IMS account     | account at IMS auth server     | user  |

## Flow "Browser Gropius Client Accesses Gropius Resource Server"

Authorization code flow with PKCE for gropius client running in the browser as usual.

1. `REDIRECT GET {gropius auth server}/auth/oauth/authorize`
1. `FLOW {user grants access at gropius auth server}`
1. `REDIRECT GET {gropius client}/{redirect uri}`
1. `API POST {gropius auth server}/auth/oauth/token`

Resource server can then be accessed with access token as usual.
Further, refresh token can be used to get new access token as usual.
The browser gropius client shall not persist any tokens.


## Flow "Machine Gropius Client Accesses Gropius Resource Server"

Client credentials flow for gropius client running, e.g., as CLI application, as usual.
An access token for the resources of the user who is linked to the oauth client is returned.

1. `API POST {gropius auth server}/auth/oauth/token`


## Flow "Gropius Client Refreshes Access Token"

Refresh token flow as usual.


## Flow "Gropius Client Accesses User Account"

The user is not authenticated at the gropius client but only authorizes the gropius client to access resources at the gropius resource server using the `FLOW {browser gropius client accesses gropius resource server}`.
For displaying purposes, the gropius client can access the user account.



## Flow "User Grants Access at Gropius Auth Server"

1. `FLOW {user authenticates at gropius auth server}`
1. `REDIRECT GET {gropius auth server}/auth/flow/prompt`
1. `REDIRECT POST {gropius auth server}/auth/api/internal/auth/prompt/callback`

The consent prompt is skipped if user already granted access to gropius client in an earlier flow or if gropius client is configured to not require prompt.


## Flow "User authenticates at Gropius Auth Server"

1. `REDIRECT GET {gropius auth server}/auth/flow/login`
1. one of the following flows
    1. `FLOW {user registers at gropius auth server via passport-local}`
    1. `FLOW {user registers at gropius auth server via IMS auth server}`
    1. `FLOW {user authenticates at gropius auth server via passport-local}`
    1. `FLOW {user authenticates at gropius auth server via IMS auth server}`

The user is authenticated after a registration.
The authentication is persisted in a session cookie.
Authentication is skipped if user is already authenticated.


## Flow "User Registers at Gropius Auth Server via passport-local"

1. `REDIRECT GET {gropius auth server}/auth/api/internal/auth/submit/{strategy instance id}/{register,register-sync}`
1. `REDIRECT GET {gropius auth server}/auth/flow/register`
1. `REDIRECT GET {gropius auth server}/auth/api/internal/register/callback`


## Flow "User Registers at Gropius Auth Server via IMS Auth Server"
 
1. `REDIRECT GET {gropius auth server}/auth/api/internal/auth/redirect/{strategy instance id}/{register,register-sync}`
1. `REDIRECT GET {IMS auth server}/auth/oauth/authorize`
1. `FLOW {user authenticates at IMS auth server}`
1. `REDIRECT GET {gropius auth server}/auth/api/internal/callback/{strategy instance id}`
1. `REDIRECT GET {gropius auth server}/auth/flow/register`
1. `REDIRECT GET {gropius auth server}/auth/api/internal/register/callback`


## Flow "User Authenticates at Gropius Auth Server via passport-local"

1. `REDIRECT GET {gropius auth server}/auth/api/internal/auth/submit/{strategy instance id}/login`


## Flow "User Authenticates at Gropius Auth Server via IMS Auth Server"

1. `REDIRECT GET {gropius auth server}/auth/api/internal/auth/redirect/{strategy instance id}/login`
1. `FLOW {user authenticates at IMS auth server}`
1. `REDIRECT GET {gropius auth server}/auth/api/internal/callback/{strategy instance id}`


## Flow "User Authenticates at IMS Auth Server"

The IMS auth server authenticates the user using any IMS-specific flow.


## Flow "IMS Client Accesses IMS Resource Server"

The IMS client uses credentials granted during `FLOW {user authenticates at gropius auth server via IMS auth server}`.


## Flow "User Links IMS Account to Gropius Account"

1. `FLOW {user authenticates at gropius auth server}`
1. `HTTP GET {gropius auth server}/auth/flow/register-additional`
1. one of the following flows
   1. `FLOW {user registers at gropius auth server via passport-local}`
   1. `FLOW {user registers at gropius auth server via IMS auth server}`
1. `REDIRECT GET {gropius auth server}/auth/flow/account`

The registration flows shall not create a new gropius account, but link the new loginData to the existing gropius account.

## Flow "User Unlinks IMS Account from Gropius Account"

1. `API POST {gropius auth server}/auth/api/internal/auth/update-action/{login data id}/delete`


## Flow "User Logs Out at the Gropius Client"

The gropius client deletes all tokens.
The gropius client shall keep the state that the user manually logged out and shall not automatically start a new `FLOW {gropius client accesses gropius resource server}` without explicit user interaction.
Otherwise, since the user might still be logged in at the gropius auth server, the user might be directly logged in again at the gropius client.

Note, technically, the user never "logged into" the gropius client, but only authorized it to access their resources.


## Flow "User Logs Out at Gropius Auth Server"

This will delete the current session cookie.

1. `API POST {gropius auth server}/auth/api/internal/auth/logout/current`

The activeLogin is still valid.
See `FLOW {user logs out everywhere at gropius auth server}` to invalidate all ActiveLogins.


## Flow "User Logs Out Everywhere at Gropius Auth Server"

This will delete the current session token and all ActiveLogins of the user.
This will also invalidate all issued tokens.

1. `API POST {gropius auth server}/auth/api/internal/auth/logout/everywhere`


## Data

| Record               | Storage  | Description     |
|----------------------|----------|-----------------|
| LoginUser            | Postgres | gropius account |
| UserLoginData        | Postgres |                 |
| UserLoginDataIMSUser | Postgres |                 |
| ActiveLogin          | Postgres |                 |
| ActiveLoginAccess    | Postgres |                 |
| StrategyInstance     | Postgres |                 |
| Session              | Cookie   |                 |
|                      | Neo4j    |                 |

Please note that the cookie itself is formally not a JWT but a signed JSON object.


## Expirations

| Record            | Expiration                                                            |
|-------------------|-----------------------------------------------------------------------|
| UserLoginData     | 10 min while not registered, otherwise never                          |
| ActiveLogin       | 1 month, extended by 1 month if used, but at max 12 months            |
| ActiveLoginAccess | expired if its ActiveLogin is expired                                 |
| Session           | 10 min while not authenticated, expired if its ActiveLogin is expired |
| AuthorizationCode | 10 min                                                                |
| AccessToken       | 10 min                                                                |
| RefreshToken      | 2 hours                                                               |

Further, any record is only valid if itself and its parent are valid.

## Notes

1. never manually visit `HTTP GET {gropius auth server}/auth/flow/login` but only via `HTTP GET {gropius auth server}/auth/flow/account`
1. never manually visit `HTTP GET {gropius auth server}/auth/flow/register` but only via `HTTP GET {gropius auth server}/auth/flow/account`
