import express, { Response, NextFunction, Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getTickersHandler } from "./assets/tickers";
import { initDB } from "./alerts/db";
import { setupCheckAlertsJob } from "./alerts/job";
import { setupAlertsCrud } from "./alerts/crud";
import { getCandlesHandler } from "./assets/candles";
import * as admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

dotenv.config();
const app = express();
const port = 3001;

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(express.json());
app.use(cors(corsOptions));

admin.initializeApp({ credential: admin.credential.applicationDefault() });

const decodeToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
};

app.use(decodeToken);

app.get("/assets", getTickersHandler);

app.get("/assets/:ticker", getCandlesHandler);

initDB().then((db) => {
  setupAlertsCrud(db, app);
  setupCheckAlertsJob(db);
});

app.listen(port, () => {
  console.log(`Server is up at http://localhost:${port}`);
});
