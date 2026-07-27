import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";
import { officesRouter } from "./routes/offices.js";
import { staffRouter } from "./routes/staff.js";
import { propertiesRouter } from "./routes/properties.js";
import { suburbsRouter } from "./routes/suburbs.js";
import { lookupsRouter } from "./routes/lookups.js";
import { leadsRouter } from "./routes/leads.js";
import { errorHandler, notFound } from "./middleware/errors.js";

const PORT = Number(process.env.PORT ?? 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? [
  "http://localhost:3000",
];

const app = express();

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ name: "blue-ribbon-api", ok: true });
});

app.use("/health", healthRouter);
app.use("/offices", officesRouter);
app.use("/staff", staffRouter);
app.use("/properties", propertiesRouter);
app.use("/suburbs", suburbsRouter);
app.use("/lookups", lookupsRouter);
app.use("/leads", leadsRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
