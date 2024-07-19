import { Injectable } from "@nestjs/common";
import { createPrivateKey, createPublicKey, privateDecrypt, publicEncrypt } from "crypto";

/**
 * Service to encrypt and decrypt data using the LOGIN_SPECIFIC key pair
 */
@Injectable()
export class EncryptionService {
    
    private readonly privateKey = createPrivateKey(atob(process.env.GROPIUS_LOGIN_SPECIFIC_PRIVATE_KEY));

    private readonly publicKey = createPublicKey(atob(process.env.GROPIUS_LOGIN_SPECIFIC_PUBLIC_KEY));

    /**
     * Encrypts the given data using the LOGIN_SPECIFIC public key
     * 
     * @param data The data to encrypt
     * @returns The encrypted data
     */
    public encrypt(data: string): string {
        return publicEncrypt(this.publicKey, Buffer.from(data)).toString("base64");
    }

    /**
     * Decrypts the given data using the LOGIN_SPECIFIC private key
     * 
     * @param data The data to decrypt
     * @returns The decrypted data
     */
    public decrypt(data: string): string {
        return privateDecrypt(this.privateKey, Buffer.from(data, "base64")).toString();
    }

}