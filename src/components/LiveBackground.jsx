import React, { useEffect, useRef } from 'react'

// Animated background with cinematic layers, optional planes, parallax and dim overlay
export default function LiveBackground() {
  const starsRef = useRef(null)
  const auroraRef = useRef(null)
  const videoRef = useRef(null)
  const dimRef = useRef(null)
  const planesRef = useRef(null)

  // Respect reduced-motion: pause/disable heavy motion layers
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const vid = videoRef.current
    if (!vid) return

    if (prefersReducedMotion) {
      try { vid.pause() } catch {}
      vid.style.display = 'none'
    } else {
      vid.muted = true
      vid.playsInline = true
      const play = vid.play()
      if (play && typeof play.catch === 'function') {
        play.catch(() => {
          vid.setAttribute('playsinline', '')
        })
      }
    }
  }, [])

  // Generate tiny star dots once
  useEffect(() => {
    const el = starsRef.current
    if (!el) return
    const count = 140
    const frag = document.createDocumentFragment()
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span')
      const size = Math.random() * 2 + 1
      s.style.position = 'absolute'
      s.style.width = `${size}px`
      s.style.height = `${size}px`
      s.style.borderRadius = '999px'
      s.style.background = 'rgba(255,255,255,0.7)'
      s.style.left = `${Math.random() * 100}%`
      s.style.top = `${Math.random() * 100}%`
      s.style.opacity = String(0.2 + Math.random() * 0.8)
      s.style.filter = 'blur(0.2px)'
      s.style.animation = `twinkle ${3 + Math.random() * 5}s ease-in-out ${Math.random() * 5}s infinite`
      frag.appendChild(s)
    }
    el.appendChild(frag)
  }, [])

  // Create subtle planes flying across background
  useEffect(() => {
    const container = planesRef.current
    if (!container) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const makePlane = (i) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'absolute pointer-events-none opacity-[0.20] hover:opacity-30 transition-opacity'
      const direction = Math.random() > 0.5 ? 'ltr' : 'rtl'
      const top = Math.random() * 70 + 10 // 10%-80%
      const scale = 0.6 + Math.random() * 0.9
      const duration = 18 + Math.random() * 22 // 18s - 40s
      const delay = Math.random() * 12
      wrapper.style.top = `${top}%`
      wrapper.style.transform = `scale(${scale})`
      wrapper.style.animation = `${direction === 'ltr' ? 'fly-ltr' : 'fly-rtl'} ${duration}s linear ${delay}s infinite`

      const color = 'rgba(255,255,255,0.85)'
      const svgNS = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(svgNS, 'svg')
      svg.setAttribute('width', '120')
      svg.setAttribute('height', '40')
      svg.setAttribute('viewBox', '0 0 120 40')
      svg.setAttribute('fill', 'none')
      svg.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,.35))'

      // Simple jet silhouette
      const path = document.createElementNS(svgNS, 'path')
      path.setAttribute('d', 'M3 22 L50 18 L72 10 L78 12 L66 18 L78 22 L72 24 L50 20 L3 18 Z M78 16 L116 18 L116 22 L78 20 Z')
      path.setAttribute('fill', color)
      path.setAttribute('opacity', '0.85')

      svg.appendChild(path)
      wrapper.appendChild(svg)
      container.appendChild(wrapper)
    }

    for (let i = 0; i < 8; i++) makePlane(i)
  }, [])

  // Scroll parallax and dim: move layers + increase dim as you scroll to prioritize content
  useEffect(() => {
    const auroraEl = auroraRef.current
    const starsEl = starsRef.current
    const dimEl = dimRef.current
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      const y = window.scrollY || document.documentElement.scrollTop || 0
      requestAnimationFrame(() => {
        // Aurora: subtle slower movement
        if (auroraEl) {
          const amt = y * 0.06
          auroraEl.style.transform = `translate3d(0, ${amt}px, 0)`
        }
        // Stars: slightly faster for depth
        if (starsEl) {
          const amt = y * 0.12
          starsEl.style.transform = `translate3d(0, ${amt}px, 0)`
        }
        // Dim overlay: from 0.28 to 0.56 between 0-600px scroll
        if (dimEl) {
          const base = 0.24
          const maxExtra = 0.28
          const factor = Math.max(0, Math.min(1, y / 600))
          const opacity = base + maxExtra * factor
          dimEl.style.opacity = String(opacity)
        }
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Cinematic ambient video layer (subtle, sits beneath content once intro is over) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-110 opacity-70 [mix-blend-mode:screen] will-change-transform"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden
        poster="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1920&auto=format&fit=crop"
      >
        <source src="https://cdn.coverr.co/videos/coverr-swirling-cosmos-3843/1080p.mp4" type="video/mp4" />
        <source src="https://cdn.coverr.co/videos/coverr-swirling-cosmos-3843/1080p.webm" type="video/webm" />
      </video>

      {/* Dynamic dim overlay (darkens slightly as you scroll) */}
      <div ref={dimRef} className="absolute inset-0 bg-black transition-opacity duration-300" style={{ opacity: 0.24 }} />

      {/* Deep gradient for cohesion */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_70%_-10%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(1000px_600px_at_20%_110%,rgba(168,85,247,0.14),transparent_60%),linear-gradient(180deg,#020617,60%,#050816)]" />

      {/* Subtle animated grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px, 60px 60px',
          maskImage: 'radial-gradient(70% 60% at 50% 50%, black, transparent)',
        }}
      />

      {/* Aurora blobs */}
      <div ref={auroraRef} className="absolute -inset-20 blur-3xl will-change-transform" aria-hidden>
        <div className="absolute w-[70vw] h-[70vw] -left-1/3 -top-1/3 rounded-full bg-gradient-to-tr from-blue-600/25 via-cyan-400/20 to-transparent animate-slow-float" />
        <div className="absolute w-[60vw] h-[60vw] -right-1/4 -bottom-1/3 rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-violet-400/20 to-transparent animate-slow-float-reverse" />
        <div className="absolute w-[40vw] h-[40vw] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-emerald-400/20 via-teal-300/20 to-transparent animate-slower-pulse" />
      </div>

      {/* Starfield */}
      <div ref={starsRef} className="absolute inset-0 will-change-transform" />

      {/* Planes layer */}
      <div ref={planesRef} className="absolute inset-0" aria-hidden />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.06),transparent_55%)]" />
    </div>
  )
}
