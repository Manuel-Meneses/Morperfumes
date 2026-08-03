"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { useCart } from "./cart-provider"
import { useToast } from "@/hooks/use-toast"
import { Check, ShoppingBag, AlertCircle, Droplet } from "lucide-react"

// Actualizamos la interfaz para que acepte tanto "image" (singular) como "images" (plural)
interface Product {
  id: string
  name: string
  price: number
  image?: string
  images?: string[]
  category: string
  description?: string
  details?: string[]
  sizes?: string[]
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSizeError, setShowSizeError] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  // 🛡️ EL BLINDAJE: Si el excel no manda un array de 'images', armamos uno usando la 'image' principal
  const imagenesSeguras = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || "/placeholder.svg"]
    
  const detallesSeguros = product.details || ["Familia: " + product.category, "100% Original Garantizado"]
  const tamanosSeguros = product.sizes || ["Decant 1.25ml", "Decant 2.5ml", "Decant 5ml", "Decant 10ml", "Frasco Sellado"]
  const descripcionSegura = product.description || `Descubrí la esencia de ${product.name}.`

  // Lógica para calcular el precio del decant basado en el precio del frasco sellado
  const calcularPrecioPorFormato = (size: string) => {
    if (size === "Frasco Sellado") return product.price
    if (size === "Decant 10ml") return Math.round(product.price * 0.15)
    if (size === "Decant 5ml") return Math.round(product.price * 0.08)
    if (size === "Decant 2.5ml") return Math.round(product.price * 0.05)
    if (size === "Decant 1.25ml") return Math.round(product.price * 0.03)
    return product.price
  }

  const precioActual = selectedSize ? calcularPrecioPorFormato(selectedSize) : product.price

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true)
      toast({
        title: "Seleccioná un formato",
        description: "Por favor elegí un tamaño de decant o frasco antes de agregar.",
        variant: "destructive",
        duration: 3000,
      })
      setTimeout(() => setShowSizeError(false), 1000)
      return
    }

    setIsAdding(true)
    setShowSuccess(true)
    setShowSizeError(false)

    const item = {
      id: product.id,
      name: product.name,
      price: precioActual,
      image: imagenesSeguras[0], // Usamos la primera imagen segura para el carrito
      size: selectedSize,
    }

    addItem(item)

    toast({
      title: "¡Agregado a tu selección!",
      description: `${product.name} - ${selectedSize}`,
      duration: 2000,
    })

    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 bg-[#f6f4ed] text-[#141f36]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-16">
        
        {/* Product Images - Estilo Botica */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative aspect-[3/4] bg-[#e6e2d3] overflow-hidden border border-[#141f36]/10 p-4">
            <div className="absolute inset-3 border border-[#141f36]/10 pointer-events-none z-10" />
            <Image
              src={imagenesSeguras[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover p-6"
              priority
            />
            {showSuccess && (
              <div className="absolute inset-0 bg-[#141f36]/90 flex items-center justify-center animate-in fade-in zoom-in-50 duration-300 z-20">
                <div className="bg-[#f6f4ed] text-[#c0a062] rounded-full p-4 sm:p-6 animate-in zoom-in-50 duration-500 delay-150">
                  <Check className="h-8 w-8 sm:h-12 sm:w-12" />
                </div>
              </div>
            )}
          </div>
          
          {/* Galería (Solo se muestra si hay más de 1 imagen, para que quede prolijo) */}
          {imagenesSeguras.length > 1 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {imagenesSeguras.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-[3/4] bg-[#e6e2d3] overflow-hidden transition-colors border-2 ${
                    selectedImage === index ? "border-[#c0a062]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} vista ${index + 1}`}
                    fill
                    className="object-cover p-2"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-4 sm:mb-6 border-b border-[#141f36]/10 pb-6">
            <p className="text-xs text-[#4a5d4e] uppercase tracking-[0.2em] mb-3 font-medium">
              {product.category}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-balance leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl sm:text-3xl font-medium text-[#141f36]">
              ${precioActual.toLocaleString("es-AR")}
            </p>
          </div>
          
          <p className="text-sm sm:text-base text-[#141f36]/80 leading-relaxed mb-6 sm:mb-8 font-serif">
            {descripcionSegura}
          </p>

          {/* Size Selection */}
          <div className={`mb-8 transition-all duration-300 ${showSizeError ? "animate-shake" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm sm:text-base uppercase tracking-wider text-[#4a5d4e]">Seleccionar Formato</h3>
              {showSizeError && (
                <div className="flex items-center gap-1 text-[#991b1b] text-xs sm:text-sm animate-in fade-in slide-in-from-right-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Por favor elegí un formato</span>
                </div>
              )}
            </div>
            <div
              className={`flex flex-wrap gap-3 p-4 border rounded-none transition-colors ${
                showSizeError ? "border-[#991b1b] bg-[#991b1b]/5" : "border-[#141f36]/10"
              }`}
            >
              {tamanosSeguros.map((size) => {
                const isDecant = size.includes("Decant")
                return (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size)
                      setShowSizeError(false)
                    }}
                    className={`px-4 sm:px-6 py-2.5 sm:py-3 border rounded-none transition-all duration-200 text-sm sm:text-base flex items-center gap-2 ${
                      selectedSize === size
                        ? "bg-[#141f36] text-[#f6f4ed] border-[#141f36] shadow-md"
                        : "bg-transparent text-[#141f36] border-[#141f36]/30 hover:border-[#c0a062] hover:text-[#c0a062]"
                    }`}
                  >
                    {isDecant && <Droplet className="h-3 w-3" />}
                    {size}
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            size="lg"
            className="w-full h-12 sm:h-14 text-base sm:text-lg mb-8 transition-all duration-300 disabled:scale-100 bg-[#c0a062] hover:bg-[#a68850] text-[#141f36] rounded-none border-none shadow-xl"
          >
            {isAdding ? (
              <>
                <Check className="h-5 w-5 mr-2 animate-in zoom-in-50 duration-300" />
                ¡Agregado a la selección!
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5 mr-2" />
                Seleccionar para Encargo
              </>
            )}
          </Button>

          {/* Product Details */}
          <div className="border-t border-[#141f36]/10 pt-6 sm:pt-8">
            <h3 className="font-medium text-sm sm:text-base mb-4 uppercase tracking-wider text-[#4a5d4e]">Notas Olfativas y Detalles</h3>
            <ul className="space-y-3">
              {detallesSeguros.map((detail, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-[#141f36]/80 font-serif">
                  <span className="text-[#c0a062] mt-1 text-lg leading-none">✦</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Shipping & Returns */}
          <div className="border-t border-[#141f36]/10 mt-8 pt-8 space-y-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-[#141f36]">Envíos (Correo Paq.ar)</h4>
              <p className="text-[#141f36]/70">Envío gratis a partir de $100.000.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-[#141f36]">Políticas y Garantía</h4>
              <p className="text-[#141f36]/70">Por la naturaleza de los decants, no se aceptan devoluciones. 100% Originales garantizados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}