import { applyDecorators } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";

/**
 * Requests per window allowed on endpoints that accept credentials or grants.
 *
 * These are literals rather than configuration because decorators are evaluated when the
 * class is defined, which happens before `ConfigModule` has loaded the env files.
 */
const AUTH_RATE_LIMIT_REQUESTS = 10;

/**
 * Length of the rate limit window in milliseconds.
 */
const AUTH_RATE_LIMIT_TTL_MS = 60 * 1000;

/**
 * Tighter rate limit for endpoints that accept credentials, authorization codes or refresh
 * tokens, where an attacker would otherwise be free to guess at full speed.
 *
 * Applied on top of the baseline limit configured in `AppModule`.
 */
export function AuthRateLimit() {
    return applyDecorators(Throttle({ default: { limit: AUTH_RATE_LIMIT_REQUESTS, ttl: AUTH_RATE_LIMIT_TTL_MS } }));
}
