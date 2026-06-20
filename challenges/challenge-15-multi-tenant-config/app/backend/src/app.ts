import express, { type NextFunction, type Request, type Response } from "express";
import { ErrorCode, ErrorMessage } from "@mtc/shared";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swaggerConfig";
import tenantsRouter from "./routes/tenants";
import versionsRouter from "./routes/versions";
import processClaimRouter from "./routes/processClaim";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/tenants", tenantsRouter);
app.use("/tenants", versionsRouter);
app.use("/tenants", processClaimRouter);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  res.status(status).json({ error: { code: err.code ?? ErrorCode.INTERNAL_ERROR, message: err.message ?? ErrorMessage.INTERNAL_ERROR } });
});

export default app;
