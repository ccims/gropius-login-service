import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { promisify } from "util";
import { ApiHideProperty } from "@nestjs/swagger";
import { TokenScope } from "src/backend-services/token.service";
import { LoginUser } from "./LoginUser.entity";

/**
 * The minimum length of the client secret in bytes.
 * If a number smaller than this is set in the config,
 * this wil clamp it to at least 15
 */
const MINUMUM_SECRET_LENGTH_BYTES = 15;
/**
 * The length of the censored prefix of the secret
 */
const CENSORED_SECRET_LENGTH = 5;

const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * Entity representing a client application that requires access to Gropius and that can ask for authentication.
 *
 * A client is identified by its client id and CAN optionally be secured by secrets to restrict usage
 */
@Entity()
export class AuthClient {
    /**
     * The unique ID of this client
     *
     * @example 12345678-90ab-cdef-fedc-ab0987654321
     */
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * The (human readable) name of the auth client to be able to keep track ofit.
     *
     * Doesn't need to be unique
     */
    @Column()
    name: string;

    /**
     * The list of valid enpoints to redirect the user back to after authentication has finished.
     *
     * The actual url to use is given in the authorize request and must be included in this list.
     * If none is given, the first one from this list will be used
     *
     * @example ["https://example.com/oauth/callback?query=value"]
     */
    @Column("json")
    redirectUrls: string[];

    /**
     * The list of hashed client secrets.
     * Every entry is structured like `[CENSORED];[BCRYPT_HASH]` with:
     * - [CENSORED] is a n letter prefix of the actual secret to display to the user for easier association
     * - [BCRYPT_HASH] is the salted hash of the full secret for use to compare with a later given secret
     */
    @Column("json")
    @ApiHideProperty()
    clientSecrets: string[];

    /**
     * If this is `false` the client is not valid and no authorization, token, ... requests from it should be answered.
     *
     * @example true
     */
    @Column()
    isValid: boolean;

    /**
     * If `true` requesting a token as this client requires the use
     * of a client secret accoring to the oauth specification.
     *
     * If `false` client secrets can be present and given but are not required
     * @example false
     */
    @Column()
    requiresSecret: boolean;

    /**
     * The list of scopes that this client is allowed to request.
     */
    @Column("json")
    validScopes: TokenScope[];

    /**
     * The user to use as subject for the client credential flow.
     */
    @ManyToOne(() => LoginUser, { nullable: true })
    @ApiHideProperty()
    clientCredentialFlowUser: Promise<LoginUser | null>;

    /**
     * If this client is editable.
     * If not, the client can not be changed or deleted.
     */
    isInternal: boolean = false;

    /**
     * Calculated the sha256 hash of the input.
     *
     * Can be used as fingerprint for the secret hashes.
     * @param hash The hash or other data to calculate the fingerprint for
     * @returns The hex string of the sha256 hash
     */
    private fingerprint(hash: string): string {
        return crypto.createHash("sha256").update(hash).digest("hex");
    }

    /**
     * Generates a new secret and adds it to the list of this client.
     * Does NOT save the entitiy!
     *
     * **Note**: The secret text is only returned here and will not be saved as plain text.
     * There is no way to retrieve it later.
     * Only a hashed version and a n letter prefix (for easier identification) will be saved
     *
     * The generated secret will be hex encoded random bytes of length GROPIUS_CLIENT_SECRET_LENGTH
     * @returns The generated secret text, the fingerprint of the hash of the secret and the censored version
     */
    async addSecret(): Promise<{
        secretText: string;
        fingerprint: string;
        censored: string;
    }> {
        const length = Math.min(MINUMUM_SECRET_LENGTH_BYTES, parseInt(process.env.GROPIUS_CLIENT_SECRET_LENGTH, 10));
        const secretText = (await randomBytesAsync(length)).toString("hex");
        const hash = await bcrypt.hash(secretText, parseInt(process.env.GROPIUS_BCRYPT_HASH_ROUNDS, 10));
        const censored = secretText.substring(0, CENSORED_SECRET_LENGTH);
        if (!this.clientSecrets?.length || !this.clientSecrets?.push) {
            this.clientSecrets = [];
        }
        this.clientSecrets.push(censored + ";" + hash);

        return {
            secretText,
            fingerprint: this.fingerprint(hash),
            censored: censored + "**********",
        };
    }

    /**
     * Returns a list containing not only the string stored in the database,
     * but also the n letter censored prefix and the fingerprint of the hash.
     *
     * The result of this should NOT be exposed as it contains the full hash.
     * @returns A list of the full stored hash, censore version and the fingerprint of the hash for every secret
     */
    getFullHashesPlusCensoredAndFingerprint(): {
        secret: string;
        censored: string;
        fingerprint: string;
    }[] {
        return this.clientSecrets.map((s) => {
            const semiIndex = s.indexOf(";");
            const censored = s.substring(0, semiIndex) + "**********";
            const hash = s.substring(semiIndex + 1);

            return {
                secret: s,
                censored,
                fingerprint: this.fingerprint(hash),
            };
        });
    }

    /**
     * Removes the full hash from the result of {@link AuthClient.getFullHashesPlusCensoredAndFingerprint}
     *
     * May be published on the API
     * @returns A list of censored secret and hash-fingerprint for every secret of this client
     */
    getSecretsShortedAndFingerprint(): {
        censored: string;
        fingerprint: string;
    }[] {
        return this.getFullHashesPlusCensoredAndFingerprint().map((entry) => ({
            censored: entry.censored,
            fingerprint: entry.fingerprint,
        }));
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            redirectUrls: this.redirectUrls,
            isValid: this.isValid,
            requiresSecret: this.requiresSecret,
            isInternal: this.isInternal,
        };
    }
}
