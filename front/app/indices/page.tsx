type IndicesResult = {
  results: { ticker: string; name: string }[];
  status: string;
  count: number;
};

async function getData(): Promise<IndicesResult> {
  const res = await fetch("http://localhost:3001/api/indices");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="min-h-full flex flex-1 flex-row justify-center">
      <div className="max-w-full rounded shadow-lg flex flex-col gap-4 p-10 m-10 bg-slate-100">
        <h1>DASHBOARD</h1>
        <section className="grid grid-cols-4 gap-4">
          {data.results.map((index) => (
            <a
              className="shadow-md p-3 rounded-md bg-white"
              href={`/indices/${index.ticker}`}
              key={index.ticker}
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
      </div>
    </div>
  );
}
