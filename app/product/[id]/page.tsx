"use client"

// 1. Agregamos "use" a la importación de React
import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ShoppingBag, Droplets, Sparkles, Wind } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { getProducts, Product } from "@/lib/api"
import { useCart } from "@/components/cart-provider"

// 2. Actualizamos el tipo de params para que Next.js sepa que es una Promesa
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 3. "Desenvolvemos" los params usando React.use()
  const resolvedParams = use(params)
  const productId = resolvedParams.id

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const { addItem } = useCart()

useEffect(() => {
    async function loadProduct() {
      const products = await getProducts()
      
      // SOLUCIÓN: Traducimos la URL por si el navegador rompió las tildes o espacios
      const cleanId = decodeURIComponent(productId)
      
      // Buscamos usando el ID limpio
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
      <div className="min-h-screen bg-[#f6f4ed] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#c0a062] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) return notFound()

  // CÁLCULO DE PRECIO DINÁMICO
  const currentPrice = product.sizePrices && product.sizePrices[selectedSize] 
    ? product.sizePrices[selectedSize] 
    : product.price

  const parseDetail = (detail: string) => {
    const [label, ...rest] = detail.split(":")
    return { label: label.trim(), value: rest.join(":").trim() }
  }

  const olfactoryNotes = product.details.filter(d => d.includes("Notas de"))
  const technicalSpecs = product.details.filter(d => !d.includes("Notas de") && d.includes(":"))

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      image: product.image,
      size: selectedSize,
    })
  }

  return (
    <div className="min-h-screen bg-[#f6f4ed] text-[#141f36]">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <Button variant="ghost" asChild className="hover:bg-[#141f36]/5 text-[#141f36] mb-4">
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          <div className="relative aspect-[4/5] bg-white border border-[#141f36]/10 shadow-2xl p-8 group">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#c0a062]/70 transition-transform duration-700 group-hover:-translate-x-1 group-hover:-translate-y-1" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#c0a062]/70 transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-1" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#c0a062]/70 transition-transform duration-700 group-hover:-translate-x-1 group-hover:translate-y-1" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#c0a062]/70 transition-transform duration-700 group-hover:translate-x-1 group-hover:translate-y-1" />
            
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-12 transition-transform duration-1000 group-hover:scale-105"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            
            <div className="mb-8 border-b border-[#141f36]/10 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#c0a062] text-xs font-bold tracking-[0.2em] uppercase">
                  {product.category}
                </span>
                {product.availability === "encargo" && (
                  <span className="bg-[#141f36] text-[#f6f4ed] text-[10px] px-2 py-1 uppercase tracking-widest">
                    Por Encargo
                  </span>
                )}
              </div>
              
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold mb-3 leading-tight">
                {product.name}
              </h1>
              
              {product.notes && (
                <p className="text-lg font-serif italic text-[#141f36]/70 mb-4">
                  "{product.notes}"
                </p>
              )}

              <div className="text-3xl font-serif text-[#141f36] mt-4 transition-all duration-300">
                ${currentPrice.toLocaleString("es-AR")}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#141f36] mb-4 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#c0a062]" />
                Seleccionar Formato
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-3 border text-sm font-medium transition-all duration-300 ${
                      selectedSize === size
                        ? "border-[#141f36] bg-[#141f36] text-[#f6f4ed] shadow-lg"
                        : "border-[#141f36]/20 bg-transparent text-[#141f36] hover:border-[#c0a062] hover:text-[#c0a062]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleAddToCart}
              className="w-full h-14 bg-[#c0a062] hover:bg-[#a68850] text-[#141f36] text-lg rounded-none border-none shadow-[0_0_20px_rgba(192,160,98,0.3)] transition-all hover:scale-[1.02] mb-12"
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              Agregar a la Selección
            </Button>

            <div className="space-y-10">
              <div>
                <h3 className="font-serif text-2xl font-semibold mb-6 flex items-center gap-2 border-b border-[#141f36]/10 pb-4">
                  <Wind className="w-5 h-5 text-[#c0a062]" />
                  La Fragancia
                </h3>
                <p className="text-[#141f36]/80 leading-relaxed mb-6">
                  {product.description}
                </p>

                {olfactoryNotes.length > 0 && (
                  <div className="bg-[#141f36] text-[#f6f4ed] p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {olfactoryNotes.map((note, index) => {
                      const { label, value } = parseDetail(note)
                      let icon = "✨"
                      if (label.toLowerCase().includes("salida")) icon = "🍋"
                      if (label.toLowerCase().includes("corazón") || label.toLowerCase().includes("corazon")) icon = "🌸"
                      if (label.toLowerCase().includes("fondo")) icon = "🪵"

                      return (
                        <div key={index} className="flex flex-col items-center text-center">
                          <span className="text-xl mb-2">{icon}</span>
                          <span className="text-[#c0a062] text-[10px] uppercase tracking-widest font-bold mb-1">
                            {label}
                          </span>
                          <span className="font-serif text-sm opacity-90">{value}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {technicalSpecs.length > 0 && (
                <div>
                  <h3 className="font-serif text-2xl font-semibold mb-6 flex items-center gap-2 border-b border-[#141f36]/10 pb-4">
                    <Sparkles className="w-5 h-5 text-[#c0a062]" />
                    Especificaciones
                  </h3>
                  <ul className="space-y-3">
                    {technicalSpecs.map((spec, index) => {
                      const { label, value } = parseDetail(spec)
                      if (!value || value === "-" || value === "No especificada") return null
                      
                      return (
                        <li key={index} className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#141f36]/5 pb-3">
                          <span className="text-[#141f36]/60 text-sm font-bold uppercase tracking-wider mb-1 sm:mb-0">
                            {label}
                          </span>
                          <span className="font-serif text-[#141f36] text-right sm:w-2/3">
                            {value}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}