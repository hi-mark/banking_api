import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import accountsRouter from "./routes/accounts";
import transfersRouter from "./routes/transfers";
import customerRouter from "./routes/customers";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/accounts", accountsRouter);
app.use("/transfers", transfersRouter);
app.use("/customer", customerRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
