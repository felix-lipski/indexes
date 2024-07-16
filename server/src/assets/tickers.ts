import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { ITickers, restClient } from "@polygon.io/client-js";

dotenv.config();
export const router = express.Router();

const polygonClient = restClient(process.env.POLYGON_API_KEY);

// Quick and dirty cache to circumvent the Polygon 5 API calls / minute limitation.
const tickersCache: { saved: ITickers | null } = { saved: null };

const getTickers = () => polygonClient.reference.tickers({ type: "ETF" });

export const getTickersHandler = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
};
