import { applyDecorators, UseFilters } from "@nestjs/common";
import { CatchOAuthErrorFilter } from "./catch-oauth-error.filter";

export function CatchOAuthError() {
    return applyDecorators(UseFilters(CatchOAuthErrorFilter));
}
