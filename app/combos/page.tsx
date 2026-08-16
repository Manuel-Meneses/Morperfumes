import { Header } from "@/components/header"
import { getCombos } from "@/lib/api"
import { InteractiveComboCard } from "@/components/interactive-combo-card"
import Image from "next/image"

// ==============================================================
// EFECTO 1: SISTEMA DE GOTAS OPTIMIZADO (SIN BLUR)
// ==============================================================
const WaterParticles = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[#141f36]" /> 
    
    <style>{`
      .droplet {
        position: absolute;
        background: radial-gradient(ellipse at center, rgba(192,160,98,0.4) 0%, rgba(192,160,98,0) 70%);
        border-radius: 50%;
        animation: float-up infinite ease-in-out;
        opacity: 0;
        will-change: transform, opacity;
      }
      @keyframes float-up {
        0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
        20% { opacity: 0.3; }
        80% { opacity: 0.3; }
        100% { transform: translateY(-20vh) scale(1.5); opacity: 0; }
      }
    `}</style>

    {[...Array(20)].map((_, i) => (
      <div key={`left-${i}`} className="droplet" style={{
        left: `${Math.random() * 15}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 25 + 10}px`,
        animationDuration: `${Math.random() * 6 + 4}s`,
        animationDelay: `${Math.random() * 5}s`,
      }} />
    ))}

    {[...Array(20)].map((_, i) => (
      <div key={`right-${i}`} className="droplet" style={{
        right: `${Math.random() * 15}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 25 + 10}px`,
        animationDuration: `${Math.random() * 6 + 4}s`,
        animationDelay: `${Math.random() * 5}s`,
      }} />
    ))}
  </div>
);

// ==============================================================
// EFECTO 2: VITRINA ADAPTATIVA ULTRA-LIGERA
// ==============================================================
const Vitrina = ({ children, subtitle, isLight }: { children: React.ReactNode, subtitle: string, isLight: boolean }) => (
  <section className={`py-16 sm:py-32 relative z-10 transition-colors duration-700 ${isLight ? "bg-[#f6f4ed]" : "bg-transparent"}`}>
    <div className="container mx-auto px-0 sm:px-6 max-w-7xl">
      
      {/* Títulos */}
      <div className="text-center mb-10 sm:mb-16 relative z-20 px-4">
        <p className={`text-xs md:text-sm uppercase tracking-[0.3em] font-bold ${isLight ? "text-[#141f36]/60" : "text-[#c0a062]"}`}>
          {subtitle}
        </p>
      </div>
      
      {/* CAJA OPTIMIZADA */}
      <div className={`relative sm:rounded-t-3xl border-t border-b sm:border p-0 pt-8 sm:p-12 md:p-16 ${
        isLight 
          ? "border-[#141f36]/10 bg-[#f6f4ed] sm:bg-gradient-to-b from-[#ffffff] to-[#f6f4ed] sm:shadow-xl" 
          : "border-[#c0a062]/30 bg-[#141f36] sm:bg-gradient-to-b from-[#1a2640] to-[#141f36] sm:shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
      }`}>
        
        {/* Luces LED superiores */}
        <div className={`absolute top-0 left-[10%] right-[10%] h-[2px] opacity-60 ${isLight ? "bg-gradient-to-r from-transparent via-[#c0a062] to-transparent" : "bg-gradient-to-r from-transparent via-[#c0a062] to-transparent"}`} />
        <div className={`absolute top-0 left-[20%] right-[20%] h-[1px] opacity-100 ${isLight ? "bg-gradient-to-r from-transparent via-[#141f36]/20 to-transparent" : "bg-gradient-to-r from-transparent via-[#f6f4ed] to-transparent"}`} />

        {/* Reflejos laterales */}
        <div className={`hidden sm:block absolute top-0 bottom-0 left-0 w-[1px] ${isLight ? "bg-gradient-to-b from-[#141f36]/10 to-transparent" : "bg-gradient-to-b from-[#c0a062]/40 to-transparent"}`} />
        <div className={`hidden sm:block absolute top-0 bottom-0 right-0 w-[1px] ${isLight ? "bg-gradient-to-b from-[#141f36]/10 to-transparent" : "bg-gradient-to-b from-[#c0a062]/40 to-transparent"}`} />

        {/* 
            SOLUCIÓN DEL MODAL ACÁ ABAJO: 
            Quitamos el 'transform-gpu' de este contenedor para que no atrape al modal fijo de la tarjeta.
        */}
        <div className="relative z-10 flex overflow-x-auto snap-x snap-proximity scroll-smooth gap-6 pb-12 px-4 sm:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:overflow-visible md:pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
      </div>
    </div>
  </section>
);

