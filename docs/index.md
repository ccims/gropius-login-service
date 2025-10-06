# Docs

## Goal

> give gropius client access to resources of user at gropius resource server and IMS resource server

## Parties

> "oauth" is relaxed to "oauth, openid connect, provider-specific variations"

| Party                   | Description                                                           | Example                                  |
|-------------------------|-----------------------------------------------------------------------|------------------------------------------|
| user                    | owner of resources at gropius resource server and IMS resource server | modeler                                  |
| gropius client          | public oauth client for gropius auth server                           | gropius-frontend, gropius-login-frontend |
| gropius auth server     | oauth auth server                                                     | gropius-login-backend                    |
| gropius resource server | oauth resource server of gropius auth server                          | gropius-backend, gropius-login-backend   |
| IMS client              | private oauth client for IMS auth server                              | gropius-login-backend                    |
| IMS auth server         | oauth auth server                                                     | github, jira, gitlab                     |
| IMS resource server     | oauth resource server of IMS auth server                              | github, jira, gitlab                     |

## Accounts

| Resource        | Description                    | Owner |
|-----------------|--------------------------------|-------|
| gropius account | account at gropius auth server | user  |
| IMS account     | account at IMS auth server     | user  |

## Flow: Gropius Client Accesses Gropius Resource Server

> TODO: there is also client credentials flow?!

Oauth authorization code flow with pkce for gropius client as usual.

- REDIRECT GET {gropius auth server}/auth/oauth/authorize
- FLOW {user grants access at gropius auth server}
- REDIRECT GET {gropius client}/{redirect uri}
- API POST {gropius auth server}/auth/oauth/token

Resource server can then be accessed with access token as usual.
Further, refresh token can be used to get new access token as usual.


## Flow: User grants access at Gropius Auth Server

- FLOW {user authenticates at gropius auth server}
- REDIRECT GET {gropius auth server}/auth/flow/prompt
- REDIRECT POST {gropius auth server}/auth/api/internal/auth/prompt/callback

The consent prompt is skipped if user already granted access to gropius client in an earlier flow or if gropius client is configured to not require prompt.


## Flow: User authenticates at Gropius Auth Server

> TODO: merge this with FLOW {user authenticates at gropius auth server via IMS auth server}?!

> TODO: login

- REDIRECT GET {gropius auth server}/auth/flow/login
- REDIRECT GET {gropius auth server}/auth/api/internal/auth/submit/<strategy>/login <- IMMMER oder nur bei passport local?
- ...


> TODO: register


## Flow: User authenticates at Gropius Auth Server via IMS auth server

- passport.js specific flows for the IMS auth server

> TODO: endpoints

## Flow: User authenticates at IMS auth server

- IMS specific


## Flow: IMS client accesses IMS resource server

- IMS client uses credentials granted during FLOW {user authenticates at gropius auth server via IMS auth server}

## Flow: User links IMS account to gropius account

> TODO: can also link gropius account (ie passport-local) to gropius account?!

- REQUIRES FLOW {gropius client accesses gropius resource server}

- REDIRECT GET {gropius auth server}/auth/flow/register-additional

- REDIRECT GET {gropius auth server}/auth/api/internal/auth/redirect/<strategy>/register
- REDIRECT GET {IMS auth server}/auth/oauth/authorize
- FLOW {user authenticates at IMS auth server}
- REDIRECT GET {gropius auth server}/auth/api/internal/callback/<strategy>
- REDIRECT GET {gropius auth server}/auth/flow/register
- REDIRECT GET {gropius auth server}/auth/api/internal/register/callback

- REDIRECT GET {gropius auth server}/auth/flow/account

## Flow: User logs out at gropius client

> TODO: this

## Flow: User logs out at gropius auth server

> TODO: this

## Data 

> TODO: talk about session and database



## Notes

- never manually visit {gropius auth server}/auth/flow/login but only via {gropius auth server}/auth/flow/account
- never manually visit {gropius auth server}/auth/flow/register but only via {gropius auth server}/auth/flow/account
