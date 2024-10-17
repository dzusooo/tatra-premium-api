import { TatraPremiumApiClient } from "./client";
import { Consent } from "./types";

export class ConsentsService {
  constructor(private client: TatraPremiumApiClient) {}

  async createConsent(): Promise<Consent> {
    return this.client.getGotInstance().post("v3/consents").json<Consent>();
  }

  async getConsentStatus(consentId: string): Promise<string> {
    const response = await this.client
      .getGotInstance()
      .get(`v3/consents/${consentId}`)
      .json<{ consentStatus: string }>();
    return response.consentStatus;
  }

  async deleteConsent(consentId: string): Promise<void> {
    await this.client.getGotInstance().delete(`v3/consents/${consentId}`);
  }
}
