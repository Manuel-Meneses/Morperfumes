"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu } from "lucide-react"
import { useCart } from "./cart-provider"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { useState, useEffect } from "react"
import { CartDrawer } from "./cart-drawer" 

// 1. IMPORTAMOS EL TICKER ACÁ ADENTRO
import { ShippingTicker } from "./shipping-ticker" 

export function Header() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Estados para el Scroll
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Estados para la animación de agregar al carrito
  const [prevCount, setPrevCount] = useState(itemCount)
  const [isAnimatingCart, setIsAnimatingCart] = useState(false)

  // LÓGICA 1: Ocultar al bajar, mostrar al subir
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // Solo se oculta si bajamos más de 120px (para no parpadear apenas hacemos scroll)
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // LÓGICA 2: El usuario agregó algo al carrito
  useEffect(() => {
    if (itemCount > prevCount) {
      // 1. Forzamos a que el header baje y se haga visible
      setIsVisible(true) 
      
      // 2. Activamos el saltito dorado en la bolsita
      setIsAnimatingCart(true) 
      
      // 3. Apagamos la animación después de 1 segundo para que vuelva a la normalidad
      const timer = setTimeout(() => setIsAnimatingCart(false), 1000)
      return () => clearTimeout(timer)
    }
    setPrevCount(itemCount)
  }, [itemCount, prevCount])

  return (
    <>
      {/* 
        Espaciador dinámico: Como el Header es "fixed" (flota), necesitamos este 
        div invisible del mismo tamaño (Ticker + Header) para que el resto de 
        la página no se superponga.
      */}
      <div className="h-[110px] md:h-[112px] w-full bg-[#f6f4ed]" />

      {/* ENVOLTORIO PRINCIPAL: Controla la aparición de Ticker + NavBar */}
      <header 
        className={`fixed top-0 left-0 w-full z-40 bg-[#f6f4ed] shadow-sm transition-transform duration-500 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* El Ticker ahora vive acá adentro y se oculta junto con el Header */}
        <ShippingTicker />

        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 border-b border-[#141f36]/10">
          
          {/* Logo Principal */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Mor Perfumes"
              width={200} 
              height={80}
              className="h-16 md:h-22 w-auto object-contain" 
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-lg font-serif text-[#141f36] hover:text-[#c0a062] transition-colors duration-300">
              Catálogo
            </Link>
            <Link href="/combos" className="text-lg font-serif text-[#141f36] hover:text-[#c0a062] transition-colors duration-300">
              Combos
            </Link>
            <Link href="/reviews" className="text-lg font-serif text-[#141f36] hover:text-[#c0a062] transition-colors duration-300">
              Reseñas
            </Link>
            <Link href="/about" className="text-lg font-serif text-[#141f36] hover:text-[#c0a062] transition-colors duration-300">
              Nuestra Historia
            </Link>
            <Link href="/faq" className="text-lg font-serif text-[#141f36] hover:text-[#c0a062] transition-colors duration-300">
              Preguntas Frecuentes
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 text-[#141f36]">
            
            {/* Botón de Carrito (Reacciona a la animación isAnimatingCart) */}
            <Button 
              variant="ghost" 
              size="icon" 
              className={`relative hover:bg-[#141f36]/5 hover:text-[#c0a062] transition-all duration-300 ${
                isAnimatingCart ? "scale-125 text-[#c0a062]" : ""
              }`}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className={`absolute -top-1 -right-1 h-5 w-5 rounded-full text-[#f6f4ed] text-xs flex items-center justify-center font-medium shadow-sm transition-colors duration-300 ${
                  isAnimatingCart ? "bg-[#c0a062]" : "bg-[#141f36]"
                }`}>
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Carrito ({itemCount} ítems)</span>
            </Button>

            {/* Menú Mobile */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-[#141f36]/5">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menú</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent
                side="right"
                className="w-[85vw] sm:w-[350px] px-6 bg-[#f6f4ed] text-[#141f36] border-l border-[#141f36]/20 [&>button]:border-0 [&>button]:shadow-none [&>button]:ring-0 [&>button]:top-8"
              >
                <div className="flex flex-col gap-10 pt-10">
                  <div className="flex justify-center">
                    <Image 
                      src="/logo.png" 
                      alt="Mor Perfumes"
                      width={200} 
                      height={80}
                      className="h-16 w-auto object-contain"
                    />
                  </div>

                  <nav className="flex flex-col gap-0">
                    <Link href="/shop" onClick={() => setOpen(false)} className="text-xl font-serif py-5 px-4 border-b border-[#141f36]/10 hover:bg-[#141f36]/5 hover:text-[#c0a062] transition-colors">
                      Catálogo
                    </Link>
                    <Link href="/combos" onClick={() => setOpen(false)} className="text-xl font-serif py-5 px-4 border-b border-[#141f36]/10 hover:bg-[#141f36]/5 hover:text-[#c0a062] transition-colors">
                      Combos 
                    </Link>
                    <Link href="/reviews" onClick={() => setOpen(false)} className="text-xl font-serif py-5 px-4 border-b border-[#141f36]/10 hover:bg-[#141f36]/5 hover:text-[#c0a062] transition-colors">
                      Reseñas
                    </Link>
                    <Link href="/about" onClick={() => setOpen(false)} className="text-xl font-serif py-5 px-4 border-b border-[#141f36]/10 hover:bg-[#141f36]/5 hover:text-[#c0a062] transition-colors">
                      Nuestra Historia
                    </Link>
                    <Link href="/faq" onClick={() => setOpen(false)} className="text-xl font-serif py-5 px-4 border-b border-[#141f36]/10 hover:bg-[#141f36]/5 hover:text-[#c0a062] transition-colors">
                      Preguntas Frecuentes
                    </Link>
                    
                    <button
                      onClick={() => {
                        setOpen(false); 
                        setIsCartOpen(true); 
                      }}
                      className="w-full text-left text-xl font-serif py-5 px-4 border-b border-[#141f36]/10 hover:bg-[#141f36]/5 hover:text-[#c0a062] transition-colors flex items-center justify-between"
                    >
                      <span>Selección</span>
                      {itemCount > 0 && (
                        <span className="h-6 w-6 rounded-full bg-[#141f36] text-[#f6f4ed] text-xs flex items-center justify-center font-medium">
                          {itemCount}
                        </span>
                      )}
                    </button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Carrito Lateral */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}