import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swaggerConfig";
import tenantsRouter from "./routes/tenants";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/tenants", tenantsRouter);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  res.status(status).json({ message: err.message ?? "Internal server error" });
});

export default app;
