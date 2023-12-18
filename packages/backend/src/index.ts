import * as jose from "jose";

export class TractorbeamAI {
    private readonly apiSecretBytes: Uint8Array;

    constructor(
        private readonly apiKey: string,
        private readonly apiSecret: string,
    ) {
        this.apiSecretBytes = new TextEncoder().encode(this.apiSecret);
    }

    public async createToken(opts: {
        identity: string;
        projectId: number;
    }): Promise<string> {
        const jwt = new jose.SignJWT({ projectId: opts.projectId })
            .setSubject(opts.identity)
            .setIssuer(this.apiKey)
            .setIssuedAt()
            .setNotBefore(0)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("6h");
        return jwt.sign(this.apiSecretBytes);
    }

    public async decodeToken(token: string): Promise<any> {
        return jose.jwtVerify(token, this.apiSecretBytes);
    }
}
