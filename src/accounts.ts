import { TatraPremiumApiClient } from "./client";
import { Account, Balance, Transaction } from "./types";

export class AccountsService {
  constructor(private client: TatraPremiumApiClient) {}

  async getAccounts(): Promise<Account[]> {
    const response = await this.client
      .getGotInstance()
      .get("v3/accounts")
      .json<{ accounts: Account[] }>();
    return response.accounts;
  }

  async getAccountDetails(accountId: string): Promise<Account> {
    const response = await this.client
      .getGotInstance()
      .get(`v3/accounts/${accountId}`)
      .json<{ account: Account }>();
    return response.account;
  }

  async getAccountBalances(accountId: string): Promise<Balance[]> {
    const response = await this.client
      .getGotInstance()
      .get(`v3/accounts/${accountId}/balances`)
      .json<{ balances: Balance[] }>();
    return response.balances;
  }

  async getAccountTransactions(
    accountIds: string | string[],
    dateFrom?: string,
    dateTo?: string
  ): Promise<Transaction[]> {
    if (typeof accountIds === "string") {
      accountIds = [accountIds];
    }

    const transactions: Transaction[] = [];

    for (const id of accountIds) {
      const response = await this.client
        .getGotInstance()
        .get(`v5/accounts/${id}/transactions`, {
          searchParams: {
            ...(dateFrom && { dateFrom }),
            ...(dateTo && { dateTo }),
          },
        })
        .json<{ transactions: Transaction[] }>();

      transactions.push(...response.transactions);
    }

    return transactions;
  }
}
