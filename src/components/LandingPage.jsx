import { useEffect, useRef, useState, useCallback } from 'react'
import '../landing.css'

function CoffeeBagSVG({ interactive }) {
  const [hovered, setHovered] = useState(false)
  const [activeBar, setActiveBar] = useState(null)

  const bars = [
    { label: 'BITTER',   fill: 0.77, note: 'Dark roast depth' },
    { label: 'CAFFEINE', fill: 0.68, note: 'Highland intensity' },
    { label: 'SWEET',    fill: 0.52, note: 'Subtle fruit finish' },
    { label: 'SOUR',     fill: 0.28, note: 'Low acidity' },
    { label: 'MANDARIN', fill: 0.44, note: 'Citrus brightness' },
  ]

  return (
    <div
      className={`bag-wrap ${hovered ? 'bag-hovered' : ''}`}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => { interactive && setHovered(false); setActiveBar(null) }}
    >
      <svg
        viewBox="0 0 220 330"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="bag-svg"
        aria-label="Dak Lak single origin coffee bag"
        role="img"
      >
        <defs>
          <linearGradient id="bagGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#232018" />
            <stop offset="30%" stopColor="#1A1712" />
            <stop offset="70%" stopColor="#1E1C17" />
            <stop offset="100%" stopColor="#141210" />
          </linearGradient>
          <linearGradient id="bagShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3A3428" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#2A2520" stopOpacity="0" />
            <stop offset="100%" stopColor="#0A0907" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="crimpGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D0B09" />
            <stop offset="100%" stopColor="#1A1712" />
          </linearGradient>
          <linearGradient id="labelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8F5EF" />
            <stop offset="100%" stopColor="#EDE9E0" />
          </linearGradient>
          <filter id="bagShadow" x="-20%" y="-5%" width="140%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <filter id="labelGlow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" />
          </filter>
          <clipPath id="bagClip">
            <path d="M 22 298 Q 8 298 8 280 L 8 62 Q 8 42 28 42 L 192 42 Q 212 42 212 62 L 212 280 Q 212 298 198 298 Z" />
          </clipPath>
        </defs>

        {/* Drop shadow */}
        <ellipse cx="110" cy="318" rx="72" ry="7" fill="rgba(0,0,0,0.35)" />

        {/* Bag body */}
        <path
          d="M 22 298 Q 8 298 8 280 L 8 62 Q 8 42 28 42 L 192 42 Q 212 42 212 62 L 212 280 Q 212 298 198 298 Z"
          fill="url(#bagGrad)"
          filter="url(#bagShadow)"
        />

        {/* Surface shine overlay */}
        <path
          d="M 22 298 Q 8 298 8 280 L 8 62 Q 8 42 28 42 L 192 42 Q 212 42 212 62 L 212 280 Q 212 298 198 298 Z"
          fill="url(#bagShine)"
          clipPath="url(#bagClip)"
        />

        {/* Left edge highlight */}
        <path d="M 8 90 L 8 260 Q 8 280 22 292 L 22 58 Q 8 62 8 90" fill="rgba(255,245,220,0.04)" />

        {/* Right edge shadow */}
        <path d="M 212 90 L 212 260 Q 212 280 198 292 L 198 58 Q 212 62 212 90" fill="rgba(0,0,0,0.15)" />

        {/* Bottom gusset fold */}
        <path d="M 22 272 Q 110 284 198 272" stroke="#2C2820" strokeWidth="1.5" fill="none" opacity="0.8" />
        <path d="M 28 278 Q 110 288 192 278" stroke="#3A3428" strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* Top crimp area */}
        <path d="M 8 62 Q 8 42 28 42 L 192 42 Q 212 42 212 62 L 212 76 Q 110 68 8 76 Z" fill="url(#crimpGrad)" />

        {/* Crimp texture lines */}
        {[50, 56, 61, 66].map((y, i) => (
          <line key={i} x1="18" y1={y} x2="202" y2={y}
            stroke="#2A2520" strokeWidth={i === 0 ? 1 : 0.6} opacity={i > 1 ? 0.4 : 0.8} />
        ))}

        {/* Notch for opening */}
        <path d="M 68 42 L 72 38 L 76 42" fill="none" stroke="#3A3428" strokeWidth="1" />

        {/* Degassing valve */}
        <g transform="translate(170, 104)">
          <ellipse cx="0" cy="0" rx="14" ry="10" fill="#0D0B09" stroke="#2A2520" strokeWidth="1" />
          <ellipse cx="0" cy="0" rx="9" ry="6" fill="#141210" stroke="#2A2520" strokeWidth="0.5" />
          <ellipse cx="0" cy="0" rx="4" ry="3" fill="#0A0907" />
          <line x1="-9" y1="0" x2="9" y2="0" stroke="#1E1C17" strokeWidth="0.5" opacity="0.5" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="#1E1C17" strokeWidth="0.5" opacity="0.5" />
        </g>

        {/* White label */}
        <rect x="30" y="120" width="160" height="160" rx="3" fill="url(#labelGrad)" />

        {/* Label top dark band */}
        <rect x="30" y="120" width="160" height="26" rx="3" fill="#1A1712" />
        <rect x="30" y="138" width="160" height="8" fill="#1A1712" />

        {/* Brand name in band */}
        <text x="110" y="136" textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="10" letterSpacing="6" fill="#F0EDE6" fontWeight="400">
          DAK LAK
        </text>

        {/* Origin */}
        <text x="110" y="160" textAnchor="middle"
          fontFamily="'Arial Narrow', Arial, sans-serif"
          fontSize="6.5" letterSpacing="3.5" fill="#6B6558">
          VIETNAM · SINGLE ORIGIN
        </text>

        {/* Divider */}
        <line x1="46" y1="168" x2="174" y2="168" stroke="#CCC8BF" strokeWidth="0.5" />

        {/* Roast descriptor */}
        <text x="110" y="181" textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="9" fill="#1A1710" fontStyle="italic">
          Medium Dark Roast
        </text>

        {/* Tasting notes */}
        <text x="110" y="193" textAnchor="middle"
          fontFamily="'Arial Narrow', Arial, sans-serif"
          fontSize="6.5" letterSpacing="0.5" fill="#8A8478">
          dark chocolate · mandarin · earth
        </text>

        {/* Divider 2 */}
        <line x1="46" y1="201" x2="174" y2="201" stroke="#CCC8BF" strokeWidth="0.5" />

        {/* Intensity profile label */}
        <text x="110" y="213" textAnchor="middle"
          fontFamily="'Arial Narrow', Arial, sans-serif"
          fontSize="6" letterSpacing="2.5" fill="#9A9488">
          INTENSITY PROFILE
        </text>

        {/* Flavor bars */}
        {bars.map((bar, i) => {
          const y = 222 + i * 13
          const maxW = 68
          const filledW = bar.fill * maxW
          const isActive = activeBar === i
          return (
            <g key={bar.label}
              onMouseEnter={() => interactive && setActiveBar(i)}
              onMouseLeave={() => interactive && setActiveBar(null)}
              style={{ cursor: interactive ? 'default' : 'default' }}
            >
              <text x="46" y={y + 4} fontFamily="'Arial Narrow', Arial, sans-serif"
                fontSize="5.5" letterSpacing="1" fill={isActive ? '#1A1710' : '#7A7570'}>
                {bar.label}
              </text>
              {/* Track */}
              <rect x="96" y={y} width={maxW} height="4" rx="2" fill="#DDD9D0" />
              {/* Fill */}
              <rect x="96" y={y} width={filledW} height="4" rx="2"
                fill={isActive ? '#3A3428' : '#1A1712'} />
              {/* Active tooltip */}
              {isActive && (
                <g>
                  <rect x="96" y={y - 14} width="68" height="11" rx="2" fill="#1A1712" />
                  <text x="130" y={y - 6} textAnchor="middle"
                    fontFamily="'Arial Narrow', Arial, sans-serif"
                    fontSize="6" fill="#F0EDE6">{bar.note}</text>
                </g>
              )}
            </g>
          )
        })}

        {/* Divider 3 */}
        <line x1="46" y1="292" x2="174" y2="292" stroke="#CCC8BF" strokeWidth="0.5" />

        {/* Net weight */}
        <text x="110" y="272" textAnchor="middle"
          fontFamily="'Arial Narrow', Arial, sans-serif"
          fontSize="6" letterSpacing="2" fill="#9A9488">
          250g · NET WEIGHT
        </text>

        {/* QR placeholder area */}
        <rect x="152" y="255" width="22" height="22" rx="1" fill="none" stroke="#CCC8BF" strokeWidth="0.5" />
        <rect x="154" y="257" width="6" height="6" fill="#1A1712" opacity="0.3" />
        <rect x="163" y="257" width="6" height="6" fill="#1A1712" opacity="0.3" />
        <rect x="154" y="267" width="6" height="6" fill="#1A1712" opacity="0.3" />
        <rect x="163" y="267" width="2" height="2" fill="#1A1712" opacity="0.3" />
        <rect x="167" y="263" width="3" height="6" fill="#1A1712" opacity="0.3" />
      </svg>

      {/* Hover hint */}
      {interactive && !hovered && (
        <div className="bag-hint">hover the flavor bars</div>
      )}
    </div>
  )
}

