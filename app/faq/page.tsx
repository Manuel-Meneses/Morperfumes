"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronDown, MessageCircle } from "lucide-react"

// Lista de preguntas frecuentes (Actualizada con la info real del cliente)
const faqs = [
  {
    pregunta: "¿Los perfumes son originales?",
    respuesta: "Todos los perfumes son originales, tanto los que usamos para rellenar los decants como los que vendemos sellados. Todo comprobable por el código de batch (si tenés duda, te paso video del frasco)."
  },
  {
    pregunta: "¿Se arruina si lo pasan de un frasco a otro?",
    respuesta: "No. Fraccionamos con jeringa directo del frasco original, sin pasar por spray, así evitamos que el líquido se exponga de más al aire. Usamos frascos de vidrio y los llenamos casi al tope. Es el mismo perfume del frasco grande, en formato chico. Como cualquier perfume, guardalo lejos de la luz y el calor, y usalo dentro de los primeros meses para disfrutarlo en su mejor punto."
  },
  {
    pregunta: "Envíos y demora",
    respuesta: (
      <div className="space-y-3">
        <p>Hacemos envíos a todo el país por Correo Argentino / PAQ.AR. Dentro de la provincia de Córdoba, por motomensajería o coordinando un punto de encuentro.</p>
        <p>Siempre buscamos despachar lo antes posible tu pedido para que lo tengas disponible.</p>
        <p>Te confirmo el precio del envío por WhatsApp según tu ubicación y modo de envío (sucursal o domicilio). <strong>Envío gratis en decants a partir de $100.000.</strong></p>
        <ul className="list-disc pl-5 space-y-1 text-[#141f36]/80 mt-2">
          <li><strong>Córdoba:</strong> mismo día o a coordinar entre ambas partes.</li>
          <li><strong>Resto del país:</strong> de 3 a 7 días hábiles.</li>
        </ul>
      </div>
    )
  },
  {
    pregunta: "¿Puedo conseguir un perfume que no está en el catálogo?",
    respuesta: "Si no lo encontrás en el apartado de encargos, mandanos un WhatsApp y te decimos si está disponible, los tiempos y el presupuesto."
  },
  {
    pregunta: "¿Cómo funciona el encargo?",
    respuesta: "Nos decís qué perfume querés y te damos el tiempo aproximado (entre 1 y 2 semanas). Pagás una seña del 50% para confirmar el pedido, y cuando nos llega abonás el resto y te lo enviamos por Correo Argentino o coordinamos entrega en Córdoba."
  },
  {
    pregunta: "¿Qué son los árabes raros?",
    respuesta: "Perfumes que no te aparecen en el \"para ti\" de TikTok, sin el hype de otros — pero que creemos genuinamente que vale la pena probar y explorar."
  },
  {
    pregunta: "Tamaños de decants",
    respuesta: (
      <div className="space-y-2">
        <p><strong>2,5 ml:</strong> la medida justa para explorar un nuevo aroma y decidir si ir por la botella completa.</p>
        <p><strong>5 ml:</strong> podés usarlo seguido.</p>
        <p><strong>10 ml:</strong> es como tener una versión mini de la botella completa, para cuando ya te gusta mucho el perfume y lo querés tener sí o sí a mano.</p>
      </div>
    )
  },
  {
    pregunta: "No sé cuál elegir",
    respuesta: "Podés chequear en cada perfume la situación recomendada. Y si querés una opinión más personal, mandanos un mensaje y te respondemos con toda la calidez del mundo."
  },
  {
    pregunta: "Devolución y política de cambio",
    respuesta: "Si te llega en mal estado, escribinos y te damos una solución."
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
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
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