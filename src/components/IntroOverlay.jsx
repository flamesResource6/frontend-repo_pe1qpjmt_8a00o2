import React, { useEffect, useRef, useState } from 'react'

// Fullscreen cinematic intro overlay that plays two clips then reveals the page
export default function IntroOverlay({ onFinish }) {
  const [stage, setStage] = useState(0) // 0 = boarding, 1 = cabin, 2 = done
  const boardingRef = useRef(null)
  const cabinRef = useRef(null)
  const [visible, setVisible] = useState(true)

  // Respect prefers-reduced-motion: skip intro
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      complete()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const b = boardingRef.current
    if (!b) return
    b.muted = true
    b.playsInline = true
    const p = b.play()
    if (p && typeof p.catch === 'function') p.catch(()=>{})
    const onEnd = () => setStage(1)
    b.addEventListener('ended', onEnd)
    // Safety timeout in case 'ended' doesn't fire (mobile)
    const t = setTimeout(() => setStage(1), 7000)
    return () => { b.removeEventListener('ended', onEnd); clearTimeout(t) }
  }, [])

  useEffect(() => {
    if (stage !== 1) return
    const c = cabinRef.current
    if (!c) return
    c.muted = true
    c.playsInline = true
    const p = c.play()
    if (p && typeof p.catch === 'function') p.catch(()=>{})
    const onEnd = () => complete()
    c.addEventListener('ended', onEnd)
    const t = setTimeout(() => complete(), 7000)
    return () => { c.removeEventListener('ended', onEnd); clearTimeout(t) }
  }, [stage])

  function skip() {
    complete()
  }

  function complete() {
    setStage(2)
    // Fade out overlay then notify parent
    setVisible(false)
    setTimeout(() => onFinish && onFinish(), 450)
  }

  if (stage === 2) return null

  return (
    <div className={`fixed inset-0 z-[60] pointer-events-auto transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background safety gradient under videos */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1020] via-[#0a0f1c] to-[#060914]" />

      {/* Boarding clip */}
      <video
        ref={boardingRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ${stage === 0 ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        muted
        playsInline
        preload="metadata"
        aria-hidden
        poster="https://images.unsplash.com/photo-1502920917128-1aa500764b8a?q=80&w=1920&auto=format&fit=crop"
      >
        {/* People boarding a private jet */}
        <source src="https://videos.pexels.com/video-files/3189745/3189745-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/5716009/5716009-uhd_2560_1440_24fps.mp4" type="video/mp4" />
      </video>

      {/* Cabin lifestyle clip */}
      <video
        ref={cabinRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}
        muted
        playsInline
        preload="metadata"
        aria-hidden
        poster="https://images.unsplash.com/photo-1526481280698-8fcc13fd1b4a?q=80&w=1920&auto=format&fit=crop"
      >
        {/* Inside the jet having a good time */}
        <source src="https://videos.pexels.com/video-files/4969949/4969949-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/5075882/5075882-uhd_2560_1440_25fps.mp4" type="video/mp4" />
      </video>

      {/* Logo/title + skip */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
        <div className="backdrop-blur-[1px]">
          <div className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-[0_6px_24px_rgba(0,0,0,.45)]">JetLegs</div>
          <div className="mt-2 text-sky-200/90 md:text-lg">Empty‑leg luxury, without the full price tag.</div>
        </div>
        <button
          onClick={skip}
          className="pointer-events-auto mt-8 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm"
        >
          Skip intro
        </button>
      </div>

      {/* Cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,255,255,0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  )
}
