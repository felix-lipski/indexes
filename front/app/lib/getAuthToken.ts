import { cookies } from "next/headers";
import { getTokens } from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "@/config";

export async function getServerAuthToken() {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (tokens) {
    return tokens.token;
  }
  return null;
}
