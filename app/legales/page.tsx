import { Header } from "@/components/header"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ed] font-sans selection:bg-[#c0a062] selection:text-[#141f36]">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-12 md:py-24 max-w-3xl">
        <Link href="/" className="inline-flex items-center text-[#c0a062] text-xs font-bold uppercase tracking-widest hover:text-[#141f36] transition-colors mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>

        <span className="text-[#c0a062] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Información Legal</span>
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#141f36] mb-12 leading-tight">
          Políticas de Envío y Devolución
        </h1>

        <div className="prose prose-lg prose-headings:font-serif prose-headings:font-medium prose-headings:text-[#141f36] prose-p:text-[#141f36]/70 prose-p:font-serif prose-p:leading-relaxed prose-a:text-[#c0a062] prose-strong:text-[#141f36]">
          
          <h2>1. Tiempos de Despacho y Entrega</h2>
          <p>
            En MOR Perfumes entendemos la urgencia de recibir tu fragancia. Todos los pedidos son preparados y despachados en un plazo máximo de <strong>24 a 48 horas hábiles</strong> tras la confirmación del pago.
          </p>
          <p>
            Los envíos nacionales se realizan mediante Correo Argentino (PAQ.AR), con un tiempo estimado de tránsito de <strong>3 a 7 días hábiles</strong>, dependiendo de la distancia desde nuestra base en Córdoba.
          </p>

          <h2>2. Entregas en Córdoba Capital</h2>
          <p>
            Para clientes en Córdoba Capital, ofrecemos entrega mediante motomensajería en el mismo día, o la posibilidad de coordinar un punto de encuentro céntrico, siempre sujeto a disponibilidad horaria de ambas partes.
          </p>

          <h2>3. Política de Empaque (Decants)</h2>
          <p>
            Nuestros decants se fraccionan de manera estéril, extrayendo el líquido mediante jeringa clínica directamente de la botella original. Esto asegura que la fragancia <strong>jamás se oxide ni pierda sus notas de salida</strong> al contacto con el aire. Se entregan en frascos de vidrio de alta calidad con atomizador calibrado.
          </p>

          <h2>4. Garantía de Integridad</h2>
          <p>
            Si tu paquete llega con signos visibles de daño, el frasco roto o derramado, te pedimos que tomes fotografías inmediatamente antes de abrirlo por completo y te contactes a nuestro Concierge de WhatsApp. Evaluaremos el caso para ofrecerte un reemplazo inmediato o el reembolso correspondiente.
          </p>

          <hr className="my-12 border-[#141f36]/10" />

          <p className="text-sm italic">
            Última actualización: Agosto de 2026. Al realizar una compra en MOR Perfumes, el cliente acepta los términos aquí descritos.
          </p>
        </div>
      </main>
    </div>
  )
}