export default function LandingPage({ onEnter }) {
  const containerRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const [visible, setVisible] = useState({})

  const handleScroll = useCallback(() => {
    if (containerRef.current) setScrollY(containerRef.current.scrollTop)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          setVisible(prev => ({ ...prev, [e.target.dataset.reveal]: true }))
        }
      }),
      { threshold: 0.15, root: containerRef.current }
    )
    const targets = containerRef.current?.querySelectorAll('[data-reveal]') || []
    targets.forEach(t => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="lp" ref={containerRef}>

      {/* ─── HERO ─── */}
      <section className="lp-hero">

        {/* Far background — slowest layer */}
        <div className="lp-layer lp-layer-bg"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}>
          <div className="lp-stars" />
        </div>

        {/* Hills — mid layer */}
        <div className="lp-layer lp-layer-hills"
          style={{ transform: `translateY(${scrollY * 0.22}px)` }}>
          <svg viewBox="0 0 1440 520" preserveAspectRatio="none" className="lp-hills-svg">
            <path d="M0 520 L0 360 Q120 290 240 310 Q360 330 480 270 Q600 210 720 250 Q840 290 960 230 Q1080 170 1200 200 Q1320 230 1440 190 L1440 520 Z"
              fill="#111009" />
            <path d="M0 520 L0 400 Q160 345 320 365 Q480 385 640 325 Q800 265 960 300 Q1120 335 1280 290 Q1380 265 1440 280 L1440 520 Z"
              fill="#161410" />
            <path d="M0 520 L0 440 Q200 400 400 420 Q600 440 800 390 Q1000 340 1200 370 Q1360 390 1440 370 L1440 520 Z"
              fill="#1A1812" />
            {/* Coffee tree silhouettes */}
            {[180, 420, 680, 920, 1150, 1350].map((x, i) => (
              <g key={i} transform={`translate(${x}, ${370 + (i % 3) * 12})`} opacity="0.6">
                <rect x="-2" y="-28" width="4" height="28" fill="#0D0B08" />
                <ellipse cx="0" cy="-32" rx="14" ry="10" fill="#0D0B08" />
                <ellipse cx="-10" cy="-22" rx="8" ry="6" fill="#0D0B08" />
                <ellipse cx="10" cy="-22" rx="8" ry="6" fill="#0D0B08" />
              </g>
            ))}
          </svg>
        </div>

        {/* Giant background text — slowest */}
        <div className="lp-bg-word"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
          DAK LAK
        </div>

        {/* Coffee bag — parallax hero */}
        <div className="lp-bag-stage"
          style={{ transform: `translateY(${-scrollY * 0.18}px)` }}>
          <CoffeeBagSVG interactive={true} />
        </div>

        {/* Hero copy — faster parallax */}
        <div className="lp-hero-copy"
          style={{ transform: `translateY(${scrollY * 0.35}px)`, opacity: Math.max(0, 1 - scrollY / 300) }}>
          <p className="lp-tagline">Drink the place.</p>
          <p className="lp-origin-line">Single origin · Dak Lak, Central Highlands, Vietnam</p>
        </div>

        {/* Scroll cue */}
        <div className="lp-scroll-cue" style={{ opacity: Math.max(0, 1 - scrollY / 150) }}>
          <div className="lp-scroll-label">scroll</div>
          <div className="lp-scroll-track"><div className="lp-scroll-thumb" /></div>
        </div>
      </section>

      {/* ─── ORIGIN ─── */}
      <section className="lp-section lp-section-origin">
        <div className={`lp-reveal ${visible['origin'] ? 'lp-in' : ''}`} data-reveal="origin">
          <p className="lp-eyebrow">1,500m above sea level</p>
          <h2 className="lp-section-h">From a single farm.<br />To your morning ritual.</h2>
          <p className="lp-section-p">
            Dak Lak. The Central Highlands. Red basalt soil, highland mist,
            and two generations of coffee knowledge. We don't source from regions.
            We source from a specific farm, managed by someone who has been doing
            this his entire life.
          </p>
          <p className="lp-section-p">
            Every bag is a direct line from that farm to your cup.
            No middlemen. No blending. No pretending it came from somewhere vague.
          </p>
          <div className="lp-stats-row">
            <div className="lp-stat">
              <span className="lp-stat-n">10–50t</span>
              <span className="lp-stat-l">Annual harvest</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-n">2</span>
              <span className="lp-stat-l">Generations</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-n">1</span>
              <span className="lp-stat-l">Farm. No blending.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRECISION ─── */}
      <section className="lp-section lp-section-precision">
        <div className={`lp-reveal ${visible['precision'] ? 'lp-in' : ''}`} data-reveal="precision">
          <p className="lp-eyebrow">Not certifications. Evidence.</p>
          <h2 className="lp-section-h">You'll taste where<br />it came from.</h2>
          <p className="lp-section-p">
            The flavor profile isn't marketing copy. It's the terroir of Dak Lak
            in your cup — the dark chocolate of basalt soil, the faint mandarin
            of highland-grown Robusta, the clean finish of beans dried in open air.
            Our intensity scale tells you exactly what to expect before you brew.
          </p>
          <div className="lp-bag-preview">
            <CoffeeBagSVG interactive={false} />
            <p className="lp-bag-caption">Hover the intensity bars to explore the profile</p>
          </div>
        </div>
      </section>

      {/* ─── ENTER ─── */}
      <section className="lp-section lp-section-enter">
        <div className={`lp-reveal ${visible['enter'] ? 'lp-in' : ''}`} data-reveal="enter">
          <p className="lp-eyebrow">Behind the brand</p>
          <h2 className="lp-section-h" style={{ marginBottom: '1rem' }}>Startup OS</h2>
          <p className="lp-section-p" style={{ maxWidth: 400, margin: '0 auto 2.5rem' }}>
            Every task, decision, tool and journal entry for building this brand — in one place.
          </p>
          <button className="lp-enter-btn" onClick={onEnter}>
            Open the OS
            <span className="lp-enter-arrow">→</span>
          </button>
          <p className="lp-enter-sub">Track every phase from brand identity to launch</p>
        </div>
      </section>

    </div>
  )
}
