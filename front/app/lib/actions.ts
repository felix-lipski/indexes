"use server";

import { auth } from "@/firebase/client";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { cookies } from "next/headers";

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
