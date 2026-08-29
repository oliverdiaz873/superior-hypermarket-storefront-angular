/**
 * Tests price-utils — FUENTE ÚNICA DE VERDAD.
 *
 * Typado fuerte (SIN any). Cubre todos los casos obligatorios del plan.
 */
import { describe, expect, it } from 'vitest';
import {
  cleanPrice,
  normalizeStructuredUnit,
  formatUnitLabel,
  formatProductPrice,
  formatPricePerUnit,
  type StructuredUnitInput,
  type TranslateFn,
} from './price-utils';

// =========================================================================
// Helpers — traducciones basadas en los i18n reales (ES / EN)
// =========================================================================

function buildTranslatorEs(): TranslateFn {
  const table: Record<string, string> = {
    // Contables
    'common.units.unidad.singular': 'unidad',
    'common.units.unidad.plural': 'unidades',
    'common.units.litro.singular': 'litro',
    'common.units.litro.plural': 'litros',
    'common.units.paquete.singular': 'paquete',
    'common.units.paquete.plural': 'paquetes',
    'common.units.caja.singular': 'caja',
    'common.units.caja.plural': 'cajas',
    'common.units.botella.singular': 'botella',
    'common.units.botella.plural': 'botellas',
    'common.units.lata.singular': 'lata',
    'common.units.lata.plural': 'latas',
    // No contables (key simple; sin singular/plural)
    'common.units.kg': 'kg',
    'common.units.g': 'g',
    'common.units.lb': 'lb',
    'common.units.oz': 'oz',
    'common.units.ml': 'ml',
  };
  return (k) => table[k] ?? k;
}

function buildTranslatorEn(): TranslateFn {
  const table: Record<string, string> = {
    'common.units.unidad.singular': 'unit',
    'common.units.unidad.plural': 'units',
    'common.units.litro.singular': 'liter',
    'common.units.litro.plural': 'liters',
    'common.units.paquete.singular': 'pack',
    'common.units.paquete.plural': 'packs',
    'common.units.caja.singular': 'box',
    'common.units.caja.plural': 'boxes',
    'common.units.botella.singular': 'bottle',
    'common.units.botella.plural': 'bottles',
    'common.units.lata.singular': 'can',
    'common.units.lata.plural': 'cans',
    'common.units.kg': 'kg',
    'common.units.g': 'g',
    'common.units.lb': 'lb',
    'common.units.oz': 'oz',
    'common.units.ml': 'ml',
  };
  return (k) => table[k] ?? k;
}

type In = StructuredUnitInput & { precio: number };
const inputLike = (overrides: Partial<In> = {}): In => ({ precio: 100, ...overrides });

// =========================================================================
// cleanPrice (sin regresiones)
// =========================================================================
describe('cleanPrice', () => {
  it('"Precio: $2,500.00" → "$2,500.00"', () => {
    expect(cleanPrice('Precio: $2,500.00')).toBe('$2,500.00');
  });
  it('"$100" → "$100"', () => {
    expect(cleanPrice('$100')).toBe('$100');
  });
});

