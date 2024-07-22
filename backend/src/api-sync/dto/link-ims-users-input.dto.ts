import { HttpException, HttpStatus } from "@nestjs/common";

export class LinkImsUsersInputDto {
    /**
     * The username of the user in the IMS
     */
    imsUserIds: string[];

    static check(input: LinkImsUsersInputDto): LinkImsUsersInputDto {
        if (!Array.isArray(input.imsUserIds) || input.imsUserIds.length == 0) {
            throw new HttpException("The imsUserIds must be given and can't be empty", HttpStatus.BAD_REQUEST);
        }
        for (const id of input.imsUserIds) {
            if (typeof id != "string" || id.trim().length == 0) {
                throw new HttpException("The imsUserIds must be an array of non-empty strings", HttpStatus.BAD_REQUEST);
            }
        }
        return input;
    }
}