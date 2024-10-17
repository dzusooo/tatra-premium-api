import ky from "ky";
export declare class TatraPremiumApiClient {
    private kyInstance;
    private baseURL;
    private clientId;
    private clientSecret;
    private redirectUri;
    private accessToken;
    private refreshToken;
    private tokenExpiresAt;
    constructor(baseURL: string, clientId: string, clientSecret: string, redirectUri: string);
    private ensureValidToken;
    private getClientCredentialsToken;
    private refreshAccessToken;
    getAuthorizationUrl(state: string, codeVerifier: string): string;
    private generateCodeChallenge;
    exchangeAuthorizationCode(code: string, codeVerifier: string): Promise<void>;
    getKyInstance(): typeof ky;
}
