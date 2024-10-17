import { TatraPremiumApiClient } from "./client";
import { StatementTask } from "./types";

export class StatementsService {
  constructor(private client: TatraPremiumApiClient) {}

  async createStatementTask(
    accountId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<StatementTask> {
    return this.client
      .getGotInstance()
      .post(`v1/accounts/${accountId}/statements/tasks`, {
        json: { dateFrom, dateTo },
      })
      .json<StatementTask>();
  }

  async getStatementTaskStatus(
    accountId: string,
    taskId: string
  ): Promise<any> {
    return this.client
      .getGotInstance()
      .get(`v1/accounts/${accountId}/statements/tasks/${taskId}`)
      .json();
  }

  async getStatement(
    accountId: string,
    statementId: string
  ): Promise<ArrayBuffer> {
    return this.client
      .getGotInstance()
      .get(`v1/accounts/${accountId}/statements/${statementId}`)
      .buffer();
  }
}
