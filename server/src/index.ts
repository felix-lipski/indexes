import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getTickersHandler } from "./assets/tickers";
import { initDB } from "./alerts/db";
import { setupCheckAlerts } from "./alerts/job";
import { setupAlertsCrud } from "./alerts/crud";
import { getCandlesHandler } from "./assets/candles";

dotenv.config();
const app = express();
const port = 3001;

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/assets", getTickersHandler);

app.get("/assets/:ticker", getCandlesHandler);

initDB().then((db) => {
  setupAlertsCrud(db, app);
  setupCheckAlerts(db);
});

app.listen(port, () => {
  console.log(`Server is up at http://localhost:${port}`);
});
