import Link from "next/link"
import { GEOMETRIC } from "@/components/promo-font"

// Los cinco frascos tal como están en la foto, de izquierda a derecha. Posición y tamaño en % de la escena (1536 × 1024).
const BOTTLES = [
  { id: "rome-extradose", name: "Rome Extradose", brand: "Bharara", x: 12.7, y: 43.2, w: 11.1, h: 35.7 },
  { id: "vulcan", name: "Vulcan", brand: "French Avenue", x: 28.3, y: 42.4, w: 9.2, h: 36.7 },
  { id: "bold-citrus", name: "Bottled Bold Citrus", brand: "Hugo Boss", x: 43, y: 45.3, w: 10.5, h: 35.3 },
  { id: "valhalla", name: "Valhalla", brand: "Rayhaan", x: 58.3, y: 47.1, w: 14, h: 33.5 },
  { id: "gentleman-society", name: "Gentleman Society", brand: "Givenchy", x: 75.7, y: 45.9, w: 11.2, h: 34.2 },
] as const

export type ClavoId = (typeof BOTTLES)[number]["id"]

// Polvo flotando en el haz de la lámpara: [left %, top %, tamaño px, duración s, demora s, dx px, dy px]
const DUST = [
  [88, 14, 2, 13, 0, -26, 60],
  [84, 22, 3, 16, 3.1, -34, 48],
  [90, 29, 2, 11, 6.4, -18, 70],
  [79, 31, 2, 14, 1.7, -40, 52],
  [86, 38, 3, 17, 8.2, -22, 64],
  [74, 41, 2, 12, 4.6, -30, 58],
  [81, 48, 2, 15, 10.3, -36, 44],
  [70, 53, 3, 18, 2.4, -20, 50],
  [77, 59, 2, 13, 7.5, -28, 40],
  [92, 45, 2, 14, 5.2, -16, 66],
  [68, 37, 2, 16, 9.1, -38, 54],
  [83, 64, 3, 12, 0.9, -24, 36],
]

