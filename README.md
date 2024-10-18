# Tatra Banka Premium API SDK

This **unofficial** SDK provides a way to interact with the Tatra Banka Premium API, offering both client credentials and authorization code grant flows for authentication.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Client Credentials Flow](#client-credentials-flow)
  - [Authorization Code Grant Flow](#authorization-code-grant-flow)
- [API Services](#api-services)
  - [Accounts Service](#accounts-service)
  - [Consents Service](#consents-service)
  - [Statements Service](#statements-service)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install the package using npm:

```bash
npm install tatra-premium-api-sdk
```

## Configuration

To use the SDK, you'll need to create an instance of `TatraPremiumApiClient` with your API credentials:

```typescript
import { TatraPremiumApiClient } from "tatra-premium-api-sdk";

const client = new TatraPremiumApiClient(
  "your-client-id",
  "your-client-secret",
  "https://your-app.com/callback" // only needed for authorization code grant flow,
  true // enable Sandbox mode
);
```

## Usage

### Client Credentials Flow

For server-to-server communication, you can use the client credentials flow:

```typescript
import { TatraPremiumApiClient, AccountsService } from "tatra-premium-api-sdk";

const client = new TatraPremiumApiClient(
  "your-client-id",
  "your-client-secret",
  "https://your-app.com/callback",
  true // enable Sandbox mode
);

const accountsService = new AccountsService(client);

async function getAccounts() {
  try {
    const accounts = await accountsService.getAccounts();
    console.log(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
}

getAccounts();
```

### Authorization Code Grant Flow

For applications acting on behalf of a user, use the authorization code grant flow:

```typescript
import { TatraPremiumApiClient, AccountsService } from "tatra-premium-api-sdk";
import crypto from "crypto";

const client = new TatraPremiumApiClient(
  "your-client-id",
  "your-client-secret",
  "https://your-app.com/callback",
  true // enable Sandbox mode
);

// Generate a code verifier
const codeVerifier = crypto.randomBytes(32).toString("hex");

// Step 1: Get the authorization URL
const state = crypto.randomBytes(16).toString("hex");
const authUrl = client.getAuthorizationUrl(state, codeVerifier);
console.log("Please visit this URL to authorize the app:", authUrl);

// Step 2: After the user authorizes and you receive the code in your redirect URI
const code = "authorization-code-from-redirect";
await client.exchangeAuthorizationCode(code, codeVerifier);

// Now you can use the client to make API calls
const accountsService = new AccountsService(client);
const accounts = await accountsService.getAccounts();
console.log(accounts);
```

## API Services

### Accounts Service

The `AccountsService` provides methods to interact with account-related endpoints:

```typescript
const accountsService = new AccountsService(client);

// Get all accounts
const accounts = await accountsService.getAccounts();

// Get details for a specific account
const accountDetails = await accountsService.getAccountDetails("account-id");

// Get balances for a specific account
const balances = await accountsService.getAccountBalances("account-id");

// Get transactions for a specific account
const transactions = await accountsService.getAccountTransactions(
  "account-id", // or ["account-id-1", "account-id-2"]
  "2023-01-01",
  "2023-12-31"
);
```

### Consents Service

The `ConsentsService` handles consent-related operations:

```typescript
const consentsService = new ConsentsService(client);

// Create a new consent
const consent = await consentsService.createConsent({
  accounts: ["account-id-1", "account-id-2"],
  balances: ["account-id-1"],
  transactions: ["account-id-1"],
});

// Get consent status
const consentStatus = await consentsService.getConsentStatus("consent-id");

// Delete a consent
await consentsService.deleteConsent("consent-id");
```

### Statements Service

The `StatementsService` provides methods for working with account statements:

```typescript
const statementsService = new StatementsService(client);

// Create a statement task
const task = await statementsService.createStatementTask(
  "account-id",
  "2023-01-01",
  "2023-12-31"
);

// Get statement task status
const taskStatus = await statementsService.getStatementTaskStatus(
  "account-id",
  "task-id"
);

// Get a statement
const statement = await statementsService.getStatement(
  "account-id",
  "statement-id"
);
```

## Error Handling

The SDK uses `got` for HTTP requests, which throws errors for non-2xx responses. You should wrap your API calls in try-catch blocks to handle potential errors:

```typescript
try {
  const accounts = await accountsService.getAccounts();
  console.log(accounts);
} catch (error) {
  if (error.name === "HTTPError") {
    console.error("HTTP Error:", error.response.status, error.response.body);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This SDK is released under the MIT License.
