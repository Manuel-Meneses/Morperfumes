import { ProductCard, type Product } from "./product-card"

interface ProductGridProps {
  products: Product[]
  layout?: "slider" | "grid" // Agregamos la opción de elegir el diseño
}

export function ProductGrid({ products, layout = "slider" }: ProductGridProps) {
  // Modo Portada: Slider horizontal
  if (layout === "slider") {
    return (
      <div className="w-full relative">
        <div className="grid grid-flow-col auto-cols-[85vw] sm:auto-cols-[280px] lg:auto-cols-[300px] gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory overscroll-x-contain pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {products.map((product) => (
            <div key={product.id} className="snap-start w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Modo Catálogo: Grilla vertical clásica
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}