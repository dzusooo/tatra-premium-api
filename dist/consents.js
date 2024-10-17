"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentsService = void 0;
class ConsentsService {
    constructor(client) {
        this.client = client;
    }
    async createConsent() {
        return this.client.getGotInstance().post("v3/consents").json();
    }
    async getConsentStatus(consentId) {
        const response = await this.client
            .getGotInstance()
            .get(`v3/consents/${consentId}`)
            .json();
        return response.consentStatus;
    }
    async deleteConsent(consentId) {
        await this.client.getGotInstance().delete(`v3/consents/${consentId}`);
    }
}
exports.ConsentsService = ConsentsService;
