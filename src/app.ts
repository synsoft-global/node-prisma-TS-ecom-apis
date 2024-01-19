import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { corsUrl, environment, port } from "./config";
import "./auth"; // initialize database
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import * as swaggerFile from "../swagger-output.json";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

process.on("uncaughtException", (e) => {
  console.error(e);
});

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use("/", routes);

// Middleware Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (environment === "development") {
    console.error(err);
    return res.status(500).send(err.message);
  }
  res.status(500).json({ error: "Internal Server Error" });
});


export default app;
