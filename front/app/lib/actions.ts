"use server";
import { cookies } from "next/headers";
import { backendUrl } from "./backend";
import { getTokens } from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "@/config";
import { redirect } from "next/navigation";

export async function addAlert(formData: FormData) {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  // TODO: handle no email
  const email = tokens?.decodedToken.email;

  await fetch(`${backendUrl}/alerts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userEmail: email,
      ticker: formData.get("ticker"),
      triggerPrice: formData.get("triggerPrice"),
      triggerState: formData.get("triggerState"),
    }),
  });

  redirect("/alerts");
}
