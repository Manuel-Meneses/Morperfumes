"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, SlidersHorizontal, Search, DollarSign, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { getProducts, Product } from "@/lib/api"

// CONFIGURACIÓN: ¿Cuántos perfumes mostrar por página?
const ITEMS_PER_PAGE = 12

// COMPONENTE PRINCIPAL CON LA LÓGICA
function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get("category") || "todos"

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados para los filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  
  // Estado para la página actual
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function load() {
      const prods = await getProducts()
      setAllProducts(prods)
      setLoading(false)
    }
    load()
  }, [])

  // Cuando el usuario cambia de categoría o busca algo, lo devolvemos a la página 1
  useEffect(() => {
    setCurrentPage(1)
  }, [categoryParam, searchQuery, priceFilter])

  const normalize = (str: string) => {
    if (!str) return ""
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
  }

  const query = categoryParam.toLowerCase()

  // 1. Filtramos todos los productos
  const filteredProducts = allProducts.filter(p => {
    const catNorm = normalize(p.category)
    
    // Filtro de Categoría
    let matchesCategory = false
    if (query === "todos") matchesCategory = true
    else if (query === "decants") matchesCategory = p.availability === "stock" || catNorm.includes("decant")
    else if (query === "arabes-raros" || query === "arabes raros") matchesCategory = catNorm.includes("raro")
    else if (query === "arabes") matchesCategory = catNorm.includes("arabe") && !catNorm.includes("raro")
    else matchesCategory = catNorm.includes(normalize(query))

    // Filtro de Búsqueda
    let matchesSearch = true
    if (searchQuery) {
      const searchNorm = normalize(searchQuery)
      matchesSearch = 
        normalize(p.name).includes(searchNorm) || 
        normalize(p.notes).includes(searchNorm) || 
        normalize(p.description).includes(searchNorm)
    }

    // Filtro de Precio
    let matchesPrice = true
    if (priceFilter === "low") matchesPrice = p.price > 0 && p.price <= 20000
    else if (priceFilter === "mid") matchesPrice = p.price > 20000 && p.price <= 50000
    else if (priceFilter === "high") matchesPrice = p.price > 50000

    return matchesCategory && matchesSearch && matchesPrice
  })

  // 2. LÓGICA DE PAGINACIÓN
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  
  // Cortamos el array para mostrar solo los de la página actual
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Función para cambiar de pestaña
  const handleCategoryChange = (catId: string) => {
    router.push(`/shop?category=${catId}`, { scroll: false })
  }

  const tabs = [
    { id: "todos", label: "Todas las Esencias" },
    { id: "arabes", label: "Árabes" },
    { id: "arabes-raros", label: "Árabes Raros" },
    { id: "disenador", label: "Diseñador" },
    { id: "decants", label: "Decants" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f4ed] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#c0a062] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f4ed]">
      <Header />
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <Button variant="ghost" asChild className="mb-6 hover:bg-[#141f36]/5 text-[#141f36]">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#141f36] mb-3">Catálogo Completo</h1>
          <p className="text-[#4a5d4e] font-serif italic text-lg">Encontrá el perfume que va con tu personalidad.</p>
        </div>

        {/* PANEL DE CONTROL */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-[#141f36]/10 p-5 md:p-6 mb-10">
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#141f36]/40" />
              <input 
                type="text" 
                placeholder="Buscar por nombre, marca o nota (ej. Limón)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#141f36]/10 focus:outline-none focus:border-[#c0a062] focus:ring-1 focus:ring-[#c0a062] transition-all font-serif text-[#141f36] placeholder:text-[#141f36]/40 shadow-sm"
              />
            </div>

            <div className="relative w-full md:w-72">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#141f36]/40" />
              <select 
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-[#141f36]/10 appearance-none focus:outline-none focus:border-[#c0a062] focus:ring-1 focus:ring-[#c0a062] transition-all font-serif text-[#141f36] cursor-pointer shadow-sm"
              >
                <option value="all">Cualquier precio</option>
                <option value="low">Hasta $20.000</option>
                <option value="mid">De $20.000 a $50.000</option>
                <option value="high">Más de $50.000</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-[#141f36]/40" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`whitespace-nowrap px-6 py-2.5 font-serif text-sm transition-all border ${
                  categoryParam === tab.id 
                    ? "bg-[#141f36] border-[#141f36] text-[#f6f4ed] shadow-md" 
                    : "bg-white border-[#141f36]/10 text-[#141f36] hover:border-[#c0a062] hover:text-[#c0a062]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* GRILLA DE PRODUCTOS PAGINADA */}
        <ProductGrid products={currentProducts} layout="grid" />

        {/* CONTROLES DE PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 mb-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-[#141f36]/20 bg-white text-[#141f36] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#c0a062] hover:text-[#c0a062] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 border font-serif text-sm transition-all ${
                  currentPage === i + 1 
                    ? "bg-[#141f36] border-[#141f36] text-[#f6f4ed]" 
                    : "bg-white border-[#141f36]/20 text-[#141f36] hover:border-[#c0a062] hover:text-[#c0a062]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#141f36]/20 bg-white text-[#141f36] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#c0a062] hover:text-[#c0a062] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ESTADO VACÍO */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-24 text-[#141f36]/50">
            <SlidersHorizontal className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-serif text-xl">No encontramos fragancias con esos filtros.</p>
            <Button 
              variant="link" 
              onClick={() => { setSearchQuery(""); setPriceFilter("all"); }}
              className="text-[#c0a062] mt-2"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6f4ed]" />}>
      <ShopContent />
    </Suspense>
  )
}