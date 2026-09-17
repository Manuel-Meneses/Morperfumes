import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ======================================================================
// PRECIOS: LISTA (tarjeta) vs EFECTIVO / TRANSFERENCIA
// ======================================================================
// El precio que viene de la planilla es el de EFECTIVO / TRANSFERENCIA:
// es lo que el negocio quiere cobrar limpio (sin comisiones).
//
// El precio de LISTA (tarjeta) se calcula recargando ese precio para
// cubrir las comisiones de Mercado Pago, de modo que después de que MP
// descuente su parte, el neto siga siendo el precio de efectivo.
//
// OJO: MP cobra el % sobre el total cobrado, no sobre el neto. Por eso
// NO alcanza con sumar el %; hay que dividir por (1 - comisión). Así
// el negocio no pierde plata cuando pagan con tarjeta.
//
// 👉 Si cambian las comisiones, editá solo estas constantes.
export const MP_FEE_COBRO = 0.066 // 6,60% costo por cobro (IVA incl.)
export const MP_FEE_CUOTAS = 0.1049 // 10,49% costo por ofrecer cuotas (IVA incl.)
export const MP_FEE_TOTAL = MP_FEE_COBRO + MP_FEE_CUOTAS // 17,09%

/**
 * Devuelve el precio de LISTA (tarjeta) a partir del precio de efectivo.
 * Redondea hacia arriba a la decena más cercana para no perder ni un peso.
 */
export function precioLista(precioEfectivo: number): number {
  if (!precioEfectivo || precioEfectivo <= 0) return 0
  const bruto = precioEfectivo / (1 - MP_FEE_TOTAL)
  return Math.ceil(bruto / 10) * 10
}
