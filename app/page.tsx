import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getProducts } from "@/lib/api"
import { Play, ShieldCheck, Truck, MessageSquare, ChevronDown, ArrowRight, MessageCircle } from "lucide-react"
import Image from "next/image"

export default async function Home() {
  const allProducts = await getProducts()
  
  const perfumesDestacados = allProducts.slice(0, 3) 
  const perfumesArabes = allProducts.filter(p => p.category.includes("Árabes")).slice(0, 5)
  const perfumesDisenador = allProducts.filter(p => p.category.includes("Diseñador")).slice(0, 5)

  const numeroWA = "5493516087006"

  const getWaLink = (name: string, price: number) => {
    const msj = `¡Hola León e Indio! Me interesa el perfume ${name}.\n\n- Precio: $${price.toLocaleString("es-AR")}\n\n¿Tienen stock disponible?`
    return `https://wa.me/${numeroWA}?text=${encodeURIComponent(msj)}`
  }

  // ======================================================================
  // CONFIGURACIÓN DE TIKTOKS Y REELS
  // Guardá las portadas de los videos en: public/reels/portada-1.jpg, etc.
  // Y reemplazá el "link" por la URL del video real de León e Indio.
  // ======================================================================
  const socialVideos = [
    { id: 1, platform: "tiktok", title: "Los 3 mejores árabes para invierno", views: "12K", image: "/reels/portada-1.jpg", link: "https://tiktok.com" },
    { id: 2, platform: "instagram", title: "Unboxing: Club de Nuit Precieux", views: "8.5K", image: "/reels/portada-2.jpg", link: "https://instagram.com" },
    { id: 3, platform: "tiktok", title: "¿Cómo aplicarte perfume correctamente?", views: "25K", image: "/reels/portada-3.jpg", link: "https://tiktok.com" },
    { id: 4, platform: "instagram", title: "Diseñador vs Árabe: La batalla final", views: "15K", image: "/reels/portada-4.jpg", link: "https://instagram.com" },
  ]

  const brands = [
    { name: "Lattafa", logo: "/logos/lattafa.svg" },
    { name: "Afnan", logo: "/logos/afnan.svg" },
    { name: "Armaf", logo: "/logos/armaf.svg" },
    { name: "Giorgio Armani", logo: "/logos/armani.svg" },
    { name: "Ajmal", logo: "/logos/ajmal.png" },
    { name: "Al Haramain", logo: "/logos/haramain.svg" }
  ]

  // PREGUNTAS FRECUENTES
  const faqs = [
    {
      q: "¿Los perfumes son originales?",
      a: "Todos los perfumes son originales, tanto los que usamos para rellenar los decants como los que vendemos sellados. Todo comprobable por el código de batch (si tenés duda, te paso video del frasco)."
    },
    {
      q: "¿Se arruina si lo pasan de un frasco a otro?",
      a: "No. Fraccionamos con jeringa directo del frasco original, sin pasar por spray, así evitamos que el líquido se exponga de más al aire. Usamos frascos de vidrio y los llenamos casi al tope. Es el mismo perfume del frasco grande, en formato chico. Como cualquier perfume, guardalo lejos de la luz y el calor, y usalo dentro de los primeros meses para disfrutarlo en su mejor punto."
    },
    {
      q: "Envíos y demora",
      a: "Hacemos envíos a todo el país por Correo Argentino / PAQ.AR. Dentro de la provincia de Córdoba, por motomensajería o coordinando un punto de encuentro.<br/><br/>Siempre buscamos despachar lo antes posible tu pedido para que lo tengas disponible. Te confirmo el precio del envío por WhatsApp según tu ubicación y modo de envío (sucursal o domicilio). <strong>Envío gratis en decants a partir de $100.000.</strong><br/><br/>• <strong>Córdoba:</strong> mismo día o a coordinar entre ambas partes.<br/>• <strong>Resto del país:</strong> de 3 a 7 días hábiles."
    },
    {
      q: "¿Puedo conseguir un perfume que no está en el catálogo?",
      a: "Si no lo encontrás en el apartado de encargos, mandanos un WhatsApp y te decimos si está disponible, los tiempos y el presupuesto."
    },
    {
      q: "¿Cómo funciona el encargo?",
      a: "Nos decís qué perfume querés y te damos el tiempo aproximado (entre 1 y 2 semanas). Pagás una seña del 50% para confirmar el pedido, y cuando nos llega abonás el resto y te lo enviamos por Correo Argentino o coordinamos entrega en Córdoba."
    },
    {
      q: "¿Qué son los árabes raros?",
      a: "Perfumes que no te aparecen en el \"para ti\" de TikTok, sin el hype de otros — pero que creemos genuinamente que vale la pena probar y explorar."
    },
    {
      q: "Tamaños de decants",
      a: "<strong>2,5 ml:</strong> la medida justa para explorar un nuevo aroma y decidir si ir por la botella completa.<br/><strong>5 ml:</strong> podés usarlo seguido.<br/><strong>10 ml:</strong> es como tener una versión mini de la botella completa, para cuando ya te gusta mucho el perfume y lo querés tener sí o sí a mano."
    },
    {
      q: "No sé cuál elegir",
      a: "Podés chequear en cada perfume la situación recomendada. Y si querés una opinión más personal, mandanos un mensaje y te respondemos con toda la calidez del mundo."
    },
    {
      q: "Devolución y política de cambio",
      a: "Si te llega en mal estado, escribinos y te damos una solución."
    }
  ]

  return (
    <div className="min-h-screen bg-[#f6f4ed] relative pb-20 md:pb-0 font-sans selection:bg-[#c0a062] selection:text-[#141f36]"> 
      <Header />

      {/* =======================================================
          1. HERO
          ======================================================= */}
      <section className="relative h-[80vh] sm:h-[85vh] flex items-center justify-center bg-[#141f36] overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-[#141f36]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-40"
          >
            <source src="/perfume_video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#141f36] via-transparent to-[#141f36]/50" />
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto mt-[-5vh]">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium mb-6 tracking-tight text-[#f6f4ed]">
            Descubrí tu <span className="italic text-[#c0a062] font-light">esencia</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-xl mx-auto text-[#f6f4ed]/90 font-serif leading-relaxed">
            Explorá el mundo de la alta perfumería a través de decants exclusivos o llevate el frasco original sellado.
          </p>
          <div>
            <Button asChild size="lg" className="group h-14 px-10 text-base uppercase tracking-[0.2em] bg-[#c0a062] hover:bg-[#f6f4ed] text-[#141f36] hover:text-[#141f36] rounded-none border-none transition-colors duration-300">
              <Link href="/shop" className="flex items-center gap-3">
                Explorar Catálogo
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 opacity-80">
          <ChevronDown className="h-6 w-6 text-[#c0a062] animate-bounce" />
        </div>
      </section>

      {/* =======================================================
          2. TRUST BAR
          ======================================================= */}
      <div className="bg-[#141f36] border-y border-[#c0a062]/20 py-6 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#c0a062]/20">
            <div className="group flex items-center justify-center gap-4 py-2 md:py-0 text-[#f6f4ed]">
              <ShieldCheck className="h-6 w-6 text-[#c0a062] transform group-hover:scale-110 transition-transform duration-300" />
              <span className="font-serif text-base tracking-wide text-[#f6f4ed]">100% Originales Garantizados</span>
            </div>
            <div className="group flex items-center justify-center gap-4 py-2 md:py-0 text-[#f6f4ed]">
              <Truck className="h-6 w-6 text-[#c0a062] transform group-hover:translate-x-1 transition-transform duration-300" />
              <span className="font-serif text-base tracking-wide text-[#f6f4ed]">Envíos por Paq.ar a todo el país</span>
            </div>
            <div className="group flex items-center justify-center gap-4 py-2 md:py-0 text-[#f6f4ed]">
              <MessageSquare className="h-6 w-6 text-[#c0a062] transform group-hover:-translate-y-1 transition-transform duration-300" />
              <span className="font-serif text-base tracking-wide text-[#f6f4ed]">Asesoramiento Personalizado</span>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================
          3. MARQUEE DE MARCAS
          ======================================================= */}
      <div className="bg-[#f6f4ed] py-6 sm:py-8 overflow-hidden flex relative z-20 group border-b border-[#141f36]/10">
        <div className="flex items-center gap-16 sm:gap-24 pr-16 sm:pr-24 whitespace-nowrap animate-marquee-infinite group-hover:[animation-play-state:paused]">
          {brands.map((brand, index) => (
            <div key={`brand1-${index}`} className="relative h-16 sm:h-20 w-40 sm:w-48 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 shrink-0">
              <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-16 sm:gap-24 pr-1 sm:pr-1 whitespace-nowrap animate-marquee-infinite group-hover:[animation-play-state:paused]" aria-hidden="true">
          {brands.map((brand, index) => (
            <div key={`brand2-${index}`} className="relative h-16 sm:h-20 w-40 sm:w-48 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 shrink-0">
              <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>

      {/* =======================================================
          4. SECCIÓN DESTACADOS
          ======================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#141f36] border-b border-[#c0a062]/20">
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4 sm:px-6 text-center mb-10 sm:mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-[#f6f4ed] mb-4 tracking-wide">
              Selección del<span className="italic text-[#c0a062]"> Mes</span>
            </h2>
            <div className="flex items-center justify-center gap-4 mt-8 mb-6">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#c0a062]" />
              <div className="w-2 h-2 rotate-45 bg-[#c0a062]" />
              <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#c0a062]" />
            </div>
          </div>
          
          <div className="flex justify-end px-6 sm:px-12 md:px-24 mb-4 text-[#c0a062] text-xs uppercase tracking-widest font-bold">
            <span className="animate-pulse flex items-center gap-2">Deslizá para explorar <ArrowRight className="h-3.5 w-3.5"/></span>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 sm:gap-8 px-6 sm:px-12 md:px-24 pb-8 w-full [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#141f36] [&::-webkit-scrollbar-thumb]:bg-[#c0a062]/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#c0a062] transition-colors">
            {perfumesDestacados.map((product, index) => (
              <div 
                key={product.id} 
                className="group relative flex flex-col p-6 sm:p-8 bg-[#1a2640] border border-[#f6f4ed]/20 hover:border-[#c0a062] transition-all duration-500 shrink-0 w-[85vw] max-w-[300px] sm:max-w-[340px] snap-center hover:-translate-y-2 mt-2 shadow-xl"
              >
                <div className="absolute top-0 left-0 bg-[#c0a062] text-[#141f36] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest z-20 rounded-br-lg shadow-md">
                  Top {index + 1}
                </div>

                <Link href={`/product/${product.id}`} className="relative w-full aspect-[4/5] mb-6 mt-4 block cursor-pointer">
                  <Image 
                    src={product.image || "/placeholder.svg"} 
                    alt={product.name} 
                    fill 
                    className="object-contain transform transition-transform duration-700 ease-out group-hover:scale-105" 
                  />
                </Link>

                <div className="text-center w-full flex flex-col flex-1 justify-between">
                  <Link href={`/product/${product.id}`} className="block">
                    <p className="text-[#c0a062] text-xs uppercase tracking-[0.2em] mb-2 font-bold">{product.category}</p>
                    <h3 className="font-serif text-2xl text-[#f6f4ed] font-medium leading-tight mb-3 line-clamp-2 hover:text-[#c0a062] transition-colors">{product.name}</h3>
                    <p className="text-[#f6f4ed]/80 text-sm font-serif italic line-clamp-2 mb-6">{product.notes}</p>
                  </Link>
                  
                  <div className="border-t border-[#f6f4ed]/20 pt-4 mt-auto">
                    <p className="text-[#c0a062] font-serif text-2xl font-semibold mb-4">
                      <span className="text-xs font-sans text-[#f6f4ed]/70 font-normal uppercase tracking-widest mr-2">Desde</span>
                      ${product.price.toLocaleString("es-AR")}
                    </p>
                    <div className="flex gap-2 relative z-20">
                      <Link href={`/product/${product.id}`} className="flex-1 bg-transparent border border-[#c0a062] text-[#c0a062] hover:bg-[#c0a062] hover:text-[#141f36] text-xs font-bold py-2.5 px-3 flex items-center justify-center transition-colors rounded-sm uppercase tracking-widest">
                        Ver Detalles
                      </Link>
                      <a href={getWaLink(product.name, product.price)} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white p-2.5 flex items-center justify-center hover:bg-[#128C7E] transition-colors rounded-sm shadow-md" aria-label="Consultar por WhatsApp">
                        <MessageCircle className="w-5 h-5"/>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================
          5. ÁRABES RAROS (Línea de piso para no cortar botones)
          ======================================================= */}
      <section className="bg-[#141f36] border-b border-[#c0a062]/20 py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 mb-12 text-center">
          <span className="text-[#c0a062] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">El Oriente en tu piel</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#f6f4ed] mb-4">
            Árabes Raros
          </h2>
          <Button variant="link" asChild className="text-[#c0a062] hover:text-[#f6f4ed] text-base group">
            <Link href="/shop?category=arabes-raros" className="flex items-center gap-2">
              Explorar Colección <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="relative w-full pt-4">
          {/* LÍNEA DE PISO: Ahora está completamente abajo, actuando como podio */}
          <div className="absolute bottom-[20px] sm:bottom-[24px] left-0 w-full h-12 border-t-2 border-[#c0a062]/30 bg-gradient-to-b from-[#c0a062]/10 to-transparent z-0" />

          {/* Carrusel elevado con pb generoso para separar los botones de la línea */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 sm:gap-12 px-6 sm:px-12 md:px-24 w-full [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#141f36] [&::-webkit-scrollbar-thumb]:bg-[#c0a062]/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#c0a062] pb-14 sm:pb-16 relative z-10">
            {perfumesArabes.map(product => (
              <div key={product.id} className="snap-center shrink-0 w-48 sm:w-60 flex flex-col items-center group pt-6">
                
                <Link href={`/product/${product.id}`} className="relative h-60 sm:h-76 w-full flex items-end justify-center mb-6 transform transition-transform duration-500 group-hover:-translate-y-4 cursor-pointer">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-contain object-bottom drop-shadow-[0_20px_15px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-105" 
                  />
                </Link>

                <div className="text-center w-full flex flex-col">
                  <Link href={`/product/${product.id}`} className="cursor-pointer group-hover:text-[#c0a062] transition-colors">
                    <h3 className="font-serif text-lg sm:text-xl text-[#f6f4ed] font-medium leading-tight mb-2 line-clamp-2">{product.name}</h3>
                    <p className="font-serif text-[#c0a062] font-semibold text-xl mb-4">${product.price.toLocaleString("es-AR")}</p>
                  </Link>
                  <div className="flex gap-2 w-full mt-auto relative z-20">
                    <Link href={`/product/${product.id}`} className="flex-1 bg-transparent border border-[#c0a062]/50 text-[#c0a062] hover:bg-[#c0a062] hover:text-[#141f36] text-[10px] sm:text-xs font-bold py-2.5 px-2 flex items-center justify-center transition-colors rounded-sm uppercase tracking-widest">
                      Ver Detalles
                    </Link>
                    <a href={getWaLink(product.name, product.price)} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white p-2.5 flex items-center justify-center hover:bg-[#128C7E] transition-colors rounded-sm shadow-md" aria-label="Consultar por WhatsApp">
                      <MessageCircle className="w-5 h-5"/>
                    </a>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="snap-center shrink-0 w-36 sm:w-44 flex flex-col items-center justify-center pt-6 pb-14 sm:pb-16">
               <Link href="/shop?category=arabes-raros" className="flex flex-col items-center justify-center h-60 sm:h-76 w-full border border-[#c0a062]/30 rounded-t-full hover:bg-[#c0a062]/10 transition-colors group mb-6">
                  <span className="text-[#c0a062] text-xs uppercase tracking-widest font-bold mb-2">Ver Todo</span>
                  <ArrowRight className="h-5 w-5 text-[#c0a062] transform group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          6. DISEÑADOR (Línea de piso para no cortar botones)
          ======================================================= */}
      <section className="bg-[#f6f4ed] border-y border-[#141f36]/10 py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 mb-12 text-center">
          <span className="text-[#141f36]/60 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Firma Contemporánea</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#141f36] mb-4">
            Catálogo de Diseñador
          </h2>
          <Button variant="link" asChild className="text-[#141f36] hover:text-[#c0a062] text-base group">
            <Link href="/shop?category=disenador" className="flex items-center gap-2">
              Ver Clásicos <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="relative w-full pt-4">
          <div className="absolute bottom-[20px] sm:bottom-[24px] left-0 w-full h-12 border-t-2 border-[#141f36]/20 bg-gradient-to-b from-[#141f36]/5 to-transparent z-0" />

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 sm:gap-12 px-6 sm:px-12 md:px-24 w-full [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#f6f4ed] [&::-webkit-scrollbar-thumb]:bg-[#141f36]/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#141f36]/60 pb-14 sm:pb-16 relative z-10">
            {perfumesDisenador.map(product => (
              <div key={product.id} className="snap-center shrink-0 w-48 sm:w-60 flex flex-col items-center group pt-6">
                
                <Link href={`/product/${product.id}`} className="relative h-60 sm:h-76 w-full flex items-end justify-center mb-6 transform transition-transform duration-500 group-hover:-translate-y-4 cursor-pointer">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-contain object-bottom drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:scale-105" 
                  />
                </Link>

                <div className="text-center w-full flex flex-col">
                  <Link href={`/product/${product.id}`} className="cursor-pointer group-hover:text-[#c0a062] transition-colors">
                    <h3 className="font-serif text-lg sm:text-xl text-[#141f36] font-medium leading-tight mb-2 line-clamp-2">{product.name}</h3>
                    <p className="font-serif text-[#141f36] font-semibold text-xl mb-4">${product.price.toLocaleString("es-AR")}</p>
                  </Link>
                  <div className="flex gap-2 w-full mt-auto relative z-20">
                    <Link href={`/product/${product.id}`} className="flex-1 bg-transparent border border-[#141f36]/30 text-[#141f36] hover:bg-[#141f36] hover:text-[#f6f4ed] text-[10px] sm:text-xs font-bold py-2.5 px-2 flex items-center justify-center transition-colors rounded-sm uppercase tracking-widest">
                      Ver Detalles
                    </Link>
                    <a href={getWaLink(product.name, product.price)} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white p-2.5 flex items-center justify-center hover:bg-[#128C7E] transition-colors rounded-sm shadow-md" aria-label="Consultar por WhatsApp">
                      <MessageCircle className="w-5 h-5"/>
                    </a>
                  </div>
                </div>
              </div>
            ))}

            <div className="snap-center shrink-0 w-36 sm:w-44 flex flex-col items-center justify-center pt-6 pb-14 sm:pb-16">
               <Link href="/shop?category=disenador" className="flex flex-col items-center justify-center h-60 sm:h-76 w-full border border-[#141f36]/30 rounded-t-full hover:bg-[#141f36]/10 transition-colors group mb-6">
                  <span className="text-[#141f36] text-xs uppercase tracking-widest font-bold mb-2">Ver Todo</span>
                  <ArrowRight className="h-5 w-5 text-[#141f36] transform group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          7. COMUNIDAD MOR (Con Reels)
          ======================================================= */}
      <section className="py-20 sm:py-28 bg-[#e6e2d3]/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#c0a062] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Comunidad Mor</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#141f36] mb-6">
              La Experiencia en Vivo
            </h2>
            <div className="h-px w-16 bg-[#c0a062] mx-auto mb-6" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {socialVideos.map((video) => (
              <a 
                key={video.id} 
                href={video.link}
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative aspect-[9/16] bg-[#141f36] overflow-hidden cursor-pointer block shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Image src={video.image} alt={video.title} fill className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141f36] via-[#141f36]/30 to-transparent opacity-90" />
                
                <div className="absolute top-4 left-4 z-30">
                  <div className="flex items-center gap-2 bg-white text-[#141f36] px-3 py-1.5 text-xs font-bold tracking-widest uppercase shadow-md">
                    <Image src={`/${video.platform}-logo.png`} alt={video.platform} width={14} height={14} className="object-contain" />
                    {video.platform}
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border border-white/60 group-hover:bg-[#c0a062] group-hover:border-[#c0a062] transition-colors duration-300 transform group-hover:scale-110">
                    <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-2 text-[#c0a062] text-xs font-bold tracking-wider uppercase">
                    <Play className="h-3 w-3 fill-current" />
                    {video.views} vistas
                  </div>
                  <h3 className="text-white font-serif text-base sm:text-lg leading-snug line-clamp-2 drop-shadow-md">
                    {video.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section> 

      {/* =======================================================
          8. PREGUNTAS FRECUENTES (FAQ)
          ======================================================= */}
      <section className="bg-[#f6f4ed] border-t border-[#141f36]/10 py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[#c0a062] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Guía del Cliente</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#141f36] mb-6">
              Preguntas Frecuentes
            </h2>
            <div className="h-px w-16 bg-[#c0a062] mx-auto mb-6" />
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <details key={index} className="group border-b border-[#141f36]/10 [&_summary::-webkit-details-marker]:hidden">
                <summary className="font-serif text-lg md:text-xl font-medium cursor-pointer list-none flex justify-between items-center text-[#141f36] hover:text-[#c0a062] transition-colors py-6">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 text-[#c0a062] transform group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4" />
                </summary>
                <div 
                  className="pb-6 text-[#141f36]/70 font-serif leading-relaxed text-sm md:text-base pr-8"
                  dangerouslySetInnerHTML={{ __html: faq.a }}
                />
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================
          9. CONCIERGE DE WHATSAPP
          ======================================================= */}
      <div className="fixed bottom-0 left-0 w-full z-50 md:bottom-8 md:left-auto md:right-8 md:w-auto">
        <a 
          href="https://wa.me/5493516087006" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center justify-center md:justify-start gap-4 w-full bg-[#141f36] hover:bg-[#1a2640] text-[#f6f4ed] md:border border-[#c0a062]/30 p-4 md:px-7 md:py-4 transition-all duration-300 shadow-2xl md:hover:-translate-y-1 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#c0a062] transform group-hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <div className="flex flex-col text-left">
            <span className="text-[11px] text-[#c0a062] font-bold tracking-[0.2em] uppercase leading-none mb-1">Concierge</span>
            <span className="text-base font-serif italic text-[#f6f4ed] leading-none">Asesoramiento Exclusivo</span>
          </div>
        </a>
      </div>

      {/* =======================================================
          10. FOOTER
          ======================================================= */}
      <footer className="bg-[#141f36] text-[#f6f4ed] relative overflow-hidden border-t border-[#c0a062]/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,_rgba(192,160,98,0.04)_0%,_transparent_70%)] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="flex flex-col md:flex-row justify-center items-start md:gap-16 lg:gap-24 relative z-10">

            <div className="flex-1 w-full text-center md:text-right mt-12 md:mt-24 order-2 md:order-1">
              <h4 className="font-medium mb-8 text-[#c0a062] tracking-[0.3em] uppercase text-xs">Colecciones</h4>
              <ul className="space-y-5 text-base text-[#f6f4ed]/80 font-serif">
                <li className="transform transition-all duration-300 hover:-translate-x-2">
                  <Link href="/shop" className="hover:text-[#c0a062] transition-colors">Catálogo Completo</Link>
                </li>
                <li className="transform transition-all duration-300 hover:-translate-x-2">
                  <Link href="/shop?category=arabes-raros" className="hover:text-[#c0a062] transition-colors">Árabes Raros</Link>
                </li>
                <li className="transform transition-all duration-300 hover:-translate-x-2">
                  <Link href="/shop?category=disenador" className="hover:text-[#c0a062] transition-colors">Diseñador</Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center order-1 md:order-2 shrink-0">
              <div className="w-12 h-12 rounded-full border border-[#c0a062]/40 flex items-center justify-center mb-6">
                <div className="w-2.5 h-2.5 rotate-45 bg-[#c0a062]" />
              </div>
              <h3 className="font-serif text-3xl font-medium tracking-[0.2em] text-[#c0a062] mb-3">MOR</h3>
              <p className="text-base text-[#f6f4ed]/70 text-center max-w-[220px] font-serif italic mb-6">
                El arte de la alta perfumería.
              </p>
              <div className="w-px h-32 sm:h-48 bg-gradient-to-b from-[#c0a062]/60 via-[#c0a062]/20 to-transparent" />
            </div>

            <div className="flex-1 w-full text-center md:text-left mt-12 md:mt-24 order-3 md:order-3">
              <h4 className="font-medium mb-8 text-[#c0a062] tracking-[0.3em] uppercase text-xs">Servicio</h4>
              <ul className="space-y-5 text-base text-[#f6f4ed]/80 font-serif">
                <li className="transform transition-all duration-300 hover:translate-x-2">
                  <a href="https://wa.me/5493516087006" className="hover:text-[#c0a062] transition-colors">Concierge WhatsApp</a>
                </li>
                <li className="transform transition-all duration-300 hover:translate-x-2">
                  <Link href="/shop" className="hover:text-[#c0a062] transition-colors">Preguntas Frecuentes</Link>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-16 text-xs text-[#f6f4ed]/50 flex flex-col items-center gap-3 uppercase tracking-widest relative z-10">
            <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-[#c0a062]/40 to-transparent mb-6" />
            <p className="hover:text-[#c0a062] transition-colors">&copy; 2026 MOR PERFUMES.</p>
            <p className="hover:text-[#c0a062] transition-colors">Diseño & Código de Autor.</p>
          </div>
        </div>
      </footer> 
    </div>
  )
}