"use server"

import Papa from "papaparse"
import { getProducts, SHEET_ID_STOCK } from "./api"

// ======================================================================
// CUPONES DE DESCUENTO (se cargan desde la planilla, pestaña "Cupones")
// ======================================================================
// Columnas esperadas en la pestaña "Cupones" de la planilla de stock:
//   Código | Descuento % | Aplica a | Activo | Vence
//
// - Código:      el texto que escribe el cliente (no distingue mayúsculas).
// - Descuento %: número, ej: 15
// - Aplica a:    "Todo" (o vacío) = todos los productos.
//                Otro texto, ej "Diseñador" = solo decants cuyo Segmento lo contenga.
// - Activo:      SI / NO
// - Vence:       opcional, formato dd/mm/aaaa (vale hasta ese día inclusive).
//
// La validación corre en el servidor: el navegador nunca ve la lista de códigos.

const URL_CUPONES = `https://docs.google.com/spreadsheets/d/${SHEET_ID_STOCK}/gviz/tq?tqx=out:csv&sheet=Cupones`

export type CuponAplicado = {
  code: string
  percent: number
  appliesTo: string
  eligibleIds: string[]
}

export type ResultadoCupon = ({ ok: true } & CuponAplicado) | { ok: false; error: string }

const normalize = (str: string) =>
  (str || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim()

function parseFecha(str: string): Date | null {
  const m = (str || "").trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return null
  // Fin del día indicado, para que el cupón valga todo ese día
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 23, 59, 59)
}

async function fetchCupones(): Promise<Record<string, string>[]> {
  try {
    const response = await fetch(URL_CUPONES, { cache: "no-store" })
    const csvText = await response.text()
    if (csvText.includes("<!DOCTYPE html>")) return []
    const parsed = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => normalize(h),
    })
    // Si la pestaña "Cupones" no existe, Google devuelve la primera hoja (productos).
    // Sin columna "codigo" asumimos que no hay cupones configurados.
    if (!parsed.meta.fields?.some((f) => f.includes("codigo"))) return []
    return parsed.data
  } catch {
    return []
  }
}

const getCol = (row: Record<string, string>, keyword: string) => {
  const key = Object.keys(row).find((k) => k.includes(keyword))
  return key ? (row[key] || "").trim() : ""
}

export async function validarCupon(rawCode: string, productIds: string[]): Promise<ResultadoCupon> {
  const code = normalize(rawCode)
  if (!code) return { ok: false, error: "Ingresá un código." }

  const cupones = await fetchCupones()
  const row = cupones.find((r) => normalize(getCol(r, "codigo")) === code)
  if (!row) return { ok: false, error: "Por favor revisá el código e intentá nuevamente." }

  if (normalize(getCol(row, "activo")) !== "si") {
    return { ok: false, error: "Este código no está activo." }
  }

  const vence = parseFecha(getCol(row, "vence"))
  if (vence && new Date() > vence) {
    return { ok: false, error: "Este código está vencido." }
  }

  const percent = Number(getCol(row, "descuento").replace(/[^0-9.,]/g, "").replace(",", "."))
  if (!percent || percent <= 0 || percent > 100) {
    return { ok: false, error: "Este código no es válido." }
  }

  const appliesTo = getCol(row, "aplica")
  const aplicaATodo = !appliesTo || normalize(appliesTo) === "todo"

  // Resolvemos los productos del carrito contra la planilla (no confiamos en el navegador)
  const products = await getProducts()
  const eligibleIds = products
    .filter((p) => productIds.includes(p.id))
    .filter((p) =>
      aplicaATodo
        ? true
        : p.availability === "stock" && normalize(p.category).includes(normalize(appliesTo)),
    )
    .map((p) => p.id)

  if (eligibleIds.length === 0) {
    return {
      ok: false,
      error: aplicaATodo
        ? "Ningún producto de tu carrito aplica para este código."
        : `Este código aplica solo a decants de ${appliesTo}.`,
    }
  }

  return { ok: true, code: rawCode.trim().toUpperCase(), percent, appliesTo: aplicaATodo ? "" : appliesTo, eligibleIds }
}
