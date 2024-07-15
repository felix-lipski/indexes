// import { getTokens } from "next-firebase-auth-edge";
// import { cookies } from "next/headers";
// import { notFound } from "next/navigation";
// import { clientConfig, serverConfig } from "../config";

import Navbar from "./Navbar";

export default async function Home() {
  // const tokens = await getTokens(cookies(), {
  //   apiKey: clientConfig.apiKey,
  //   cookieName: serverConfig.cookieName,
  //   cookieSignatureKeys: serverConfig.cookieSignatureKeys,
  //   serviceAccount: serverConfig.serviceAccount,
  // });

  // if (!tokens) {
  //   notFound();
  // }

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-xl mb-4">...</h1>
      </main>
    </>
  );
}
