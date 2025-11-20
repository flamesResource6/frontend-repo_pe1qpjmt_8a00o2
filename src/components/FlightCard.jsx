import useInView from "./useInView";

export default function FlightCard({ flight, onBook }) {
  const [ref, inView] = useInView({ threshold: 0.12, rootMargin: "0px 0px -8% 0px" })

  return (
    <div ref={ref} className={`bg-slate-800/60 border border-slate-700 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-700 ease-out will-change-transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-lg">{flight.origin} → {flight.destination}</div>
          <div className="text-slate-300 text-sm">{flight.origin_city || ''} {flight.origin_city && '•'} {flight.destination_city || ''}</div>
        </div>
        <div className="text-right">
          <div className="text-white font-semibold text-xl">${Number(flight.price).toLocaleString()}</div>
          <div className="text-slate-400 text-xs">{flight.aircraft_type}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
        <div>
          <div className="text-slate-400">Departure</div>
          <div>{new Date(flight.departure_time).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-slate-400">Arrival</div>
          <div>{new Date(flight.arrival_time).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-slate-400">Seats left</div>
          <div>{flight.seats_available}</div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onBook(flight)} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors">
          Book this leg
        </button>
      </div>
    </div>
  );
}
