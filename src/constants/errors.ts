export const ACCOUNT_ERRORS = {
  INVALID_CUSTOMER_ID: "customer_id must be a positive integer",
  INVALID_DEPOSIT:
    "initial_deposit must be a non-negative number with up to two decimals",
  CUSTOMER_NOT_FOUND: "Customer not found",
  INVALID_ACCOUNT_ID: "Invalid account ID",
  ACCOUNT_NOT_FOUND: "Account not found",
  TRANSFER_IDS_INVALID: "Account IDs must be positive integers",
  TRANSFER_SAME_ACCOUNT: "from_account_id and to_account_id must differ",
  INSUFFICIENT_FUNDS: "Insufficient funds in source account",
  SOURCE_NOT_FOUND: "Source account not found",
  DESTINATION_NOT_FOUND: "Destination account not found",
  INVALID_AMOUNT: "amount must be a positive number with up to two decimals",
};

export const CUSTOMER_ERRORS = {
  INVALID_ID: ACCOUNT_ERRORS.INVALID_CUSTOMER_ID,
  INVALID_NAME: "name must be a non-empty string",
};
