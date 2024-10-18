"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
class AccountsService {
    constructor(client) {
        this.client = client;
    }
    async getAccounts() {
        const response = await this.client
            .getGotInstance()
            .get("v3/accounts")
            .json();
        return response.accounts;
    }
    async getAccountDetails(accountId) {
        const response = await this.client
            .getGotInstance()
            .get(`v3/accounts/${accountId}`)
            .json();
        return response.account;
    }
    async getAccountBalances(accountId) {
        const response = await this.client
            .getGotInstance()
            .get(`v3/accounts/${accountId}/balances`)
            .json();
        return response.balances;
    }
    async getAccountTransactions(accountIds, dateFrom, dateTo, page = 1, pageSize = 50) {
        if (typeof accountIds === "string") {
            accountIds = [accountIds];
        }
        const transactions = [];
        for (const id of accountIds) {
            const response = await this.client
                .getGotInstance()
                .get(`v5/accounts/${id}/transactions`, {
                searchParams: {
                    ...(dateFrom && { dateFrom }),
                    ...(dateTo && { dateTo }),
                    page,
                    pageSize,
                },
            })
                .json();
            transactions.push(...response.transactions);
        }
        return transactions.sort((a, b) => Date.parse(b.bookingDate) - Date.parse(a.bookingDate));
    }
}
exports.AccountsService = AccountsService;
