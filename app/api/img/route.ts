import sharp from "sharp"

// Normaliza las fotos de producto: recorta el margen vacío (blanco o transparente)
// alrededor del frasco y lo centra en un lienzo 3:4 fijo, para que todos los
// perfumes se vean del mismo tamaño aunque las fotos vengan de fuentes distintas.

const CANVAS_W = 600
const CANVAS_H = 800
const MARGIN = 0.08 // aire alrededor del frasco, en proporción del lienzo
const MAX_BYTES = 10 * 1024 * 1024

function isAllowedUrl(raw: string): URL | null {
  try {
    const u = new URL(raw)
    if (u.protocol !== "https:" && u.protocol !== "http:") return null
    const h = u.hostname
    // Evita que el proxy se use para pegarle a la red interna
    if (
      h === "localhost" ||
      h.endsWith(".local") ||
      /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(h) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
      h.includes(":")
    ) return null
    return u
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url") || ""
  const src = isAllowedUrl(raw)
  if (!src) return new Response("URL inválida", { status: 400 })

  try {
    const res = await fetch(src, { signal: AbortSignal.timeout(10_000) })
    const type = res.headers.get("content-type") || ""
    if (!res.ok || !type.startsWith("image/")) throw new Error(`fetch ${res.status} ${type}`)
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length > MAX_BYTES) throw new Error("imagen demasiado grande")

    // trim() toma el color de la esquina superior izquierda como fondo y lo recorta
    const trimmed = await sharp(buf).rotate().trim({ threshold: 25 }).toBuffer()

    const innerW = Math.round(CANVAS_W * (1 - MARGIN * 2))
    const innerH = Math.round(CANVAS_H * (1 - MARGIN * 2))
    const fitted = await sharp(trimmed)
      .resize(innerW, innerH, { fit: "inside" })
      .toBuffer({ resolveWithObject: true })

    const out = await sharp({
      create: { width: CANVAS_W, height: CANVAS_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([
        {
          input: fitted.data,
          left: Math.round((CANVAS_W - fitted.info.width) / 2),
          // apoyado abajo, como si los frascos estuvieran parados en un mismo estante
          top: CANVAS_H - Math.round(CANVAS_H * MARGIN) - fitted.info.height,
        },
      ])
      .webp({ quality: 85 })
      .toBuffer()

    return new Response(new Uint8Array(out), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
      },
    })
  } catch (err) {
    console.warn(`[img] no se pudo normalizar ${raw}:`, err)
    // Si algo falla, mostramos la foto original tal cual
    return Response.redirect(src.toString(), 302)
  }
}
