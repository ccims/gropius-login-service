import { applyDecorators, UseFilters } from "@nestjs/common";
import { RedirectOnOAuthErrorFilter } from "./redirect-on-oauth-error.filter";
import { RedirectOnAuthErrorFilter } from "./redirect-on-auth-error.filter";
import { RedirectOnAnyErrorFilter } from "./redirect-on-any-error.filter";

export function RedirectOnError() {
    // Filter on the right is applied first!
    return applyDecorators(UseFilters(RedirectOnAnyErrorFilter, RedirectOnAuthErrorFilter, RedirectOnOAuthErrorFilter));
}
