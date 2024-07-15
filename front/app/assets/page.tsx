import { backendUrl } from "../lib/backend";

type AssetsResult = {
  results: { ticker: string; name: string }[];
  status: string;
  count: number;
};

async function getAssets(): Promise<AssetsResult> {
  const res = await fetch(`${backendUrl}/assets`);
  if (!res.ok) throw new Error("Failed to fetch assets");
  return res.json();
}

export default async function Page() {
  const assets = await getAssets();

  return (
    <main className="min-h-full flex flex-1 flex-row justify-center">
      <article className="max-w-full rounded shadow-lg flex flex-col gap-4 p-10 m-10 bg-slate-100">
        <h1>DASHBOARD</h1>
        <section className="grid grid-cols-4 gap-4">
          {assets.results.map((index, i) => (
            <a
              className="shadow-md p-3 rounded-md bg-white"
              href={`/assets/${index.ticker}`}
              key={i}
            >
              <article className="divide-y">
                <header>
                  <h1 className="font-bold">{index.ticker}</h1>
                </header>
                <p className="text-sm">{index.name}</p>
              </article>
            </a>
          ))}
        </section>
      </article>
    </main>
  );
}
