import got from "got";
export declare class TatraPremiumApiClient {
    private gotInstance;
    private baseURL;
    private clientId;
    private clientSecret;
    private redirectUri;
    private accessToken;
    private refreshToken;
    private tokenExpiresAt;
    constructor(clientId: string, clientSecret: string, redirectUri: string, useSandbox?: boolean);
    private ensureValidToken;
    private getClientCredentialsToken;
    private refreshAccessToken;
    getAuthorizationUrl(state: string, codeVerifier: string): string;
    private generateCodeChallenge;
    exchangeAuthorizationCode(code: string, codeVerifier: string): Promise<void>;
    getGotInstance(): typeof got;
}
