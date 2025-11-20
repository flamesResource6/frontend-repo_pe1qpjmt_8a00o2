import { Search } from "lucide-react";
import { useState } from "react";

export default function Hero({ onSearch }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  function submit(e) {
    e.preventDefault();
    onSearch({ origin, destination, date });
  }

  return (
    <div className="pt-16 pb-10">
      <h1 className="text-4xl md:text-6xl font-bold text-white text-center tracking-tight">
        Find Empty Leg Flights
      </h1>
      <p className="text-blue-200/80 text-center mt-3 max-w-2xl mx-auto">
        Save up to 75% on private jet travel by booking repositioning flights.
      </p>

      <form onSubmit={submit} className="mt-8 bg-slate-800/60 border border-blue-500/20 rounded-2xl p-4 md:p-6 backdrop-blur">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Origin (IATA)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          />
          <input
            className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Destination (IATA)"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
          />
          <input
            type="date"
            className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors">
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
