import React, { useEffect, useRef } from 'react'

// Animated background with cinematic space video, aurora, starfield, grid, vignette + scroll parallax
export default function LiveBackground() {
  const starsRef = useRef(null)
  const auroraRef = useRef(null)
  const videoRef = useRef(null)

  // Respect reduced-motion: pause/disable heavy motion layers
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const vid = videoRef.current
    if (!vid) return

    // If user prefers reduced motion, pause and hide the video
    if (prefersReducedMotion) {
      try {
        vid.pause()
      } catch {}
      vid.style.display = 'none'
    } else {
      // Attempt autoplay without sound (required by most browsers)
      vid.muted = true
      const play = vid.play()
      if (play && typeof play.catch === 'function') {
        play.catch(() => {
          // If autoplay fails, show controls minimally (still hidden visually)
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

  // Scroll parallax: move layers at different speeds
  useEffect(() => {
    const auroraEl = auroraRef.current
    const starsEl = starsRef.current
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      const y = window.scrollY || document.documentElement.scrollTop || 0
      requestAnimationFrame(() => {
        // Aurora: subtle slower movement
        if (auroraEl) {
          const amt = y * 0.06 // slower
          auroraEl.style.transform = `translate3d(0, ${amt}px, 0)`
        }
        // Stars: slightly faster for depth
        if (starsEl) {
          const amt = y * 0.12 // faster
          starsEl.style.transform = `translate3d(0, ${amt}px, 0)`
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
      {/* Cinematic deep-space video layer */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-105 opacity-70 [mix-blend-mode:screen]"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden
        poster="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1920&auto=format&fit=crop"
      >
        {/* Royalty-free space/nebula loops */}
        <source src="https://cdn.coverr.co/videos/coverr-swirling-cosmos-3843/1080p.mp4" type="video/mp4" />
        <source src="https://cdn.coverr.co/videos/coverr-swirling-cosmos-3843/1080p.webm" type="video/webm" />
      </video>

      {/* Deep space base gradient overlay for cohesion */}
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

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.06),transparent_55%)]" />
    </div>
  )
}
