import { Express } from "express";
import { Database } from "sqlite";

export const setupAlertsCrud = (db: Database, app: Express) => {
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

  app.get("/alerts", async (_, res) => {
    const alerts = await db.all("SELECT * FROM alerts");
    res.json(alerts);
  });

  app.put("/alerts/:id", async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    await db.run("UPDATE alerts SET isActive = ? WHERE id = ?", [isActive, id]);
    res.send("Alert updated");
  });

  app.delete("/alerts/:id", async (req, res) => {
    const { id } = req.params;

    await db.run("DELETE FROM alerts WHERE id = ?", [id]);
    res.send("Alert deleted");
  });
};
