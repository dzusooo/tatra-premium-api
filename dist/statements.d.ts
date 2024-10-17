import { TatraPremiumApiClient } from "./client";
import { StatementTask } from "./types";
export declare class StatementsService {
    private client;
    constructor(client: TatraPremiumApiClient);
    createStatementTask(accountId: string, dateFrom: string, dateTo: string): Promise<StatementTask>;
    getStatementTaskStatus(accountId: string, taskId: string): Promise<any>;
    getStatement(accountId: string, statementId: string): Promise<ArrayBuffer>;
}
