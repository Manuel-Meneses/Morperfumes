"use client"

import { useEffect, useId, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DISPLAY } from "@/components/promo-font"

// Foto del frasco (PNG sin fondo, recortado al frasco)
const BOTTLE_SRC = "/promo/grow-extrait.webp"
const BOTTLE_RATIO = "320 / 686"

// Grano de película ya horneado en una imagen: sin mix-blend-mode, Chrome no tiene que re-mezclar el hero en cada cuadro
const OVERLAY = {
  backgroundImage:
    "url(/promo/grano.webp), radial-gradient(ellipse at center, rgba(120,80,35,0) 55%, rgba(120,80,35,0.22) 100%)",
  backgroundSize: "110px 110px, 100% 100%",
}

// Cuánto se mueve cada duna con el mouse (x, y en px)
const DUNE_DEPTH: [number, number][] = [
  [-6, 0],
  [-14, -3],
  [-26, -5],
]

interface Grain {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  dark: boolean
  phase: number
}

interface Streak {
  x: number
  y: number
  vx: number
  len: number
  alpha: number
}

interface Mist {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  life: number
  max: number
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function Seal() {
  const id = useId()
  return (
    // La sombra va en el contenedor quieto: un drop-shadow sobre algo que gira se recalcula en cada cuadro
    <div
      className="promo-pop relative size-[clamp(3.5rem,38cqw,4.75rem)] rounded-full shadow-[0_10px_18px_rgba(20,31,54,0.35)] md:size-24 lg:size-36"
      style={{ animationDelay: "1300ms" }}
    >
      <svg viewBox="0 0 200 200" className="promo-spin h-full w-full" aria-hidden="true">
        <defs>
          <path id={id} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <circle cx="100" cy="100" r="99" fill="#141f36" />
        <circle cx="100" cy="100" r="91" fill="none" stroke="#c0a062" strokeWidth="1" />
        <circle cx="100" cy="100" r="57" fill="none" stroke="#c0a062" strokeOpacity="0.5" strokeWidth="1" />
        <text fill="#f6f4ed" fontSize="13" fontWeight="600" style={{ fontFamily: "var(--font-cuerpo)" }}>
          <textPath href={`#${id}`} textLength="458" lengthAdjust="spacing">
            REGALO · DECANT 2 ML · GROW EXTRAIT ·
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#f6f4ed]">
        <span style={DISPLAY} className="text-[1.3rem] font-black leading-none md:text-3xl lg:text-[2.6rem]">
          2
        </span>
        <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.25em] text-[#c0a062] md:text-[10px] md:tracking-[0.3em]">ml</span>
      </div>
    </div>
  )
}

export function PromoGrowExtrait({ active, growHref }: { active: boolean; growHref: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bottleRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const duneRefs = useRef<(SVGSVGElement | null)[]>([])
  const rectRef = useRef<DOMRect | null>(null)
  const activeRef = useRef(active)
  const burstRef = useRef<(x: number, y: number) => void>(() => {})
  const motion = useRef({ tx: 0, ty: 0, x: 0, y: 0, lastInput: -Infinity, dragging: false, startX: 0, startTx: 0 })
  const [spritzed, setSpritzed] = useState(false)
  const ids = useId()

  activeRef.current = active

  // Un solo loop: inclinación del frasco, paralaje de las dunas y arena volando en el canvas.
  // Solo escribe transform en 5 elementos con capa propia: Chrome no recalcula estilos ni layout del resto.
  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const tilt = tiltRef.current
    const shine = shineRef.current
    if (!root || !canvas || !tilt || !shine) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // En pantallas táctiles las dunas quedan quietas: no hay mouse que seguir y así no ocupan memoria de la placa
    const dunes = window.matchMedia("(pointer: fine)").matches ? duneRefs.current.filter((d): d is SVGSVGElement => !!d) : []
    for (const d of dunes) d.style.willChange = "transform"

    let w = 0
    let h = 0
    let grains: Grain[] = []
    let streaks: Streak[] = []
    let mist: Mist[] = []

    const makeGrain = (anywhere: boolean): Grain => {
      const size = rand(0.6, 2.1)
      return {
        x: anywhere ? rand(0, w) : rand(-40, -5),
        y: h * (0.42 + 0.58 * Math.sqrt(Math.random())),
        vx: rand(0.35, 1.2) * (0.6 + size * 0.45),
        vy: rand(-0.12, 0.04),
        size,
        alpha: rand(0.25, 0.75),
        dark: Math.random() < 0.35,
        phase: rand(0, Math.PI * 2),
      }
    }

    const resize = () => {
      w = root.clientWidth
      h = root.clientHeight
      // La arena son puntitos: a resolución retina no se nota la diferencia y el canvas pesa 4 veces menos
      const dpr = Math.min(window.devicePixelRatio || 1, w * h > 600_000 ? 1 : 1.5)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(45, Math.min(130, Math.round((w * h) / 9000)))
      grains = Array.from({ length: count }, () => makeGrain(true))
      rectRef.current = null
    }

    let visible = true
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(root)
    const ro = new ResizeObserver(resize)
    ro.observe(root)
    resize()
    const forgetRect = () => (rectRef.current = null)
    window.addEventListener("scroll", forgetRect, { passive: true })

    burstRef.current = (x, y) => {
      for (let i = 0; i < 40; i++) {
        const angle = -Math.PI * 0.78 + rand(-0.45, 0.45)
        const speed = rand(1.6, 6.2)
        mist.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: rand(1.5, 4), life: 0, max: rand(55, 95) })
      }
    }

