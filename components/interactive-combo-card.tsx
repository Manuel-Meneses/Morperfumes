"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom" // 🏆 IMPORTAMOS EL PORTAL 🏆
import Image from "next/image"
import { Check, ShoppingCart, Plus, X, Info } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

export function InteractiveComboCard({ combo }: { combo: any }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selections, setSelections] = useState<Record<number, string>>({})
  
  // 🏆 ESTADO PARA SABER SI ESTAMOS EN EL CLIENTE (Necesario para el Portal) 🏆
  const [mounted, setMounted] = useState(false)

  const isSuperCombo = Boolean(combo.customSlots && combo.customSlots.length > 0);

  useEffect(() => {
    setMounted(true) // Le decimos a React que ya cargó la página
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "unset";  
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (isSuperCombo) {
      const initial: Record<number, string> = {}
      combo.customSlots.forEach((slot: any, i: number) => {
        initial[i] = slot.options[0].name 
      })
      setSelections(initial)
    }
  }, [combo, isSuperCombo])

  const displayImages = isSuperCombo 
    ? combo.customSlots.map((slot: any, idx: number) => {
        const selectedOptName = selections[idx] || slot.options[0]?.name;
        const optData = slot.options.find((o: any) => o.name === selectedOptName);
        return optData?.image || "/placeholder.svg";
      }).slice(0, 3)
    : combo.images;

  const parsedItems = combo.includes ? combo.includes.map((item: string) => {
    const isDecant = item.toLowerCase().includes("decant");
    const cleanName = item.replace(/\(decant\)/i, "").replace(/decant/i, "").trim();
    return { original: item, cleanName, isDecant };
  }) : [];

  const hasSealed = parsedItems.some((item: any) => !item.isDecant);
  const hasDecants = parsedItems.some((item: any) => item.isDecant);
  const isMixed = hasSealed && hasDecants;

  const isConfigurable = Boolean(combo.price3ml || combo.price10ml);
  const [comboSize, setComboSize] = useState<"3ml" | "5ml" | "10ml">("5ml");

  let currentPrice = combo.price5ml || combo.price || 0; 
  if (isConfigurable && comboSize === "3ml" && combo.price3ml) currentPrice = combo.price3ml;
  if (isConfigurable && comboSize === "10ml" && combo.price10ml) currentPrice = combo.price10ml;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    let itemDetails = "";
    if (isSuperCombo) {
      itemDetails = combo.customSlots
        .map((slot: any, idx: number) => `${slot.title}: ${selections[idx]}`)
        .join(" | ");
    } else {
      itemDetails = combo.includes.join(", ");
    }

    const finalSizeLabel = isSuperCombo 
      ? "Súper Combo Personalizado" 
      : (isConfigurable ? `Discovery Set (${comboSize})` : "Colección Cerrada");

    const cartId = isSuperCombo ? `${combo.id}-${Date.now()}` : `${combo.id}-${isConfigurable ? comboSize : "fijo"}`;

    addItem({
      id: cartId,
      name: combo.name,
      price: currentPrice,
      image: displayImages && displayImages.length > 0 ? displayImages[0] : "/placeholder.svg", 
      size: `${finalSizeLabel} -> ${itemDetails}`,
    });

    toast({
      title: "¡Colección agregada!",
      description: "El set se añadió a tu carrito web.",
    });
    
    setIsModalOpen(false);
  };

  return (
    <>
      {/* TARJETA PRINCIPAL */}
      <div onClick={() => setIsModalOpen(true)} className="relative pt-24 group w-full h-full flex cursor-pointer">
        <div className={`rounded-sm p-6 pt-32 pb-8 w-full flex flex-col items-center relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:shadow-xl ${
          isSuperCombo 
            ? "bg-gradient-to-b from-[#c0a062] to-[#ab8b4e] border border-[#141f36]/20 hover:border-[#141f36]/50" 
            : "bg-[#1a2640] border border-[#c0a062]/20 hover:border-[#c0a062]/50"
        }`}>

          <div className={`absolute inset-3 border rounded-sm pointer-events-none ${isSuperCombo ? "border-[#141f36]/10" : "border-[#c0a062]/10"}`} />
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-b-md ${isSuperCombo ? "bg-[#141f36]/30" : "bg-[#c0a062]/20"}`} /> 
          
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <Info className={`w-5 h-5 ${isSuperCombo ? "text-[#fff]/50" : "text-[#c0a062]/50"}`} />
          </div>

          <div className="absolute -top-32 left-0 w-full h-64 flex items-center justify-center z-20 pointer-events-none">
            <div className="relative w-full h-full max-w-[280px]">
              {displayImages && displayImages.length === 0 && <Image src="/placeholder.svg" alt="Combo" fill className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)]" />}
              {displayImages && displayImages.length === 1 && <Image src={displayImages[0]} alt={combo.name} fill className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)] transform transition-transform duration-700 group-hover:-translate-y-4" />}
              {displayImages && displayImages.length === 2 && (
                <>
                  <div className="absolute left-4 top-4 w-[60%] h-[90%]"><Image src={displayImages[0]} alt="P1" fill className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)] transform transition-transform duration-700 group-hover:-translate-y-4 group-hover:-rotate-6" /></div>
                  <div className="absolute right-4 top-10 w-[55%] h-[80%] z-0"><Image src={displayImages[1]} alt="P2" fill className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)] opacity-90 transform transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-6" /></div>
                </>
              )}
              {displayImages && displayImages.length >= 3 && (
                <>
                  <div className="absolute left-0 top-12 w-[45%] h-[75%] z-0"><Image src={displayImages[1]} alt="P2" fill className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] opacity-80 transform transition-transform duration-700 group-hover:-translate-x-3 group-hover:-rotate-3" /></div>
                  <div className="absolute right-0 top-12 w-[45%] h-[75%] z-0"><Image src={displayImages[2]} alt="P3" fill className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] opacity-80 transform transition-transform duration-700 group-hover:translate-x-3 group-hover:rotate-3" /></div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[55%] h-[100%] z-10"><Image src={displayImages[0]} alt="P1" fill className="object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.8)] transform transition-transform duration-700 group-hover:-translate-y-6 group-hover:scale-105" /></div>
                </>
              )}
            </div>
          </div>

          <div className="text-center w-full z-20 flex flex-col flex-1 mt-4">
            <h3 className={`font-serif text-2xl md:text-3xl font-medium leading-tight mb-2 px-2 ${isSuperCombo ? "text-[#fff]" : "text-[#f6f4ed]"}`}>
              {combo.name}
            </h3>
            
            <div className="text-left w-full mt-4 mb-4 px-2">
              <p className={`text-[9px] uppercase tracking-[0.2em] font-bold mb-4 text-center border-b pb-2 ${isSuperCombo ? "text-[#141f36] border-[#fff]/20" : "text-[#c0a062] border-[#c0a062]/20"}`}>
                {isSuperCombo ? "Elegí tus Opciones Adentro" : "Contenido del Set"}
              </p>
              
              {!isSuperCombo && (
                <div className="space-y-2.5">
                  {combo.includes && combo.includes.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-[#c0a062] shrink-0 mt-0.5" />
                      <span className="text-[#f6f4ed]/90 text-sm font-serif leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {isSuperCombo && (
                 <div className="space-y-2.5 text-center px-4">
                    <p className="text-[#fff]/80 text-sm font-serif italic">"Armá tu set personalizado con los mejores perfumes del catálogo a un valor único."</p>
                 </div>
              )}

              {!isSuperCombo && isConfigurable && (
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
                                ? "bg-[#c0a062] text-[#fff]"
                                : isDisabled ? "text-[#f6f4ed]/20 cursor-not-allowed" : "text-[#f6f4ed]/50 hover:text-[#c0a062]"
                            }`}
                          >
                            {size}
                          </button>
                         )
                      })}
                    </div>
                 </div>
              )}
            </div>

            <div className={`mt-auto pt-6 border-t w-full px-2 ${isSuperCombo ? "border-[#141f36]/10" : "border-[#c0a062]/10"}`}>
              <div className="flex items-center justify-center gap-3 mb-5">
                <span key={currentPrice} className={`font-serif text-3xl font-semibold animate-in slide-in-from-bottom-1 fade-in duration-300 ${isSuperCombo ? "text-[#fff]" : "text-[#c0a062]"}`}>
                  ${currentPrice.toLocaleString("es-AR")}
                </span>
                {combo.originalPrice > currentPrice && (
                  <span className={`font-serif text-sm line-through ${isSuperCombo ? "text-[#fff]/50" : "text-[#f6f4ed]/40"}`}>
                    ${combo.originalPrice.toLocaleString("es-AR")}
                  </span>
                )}
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                className={`w-full h-12 rounded-none uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg ${
                  isSuperCombo 
                    ? "bg-[#141f36] hover:bg-[#1a2640] text-[#c0a062]" 
                    : "bg-[#c0a062] hover:bg-[#f6f4ed] text-[#fff]"
                }`}
              >
                {isSuperCombo ? "Armar mi Combo" : "Ver Detalle"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🏆 ================= MODAL TELETRANSPORTADO AL BODY ================= 🏆 */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#141f36]/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#f6f4ed] shadow-2xl rounded-sm z-10 border border-[#c0a062]/30 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-3 right-3 z-50 p-2.5 bg-white shadow-lg rounded-full text-[#141f36] hover:bg-[#141f36] hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full h-full flex flex-col md:flex-row overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              <div className="w-full md:w-1/2 bg-[#e6e2d3] p-6 md:p-12 min-h-[200px] md:min-h-[300px] flex items-center justify-center relative shrink-0">
                 <div className="absolute inset-4 border border-[#141f36]/10 pointer-events-none" />
                 <div className="relative w-full h-full min-h-[180px] md:min-h-[250px] max-w-[200px] md:max-w-[300px] mx-auto">
                   {displayImages && displayImages.length === 1 && <Image src={displayImages[0]} alt={combo.name} fill className="object-contain" />}
                   {displayImages && displayImages.length === 2 && (
                      <>
                        <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-[60%] h-[80%] z-10"><Image src={displayImages[0]} alt="P1" fill className="object-contain drop-shadow-xl" /></div>
                        <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-[55%] h-[75%] z-0"><Image src={displayImages[1]} alt="P2" fill className="object-contain opacity-80" /></div>
                      </>
                   )}
                   {displayImages && displayImages.length >= 3 && (
                      <>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[45%] h-[65%] z-0"><Image src={displayImages[1]} alt="P2" fill className="object-contain opacity-80 drop-shadow-md" /></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[65%] z-0"><Image src={displayImages[2]} alt="P3" fill className="object-contain opacity-80 drop-shadow-md" /></div>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[85%] z-10"><Image src={displayImages[0]} alt="P1" fill className="object-contain drop-shadow-2xl" /></div>
                      </>
                   )}
                 </div>
              </div>

              <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                <span className="text-[#c0a062] text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                  {isSuperCombo ? "Super Combo" : "Colección Privada"}
                </span>
                <h2 className="font-serif text-2xl md:text-4xl font-medium text-[#141f36] mb-3 leading-tight">{combo.name}</h2>
                <p className="text-[#141f36]/70 font-serif italic text-sm md:text-lg mb-6 leading-relaxed">"{combo.description}"</p>
                
                {isSuperCombo ? (
                  <div className="mb-8 w-full">
                     <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#141f36] mb-4">Armá tu combinación:</p>
                     <div className="space-y-4">
                       {combo.customSlots.map((slot: any, idx: number) => (
                         <div key={idx} className="bg-white border border-[#141f36]/10 p-4 shadow-sm">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-[#c0a062] mb-3 flex items-center gap-2">
                             <Plus className="w-3 h-3" /> {slot.title}
                           </p>
                           <div className="flex flex-col gap-2">
                             {slot.options.map((opt: any) => {
                               const isSelected = selections[idx] === opt.name;
                               return (
                                 <button
                                   key={opt.name}
                                   onClick={() => setSelections(prev => ({ ...prev, [idx]: opt.name }))}
                                   className={`text-left px-3 py-2.5 text-xs md:text-sm font-serif transition-all border ${
                                     isSelected
                                       ? "border-[#141f36] bg-[#141f36] text-[#f6f4ed] shadow-inner"
                                       : "border-[#141f36]/10 text-[#141f36]/70 hover:border-[#c0a062]/40"
                                   } flex items-center justify-between`}
                                 >
                                   <span>{opt.name}</span>
                                   {isSelected && <Check className="w-4 h-4 text-[#c0a062]" />}
                                 </button>
                               )
                             })}
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
                ) : (
                  <div className="mb-8 p-4 md:p-6 bg-white border border-[#141f36]/10 shadow-sm">
                     <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#141f36] mb-4">Esta colección incluye:</p>
                     <ul className="space-y-3">
                       {parsedItems.map((item: any, idx: number) => (
                         <li key={idx} className="flex items-start gap-3 text-[#141f36]/80 text-xs md:text-sm">
                           <Check className="w-3.5 h-3.5 text-[#c0a062] shrink-0 mt-0.5" />
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
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
                   <div className="flex flex-col w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">
                     <span key={currentPrice} className="font-serif text-3xl md:text-3xl font-bold text-[#141f36] leading-none">${currentPrice.toLocaleString("es-AR")}</span>
                   </div>
                   <button 
                     onClick={handleAddToCart}
                     className="w-full sm:flex-1 h-14 bg-[#141f36] hover:bg-[#c0a062] text-white rounded-none uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                   >
                     <ShoppingCart className="w-4 h-4" /> 
                     {isSuperCombo ? "Agregar Super Combo" : "Agregar"}
                   </button>
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}