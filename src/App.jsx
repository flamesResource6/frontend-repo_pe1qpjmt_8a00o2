import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import FlightCard from './components/FlightCard'
import BookingModal from './components/BookingModal'

function App() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]" />

      <div className="relative max-w-6xl mx-auto px-4">
        <Hero onSearch={fetchFlights} />

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
    </div>
  )
}

export default App
