import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'

function ChakraTitle({ text }) {
  const letters = useMemo(() => Array.from(text), [text])
  return (
    <h1 className="select-none text-center font-extrabold tracking-wider text-5xl sm:text-6xl md:text-7xl leading-tight">
      {letters.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform chakra-glow"
          initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)'}}
          transition={{ delay: i * 0.03, type: 'spring', stiffness: 220, damping: 18 }}
          whileHover={{ scale: 1.2 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h1>
  )
}

function ParallaxLayer({ speed = 0.2, children, className = '' }) {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed])
  return (
    <motion.div style={{ y }} ref={ref} className={className}>
      {children}
    </motion.div>
  )
}

function CloudStrip({ className = '' }) {
  return <div className={`clouds pointer-events-none ${className}`} />
}

function LeavesParticles() {
  // Render a bunch of animated leaves using CSS keyframes
  const leaves = new Array(20).fill(0)
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((_, i) => (
        <span key={i} className={`leaf leaf-${(i % 5) + 1}`} style={{ left: `${(i*13)%100}%`, animationDelay: `${i*0.6}s` }} />
      ))}
    </div>
  )
}

function LightningFlash() {
  return <div className="pointer-events-none absolute inset-0 lightning-maybe" />
}

function CursorChakraTrail() {
  const [trail, setTrail] = useState([])
  useEffect(() => {
    const onMove = (e) => {
      setTrail((t) => {
        const next = [...t, { x: e.clientX, y: e.clientY, id: Math.random() }]
        if (next.length > 18) next.shift()
        return next
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {trail.map((p, i) => (
        <motion.div
          key={p.id}
          className="chakra-dot"
          initial={{ opacity: 0.8, scale: 0.6 }}
          animate={{ opacity: 0, scale: 2.4, x: p.x, y: p.y }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
        />
      ))}
    </div>
  )
}

function TiltCard({ title, subtitle, jutsuColor = '#60a5fa', particles = 12, children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [0, 1], [10, -10]), { stiffness: 200, damping: 15 })
  const ry = useSpring(useTransform(x, [0, 1], [-10, 10]), { stiffness: 200, damping: 15 })

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    x.set(px); y.set(py)
  }
  const onLeave = () => { x.set(0.5); y.set(0.5) }
  useEffect(() => { onLeave() }, [])

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      className="group relative h-72 w-full rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-800/60 border border-white/10 shadow-2xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-slate-700/20" />
      <motion.div
        className="absolute inset-0"
        style={{ transform: 'translateZ(40px)' }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {[...Array(particles)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute block rounded-full"
              style={{ width: 6, height: 6, background: jutsuColor, boxShadow: `0 0 10px ${jutsuColor}, 0 0 20px ${jutsuColor}` }}
              initial={{ x: '50%', y: '50%', opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ x: `${50 + Math.cos((i/particles)*Math.PI*2)*40}%`, y: `${50 + Math.sin((i/particles)*Math.PI*2)*40}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 10, mass: 0.6 }}
            />
          ))}
        </div>
        <div className="relative h-full w-full flex flex-col items-center justify-center text-center p-6">
          <div className="shuriken" />
          <h3 className="mt-4 text-2xl font-bold text-white drop-shadow-lg">{title}</h3>
          <p className="text-slate-300 text-sm mt-2 max-w-xs">{subtitle}</p>
          {children}
        </div>
      </motion.div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(96,165,250,0.25),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(248,113,113,0.2),transparent_40%)]" />
    </motion.div>
  )
}

function NinjaScroll({ title, content }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <button onClick={() => setOpen(!open)} className="mx-auto block mb-3 text-amber-200/90 hover:text-amber-100 transition-colors">{open ? 'Roll up' : 'Unroll the ninja scroll'}</button>
      <div className="scroll-ends" />
      <motion.div
        className="ninja-scroll"
        animate={{ height: open ? 'auto' : 0, paddingTop: open ? 24 : 0, paddingBottom: open ? 24 : 0 }}
        transition={{ type: 'spring', damping: 16, stiffness: 140 }}
      >
        <h4 className="text-2xl font-bold text-amber-200 mb-2">{title}</h4>
        <p className="text-amber-100/90 leading-relaxed">{content}</p>
      </motion.div>
      <div className="scroll-ends bottom" />
    </div>
  )
}

function FlyingShuriken() {
  const { scrollYProgress } = useScroll()
  const x = useTransform(scrollYProgress, [0, 1], ['-10%', '110%'])
  const y = useTransform(scrollYProgress, [0, 1], ['10%', '70%'])
  const r = useTransform(scrollYProgress, [0, 1], [0, 1440])
  return (
    <motion.div className="fixed left-0 top-0 z-[30] pointer-events-none" style={{ x, y, rotate: r }}>
      <div className="shuriken shuriken-lg" />
    </motion.div>
  )
}

function KonohaMap() {
  const [gateOpen, setGateOpen] = useState(false)
  const [clone, setClone] = useState(false)
  return (
    <div className="relative w-full max-w-5xl mx-auto p-4">
      <div className="text-center mb-4">
        <h3 className="text-3xl font-bold text-emerald-200 drop-shadow">Konoha Village</h3>
        <p className="text-emerald-100/90">Explore the village. Click the gate or training grounds.</p>
      </div>
      <div className="relative bg-emerald-900/40 border border-emerald-400/20 rounded-2xl overflow-hidden">
        <svg viewBox="0 0 800 400" className="w-full h-[320px]">
          <defs>
            <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9"/>
              <stop offset="100%" stopColor="#0f172a"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="800" height="400" fill="url(#sky)" />
          {/* mountains */}
          <motion.path d="M0 260 L120 180 L210 210 L300 160 L420 210 L520 170 L650 200 L800 160 L800 400 L0 400 Z" fill="#0b2a2e" initial={{ y: 12 }} animate={{ y: [12, 0, 12] }} transition={{ repeat: Infinity, duration: 12 }} />
          {/* village silhouettes */}
          <g fill="#052e2b">
            <rect x="80" y="220" width="80" height="60" rx="6"/>
            <rect x="190" y="230" width="70" height="50" rx="6"/>
            <rect x="290" y="210" width="90" height="70" rx="6"/>
          </g>
          {/* gate */}
          <g onClick={() => setGateOpen((v) => !v)} className="cursor-pointer">
            <rect x="420" y="220" width="120" height="80" fill="#0a342f" rx="8"/>
            <motion.rect x="420" y="220" width="60" height="80" fill="#134e4a" rx="6" animate={{ x: gateOpen ? 360 : 420 }} transition={{ type: 'spring', stiffness: 140, damping: 14 }} />
            <motion.rect x="480" y="220" width="60" height="80" fill="#134e4a" rx="6" animate={{ x: gateOpen ? 540 : 480 }} transition={{ type: 'spring', stiffness: 140, damping: 14 }} />
            <text x="450" y="270" fontSize="14" fill="#a7f3d0">Leaf Gate</text>
          </g>
          {/* training grounds */}
          <g onClick={() => {
            setClone(true); setTimeout(() => setClone(false), 1200)
          }} className="cursor-pointer">
            <ellipse cx="190" cy="310" rx="70" ry="26" fill="#064e3b" />
            <text x="150" y="315" fontSize="14" fill="#a7f3d0">Training</text>
          </g>
          {/* birds */}
          <motion.g fill="#e2e8f0" animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 6 }}>
            <path d="M700 60 q10 10 20 0" stroke="#e2e8f0" strokeWidth="2" fill="none" />
            <path d="M720 70 q10 10 20 0" stroke="#e2e8f0" strokeWidth="2" fill="none" />
          </motion.g>
        </svg>
        {clone && (
          <motion.div className="absolute left-[150px] top-[210px]" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: [1, 1.2, 1] }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            <div className="clone" />
          </motion.div>
        )}
      </div>
      <div className="text-center text-emerald-100/70 text-sm mt-2">Click the gate to open. Click the training grounds to summon a shadow clone.</div>
    </div>
  )
}

function SoundToggle() {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    if (!enabled) return
    // create a subtle ambient whoosh loop using WebAudio to avoid external assets
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'; o.frequency.value = 120
    g.gain.value = 0.0008
    o.connect(g); g.connect(ctx.destination)
    o.start()
    let up = true
    const id = setInterval(() => {
      const val = g.gain.value + (up ? 0.0003 : -0.0003)
      g.gain.value = Math.max(0.0002, Math.min(0.0015, val))
      if (g.gain.value >= 0.0015) up = false
      if (g.gain.value <= 0.0002) up = true
    }, 200)
    return () => { clearInterval(id); o.stop(); ctx.close() }
  }, [enabled])
  return (
    <button onClick={() => setEnabled((v) => !v)} className="fixed right-4 bottom-4 z-[70] bg-slate-900/70 text-slate-100 px-4 py-2 rounded-full border border-white/10 shadow-lg hover:bg-slate-800">
      {enabled ? 'Sound: On' : 'Sound: Off'}
    </button>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white overflow-x-hidden">
      {/* animated background */}
      <ParallaxLayer speed={0.02}>
        <CloudStrip />
      </ParallaxLayer>
      <ParallaxLayer speed={0.06}>
        <LeavesParticles />
      </ParallaxLayer>
      <LightningFlash />
      <CursorChakraTrail />
      <FlyingShuriken />

      {/* Hero */}
      <section className="relative h-[100vh] flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-5xl">
          <ChakraTitle text="Enter the Hidden Leaf" />
          <p className="mt-4 text-slate-300 text-lg md:text-xl">
            A living anime world of chakra, leaves, and legendary shinobi.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button className="btn-shuriken">Start Your Path</button>
            <button className="btn-chakra">See the Village</button>
          </div>
        </div>

        {/* foreground silhouettes for parallax depth */}
        <ParallaxLayer speed={0.12}>
          <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(2,6,23,0.8),transparent_60%)]" />
        </ParallaxLayer>
      </section>

      {/* Ninja Scrolls section */}
      <section className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900/80">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold chakra-glow">Legends on the Scroll</h2>
            <p className="text-slate-300 mt-2">Unroll hidden stories, quotes, and lore.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <NinjaScroll title="Will of Fire" content="The spirit of the Hidden Leaf burns bright. Protect your comrades, honor your village, and light the way with unwavering resolve." />
            <NinjaScroll title="Unbreakable Bonds" content="Through rivalry and friendship, shinobi grow stronger. Every step, every battle, forges ties that shape destiny." />
          </div>
        </div>
      </section>

      {/* Character showcase */}
      <section className="relative py-24 bg-[radial-gradient(circle_at_top_left,#0f172a,transparent_40%),radial-gradient(circle_at_bottom_right,#111827,transparent_40%)]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold chakra-glow">Shinobi Showcase</h2>
            <p className="text-slate-300 mt-2">Hover to spark their jutsu.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TiltCard title="Heroic Ninja" subtitle="Unrelenting spirit, swirling energy." jutsuColor="#60a5fa" />
            <TiltCard title="Prodigy" subtitle="Lightning-fast precision, calm fury." jutsuColor="#38bdf8" />
            <TiltCard title="Healer" subtitle="Steadfast strength, blooming resolve." jutsuColor="#f472b6" />
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="relative py-24 bg-gradient-to-b from-slate-900/80 to-black">
        <KonohaMap />
      </section>

      {/* Kinetic typography strip */}
      <section className="relative py-20 overflow-hidden bg-slate-950">
        <div className="marquee text-3xl sm:text-4xl font-extrabold uppercase tracking-[0.2em]">
          <span className="chakra-glow">Believe It! • Rise as a Shinobi • Protect the Leaf • Master Your Chakra • </span>
          <span className="chakra-glow">Believe It! • Rise as a Shinobi • Protect the Leaf • Master Your Chakra • </span>
        </div>
      </section>

      {/* Footer with subtle particles */}
      <footer className="relative py-12 text-center text-slate-400 bg-gradient-to-t from-black to-slate-950">
        <p className="text-sm">
          A fan-made interactive tribute world built for anime lovers.
        </p>
      </footer>

      <SoundToggle />
    </div>
  )
}
