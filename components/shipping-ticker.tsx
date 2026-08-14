"use client"

import { Truck } from "lucide-react"

export function ShippingTicker() {
  const messages = [
    "ENVÍO GRATIS A PARTIR DE $100.000", 
    "100% ORIGINALES", 
    "ENVIAMOS DESDE CÓRDOBA A TODO EL PAÍS",
    "ABONÁS LA SEÑA Y EL RESTO AL ENVÍO"
  ]

  return (
    // Ya no es sticky, ahora es un bloque normal con colores premium
    <div className="bg-[#141f36] text-[#fff] py-2 overflow-hidden border-b border-[#c0a062]/20">
      <div className="flex gap-8">
        {/* First set for infinite scroll */}
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee-infinite">
          {messages.map((message, index) => (
            <span
              key={`set1-${index}`}
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest"
            >
              <Truck className="h-3.5 w-3.5" />
              {message}
            </span>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee-infinite" aria-hidden="true">
          {messages.map((message, index) => (
            <span
              key={`set2-${index}`}
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest"
            >
              <Truck className="h-3.5 w-3.5" />
              {message}
            </span>
          ))}
        </div>
        {/* Third set to ensure no gaps */}
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee-infinite" aria-hidden="true">
          {messages.map((message, index) => (
            <span
              key={`set3-${index}`}
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest"
            >
              <Truck className="h-3.5 w-3.5" />
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}