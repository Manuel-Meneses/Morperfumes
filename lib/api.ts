import Papa from "papaparse"

export interface Product {
  id: string
  name: string
  price: number // Este será el precio base (ej: el de 3ml)
  image: string
  images: string[]
  category: string
  webCategory?: string  // ACÁ GUARDAMOS LA "CATEGORÍA WEB" (Para filtrar)
  notes: string
  description: string
  details: string[]
  sizes: string[]
  sizePrices?: Record<string, number> // Diccionario mágico de precios por tamaño
  availability: "encargo" | "stock"
  isFeatured?: boolean
  isFeaturedRaro?: boolean
}

const SHEET_ID_ENCARGO = "1NLo24Av4lUAuFKbNL0s0NMKIg6bWFg7uRQGdHXOdIxg"
const SHEET_ID_STOCK = "1JJqt7YyPoH3ppHzQ0AT1RihAl7imgo06drwigzw0ta0"

const URL_ARABES_ENCARGO = `https://docs.google.com/spreadsheets/d/${SHEET_ID_ENCARGO}/gviz/tq?tqx=out:csv&sheet=Árabes`
const URL_DISENADOR_ENCARGO = `https://docs.google.com/spreadsheets/d/${SHEET_ID_ENCARGO}/gviz/tq?tqx=out:csv&sheet=Diseñador`
const URL_STOCK_DECANTS = `https://docs.google.com/spreadsheets/d/${SHEET_ID_STOCK}/gviz/tq?tqx=out:csv&sheet=Untitled` 

async function fetchEncargoSheet(url: string, category: string): Promise<Product[]> {
  try {
    const response = await fetch(url, { cache: 'no-store' })
    const csvText = await response.text()
    if (csvText.includes("<!DOCTYPE html>")) return []

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as string[][]
          const headerIndex = rows.findIndex(row => row.some(cell => {
            const c = (cell || "").trim().toUpperCase()
            return c === "PERFUME" || c === "PERFUMES" || c === "PRECIO" || c === "PRECIOS"
          }))
          if (headerIndex === -1) return resolve([])

          const headers = rows[headerIndex].map(h => (h || "").trim().toUpperCase())
          const dataRows = rows.slice(headerIndex + 1)
          
          const findCol = (keywords: string[]) => {
            let idx = headers.findIndex(h => keywords.includes(h))
            if (idx === -1) idx = headers.findIndex(h => keywords.some(kw => h.includes(kw)))
            return idx
          }

          const idxPerfume = findCol(["PERFUME", "PERFUMES", "NOMBRE", "FRAGANCIA"])
          const idxPrecio = findCol(["PRECIO", "PRECIOS", "VALOR"])
          const idxFoto = findCol(["FOTO", "IMAGEN", "LINK FOTO", "IMAGENES"])
          const idxGenero = findCol(["GÉNERO", "GENERO", "SEXO", "PARA"])
          const finalIdxGenero = idxGenero !== -1 ? idxGenero : 0

          const products: Product[] = dataRows
            .filter(row => idxPerfume !== -1 && row[idxPerfume] && row[idxPerfume].trim() !== "")
            .map((row, index) => {
              const imageStr = (idxFoto !== -1 && row[idxFoto] && row[idxFoto].includes("http")) ? row[idxFoto].trim() : "/placeholder.svg"
              const rawName = row[idxPerfume].trim()
              let genero = ""
              if (finalIdxGenero !== idxPerfume && row[finalIdxGenero]) genero = row[finalIdxGenero].trim()
              const finalName = genero ? `${rawName} (${genero})` : rawName
              const dynamicDetails = [`Modalidad: Por Encargo`]
              if (genero) dynamicDetails.push(`Género: ${genero}`)

              headers.forEach((upperH, colIndex) => {
                const cellValue = row[colIndex] ? row[colIndex].trim() : ""
                if (!cellValue || cellValue === "-") return
                if (colIndex === idxPerfume || colIndex === idxPrecio || colIndex === idxFoto || colIndex === finalIdxGenero) return
                if (upperH.includes("NOTAS") && !upperH.includes("SALIDA") && !upperH.includes("CORAZ") && !upperH.includes("FONDO")) return
                if (upperH.includes("DESCRIPCION") || upperH.includes("FRASE")) return

                if (upperH.includes("SALIDA")) dynamicDetails.push(`Notas de Salida: ${cellValue}`)
                else if (upperH.includes("CORAZ")) dynamicDetails.push(`Notas de Corazón: ${cellValue}`)
                else if (upperH.includes("FONDO")) dynamicDetails.push(`Notas de Fondo: ${cellValue}`)
                else {
                    const label = upperH.charAt(0) + upperH.slice(1).toLowerCase()
                    dynamicDetails.push(`${label}: ${cellValue}`)
                }
              })

              const idxFrase = findCol(["FRASE", "FRASE CORTA"])
              const fraseCorta = (idxFrase !== -1 && row[idxFrase]) ? row[idxFrase].trim() : ""
              const idxDesc = findCol(["DESCRIPCION", "DESCRIPCIÓN", "DESCRIPTION"])
             const descPersonal = (idxDesc !== -1 && row[idxDesc]) ? row[idxDesc].trim() : `Descubrí la esencia de ${rawName}. Fragancia premium disponible por encargo.`
              
              let price = 0
              if (idxPrecio !== -1 && row[idxPrecio]) price = Number(row[idxPrecio].replace(/[^0-9.-]+/g,"")) || 0

              return {
                id: `encargo-${category.replace(/\s+/g, "-")}-${index}`,
                name: finalName,
                price: price,
                image: imageStr,
                images: [imageStr],
                category: category, // Ej: "Árabes" o "Diseñador" (Lo que ve el cliente)
                webCategory: "sellados", // SOLUCIÓN: Todos los de este Excel van forzados a la pestaña "Sellados"
                notes: fraseCorta,
                availability: "encargo",
                description: descPersonal,
                details: dynamicDetails, 
                sizes: ["Frasco Sellado"],
              }
            })
          resolve(products)
        },
      })
    })
  } catch (error) {
    return []
  }
}

