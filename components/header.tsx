"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, User, Menu } from "lucide-react"
import { useCart } from "./cart-provider"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { useState } from "react"

export function Header() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="relative w-full border-b border-[#141f36]/20 bg-[#f6f4ed]">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        
        {/* Logo Principal */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Mor Perfumes"
            width={200} 
            height={60}
            className="h-16 md:h-26 w-auto object-contain" 
            priority
          />
        </Link>

        {/* Desktop Navigation - Fuente Serif y hover en Oro Viejo */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="text-lg font-serif text-[#141f36] hover:text-[#c0a062] transition-colors duration-300">
            Catálogo
          </Link>
          <Link href="/reviews" className="text-lg font-serif text-[#141f36] hover:text-[#c0a062] transition-colors duration-300">
            Reseñas
          </Link>
          <Link href="/about" className="text-lg font-serif text-[#141f36] hover:text-[#c0a062] transition-colors duration-300">
            Nuestra Historia
          </Link>
        </nav>

        {/* Actions - Íconos en Azul Marino */}
        <div className="flex items-center gap-4 text-[#141f36]">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-[#141f36]/5 hover:text-[#c0a062]">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#141f36] text-[#f6f4ed] text-xs flex items-center justify-center font-medium animate-in zoom-in-50 duration-200 shadow-sm">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Carrito ({itemCount} ítems)</span>
            </Button>
          </Link>

          {/* Menú Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-[#141f36]/5">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            
            {/* Interior del Menú Mobile adaptado */}
            <SheetContent
              side="right"
              className="w-[85vw] sm:w-[350px] px-6 bg-[#f6f4ed] text-[#141f36] border-l border-[#141f36]/20 [&>button]:border-0 [&>button]:shadow-none [&>button]:ring-0 [&>button]:top-8"
            >
              <div className="flex flex-col gap-10 pt-10">
                {/* Logo Mobile */}
                <div className="flex justify-center">
                  <Image 
                    src="/logo.png" 
                    alt="Mor Perfumes"
                    width={200} 
                    height={60}
                    className="h-12 w-auto object-contain"
                  />
                </div>

                <nav className="flex flex-col gap-0">
                  <Link
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className="text-xl font-serif py-5 px-4 border-b border-[#141f36]/10 hover:bg-[#141f36]/5 hover:text-[#c0a062] transition-colors"
                  >
                    Catálogo
                  </Link>
                  <Link
                    href="/reviews"
                    onClick={() => setOpen(false)}
                    className="text-xl font-serif py-5 px-4 border-b border-[#141f36]/10 hover:bg-[#141f36]/5 hover:text-[#c0a062] transition-colors"
                  >
                    Reseñas
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="text-xl font-serif py-5 px-4 border-b border-[#141f36]/10 hover:bg-[#141f36]/5 hover:text-[#c0a062] transition-colors"
                  >
                    Nuestra Historia
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="text-xl font-serif py-5 px-4 border-b border-[#141f36]/10 hover:bg-[#141f36]/5 hover:text-[#c0a062] transition-colors flex items-center justify-between"
                  >
                    <span>Selección</span>
                    {itemCount > 0 && (
                      <span className="h-6 w-6 rounded-full bg-[#141f36] text-[#f6f4ed] text-xs flex items-center justify-center font-medium">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}