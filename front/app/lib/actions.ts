"use server";
import { backendUrl } from "./backend";
import { redirect } from "next/navigation";
import { getServerAuthToken } from "./getAuthToken";

export async function addAlert(formData: FormData) {
  const token = await getServerAuthToken();

  await fetch(`${backendUrl}/alerts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ticker: formData.get("ticker"),
      triggerPrice: formData.get("triggerPrice"),
      triggerState: formData.get("triggerState"),
    }),
  });

  redirect("/alerts");
}
