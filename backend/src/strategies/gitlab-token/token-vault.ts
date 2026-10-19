import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

function key(): Buffer {
    const value = Buffer.from(process.env.GROPIUS_GITLAB_TOKEN_ENCRYPTION_KEY ?? "", "base64");
    if (value.length !== 32)
        throw new Error("GROPIUS_GITLAB_TOKEN_ENCRYPTION_KEY must contain a base64-encoded 32-byte key");
    return value;
}

/** This strategy never persists a plaintext PAT in UserLoginData.data. */
export function sealToken(token: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key(), iv);
    const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
    return ["v1", iv.toString("base64"), cipher.getAuthTag().toString("base64"), encrypted.toString("base64")].join(
        ":",
    );
}

export function openToken(value: string): string {
    const [version, iv, tag, ciphertext, extra] = value.split(":");
    if (version !== "v1" || !iv || !tag || !ciphertext || extra) throw new Error("Invalid encrypted GitLab credential");
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64"));
    decipher.setAuthTag(Buffer.from(tag, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64")), decipher.final()]).toString("utf8");
}
