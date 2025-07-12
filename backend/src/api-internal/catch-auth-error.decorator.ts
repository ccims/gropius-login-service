import { applyDecorators, UseFilters } from "@nestjs/common";
import { CatchAuthErrorFilter } from "./catch-auth-error.filter";

export function CatchAuthError() {
    return applyDecorators(UseFilters(CatchAuthErrorFilter));
}
