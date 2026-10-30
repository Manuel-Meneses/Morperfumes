"use client"

import { useEffect, useRef, useState } from "react"
import { PromoGrowExtrait } from "@/components/promo-grow-extrait"
import { PromoClavos, type ClavoId } from "@/components/promo-clavos"

const SLIDE_MS = 9000

export function PromoHero({ growHref, clavoHrefs }: { growHref: string; clavoHrefs: Record<ClavoId, string> }) {
  // Cada promo es una slide. Para sumar o sacar una, editá esta lista.
  // theme: color de los indicadores sobre el fondo de esa promo.
  const slides = [
    {
      id: "grow-extrait",
      label: "Regalo Grow Extrait",
      theme: "light",
      render: (active: boolean) => <PromoGrowExtrait active={active} growHref={growHref} />,
    },
    {
      id: "clavos",
      label: "20% en decants clavos",
      theme: "dark",
      render: () => <PromoClavos hrefs={clavoHrefs} />,
    },
  ] as const

  const [current, setCurrent] = useState(0)
  // Cuántas veces se mostró cada slide: al cambiar la key se vuelve a montar y repite su animación de entrada
  const [visits, setVisits] = useState<number[]>(() => slides.map((_, i) => (i === 0 ? 1 : 0)))
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const multiple = slides.length > 1
  const dark = slides[current].theme === "dark"

  const goTo = (i: number) => {
    const next = (i + slides.length) % slides.length
    if (next === current) return
    setCurrent(next)
    setVisits((v) => v.map((n, j) => (j === next ? n + 1 : n)))
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true)
  }, [])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || !multiple) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2) goTo(current + (dx < 0 ? 1 : -1))
  }

  return (
    <section
      aria-roledescription={multiple ? "carrusel" : undefined}
      aria-label="Promociones"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => multiple && setPaused(true)}
      onMouseLeave={() => multiple && setPaused(false)}
      className="relative isolate h-[calc(100svh-110px)] min-h-[540px] max-h-[1000px] overflow-hidden bg-[#efe2c8] md:h-[calc(100svh-112px)] md:min-h-[640px]"
    >
      {slides.map((slide, i) => {
        const isActive = i === current
        return (
          <div
            key={`${slide.id}-${visits[i]}`}
            aria-roledescription={multiple ? "slide" : undefined}
            aria-label={multiple ? `${i + 1} de ${slides.length}: ${slide.label}` : undefined}
            inert={!isActive}
            // La slide oculta congela sus animaciones: no gasta placa de video mientras no se ve
            className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? "" : "promo-paused"}`}
            style={{ opacity: isActive ? 1 : 0, zIndex: isActive ? 1 : 0 }}
          >
            {slide.render(isActive)}
          </div>
        )
      })}

      {multiple && (
        // En celular van a la izquierda, justo arriba de la barra de WhatsApp
        <div className="absolute bottom-[66px] left-6 z-30 flex gap-2 sm:left-10 md:bottom-8 md:left-1/2 md:-translate-x-1/2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver promo: ${slide.label}`}
              aria-current={i === current ? "true" : undefined}
              className="py-2.5 md:py-3"
            >
              <span className={`relative block h-[2px] w-10 overflow-hidden transition-colors duration-700 ${dark ? "bg-[#f6f4ed]/25" : "bg-[#141f36]/20"}`}>
                {i === current && (
                  <span
                    key={`${current}-${visits[current]}`}
                    className={`hero-progress absolute inset-0 ${dark ? "bg-[#f6f4ed]" : "bg-[#141f36]"}`}
                    style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                    onAnimationEnd={() => goTo(current + 1)}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
