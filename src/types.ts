export interface Account {
  accountId: string;
  iban: string;
  currency: string;
  ownerName: string;
  name: string;
  product: string;
  cashAccountType: string;
  status: "enabled" | "deleted" | "blocked";
  bic: string;
  usage: "PRIV" | "ORGA";
  balances: Balance[];
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