    let raf = 0
    let last = performance.now()
    let nextGust = last + 1800
    let shownX = NaN
    let shownY = NaN

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!visible || !activeRef.current) {
        last = now
        return
      }
      const dt = Math.min(3, (now - last) / 16.67)
      last = now

      // Sin mouse (o en el celular) el frasco se balancea solo
      const m = motion.current
      if (!m.dragging && now - m.lastInput > 2500) {
        m.tx = Math.sin(now * 0.00035) * 0.45
        m.ty = Math.cos(now * 0.00028) * 0.2
      }
      m.x += (m.tx - m.x) * 0.06 * dt
      m.y += (m.ty - m.y) * 0.06 * dt

      if (Math.abs(m.x - shownX) > 0.0004 || Math.abs(m.y - shownY) > 0.0004) {
        shownX = m.x
        shownY = m.y
        tilt.style.transform = `perspective(1100px) rotateY(${(m.x * 13).toFixed(2)}deg) rotateX(${(m.y * -5).toFixed(2)}deg) translate3d(${(m.x * 12).toFixed(1)}px,0,0)`
        shine.style.transform = `translate3d(${(m.x * 27.7).toFixed(2)}%,0,0)`
        dunes.forEach((d, i) => {
          const [px, py] = DUNE_DEPTH[i]
          d.style.transform = `translate3d(${(m.x * px).toFixed(1)}px,${(m.y * py).toFixed(1)}px,0)`
        })
      }

      ctx.clearRect(0, 0, w, h)

      // Granos de arena empujados por el viento (colores fijos y globalAlpha: no se crean strings por cuadro)
      for (const g of grains) {
        g.x += g.vx * dt
        g.y += (g.vy + Math.sin(now * 0.002 + g.phase) * 0.08) * dt
        if (g.x > w + 10 || g.y < h * 0.3) Object.assign(g, makeGrain(false))
      }
      ctx.fillStyle = "rgb(255,248,232)"
      for (const g of grains) {
        if (g.dark) continue
        ctx.globalAlpha = g.alpha
        ctx.fillRect(g.x, g.y, g.size, g.size)
      }
      ctx.fillStyle = "rgb(140,100,55)"
      for (const g of grains) {
        if (!g.dark) continue
        ctx.globalAlpha = g.alpha * 0.7
        ctx.fillRect(g.x, g.y, g.size, g.size)
      }

      // Cada tanto, una ráfaga
      if (now > nextGust) {
        const band = rand(h * 0.55, h * 0.88)
        for (let i = 0; i < Math.round(rand(14, 24)); i++) {
          streaks.push({ x: rand(-w * 0.4, 0), y: band + rand(-50, 50), vx: rand(7, 12), len: rand(30, 110), alpha: rand(0.14, 0.32) })
        }
        nextGust = now + rand(3500, 7000)
      }
      if (streaks.length) {
        ctx.lineCap = "round"
        ctx.lineWidth = 1
        ctx.strokeStyle = "rgb(255,246,226)"
        streaks = streaks.filter((s) => {
          s.x += s.vx * dt
          ctx.globalAlpha = s.alpha
          ctx.beginPath()
          ctx.moveTo(s.x - s.len, s.y)
          ctx.lineTo(s.x, s.y)
          ctx.stroke()
          return s.x - s.len < w
        })
      }

      // Nube de perfume al tocar el frasco
      if (mist.length) {
        mist = mist.filter((p) => {
          p.life += dt
          p.vx *= Math.pow(0.955, dt)
          p.vy = p.vy * Math.pow(0.955, dt) - 0.025 * dt
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.r *= Math.pow(1.022, dt)
          const a = 0.5 * (1 - p.life / p.max)
          ctx.fillStyle = "rgb(255,251,240)"
          ctx.globalAlpha = a * 0.35
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = a
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
          return p.life < p.max
        })
      }
      ctx.globalAlpha = 1
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener("scroll", forgetRect)
      burstRef.current = () => {}
    }
  }, [])

  const onPointerMove = (e: React.PointerEvent) => {
    const root = rootRef.current
    if (!root) return
    const m = motion.current
    if (e.pointerType === "mouse") {
      // El rect se guarda: leerlo en cada movimiento obligaría a Chrome a recalcular el layout
      const r = rectRef.current ?? (rectRef.current = root.getBoundingClientRect())
      m.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      m.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
      m.lastInput = performance.now()
    } else if (m.dragging) {
      m.tx = Math.max(-1, Math.min(1, m.startTx + (e.clientX - m.startX) / 140))
      m.lastInput = performance.now()
    }
  }

  const spritz = () => {
    const root = rootRef.current
    const bottle = bottleRef.current
    if (!root || !bottle) return
    const rr = root.getBoundingClientRect()
    const br = bottle.getBoundingClientRect()
    burstRef.current(br.left - rr.left + br.width * 0.4, br.top - rr.top + br.height * 0.07)
    setSpritzed(true)
  }

  return (
    <div ref={rootRef} onPointerMove={onPointerMove} className="absolute inset-0 overflow-hidden text-[#141f36]">
      {/* CIELO */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7f1e3_0%,#f1e4c9_42%,#e8d3ad_68%,#dcbd8e_100%)]" />

      {/* SOL que respira detrás del frasco */}
      <div
        aria-hidden="true"
        className="promo-sun absolute left-[72%] top-[58%] h-[86vw] w-[86vw] rounded-full bg-[radial-gradient(circle,rgba(238,196,128,0.75)_0%,rgba(238,196,128,0.28)_38%,rgba(238,196,128,0)_68%)] lg:left-[74%] lg:top-[46%] lg:h-[46rem] lg:w-[46rem]"
      />

      {/* DUNAS: tres capas a distinta profundidad */}
      <div aria-hidden="true" className="promo-dune absolute inset-0" style={{ animationDelay: "0ms" }}>
        <svg ref={(el) => void (duneRefs.current[0] = el)} className="absolute -inset-x-[4%] bottom-0 h-full w-[108%]" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id={`${ids}-far`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e7d2ab" />
              <stop offset="1" stopColor="#dcc195" />
            </linearGradient>
          </defs>
          <path
            d="M0 520 C 180 468, 330 438, 520 468 C 700 498, 820 428, 1010 408 C 1180 390, 1320 438, 1440 458 L1440 800 L0 800 Z"
            fill={`url(#${ids}-far)`}
            opacity="0.9"
          />
        </svg>
      </div>
      <div aria-hidden="true" className="promo-dune absolute inset-0" style={{ animationDelay: "140ms" }}>
        <svg ref={(el) => void (duneRefs.current[1] = el)} className="absolute -inset-x-[4%] bottom-0 h-full w-[108%]" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id={`${ids}-mid`} x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0" stopColor="#dbb98a" />
              <stop offset="0.55" stopColor="#d2ad7b" />
              <stop offset="1" stopColor="#c69f6c" />
            </linearGradient>
          </defs>
          <path
            d="M0 600 C 160 556, 300 520, 470 546 C 640 572, 760 604, 930 562 C 1100 520, 1260 498, 1440 538 L1440 800 L0 800 Z"
            fill={`url(#${ids}-mid)`}
          />
          <path
            d="M0 600 C 160 556, 300 520, 470 546 C 640 572, 760 604, 930 562 C 1100 520, 1260 498, 1440 538"
            fill="none"
            stroke="#f3e2c2"
            strokeWidth="2"
            opacity="0.7"
          />
        </svg>
      </div>
      <div aria-hidden="true" className="promo-dune absolute inset-0" style={{ animationDelay: "280ms" }}>
        <svg ref={(el) => void (duneRefs.current[2] = el)} className="absolute -inset-x-[4%] bottom-0 h-full w-[108%]" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id={`${ids}-near`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c89f6c" />
              <stop offset="1" stopColor="#a87e4e" />
            </linearGradient>
            <pattern id={`${ids}-sand`} patternUnits="userSpaceOnUse" width="1400" height="933">
              <image href="/promo/arena.jpg" width="1400" height="933" preserveAspectRatio="xMidYMid slice" />
            </pattern>
          </defs>
          <path
            d="M0 690 C 240 640, 420 618, 640 648 C 860 678, 1020 702, 1200 668 C 1300 652, 1380 648, 1440 654 L1440 800 L0 800 Z"
            fill={`url(#${ids}-near)`}
          />
          {/* El multiply queda adentro del SVG: se pinta una sola vez porque la duna tiene capa propia */}
          <path
            d="M0 690 C 240 640, 420 618, 640 648 C 860 678, 1020 702, 1200 668 C 1300 652, 1380 648, 1440 654 L1440 800 L0 800 Z"
            fill={`url(#${ids}-sand)`}
            opacity="0.45"
            style={{ mixBlendMode: "multiply" }}
          />
          <path
            d="M0 690 C 240 640, 420 618, 640 648 C 860 678, 1020 702, 1200 668 C 1300 652, 1380 648, 1440 654"
            fill="none"
            stroke="#ecd5ad"
            strokeWidth="2.5"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Arena volando por encima de las dunas y por detrás del contenido */}
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] h-full w-full" />

      {/* CONTENIDO: en celular el título va arriba y abajo la oferta al lado del frasco, como un aviso de revista */}
      <div className="relative z-10 mx-auto grid h-full w-full max-w-[1440px] grid-cols-[minmax(10.25rem,1fr)_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-4 px-6 pb-[100px] pt-6 sm:gap-x-8 sm:px-10 md:pb-28 md:pt-10 lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_auto_1fr] lg:gap-x-12 lg:gap-y-0 lg:px-16 lg:pb-24 lg:pt-0">
        {/* Resaltador dorado detrás de la base de las letras: se pinta después de que sube cada línea */}
        <h1
          style={DISPLAY}
          className="col-span-2 text-[clamp(3.25rem,15.5vw,6.25rem)] font-black uppercase leading-[0.86] tracking-[-0.02em] lg:col-span-7 lg:row-start-2 lg:text-[clamp(3.3rem,8.2vw,7.6rem)]"
        >
          <span className="block overflow-hidden pb-[0.04em]">
            <span className="hero-rise relative inline-block align-top" style={{ animationDelay: "350ms" }}>
              <span
                aria-hidden="true"
                className="promo-mark absolute -inset-x-[0.08em] bottom-[0.05em] -z-10 h-[0.36em] bg-[#c0a062]"
                style={{ animationDelay: "1250ms" }}
              />
              Promo
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] pr-[0.08em]">
            <span className="hero-rise relative inline-block align-top italic" style={{ animationDelay: "450ms" }}>
              <span
                aria-hidden="true"
                className="promo-mark absolute -inset-x-[0.06em] bottom-[0.05em] -z-10 h-[0.36em] bg-[#c0a062]"
                style={{ animationDelay: "1450ms" }}
              />
              especial
            </span>
          </span>
        </h1>

        <div className="self-center pb-6 lg:col-span-7 lg:row-start-3 lg:mt-6 lg:self-auto lg:pb-0">
          {/* Precio y regalo en Lora (la letra de texto del sitio): trazo parejo, se lee bien sobre la arena y a cualquier tamaño */}
          <p className="hero-fade font-sans text-[15px] font-medium leading-snug text-[#141f36] sm:text-xl md:text-2xl" style={{ animationDelay: "700ms" }}>
            En compras de decants desde{" "}
            <strong className="whitespace-nowrap text-[1.4em] font-bold tabular-nums tracking-[-0.01em]">$30.000</strong>
          </p>

          <div className="mt-3.5 lg:mt-6">
            <span
              className="promo-wipe inline-flex h-7 items-center bg-[#141f36] px-3 font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f6f4ed] sm:h-8 sm:px-3.5 sm:text-[12px] sm:tracking-[0.34em] lg:h-9 lg:px-4 lg:text-[13px]"
              style={{ animationDelay: "900ms" }}
            >
              Regalo
            </span>
            <p
              style={{ animationDelay: "1000ms" }}
              className="hero-fade mt-2.5 max-w-[34rem] text-balance font-sans text-[clamp(1.05rem,calc(5.4vw_-_3px),1.6rem)] font-semibold leading-[1.15] tracking-[-0.01em] sm:text-[clamp(1.4rem,3.8vw,2.3rem)] lg:mt-3 lg:text-[clamp(1.4rem,2.6vw,2.3rem)]"
            >
              Llevate un decant de 2{"\u00a0"}ml de{"\u00a0"}<span className="whitespace-nowrap font-bold">Grow Extrait</span>
            </p>
          </div>
        </div>

        {/* FRASCO */}
        <div className="relative flex min-h-0 items-center justify-center pb-10 [container-type:size] lg:col-span-5 lg:col-start-8 lg:row-span-5 lg:row-start-1 lg:items-end lg:pb-8">
          <div className="promo-rise relative" style={{ animationDelay: "500ms" }}>
            <div ref={tiltRef} className="relative will-change-transform">
              <div className="promo-float">
                <div
                  ref={bottleRef}
                  aria-hidden="true"
                  onClick={spritz}
                  onPointerDown={(e) => {
                    if (e.pointerType === "mouse") return
                    const m = motion.current
                    m.dragging = true
                    m.startX = e.clientX
                    m.startTx = m.x
                  }}
                  onPointerUp={() => (motion.current.dragging = false)}
                  onPointerCancel={() => (motion.current.dragging = false)}
                  className="relative h-[min(100cqh,190cqw,520px)] cursor-pointer touch-pan-y transition-transform duration-150 active:scale-[0.97] lg:h-[min(470px,80cqh)]"
                  style={{ aspectRatio: BOTTLE_RATIO }}
                >
                  <Image
                    src={BOTTLE_SRC}
                    alt="Grow Extrait de French Avenue"
                    fill
                    priority
                    sizes="(min-width: 1024px) 220px, 160px"
                    className="object-contain drop-shadow-[0_24px_30px_rgba(90,55,20,0.35)]"
                  />
                  {/* Brillo que recorre el vidrio, recortado con la silueta del frasco. Se mueve con transform, sin repintar */}
                  <div
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    style={{
                      WebkitMaskImage: `url(${BOTTLE_SRC})`,
                      maskImage: `url(${BOTTLE_SRC})`,
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                    }}
                  >
                    <div
                      ref={shineRef}
                      className="absolute inset-y-0 -left-[80%] w-[260%] bg-[linear-gradient(105deg,rgba(255,250,235,0)_32%,rgba(255,250,235,0.42)_48%,rgba(255,250,235,0)_64%)] will-change-transform"
                    />
                  </div>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="promo-shadow pointer-events-none absolute -bottom-3 left-1/2 h-7 w-[95%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(92,58,22,0.5)_0%,rgba(92,58,22,0)_70%)]"
              />
            </div>

            {/* En celular el sello va al lado de la tapa, donde no tapa el vidrio */}
            <div className="absolute -right-[14%] top-0 lg:-left-[62%] lg:right-auto lg:top-[10%]">
              <Seal />
            </div>

            <div className="absolute left-1/2 top-[calc(100%+16px)] -translate-x-1/2 lg:left-[calc(100%+28px)] lg:top-[46%] lg:translate-x-0">
              <p
                aria-hidden="true"
                className={`hero-fade flex w-max items-center gap-2.5 font-serif text-[15px] italic leading-tight text-[#141f36]/75 transition-opacity duration-700 lg:text-lg ${
                  spritzed ? "opacity-0" : ""
                }`}
                style={{ animationDelay: "2200ms" }}
              >
                <span className="hidden h-px w-6 bg-[#141f36]/40 lg:block" />
                Tocá el frasco
              </p>
            </div>
          </div>
        </div>

        <div
          className="hero-fade col-span-2 flex flex-wrap items-center gap-x-8 gap-y-3 lg:col-span-7 lg:row-start-4 lg:mt-10"
          style={{ animationDelay: "1150ms" }}
        >
          <Link
            href="/shop?category=decants"
            className="group inline-flex h-14 w-full items-center justify-center gap-4 bg-[#141f36] px-9 font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#f6f4ed] shadow-[0_14px_30px_-12px_rgba(20,31,54,0.55)] transition-colors duration-300 hover:bg-[#1f2d4a] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#141f36] sm:w-auto"
          >
            Elegir mis decants
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href={growHref}
            className="hidden font-serif text-xl italic text-[#141f36] underline decoration-[#141f36]/30 underline-offset-[6px] transition-colors hover:decoration-[#141f36] sm:inline"
          >
            Conocé Grow Extrait
          </Link>
        </div>
      </div>

      {/* Grano y viñeta para el look de película */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20" style={OVERLAY} />
    </div>
  )
}
