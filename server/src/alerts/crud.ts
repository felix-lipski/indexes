import { Express, Request, Response } from "express";
import { Database } from "sqlite";

export const setupAlertsCrud = (db: Database, app: Express) => {
  app.post("/alerts", async (req, res) => {
    const email = req.user?.email;
    const { ticker, triggerPrice, triggerState } = req.body;

    const dbRes = await db.run(
      `
      INSERT INTO alerts (userEmail, ticker, triggerPrice, triggerState, isActive)
      VALUES (?, ?, ?, ?, ?)`,
      [email, ticker, triggerPrice, triggerState, true]
    );

    res.status(201).send("Alert created");
  });

  app.get("/alerts", async (req: Request, res: Response) => {
    const email = req.user?.email;
    try {
      const alerts = await db.all("SELECT * FROM alerts WHERE userEmail = ?", [
        email,
      ]);
      res.json(alerts);
    } catch (error) {
      console.error("Error querying alerts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.put("/alerts/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;
    const email = req.user?.email;

    try {
      const result = await db.run(
        "UPDATE alerts SET isActive = ? WHERE id = ? AND userEmail = ?",
        [isActive, id, email]
      );

      if (result.changes === 0)
        return res.status(404).json({
          error:
            "Alert not found or you do not have permission to update this alert",
        });

      res.send("Alert updated");
    } catch (error) {
      console.error("Error updating alert:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.delete("/alerts/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const email = req.user?.email;

    try {
      const result = await db.run(
        "DELETE FROM alerts WHERE id = ? AND userEmail = ?",
        [id, email]
      );

      if (result.changes === 0)
        return res.status(404).json({
          error:
            "Alert not found or you do not have permission to delete this alert",
        });

      res.send("Alert deleted");
    } catch (error) {
      console.error("Error deleting alert:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
