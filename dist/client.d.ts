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
    constructor(clientId: string, clientSecret: string, redirectUri: string, useSandbox?: boolean, proxyUrl?: string);
    private ensureValidToken;
    private getClientCredentialsToken;
    private refreshAccessToken;
    getAuthorizationUrl(state: string, codeVerifier: string, consentId?: string): Promise<string>;
    private generateCodeChallenge;
    generateCodeVerifier(size?: number): string;
    exchangeAuthorizationCode(code: string, codeVerifier: string, consentId?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenExpiresAt: Date;
    }>;
    getGotInstance(): typeof got;
    setAccessToken(accessToken: string, expiresAt: Date): void;
    setRefreshToken(refreshToken: string): void;
}
