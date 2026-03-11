import React, { useState, useEffect } from "react";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetch(`http://localhost:8080/api/countries?search=${search}`)
        .then((res) => res.json())
        .then((data) => setCountries(data))
        .catch((err) => console.error("Fetch error:", err));
    }, 300); // Small debounce to save API calls

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Country Explorer
        </h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full p-3 mb-6 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Flag</th>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Capital</th>
                <th className="p-4 font-semibold text-gray-600">Region</th>
                <th className="p-4 font-semibold text-gray-600 text-right">
                  Population
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {countries.map((c) => (
                <tr
                  key={c.name}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => setSelected(c)}
                >
                  <td className="p-4">
                    <img
                      src={c.flag}
                      alt="flag"
                      className="w-12 h-8 object-cover rounded shadow-sm"
                    />
                  </td>
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4 text-gray-600">{c.capital}</td>
                  <td className="p-4 text-gray-600">{c.region}</td>
                  <td className="p-4 text-right text-gray-600">
                    {c.population.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
              <img
                src={selected.flag}
                alt="flag"
                className="w-full h-48 object-cover rounded-lg mb-4 shadow"
              />
              <h2 className="text-2xl font-bold mb-2">{selected.name}</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Capital:</strong> {selected.capital}
                </p>
                <p>
                  <strong>Region:</strong> {selected.region}
                </p>
                <p>
                  <strong>Population:</strong>{" "}
                  {selected.population.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
