import { Header } from "@/components/header"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ed] text-[#141f36]">
      <Header />

      {/* Botón de volver (Fondo crema, texto azul marino) */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <Button variant="ghost" asChild className="hover:bg-[#141f36]/5 text-[#141f36]">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Link>
        </Button>
      </div>

      {/* Hero Section (Fondo oscuro para impacto visual) */}
      <section className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center bg-[#141f36] overflow-hidden border-y-2 border-[#c0a062]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#c0a062_0%,_transparent_70%)] opacity-10" />
        <div className="relative z-10 text-center px-4">
          <p className="text-[#c0a062] text-sm sm:text-base uppercase tracking-[0.3em] font-medium mb-4">
            Nuestra Historia
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 tracking-tight text-[#f6f4ed]">
            MOR PERFUMES
          </h1>
          <p className="text-lg sm:text-xl text-[#f6f4ed]/80 max-w-2xl mx-auto font-serif italic">
            Pasión compartida entre hermanos, puesta al servicio de tu fragancia.
          </p>
        </div>
      </section>

      {/* Story Section (Texto + Foto de los hermanos) */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Columna de Texto */}
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-8 text-[#141f36]">
              Los Creadores
            </h2>
            <div className="space-y-6 text-[#141f36]/80 leading-relaxed font-serif text-lg">
              <p>
                <span className="text-2xl text-[#c0a062] font-bold">S</span>omos Indio y León — dos hermanos que empezaron a amar los perfumes al mismo tiempo, cada uno a su manera.
              </p>
              <p>
                Desde el primer día nos metimos de lleno en todo: árabes, diseñador, nicho. No nos quedamos con un solo mundo, y por eso hoy en Mor Perfumes combinamos dos cosas que en general no van juntas: el descubrimiento de nuestro catálogo de decants, para que puedas probar antes de comprometerte con un frasco entero, y perfumes sellados a un precio muchísimo mejor del que vas a encontrar en un shopping.
              </p>
              <p>
                Trabajamos con lo que ya tenemos en catálogo y también por encargo — si buscás algo puntual, sea diseñador, árabe o nicho, te lo conseguimos.
              </p>
              <p className="font-medium text-[#141f36] italic">
                Nuestra promesa es simple: encontrarte el perfume que va con tu personalidad, a un precio que tiene sentido. Esto no es solo catálogo. Es pasión compartida.
              </p>
            </div>
          </div>
          
          {/* Columna de Imagen (Espacio para la foto de Indio y León) */}
          <div className="relative aspect-[4/5] bg-[#e6e2d3] overflow-hidden p-4 border border-[#141f36]/10 shadow-xl group">
            {/* Marcos esquineros decorativos (estilo botica) */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#c0a062]/70 z-10" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#c0a062]/70 z-10" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#c0a062]/70 z-10" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#c0a062]/70 z-10" />
            
            {/* 
              ACÁ VA LA FOTO DE ELLOS: 
              Guardá la foto en la carpeta public como "indio-y-leon.jpg" 
              y cambialo en el src de abajo.
            */}
            <Image 
              src="/indio-y-leon.jpeg" 
              alt="Indio y León - Fundadores de Mor Perfumes" 
              fill 
              className="object-cover p-6 transition-transform duration-1000 group-hover:scale-105" 
            />
            
            {/* Placeholder visual por si la imagen falla o no la cargaste aún */}
            <div className="absolute inset-0 flex items-center justify-center p-6 -z-10">
              <span className="text-[#141f36]/30 font-serif text-center uppercase tracking-widest text-sm border border-[#141f36]/20 p-4">
                Espacio para foto<br/>Indio & León
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Values Section (Resumiendo lo que los hace únicos) */}
      <section className="bg-[#141f36] text-[#f6f4ed] py-16 sm:py-20 md:py-24 border-y border-[#c0a062]/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-4">Nuestra Filosofía</h2>
            <div className="h-px w-24 mx-auto bg-[#c0a062] opacity-50" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
            <div className="text-center">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-4 text-[#c0a062]">Exploración</h3>
              <p className="text-sm sm:text-base text-[#f6f4ed]/70 leading-relaxed font-serif">
                Ofrecemos decants de alta calidad para que puedas probar, vivir y experimentar la fragancia en tu piel antes de comprometerte con un frasco entero.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-4 text-[#c0a062]">Accesibilidad</h3>
              <p className="text-sm sm:text-base text-[#f6f4ed]/70 leading-relaxed font-serif">
                Democratizamos el acceso a la alta perfumería. Llevate perfumes 100% originales y sellados a un precio muchísimo mejor del que vas a encontrar en un shopping.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-4 text-[#c0a062]">A Medida</h3>
              <p className="text-sm sm:text-base text-[#f6f4ed]/70 leading-relaxed font-serif">
                Si no lo tenemos en nuestro catálogo inmediato, te lo traemos por encargo. No importa si es diseñador, árabe o nicho, lo conseguimos para vos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (Llamado a la acción) */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 text-[#141f36]">
            ¿No sabés qué elegir?
          </h2>
          <p className="text-[#141f36]/70 mb-10 text-lg sm:text-xl font-serif italic">
            Para eso estamos. Escribinos y te ayudamos a encontrar el perfume que mejor va con tu personalidad.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 bg-[#c0a062] hover:bg-[#a68850] text-[#141f36] text-base border-none shadow-xl transition-all hover:scale-105">
              <Link href="/shop">Ver Catálogo</Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 border-[#141f36] text-[#141f36] hover:bg-[#141f36] hover:text-[#f6f4ed] text-base transition-colors">
              <a href="https://wa.me/5493516087006" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Asesoramiento por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}