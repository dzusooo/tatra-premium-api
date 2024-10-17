"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TatraPremiumApiClient = void 0;
const got_1 = __importDefault(require("got"));
const crypto_1 = __importStar(require("crypto"));
const hpagent_1 = require("hpagent");
class TatraPremiumApiClient {
    constructor(clientId, clientSecret, redirectUri, useSandbox = false, proxyUrl) {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiresAt = null;
        this.baseURL = useSandbox
            ? "https://api.tatrabanka.sk/premium/sandbox"
            : "https://api.tatrabanka.sk/premium/production";
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.proxyUrl = proxyUrl;
        this.gotInstance = got_1.default.extend({
            prefixUrl: this.baseURL,
            agent: {
                ...(this.proxyUrl && {
                    https: new hpagent_1.HttpsProxyAgent({
                        keepAlive: false,
                        proxy: this.proxyUrl,
                    }),
                }),
            },
            rejectUnauthorized: !this.proxyUrl,
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
            agent: {
                ...(this.proxyUrl && {
                    https: new hpagent_1.HttpsProxyAgent({
                        keepAlive: false,
                        proxy: this.proxyUrl,
                    }),
                }),
            },
            rejectUnauthorized: !this.proxyUrl,
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
            agent: {
                ...(this.proxyUrl && {
                    https: new hpagent_1.HttpsProxyAgent({
                        keepAlive: false,
                        proxy: this.proxyUrl,
                    }),
                }),
            },
            rejectUnauthorized: !this.proxyUrl,
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
    async getAuthorizationUrl(state, codeVerifier, consentId) {
        const codeChallenge = await this.generateCodeChallenge(codeVerifier);
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
    async generateCodeChallenge(codeVerifier) {
        const buffer = await crypto_1.default.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
        return btoa(String.fromCharCode(...new Uint8Array(buffer)))
            .replace(/\//g, "_")
            .replace(/\+/g, "-")
            .replace(/=/g, "");
    }
    generateCodeVerifier(size = 64) {
        const mask = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
        let result = "";
        const randomUints = crypto_1.default.getRandomValues(new Uint8Array(size));
        for (let i = 0; i < size; i++) {
            // cap the value of the randomIndex to mask.length - 1
            const randomIndex = randomUints[i] % mask.length;
            result += mask[randomIndex];
        }
        return result;
    }
    async exchangeAuthorizationCode(code, codeVerifier) {
        const tokenUrl = `${this.baseURL}/auth/oauth/v2/token`;
        const response = await got_1.default
            .post(tokenUrl, {
            agent: {
                ...(this.proxyUrl && {
                    https: new hpagent_1.HttpsProxyAgent({
                        keepAlive: false,
                        proxy: this.proxyUrl,
                    }),
                }),
            },
            rejectUnauthorized: !this.proxyUrl,
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
