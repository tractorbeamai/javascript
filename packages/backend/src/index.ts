import * as jose from "jose";

export class TractorbeamAI {
    constructor(
        private readonly apiKey: string,
        private readonly apiSecret: string,
    ) {}

    private async getSecretKey(): Promise<jose.KeyLike> {
        // The API secret is prefixed with "sk_" to indicate that it is a secret
        // key. This prefix is added *after* the key is base64 encoded, so we
        // need to remove it before decoding.
        const base64Key = this.apiSecret.slice(3);
        const decodedKey = atob(base64Key);
        const key = jose.importPKCS8(decodedKey, "RS256");
        return key;
    }
    public async createToken(opts: {
        identity: string;
        projectId: number;
    }): Promise<string> {
        const jwt = new jose.SignJWT({ projectId: opts.projectId })
            .setSubject(opts.identity)
            .setIssuer(this.apiKey)
            .setIssuedAt()
            .setProtectedHeader({ alg: "RS256" })
            .setExpirationTime("6h");
        return jwt.sign(await this.getSecretKey());
    }

    public async decodeToken(token: string): Promise<any> {
        return jose.jwtVerify(token, await this.getSecretKey());
    }
}
