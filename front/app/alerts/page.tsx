"use client";
import useSWR from "swr";
import { backendUrl } from "../lib/backend";
import Navbar from "../Navbar";
import { LoadingPage } from "../LoadingPage";
import { notFound } from "next/navigation";

type Alert = {
  id: number;
  userEmail: string;
  ticker: string;
  triggerPrice: number;
  triggerState: "above" | "below";
  isActive: boolean;
};

type AlertsResult = Alert[];

async function deleteAlert(id: number) {
  const res = await fetch(`${backendUrl}/alerts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete alert ${id}`);
}

async function setAlertActivation(id: number, isActive: boolean) {
  const res = await fetch(`${backendUrl}/alerts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isActive }),
  });

  if (!res.ok) throw new Error(`Failed to update alert ${id}`);
}

export default function Page() {
  const {
    data: alerts,
    error,
    isLoading,
    mutate,
  } = useSWR<AlertsResult>(`${backendUrl}/alerts`, (url: string) =>
    fetch(url).then((r) => r.json())
  );
  const handleToggleActivation = (alert: Alert) => async () => {
    const isActive = alert.isActive;
    await setAlertActivation(alert.id, !isActive);
    mutate((d) => d?.map((a) => ({ ...a, isActive: !isActive })));
  };

  if (error) return notFound();
  if (isLoading || !alerts) return <LoadingPage />;

  return (
    <>
      <Navbar />
      <div className="min-h-full flex flex-1 flex-row justify-center">
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg flex flex-col gap-2 p-4 m-10 bg-white">
          <ul className="max-w-md divide-y divide-gray-200">
            {alerts.map((alert) => (
              <li className="py-1" key={alert.id}>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {alert.ticker}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {alert.triggerState}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {alert.triggerPrice}$
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    {alert.isActive ? (
                      <button
                        onClick={handleToggleActivation(alert)}
                        className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded"
                      >
                        Active
                      </button>
                    ) : (
                      <button
                        onClick={handleToggleActivation(alert)}
                        className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded"
                      >
                        Deactivated
                      </button>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteAlert(alert.id);
                        mutate((d) => d?.filter((a) => a.id !== alert.id));
                      }}
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <a
            href={"/alerts/add"}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Add alert
          </a>
        </div>
      </div>
    </>
  );
}
