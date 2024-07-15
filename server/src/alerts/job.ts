import cron from "node-cron";
import { Database } from "sqlite";

type MarketDataQuoteResponse =
  | {
      s: "ok";
      symbol: [string];
      ask: [number];
      askSize: [number];
      bid: [number];
      bidSize: [number];
      mid: [number];
      last: [number];
      volume: [number];
      updated: [number];
    }
  | { s: "no_data" }
  | { s: "error"; errmsg: string };

const getQuote = async (ticker: string): Promise<MarketDataQuoteResponse> => {
  const res = await fetch(
    `https://api.marketdata.app/v1/stocks/quotes/${ticker}/?token=${process.env.MARKET_DATA_API_KEY}`
  );
  return res.json();
};

export const setupCheckAlerts = (db: Database) => {
  const checkAlerts = async () => {
    console.info(new Date(), "Running checkAlerts job!");

    const dbConnection = await db;
    const alerts = await dbConnection.all(
      "SELECT * FROM alerts WHERE isActive = 1"
    );

    for (const alert of alerts) {
      const res = await getQuote(alert.ticker);
      if (res.s === "ok") {
        const latestPrice = res.last[0];
        const { triggerPrice, triggerState, id, isActive } = alert;

        const above = triggerState === "above" && latestPrice > triggerPrice;
        const below = triggerState === "below" && latestPrice < triggerPrice;

        if (isActive && (above || below)) {
          db.run("UPDATE alerts SET isActive = ? WHERE id = ?", [false, id]);

          if (above) {
            console.log(
              `Alert! ${alert.userEmail}, ${alert.ticker} has surpasssed ${latestPrice}$`
            );
            // EMAIL API CALL GOES HERE
          } else if (below) {
            console.log(
              `Alert! ${alert.userEmail}, ${alert.ticker} has fallen below ${latestPrice}$`
            );
            // EMAIL API CALL GOES HERE
          }
        }
      }
    }
  };

  cron.schedule("* * * * *", checkAlerts);

  checkAlerts();
};

// // Schedule job to run every minute
// cron.schedule("* * * * *", checkAlerts);

// // Run immediately on startup
// checkAlerts();
