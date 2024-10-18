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
  originalTransactionId: string;
  transactionState: string;
  endToEndId: string;
  variableSymbol: string;
  constantSymbol: string;
  specificSymbol: string;
  bookingDate: string;
  valueDate: string;
  transactionAmount: {
    currency: string;
    amount: number;
  };
  creditorName: string;
  creditorAccount: {
    iban: string;
    currency: string;
  };
  creditorAgent: {
    bic: string;
  };
  debtorName: string;
  debtorAccount: {
    iban: string;
    currency: string;
  };
  debtorAgent: {
    bic: string;
  };
  remittanceInformationUnstructured: string;
  additionalInformation: string;
  bankTransactionCode: string;
  cardNumber: string;
  tradingPartyAddress: string;
  tradingPartyIdentification: string;
  tradingPartyMerchantCode: string;
  originalAmount: {
    currency: string;
    amount: number;
  };
  authorizationDate: string;
  cardHolder: string;
  isReversal: boolean;
  paymentReference: string;
  transactionComplete: boolean;
}

export interface Consent {
  consentStatus: string;
  consentId: string;
}

export interface StatementTask {
  taskId: string;
}
