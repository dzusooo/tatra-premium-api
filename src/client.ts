import got from "got";
import { createHash, randomUUID } from "crypto";

export class TatraPremiumApiClient {
  private gotInstance: typeof got;
  private baseURL: string;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    useSandbox = false
  ) {
    this.baseURL = useSandbox
      ? "https://api.tatrabanka.sk/premium/sandbox"
      : "https://api.tatrabanka.sk/premium/production";

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;

    this.gotInstance = got.extend({
      prefixUrl: this.baseURL,
      hooks: {
        beforeRequest: [
          async (request) => {
            await this.ensureValidToken();

            request.headers["x-request-id"] = randomUUID();
            request.headers["Authorization"] = `Bearer ${this.accessToken}`;
          },
        ],
      },
    });
  }

  private async ensureValidToken() {
    if (
      !this.accessToken ||
      !this.tokenExpiresAt ||
      Date.now() >= this.tokenExpiresAt
    ) {
      if (this.refreshToken) {
        await this.refreshAccessToken();
      } else {
        await this.getClientCredentialsToken();
      }
    }
  }

  private async getClientCredentialsToken() {
    const tokenUrl = `${this.baseURL}/auth/oauth/v2/token`;
    const response = await got
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
      .json<{
        access_token: string;
        expires_in: number;
      }>();

    this.accessToken = response.access_token;
    this.tokenExpiresAt = Date.now() + response.expires_in * 1000;
  }

  private async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    const tokenUrl = `${this.baseURL}/auth/oauth/v2/token`;
    const response = await got
      .post(tokenUrl, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString("base64")}`,
        },
        form: {
          grant_type: "refresh_token",
          refresh_token: this.refreshToken,
        },
      })
      .json<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
      }>();

    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;
    this.tokenExpiresAt = Date.now() + response.expires_in * 1000;
  }

  public getAuthorizationUrl(
    state: string,
    codeVerifier: string,
    consentId?: string
  ): string {
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

  private generateCodeChallenge(codeVerifier: string): string {
    const hash = createHash("sha256").update(codeVerifier).digest();
    return hash
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  public async exchangeAuthorizationCode(
    code: string,
    codeVerifier: string,
    consentId?: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    tokenExpiresAt: Date;
  }> {
    const tokenUrl = `${this.baseURL}/auth/oauth/v2/token`;
    const response = await got
      .post(tokenUrl, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString("base64")}`,
        },
        form: {
          code: code,
          grant_type: "authorization_code",
          redirect_uri: this.redirectUri,
          scope: consentId ? `PREMIUM_AIS:${consentId}` : "PREMIUM_AIS",
          code_verifier: codeVerifier,
        },
      })
      .json<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
      }>();

    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;
    this.tokenExpiresAt = Date.now() + response.expires_in * 1000;

    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      tokenExpiresAt: new Date(this.tokenExpiresAt),
    };
  }

  public getGotInstance(): typeof got {
    return this.gotInstance;
  }

  public setAccessToken(accessToken: string, expiresAt: Date) {
    this.accessToken = accessToken;
    this.tokenExpiresAt = expiresAt.getTime();
  }

  public setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }
}
