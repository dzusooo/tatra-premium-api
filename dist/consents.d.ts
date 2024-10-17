import { TatraPremiumApiClient } from "./client";
import { Consent } from "./types";
export declare class ConsentsService {
    private client;
    constructor(client: TatraPremiumApiClient);
    createConsent(): Promise<Consent>;
    getConsentStatus(consentId: string): Promise<string>;
    deleteConsent(consentId: string): Promise<void>;
}
