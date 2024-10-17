"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentsService = void 0;
class ConsentsService {
    constructor(client) {
        this.client = client;
    }
    async createConsent(access) {
        return this.client
            .getKyInstance()
            .post("v3/consents", { json: { access } })
            .json();
    }
    async getConsentStatus(consentId) {
        const response = await this.client
            .getKyInstance()
            .get(`v3/consents/${consentId}/status`)
            .json();
        return response.consentStatus;
    }
    async deleteConsent(consentId) {
        await this.client.getKyInstance().delete(`v3/consents/${consentId}`);
    }
}
exports.ConsentsService = ConsentsService;
