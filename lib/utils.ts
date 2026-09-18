import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ======================================================================
// PRECIOS: LISTA (tarjeta 3 cuotas) vs EFECTIVO / TRANSFERENCIA
// ======================================================================
// El precio que viene de la planilla es el de EFECTIVO / TRANSFERENCIA:
// es lo que el negocio quiere cobrar limpio (sin comisiones).
//
// El precio de LISTA (tarjeta) se calcula recargando ese precio para
// cubrir las comisiones de Mercado Pago, de modo que después de que MP
// descuente su parte, el negocio reciba exactamente el de transferencia.
//
// ⚠️ DOS DETALLES CLAVE (validados contra el simulador de MP):
// 1) Los % que muestra MP son SIN IVA; MP los cobra CON IVA (× 1,21).
// 2) MP descuenta el % sobre el TOTAL cobrado, no sobre el neto. Por eso
//    NO se suma el %: se divide por (1 - costo). Así no se pierde plata.
//
// Config de la captura: Link de pago + tarjeta de crédito + 3 cuotas.
// 👉 Si cambian las comisiones o el plan de cuotas, editá estas constantes.
export const IVA = 1.21
export const MP_FEE_COBRO = 0.066 // 6,60% costo por cobro (sin IVA)
export const MP_FEE_CUOTAS_3 = 0.1049 // 10,49% costo por ofrecer 3 cuotas (sin IVA)
export const CUOTAS = 3
// Costo efectivo total que MP descuenta, ya con IVA: (6,60% + 10,49%) × 1,21 = 20,6789%
export const MP_FEE_EFECTIVO = (MP_FEE_COBRO + MP_FEE_CUOTAS_3) * IVA

/**
 * Precio de LISTA (tarjeta en 3 cuotas) a partir del precio de transferencia.
 * Ej: 10.000 → 12.607 (coincide con el simulador de Mercado Pago).
 */
export function precioLista(precioTransferencia: number): number {
  if (!precioTransferencia || precioTransferencia <= 0) return 0
  return Math.round(precioTransferencia / (1 - MP_FEE_EFECTIVO))
}

/**
 * Valor de cada una de las 3 cuotas (precio de lista dividido en CUOTAS).
 * Ej: 10.000 → 4.202 por cuota (3x).
 */
export function precioCuota(precioTransferencia: number): number {
  const lista = precioLista(precioTransferencia)
  if (!lista) return 0
  return Math.round(lista / CUOTAS)
}
