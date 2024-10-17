export interface Account {
    cashAccountType: string;
    bankCode: string;
    product: string;
    accountReference: {
        iban: string;
        currency: string;
    };
    displayName: string;
    usage: "PRIV" | "ORGA";
    bankName: string;
    consentExpirationDate: string;
    dateUpdated: string;
    accountId: string;
    balances: Balance[];
    name: string;
    bic: string;
    status: "enabled" | "deleted" | "blocked";
}
export interface Balance {
    balanceAmount: {
        currency: string;
        amount: number;
    };
    balanceType: string;
    referenceDate?: string;
}
export interface Transaction {
    transactionId: string;
    bookingDate: string;
    valueDate: string;
    transactionAmount: {
        currency: string;
        amount: number;
    };
    creditorName: string;
    debtorName: string;
    remittanceInformationUnstructured: string;
}
export interface Consent {
    consentStatus: string;
    consentId: string;
}
export interface StatementTask {
    taskId: string;
}
