"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { Button } from "./ui/button"
import { precioCuota } from "@/lib/utils"
import { useCart } from "./cart-provider"
import { useToast } from "@/hooks/use-toast"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  notes?: string
  sizes?: string[]
  sizePrices?: Record<string, number>
}

export function ProductCard({ product, returnUrl }: { product: Product; returnUrl?: string }) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const href = returnUrl ? `/product/${product.id}?from=${returnUrl}` : `/product/${product.id}`

  // "Comprar" agrega directo al carrito el primer formato disponible
  // (en sellados es "Frasco Sellado"; en decants, el tamaño más chico).
  const handleBuy = () => {
    const size = product.sizes?.[0] ?? "Frasco Sellado"
    const price = product.sizePrices?.[size] ?? product.price
    addItem({ id: product.id, name: product.name, price, image: product.image, size })
    toast({
      title: "Agregado a tu selección",
      description: `${product.name} (${size}) ya está en tu carrito.`,
    })
  }

  return (
    <div className="group relative border border-border bg-card rounded-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <Link href={href} className="block relative aspect-[3/4] bg-[#f6f4ed] flex items-center justify-center overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-contain transition-transform duration-700 group-hover:scale-105 p-2 drop-shadow-[0_15px_15px_rgba(0,0,0,0.12)]"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </Link>

      <div className="p-2.5 sm:p-3 flex flex-col flex-grow text-center">
        <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest font-medium mb-1 truncate">
          {product.category}
        </p>
        <Link href={href}>
          <h3 className="font-serif text-sm sm:text-base font-medium text-foreground leading-tight mb-1.5 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.notes && (
          <p className="hidden sm:block text-[11px] italic text-muted-foreground line-clamp-2 mb-2">
            {product.notes}
          </p>
        )}

        <div className="mt-auto mb-3">
          <p className="text-sm sm:text-base font-semibold text-foreground leading-tight">
            ${product.price.toLocaleString("es-AR")}
            <span className="block sm:inline text-[9px] sm:text-[10px] font-normal text-muted-foreground sm:ml-1 align-middle">
              efectivo / transf.
            </span>
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            o 3 cuotas de ${precioCuota(product.price).toLocaleString("es-AR")}
          </p>
        </div>

        <Button
          onClick={handleBuy}
          size="sm"
          className="w-full h-9 text-[11px] sm:text-xs font-bold uppercase tracking-widest rounded-sm bg-[#c0a062] text-[#141f36] hover:bg-[#141f36] hover:text-[#f6f4ed] transition-colors"
        >
          <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
          Comprar
        </Button>
      </div>
    </div>
  )
}
