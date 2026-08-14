"use client"

import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, Tag, ArrowLeft, MessageCircle } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const { toast } = useToast()

  const coupons = {
    "MOR10": 10,
    "HERENCIA": 15,
  }

  const handleApplyCoupon = () => {
    setIsApplying(true)
    setTimeout(() => {
      const discount = coupons[couponCode.toUpperCase() as keyof typeof coupons]
      if (discount) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount })
        toast({
          title: "¡Cupón aplicado!",
          description: `Ahorraste un ${discount}% en tu pedido.`,
        })
      } else {
        toast({
          title: "Cupón inválido",
          description: "Por favor revisá el código e intentá nuevamente.",
          variant: "destructive",
        })
      }
      setIsApplying(false)
    }, 500)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
  }

  const discountAmount = appliedCoupon ? (total * appliedCoupon.discount) / 100 : 0
  const subtotalAfterDiscount = total - discountAmount
  
  const envioGratis = subtotalAfterDiscount >= 100000

  const generarEnlaceWhatsApp = () => {
    const numeroWA = "5493516087006"
    let mensaje = "¡Hola León e Indio! Quiero realizar el siguiente pedido:\n\n"
    
    items.forEach((item) => {
      mensaje += `✦ *${item.name}*\n   Formato: ${item.size}\n   Cantidad: ${item.quantity}\n   Precio: $${(item.price * item.quantity).toLocaleString("es-AR")}\n\n`
    })

    mensaje += `*Subtotal:* $${total.toLocaleString("es-AR")}\n`
    
    if (appliedCoupon) {
      mensaje += `*Descuento (${appliedCoupon.code}):* -$${discountAmount.toLocaleString("es-AR")}\n`
    }

    mensaje += `*Envío (Paq.ar):* ${envioGratis ? "¡Gratis!" : "A coordinar"}\n`
    mensaje += `*Total a abonar:* $${subtotalAfterDiscount.toLocaleString("es-AR")}\n\n`
    mensaje += "¿Me confirman el stock y los datos para realizar la transferencia?"

    return `https://wa.me/${numeroWA}?text=${encodeURIComponent(mensaje)}`
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f4ed]">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <Button variant="ghost" asChild className="mb-6 hover:bg-[#141f36]/5 text-[#141f36]">
              <Link href="/shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Catálogo
              </Link>
            </Button>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-[#141f36]">Tu Selección</h1>
            <p className="text-[#141f36]/70 mb-8 font-serif italic text-lg">Aún no has agregado ninguna esencia.</p>
            <Button asChild size="lg" className="bg-[#c0a062] hover:bg-[#a68850] text-[#141f36] rounded-none border-none">
              <Link href="/shop">Descubrir Fragancias</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f4ed]">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <Button variant="ghost" asChild className="mb-4 hover:bg-[#141f36]/5 text-[#141f36]">
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Seguir Explorando
          </Link>
        </Button>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 sm:mb-8 text-[#141f36]">
          Tu Selección
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {items.map((item) => {
              // MAGIA ACÁ: Separamos el string en un array de imágenes
              const imageUrls = item.image ? item.image.split(',') : [];

              return (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-[#141f36]/10">
                  
                  {/* MINI-COLLAGE EN EL CARRITO */}
                  <div className="relative w-24 h-32 sm:w-28 sm:h-40 bg-[#e6e2d3] flex-shrink-0 overflow-hidden border border-[#141f36]/10 p-2 flex items-center justify-center">
                    {imageUrls.length === 0 && (
                      <Image src="/placeholder.svg" alt={item.name} fill className="object-cover p-3" />
                    )}
                    {imageUrls.length === 1 && (
                      <Image src={imageUrls[0]} alt={item.name} fill className="object-contain p-2" />
                    )}
                    {imageUrls.length === 2 && (
                      <>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-[60%] h-[80%] z-10"><Image src={imageUrls[0]} alt="P1" fill className="object-contain drop-shadow-md" /></div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-[55%] h-[75%] z-0"><Image src={imageUrls[1]} alt="P2" fill className="object-contain opacity-80" /></div>
                      </>
                    )}
                    {imageUrls.length >= 3 && (
                      <>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[45%] h-[65%] z-0"><Image src={imageUrls[1]} alt="P2" fill className="object-contain opacity-80" /></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[65%] z-0"><Image src={imageUrls[2]} alt="P3" fill className="object-contain opacity-80" /></div>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[85%] z-10"><Image src={imageUrls[0]} alt="P1" fill className="object-contain drop-shadow-lg" /></div>
                      </>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between gap-2 sm:gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-[#141f36] mb-1 truncate">{item.name}</h3>
                        <p className="text-xs text-[#4a5d4e] uppercase tracking-wider mb-2 leading-relaxed">{item.size}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-[#141f36]/40 hover:text-[#991b1b] transition-colors flex-shrink-0"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Eliminar esencia</span>
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex items-center gap-3 border border-[#141f36]/20 bg-white/50">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-[#141f36]/5 transition-colors text-[#141f36]"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-[#141f36]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-[#141f36]/5 transition-colors text-[#141f36]"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-medium text-lg text-[#141f36]">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-[#141f36]/10 bg-white/50 p-6 sm:p-8 lg:sticky lg:top-24 rounded-none shadow-sm">
              <h2 className="font-serif text-2xl font-semibold mb-6 text-[#141f36]">Resumen del Pedido</h2>

              <div className="mb-6 pb-6 border-b border-[#141f36]/10">
                <Label htmlFor="coupon" className="text-sm font-medium mb-3 block text-[#141f36]">
                  Código de Descuento
                </Label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-[#141f36]/5 border border-[#141f36]/10">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-[#4a5d4e]" />
                      <span className="text-sm font-medium text-[#141f36]">{appliedCoupon.code}</span>
                      <span className="text-xs text-[#141f36]/60">-{appliedCoupon.discount}%</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-xs text-[#991b1b]/70 hover:text-[#991b1b]">
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="Ingresar código"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-transparent border-[#141f36]/20 rounded-none focus-visible:ring-[#c0a062]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || isApplying}
                      className="px-4 bg-transparent border-[#141f36]/20 text-[#141f36] rounded-none hover:bg-[#141f36]/5"
                    >
                      {isApplying ? "..." : "Aplicar"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-[#141f36]/80">
                  <span>Subtotal</span>
                  <span className="font-medium">${total.toLocaleString("es-AR")}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-[#4a5d4e] font-medium">
                    <span>Descuento ({appliedCoupon.discount}%)</span>
                    <span>-${discountAmount.toLocaleString("es-AR")}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm text-[#141f36]/80">
                  <span>Envío (Paq.ar)</span>
                  <span className="font-medium">{envioGratis ? "¡Gratis!" : "A coordinar"}</span>
                </div>
              </div>

              <div className="border-t border-[#141f36]/10 pt-4 mb-6">
                <div className="flex justify-between font-serif text-xl font-semibold text-[#141f36]">
                  <span>Total</span>
                  <span>${subtotalAfterDiscount.toLocaleString("es-AR")}</span>
                </div>
              </div>

              {!envioGratis && (
                <p className="text-xs text-[#4a5d4e] mb-6 text-center font-medium bg-[#4a5d4e]/10 p-2">
                  Agregá ${(100000 - subtotalAfterDiscount).toLocaleString("es-AR")} más para obtener envío gratis.
                </p>
              )}

              <Button asChild size="lg" className="w-full h-14 text-base mb-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-none border-none shadow-lg transition-colors">
                <a href={generarEnlaceWhatsApp()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Enviar Pedido por WhatsApp
                </a>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full h-12 text-sm bg-transparent border-[#141f36]/20 text-[#141f36] rounded-none hover:bg-[#141f36]/5">
                <Link href="/shop">Agregar más fragancias</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}