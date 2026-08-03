"use client"

import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { X, Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total } = useCart()

  // Mismas reglas de envío que tenías
  const envioGratis = total >= 100000

  const generarEnlaceWhatsApp = () => {
    const numeroWA = "5493516087006"
    let mensaje = "¡Hola León e Indio! Quiero encargar esto:\n\n"
    items.forEach((item) => {
      mensaje += `✦ *${item.name}* (${item.size}) x${item.quantity} - $${(item.price * item.quantity).toLocaleString("es-AR")}\n`
    })
    mensaje += `\n*Total a abonar:* $${total.toLocaleString("es-AR")}\n\n¿Me confirman stock y datos para transferencia?`
    return `https://wa.me/${numeroWA}?text=${encodeURIComponent(mensaje)}`
  }

  // Fondo oscuro que aparece detrás del carrito
  if (!isOpen) return null

  return (
    <>
      {/* Overlay oscuro para cerrar al hacer clic afuera */}
      <div 
        className="fixed inset-0 bg-[#141f36]/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel Lateral que desliza desde la derecha */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#f6f4ed] shadow-2xl z-50 flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Cabecera del Carrito */}
        <div className="flex items-center justify-between p-6 border-b border-[#141f36]/10 bg-white">
          <h2 className="font-serif text-2xl font-medium text-[#141f36] flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#c0a062]" />
            Tu Selección
          </h2>
          <button onClick={onClose} className="p-2 text-[#141f36]/50 hover:text-[#141f36] transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de Productos (Con Scroll) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <ShoppingBag className="w-12 h-12 mb-4 text-[#141f36]" />
              <p className="font-serif italic text-lg text-[#141f36]">Tu carrito está vacío.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-white p-3 border border-[#141f36]/5 shadow-sm">
                <div className="relative w-20 h-24 bg-[#f6f4ed] flex-shrink-0 flex items-center justify-center p-2">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain p-2" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-serif text-sm font-medium text-[#141f36] line-clamp-1">{item.name}</h3>
                      <p className="text-[10px] text-[#c0a062] uppercase tracking-widest font-bold mt-1">{item.size}</p>
                    </div>
                    <button onClick={() => removeItem(item.id, item.size)} className="text-[#141f36]/30 hover:text-red-900 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 border border-[#141f36]/20 bg-[#f6f4ed]">
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="px-2 py-1 hover:text-[#c0a062]"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="px-2 py-1 hover:text-[#c0a062]"><Plus className="w-3 h-3" /></button>
                    </div>
                    <p className="font-serif font-medium text-[#141f36] text-sm">
                      ${(item.price * item.quantity).toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer del Carrito (Subtotales y Botón de Pago) */}
        {items.length > 0 && (
          <div className="border-t border-[#141f36]/10 bg-white p-6">
            {!envioGratis && (
              <p className="text-[10px] text-center text-[#141f36]/60 uppercase tracking-widest mb-4 font-bold bg-[#f6f4ed] py-2 border border-[#141f36]/10">
                Faltan ${(100000 - total).toLocaleString("es-AR")} para envío gratis
              </p>
            )}
            
            <div className="flex justify-between items-center mb-6 font-serif">
              <span className="text-lg text-[#141f36]/70">Total estimado</span>
              <span className="text-2xl font-semibold text-[#141f36]">${total.toLocaleString("es-AR")}</span>
            </div>

            <Button asChild size="lg" className="w-full h-14 bg-[#141f36] hover:bg-[#1a2640] text-[#f6f4ed] rounded-none uppercase tracking-[0.2em] text-xs font-bold transition-all shadow-xl hover:-translate-y-1 mb-3">
              <Link href="/cart" onClick={onClose}>Ir al Checkout</Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full h-12 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-none uppercase tracking-[0.1em] text-xs font-bold transition-all">
              <a href={generarEnlaceWhatsApp()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" /> Encargar por WhatsApp
              </a>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}