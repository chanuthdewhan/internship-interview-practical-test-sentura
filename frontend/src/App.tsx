import React, { useState, useEffect } from "react";

// Define the shape of our data
interface Country {
  name: string;
  capital: string;
  region: string;
  population: number;
  flag: string;
}

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<Country | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetch(
        `http://localhost:8080/api/countries?search=${encodeURIComponent(search)}`,
      )
        .then((res) => res.json())
        .then((data: Country[]) => setCountries(data))
        .catch((err) => console.error("Fetch error:", err));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Global Explorer
          </h1>
          <p className="text-slate-500 mt-2">
            Find and filter countries in real-time.
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search by country name..."
            className="w-full p-4 pl-12 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
          <span className="absolute left-4 top-4 text-slate-400">🔍</span>
        </div>

        {/* Responsive Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600">Flag</th>
                  <th className="p-4 font-semibold text-slate-600">Name</th>
                  <th className="p-4 font-semibold text-slate-600">Capital</th>
                  <th className="p-4 font-semibold text-slate-600">Region</th>
                  <th className="p-4 font-semibold text-slate-600 text-right">
                    Population
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {countries.map((c) => (
                  <tr
                    key={c.name}
                    className="hover:bg-indigo-50/30 cursor-pointer transition-colors group"
                    onClick={() => setSelected(c)}
                  >
                    <td className="p-4">
                      <img
                        src={c.flag}
                        alt={`${c.name} flag`}
                        className="w-14 h-9 object-cover rounded shadow-sm border border-slate-100"
                      />
                    </td>
                    <td className="p-4 font-bold text-indigo-700 group-hover:text-indigo-900">
                      {c.name}
                    </td>
                    <td className="p-4 text-slate-600">{c.capital}</td>
                    <td className="p-4 text-slate-600">{c.region}</td>
                    <td className="p-4 text-right font-mono text-slate-500">
                      {c.population.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {countries.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No countries found matching your search.
            </div>
          )}
        </div>

        {/* Modal Overlay */}
        {selected && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden relative animate-in fade-in zoom-in duration-300">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 text-slate-800 shadow-md z-10 transition-transform hover:scale-110"
              >
                ✕
              </button>
              <img
                src={selected.flag}
                alt="flag"
                className="w-full h-52 object-cover"
              />
              <div className="p-8 text-center">
                <h2 className="text-3xl font-black mb-4 text-slate-800">
                  {selected.name}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <p className="text-slate-400 uppercase text-[10px] font-bold">
                      Capital
                    </p>
                    <p className="font-semibold">{selected.capital}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <p className="text-slate-400 uppercase text-[10px] font-bold">
                      Region
                    </p>
                    <p className="font-semibold">{selected.region}</p>
                  </div>
                </div>
                <div className="mt-4 bg-indigo-50 p-4 rounded-xl">
                  <p className="text-indigo-400 uppercase text-[10px] font-bold">
                    Population
                  </p>
                  <p className="text-xl font-bold text-indigo-900">
                    {selected.population.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="mt-8 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
