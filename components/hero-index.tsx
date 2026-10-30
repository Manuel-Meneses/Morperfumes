"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Pause, Play } from "lucide-react"

export interface HeroSlide {
  id: string
  label: string // Nombre en el índice (desktop)
  short: string // Nombre corto para el índice en mobile
  title: [string, string] // La segunda línea va en itálica dorada
  text: string
  cta: string
  href: string
  image?: string
  video?: string
  poster?: string
  count?: number
  unit?: string
}

const SLIDE_MS = 7000
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"

// Grano de papel muy sutil para que la foto se sienta impresa y no "pantalla"
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function HeroIndex({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [userPaused, setUserPaused] = useState(false)
  const [holding, setHolding] = useState(false) // mouse o foco sobre el índice
  const [inView, setInView] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const activeRef = useRef(0)
  const pointerType = useRef("mouse")
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const playing = !userPaused && !holding && inView

  const goTo = useCallback(
    (i: number) => {
      const next = (i + slides.length) % slides.length
      if (next === activeRef.current) return
      setPrev(activeRef.current)
      activeRef.current = next
      setActive(next)
    },
    [slides.length],
  )

  // Si el sistema pide menos movimiento, arrancamos en pausa y sin transiciones
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => {
      setReducedMotion(mq.matches)
      if (mq.matches) setUserPaused(true)
    }
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  // Cuando el hero sale de pantalla, frenamos el autoavance y el video
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === active && inView && !reducedMotion) {
        video.muted = true
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [active, inView, reducedMotion])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) goTo(activeRef.current + (dx < 0 ? 1 : -1))
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      goTo(activeRef.current + 1)
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      goTo(activeRef.current - 1)
    }
  }

  const slide = slides[active]

  const progressBar = (i: number) =>
    reducedMotion ? (
      <span className="absolute inset-0 bg-[#c0a062]" />
    ) : (
      <span
        className="hero-progress absolute inset-0 bg-[#c0a062]"
        style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: playing ? "running" : "paused" }}
        onAnimationEnd={() => goTo(i + 1)}
      />
    )

  const pauseButton = (className: string) => (
    <button
      type="button"
      onClick={() => setUserPaused((p) => !p)}
      aria-label={userPaused ? "Reanudar presentación" : "Pausar presentación"}
      className={`flex h-10 w-10 items-center justify-center text-[#f6f4ed]/70 transition-colors duration-300 hover:text-[#c0a062] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#c0a062] ${className}`}
    >
      {userPaused ? (
        <Play className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
      ) : (
        <Pause className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
      )}
    </button>
  )

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carrusel"
      aria-label="Colecciones de Mor Perfumes"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      className="relative isolate h-[calc(100svh-110px)] min-h-[620px] max-h-[1000px] touch-pan-y overflow-hidden bg-[#141f36] text-[#f6f4ed] md:h-[calc(100svh-112px)]"
    >
      {/* FOTOS: la nueva sube como un telón sobre la anterior, con un zoom lento */}
      {slides.map((s, i) => {
        const state = i === active ? "active" : i === prev ? "prev" : "idle"
        const animate = !reducedMotion && state !== "idle"
        return (
          <div
            key={s.id}
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden"
            style={{
              zIndex: state === "active" ? 2 : state === "prev" ? 1 : 0,
              clipPath: state === "idle" ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 0%)",
              transition: state === "active" && !reducedMotion ? `clip-path 1400ms ${EASE}` : "none",
            }}
          >
            <div
              className="absolute inset-0 [filter:saturate(0.9)_brightness(0.88)]"
              style={{
                transform: state === "idle" && !reducedMotion ? "scale(1.12)" : "scale(1)",
                transition: animate ? `transform 9000ms ${EASE}` : "none",
              }}
            >
              {s.video ? (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el
                  }}
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? "auto" : "none"}
                  poster={s.poster}
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={s.video} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={s.image || "/placeholder.jpg"}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className="object-cover"
                />
              )}
            </div>
          </div>
        )
      })}

      {/* VELOS: marino desde abajo en mobile; desde la izquierda y abajo en desktop */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(0deg,rgba(20,31,54,0.97)_0%,rgba(20,31,54,0.78)_42%,rgba(20,31,54,0.3)_100%)] lg:bg-[linear-gradient(90deg,rgba(20,31,54,0.92)_0%,rgba(20,31,54,0.62)_48%,rgba(20,31,54,0.4)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[3] hidden bg-[linear-gradient(0deg,rgba(20,31,54,0.9)_0%,rgba(20,31,54,0)_60%)] lg:block" />
      <div
        className="pointer-events-none absolute inset-0 z-[4] opacity-[0.09] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {pauseButton("absolute right-3 top-3 z-20 lg:hidden")}

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-end px-6 pb-24 sm:px-10 md:pb-28 lg:px-16">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-12">
          {/* TEXTO DE LA SLIDE ACTIVA */}
          <div className="lg:col-span-7" aria-live={playing ? "off" : "polite"}>
            <div key={slide.id}>
              <h1 className="font-serif text-[clamp(3.1rem,7vw,6rem)] font-medium leading-[0.92] tracking-[-0.02em] text-balance">
                <span className="block overflow-hidden pb-[0.06em] pr-[0.1em]">
                  <span className="hero-rise block">{slide.title[0]}</span>
                </span>
                <span className="block overflow-hidden pb-[0.14em] pr-[0.1em]">
                  <span className="hero-rise block font-light italic text-[#c0a062]" style={{ animationDelay: "90ms" }}>
                    {slide.title[1]}
                  </span>
                </span>
              </h1>

              <p
                className="hero-fade mt-5 max-w-[33rem] font-sans text-[15px] leading-relaxed text-[#f6f4ed]/85 sm:text-base lg:mt-7 lg:text-lg"
                style={{ animationDelay: "220ms" }}
              >
                {slide.text}
              </p>

              <div className="hero-fade mt-7 lg:mt-10" style={{ animationDelay: "320ms" }}>
                <Link
                  href={slide.href}
                  className="group inline-flex h-14 w-full items-center justify-center gap-4 bg-[#c0a062] px-9 text-[13px] font-semibold uppercase tracking-[0.22em] text-[#141f36] transition-colors duration-300 hover:bg-[#f6f4ed] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#c0a062] sm:w-auto"
                >
                  {slide.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* ÍNDICE DESKTOP: pasar el mouse cambia la foto, el clic entra */}
          <nav
            aria-label="Secciones"
            className="hidden lg:col-span-4 lg:col-start-9 lg:block"
            onMouseEnter={() => setHolding(true)}
            onMouseLeave={() => setHolding(false)}
            onFocus={() => setHolding(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setHolding(false)
            }}
          >
            <div className="mb-2 flex items-center justify-between border-b border-[#f6f4ed]/20 pb-2">
              <span className="font-serif text-lg italic text-[#f6f4ed]/70">Índice</span>
              {pauseButton("-mr-3")}
            </div>
            <ol>
              {slides.map((s, i) => {
                const isActive = i === active
                return (
                  <li key={s.id}>
                    <Link
                      href={s.href}
                      aria-current={isActive ? "true" : undefined}
                      aria-label={s.count ? `${s.label}, ${s.count} ${s.unit ?? ""}`.trim() : s.label}
                      onPointerDown={(e) => {
                        pointerType.current = e.pointerType
                      }}
                      onPointerEnter={(e) => {
                        if (e.pointerType === "mouse") goTo(i)
                      }}
                      onFocus={(e) => {
                        if (e.currentTarget.matches(":focus-visible")) goTo(i)
                      }}
                      onClick={(e) => {
                        // En pantallas táctiles, el primer toque muestra la foto y el segundo entra
                        if (pointerType.current !== "mouse" && i !== activeRef.current) {
                          e.preventDefault()
                          goTo(i)
                        }
                      }}
                      className="group/row flex items-center gap-4 py-3 outline-none focus-visible:[&>span:nth-child(2)]:underline focus-visible:[&>span:nth-child(2)]:decoration-[#c0a062] focus-visible:[&>span:nth-child(2)]:underline-offset-8"
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 shrink-0 rotate-45 bg-[#c0a062] transition-all duration-500 ${
                          isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        }`}
                      />
                      <span
                        className={`font-serif text-[1.75rem] leading-none transition-colors duration-300 xl:text-[2rem] ${
                          isActive ? "text-[#f6f4ed]" : "text-[#f6f4ed]/55 group-hover/row:text-[#f6f4ed]/85"
                        }`}
                      >
                        {s.label}
                      </span>
                      <span aria-hidden="true" className="relative h-px flex-1 overflow-hidden bg-[#f6f4ed]/20">
                        {isActive && progressBar(i)}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`min-w-6 text-right font-sans text-xs tabular-nums transition-colors duration-300 ${
                          isActive ? "text-[#c0a062]" : "text-[#f6f4ed]/60"
                        }`}
                      >
                        {s.count || ""}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </nav>

          {/* ÍNDICE MOBILE: tocar elige, deslizar la foto también */}
          <ol className="mt-9 flex gap-2.5 md:mt-12 lg:hidden">
            {slides.map((s, i) => {
              const isActive = i === active
              return (
                <li key={s.id} className="min-w-0 flex-auto">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Ver ${s.label}`}
                    className="block w-full pb-1 pt-3 text-left outline-none focus-visible:[&>span:last-child]:underline focus-visible:[&>span:last-child]:decoration-[#c0a062] focus-visible:[&>span:last-child]:underline-offset-4"
                  >
                    <span aria-hidden="true" className="relative block h-[2px] overflow-hidden bg-[#f6f4ed]/20">
                      {isActive && progressBar(i)}
                    </span>
                    <span
                      className={`mt-2.5 block truncate font-serif text-[15px] leading-tight transition-colors duration-300 sm:text-lg ${
                        isActive ? "text-[#f6f4ed]" : "text-[#f6f4ed]/60"
                      }`}
                    >
                      {s.short}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