async function fetchStockSheet(url: string): Promise<Product[]> {
  try {
    const response = await fetch(url, { cache: 'no-store' })
    const csvText = await response.text()
    if (csvText.includes("<!DOCTYPE html>")) return []

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(), 
        complete: (results) => {
          const rows = results.data as any[]

          const products: Product[] = rows
            .filter(row => row["Nombre"]) 
            .map((row, index) => {
              const imageStr = row["Foto"] && row["Foto"].includes("http") ? row["Foto"] : "/placeholder.svg"
              
              // LECTURA DE LOS 3 TAMAÑOS
              const p3 = Number(row["Precio 3ml"]?.toString().replace(/[^0-9.-]+/g,"")) || 0
              const p5 = Number(row["Precio 5ml"]?.toString().replace(/[^0-9.-]+/g,"")) || 0
              const p10 = Number(row["Precio 10ml"]?.toString().replace(/[^0-9.-]+/g,"")) || 0

              const precioBase = p3 || Number(row["Precio"]?.toString().replace(/[^0-9.-]+/g,"")) || 0

              let activeSizes: string[] = []
              let sizePrices: Record<string, number> = {}

              if(p3 > 0) { activeSizes.push("3ml"); sizePrices["3ml"] = p3; }
              if(p5 > 0) { activeSizes.push("5ml"); sizePrices["5ml"] = p5; }
              if(p10 > 0) { activeSizes.push("10ml"); sizePrices["10ml"] = p10; }

              if (activeSizes.length === 0) {
                activeSizes = ["3ml", "5ml", "10ml"]
                sizePrices = { "3ml": precioBase, "5ml": precioBase, "10ml": precioBase }
              }

              return {
                id: `stock-${index}`,
                name: row["Nombre"],
                price: precioBase, 
                image: imageStr,
                images: [imageStr],
                category: row["Segmento"] || "Decants", // SOLUCIÓN: Esto ve el cliente (Ej: "Árabe Raro")
                webCategory: row["Categoría web"] || "decants", // SOLUCIÓN: Esto usa el filtro interno de pestañas
                notes: row["Frase corta (debajo del nombre)"] || "",
                availability: "stock",
                description: row["Descripcion"] || row["Descripción"] || `Descubrí la esencia de ${row["Nombre"]}.`,
                details: [
                  row["Marca"] ? `Marca: ${row["Marca"]}` : "",
                  row["Segmento"] ? `Segmento: ${row["Segmento"]}` : "",
                  row["Concentración"] ? `Concentración: ${row["Concentración"]}` : "",
                  row["Familia olfativa"] ? `Familia Olfativa: ${row["Familia olfativa"]}` : "",
                  row["Inspirado en"] ? `Inspiración: ${row["Inspirado en"]}` : "",
                  row["Salida"] ? `Notas de Salida: ${row["Salida"]}` : "",
                  row["Corazón"] ? `Notas de Corazón: ${row["Corazón"]}` : "",
                  row["Fondo"] ? `Notas de Fondo: ${row["Fondo"]}` : "",
                  row["Genero"] ? `Género: ${row["Genero"]}` : "",
                ].filter(Boolean), 
                sizes: activeSizes, 
                sizePrices: sizePrices, 
                isFeatured: row["Destacado"]?.toString().trim().toUpperCase() === "SI",
                isFeaturedRaro: row["Destacado Raro"]?.toString().trim().toUpperCase() === "SI", // <--- AGREGAR ESTA NUEVA
              }
            })
          resolve(products)
        },
      })
    })
  } catch (error) {
    return []
  }
}

export async function getProducts(): Promise<Product[]> {
  const arabesEncargo = await fetchEncargoSheet(URL_ARABES_ENCARGO, "Árabes")
  const disenadorEncargo = await fetchEncargoSheet(URL_DISENADOR_ENCARGO, "Diseñador")
  const stockDecants = await fetchStockSheet(URL_STOCK_DECANTS)
  
  return [...arabesEncargo, ...disenadorEncargo, ...stockDecants]
}