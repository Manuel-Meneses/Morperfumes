"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, ShoppingCart, Plus, X, Info } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

export function InteractiveComboCard({ combo }: { combo: any }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  
  const [isModalOpen, setIsModalOpen] = useState(false)

  const parsedItems = combo.includes.map((item: string) => {
    const isDecant = item.toLowerCase().includes("decant");
    const cleanName = item.replace(/\(decant\)/i, "").replace(/decant/i, "").trim();
    return { original: item, cleanName, isDecant };
  });

  const hasSealed = parsedItems.some((item: any) => !item.isDecant);
  const hasDecants = parsedItems.some((item: any) => item.isDecant);
  const isAllDecants = !hasSealed && hasDecants;
  const isMixed = hasSealed && hasDecants;

  const isConfigurable = Boolean(combo.price3ml || combo.price10ml);
  const [comboSize, setComboSize] = useState<"3ml" | "5ml" | "10ml">("5ml");

  let currentPrice = combo.price5ml; 
  if (isConfigurable) {
    if (comboSize === "3ml" && combo.price3ml) currentPrice = combo.price3ml;
    if (comboSize === "10ml" && combo.price10ml) currentPrice = combo.price10ml;
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    const itemDetails = combo.includes.join(", ");
    const finalSizeLabel = isConfigurable ? `Discovery Set (${comboSize})` : "Colección Cerrada";

    addItem({
      id: `${combo.id}-${isConfigurable ? comboSize : "fijo"}`,
      name: combo.name,
      price: currentPrice,
      image: combo.images.join(",") || "/placeholder.svg", 
      size: `${finalSizeLabel}: ${itemDetails}`,
    });

    toast({
      title: "¡Colección agregada!",
      description: "El set se añadió a tu carrito web.",
    });
    
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsModalOpen(true)} className="relative pt-24 group w-full h-full flex cursor-pointer">
        <div className="bg-[#1a2640] border border-[#c0a062]/20 rounded-sm p-6 pt-32 pb-8 w-full flex flex-col items-center relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-[#c0a062]/50 hover:shadow-[0_20px_50px_rgba(192,160,98,0.15)]">

          <div className="absolute inset-3 border border-[#c0a062]/10 rounded-sm pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#c0a062]/20 rounded-b-md" /> 
          
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <Info className="w-5 h-5 text-[#c0a062]/50" />
          </div>

          {/* COLLAGE DINÁMICO TARJETA */}
          <div className="absolute -top-32 left-0 w-full h-64 flex items-center justify-center z-20 pointer-events-none">
            <div className="relative w-full h-full max-w-[280px]">
              {combo.images.length === 0 && <Image src="/placeholder.svg" alt="Combo" fill className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)]" />}
              {combo.images.length === 1 && <Image src={combo.images[0]} alt={combo.name} fill className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)] transform transition-transform duration-700 group-hover:-translate-y-4" />}
              {combo.images.length === 2 && (
                <>
                  <div className="absolute left-4 top-4 w-[60%] h-[90%]"><Image src={combo.images[0]} alt="P1" fill className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)] transform transition-transform duration-700 group-hover:-translate-y-4 group-hover:-rotate-6" /></div>
                  <div className="absolute right-4 top-10 w-[55%] h-[80%] z-0"><Image src={combo.images[1]} alt="P2" fill className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)] opacity-90 transform transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-6" /></div>
                </>
              )}
              {combo.images.length >= 3 && (
                <>
                  <div className="absolute left-0 top-12 w-[45%] h-[75%] z-0"><Image src={combo.images[1]} alt="P2" fill className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] opacity-80 transform transition-transform duration-700 group-hover:-translate-x-3 group-hover:-rotate-3" /></div>
                  <div className="absolute right-0 top-12 w-[45%] h-[75%] z-0"><Image src={combo.images[2]} alt="P3" fill className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] opacity-80 transform transition-transform duration-700 group-hover:translate-x-3 group-hover:rotate-3" /></div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[55%] h-[100%] z-10"><Image src={combo.images[0]} alt="P1" fill className="object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.8)] transform transition-transform duration-700 group-hover:-translate-y-6 group-hover:scale-105" /></div>
                </>
              )}
            </div>
          </div>

          <div className="text-center w-full z-20 flex flex-col flex-1 mt-4">
            <h3 className="font-serif text-2xl md:text-3xl text-[#f6f4ed] font-medium leading-tight mb-2 px-2">{combo.name}</h3>
            
            <div className="text-left w-full mt-4 mb-4 px-2">
              <p className="text-[#c0a062] text-[9px] uppercase tracking-[0.2em] font-bold mb-4 text-center border-b border-[#c0a062]/20 pb-2">Contenido del Set</p>
              <div className="space-y-2.5">
                {combo.includes.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-[#c0a062] shrink-0 mt-0.5" />
                    <span className="text-[#f6f4ed]/90 text-sm font-serif leading-tight">{item}</span>
                  </div>
                ))}
              </div>

              {isConfigurable ? (
                 <div className="mt-6 flex flex-col items-center">
                    <span className="text-[#f6f4ed]/40 text-[9px] uppercase tracking-widest mb-2">Formato de los Decants</span>
                    <div className="flex gap-2 bg-[#141f36]/50 p-1 rounded-sm border border-[#f6f4ed]/5 w-fit">
                      {["3ml", "5ml", "10ml"].map((size) => {
                         const isDisabled = (size === "3ml" && !combo.price3ml) || (size === "10ml" && !combo.price10ml);
                         return (
                          <button
                            key={size}
                            disabled={isDisabled}
                            onClick={(e) => { e.stopPropagation(); setComboSize(size as any); }}
                            className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-sm transition-all ${
                              comboSize === size
                                ? "bg-[#c0a062] text-[#141f36]"
                                : isDisabled ? "text-[#f6f4ed]/20 cursor-not-allowed" : "text-[#f6f4ed]/50 hover:text-[#c0a062]"
                            }`}
                          >
                            {size}
                          </button>
                         )
                      })}
                    </div>
                 </div>
              ) : isMixed ? (
                 <div className="mt-6 flex flex-col items-center">
                    <span className="text-[#f6f4ed]/40 text-[9px] uppercase tracking-widest mb-2">Formato del Decant</span>
                    <div className="flex gap-2 bg-[#141f36]/50 p-1 rounded-sm border border-[#f6f4ed]/5 w-fit">
                      <button
                        onClick={(e) => e.stopPropagation()} 
                        className="text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-sm transition-all bg-[#c0a062] text-[#141f36] cursor-default"
                      >
                        5ml (Fijo)
                      </button>
                    </div>
                 </div>
              ) : null}
            </div>

            <div className="mt-auto pt-6 border-t border-[#c0a062]/10 w-full px-2">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span key={currentPrice} className="font-serif text-3xl font-semibold text-[#c0a062] animate-in slide-in-from-bottom-1 fade-in duration-300">
                  ${currentPrice.toLocaleString("es-AR")}
                </span>
                {combo.originalPrice > currentPrice && (
                  <span className="font-serif text-sm text-[#f6f4ed]/40 line-through">
                    ${combo.originalPrice.toLocaleString("es-AR")}
                  </span>
                )}
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full h-12 bg-[#c0a062] hover:bg-[#f6f4ed] text-[#141f36] hover:text-[#141f36] rounded-none uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL DE DETALLE (OPTIMIZADO PARA MÓVILES) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#141f36]/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          
          {/* CONTENEDOR PRINCIPAL: Altura máxima 90vh (no se sale de la pantalla) y oculta lo que sobra */}
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#f6f4ed] shadow-2xl rounded-sm z-10 border border-[#c0a062]/30 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            
            {/* BOTÓN DE CERRAR CLAVADO (No se mueve al scrollear) */}
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-3 right-3 z-50 p-2.5 bg-white shadow-lg rounded-full text-[#141f36] hover:bg-[#141f36] hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ZONA SCROLLEABLE INTERNA */}
            <div className="w-full h-full flex flex-col md:flex-row overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              {/* FOTO DEL MODAL (Achicada para celulares) */}
              <div className="w-full md:w-1/2 bg-[#e6e2d3] p-6 md:p-12 min-h-[200px] md:min-h-[300px] flex items-center justify-center relative shrink-0">
                 <div className="absolute inset-4 border border-[#141f36]/10 pointer-events-none" />
                 <div className="relative w-full h-full min-h-[180px] md:min-h-[250px] max-w-[200px] md:max-w-[300px] mx-auto">
                   {combo.images.length === 1 && <Image src={combo.images[0]} alt={combo.name} fill className="object-contain" />}
                   {combo.images.length === 2 && (
                      <>
                        <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-[60%] h-[80%] z-10"><Image src={combo.images[0]} alt="P1" fill className="object-contain drop-shadow-xl" /></div>
                        <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-[55%] h-[75%] z-0"><Image src={combo.images[1]} alt="P2" fill className="object-contain opacity-80" /></div>
                      </>
                   )}
                   {combo.images.length >= 3 && (
                      <>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[45%] h-[65%] z-0"><Image src={combo.images[1]} alt="P2" fill className="object-contain opacity-80 drop-shadow-md" /></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[65%] z-0"><Image src={combo.images[2]} alt="P3" fill className="object-contain opacity-80 drop-shadow-md" /></div>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[85%] z-10"><Image src={combo.images[0]} alt="P1" fill className="object-contain drop-shadow-2xl" /></div>
                      </>
                   )}
                 </div>
              </div>

              {/* Información y Botón de Compra */}
              <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                <span className="text-[#c0a062] text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Colección Privada</span>
                <h2 className="font-serif text-2xl md:text-4xl font-medium text-[#141f36] mb-3 leading-tight">{combo.name}</h2>
                <p className="text-[#141f36]/70 font-serif italic text-sm md:text-lg mb-6 leading-relaxed">"{combo.description}"</p>
                
                <div className="mb-8 p-4 md:p-6 bg-white border border-[#141f36]/10 shadow-sm">
                   <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#141f36] mb-4">Esta colección incluye:</p>
                   <ul className="space-y-3">
                     {parsedItems.map((item: any, idx: number) => (
                       <li key={idx} className="flex items-start gap-3 text-[#141f36]/80 text-xs md:text-sm">
                         <Plus className="w-3.5 h-3.5 text-[#c0a062] shrink-0 mt-0.5" />
                         <div className="flex-1">
                           <span className="font-medium text-[#141f36]">{item.cleanName}</span>
                           <span className="block text-[10px] md:text-xs font-serif italic opacity-70 mt-0.5">
                             {item.isDecant ? (isMixed ? "Decant 5ml (Edición Fija)" : `Formato Decant`) : "Frasco Original Sellado"}
                           </span>
                         </div>
                       </li>
                     ))}
                   </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
                   <div className="flex flex-col w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">
                     <span key={currentPrice} className="font-serif text-3xl md:text-3xl font-bold text-[#141f36] leading-none">${currentPrice.toLocaleString("es-AR")}</span>
                   </div>
                   <button 
                     onClick={handleAddToCart}
                     className="w-full sm:flex-1 h-14 bg-[#141f36] hover:bg-[#c0a062] text-white rounded-none uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                   >
                     <ShoppingCart className="w-4 h-4" /> Agregar
                   </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}