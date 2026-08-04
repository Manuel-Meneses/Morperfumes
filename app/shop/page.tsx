"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, SlidersHorizontal, Search, DollarSign, ChevronDown, ChevronLeft, ChevronRight, Filter, Users } from "lucide-react"
import { getProducts, Product } from "@/lib/api"

const ITEMS_PER_PAGE = 12

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get("category") || "sellados"

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [designerFirst, setDesignerFirst] = useState(false) 
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true) 
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
  }, [categoryParam, searchQuery, priceFilter, genderFilter, designerFirst])

  const normalize = (str: string) => {
    if (!str) return ""
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
  }

  const query = categoryParam.toLowerCase()

  // 1. FILTRADO
  const filteredProducts = allProducts.filter(p => {
    const webCatNorm = normalize((p as any).webCategory || (p as any).categoriaWeb || "")
    const catNorm = normalize(p.category || "")
    const nameNorm = normalize(p.name || "")
    const detailsNorm = normalize((p.details || []).join(" "))
    
    // Categoría (Sellados vs Decants)
    let matchesCategory = false
    const isDecantTab = webCatNorm.includes("decant") || catNorm.includes("decant") || catNorm.includes("raro") || nameNorm.includes("decant")
    const isSelladoTab = webCatNorm.includes("sellado") || !isDecantTab
    
    if (query === "sellados") matchesCategory = isSelladoTab
    else if (query === "decants") matchesCategory = isDecantTab
    else matchesCategory = true

    // Búsqueda por texto
    let matchesSearch = true
    if (searchQuery) {
      const searchNorm = normalize(searchQuery)
      matchesSearch = 
        nameNorm.includes(searchNorm) || 
        normalize(p.notes || "").includes(searchNorm) || 
        normalize((p as any).description || "").includes(searchNorm) ||
        catNorm.includes(searchNorm)
    }

    // 🛡️ FILTRO DE GÉNERO BLINDADO
    let matchesGender = true
    if (genderFilter !== "all") {
      const searchArea = (" " + nameNorm + " " + detailsNorm + " ").replace(/\s+/g, " ")
      
      if (genderFilter === "masculino") {
        matchesGender = searchArea.includes(" genero: m ") || 
                        searchArea.includes(" hombre ") || 
                        searchArea.includes(" masculino ") || 
                        searchArea.includes(" for men ") || 
                        searchArea.includes(" pour homme ")
      } else if (genderFilter === "femenino") {
        matchesGender = searchArea.includes(" genero: f ") || 
                        searchArea.includes(" mujer ") || 
                        searchArea.includes(" femenino ") || 
                        searchArea.includes(" for women ") || 
                        searchArea.includes(" pour femme ")
      } else if (genderFilter === "unisex") {
        matchesGender = searchArea.includes(" genero: u ") || 
                        searchArea.includes(" unisex ") || 
                        searchArea.includes(" mixto ")
      }
    }

    // Precio Dinámico (Depende del switch)
    let matchesPrice = true
    if (designerFirst) {
      if (priceFilter === "low") matchesPrice = p.price > 0 && p.price <= 150000
      else if (priceFilter === "mid") matchesPrice = p.price > 150000 && p.price <= 230000
      else if (priceFilter === "high") matchesPrice = p.price > 230000
    } else {
      if (priceFilter === "low") matchesPrice = p.price > 0 && p.price <= 60000
      else if (priceFilter === "mid") matchesPrice = p.price > 60000 && p.price <= 90000
      else if (priceFilter === "high") matchesPrice = p.price > 90000
    }

    return matchesCategory && matchesSearch && matchesGender && matchesPrice
  })

  // 2. ORDENAMIENTO (El Switch en acción)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aCat = normalize(a.category || "")
    const bCat = normalize(b.category || "")
    
    if (designerFirst) {
      const aIsDes = aCat.includes("disenador") ? 1 : 0
      const bIsDes = bCat.includes("disenador") ? 1 : 0
      return bIsDes - aIsDes
    } else {
      const aIsArabe = aCat.includes("arabe") ? 1 : 0
      const bIsArabe = bCat.includes("arabe") ? 1 : 0
      return bIsArabe - aIsArabe
    }
  })

  // 3. PAGINACIÓN
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE)
  
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleCategoryChange = (catId: string) => {
    router.push(`/shop?category=${catId}`, { scroll: false })
  }

  const tabs = [
    { id: "sellados", label: "Sellados", subtitle: "Árabes & Diseñador" },
    { id: "decants", label: "Decants", subtitle: "Raros & Fraccionados" }, // Acorté el texto para móvil
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f4ed] flex flex-col overflow-x-hidden">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#c0a062] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    // Agregamos overflow-x-hidden para matar el scroll horizontal
    <div className="min-h-screen bg-[#f6f4ed] overflow-x-hidden">
      <Header />
      {/* Redujimos un poco el padding en móviles para ganar espacio */}
      <div className="container mx-auto px-2 md:px-6 py-8 md:py-16 max-w-full">
        
        {/* Cabecera Principal */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-16">
          <span className="text-[#c0a062] font-bold tracking-[0.2em] uppercase text-xs mb-3 md:mb-4 block">La Colección</span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-medium text-[#141f36] mb-3 md:mb-4 leading-tight">Catálogo de Alta Perfumería</h1>
          <div className="w-12 md:w-16 h-[1px] bg-[#c0a062] mb-4 md:mb-6"></div>
          <p className="text-[#141f36]/70 font-serif italic text-sm md:text-lg max-w-xl px-4">
            Curaduría exclusiva. Encontrá la fragancia que definirá tu presencia.
          </p>
        </div>

        {/* Pestañas de Navegación (Super Optimizadas para Móvil) */}
        <div className="flex justify-center mb-8 md:mb-12 w-full">
          <div className="flex w-full sm:w-auto flex-row justify-between md:justify-center gap-1 sm:gap-8 md:gap-24 pb-4 border-b border-[#141f36]/10 px-1 md:px-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`flex-1 sm:flex-none group flex flex-col items-center relative transition-all duration-300 ${
                  categoryParam === tab.id ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <span className={`font-serif text-xl sm:text-2xl md:text-4xl mb-1 md:mb-2 ${categoryParam === tab.id ? "text-[#141f36]" : "text-[#141f36]"}`}>
                  {tab.label}
                </span>
                <span className={`text-[7px] sm:text-[9px] md:text-xs uppercase tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.2em] font-bold text-center ${categoryParam === tab.id ? "text-[#c0a062]" : "text-[#141f36]"}`}>
                  {tab.subtitle}
                </span>
                {categoryParam === tab.id && (
                  <span className="absolute bottom-[-17px] left-1/2 -translate-x-1/2 w-full max-w-[60px] md:max-w-[120px] h-[2px] bg-[#c0a062]"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Barra contadora y botón de filtros */}
        <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-[#141f36]/5 pb-4 px-2">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#141f36]/50">
            {sortedProducts.length} Fragancias
          </p>
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#141f36] hover:text-[#c0a062] transition-colors"
          >
            <Filter className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {showAdvancedFilters ? "Ocultar" : "Filtrar"}
          </button>
        </div>

        {/* CONTENEDOR DE FILTROS */}
        {showAdvancedFilters && (
          <div className="bg-white border border-[#141f36]/5 p-4 md:p-6 mb-8 md:mb-10 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            
            {/* 1. SWITCH DE PRIORIDAD */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 pb-6 md:pb-8 border-b border-[#141f36]/10 gap-4">
              <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-[#141f36]">Configurar Escala</span>
              <div className="flex flex-row w-full md:w-auto p-1 bg-[#f6f4ed] border border-[#141f36]/10 rounded-sm">
                <button 
                  onClick={() => { setDesignerFirst(false); setPriceFilter("all"); }}
                  className={`flex-1 md:flex-none px-2 md:px-6 py-3 md:py-2.5 text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.05em] md:tracking-widest transition-all text-center ${
                    !designerFirst ? 'bg-[#141f36] text-[#f6f4ed] shadow-md' : 'text-[#141f36]/50 hover:text-[#141f36]'
                  }`}
                >
                  Árabes
                </button>
                <button 
                  onClick={() => { setDesignerFirst(true); setPriceFilter("all"); }}
                  className={`flex-1 md:flex-none px-2 md:px-6 py-3 md:py-2.5 text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.05em] md:tracking-widest transition-all text-center ${
                    designerFirst ? 'bg-[#141f36] text-[#f6f4ed] shadow-md' : 'text-[#141f36]/50 hover:text-[#141f36]'
                  }`}
                >
                  Diseñador
                </button>
              </div>
            </div>

            {/* 2. FILTROS DE BÚSQUEDA, GÉNERO Y PRECIO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
              
              <div className="relative">
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-[#141f36]/40" />
                <input 
                  type="text" 
                  placeholder="Buscar esencia..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-3 bg-transparent border border-[#141f36]/10 md:border-t-0 md:border-l-0 md:border-r-0 md:border-b md:border-[#141f36]/20 focus:outline-none focus:border-[#c0a062] transition-all font-serif text-sm md:text-base text-[#141f36] placeholder:text-[#141f36]/40 rounded-sm md:rounded-none"
                />
              </div>

              <div className="relative">
                <Users className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-[#141f36]/40" />
                <select 
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-8 md:pr-10 py-3 md:py-3 bg-transparent border border-[#141f36]/10 md:border-t-0 md:border-l-0 md:border-r-0 md:border-b md:border-[#141f36]/20 appearance-none focus:outline-none focus:border-[#c0a062] transition-all font-serif text-sm md:text-base text-[#141f36] cursor-pointer rounded-sm md:rounded-none"
                >
                  <option value="all">Todos los Géneros</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="unisex">Unisex</option>
                </select>
                <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#141f36]/40" />
                </div>
              </div>

              <div className="relative">
                <DollarSign className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-[#141f36]/40" />
                <select 
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-8 md:pr-10 py-3 md:py-3 bg-transparent border border-[#141f36]/10 md:border-t-0 md:border-l-0 md:border-r-0 md:border-b md:border-[#141f36]/20 appearance-none focus:outline-none focus:border-[#c0a062] transition-all font-serif text-sm md:text-base text-[#141f36] cursor-pointer rounded-sm md:rounded-none"
                >
                  <option value="all">Cualquier Precio</option>
                  {designerFirst ? (
                    <>
                      <option value="low">Menos de $150.000</option>
                      <option value="mid">De $150.000 a $230.000</option>
                      <option value="high">Más de $230.000</option>
                    </>
                  ) : (
                    <>
                      <option value="low">Hasta $60.000</option>
                      <option value="mid">De $60.000 a $90.000</option>
                      <option value="high">Más de $90.000</option>
                    </>
                  )}
                </select>
                <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#141f36]/40" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* CONTENEDOR DE GRILLA SEGURO */}
        <div className="w-full overflow-hidden px-1">
          <ProductGrid products={currentProducts} layout="grid" />
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mt-12 md:mt-16 mb-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 md:p-3 border border-[#141f36]/10 text-[#141f36] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#c0a062] hover:text-[#c0a062] transition-all rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex gap-1 md:gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 md:w-10 md:h-10 font-serif text-xs md:text-sm transition-all rounded-full ${
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
              className="p-2 md:p-3 border border-[#141f36]/10 text-[#141f36] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#c0a062] hover:text-[#c0a062] transition-all rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Estado Vacío */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16 md:py-24 px-4 bg-white/50 border border-[#141f36]/5 mt-8 mx-2">
            <SlidersHorizontal className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-4 md:mb-6 text-[#141f36]/20" />
            <p className="font-serif text-lg md:text-xl text-[#141f36]/70 mb-4">No encontramos fragancias con esos criterios.</p>
            <Button 
              variant="outline" 
              onClick={() => { 
                setSearchQuery(""); 
                setPriceFilter("all"); 
                setGenderFilter("all");
              }}
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