"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TatraPremiumApiClient = void 0;
const ky_1 = __importDefault(require("ky"));
const crypto_1 = require("crypto");
class TatraPremiumApiClient {
    constructor(clientId, clientSecret, redirectUri, useSandbox = false) {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiresAt = null;
        this.baseURL = useSandbox
            ? "https://api.tatrabanka.sk/premium/sandbox"
            : "https://api.tatrabanka.sk/premium/production";
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.kyInstance = ky_1.default.create({
            prefixUrl: this.baseURL,
            hooks: {
                beforeRequest: [
                    async (request) => {
                        await this.ensureValidToken();
                        request.headers.set("Authorization", `Bearer ${this.accessToken}`);
                    },
                ],
            },
        });
    }
    async ensureValidToken() {
        if (!this.accessToken ||
            !this.tokenExpiresAt ||
            Date.now() >= this.tokenExpiresAt) {
            if (this.refreshToken) {
                await this.refreshAccessToken();
            }
            else {
                await this.getClientCredentialsToken();
            }
        }
    }
    async getClientCredentialsToken() {
        const tokenUrl = `${this.baseURL}/auth/oauth/v2/token`;
        const response = await ky_1.default
            .post(tokenUrl, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: "client_credentials",
                scope: "PREMIUM_AIS",
            }),
        })
            .json();
        this.accessToken = response.access_token;
        this.tokenExpiresAt = Date.now() + response.expires_in * 1000;
    }
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error("No refresh token available");
        }
        const tokenUrl = `${this.baseURL}/auth/oauth/v2/token`;
        const response = await ky_1.default
            .post(tokenUrl, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: this.refreshToken,
            }),
        })
            .json();
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.tokenExpiresAt = Date.now() + response.expires_in * 1000;
    }
    getAuthorizationUrl(state, codeVerifier) {
        const codeChallenge = this.generateCodeChallenge(codeVerifier);
        const params = new URLSearchParams({
            client_id: this.clientId,
            response_type: "code",
            redirect_uri: this.redirectUri,
            scope: "PREMIUM_AIS",
            state: state,
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
        });
        return `${this.baseURL}/auth/oauth/v2/authorize?${params.toString()}`;
    }
    generateCodeChallenge(codeVerifier) {
        const hash = (0, crypto_1.createHash)("sha256").update(codeVerifier).digest();
        return hash
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");
    }
    async exchangeAuthorizationCode(code, codeVerifier) {
        const tokenUrl = `${this.baseURL}/auth/oauth/v2/token`;
        const response = await ky_1.default
            .post(tokenUrl, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
            },
            body: new URLSearchParams({
                code: code,
                grant_type: "authorization_code",
                redirect_uri: this.redirectUri,
                scope: "PREMIUM_AIS",
                code_verifier: codeVerifier,
            }),
        })
            .json();
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.tokenExpiresAt = Date.now() + response.expires_in * 1000;
    }
    getKyInstance() {
        return this.kyInstance;
    }
}
exports.TatraPremiumApiClient = TatraPremiumApiClient;
