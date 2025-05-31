import { Router, RequestHandler } from "express";
import { pool } from "../db";
import { isPositiveInteger, isNonNegativeAmount } from "../utils";
import { ACCOUNT_ERRORS } from "../constants/errors";
import {
  SQL_CHECK_CUSTOMER_EXISTS,
  SQL_GET_ACCOUNT_BALANCE,
  SQL_INSERT_ACCOUNT,
} from "../constants/queries";

const router = Router();

// POST /accounts
export const createAccount: RequestHandler = async (req, res, next) => {
  const { customer_id, initial_deposit } = req.body;

  if (!isPositiveInteger(customer_id)) {
    res.status(400).json({ error: ACCOUNT_ERRORS.INVALID_CUSTOMER_ID });
    return;
  }
  if (!isNonNegativeAmount(initial_deposit)) {
    res.status(400).json({ error: ACCOUNT_ERRORS.INVALID_DEPOSIT });
    return;
  }

  try {
    const custCheck = await pool.query(SQL_CHECK_CUSTOMER_EXISTS, [
      customer_id,
    ]);
    if (custCheck.rowCount === 0) {
      res.status(404).json({ error: ACCOUNT_ERRORS.CUSTOMER_NOT_FOUND });
      return;
    }

    const result = await pool.query(SQL_INSERT_ACCOUNT, [
      customer_id,
      initial_deposit,
    ]);

    res.status(201).json({ account: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET /accounts/:id/balance
export const getBalance: RequestHandler = async (req, res, next) => {
  const accountId = parseInt(req.params.id, 10);

  if (!isPositiveInteger(accountId)) {
    res.status(400).json({ error: ACCOUNT_ERRORS.INVALID_ACCOUNT_ID });
    return;
  }

  try {
    const balanceRes = await pool.query(SQL_GET_ACCOUNT_BALANCE, [accountId]);
    if (balanceRes.rows.length === 0) {
      res.status(404).json({ error: ACCOUNT_ERRORS.ACCOUNT_NOT_FOUND });
      return;
    }

    res.json({
      account_id: accountId,
      balance: parseFloat((balanceRes.rows[0] as any).balance),
    });
  } catch (err) {
    next(err);
  }
};

router.post("/", createAccount);
router.get("/:id/balance", getBalance);

export default router;
