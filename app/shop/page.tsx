"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, SlidersHorizontal, Search, DollarSign, ChevronDown, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { getProducts, Product } from "@/lib/api"

const ITEMS_PER_PAGE = 12

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  // La categoría por defecto es "sellados"
  const categoryParam = searchParams.get("category") || "sellados"

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function load() {
      const prods = await getProducts()
      setAllProducts(prods)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [categoryParam, searchQuery, priceFilter])

  const normalize = (str: string) => {
    if (!str) return ""
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
  }

  const query = categoryParam.toLowerCase()

  // 1. FILTRADO EXACTO USANDO LA "CATEGORÍA WEB" DEL EXCEL
  // 1. FILTRADO BLINDADO
  const filteredProducts = allProducts.filter(p => {
    // Leemos de todas las columnas posibles por las dudas (webCategory o categoriaWeb)
    const webCatNorm = normalize((p as any).webCategory || (p as any).categoriaWeb || "")
    const catNorm = normalize(p.category || "")
    const nameNorm = normalize(p.name || "")
    
    let matchesCategory = false
    
    // REGLA DE ORO PARA DECANTS / RAROS
    // Es de la pestaña "Decants" si: 
    // - La columna webCategory dice "decant"
    // - O el segmento visual dice "decant" o "raro"
    // - O el nombre del perfume incluye la palabra "decant"
    const isDecantTab = webCatNorm.includes("decant") || catNorm.includes("decant") || catNorm.includes("raro") || nameNorm.includes("decant")

    // REGLA DE ORO PARA SELLADOS
    // Es de la pestaña "Sellados" si:
    // - La columna webCategory dice "sellado"
    // - O SI NO ES un Decant/Raro (por descarte, los árabes y diseñadores limpios caen acá)
    const isSelladoTab = webCatNorm.includes("sellado") || !isDecantTab
    
    // Aplicamos la regla según la pestaña en la que estemos
    if (query === "sellados") {
      matchesCategory = isSelladoTab
    } else if (query === "decants") {
      matchesCategory = isDecantTab
    } else {
      matchesCategory = true // Por si acaso
    }

    // Filtro de Búsqueda
    let matchesSearch = true
    if (searchQuery) {
      const searchNorm = normalize(searchQuery)
      matchesSearch = 
        nameNorm.includes(searchNorm) || 
        normalize(p.notes || "").includes(searchNorm) || 
        normalize((p as any).description || "").includes(searchNorm) ||
        catNorm.includes(searchNorm)
    }

    // Filtro de Precio
    let matchesPrice = true
    if (priceFilter === "low") matchesPrice = p.price > 0 && p.price <= 20000
    else if (priceFilter === "mid") matchesPrice = p.price > 20000 && p.price <= 50000
    else if (priceFilter === "high") matchesPrice = p.price > 50000

    return matchesCategory && matchesSearch && matchesPrice
  }) 

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleCategoryChange = (catId: string) => {
    router.push(`/shop?category=${catId}`, { scroll: false })
  }

  const tabs = [
    { id: "sellados", label: "Sellados", subtitle: "Árabes & Diseñador" },
    { id: "decants", label: "Decants", subtitle: "Árabes Raros & Fraccionados" },
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
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
        
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="text-[#c0a062] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">La Colección</span>
          <h1 className="font-serif text-4xl md:text-6xl font-medium text-[#141f36] mb-4">Catálogo de Alta Perfumería</h1>
          <div className="w-16 h-[1px] bg-[#c0a062] mb-6"></div>
          <p className="text-[#141f36]/70 font-serif italic text-lg max-w-xl">
            Curaduría exclusiva. Encontrá la fragancia que definirá tu presencia.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex w-full md:w-auto flex-row justify-center gap-8 md:gap-24 pb-4 border-b border-[#141f36]/10 px-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`group flex flex-col items-center relative transition-all duration-300 ${
                  categoryParam === tab.id 
                    ? "opacity-100" 
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                <span className={`font-serif text-2xl md:text-4xl mb-2 ${categoryParam === tab.id ? "text-[#141f36]" : "text-[#141f36]"}`}>
                  {tab.label}
                </span>
                <span className={`text-[9px] md:text-xs uppercase tracking-[0.2em] font-bold ${categoryParam === tab.id ? "text-[#c0a062]" : "text-[#141f36]"}`}>
                  {tab.subtitle}
                </span>
                {categoryParam === tab.id && (
                  <span className="absolute bottom-[-17px] left-1/2 -translate-x-1/2 w-full max-w-[120px] h-[2px] bg-[#c0a062]"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 border-b border-[#141f36]/5 pb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#141f36]/50">
            {filteredProducts.length} Fragancias
          </p>
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#141f36] hover:text-[#c0a062] transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showAdvancedFilters ? "Ocultar Filtros" : "Filtrar Selección"}
          </button>
        </div>

        {showAdvancedFilters && (
          <div className="bg-white border border-[#141f36]/5 p-6 mb-10 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#141f36]/40" />
                <input 
                  type="text" 
                  placeholder="Buscar esencia, nota o nombre..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-b border-[#141f36]/20 focus:outline-none focus:border-[#c0a062] transition-all font-serif text-base text-[#141f36] placeholder:text-[#141f36]/40"
                />
              </div>

              <div className="relative w-full md:w-64">
                <select 
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-transparent border-b border-[#141f36]/20 appearance-none focus:outline-none focus:border-[#c0a062] transition-all font-serif text-base text-[#141f36] cursor-pointer"
                >
                  <option value="all">Rango de Precio</option>
                  <option value="low">Hasta $20.000</option>
                  <option value="mid">De $20.000 a $50.000</option>
                  <option value="high">Más de $50.000</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-[#141f36]/40" />
                </div>
              </div>
            </div>
          </div>
        )}

        <ProductGrid products={currentProducts} layout="grid" />

        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-4 mt-16 mb-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 border border-[#141f36]/10 text-[#141f36] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#c0a062] hover:text-[#c0a062] transition-all rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 font-serif text-sm transition-all rounded-full ${
                    currentPage === i + 1 
                      ? "bg-[#141f36] text-[#f6f4ed]" 
                      : "bg-transparent text-[#141f36]/60 hover:text-[#141f36]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 border border-[#141f36]/10 text-[#141f36] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#c0a062] hover:text-[#c0a062] transition-all rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 px-4 bg-white/50 border border-[#141f36]/5 mt-8">
            <SlidersHorizontal className="h-8 w-8 mx-auto mb-6 text-[#141f36]/20" />
            <p className="font-serif text-xl text-[#141f36]/70 mb-4">No encontramos fragancias con esos criterios.</p>
            <Button 
              variant="outline" 
              onClick={() => { setSearchQuery(""); setPriceFilter("all"); router.push('/shop?category=sellados') }}
              className="border-[#c0a062] text-[#c0a062] hover:bg-[#c0a062] hover:text-white uppercase tracking-widest text-[10px] font-bold rounded-none"
            >
              Limpiar Búsqueda
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