// =========================================================================
// normalizeStructuredUnit — normalización 1ª etapa
// =========================================================================
describe('normalizeStructuredUnit', () => {
  describe('sin unidad → hasUnit=false', () => {
    it('objeto vacío', () => expect(normalizeStructuredUnit({}).hasUnit).toBe(false));
    it('unidad=""', () => expect(normalizeStructuredUnit({ unidad: '' }).hasUnit).toBe(false));
    it('unidad="   "', () => expect(normalizeStructuredUnit({ unidad: '   ' }).hasUnit).toBe(false));
    it('unidad=undefined', () =>
      expect(normalizeStructuredUnit({ unidad: undefined }).hasUnit).toBe(false));
  });

  describe('hasUnit es independiente de quantity (conceptos separados)', () => {
    it('unidad definida quantity=NaN → hasUnit=true, quantity=1', () => {
      const r = normalizeStructuredUnit({ unidad: 'kg', quantity: NaN });
      expect(r.hasUnit).toBe(true);
      expect(r.quantity).toBe(1);
    });
    it('unidad definida quantity=0 → hasUnit=true, quantity=1', () => {
      const r = normalizeStructuredUnit({ unidad: 'kg', quantity: 0 });
      expect(r.hasUnit).toBe(true);
      expect(r.quantity).toBe(1);
    });
    it('unidad definida quantity=-5 → hasUnit=true, quantity=1', () => {
      const r = normalizeStructuredUnit({ unidad: 'kg', quantity: -5 });
      expect(r.quantity).toBe(1);
    });
    it('unidad definida quantity=null → hasUnit=true, quantity=1', () => {
      const r = normalizeStructuredUnit({ unidad: 'unidad', quantity: null as unknown as undefined });
      expect(r.hasUnit).toBe(true);
      expect(r.quantity).toBe(1);
    });
  });

  describe('FIX: unidad existe quantity undefined → default 1', () => {
    it('unidad:"unidad" sin quantity → quantity=1, baseKey=unidad, isCountable=true', () => {
      const r = normalizeStructuredUnit({ unidad: 'unidad' });
      expect(r.hasUnit).toBe(true);
      expect(r.baseKey).toBe('unidad');
      expect(r.quantity).toBe(1);
      expect(r.isCountable).toBe(true);
    });
    it('unidad:"kg" sin quantity → quantity=1, baseKey=kg, no contable', () => {
      const r = normalizeStructuredUnit({ unidad: 'kg' });
      expect(r.quantity).toBe(1);
      expect(r.baseKey).toBe('kg');
      expect(r.isCountable).toBe(false);
    });
  });

  describe('aliases → baseKey', () => {
    it('unit (EN) → baseKey "unidad"', () => {
      expect(normalizeStructuredUnit({ unit: 'unit' })).toMatchObject({ baseKey: 'unidad' });
    });
    it('units (EN plural) → unidad', () =>
      expect(normalizeStructuredUnit({ unidad: 'units' }).baseKey).toBe('unidad'));
    it('liter → litro', () =>
      expect(normalizeStructuredUnit({ unidad: 'liter' }).baseKey).toBe('litro'));
    it('liters → litro', () =>
      expect(normalizeStructuredUnit({ unidad: 'liters' }).baseKey).toBe('litro'));
    it('litros → litro', () =>
      expect(normalizeStructuredUnit({ unidad: 'litros' }).baseKey).toBe('litro'));
    it('boxes → caja', () =>
      expect(normalizeStructuredUnit({ unidad: 'boxes' }).baseKey).toBe('caja'));
  });

  describe('UNIFICACIÓN SEMÁNTICA: "l" → "litro" CONTABLE (no aparece en NON_COUNTABLE)', () => {
    it('baseKey = litro', () =>
      expect(normalizeStructuredUnit({ unidad: 'l' }).baseKey).toBe('litro'));
    it('isCountable = true', () =>
      expect(normalizeStructuredUnit({ unidad: 'l' }).isCountable).toBe(true));
  });

  describe('legacy unitQuantity', () => {
    it('unit + unitQuantity funcionan igual que unidad + quantity', () => {
      const r = normalizeStructuredUnit({ unit: 'liter', unitQuantity: 2 });
      expect(r.hasUnit).toBe(true);
      expect(r.baseKey).toBe('litro');
      expect(r.quantity).toBe(2);
      expect(r.isCountable).toBe(true);
    });
  });
});

