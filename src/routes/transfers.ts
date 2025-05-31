import { Router, RequestHandler } from "express";
import { pool } from "../db";
import { isPositiveInteger, isPositiveAmount } from "../utils";
import { ACCOUNT_ERRORS } from "../constants/errors";
import {
  SQL_GET_TRANSFER_HISTORY,
  SQL_INSERT_TRANSFER,
  SQL_UPDATE_ACCOUNT_BALANCE_CREDIT,
  SQL_UPDATE_ACCOUNT_BALANCE_DEBIT,
} from "../constants/queries";

const router = Router();

// POST /transfers
export const transferFunds: RequestHandler = async (req, res, next) => {
  const { from_account_id, to_account_id, amount } = req.body;

  if (
    !isPositiveInteger(from_account_id) ||
    !isPositiveInteger(to_account_id)
  ) {
    res.status(400).json({ error: ACCOUNT_ERRORS.TRANSFER_IDS_INVALID });
    return;
  }

  if (from_account_id === to_account_id) {
    res.status(400).json({ error: ACCOUNT_ERRORS.TRANSFER_SAME_ACCOUNT });
    return;
  }

  if (!isPositiveAmount(amount)) {
    res.status(400).json({
      error: ACCOUNT_ERRORS.INVALID_AMOUNT,
    });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // LOCK and check source balance
    const { rows: srcRows } = await client.query(
      "SELECT balance FROM accounts WHERE id = $1 FOR UPDATE",
      [from_account_id]
    );
    if (srcRows.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({ error: ACCOUNT_ERRORS.SOURCE_NOT_FOUND });
      return;
    }
    const srcBalance = parseFloat(srcRows[0].balance);
    if (srcBalance < amount) {
      await client.query("ROLLBACK");
      res.status(400).json({ error: ACCOUNT_ERRORS.INSUFFICIENT_FUNDS });
      return;
    }

    // LOCK and check destination
    const { rows: destRows } = await client.query(
      "SELECT balance FROM accounts WHERE id = $1 FOR UPDATE",
      [to_account_id]
    );
    if (destRows.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({ error: ACCOUNT_ERRORS.DESTINATION_NOT_FOUND });
      return;
    }

    // Perform updates
    await client.query(SQL_UPDATE_ACCOUNT_BALANCE_DEBIT, [
      amount,
      from_account_id,
    ]);
    await client.query(SQL_UPDATE_ACCOUNT_BALANCE_CREDIT, [
      amount,
      to_account_id,
    ]);

    // Record transfer
    const transferRes = await client.query(SQL_INSERT_TRANSFER, [
      from_account_id,
      to_account_id,
      amount,
    ]);

    await client.query("COMMIT");
    res.status(201).json({ transfer: transferRes.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

// GET /accounts/:id/history
export const getHistory: RequestHandler = async (req, res, next) => {
  const accountId = parseInt(req.params.id, 10);

  if (!isPositiveInteger(accountId)) {
    res.status(400).json({ error: ACCOUNT_ERRORS.INVALID_ACCOUNT_ID });
    return;
  }

  try {
    const { rows } = await pool.query(SQL_GET_TRANSFER_HISTORY, [accountId]);
    res.json({ account_id: accountId, history: rows });
  } catch (err) {
    next(err);
  }
};

router.post("/", transferFunds);
router.get("/accounts/:id/history", getHistory);

export default router;
