import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import FlightCard from './components/FlightCard'
import BookingModal from './components/BookingModal'
import LiveBackground from './components/LiveBackground'
import IntroOverlay from './components/IntroOverlay'

function App() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')
  const [introDone, setIntroDone] = useState(false)

  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  async function fetchFlights(params = {}) {
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const search = new URLSearchParams()
      if (params.origin) search.append('origin', params.origin)
      if (params.destination) search.append('destination', params.destination)
      if (params.date) search.append('date', params.date)
      const res = await fetch(`${API}/api/flights?${search.toString()}`)
      const data = await res.json()
      setFlights(data)
      if (data.length === 0) setMessage('No flights match your filters. Try different airports or dates.')
    } catch (e) {
      setError('Failed to load flights')
    } finally {
      setLoading(false)
    }
  }

  async function confirmBooking(payload) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const d = await res.json().catch(()=>({detail:'Error'}))
        throw new Error(d.detail || 'Booking failed')
      }
      await fetchFlights({})
      setSelected(null)
      setMessage('Booking submitted! We will contact you to confirm details.')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlights({})
  }, [])

  function handleIntroFinish() {
    setIntroDone(true)
    setTimeout(() => {
      const el = document.getElementById('search-anchor')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <div className="relative min-h-screen text-white">
      <LiveBackground />

      {!introDone && (
        <IntroOverlay onFinish={handleIntroFinish} />
      )}

      <div className={`relative max-w-6xl mx-auto px-4 transition-opacity duration-500 ${introDone ? 'opacity-100' : 'opacity-0'} `}>
        <header className="pt-10 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-fuchsia-500 shadow-lg shadow-blue-500/30" />
            <span className="text-xl font-semibold tracking-tight">JetLegs</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-300/80">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Empty Legs</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">How it works</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Contact</span>
          </div>
        </header>

        <div id="search-anchor">
          <Hero onSearch={fetchFlights} />
        </div>

        {loading && <div className="text-center text-slate-300">Loading...</div>}
        {error && <div className="text-center text-red-400">{error}</div>}
        {message && <div className="text-center text-slate-300">{message}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 pb-16">
          {flights.map(f => (
            <FlightCard key={f.id} flight={f} onBook={setSelected} />
          ))}
        </div>
      </div>

      {selected && (
        <BookingModal
          flight={selected}
          onClose={() => setSelected(null)}
          onConfirm={confirmBooking}
        />
      )}

      <footer className="relative border-t border-white/10 mt-6">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} JetLegs. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