// =========================================================================
// formatUnitLabel ES
// =========================================================================
describe('formatUnitLabel ES', () => {
  const es = buildTranslatorEs();

  it('sin unidad → ""', () => expect(formatUnitLabel({}, es)).toBe(''));

  // Contables
  it('unidad 1 → unidad', () =>
    expect(formatUnitLabel({ unidad: 'unidad', quantity: 1 }, es)).toBe('unidad'));
  it('unidad 2 → 2 unidades', () =>
    expect(formatUnitLabel({ unidad: 'unidad', quantity: 2 }, es)).toBe('2 unidades'));
  it('litro 1 → litro', () =>
    expect(formatUnitLabel({ unidad: 'litro', quantity: 1 }, es)).toBe('litro'));
  it('litro 2 → 2 litros', () =>
    expect(formatUnitLabel({ unidad: 'litro', quantity: 2 }, es)).toBe('2 litros'));
  it('paquete 3 → 3 paquetes', () =>
    expect(formatUnitLabel({ unidad: 'paquete', quantity: 3 }, es)).toBe('3 paquetes'));
  it('caja 2 → 2 cajas', () =>
    expect(formatUnitLabel({ unidad: 'caja', quantity: 2 }, es)).toBe('2 cajas'));
  it('botella 10 → 10 botellas', () =>
    expect(formatUnitLabel({ unidad: 'botella', quantity: 10 }, es)).toBe('10 botellas'));
  it('lata 6 → 6 latas', () =>
    expect(formatUnitLabel({ unidad: 'lata', quantity: 6 }, es)).toBe('6 latas'));

  // No contables
  it('kg 1 → kg', () =>
    expect(formatUnitLabel({ unidad: 'kg', quantity: 1 }, es)).toBe('kg'));
  it('kg 2 → 2 kg', () =>
    expect(formatUnitLabel({ unidad: 'kg', quantity: 2 }, es)).toBe('2 kg'));
  it('kg 0.5 → 0.5 kg', () =>
    expect(formatUnitLabel({ unidad: 'kg', quantity: 0.5 }, es)).toBe('0.5 kg'));
  it('g 500 → 500 g', () =>
    expect(formatUnitLabel({ unidad: 'g', quantity: 500 }, es)).toBe('500 g'));
  it('ml 250 → 250 ml', () =>
    expect(formatUnitLabel({ unidad: 'ml', quantity: 250 }, es)).toBe('250 ml'));
  it('lb 3 → 3 lb', () =>
    expect(formatUnitLabel({ unidad: 'lb', quantity: 3 }, es)).toBe('3 lb'));
  it('oz 16 → 16 oz', () =>
    expect(formatUnitLabel({ unidad: 'oz', quantity: 16 }, es)).toBe('16 oz'));

  // Unificación l → litro
  it('l 1 → litro', () =>
    expect(formatUnitLabel({ unidad: 'l', quantity: 1 }, es)).toBe('litro'));
  it('l 2 → 2 litros', () =>
    expect(formatUnitLabel({ unidad: 'l', quantity: 2 }, es)).toBe('2 litros'));

  // Default quantity default 1 cuando falta
  it('unidad sin quantity → unidad (no vacío)', () =>
    expect(formatUnitLabel({ unidad: 'unidad' }, es)).toBe('unidad'));
  it('kg sin quantity → kg', () =>
    expect(formatUnitLabel({ unidad: 'kg' }, es)).toBe('kg'));
});

// =========================================================================
// formatUnitLabel EN
// =========================================================================
describe('formatUnitLabel EN', () => {
  const en = buildTranslatorEn();

  it('unidad 1 → unit', () =>
    expect(formatUnitLabel({ unidad: 'unidad', quantity: 1 }, en)).toBe('unit'));
  it('unidad 2 → 2 units', () =>
    expect(formatUnitLabel({ unidad: 'unidad', quantity: 2 }, en)).toBe('2 units'));
  it('litro 1 → liter', () =>
    expect(formatUnitLabel({ unidad: 'litro', quantity: 1 }, en)).toBe('liter'));
  it('litro 2 → 2 liters', () =>
    expect(formatUnitLabel({ unidad: 'litro', quantity: 2 }, en)).toBe('2 liters'));
  it('paquete 3 → 3 packs', () =>
    expect(formatUnitLabel({ unidad: 'paquete', quantity: 3 }, en)).toBe('3 packs'));
  it('caja 2 → 2 boxes', () =>
    expect(formatUnitLabel({ unidad: 'caja', quantity: 2 }, en)).toBe('2 boxes'));
  it('botella 5 → 5 bottles', () =>
    expect(formatUnitLabel({ unidad: 'botella', quantity: 5 }, en)).toBe('5 bottles'));
  it('lata 6 → 6 cans', () =>
    expect(formatUnitLabel({ unidad: 'lata', quantity: 6 }, en)).toBe('6 cans'));

  it('l 1 → liter; l 2 → 2 liters (EN unificación)', () => {
    expect(formatUnitLabel({ unidad: 'l', quantity: 1 }, en)).toBe('liter');
    expect(formatUnitLabel({ unidad: 'l', quantity: 2 }, en)).toBe('2 liters');
  });
});

