"use client"

import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ShoppingBag, Droplets, Sparkles, Wind, Clock, SunMoon, Star, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { getProducts, Product } from "@/lib/api"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const productId = resolvedParams.id

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    async function loadProduct() {
      const products = await getProducts()
      const cleanId = decodeURIComponent(productId)
      const found = products.find((p) => p.id === cleanId)
      
      if (found) {
        setProduct(found)
        if (found.sizes.length > 0) {
          setSelectedSize(found.sizes[0])
        }
      }
      setLoading(false)
    }
    loadProduct()
  }, [productId])

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

  if (!product) return notFound()

  // CÁLCULOS DINÁMICOS Y PARSEOS
  const currentPrice = product.sizePrices && product.sizePrices[selectedSize] 
    ? product.sizePrices[selectedSize] 
    : product.price

  const parseDetail = (detail: string) => {
    const [label, ...rest] = detail.split(":")
    return { label: label.trim(), value: rest.join(":").trim() }
  }

  const olfactoryNotes = product.details.filter(d => d.includes("Notas de"))
  const technicalSpecs = product.details.filter(d => !d.includes("Notas de") && d.includes(":"))

  // EXTRACCIÓN INTELIGENTE PARA LOS MEDIDORES INMERSIVOS
  const getSpec = (keyword: string) => {
    const found = technicalSpecs.find(s => parseDetail(s).label.toLowerCase().includes(keyword))
    return found ? parseDetail(found).value : null
  }

  const estela = getSpec("estela") || getSpec("proyección")
  const duracion = getSpec("duración") || getSpec("longevidad")
  const ocasion = getSpec("ocasión") || getSpec("uso")

  // Filtramos las specs que ya usamos en los medidores para no repetirlas
  const otherSpecs = technicalSpecs.filter(s => {
    const l = parseDetail(s).label.toLowerCase()
    return !l.includes("estela") && !l.includes("proyección") && !l.includes("duración") && !l.includes("longevidad") && !l.includes("ocasión") && !l.includes("uso")
  })

  // Función para calcular el ancho de las barras visuales según el texto
  const getMeterWidth = (val: string | null) => {
    if (!val) return "w-[50%]"
    const v = val.toLowerCase()
    if (v.includes("enorme") || v.includes("eterna") || v.includes("+12") || v.includes("nuclear")) return "w-[95%]"
    if (v.includes("fuerte") || v.includes("pesada") || v.includes("alta") || v.includes("+8")) return "w-[80%]"
    if (v.includes("moderada") || v.includes("media") || v.includes("4-8")) return "w-[60%]"
    if (v.includes("suave") || v.includes("ligera") || v.includes("íntima") || v.includes("baja")) return "w-[30%]"
    return "w-[75%]"
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      image: product.image,
      size: selectedSize,
    })
    toast({
      title: "Agregado a tu selección",
      description: `${product.name} (${selectedSize}) ya está en tu carrito.`,
    })
  }

  // ENLACES
  const numeroWA = "5493516087006"
  const mensajeWA = `¡Hola León e Indio! Quiero consultar por el perfume ${product.name} en formato ${selectedSize} ($${currentPrice.toLocaleString("es-AR")}). ¿Tienen stock?`
  const linkWA = `https://wa.me/${numeroWA}?text=${encodeURIComponent(mensajeWA)}`
  const linkRating = `https://www.fragrantica.es/buscar/?q=${encodeURIComponent(product.name)}`

  return (
    <div className="min-h-screen bg-[#f6f4ed] text-[#141f36] selection:bg-[#c0a062] selection:text-[#141f36]">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Button variant="ghost" asChild className="hover:bg-[#141f36]/5 text-[#141f36] mb-6 -ml-4">
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* COLUMNA IZQUIERDA: Imagen Inmersiva */}
          <div className="relative aspect-[4/5] bg-white border border-[#141f36]/10 shadow-2xl p-8 group flex items-center justify-center">
            {/* Marcos esquineros */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#c0a062]/70 transition-transform duration-700 group-hover:-translate-x-1 group-hover:-translate-y-1" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#c0a062]/70 transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-1" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#c0a062]/70 transition-transform duration-700 group-hover:-translate-x-1 group-hover:translate-y-1" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#c0a062]/70 transition-transform duration-700 group-hover:translate-x-1 group-hover:translate-y-1" />
            
            {/* Etiqueta de Categoría */}
            <div className="absolute top-8 left-8 bg-[#141f36] text-[#f6f4ed] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest z-20 shadow-md">
              {product.category}
            </div>

            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-16 transition-transform duration-1000 group-hover:scale-105 drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]"
              priority
            />
          </div>

          {/* COLUMNA DERECHA: Información y Controles */}
          <div className="flex flex-col justify-center">
            
            {/* Cabecera */}
            <div className="mb-8 border-b border-[#141f36]/10 pb-8">
              {product.availability === "encargo" && (
                <span className="inline-block bg-[#c0a062] text-[#141f36] text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-4">
                  Producto Por Encargo
                </span>
              )}
              
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold mb-4 leading-tight text-[#141f36]">
                {product.name}
              </h1>
              
              {product.notes && (
                <p className="text-lg font-serif italic text-[#141f36]/70 mb-6 leading-relaxed">
                  &quot;{product.notes}&quot;
                </p>
              )}

              <div className="text-4xl font-serif text-[#c0a062] font-semibold mt-4 transition-all duration-300">
                ${currentPrice.toLocaleString("es-AR")}
              </div>
            </div>

            {/* Selector de Tamaños */}
            <div className="mb-8">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#141f36] mb-4 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#c0a062]" />
                Seleccionar Formato
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border text-sm font-medium transition-all duration-300 ${
                      selectedSize === size
                        ? "border-[#141f36] bg-[#141f36] text-[#f6f4ed] shadow-lg"
                        : "border-[#141f36]/20 bg-white text-[#141f36] hover:border-[#c0a062] hover:text-[#c0a062]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 h-14 bg-[#141f36] hover:bg-[#1a2640] text-[#f6f4ed] rounded-none uppercase tracking-widest text-xs font-bold transition-all shadow-xl hover:-translate-y-1"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Agregar al Carrito
              </Button>
              
              <Button asChild size="lg" variant="outline" className="flex-1 h-14 border-[#141f36]/20 bg-transparent hover:bg-[#141f36]/5 text-[#141f36] rounded-none uppercase tracking-widest text-xs font-bold transition-all hover:-translate-y-1">
                <a href={linkWA} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Consultar Stock
                </a>
              </Button>
            </div>

            {/* BLOQUE INMERSIVO: La Ciencia del Perfume */}
            <div className="space-y-8 bg-white/50 p-6 md:p-8 border border-[#141f36]/10 shadow-sm">
              
              {/* Descripción */}
              {product.description && (
                <div>
                  <p className="font-serif text-[#141f36]/80 leading-relaxed text-sm">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Pirámide Olfativa Inmersiva */}
              {olfactoryNotes.length > 0 && (
                <div className="pt-6 border-t border-[#141f36]/10">
                  <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#141f36] mb-6">
                    <Droplets className="w-4 h-4 text-[#c0a062]" />
                    Pirámide Olfativa
                  </h3>
                  <div className="bg-[#141f36] text-[#f6f4ed] p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-inner">
                    {olfactoryNotes.map((note, index) => {
                      const { label, value } = parseDetail(note)
                      let icon = "✨"
                      if (label.toLowerCase().includes("salida")) icon = "🍋"
                      if (label.toLowerCase().includes("corazón") || label.toLowerCase().includes("corazon")) icon = "🌸"
                      if (label.toLowerCase().includes("fondo")) icon = "🪵"

                      return (
                        <div key={index} className="flex flex-col items-center text-center">
                          <span className="text-2xl mb-3 drop-shadow-md">{icon}</span>
                          <span className="text-[#c0a062] text-[10px] uppercase tracking-widest font-bold mb-2">
                            {label}
                          </span>
                          <span className="font-serif text-sm opacity-90 leading-snug">{value}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Medidores de Rendimiento Dinámicos */}
              {(estela || duracion) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-[#141f36]/10">
                  {estela && (
                    <div>
                      <h3 className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#141f36] mb-3">
                        <span className="flex items-center gap-2"><Wind className="w-3.5 h-3.5 text-[#c0a062]" /> Estela</span>
                        <span className="text-[#141f36]/60">{estela}</span>
                      </h3>
                      <div className="w-full bg-[#141f36]/10 h-1.5 rounded-full overflow-hidden">
                        <div className={`bg-[#c0a062] h-full ${getMeterWidth(estela)} transition-all duration-1000`} />
                      </div>
                    </div>
                  )}
                  {duracion && (
                    <div>
                      <h3 className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#141f36] mb-3">
                        <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-[#c0a062]" /> Longevidad</span>
                        <span className="text-[#141f36]/60">{duracion}</span>
                      </h3>
                      <div className="w-full bg-[#141f36]/10 h-1.5 rounded-full overflow-hidden">
                        <div className={`bg-[#141f36] h-full ${getMeterWidth(duracion)} transition-all duration-1000`} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Otras especificaciones (residuales) y Fragrantica */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-[#141f36]/10 gap-4">
                <div className="flex items-center gap-3 text-[#141f36] text-sm font-serif italic">
                  <SunMoon className="w-5 h-5 text-[#c0a062]" />
                  {ocasion ? ocasion : "Ideal para cualquier ocasión"}
                </div>
                <a 
                  href={linkRating} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#141f36] bg-white border border-[#141f36]/20 px-4 py-2 hover:bg-[#141f36] hover:text-[#f6f4ed] transition-colors shadow-sm"
                >
                  <Star className="w-3.5 h-3.5" />
                  Ver Rating
                </a>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}