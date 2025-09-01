import { applyDecorators, Header } from "@nestjs/common";

export function NoCors() {
    return applyDecorators(Header("Access-Control-Allow-Origin", () => process.env.GROPIUS_ENDPOINT));
}