// =========================================================================
// formatProductPrice
// =========================================================================
describe('formatProductPrice ES', () => {
  const es = buildTranslatorEs();

  it('100 + unidad + 1 → Precio: $100 / unidad', () => {
    expect(formatProductPrice(inputLike({ unidad: 'unidad', quantity: 1 }), es))
      .toBe('Precio: $100 / unidad');
  });
  it('100 + unidad + 2 → Precio: $100 / 2 unidades', () => {
    expect(formatProductPrice(inputLike({ unidad: 'unidad', quantity: 2 }), es))
      .toBe('Precio: $100 / 2 unidades');
  });
  it('100 + kg + 0.5 → Precio: $100 / 0.5 kg', () => {
    expect(formatProductPrice(inputLike({ unidad: 'kg', quantity: 0.5 }), es))
      .toBe('Precio: $100 / 0.5 kg');
  });
  it('100 + kg + 2 → Precio: $100 / 2 kg', () => {
    expect(formatProductPrice(inputLike({ unidad: 'kg', quantity: 2 }), es))
      .toBe('Precio: $100 / 2 kg');
  });
  it('100 + g + 500 → Precio: $100 / 500 g', () => {
    expect(formatProductPrice(inputLike({ unidad: 'g', quantity: 500 }), es))
      .toBe('Precio: $100 / 500 g');
  });
  it('100 sin unidad → Precio: $100', () => {
    expect(formatProductPrice(inputLike({}), es)).toBe('Precio: $100');
  });
  it('100 + litro + 2 → Precio: $100 / 2 litros', () => {
    expect(formatProductPrice(inputLike({ unidad: 'litro', quantity: 2 }), es))
      .toBe('Precio: $100 / 2 litros');
  });
});

describe('formatProductPrice — regresiones críticas', () => {
  const es = buildTranslatorEs();

  it('nunca trailing "/" cuando no hay unidad', () => {
    const r = formatProductPrice(inputLike({}), es);
    expect(r).not.toMatch(/\/\s*$/);
    expect(r).toBe('Precio: $100');
  });
  it('nunca "undefined"', () => {
    const r = formatProductPrice(inputLike({ unidad: undefined, quantity: undefined }), es);
    expect(r).not.toContain('undefined');
  });
  it('nunca 1 unidad (qty 1 debe omitir "1")', () => {
    const r = formatProductPrice(inputLike({ unidad: 'unidad', quantity: 1 }), es);
    expect(r).not.toBe('Precio: $100 / 1 unidad');
    expect(r).toBe('Precio: $100 / unidad');
  });
  it('nunca "1 kg" (qty 1 no contable también sin "1")', () => {
    const r = formatProductPrice(inputLike({ unidad: 'kg', quantity: 1 }), es);
    expect(r).not.toBe('Precio: $100 / 1 kg');
    expect(r).toBe('Precio: $100 / kg');
  });
  it('unidad sin quantity → Precio: $100 / unidad', () => {
    const r = formatProductPrice(inputLike({ unidad: 'unidad' }), es);
    expect(r).toBe('Precio: $100 / unidad');
  });
});

describe('formatProductPrice — pricePrefix EN', () => {
  const en = buildTranslatorEn();
  it('prefijo "Price: " produce Price: $100 / 2 units', () => {
    const r = formatProductPrice(
      inputLike({ unidad: 'unidad', quantity: 2 }),
      en,
      { pricePrefix: 'Price: ' }
    );
    expect(r).toBe('Price: $100 / 2 units');
  });
});

