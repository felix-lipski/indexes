## Stock indexes browser

For proper configuration `front/.env.local`, `server/.env` and `server/.firebase/` are needed. Please make sure you have supplied these files.

To run the sever:

```bash
cd server
npm i
npm run dev
```

To run the frondend app:

```bash
cd front
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

## Notes

Most of the stock data APIs provide functionality related specifically to Indexes. In the end I have not used any of those since:
1. Most functionality for them was paywalled.
2. Since they are not day traded, they lack data coverage for intraday movements, resulting in very incomplete and ugly candle graphs.
I have instead opted for using ETF data, since ETFs they are a type of an index fund / are derivative of an index fund, but are day traded and easier to access through the APIs.

Still the candle data for ETFs can be spotty and return lacking results, as seen in some graphs.

## Things to improve / add

1. Refine error boundries and error catching.
2. Handle more null cases, right now the app is somewhat optimistic.
3. Set up a proper email service.
4. Deploy the project.
5. Write tests :D
6. Select tickers from list in alert creation.
7. Separate server-doable parts, like crud GETs from client components.
8. Market selection, variable sized graphs, more assets than ETFs, etc.
