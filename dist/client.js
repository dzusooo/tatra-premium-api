"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TatraPremiumApiClient = void 0;
const got_1 = __importDefault(require("got"));
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
        this.gotInstance = got_1.default.extend({
            prefixUrl: this.baseURL,
            hooks: {
                beforeRequest: [
                    async (request) => {
                        await this.ensureValidToken();
                        request.headers["x-request-id"] = (0, crypto_1.randomUUID)();
                        request.headers["Authorization"] = `Bearer ${this.accessToken}`;
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
        const response = await got_1.default
            .post(tokenUrl, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            form: {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: "client_credentials",
                scope: "PREMIUM_AIS",
            },
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
        const response = await got_1.default
            .post(tokenUrl, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
            },
            form: {
                grant_type: "refresh_token",
                refresh_token: this.refreshToken,
            },
        })
            .json();
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.tokenExpiresAt = Date.now() + response.expires_in * 1000;
    }
    getAuthorizationUrl(state, codeVerifier, consentId) {
        const codeChallenge = this.generateCodeChallenge(codeVerifier);
        const params = new URLSearchParams({
            client_id: this.clientId,
            response_type: "code",
            redirect_uri: this.redirectUri,
            scope: consentId ? `PREMIUM_AIS:${consentId}` : "PREMIUM_AIS",
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
        const response = await got_1.default
            .post(tokenUrl, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
            },
            form: {
                code: code,
                grant_type: "authorization_code",
                redirect_uri: this.redirectUri,
                scope: "PREMIUM_AIS",
                code_verifier: codeVerifier,
            },
        })
            .json();
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.tokenExpiresAt = Date.now() + response.expires_in * 1000;
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            tokenExpiresAt: new Date(this.tokenExpiresAt),
        };
    }
    getGotInstance() {
        return this.gotInstance;
    }
    setAccessToken(accessToken, expiresAt) {
        this.accessToken = accessToken;
        this.tokenExpiresAt = expiresAt.getTime();
    }
    setRefreshToken(refreshToken) {
        this.refreshToken = refreshToken;
    }
}
exports.TatraPremiumApiClient = TatraPremiumApiClient;
