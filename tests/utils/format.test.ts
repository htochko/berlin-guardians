import { describe, expect, it } from 'vitest';
import { formatPrice } from '../../src/utils/format';

describe('formatPrice', () => {
  it('returns "Free" for zero', () => {
    expect(formatPrice(0)).toBe('Free');
  });

  it('formats cents as a price with two decimals', () => {
    expect(formatPrice(299)).toBe('€2.99');
    expect(formatPrice(100)).toBe('€1.00');
    expect(formatPrice(1999)).toBe('€19.99');
  });
});
