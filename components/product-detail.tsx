"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { useCart } from "./cart-provider"
import { useToast } from "@/hooks/use-toast"
import { Check, ShoppingBag, AlertCircle } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image?: string
  images?: string[] // Acá llegarán las fotos internas (diferentes a la principal)
  category: string
  description?: string
  details?: string[]
  sizes?: string[]
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [isAdding, setIsAdding] = useState(false)
  const [showSizeError, setShowSizeError] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  // 🛡️ EL BLINDAJE Y LAS FOTOS INTERNAS:
  // Si enviaste fotos en el array 'images' (las internas), usamos esas. 
  // Si no, usamos la principal por defecto.
  const imagenesSeguras = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || "/placeholder.svg"]
    
  const detallesSeguros = product.details || ["Familia: " + product.category, "100% Original Garantizado"]
  const tamanosSeguros = product.sizes || ["Decant 1.25ml", "Decant 2.5ml", "Decant 5ml", "Decant 10ml", "Frasco Sellado"]
  const descripcionSegura = product.description || `Descubrí la esencia de ${product.name}.`

  // Lógica para calcular el precio
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
        description: "Por favor elegí un tamaño antes de agregar al carrito.",
        variant: "destructive",
        duration: 3000,
      })
      setTimeout(() => setShowSizeError(false), 1000)
      return
    }

    setIsAdding(true)
    setShowSizeError(false)

    const item = {
      id: product.id,
      name: product.name,
      price: precioActual,
      image: imagenesSeguras[0],
      size: selectedSize,
    }

    addItem(item)

    toast({
      title: "Agregado a tu selección",
      description: `${product.name} - ${selectedSize}`,
      duration: 2000,
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 2000)
  }

  return (
    <div className="bg-[#f6f4ed] min-h-screen text-[#141f36]">
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-16 max-w-[1400px]">
        
        {/* Layout Editorial: 60% Fotos / 40% Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: Galería de Fotos Apiladas (Scrollable) */}
          <div className="lg:col-span-7 flex flex-col gap-4 md:gap-8">
            {imagenesSeguras.map((img, index) => (
              <div key={index} className="relative aspect-[4/5] bg-white border border-[#141f36]/5 overflow-hidden group">
                {/* Efecto de marco interno elegante */}
                <div className="absolute inset-4 sm:inset-6 border border-[#141f36]/5 pointer-events-none z-10 transition-colors duration-500 group-hover:border-[#c0a062]/30" />
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${product.name} - Vista ${index + 1}`}
                  fill
                  className="object-contain p-8 sm:p-12 transition-transform duration-700 hover:scale-105"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: Información (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col pt-4 lg:pt-0">
            
            {/* Encabezado */}
            <div className="mb-8 border-b border-[#141f36]/10 pb-8">
              <p className="text-[#c0a062] font-bold tracking-[0.2em] uppercase text-xs mb-4">
                {product.category}
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-6 leading-[1.1] text-balance">
                {product.name}
              </h1>
              <p className="text-2xl sm:text-3xl font-serif text-[#141f36]">
                ${precioActual.toLocaleString("es-AR")}
              </p>
            </div>
            
            {/* Descripción */}
            <p className="text-base sm:text-lg text-[#141f36]/70 leading-relaxed mb-10 font-serif italic">
              "{descripcionSegura}"
            </p>

            {/* Selección de Formato */}
            <div className={`mb-10 transition-all duration-300 ${showSizeError ? "animate-shake" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#141f36]">Formato</h3>
                {showSizeError && (
                  <div className="flex items-center gap-1 text-[#991b1b] text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                    <AlertCircle className="h-3 w-3" />
                    Requerido
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {tamanosSeguros.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size)
                        setShowSizeError(false)
                      }}
                      className={`relative px-4 py-4 border transition-all duration-300 flex flex-col items-center justify-center gap-1 overflow-hidden ${
                        isSelected
                          ? "bg-[#141f36] border-[#141f36] text-[#f6f4ed] shadow-lg"
                          : "bg-transparent border-[#141f36]/20 text-[#141f36] hover:border-[#c0a062] hover:text-[#c0a062]"
                      }`}
                    >
                      <span className={`text-xs font-bold uppercase tracking-widest ${isSelected ? 'text-[#c0a062]' : ''}`}>
                        {size.includes("Decant") ? "Decant" : "Original"}
                      </span>
                      <span className={`font-serif text-sm ${isSelected ? 'text-[#f6f4ed]' : 'text-[#141f36]/70'}`}>
                        {size.replace("Decant ", "").replace("Frasco ", "")}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Botón de Compra Premium */}
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full h-14 md:h-16 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-12 transition-all duration-300 bg-[#c0a062] hover:bg-[#141f36] text-[#141f36] hover:text-[#f6f4ed] rounded-none border-none shadow-xl disabled:opacity-90"
            >
              {isAdding ? (
                <>
                  <Check className="h-4 w-4 mr-3 animate-in zoom-in-50 duration-300" />
                  Agregado a la Colección
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 mr-3" />
                  Seleccionar para Encargo
                </>
              )}
            </Button>

            {/* Acordeón Fijo de Detalles */}
            <div className="border-t border-[#141f36]/10 pt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#141f36] mb-6">Pirámide Olfativa & Especificaciones</h3>
              <ul className="space-y-4">
                {detallesSeguros.map((detail, index) => (
                  <li key={index} className="flex items-start gap-4 text-sm md:text-base text-[#141f36]/80 font-serif border-b border-[#141f36]/5 pb-4 last:border-0">
                    <span className="text-[#c0a062] text-sm mt-1">✦</span>
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Garantías Mínimas */}
            <div className="mt-8 pt-8 flex gap-6 text-[#141f36]/50">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c0a062]">Garantía</span>
                <span className="text-xs font-serif">100% Auténticos</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c0a062]">Logística</span>
                <span className="text-xs font-serif">Envíos a todo el país</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}