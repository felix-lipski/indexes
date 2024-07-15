"use client";
import { backendUrl } from "@/app/lib/backend";
import dynamic from "next/dynamic";
import useSWR from "swr";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Page({ params }: { params: { ticker: string } }) {
  const ticker = params.ticker;

  const { data, error, isLoading } = useSWR(
    `${backendUrl}/assets/${ticker}`,
    (url: string) => fetch(url).then((r) => r.json())
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const option = {
    chart: {
      type: "candlestick" as const,
      height: 350,
    },
    title: {
      text: ticker,
      align: "left" as const,
    },
    xaxis: {
      type: "datetime" as const,
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  const series = [
    {
      data: data.data.map((candle: any) => {
        const date = new Date(0);
        date.setUTCSeconds(candle.x);
        return {
          x: date,
          y: candle.y,
        };
      }),
    },
  ];

  console.log(series[0].data);

  return (
    <div className="min-h-full flex flex-1 flex-row justify-center">
      <div className="max-w-full rounded shadow-lg flex flex-col gap-4 p-10 m-10 bg-slate-100">
        <h1>{params.ticker}</h1>
        <ApexChart
          type="candlestick"
          options={option}
          series={series}
          height={200}
          width={500}
        />

        <a
          href={`/alerts/add?ticker=${ticker}&defaultPrice=${
            data.data[data.data.length - 1].y[0]
          }`}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Add alert
        </a>
      </div>
    </div>
  );
}
