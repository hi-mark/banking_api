// Accounts
export const SQL_CHECK_CUSTOMER_EXISTS = `
  SELECT id
    FROM customers
   WHERE id = $1
`;

export const SQL_INSERT_ACCOUNT = `
  INSERT INTO accounts (customer_id, balance)
  VALUES ($1, $2)
  RETURNING id, customer_id, balance
`;

export const SQL_GET_ACCOUNT_BALANCE = `
  SELECT balance
    FROM accounts
   WHERE id = $1
`;

// Transfers
export const SQL_UPDATE_ACCOUNT_BALANCE_DEBIT = `
  UPDATE accounts
     SET balance = balance - $1
   WHERE id = $2
`;

export const SQL_UPDATE_ACCOUNT_BALANCE_CREDIT = `
  UPDATE accounts
     SET balance = balance + $1
   WHERE id = $2
`;

export const SQL_INSERT_TRANSFER = `
  INSERT INTO transfers (from_account_id, to_account_id, amount)
  VALUES ($1, $2, $3)
  RETURNING id, from_account_id, to_account_id, amount, created_at
`;

export const SQL_GET_TRANSFER_HISTORY = `
  SELECT id, from_account_id, to_account_id, amount, created_at
    FROM transfers
   WHERE from_account_id = $1
      OR to_account_id   = $1
   ORDER BY created_at DESC
`;

// Customers
export const SQL_INSERT_CUSTOMER = `
  INSERT INTO customers (id, name)
  VALUES ($1, $2)
  RETURNING id, name
`;
