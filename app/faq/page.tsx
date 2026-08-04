"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronDown, MessageCircle } from "lucide-react"

// Lista de preguntas frecuentes (Podés editar los textos como quieras)
const faqs = [
  {
    pregunta: "¿Los perfumes son 100% originales?",
    respuesta: "Sí, absolutamente. En León e Indio solo trabajamos con fragancias 100% originales. Tanto los frascos sellados como nuestros decants provienen directamente de distribuidores oficiales y botellas auténticas."
  },
  {
    pregunta: "¿Qué es exactamente un 'Decant'?",
    respuesta: "Un decant es una fracción del perfume original. Extraemos el líquido de la botella de diseño original con herramientas de precisión y lo envasamos en frascos más pequeños (3ml, 5ml o 10ml). Es la forma perfecta de probar una fragancia premium en tu piel antes de invertir en la botella completa."
  },
  {
    pregunta: "¿Cómo funciona la modalidad 'Por Encargo'?",
    respuesta: "Los perfumes por encargo son botellas selladas que traemos especialmente para vos. Una vez que confirmás tu pedido y realizás la seña, lo encargamos a nuestros proveedores. El tiempo estimado de entrega suele ser de 7 a 15 días hábiles."
  },
  {
    pregunta: "¿Realizan envíos a todo el país?",
    respuesta: "Sí, hacemos envíos a toda Argentina. Cuidamos al máximo el embalaje para que tu fragancia (ya sea un frasco sellado o un decant) llegue en perfectas condiciones a tus manos."
  },
  {
    pregunta: "¿Qué métodos de pago aceptan?",
    respuesta: "Aceptamos transferencias bancarias, Mercado Pago y efectivo. Consultanos por WhatsApp para conocer promociones vigentes o facilidades de pago para perfumes por encargo."
  }
]

export default function FAQPage() {
  // Estado para controlar qué pregunta está abierta
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null) // Si ya estaba abierta, la cierra
    } else {
      setOpenIndex(index) // Abre la nueva
    }
  }

  // Número de León e Indio
  const numeroWA = "5493516087006"
  const linkWA = `https://wa.me/${numeroWA}?text=${encodeURIComponent("¡Hola León e Indio! Tengo una duda que no encontré en las Preguntas Frecuentes...")}`

  return (
    <div className="min-h-screen bg-[#f6f4ed] flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-3xl">
        {/* Cabecera */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="text-[#c0a062] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Asistencia</span>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#141f36] mb-4">Preguntas Frecuentes</h1>
          <div className="w-16 h-[1px] bg-[#c0a062] mb-6"></div>
          <p className="text-[#141f36]/70 font-serif italic text-lg">
            Todo lo que necesitás saber sobre nuestra perfumería.
          </p>
        </div>

        {/* Acordeón de Preguntas */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-[#141f36]/10 bg-white transition-all duration-300 ${openIndex === index ? 'shadow-md' : 'hover:border-[#c0a062]/50'}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 md:p-6 text-left focus:outline-none"
              >
                <h3 className={`font-serif text-lg md:text-xl pr-4 transition-colors ${openIndex === index ? 'text-[#c0a062]' : 'text-[#141f36]'}`}>
                  {faq.pregunta}
                </h3>
                <ChevronDown 
                  className={`w-5 h-5 text-[#141f36]/50 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180 text-[#c0a062]' : ''}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-5 md:p-6 pt-0 text-[#141f36]/70 leading-relaxed border-t border-[#141f36]/5 mt-2">
                  {faq.respuesta}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action - WhatsApp */}
        <div className="bg-[#141f36] text-[#f6f4ed] p-8 md:p-12 text-center rounded-sm">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">¿Aún tenés dudas?</h2>
          <p className="text-[#f6f4ed]/70 mb-8 max-w-md mx-auto">
            Estamos para asesorarte de manera personalizada. Escribinos y encontraremos tu fragancia ideal.
          </p>
          <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none rounded-sm">
            <a href={linkWA} target="_blank" rel="noopener noreferrer" className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Contactar por WhatsApp
            </a>
          </Button>
        </div>
      </main>
    </div>
  )
}