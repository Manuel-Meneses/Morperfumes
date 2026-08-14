import type React from "react"
import type { Metadata } from "next"
import { Lora, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"

// 1. Configuramos nuestra tipografía para el cuerpo del texto
const lora = Lora({ 
  subsets: ["latin"], 
  variable: "--font-cuerpo",
  weight: ["400", "500", "600", "700"],
})

// 2. Configuramos nuestra tipografía para los títulos (Serif)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
})

// 3. Actualizamos la Metadata para el SEO y la pestaña del navegador
export const metadata: Metadata = {
  title: "Mor Perfumes | Esencia Heráldica",
  description: "Lujo botánico y herencia. Fragancias nobles con espíritu clásico y natural.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // 4. Cambiamos el idioma a español
    <html lang="es">
      <body className={`${lora.variable} ${cormorant.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}