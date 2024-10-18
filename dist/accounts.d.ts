import { TatraPremiumApiClient } from "./client";
import { Account, Balance, Transaction } from "./types";
export declare class AccountsService {
    private client;
    constructor(client: TatraPremiumApiClient);
    getAccounts(): Promise<Account[]>;
    getAccountDetails(accountId: string): Promise<Account>;
    getAccountBalances(accountId: string): Promise<Balance[]>;
    getAccountTransactions(accountIds: string | string[], dateFrom?: string, dateTo?: string, page?: number, pageSize?: number): Promise<Transaction[]>;
}
