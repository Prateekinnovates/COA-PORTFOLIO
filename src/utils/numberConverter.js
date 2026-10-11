/**
 * Number System Converter — pure-function module
 * Uses BigInt for integer conversion (no floating-point precision issues).
 * Supports bases 2–36.
 */

const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Validate that a base is in range 2–36.
 * @param {number} base
 * @returns {string|null} error or null
 */
export function validateBase(base) {
  const n = Number(base);
  if (!Number.isInteger(n) || n < 2 || n > 36) {
    return `Base must be an integer between 2 and 36 (got ${base}).`;
  }
  return null;
}

/**
 * Validate that a string value contains only valid digits for the given base.
 * @param {string} value
 * @param {number} base
 * @returns {string|null} error or null
 */
export function validateInput(value, base) {
  if (!value || !value.trim()) return 'Input value cannot be empty.';

  const baseErr = validateBase(base);
  if (baseErr) return baseErr;

  const validDigits = DIGITS.slice(0, base);
  const pattern = new RegExp(`^[${validDigits}]+$`, 'i');
  const clean = value.trim().replace(/^-/, ''); // allow leading minus for negative support note

  if (!pattern.test(clean)) {
    const invalid = [...new Set(clean.toUpperCase().split('').filter(c => !validDigits.includes(c)))];
    return `Invalid digit(s) for base ${base}: ${invalid.join(', ')}. Valid digits: ${validDigits.toLowerCase()}`;
  }
  return null;
}

/**
 * Convert a numeric string from one base to another.
 * Uses BigInt for integers — handles very large numbers.
 *
 * @param {string} value   - Input string (uppercase/lowercase accepted)
 * @param {number} fromBase - Source base (2–36)
 * @param {number} toBase   - Target base (2–36)
 * @returns {{ result: string, error: string|null }}
 */
export function convert(value, fromBase, toBase) {
  const fromErr = validateBase(fromBase);
  if (fromErr) return { result: '', error: fromErr };
  const toErr = validateBase(toBase);
  if (toErr) return { result: '', error: toErr };

  const inputErr = validateInput(value, fromBase);
  if (inputErr) return { result: '', error: inputErr };

  try {
    const clean = value.trim().toUpperCase();

    // Parse to BigInt decimal
    let decimal = 0n;
    const base = BigInt(fromBase);
    for (const ch of clean) {
      const digit = BigInt(DIGITS.indexOf(ch));
      decimal = decimal * base + digit;
    }

    // Convert to target base
    if (decimal === 0n) return { result: '0', error: null };

    const tb = BigInt(toBase);
    let result = '';
    let n = decimal;
    while (n > 0n) {
      result = DIGITS[Number(n % tb)] + result;
      n = n / tb;
    }

    return { result, error: null };
  } catch (e) {
    return { result: '', error: `Conversion failed: ${e.message}` };
  }
}

/**
 * Quick-reference table: decimal values 0–15 in bin/oct/dec/hex.
 * @returns {{ decimal: number, binary: string, octal: string, hex: string }[]}
 */
export function quickReferenceTable() {
  return Array.from({ length: 16 }, (_, i) => ({
    decimal: i,
    binary:  i.toString(2).padStart(4, '0'),
    octal:   i.toString(8),
    hex:     i.toString(16).toUpperCase(),
  }));
}