// =========================================================================
// formatPricePerUnit — segunda línea ProductCard ($precio / unidad)
// =========================================================================
describe('formatPricePerUnit ES', () => {
  const es = buildTranslatorEs();

  it('90 + unidad + 1 → "$90 / unidad"', () => {
    expect(formatPricePerUnit(inputLike({ precio: 90, unidad: 'unidad', quantity: 1 }), es)).toBe(
      '$90 / unidad'
    );
  });
  it('90 + unidad + 2 → "$90 / 2 unidades"', () => {
    expect(formatPricePerUnit(inputLike({ precio: 90, unidad: 'unidad', quantity: 2 }), es)).toBe(
      '$90 / 2 unidades'
    );
  });
  it('80 + litro + 2 → "$80 / 2 litros"', () => {
    expect(formatPricePerUnit(inputLike({ precio: 80, unidad: 'litro', quantity: 2 }), es)).toBe(
      '$80 / 2 litros'
    );
  });
  it('250 + kg + 2 → "$250 / 2 kg"', () => {
    expect(formatPricePerUnit(inputLike({ precio: 250, unidad: 'kg', quantity: 2 }), es)).toBe(
      '$250 / 2 kg'
    );
  });
  it('15 + kg + 0.5 → "$15 / 0.5 kg"', () => {
    expect(formatPricePerUnit(inputLike({ precio: 15, unidad: 'kg', quantity: 0.5 }), es)).toBe(
      '$15 / 0.5 kg'
    );
  });
  it('90 + sin unidad → "" (oculta segunda línea)', () => {
    expect(formatPricePerUnit(inputLike({ precio: 90 }), es)).toBe('');
  });
  it('90 + unidad undefined quantity undefined → ""', () => {
    expect(formatPricePerUnit(inputLike({ precio: 90, unidad: undefined }), es)).toBe('');
  });
  it('precio con miles 33500.5 + kg → "$33,500.5 / kg"', () => {
    expect(formatPricePerUnit(inputLike({ precio: 33500.5, unidad: 'kg', quantity: 1 }), es)).toBe(
      '$33,500.5 / kg'
    );
  });
  it('precio con miles entero 1000 + unidad 1 → "$1,000 / unidad"', () => {
    expect(formatPricePerUnit(inputLike({ precio: 1000, unidad: 'unidad', quantity: 1 }), es)).toBe(
      '$1,000 / unidad'
    );
  });
  it('oferta: precio actual 80 + litro 2 → "$80 / 2 litros" (no oldPrice)', () => {
    expect(formatPricePerUnit(inputLike({ precio: 80, unidad: 'litro', quantity: 2 }), es)).toBe(
      '$80 / 2 litros'
    );
  });
  it('unidad sin quantity → "$90 / unidad" (quantity default 1)', () => {
    expect(formatPricePerUnit(inputLike({ precio: 90, unidad: 'unidad' }), es)).toBe('$90 / unidad');
  });
  it('kg sin quantity → "$90 / kg"', () => {
    expect(formatPricePerUnit(inputLike({ precio: 90, unidad: 'kg' }), es)).toBe('$90 / kg');
  });
  it('nunca trailing "/ " cuando no hay unidad', () => {
    const r = formatPricePerUnit(inputLike({ precio: 90 }), es);
    expect(r).not.toMatch(/\/\s*$/);
    expect(r).toBe('');
  });
  it('nunca "undefined"', () => {
    const r = formatPricePerUnit(inputLike({ precio: 90, unidad: undefined }), es);
    expect(r).not.toContain('undefined');
  });
});

describe('formatPricePerUnit EN', () => {
  const en = buildTranslatorEn();
  it('90 + unidad + 2 → "$90 / 2 units"', () => {
    expect(formatPricePerUnit(inputLike({ precio: 90, unidad: 'unidad', quantity: 2 }), en)).toBe(
      '$90 / 2 units'
    );
  });
  it('80 + litro + 2 → "$80 / 2 liters"', () => {
    expect(formatPricePerUnit(inputLike({ precio: 80, unidad: 'litro', quantity: 2 }), en)).toBe(
      '$80 / 2 liters'
    );
  });
});
