"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementsService = void 0;
class StatementsService {
    constructor(client) {
        this.client = client;
    }
    async createStatementTask(accountId, dateFrom, dateTo) {
        return this.client
            .getKyInstance()
            .post(`v1/accounts/${accountId}/statements/tasks`, {
            json: { dateFrom, dateTo },
        })
            .json();
    }
    async getStatementTaskStatus(accountId, taskId) {
        return this.client
            .getKyInstance()
            .get(`v1/accounts/${accountId}/statements/tasks/${taskId}`)
            .json();
    }
    async getStatement(accountId, statementId) {
        return this.client
            .getKyInstance()
            .get(`v1/accounts/${accountId}/statements/${statementId}`)
            .arrayBuffer();
    }
}
exports.StatementsService = StatementsService;
