import express from "express";
import { candleMockCountback40, etfXNYSTickersMock } from "./mocks";
import dotenv from "dotenv";
import { ITickers, restClient } from "@polygon.io/client-js";

dotenv.config();
export const router = express.Router();

const polygonClient = restClient(process.env.POLYGON_API_KEY);

// GET ALL ETF TICKERS

// Quick and dirty tickers cache to circumvent the Polygon 5 API calls / minute limitation.
const tickersCache: { saved: ITickers | null } = { saved: null };

const getTickers = () => polygonClient.reference.tickers({ type: "ETF" });

router.get("/indices", async (req, res, next) => {
  try {
    // const tickers = etfXNYSTickersMock;
    const tickers = tickersCache.saved || (await getTickers());

    if (tickers.status !== "OK") {
      console.error(`Error fetching tickers.`);
      res.status(500).json({
        status: "error",
        message: "Internal server error while fetching tickers.",
      });
      return;
    }

    tickersCache.saved = tickers;

    res.json(tickers);
  } catch (error) {
    next(error);
  }
});

// GET CANDLES FOR SPECIFIC TICKER

type MarketDataCandlesResponse =
  | {
      s: "ok";
      t: number[];
      o: number[];
      h: number[];
      l: number[];
      c: number[];
    }
  | { s: "no_data"; nextTime: number }
  | { s: "error"; errmsg: string };

const getCandles = async (
  ticker: string,
  to: Date,
  nPoints: number = 50,
  interval: "15" | "30" | "houly" = "15"
): Promise<MarketDataCandlesResponse> => {
  const res = await fetch(
    `https://api.marketdata.app/v1/stocks/candles/${interval}/${ticker}/?token=${
      process.env.MARKET_DATA_API_KEY
    }&to=${to.toISOString()}&countback=${nPoints}`
  );
  return res.json();
};

router.get("/indices/:ticker", async (req, res, next) => {
  const ticker = req.params.ticker;

  const today = new Date();

  try {
    // const candles = await getCandles(ticker, today);
    const candles = candleMockCountback40 as MarketDataCandlesResponse;

    if (candles.s === "error") {
      console.error(`Error fetching candles for ${ticker}: ${candles.errmsg}`);
      res.status(500).json({
        status: "error",
        message: "Internal server error while fetching candle data.",
      });
      return;
    } else if (candles.s === "no_data") {
      res.status(404).json({
        status: "no_data",
        message: `No data available for ticker ${ticker}.`,
      });
      return;
    }

    const transposed = candles.t.map((t, i) => ({
      x: t,
      y: [candles.o[i], candles.h[i], candles.l[i], candles.c[i]],
    }));

    // Sanitize the data to include only the candles from one day.
    // This way we avoid having large gaps in the graph.

    const mostRecentDate = new Date();
    mostRecentDate.setUTCSeconds(Math.max.apply(null, candles.t));

    const latestMarketOpeningDateIndex = transposed.findIndex(({ x }) => {
      const date = new Date();
      date.setUTCSeconds(x);
      return (
        date.getFullYear() === mostRecentDate.getFullYear() &&
        date.getMonth() === mostRecentDate.getMonth() &&
        date.getDate() === mostRecentDate.getDate()
      );
    });

    const sanitized = transposed.slice(latestMarketOpeningDateIndex);

    res.json({ status: "ok", data: sanitized });
  } catch (error) {
    next(error);
  }
});
