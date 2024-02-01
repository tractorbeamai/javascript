import * as jose from "jose";

export default class TractorbeamAI {
    constructor(
        private readonly publishableKey: string,
        private readonly secretKey: string,
        private readonly apiRoot: string = "https://api.tractorbeam.ai",
    ) {}

    private async getSecretKey(): Promise<jose.KeyLike> {
        // The API secret is prefixed with "sk_" to indicate that it is a secret
        // key. This prefix is added *after* the key is base64 encoded, so we
        // need to remove it before decoding.
        const base64Key = this.secretKey.slice(3);
        const decodedKey = atob(base64Key);
        const key = jose.importPKCS8(decodedKey, "RS256");
        return key;
    }
    public async createToken(opts: { identity: string }): Promise<string> {
        const jwt = new jose.SignJWT()
            .setSubject(opts.identity)
            .setIssuer(this.publishableKey)
            .setIssuedAt()
            .setProtectedHeader({ alg: "RS256" })
            .setExpirationTime("6h");
        return jwt.sign(await this.getSecretKey());
    }

    public async query(
        opts:
            | {
                  token?: never;
                  identity: string;
                  projectId: number;
                  query: string;
              }
            | {
                  token: string;
                  identity?: never;
                  projectId?: never;
                  query: string;
              },
    ): Promise<any> {
        const res = await fetch(`${this.apiRoot}/client/query/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${
                    opts.token
                        ? opts.token
                        : this.createToken({
                              identity: opts.identity,
                          })
                }`,
            },
            body: JSON.stringify({
                query: opts.query,
            }),
        });

        if (!res.ok) {
            throw new Error(
                `Failed to query Tractorbeam API: ${res.status} ${res.statusText}`,
            );
        }

        return res.json();
    }

    public async decodeToken(token: string): Promise<any> {
        return jose.jwtVerify(token, await this.getSecretKey());
    }
}
