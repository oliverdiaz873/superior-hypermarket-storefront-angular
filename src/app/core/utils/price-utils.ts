/**
 * @fileoverview FUENTE ÚNICA DE VERDAD para presentación de precio + unidad.
 *
 *   API → Mapper → datos estructurados → price-utils → UI string final
 *
 * REGLAS INQUEBRANTABLES:
 * 1. SIN .split(' '). NUNCA parseamos un string ya compuesto.
 * 2. SIN pluralización morfológica en código. Toda está en i18n keys.
 * 3. SIN lang como parámetro independiente de translateFn.
 * 4. SIN translatedUnit. Un único camino estructurado.
 * 5. SIN NaN / undefined en outputs.
 */

// =========================================================================
// Conocimiento estático
// =========================================================================

const NON_COUNTABLE_UNITS = new Set(['kg', 'g', 'lb', 'oz', 'ml'])

const UNIT_ALIASES: Record<string, string> = {
  // unidad / unit
  unidad: 'unidad',
  unidades: 'unidad',
  unit: 'unidad',
  units: 'unidad',
  // litro / liter / l (l → litro: misma unidad semántica, CONTABLE)
  litro: 'litro',
  litros: 'litro',
  liter: 'litro',
  liters: 'litro',
  l: 'litro',
  // paquete / pack
  paquete: 'paquete',
  paquetes: 'paquete',
  pack: 'paquete',
  packs: 'paquete',
  // caja / box
  caja: 'caja',
  cajas: 'caja',
  box: 'caja',
  boxes: 'caja',
  // botella / bottle
  botella: 'botella',
  botellas: 'botella',
  bottle: 'botella',
  bottles: 'botella',
  // lata / can
  lata: 'lata',
  latas: 'lata',
  can: 'lata',
  cans: 'lata',
  // No contables
  kg: 'kg',
  g: 'g',
  lb: 'lb',
  oz: 'oz',
  ml: 'ml',
}

// =========================================================================
// Tipos públicos fuertemente tipados (SIN any)
// =========================================================================

export type StructuredUnitInput = Partial<{
  unidad: string
  unit: string
  quantity: number
  unitQuantity: number
}>

export interface NormalizedUnit {
  hasUnit: boolean
  baseKey: string
  quantity: number
  isCountable: boolean
}

export type TranslateFn = (key: string) => string

export interface FormatPriceOptions {
  pricePrefix?: string
}

// =========================================================================
// Paso 1. Normalización estructurada (1 sola fuente)
// =========================================================================

export function normalizeStructuredUnit(input: StructuredUnitInput): NormalizedUnit {
  const rawUnit = (input.unidad ?? input.unit ?? '').trim()

  if (!rawUnit) {
    return { hasUnit: false, baseKey: '', quantity: 1, isCountable: true }
  }

  const lower = rawUnit.toLowerCase()
  const baseKey = UNIT_ALIASES[lower] ?? lower
  const isCountable = !NON_COUNTABLE_UNITS.has(baseKey)

  const qtyRaw = input.quantity ?? input.unitQuantity
  let quantity: number
  const parsed = Number(qtyRaw)
  if (qtyRaw == null || !Number.isFinite(parsed) || parsed <= 0) {
    quantity = 1
  } else {
    quantity = parsed
  }

  return { hasUnit: true, baseKey, quantity, isCountable }
}

// =========================================================================
// Helper traducción seguro (sin invención de morfología)
// =========================================================================

function translateKey(key: string, fallback: string, translateFn: TranslateFn): string {
  const translated = translateFn(key)
  return translated !== key ? translated : fallback
}

// =========================================================================
// Paso 2. Etiqueta unidad traducida final
// =========================================================================

export function formatUnitLabel(
  input: StructuredUnitInput,
  translateFn: TranslateFn,
): string {
  const n = normalizeStructuredUnit(input)
  if (!n.hasUnit) return ''

  // --- No contable: key simple -----------------------------------------
  if (!n.isCountable) {
    const key = `common.units.${n.baseKey}`
    const translated = translateKey(key, n.baseKey, translateFn)
    if (n.quantity === 1) return translated
    return `${n.quantity} ${translated}`
  }

  // --- Contable: keys .singular / .plural (i18n) -----------------------
  if (n.quantity === 1) {
    const key = `common.units.${n.baseKey}.singular`
    return translateKey(key, n.baseKey, translateFn)
  }

  const pluralKey = `common.units.${n.baseKey}.plural`
  const singularKey = `common.units.${n.baseKey}.singular`
  const singularFallback = translateKey(singularKey, n.baseKey, translateFn)
  // SIN pluralización morfológica. Si falta .plural, fallback a la forma
  // singular traducida. Nunca inventamos 's' ni reglas morfológicas.
  const translatedPlural = translateKey(pluralKey, singularFallback, translateFn)
  return `${n.quantity} ${translatedPlural}`
}

// =========================================================================
// cleanPrice (se mantiene intacta; responsabilidad separada)
// =========================================================================

export const cleanPrice = (text: string): string => {
  const cleaned = text.replace(/^[a-z]+:\s*/i, '').trim()
  const match = cleaned.match(/(\$?\d+(?:,\d+)?(?:\.\d+)?)/)
  return match ? match[1] : cleaned
}

// =========================================================================
// Paso 3. Precio final (único camino)
// =========================================================================

export function formatProductPrice(
  product: StructuredUnitInput & { precio: number },
  translateFn: TranslateFn,
  opts: FormatPriceOptions = {},
): string {
  const pricePrefix = opts.pricePrefix ?? 'Precio: '
  const price = `$${product.precio.toLocaleString('en-US')}`
  const unitLabel = formatUnitLabel(product, translateFn)

  return unitLabel ? `${pricePrefix}${price} / ${unitLabel}` : `${pricePrefix}${price}`
}

// =========================================================================
// Paso 3b. Segunda línea ProductCard: $precio / unidad
//   Centraliza la lógica de la segunda línea para evitar duplicación.
//   Retorna '' cuando no hay unidad → Angular oculta la línea (corrige bug
//   de Next que mostraba "$90 / " con slash colgando).
// =========================================================================

export function formatPricePerUnit(
  product: StructuredUnitInput & { precio: number },
  translateFn: TranslateFn,
): string {
  const unitLabel = formatUnitLabel(product, translateFn)

  if (!unitLabel) {
    return ''
  }

  const price = `$${product.precio.toLocaleString('en-US')}`

  return `${price} / ${unitLabel}`
}
