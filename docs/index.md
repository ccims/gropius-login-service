# Docs

## Parties

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

## Goal

> give gropius client access to resources of user at gropius resource server and IMS resource server


## Flow: Gropius Client Accesses Gropius Resource Server

> oauth authorization code flow with pkce for gropius client

- REDIRECT GET {gropius auth server}/auth/oauth/authorize
- REDIRECT GET {gropius client}/{redirect uri}?code={code}&state={state}
- FLOW {user authenticates at gropius auth server}
- API POST {gropius auth server}/auth/oauth/token REQUEST {code} RESPONSE {access token, refresh token}

> TODO: refresh token
> TODO: access resource server

> TODO: there is also client credentials flow?!

## Flow: User Authenticates at Gropius Auth Server

> TODO: this
> TODO: login, register

## Flow: IMS Client Flows

- passport.js specific flows for the IMS auth server

> TODO: endpoints

## Flow: User links IMS account to gropius account

> TODO: can also link gropius account (ie passport-local) to gropius account?!

> TODO: link accounts