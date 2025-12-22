import {describe, expect, it} from 'vitest';
import {
  parseParsedAttributes,
  getAttributeValue,
  isAttributeApplicable,
  formatAttributeValue,
  buildAttributeFilterParam,
  parseAttributeFilterParam,
  buildAttributeSearchUrl,
  getNonNullAttributes,
  matchesFilters,
  PRODUCT_TYPES,
  FILTERABLE_ATTRIBUTES,
  ATTRIBUTE_LABELS,
  type ParsedAttributes,
} from '../../app/lib/parsed-attributes';

describe('parsed-attributes', () => {
  describe('PRODUCT_TYPES', () => {
    it('contains all expected product types', () => {
      expect(PRODUCT_TYPES.E_LIQUID).toBe('e-liquid');
      expect(PRODUCT_TYPES.DISPOSABLE_VAPE).toBe('disposable_vape');
      expect(PRODUCT_TYPES.POD_SYSTEM).toBe('pod_system');
      expect(PRODUCT_TYPES.CBD).toBe('cbd');
      expect(PRODUCT_TYPES.NICOTINE_POUCHES).toBe('nicotine_pouches');
    });
  });

  describe('FILTERABLE_ATTRIBUTES', () => {
    it('contains all expected attributes', () => {
      expect(FILTERABLE_ATTRIBUTES).toContain('product_type');
      expect(FILTERABLE_ATTRIBUTES).toContain('brand');
      expect(FILTERABLE_ATTRIBUTES).toContain('flavour_category');
      expect(FILTERABLE_ATTRIBUTES).toContain('nicotine_strength');
      expect(FILTERABLE_ATTRIBUTES).toContain('volume');
    });
  });

  describe('ATTRIBUTE_LABELS', () => {
    it('provides display labels for all attributes', () => {
      expect(ATTRIBUTE_LABELS.product_type).toBe('Product Type');
      expect(ATTRIBUTE_LABELS.brand).toBe('Brand');
      expect(ATTRIBUTE_LABELS.flavour_category).toBe('Flavour');
      expect(ATTRIBUTE_LABELS.nicotine_strength).toBe('Nicotine Strength');
    });
  });

  describe('parseParsedAttributes', () => {
    it('parses valid JSON string', () => {
      const json = JSON.stringify({
        product_type: 'e-liquid',
        brand: 'Test Brand',
        nicotine_strength: '20mg',
        flavours: ['strawberry', 'mint'],
      });

      const result = parseParsedAttributes(json);
      expect(result).toBeDefined();
      expect(result?.product_type).toBe('e-liquid');
      expect(result?.brand).toBe('Test Brand');
      expect(result?.flavours).toEqual(['strawberry', 'mint']);
    });

    it('returns null for null input', () => {
      expect(parseParsedAttributes(null)).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(parseParsedAttributes('')).toBeNull();
    });

    it('returns null for invalid JSON', () => {
      expect(parseParsedAttributes('not valid json')).toBeNull();
    });
  });

  describe('getAttributeValue', () => {
    const attributes: ParsedAttributes = {
      product_type: 'e-liquid',
      brand: 'Test Brand',
      flavours: ['fruity', 'ice'],
      flavour_category: 'fruity',
      nicotine_strength: '20mg',
      cbd_strength: null,
      cbd_type: null,
      cbd_form: null,
      device_type: null,
      volume: '10ml',
      capacity: null,
      pack_size: null,
      puff_count: null,
      battery_capacity: null,
      coil_resistance: null,
      material: null,
      color: null,
      size: null,
    };

    it('returns correct value for existing attribute', () => {
      expect(getAttributeValue(attributes, 'product_type')).toBe('e-liquid');
      expect(getAttributeValue(attributes, 'brand')).toBe('Test Brand');
      expect(getAttributeValue(attributes, 'volume')).toBe('10ml');
    });

    it('returns null for null attribute', () => {
      expect(getAttributeValue(attributes, 'cbd_strength')).toBeNull();
    });

    it('returns null for null attributes object', () => {
      expect(getAttributeValue(null, 'product_type')).toBeNull();
    });
  });

  describe('isAttributeApplicable', () => {
    it('returns true for universal attributes', () => {
      expect(isAttributeApplicable('brand', 'e-liquid')).toBe(true);
      expect(isAttributeApplicable('brand', 'disposable_vape')).toBe(true);
      expect(isAttributeApplicable('product_type', null)).toBe(true);
    });

    it('returns true for applicable attributes', () => {
      expect(isAttributeApplicable('nicotine_strength', 'e-liquid')).toBe(true);
      expect(isAttributeApplicable('cbd_strength', 'cbd')).toBe(true);
    });

    it('returns false for non-applicable attributes', () => {
      expect(isAttributeApplicable('cbd_strength', 'e-liquid')).toBe(false);
      expect(isAttributeApplicable('coil_resistance', 'e-liquid')).toBe(false);
    });
  });

  describe('formatAttributeValue', () => {
    it('formats underscored values', () => {
      expect(formatAttributeValue('disposable_vape')).toBe('Disposable Vape');
      expect(formatAttributeValue('pod_system')).toBe('Pod System');
    });

    it('formats hyphenated values', () => {
      expect(formatAttributeValue('full-spectrum')).toBe('Full Spectrum');
    });

    it('handles single word values', () => {
      expect(formatAttributeValue('fruity')).toBe('Fruity');
      expect(formatAttributeValue('ice')).toBe('Ice');
    });

    it('returns empty string for null', () => {
      expect(formatAttributeValue(null as any)).toBe('');
    });
  });

  describe('buildAttributeFilterParam and parseAttributeFilterParam', () => {
    it('builds and parses filter param correctly', () => {
      const param = buildAttributeFilterParam('product_type', 'e-liquid');
      expect(param).toBe('product_type:e-liquid');

      const parsed = parseAttributeFilterParam(param);
      expect(parsed).toEqual({attribute: 'product_type', value: 'e-liquid'});
    });

    it('handles special characters in value', () => {
      const param = buildAttributeFilterParam('flavour_category', 'desserts/bakery');
      const parsed = parseAttributeFilterParam(param);
      expect(parsed?.value).toBe('desserts/bakery');
    });

    it('returns null for invalid param', () => {
      expect(parseAttributeFilterParam('nocolon')).toBeNull();
      expect(parseAttributeFilterParam('unknown:value')).toBeNull();
    });
  });

  describe('buildAttributeSearchUrl', () => {
    it('builds URL with single filter', () => {
      const url = buildAttributeSearchUrl({product_type: 'e-liquid'});
      expect(url).toBe('/search?product_type=e-liquid');
    });

    it('builds URL with multiple filters', () => {
      const url = buildAttributeSearchUrl({
        product_type: 'e-liquid',
        nicotine_strength: '20mg',
      });
      expect(url).toContain('product_type=e-liquid');
      expect(url).toContain('nicotine_strength=20mg');
    });

    it('builds URL with array filter values', () => {
      const url = buildAttributeSearchUrl({
        flavour_category: ['fruity', 'ice'],
      });
      expect(url).toContain('flavour_category=fruity');
      expect(url).toContain('flavour_category=ice');
    });

    it('returns /search for empty filters', () => {
      expect(buildAttributeSearchUrl({})).toBe('/search');
    });
  });

  describe('getNonNullAttributes', () => {
    it('extracts only non-null attributes', () => {
      const attributes: ParsedAttributes = {
        product_type: 'e-liquid',
        brand: 'Test',
        flavours: [],
        flavour_category: 'fruity',
        nicotine_strength: null,
        cbd_strength: null,
        cbd_type: null,
        cbd_form: null,
        device_type: null,
        volume: '10ml',
        capacity: null,
        pack_size: null,
        puff_count: null,
        battery_capacity: null,
        coil_resistance: null,
        material: null,
        color: null,
        size: null,
      };

      const result = getNonNullAttributes(attributes);
      expect(result.product_type).toBe('e-liquid');
      expect(result.brand).toBe('Test');
      expect(result.volume).toBe('10ml');
      expect(result.flavour_category).toBe('fruity');
      expect(result.nicotine_strength).toBeUndefined();
      expect(result.flavours).toBeUndefined(); // Empty array excluded
    });

    it('returns empty object for null input', () => {
      expect(getNonNullAttributes(null)).toEqual({});
    });
  });

  describe('matchesFilters', () => {
    const attributes: ParsedAttributes = {
      product_type: 'e-liquid',
      brand: 'Test Brand',
      flavours: ['strawberry', 'mint'],
      flavour_category: 'fruity',
      nicotine_strength: '20mg',
      cbd_strength: null,
      cbd_type: null,
      cbd_form: null,
      device_type: null,
      volume: '10ml',
      capacity: null,
      pack_size: null,
      puff_count: null,
      battery_capacity: null,
      coil_resistance: null,
      material: null,
      color: null,
      size: null,
    };

    it('matches single filter', () => {
      expect(matchesFilters(attributes, {product_type: 'e-liquid'})).toBe(true);
      expect(matchesFilters(attributes, {product_type: 'disposable_vape'})).toBe(false);
    });

    it('matches multiple filters', () => {
      expect(matchesFilters(attributes, {
        product_type: 'e-liquid',
        nicotine_strength: '20mg',
      })).toBe(true);

      expect(matchesFilters(attributes, {
        product_type: 'e-liquid',
        nicotine_strength: '10mg',
      })).toBe(false);
    });

    it('matches array filter values', () => {
      expect(matchesFilters(attributes, {
        product_type: ['e-liquid', 'disposable_vape'],
      })).toBe(true);
    });

    it('matches array attribute values', () => {
      expect(matchesFilters(attributes, {
        flavour_category: 'fruity',
      })).toBe(true);
    });

    it('returns false for null attributes', () => {
      expect(matchesFilters(null, {product_type: 'e-liquid'})).toBe(false);
    });

    it('returns true for empty filters', () => {
      expect(matchesFilters(attributes, {})).toBe(true);
    });
  });
});