// ==============================================================
// PÁGINA PRINCIPAL
// ==============================================================
export default async function CombosPage() {
  const combos = await getCombos()

  // Filtramos los combos
  const combosSellados = combos.filter(c => c.includes.every(item => !item.toLowerCase().includes("decant")));
  const combosDecants = combos.filter(c => c.includes.every(item => item.toLowerCase().includes("decant")));
  const combosMixtos = combos.filter(c => c.includes.some(item => item.toLowerCase().includes("decant")) && c.includes.some(item => !item.toLowerCase().includes("decant")));

  // Lógica Inteligente para alternar colores
  const activeSections = [];
  if (combosSellados.length > 0) {
    activeSections.push({ subtitle: "Colecciones en Frascos Sellados",  data: combosSellados });
  }
  if (combosMixtos.length > 0) {
    activeSections.push({ subtitle: "Frascos Sellados + Decants ",  data: combosMixtos });
  }
  if (combosDecants.length > 0) {
    activeSections.push({ subtitle: "Combos de Decants", data: combosDecants });
  }

  return (
    <div className="min-h-screen text-[#f6f4ed] flex flex-col relative overflow-x-hidden">
      <Header />
      
      {/* Partículas de agua */}
      <WaterParticles />

      <main className="flex-1 relative z-10">
        
        {/* ==============================================================
            HERO BANNER CON IMAGEN DE FONDO
            ============================================================== */}
        <section className="relative flex items-center justify-center min-h-[50vh] md:min-h-[70vh] py-20 overflow-hidden border-b border-[#c0a062]/30">
          
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="/combos_page_img.jpg" 
              alt="Fondo de Colecciones"
              fill
              className="object-cover object-center grayscale-[20%]" 
              priority
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-[#141f36]/90 via-[#141f36]/70 to-[#141f36] z-0" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center mt-10">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-medium mb-6 drop-shadow-lg text-white">
              Colecciones
            </h1>
            <div className="w-20 h-[1px] bg-[#c0a062] mx-auto mb-6 shadow-[0_0_10px_rgba(192,160,98,1)]" />
            <p className="font-serif italic text-lg md:text-xl text-[#f6f4ed]/90 max-w-3xl mx-auto drop-shadow-md">
              Descubrí nuestras selecciones. Desde frascos sellados hasta decants con un valor preferencial.
            </p>
          </div>
        </section>

        {combos.length === 0 && (
          <div className="text-center py-32 relative z-10">
            <p className="font-serif text-xl text-[#f6f4ed]/50">Próximamente nuevas colecciones privadas.</p>
          </div>
        )}

        {/* ==============================================================
            RENDERIZADO AUTOMÁTICO ALTERNADO (OSCURO / CLARO)
            ============================================================== */}
        {activeSections.map((section, index) => {
          const isLight = index % 2 !== 0; 
          
          return (
            <Vitrina 
              key={index}
              subtitle={section.subtitle} 
              isLight={isLight}
            >
              {section.data.map((combo) => (
                <div key={combo.id} className="min-w-[85vw] sm:min-w-[350px] snap-center md:min-w-0 md:w-auto">
                  <InteractiveComboCard combo={combo} />
                </div>
              ))}
            </Vitrina>
          )
        })}

      </main>
    </div>
  )
}