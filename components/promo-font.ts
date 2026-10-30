import { Bodoni_Moda, Poppins } from "next/font/google"

// Tipografías gordas solo para las promos: se van junto con los componentes promo-* cuando termine la campaña
const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"] })
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "800"] })

export const DISPLAY = { fontFamily: bodoni.style.fontFamily }
// Geométrica del póster de la promo clavos
export const GEOMETRIC = { fontFamily: poppins.style.fontFamily }
