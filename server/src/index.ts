import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getTickersHandler } from "./tickers";
import { getCandlesHandler } from "./candles";
import { initDB } from "./db";

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

const injectDB = async () => {
  const db = await initDB();

  app.post("/alerts", async (req, res) => {
    const { userEmail, ticker, triggerPrice, triggerState } = req.body;

    const dbRes = await db.run(
      `
      INSERT INTO alerts (userEmail, ticker, triggerPrice, triggerState, isActive)
      VALUES (?, ?, ?, ?, ?)`,
      [userEmail, ticker, triggerPrice, triggerState, true]
    );

    res.status(201).send("Alert created");
  });

  app.get("/alerts", async (req, res) => {
    const alerts = await db.all("SELECT * FROM alerts");
    res.json(alerts);
  });

  app.delete("/alerts/:id", async (req, res) => {
    const { id } = req.params;

    await db.run("DELETE FROM alerts WHERE id = ?", [id]);
    res.send("Alert deleted");
  });
};

injectDB();

app.listen(port, () => {
  console.log(`Server is up at http://localhost:${port}`);
});
