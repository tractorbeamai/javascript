import { TractorbeamAI } from "./index";

describe("TractorbeamAI", () => {
    const apiKey = "test_api_key";
    const apiSecret = "test_api_secret";

    const tb = new TractorbeamAI(apiKey, apiSecret);

    it("should create a JWT", async () => {
        const opts = {
            identity: "test_identity",
            projectId: 1,
        };

        const token = await tb.createToken(opts);
        expect(token).toBeDefined();

        const decoded = await tb.decodeToken(token);
        expect(decoded).toBeDefined();
        expect(decoded.payload).toBeDefined();
        expect(decoded.payload.projectId).toBe(opts.projectId);
        expect(decoded.payload.sub).toBe(opts.identity);
    });
});
