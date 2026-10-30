"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Command } from "cmdk"
import { ArrowRight, Search, X } from "lucide-react"
import { getProducts, type Product } from "@/lib/api"

const WA_NUMBER = "5493516087006"
const MAX_RESULTS = 40

type Format = "decant" | "sellado"
type Segment = "arabes" | "raros" | "disenador" | "nicho"
type Gender = "M" | "F" | "U"

interface Field {
  label: string
  text: string
  norm: string
  rank: number // 0 = nombre, 1 = marca, 2 = estilo, 3 = notas, 4 = ideal para
}

interface Entry {
  product: Product
  name: string
  format: Format
  segments: Segment[]
  gender: Gender | null
  fields: Field[]
}

interface Result {
  entry: Entry
  score: number
  snippet: Field | null
}

const FORMAT_CHIPS: { id: Format; label: string }[] = [
  { id: "decant", label: "Decants" },
  { id: "sellado", label: "Sellados" },
]
const SEGMENT_CHIPS: { id: Segment; label: string }[] = [
  { id: "arabes", label: "Árabes" },
  { id: "raros", label: "Árabes raros" },
  { id: "disenador", label: "Diseñador" },
  { id: "nicho", label: "Nicho" },
]
const GENDER_CHIPS: { id: Gender; label: string }[] = [
  { id: "M", label: "Masculino" },
  { id: "F", label: "Femenino" },
  { id: "U", label: "Unisex" },
]
const GENDER_LABEL: Record<Gender, string> = { M: "Masculino", F: "Femenino", U: "Unisex" }

// CACHÉ EN MEMORIA: el catálogo se pide una sola vez, la primera vez que se abre el buscador
let productsPromise: Promise<Product[]> | null = null

function loadProducts() {
  if (!productsPromise) {
    productsPromise = getProducts()
      .catch(() => [] as Product[])
      .then((list) => {
        if (list.length === 0) productsPromise = null // si falló, el próximo intento vuelve a pedir
        return list
      })
  }
  return productsPromise
}

// Normaliza letra por letra (sin tildes, minúsculas) y recuerda la posición original de cada una
function normChars(text: string) {
  let norm = ""
  const map: number[] = []
  for (let i = 0; i < text.length; i++) {
    const n = text[i].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    for (let k = 0; k < n.length; k++) {
      norm += n[k]
      map.push(i)
    }
  }
  return { norm, map }
}

function toEntry(p: Product): Entry {
  const cat = normChars(p.category || "").norm
  const segments: Segment[] = []
  if (cat.includes("arabe")) segments.push("arabes")
  if (cat.includes("raro")) segments.push("raros")
  if (cat.includes("disenador")) segments.push("disenador")
  if (cat.includes("nicho")) segments.push("nicho")

  const g = p.details?.find((d) => d.startsWith("Género:"))?.split(":")[1]?.trim().charAt(0).toUpperCase()
  const gender = g === "M" || g === "F" || g === "U" ? g : null

  // Los perfumes por encargo traen el género pegado al nombre: "Hero EDT (M)"
  const name = p.name.replace(/\s*\((M|F|U)\)\s*$/i, "")

  const field = (label: string, text: string | undefined, rank: number): Field | null =>
    text ? { label, text, norm: normChars(text).norm, rank } : null

  return {
    product: p,
    name,
    format: p.availability === "stock" ? "decant" : "sellado",
    segments,
    gender,
    fields: [
      field("Nombre", name, 0),
      field("Marca", p.brand, 1),
      field("Estilo", p.category, 2),
      field("", p.notes, 3),
      field("Notas", p.olfactoryNotes, 3),
      field("Ideal para", p.idealFor, 4),
    ].filter((f): f is Field => f !== null),
  }
}

