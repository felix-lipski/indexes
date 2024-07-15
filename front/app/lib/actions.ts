"use server";

import { auth } from "@/firebase/client";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { cookies } from "next/headers";
import { backendUrl } from "./backend";

export async function authenticate(
  _state: any,
  {
    formData,
    authAction,
  }: { formData: FormData; authAction: "login" | "register" }
) {
  try {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email) throw new Error("Email not provided!");
    if (!password) throw new Error("Password not provided!");

    if (authAction === "login") {
      const response = await signInWithEmailAndPassword(auth, email, password);
      cookies().set("user", JSON.stringify(response.user));
      // return response;
    } else if (authAction === "register") {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      cookies().set("user", JSON.stringify(response.user));
      // return response;
    }
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.log(error.code);
      switch (error.code) {
        case "auth/invalid-credential":
          return "Invalid email or password.";
        case "auth/too-many-requests":
          return "Too many login attempts. Wait a while.";
        default:
          console.log(error.message);
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function addAlert(formData: FormData) {
  console.log(formData.get("ticker"));
  const res = await fetch(`${backendUrl}/alerts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userEmail: "a@b.c",
      ticker: "ABC",
      triggerPrice: 100,
      triggerState: "above",
    }),
  });
  const x = await res.text();
  console.log(x);
}
