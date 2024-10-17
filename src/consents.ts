import { TatraPremiumApiClient } from "./client";
import { Consent } from "./types";

export class ConsentsService {
  constructor(private client: TatraPremiumApiClient) {}

  async createConsent(access: {
    accounts: string[];
    balances: string[];
    transactions: string[];
  }): Promise<Consent> {
    return this.client
      .getKyInstance()
      .post("v3/consents", { json: { access } })
      .json<Consent>();
  }

  async getConsentStatus(consentId: string): Promise<string> {
    const response = await this.client
      .getKyInstance()
      .get(`v3/consents/${consentId}/status`)
      .json<{ consentStatus: string }>();
    return response.consentStatus;
  }

  async deleteConsent(consentId: string): Promise<void> {
    await this.client.getKyInstance().delete(`v3/consents/${consentId}`);
  }
}