function runSearch(
  entries: Entry[],
  tokens: string[],
  filters: { format: Format | null; segment: Segment | null; gender: Gender | null },
) {
  const results: Result[] = []

  for (const entry of entries) {
    if (filters.format && entry.format !== filters.format) continue
    if (filters.segment && !entry.segments.includes(filters.segment)) continue
    if (filters.gender && entry.gender !== filters.gender) continue

    let score = 0
    let snippet: Field | null = null
    let matches = true

    for (const token of tokens) {
      let best: Field | null = null
      let bestScore = Infinity
      for (const f of entry.fields) {
        const at = f.norm.indexOf(token)
        if (at === -1) continue
        // Premiamos que la palabra empiece con lo buscado
        const s = f.rank * 2 + (at === 0 || /[\s(/-]/.test(f.norm[at - 1]) ? 0 : 1)
        if (s < bestScore) {
          best = f
          bestScore = s
        }
      }
      if (!best) {
        matches = false
        break
      }
      score += bestScore
      if (best.rank >= 3 && !snippet) snippet = best
    }

    if (matches) results.push({ entry, score, snippet })
  }

  return results.sort(
    (a, b) =>
      a.score - b.score ||
      Number(!!b.entry.product.isFeatured) - Number(!!a.entry.product.isFeatured) ||
      a.entry.name.localeCompare(b.entry.name, "es"),
  )
}

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) return <>{text}</>
  const { norm, map } = normChars(text)
  const marked = new Array<boolean>(text.length).fill(false)
  for (const token of tokens) {
    let from = 0
    let at: number
    while ((at = norm.indexOf(token, from)) !== -1) {
      for (let k = at; k < at + token.length; k++) marked[map[k]] = true
      from = at + token.length
    }
  }

  const parts: React.ReactNode[] = []
  let i = 0
  while (i < text.length) {
    let j = i
    while (j < text.length && marked[j] === marked[i]) j++
    const chunk = text.slice(i, j)
    parts.push(
      marked[i] ? (
        <mark key={i} className="bg-[#c0a062]/30 text-inherit">
          {chunk}
        </mark>
      ) : (
        chunk
      ),
    )
    i = j
  }
  return <>{parts}</>
}

// Recorta un texto largo alrededor de la primera coincidencia
function excerpt(text: string, tokens: string[], radius = 46) {
  const { norm, map } = normChars(text)
  const hit = tokens.map((t) => norm.indexOf(t)).find((at) => at !== -1)
  if (hit === undefined || text.length <= radius * 2) return text
  const center = map[hit]
  let start = Math.max(0, center - radius)
  let end = Math.min(text.length, center + radius)
  if (start > 0) start = text.indexOf(" ", start) + 1 || start
  if (end < text.length) end = text.lastIndexOf(" ", end) > center ? text.lastIndexOf(" ", end) : end
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`
}

// Miniaturas livianas cuando el servidor de la foto lo permite
function thumb(url: string) {
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/c_fit,w_160,h_180,q_auto,f_auto/")
  }
  if (url.includes("/cdn/shop/")) {
    try {
      const u = new URL(url)
      u.searchParams.set("width", "160")
      return u.toString()
    } catch {
      return url
    }
  }
  return url
}

function Thumb({ src }: { src: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="relative flex h-16 w-14 shrink-0 items-center justify-center bg-[#e6e2d3]/60">
      {failed ? (
        <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-[#c0a062]/60" />
      ) : (
        <Image
          src={thumb(src)}
          alt=""
          fill
          sizes="56px"
          onError={() => setFailed(true)}
          className="object-contain p-1.5"
        />
      )}
    </div>
  )
}

function topNotes(entries: Entry[]) {
  const counts = new Map<string, { label: string; count: number }>()
  for (const e of entries) {
    const notes = e.product.olfactoryNotes
    if (!notes || !notes.includes("•")) continue
    for (const raw of notes.split("•")) {
      const label = raw.trim()
      if (!label || label.length > 18) continue
      const key = normChars(label).norm
      const current = counts.get(key)
      counts.set(key, { label: current?.label ?? label.charAt(0).toUpperCase() + label.slice(1), count: (current?.count ?? 0) + 1 })
    }
  }
  return [...counts.values()]
    .filter((n) => n.count >= 3)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map((n) => n.label)
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-9 shrink-0 border px-3.5 font-sans text-[13px] transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#c0a062] ${
        active
          ? "border-[#141f36] bg-[#141f36] text-[#f6f4ed]"
          : "border-[#141f36]/20 text-[#141f36]/80 hover:border-[#141f36]/50 hover:text-[#141f36]"
      }`}
    >
      {children}
    </button>
  )
}

