import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

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

export const getCandlesHandler = async (
  req: Request<{ ticker: string }>,
  res: Response,
  next: NextFunction
) => {
  const ticker = req.params.ticker;

  const today = new Date();

  try {
    const candles = await getCandles(ticker, today);
    // const candles = candleMockCountback40 as MarketDataCandlesResponse;

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

    const mostRecentDate = new Date(0);
    mostRecentDate.setUTCSeconds(Math.max.apply(null, candles.t));

    const latestMarketOpeningDateIndex = transposed.findIndex(({ x }) => {
      const date = new Date(0);
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
};