export function PromoClavos({ hrefs }: { hrefs: Record<ClavoId, string> }) {
  return (
    // La geometría de la escena vive en .clavo-escena (globals.css): --sw/--sh/--st = ancho, alto y top de la foto; --u = 1px del póster
    <div style={GEOMETRIC} className="clavo-escena absolute inset-0 isolate overflow-hidden bg-[#0b0705] text-[#f2ebde] [container-type:size]">
      {/* ESCENA: la foto del taller con los frascos. En celular ocupa el ancho de los frascos y va abajo; en pantallas anchas cubre el hero */}
      <div className="absolute left-1/2 top-[var(--st)] h-[var(--sh)] w-[var(--sw)] -translate-x-1/2">
        <div className="clavo-push absolute inset-0">
          {/* La foto trae 432px de oscuridad extendida a cada lado del póster: si el hero es más ancho que 3:2 no aparecen bordes */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/promo/clavos-escena.webp" alt="" aria-hidden="true" decoding="async" className="absolute left-[-28.125%] top-0 h-full w-[156.25%] max-w-none" draggable={false} />

          {/* Haz de la lámpara que respira y el polvo que flota adentro */}
          <div
            aria-hidden="true"
            className="clavo-beam pointer-events-none absolute inset-0 bg-[conic-gradient(from_176deg_at_93%_6%,rgba(255,214,160,0)_0deg,rgba(255,214,160,0.07)_10deg,rgba(255,214,160,0.12)_19deg,rgba(255,214,160,0.06)_30deg,rgba(255,214,160,0)_40deg)] [mask-image:radial-gradient(circle_at_93%_6%,#000_0%,transparent_75%)]"
          />
          <div aria-hidden="true" className="clavo-beam pointer-events-none absolute right-[3%] top-0 size-[9%] -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(255,238,205,0.45)_0%,rgba(255,238,205,0)_70%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {DUST.map(([left, top, size, dur, delay, dx, dy], i) => (
              <span
                key={i}
                className="clavo-dust absolute rounded-full bg-[#fff1d6]"
                style={
                  {
                    left: `${left}%`,
                    top: `${top}%`,
                    width: size,
                    height: size,
                    "--dur": `${dur}s`,
                    "--dx": `${dx}px`,
                    "--dy": `${dy}px`,
                    "--o": size > 2 ? 0.55 : 0.4,
                    animationDelay: `${delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Cada frasco de la foto es un link a su decant */}
          {BOTTLES.map((b) => (
            <Link
              key={b.id}
              href={hrefs[b.id]}
              aria-label={`${b.name} de ${b.brand}: 20% de descuento`}
              className="group absolute outline-none"
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,232,196,0.55)_0%,rgba(255,232,196,0)_70%)] opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
              <span aria-hidden="true" className="absolute -inset-1.5 hidden outline outline-1 outline-[#f2ebde]/70 group-focus-visible:block" />
              <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap bg-[#f2ebde] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a120c] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 lg:block">
                {b.name}
              </span>
            </Link>
          ))}
        </div>

        {/* En celular la foto se funde con el fondo arriba y abajo */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-[linear-gradient(180deg,#0b0705_0%,rgba(11,7,5,0.85)_30%,rgba(11,7,5,0)_100%)] wide:hidden" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[20%] bg-[linear-gradient(0deg,#0b0705_0%,rgba(11,7,5,0)_100%)] wide:hidden" />
      </div>

      {/* La lámpara se prende al entrar la promo */}
      <div aria-hidden="true" className="clavo-lights pointer-events-none absolute inset-0 bg-[#050302]" />

      {/* Penumbra al pie de la mesa: despega la firma y los indicadores del slider de la textura de la madera */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[14%] bg-[linear-gradient(0deg,rgba(8,5,3,0.65)_0%,rgba(8,5,3,0)_100%)] wide:block" />

      {/* TEXTO. En celular va apilado y centrado arriba de los frascos; en pantallas anchas copia las medidas del póster (en unidades --u) */}
      <h2 className="absolute inset-x-0 top-0 flex h-[calc(var(--st)_+_var(--sh)_*_0.41)] flex-col items-center justify-center px-4 pt-4 text-center uppercase [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] wide:left-1/2 wide:right-auto wide:top-[calc(var(--st)_+_var(--u)_*_96.1)] wide:h-auto wide:-translate-x-1/2 wide:justify-start wide:p-0">
        <span className="hero-fade block pl-[0.38em] text-[clamp(11px,3.2cqw,15px)] font-medium leading-none tracking-[0.38em] wide:pl-[0.46em] wide:text-[length:calc(var(--u)_*_25.8)] wide:tracking-[0.46em]" style={{ animationDelay: "500ms" }}>
          Promo especial
        </span>

        <span className="mt-[min(4cqw,2.2cqh)] flex flex-col items-center font-extrabold leading-none wide:mt-[calc(var(--u)_*_20.1)] wide:flex-row wide:items-start wide:pl-[calc(var(--u)_*_20)]">
          <span className="block overflow-hidden wide:mt-[calc(var(--u)_*_9.3)]">
            <span className="hero-rise block text-[min(30cqw,17cqh)] leading-[0.82] tracking-[-0.045em] wide:text-[length:calc(var(--u)_*_134.3)] wide:leading-none wide:tracking-[0.005em]" style={{ animationDelay: "650ms" }}>
              20%
            </span>
          </span>
          <span className="mt-[min(1.2cqw,0.7cqh)] block overflow-hidden wide:ml-[calc(var(--u)_*_25.4)] wide:mt-[calc(var(--u)_*_6.5)]">
            <span className="hero-rise block text-[min(14.6cqw,8.4cqh)] leading-[0.86] tracking-[-0.035em] wide:text-[length:calc(var(--u)_*_121.8)] wide:leading-none wide:tracking-[-0.04em]" style={{ animationDelay: "780ms" }}>
              Descuento
            </span>
          </span>
        </span>

        <span className="hero-fade mt-[min(4.6cqw,2.6cqh)] block pl-[0.34em] text-[clamp(12px,3.8cqw,17px)] font-medium leading-none tracking-[0.34em] wide:-mt-[calc(var(--u)_*_16.2)] wide:pl-[0.37em] wide:text-[length:calc(var(--u)_*_30.1)] wide:tracking-[0.37em]" style={{ animationDelay: "1000ms" }}>
          En los decants
        </span>

        <span aria-hidden="true" className="promo-mark mt-[min(3.6cqw,2cqh)] block h-[2px] w-[min(30cqw,140px)] bg-[#f2ebde] wide:mt-[calc(var(--u)_*_16.5)] wide:h-[max(1px,calc(var(--u)_*_2))] wide:w-[calc(var(--u)_*_135)]" style={{ animationDelay: "1150ms", transformOrigin: "center" }} />

        <span className="mt-[min(3cqw,1.7cqh)] block overflow-hidden wide:mt-[calc(var(--u)_*_9.7)]">
          <span className="hero-rise block text-[min(12cqw,7cqh)] font-extrabold leading-[0.86] tracking-[0.04em] wide:text-[length:calc(var(--u)_*_82)] wide:leading-none wide:tracking-[0.066em]" style={{ animationDelay: "1250ms" }}>
            Clavos
          </span>
        </span>
      </h2>

      {/* Firma del póster: en pantallas anchas, sobre la mesa y por arriba de los indicadores del slider */}
      <a
        href="https://instagram.com/morperfumes_"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram de Mor Perfumes"
        className="hero-fade absolute left-1/2 top-[min(calc(var(--st)_+_var(--u)_*_917),calc(100cqh_-_78px))] hidden -translate-x-1/2 text-[length:max(13px,calc(var(--u)_*_22))] leading-none tracking-[0.14em] text-[#f2ebde]/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.8)] transition-colors hover:text-[#f2ebde] wide:block"
        style={{ animationDelay: "1400ms" }}
      >
        @morperfumes_
      </a>
    </div>
  )
}
