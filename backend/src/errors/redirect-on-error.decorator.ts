import { applyDecorators, UseFilters } from "@nestjs/common";
import { RedirectOnOAuthErrorFilter } from "./redirect-on-oauth-error.filter.js";
import { RedirectOnAuthErrorFilter } from "./redirect-on-auth-error.filter.js";
import { RedirectOnAnyErrorFilter } from "./redirect-on-any-error.filter.js";

export function RedirectOnError() {
    // Filter on the right is applied first!
    return applyDecorators(UseFilters(RedirectOnAnyErrorFilter, RedirectOnAuthErrorFilter, RedirectOnOAuthErrorFilter));
}