export function SearchCommand() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState<Product[] | null>(null)
  const [query, setQuery] = useState("")
  const [format, setFormat] = useState<Format | null>(null)
  const [segment, setSegment] = useState<Segment | null>(null)
  const [gender, setGender] = useState<Gender | null>(null)
  const [selection, setSelection] = useState({ key: "", value: "" })

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const fetchCatalog = () => {
    setProducts(null)
    loadProducts().then(setProducts)
  }

  useEffect(() => {
    if (open && !products) fetchCatalog()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Atajos: "/" o Ctrl/Cmd + K abren el buscador
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      if ((e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const entries = useMemo(() => (products ?? []).map(toEntry), [products])
  const notes = useMemo(() => topNotes(entries), [entries])

  // Solo mostramos los filtros que tienen al menos un perfume
  const available = useMemo(
    () => ({
      format: new Set(entries.map((e) => e.format)),
      segment: new Set(entries.flatMap((e) => e.segments)),
      gender: new Set(entries.map((e) => e.gender)),
    }),
    [entries],
  )

  const tokens = useMemo(() => normChars(query.trim()).norm.split(/\s+/).filter(Boolean), [query])
  const browsing = tokens.length === 0 && !format && !segment && !gender

  const results = useMemo(() => {
    if (browsing) {
      const featured = entries.filter((e) => e.product.isFeatured)
      return (featured.length > 0 ? featured : entries.slice(0, 6)).map((entry) => ({ entry, score: 0, snippet: null }))
    }
    return runSearch(entries, tokens, { format, segment, gender })
  }, [browsing, entries, tokens, format, segment, gender])

  const shown = results.slice(0, MAX_RESULTS)

  // Cada búsqueda nueva arranca con el primer resultado elegido y la lista arriba.
  // La selección se deriva en el mismo render para que cmdk no salte al resultado anterior.
  const resultsKey = `${tokens.join(" ")}|${format}|${segment}|${gender}|${entries.length}`
  const selected = selection.key === resultsKey ? selection.value : (shown[0]?.entry.product.id ?? "")

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 })
  }, [resultsKey])

  const goTo = (id: string) => {
    setOpen(false)
    router.push(`/product/${id}`)
  }

  const toggle = <T,>(value: T, current: T | null, set: (v: T | null) => void) => {
    set(current === value ? null : value)
    inputRef.current?.focus()
  }

  const waText = query.trim()
    ? `¡Hola León e Indio! Estoy buscando el perfume ${query.trim()}, ¿lo pueden conseguir?`
    : "¡Hola León e Indio! Estoy buscando un perfume que no encuentro en el catálogo."
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`

  const loading = open && products === null
  const failed = products !== null && products.length === 0

  const countLabel = browsing
    ? "Selección del mes"
    : results.length > MAX_RESULTS
      ? `Mostrando ${MAX_RESULTS} de ${results.length}, afiná la búsqueda`
      : `${results.length} ${results.length === 1 ? "perfume" : "perfumes"}`

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          onPointerEnter={() => loadProducts()}
          onFocus={() => loadProducts()}
          aria-label="Buscar perfumes"
          aria-keyshortcuts="/ Control+K Meta+K"
          // Se ve como una barra de búsqueda, pero abre el buscador completo (resultados con foto, filtros y notas)
          className="group flex h-10 w-full min-w-0 items-center gap-2.5 border border-[#141f36]/25 bg-white/50 px-3 text-left md:max-lg:justify-center md:max-lg:px-0 text-[#141f36] transition-colors duration-300 hover:border-[#141f36]/55 hover:bg-white/80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#c0a062]"
        >
          <Search className="h-4 w-4 shrink-0 text-[#141f36]/60 transition-colors duration-300 group-hover:text-[#c0a062]" />
          <span className="min-w-0 flex-1 truncate font-serif md:max-lg:hidden text-base text-[#141f36]/65 xl:text-[17px]">
            <span className="xl:hidden">Buscar perfumes</span>
            <span className="hidden xl:inline">Buscá perfume, marca o nota</span>
          </span>
          <kbd aria-hidden="true" className="hidden h-6 min-w-6 shrink-0 items-center justify-center border border-[#141f36]/20 px-1.5 font-sans text-[11px] text-[#141f36]/55 xl:flex">
            /
          </kbd>
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#141f36]/60 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            inputRef.current?.focus()
          }}
          className="fixed inset-x-0 top-0 z-50 flex h-[100svh] flex-col bg-[#f6f4ed] text-[#141f36] shadow-[0_24px_60px_-24px_rgba(20,31,54,0.5)] outline-none duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-4 data-[state=closed]:duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-8 md:h-auto md:max-h-[min(88svh,820px)]"
        >
          <DialogPrimitive.Title className="sr-only">Buscar perfumes</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Buscá por nombre, marca o nota olfativa y filtrá por tipo de perfume.
          </DialogPrimitive.Description>

          <Command
            shouldFilter={false}
            value={selected}
            onValueChange={(value) => setSelection({ key: resultsKey, value })}
            label="Buscar perfumes"
            className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-5 sm:px-8"
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-[#141f36]/20 pt-3 md:gap-4 md:pt-8">
              <Search className="h-5 w-5 shrink-0 text-[#141f36]/60" aria-hidden="true" />
              <Command.Input
                ref={inputRef}
                value={query}
                onValueChange={setQuery}
                placeholder="Buscá por nombre, marca o nota"
                className="h-16 w-full min-w-0 bg-transparent font-serif text-2xl text-[#141f36] caret-[#c0a062] outline-none placeholder:text-[#141f36]/55 md:h-20 md:text-[2rem]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("")
                    inputRef.current?.focus()
                  }}
                  className="shrink-0 px-1 font-sans text-xs uppercase tracking-[0.18em] text-[#141f36]/65 transition-colors hover:text-[#141f36]"
                >
                  Borrar
                </button>
              )}
              <DialogPrimitive.Close
                aria-label="Cerrar búsqueda"
                className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-[#141f36]/70 transition-colors hover:text-[#141f36] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#c0a062]"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>

            {/* FILTROS POR TIPO */}
            {!failed && (
              <div className="-mx-5 flex shrink-0 items-center gap-2 overflow-x-auto px-5 py-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
                {FORMAT_CHIPS.filter((c) => available.format.has(c.id)).map((c) => (
                  <Chip key={c.id} active={format === c.id} onClick={() => toggle(c.id, format, setFormat)}>
                    {c.label}
                  </Chip>
                ))}
                <span aria-hidden="true" className="mx-1.5 h-5 w-px shrink-0 bg-[#141f36]/15" />
                {SEGMENT_CHIPS.filter((c) => available.segment.has(c.id)).map((c) => (
                  <Chip key={c.id} active={segment === c.id} onClick={() => toggle(c.id, segment, setSegment)}>
                    {c.label}
                  </Chip>
                ))}
                <span aria-hidden="true" className="mx-1.5 h-5 w-px shrink-0 bg-[#141f36]/15" />
                {GENDER_CHIPS.filter((c) => available.gender.has(c.id)).map((c) => (
                  <Chip key={c.id} active={gender === c.id} onClick={() => toggle(c.id, gender, setGender)}>
                    {c.label}
                  </Chip>
                ))}
              </div>
            )}

            {browsing && notes.length > 0 && (
              <div className="flex shrink-0 flex-wrap items-baseline gap-x-4 gap-y-1 pb-3">
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#141f36]/65">Buscá por nota</span>
                {notes.map((note) => (
                  <button
                    key={note}
                    type="button"
                    onClick={() => {
                      setQuery(note)
                      inputRef.current?.focus()
                    }}
                    className="font-serif text-lg italic text-[#141f36]/80 underline decoration-[#141f36]/20 underline-offset-4 transition-colors hover:text-[#141f36] hover:decoration-[#c0a062]"
                  >
                    {note}
                  </button>
                ))}
              </div>
            )}

            <Command.List
              ref={listRef}
              className="-mx-3 min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-[#141f36]/10 px-3 py-2 [scrollbar-color:#c0a06280_transparent] [scrollbar-width:thin]"
            >
              {loading &&
                [0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-3" aria-hidden="true">
                    <div className="h-16 w-14 shrink-0 animate-pulse bg-[#e6e2d3]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/2 animate-pulse bg-[#e6e2d3]" />
                      <div className="h-3 w-1/3 animate-pulse bg-[#e6e2d3]/70" />
                    </div>
                  </div>
                ))}

              {failed && (
                <div className="py-12 text-center">
                  <p className="font-serif text-2xl">No pudimos cargar el catálogo.</p>
                  <p className="mt-2 font-sans text-sm text-[#141f36]/70">Revisá tu conexión e intentá de nuevo.</p>
                  <button
                    type="button"
                    onClick={fetchCatalog}
                    className="mt-6 h-11 border border-[#141f36] px-6 font-sans text-xs uppercase tracking-[0.2em] transition-colors hover:bg-[#141f36] hover:text-[#f6f4ed]"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {!loading && !failed && shown.length === 0 && (
                <div className="py-12 text-center">
                  <p className="font-serif text-2xl">
                    {query.trim() ? <>No encontramos «{query.trim()}»</> : "No hay perfumes con esos filtros"}
                  </p>
                  <p className="mx-auto mt-2 max-w-sm font-sans text-sm leading-relaxed text-[#141f36]/70">
                    Probá con otra nota o marca, o escribinos y lo buscamos por encargo.
                  </p>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex h-12 items-center gap-3 bg-[#141f36] px-6 font-sans text-xs uppercase tracking-[0.2em] text-[#f6f4ed] transition-colors hover:bg-[#1f2d4a]"
                  >
                    Consultar por WhatsApp
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              )}

              {!loading && !failed && shown.length > 0 && (
                <Command.Group
                  heading={browsing ? "Destacados" : undefined}
                  className="[&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-sans [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-[#141f36]/65"
                >
                  {shown.map(({ entry, snippet }) => {
                    const p = entry.product
                    const meta = [
                      entry.format === "decant" ? "Decant" : "Frasco sellado",
                      p.category,
                      entry.gender ? GENDER_LABEL[entry.gender] : null,
                    ].filter(Boolean)
                    const description = snippet ? excerpt(snippet.text, tokens) : p.notes || p.olfactoryNotes || ""
                    const price =
                      p.price > 0 ? (
                        <p className="font-serif text-lg leading-none tabular-nums">
                          {entry.format === "decant" && (
                            <span className="mr-1 font-sans text-[10px] uppercase tracking-[0.14em] text-[#141f36]/65">
                              desde
                            </span>
                          )}
                          ${p.price.toLocaleString("es-AR")}
                        </p>
                      ) : (
                        <p className="font-serif text-base italic text-[#141f36]/70">Consultar</p>
                      )
                    return (
                      <Command.Item
                        key={p.id}
                        value={p.id}
                        onSelect={() => goTo(p.id)}
                        className="-mx-3 flex cursor-pointer items-center gap-4 px-3 py-3 transition-colors duration-150 data-[selected=true]:bg-[#e6e2d3]/70 sm:gap-5"
                      >
                        <Thumb src={p.image || "/placeholder.svg"} />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 font-serif text-xl leading-tight sm:line-clamp-1">
                            <Highlight text={entry.name} tokens={tokens} />
                          </p>
                          <p className="mt-1 truncate font-sans text-[11px] uppercase tracking-[0.08em] text-[#141f36]/65 sm:tracking-[0.14em]">
                            {meta.join(" · ")}
                          </p>
                          {description && (
                            <p className="mt-1 line-clamp-1 font-sans text-[13px] italic text-[#141f36]/75">
                              {snippet?.label && <span className="not-italic text-[#141f36]/65">{snippet.label}: </span>}
                              <Highlight text={description} tokens={snippet ? tokens : []} />
                            </p>
                          )}
                          <div className="mt-1.5 sm:hidden">{price}</div>
                        </div>
                        <div className="hidden shrink-0 text-right sm:block">{price}</div>
                      </Command.Item>
                    )
                  })}
                </Command.Group>
              )}
            </Command.List>

            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#141f36]/10 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <span className="font-sans text-xs text-[#141f36]/65">{loading || failed ? "" : countLabel}</span>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center gap-2 text-right font-serif text-base italic text-[#141f36] transition-colors hover:text-[#8a6d35]"
              >
                <span className="hidden sm:inline">¿No lo encontrás?</span> Lo buscamos por encargo
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
