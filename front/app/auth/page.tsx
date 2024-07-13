"use client";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "../lib/actions";
import { useState } from "react";

export default function Page() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const { pending } = useFormStatus();
  const [authAction, setAuthAction] = useState<"login" | "register">("login");

  return (
    <div className="min-h-full flex flex-1 flex-row justify-center">
      <div className="max-w-sm rounded overflow-hidden shadow-lg flex flex-col gap-4 p-10 bg-white">
        <form
          className="max-w-sm flex flex-col gap-4"
          action={(formData) => dispatch({ formData, authAction })}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="border"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="border"
          />
          <button
            aria-disabled={pending}
            type="submit"
            onClick={(event) => pending && event.preventDefault()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm"
          >
            {authAction === "login" ? "Login" : "Register"}
          </button>
          <div>
            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        </form>
        {authAction === "login" ? (
          <button
            className="text-sm text-blue-500"
            onClick={() => setAuthAction("register")}
          >
            Don't have an account? Click here to register!
          </button>
        ) : (
          <button
            className="text-sm text-blue-500"
            onClick={() => setAuthAction("login")}
          >
            Already registered? Click here to login!
          </button>
        )}
      </div>
    </div>
  );
}
