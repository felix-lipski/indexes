"use client";

import { addAlert } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get("ticker");

  return (
    <div className="min-h-full flex flex-1 flex-row justify-center">
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg flex flex-col gap-2 p-4 bg-white">
        <form action={addAlert} className="max-w-sm flex flex-col gap-2">
          <label htmlFor="ticker" className="block text-sm font-medium">
            Ticker:
          </label>
          <input
            type="text"
            name="ticker"
            className={
              !!ticker
                ? "bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed"
                : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            }
            defaultValue={ticker || ""}
            disabled={!!ticker}
          />
          <label htmlFor="triggerState" className="block text-sm font-medium">
            Trigger state:
          </label>
          <select
            name="triggerState"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            defaultValue={"below"}
          >
            <option value="above">Above price</option>
            <option value="below">Below price</option>
          </select>
          <label htmlFor="triggerPrice" className="block text-sm font-medium">
            Trigger price:
          </label>
          <input
            type="number"
            name="triggerPrice"
            aria-describedby="helper-text-explanation"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            defaultValue={searchParams.get("defaultPrice") || 0}
            required
          />
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
          >
            Add alert
          </button>
        </form>
      </div>
    </div>
  );
}
