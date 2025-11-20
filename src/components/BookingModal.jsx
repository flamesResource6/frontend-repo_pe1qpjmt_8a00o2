import { useState } from "react";

export default function BookingModal({ flight, onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [notes, setNotes] = useState("");

  function submit(e) {
    e.preventDefault();
    onConfirm({
      flight_id: flight.id,
      name,
      email,
      phone,
      passengers: Number(passengers),
      notes,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="text-white font-semibold">Book flight {flight.origin} → {flight.destination}</div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={submit} className="p-5 grid gap-3">
          <input className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
          <input type="email" className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
          <input type="number" min="1" max={flight.seats_available} className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white" placeholder="Passengers" value={passengers} onChange={e=>setPassengers(e.target.value)} required />
          <textarea className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white" placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)} />
          <button className="mt-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold">Confirm booking</button>
        </form>
      </div>
    </div>
  );
}
