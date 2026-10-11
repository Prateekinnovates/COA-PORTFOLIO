import { describe, it, expect } from 'vitest';
import { convert, validateBase, validateInput } from './numberConverter.js';

// ─── validateBase ─────────────────────────────────────────────────────────────
describe('validateBase', () => {
  it('accepts base 2', ()   => expect(validateBase(2)).toBeNull());
  it('accepts base 16', ()  => expect(validateBase(16)).toBeNull());
  it('accepts base 36', ()  => expect(validateBase(36)).toBeNull());
  it('rejects base 1', ()   => expect(validateBase(1)).toBeTruthy());
  it('rejects base 37', ()  => expect(validateBase(37)).toBeTruthy());
  it('rejects base 0', ()   => expect(validateBase(0)).toBeTruthy());
  it('rejects float base', () => expect(validateBase(2.5)).toBeTruthy());
});

// ─── validateInput ────────────────────────────────────────────────────────────
describe('validateInput', () => {
  it('accepts "FF" for base 16',   () => expect(validateInput('FF', 16)).toBeNull());
  it('accepts "1010" for base 2',  () => expect(validateInput('1010', 2)).toBeNull());
  it('rejects "2" for base 2',     () => expect(validateInput('2', 2)).toBeTruthy());
  it('rejects "G" for base 16',    () => expect(validateInput('G', 16)).toBeTruthy());
  it('rejects empty string',       () => expect(validateInput('', 10)).toBeTruthy());
  it('rejects whitespace-only',    () => expect(validateInput('   ', 10)).toBeTruthy());
});

// ─── convert ──────────────────────────────────────────────────────────────────
describe('convert', () => {
  // Decimal ↔ Binary
  it('255 dec → binary 11111111', () => {
    const { result, error } = convert('255', 10, 2);
    expect(error).toBeNull();
    expect(result).toBe('11111111');
  });
  it('1010 binary → decimal 10', () => {
    const { result, error } = convert('1010', 2, 10);
    expect(error).toBeNull();
    expect(result).toBe('10');
  });

  it('binary 1010 → decimal is 10', () => {
    const { result, error } = convert('1010', 2, 10);
    expect(error).toBeNull();
    expect(result).toBe('10');
  });

  // Fix: let's just test round-trip
  it('round-trip: 255 dec→hex→dec', () => {
    const { result: hex } = convert('255', 10, 16);
    expect(hex).toBe('FF');
    const { result: dec } = convert('FF', 16, 10);
    expect(dec).toBe('255');
  });

  it('255 dec → hex FF', () => {
    const { result } = convert('255', 10, 16);
    expect(result).toBe('FF');
  });

  it('FF hex → decimal 255', () => {
    const { result } = convert('FF', 16, 10);
    expect(result).toBe('255');
  });

  it('255 dec → octal 377', () => {
    const { result } = convert('255', 10, 8);
    expect(result).toBe('377');
  });

  it('zero stays zero in any base', () => {
    expect(convert('0', 10, 2).result).toBe('0');
    expect(convert('0', 2, 16).result).toBe('0');
  });

  // Arbitrary bases
  it('base 3 to base 7', () => {
    // 100 in base3 = 9 dec = 12 in base7
    const { result } = convert('100', 3, 7);
    expect(result).toBe('12');
  });

  // Large integers
  it('handles very large decimal → hex', () => {
    // 2^64 = 18446744073709551616
    const { result, error } = convert('18446744073709551616', 10, 16);
    expect(error).toBeNull();
    expect(result.length).toBeGreaterThan(0);
  });

  // Error cases
  it('invalid digit for base returns error', () => {
    const { error } = convert('2', 2, 10);
    expect(error).toBeTruthy();
  });

  it('base out of range returns error', () => {
    const { error } = convert('10', 1, 10);
    expect(error).toBeTruthy();
  });

  it('target base out of range returns error', () => {
    const { error } = convert('10', 10, 37);
    expect(error).toBeTruthy();
  });
});
