import { SetMetadata } from "@nestjs/common";

export const NeedsAdmin = () => SetMetadata("needsAdmin", true);
