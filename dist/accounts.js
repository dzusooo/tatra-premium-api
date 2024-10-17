"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
class AccountsService {
    constructor(client) {
        this.client = client;
    }
    async getAccounts() {
        const response = await this.client
            .getKyInstance()
            .get("v3/accounts")
            .json();
        return response.accounts;
    }
    async getAccountDetails(accountId) {
        const response = await this.client
            .getKyInstance()
            .get(`v3/accounts/${accountId}`)
            .json();
        return response.account;
    }
    async getAccountBalances(accountId) {
        const response = await this.client
            .getKyInstance()
            .get(`v3/accounts/${accountId}/balances`)
            .json();
        return response.balances;
    }
    async getAccountTransactions(accountId, dateFrom, dateTo) {
        const response = await this.client
            .getKyInstance()
            .get(`v5/accounts/${accountId}/transactions`, {
            searchParams: {
                ...(dateFrom && { dateFrom }),
                ...(dateTo && { dateTo }),
            },
        })
            .json();
        return response.transactions;
    }
}
exports.AccountsService = AccountsService;
