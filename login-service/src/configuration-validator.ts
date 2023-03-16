import * as Joi from "joi";

export const validationSchema = Joi.object({
    GROPIUS_INTERNAL_BACKEND_ENDPOINT: Joi.string().uri().default("http://localhost:8081/graphql"),
    GROPIUS_INTERNAL_BACKEND_TOKEN: Joi.string(),
    GROPIUS_INTERNAL_BACKEND_JWT_SECRET: Joi.string().min(1).required(),

    GROPIUS_LOGIN_DATABASE_DRIVER: Joi.string().default("postgres"),
    GROPIUS_LOGIN_DATABASE_HOST: Joi.string().default("localhost"),
    GROPIUS_LOGIN_DATABASE_PORT: Joi.number().integer().min(0).max(65535).default(5432),
    GROPIUS_LOGIN_DATABASE_USER: Joi.string().default("postgres"),
    GROPIUS_LOGIN_DATABASE_PASSWORD: Joi.string().default("postgres"),
    GROPIUS_LOGIN_DATABASE_DATABASE: Joi.string().default("gropius"),

    GROPIUS_REGISTRATION_EXPIRATION_TIME_MS: Joi.number().min(0).default(600000),
    GROPIUS_LOGIN_SPECIFIC_JWT_SECRET: Joi.string().min(1).required(),
    GROPIUS_JWT_ISSUER: Joi.string().default("gropius-login"),
    GROPIUS_ACCESS_TOKEN_EXPIRATION_TIME_MS: Joi.number()
        .min(0)
        .max(48 * 60 * 60 * 1000)
        .required(),
    GROPIUS_REGULAR_LOGINS_INACTIVE_EXPIRATION_TIME_MS: Joi.number().min(0).default(0),
    GROPIUS_PERFORM_IMS_USER_SEARCH_ON: Joi.string()
        .pattern(/^((LOGIN|REG|REG_SYNC),)*(LOGIN|REG|REG_SYNC)?$/)
        .default("LOGIN,REG,REG_SYNC"),
    GROPIUS_CLIENT_SECRET_LENGTH: Joi.number().min(15).default(48),
    GROPIUS_LOGIN_LISTEN_PORT: Joi.number().default(3000),
    GROPIUS_LOGIN_ENABLE_OPENAPI: Joi.bool().default(true),

    GROPIUS_PASSPORT_STATE_JWT_ISSUER: Joi.string().default("gropius-login-state"),
    GROPIUS_BCRYPT_HASH_ROUNDS: Joi.number().min(8).default(10),
    GROPIUS_OAUTH_CODE_EXPIRATION_TIME_MS: Joi.number().min(0).default(600000),

    GROPIUS_LOGIN_SYNC_API_SECRET: Joi.string(),

    GROPIUS_DEFAULT_STRATEGY_INSTANCE_TYPE: Joi.string().optional(),
    GROPIUS_DEFAULT_STRATEGY_INSTANCE_CONFIG: Joi.string().optional(),
    GROPIUS_DEFAULT_STRATEGY_INSTANCE_NAME: Joi.string().optional(),
    GROPIUS_DEFAULT_USER_USERNAME: Joi.string().optional(),
    GROPIUS_DEFAULT_USER_DISPLAYNAME: Joi.string().optional(),
    GROPIUS_DEFAULT_USER_PASSWORD: Joi.string().optional(),
    GROPIUS_DEFAULT_USER_STRATEGY_INSTANCE_NAME: Joi.string(),
    GROPIUS_DEFAULT_AUTH_CLIENT_NAME: Joi.string().optional(),
    GROPIUS_DEFAULT_AUTH_CLIENT_REDIRECT: Joi.string().optional(),
});
