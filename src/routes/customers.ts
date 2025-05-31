import { Router, RequestHandler } from "express";
import { pool } from "../db";
import { CUSTOMER_ERRORS } from "../constants/errors";
import { isPositiveInteger } from "../utils";
import { SQL_INSERT_CUSTOMER } from "../constants/queries";

const router = Router();

export const createCustomer: RequestHandler = async (req, res, next) => {
  const { customer_id, name } = req.body;

  if (!isPositiveInteger(customer_id)) {
    res.status(400).json({ error: CUSTOMER_ERRORS.INVALID_ID });
    return;
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: CUSTOMER_ERRORS.INVALID_NAME });
    return;
  }

  try {
    const result = await pool.query(SQL_INSERT_CUSTOMER, [
      customer_id,
      name.trim(),
    ]);
    res.status(201).json({ customer: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

router.post("/", createCustomer);

export default router;
