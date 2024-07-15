## Stock indexes browser

For proper configuration `front/.env.local` and `server/.env` are needed. Please make sure you have supplied these files.

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

## Things to improve

1. Authenticate backend requests using Firebase Admin SDK.
2. Refine error boundries and error catching.
3. Handle more null cases, right now the app is very optimistic.
4. Set up a proper email service.
5. Deploy the project.
6. Write tests :D
