import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Play, ArrowRight } from "lucide-react"

// ======================================================================
// 1. FUNCIÓN AUTOMÁTICA PARA TIKTOK
// Extrae foto y título sin que tengas que descargar nada manual.
// ======================================================================
async function getTikTokInfo(url: string) {
  try {
    const response = await fetch(`https://www.tiktok.com/oembed?url=${url}`, { 
      next: { revalidate: 86400 } // Guarda en caché por 24hs
    })
    const data = await response.json()
    return {
      title: data.title,
      image: data.thumbnail_url,
    }
  } catch (error) {
    return null
  }
}

export default async function ReviewsPage() {
  
  // ======================================================================
  // 2. RESEÑAS EN VIDEO (Pegá acá los links de TikTok de los clientes)
  // ======================================================================
  const linksDeTikTok = [
    "https://www.tiktok.com/@morperfumes1/video/7669205385038810375", // Reemplazá por los tuyos
    "https://www.tiktok.com/@morperfumes1/video/7649524647414861063",
    "https://www.tiktok.com/@morperfumes1/video/7654379079579274503",
    "https://www.tiktok.com/@morperfumes1/video/7650292333883280647",
    "https://www.tiktok.com/@morperfumes1/video/7652501699067661575",
    "https://www.tiktok.com/@morperfumes1/video/7651768496803663122",
    "https://www.tiktok.com/@morperfumes1/video/7650651065817304328",
    "https://www.tiktok.com/@morperfumes1/video/7652882077582363922"
  ]

  const videoReviews = await Promise.all(
    linksDeTikTok.map(async (link, index) => {
      const data = await getTikTokInfo(link)
      return {
        id: index + 1,
        platform: "tiktok",
        title: data?.title || "Reseña de Cliente",
        image: data?.image || "/placeholder.svg",
        link: link
      }
    })
  )

  return (
    <div className="min-h-screen bg-[#f6f4ed] flex flex-col text-[#141f36]">
      <Header />
      
      <main className="flex-1">

        {/* Sección: Comunidad (Grilla Bento/Masonry igual a la Home) */}
        <section className="pb-24 py-6 sm:pb-32 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 max-w-7xl mx-auto">
              <div className="max-w-2xl">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#141f36] leading-tight">
                  La perfumería, <br/> contada en primera persona.
                </h2>
              </div>
              <a href="https://instagram.com/morperfumes_" target="_blank" rel="noreferrer" className="shrink-0 pb-2 border-b border-[#141f36] text-[#141f36] font-medium hover:text-[#c0a062] hover:border-[#c0a062] transition-colors flex items-center gap-2">
                Seguinos en redes <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Grilla Asimétrica Tipo Pantallas de Celular */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
              {videoReviews.map((video, index) => (
                <a 
                  key={video.id} 
                  href={video.link}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`group relative aspect-[9/16] bg-[#141f36] overflow-hidden cursor-pointer block shadow-xl hover:shadow-2xl hover:shadow-[#c0a062]/20 transition-all duration-500 rounded-[2rem] sm:rounded-[2.5rem] border-[6px] border-white/40 ${index % 2 !== 0 ? 'md:mt-12' : ''}`}
                >
                  <Image 
                    src={video.image} 
                    alt={video.title} 
                    fill 
                    className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" 
                  />
                  
                  {/* Único gradiente optimizado para oscurecer abajo y dejar ver la foto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141f36] via-[#141f36]/20 to-transparent opacity-90" />
                  
                  {/* Botón de Play Central */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-14 h-14 backdrop-blur-sm bg-white/10 rounded-full flex items-center justify-center border border-white/40 group-hover:bg-[#c0a062]/90 group-hover:border-[#c0a062] group-hover:shadow-[0_0_25px_rgba(192,160,98,0.5)] transition-all duration-500 transform group-hover:scale-110">
                      <Play className="h-5 w-5 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                  
                  {/* Título inferior limpio */}
                  <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white font-serif text-base sm:text-lg leading-snug drop-shadow-md line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
            
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="py-24 text-center container mx-auto px-4 border-t border-[#141f36]/10">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6 text-[#141f36]">
            ¿Listo para encontrar tu esencia?
          </h2>
          <Button asChild size="lg" className="h-14 px-10 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] bg-[#c0a062] hover:bg-[#141f36] text-[#141f36] hover:text-[#f6f4ed] rounded-none border-none transition-colors duration-300 shadow-xl mt-4">
            <Link href="/shop" className="flex items-center gap-3">
              Explorar Catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>

      </main>
    </div>
  )
}