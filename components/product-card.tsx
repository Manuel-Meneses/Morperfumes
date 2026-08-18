"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageCircle, Star } from "lucide-react"
import { Button } from "./ui/button"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  notes?: string
}

export function ProductCard({ product }: { product: Product }) {
  // Número de León e Indio (extraído del brief)
  const numeroWA = "5493516087006"
  
  // Armamos el mensaje específico para este producto
  const mensajeWA = `¡Hola León e Indio! Me interesa el perfume ${product.name}.\n\nEspecificaciones:\n- Precio: $${product.price.toLocaleString("es-AR")}\n- Notas: ${product.notes}\n\n¿Tienen stock disponible para encargar?`
  const linkWA = `https://wa.me/${numeroWA}?text=${encodeURIComponent(mensajeWA)}`
  
  // Link para el rating (busca el nombre del perfume en Fragrantica)
  const linkRating = `https://www.fragrantica.es/buscar/?q=${encodeURIComponent(product.name)}`

  return (
    <div className="group relative border border-border bg-card rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] bg-[#f6f4ed] flex items-center justify-center overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          // ACÁ ESTÁ LA MAGIA: object-contain + drop-shadow + p-6 para que respire
          className="object-contain transition-transform duration-700 group-hover:scale-105 p-6 drop-shadow-[0_15px_15px_rgba(0,0,0,0.12)]"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </Link>
      
      <div className="p-4 flex flex-col flex-grow text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mb-1">
          {product.category}
        </p>
        <h3 className="font-serif text-lg font-medium text-foreground leading-tight mb-2">
          {product.name}
        </h3>
        
        {product.notes && (
          <p className="text-xs italic text-muted-foreground line-clamp-3 mb-3">
            {product.notes}
          </p>
        )}
        
        <p className="text-base font-semibold text-foreground mt-auto mb-4">
          ${product.price.toLocaleString("es-AR")}
        </p>

        <div className="flex flex-col gap-2 mt-auto">
          {/* Botón de Rating */}
          <Button asChild variant="outline" size="sm" className="w-full text-xs h-9">
            <a href={linkRating} target="_blank" rel="noopener noreferrer">
              <Star className="h-3 w-3 mr-2 fill-current" />
              Ver Rating
            </a>
          </Button>
          
        </div>
      </div>
    </div>
  )
}