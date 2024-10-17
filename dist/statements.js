"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementsService = void 0;
class StatementsService {
    constructor(client) {
        this.client = client;
    }
    async createStatementTask(accountId, dateFrom, dateTo) {
        return this.client
            .getGotInstance()
            .post(`v1/accounts/${accountId}/statements/tasks`, {
            json: { dateFrom, dateTo },
        })
            .json();
    }
    async getStatementTaskStatus(accountId, taskId) {
        return this.client
            .getGotInstance()
            .get(`v1/accounts/${accountId}/statements/tasks/${taskId}`)
            .json();
    }
    async getStatement(accountId, statementId) {
        return this.client
            .getGotInstance()
            .get(`v1/accounts/${accountId}/statements/${statementId}`)
            .buffer();
    }
}
exports.StatementsService = StatementsService;
