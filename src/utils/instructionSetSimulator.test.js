import { describe, it, expect } from 'vitest';
import {
  tokenize,
  validate,
  toPostfix,
  generateThreeAddress,
  generateZeroAddress,
  simulate,
} from './instructionSetSimulator.js';

// ─── tokenize ─────────────────────────────────────────────────────────────────
describe('tokenize', () => {
  it('tokenizes a simple expression', () => {
    const { tokens, error } = tokenize('A + B');
    expect(error).toBeNull();
    expect(tokens).toEqual(['A', '+', 'B']);
  });

  it('uppercases variables', () => {
    const { tokens } = tokenize('a + b');
    expect(tokens).toEqual(['A', '+', 'B']);
  });

  it('rejects invalid characters', () => {
    const { error } = tokenize('A + @B');
    expect(error).toMatch(/Invalid character/);
  });

  it('rejects numeric literals', () => {
    const { error } = tokenize('A + 3');
    expect(error).toMatch(/Numeric/);
  });

  it('returns error for empty input', () => {
    const { error } = tokenize('');
    expect(error).toBeTruthy();
    const { error: e2 } = tokenize('   ');
    expect(e2).toBeTruthy();
  });
});

// ─── validate ─────────────────────────────────────────────────────────────────
describe('validate', () => {
  it('accepts valid expression', () => {
    const { tokens } = tokenize('A + B * (C - D)');
    expect(validate(tokens)).toBeNull();
  });

  it('rejects consecutive operators', () => {
    const { tokens } = tokenize('A ++ B');
    expect(validate(tokens)).toMatch(/operator/i);
  });

  it('rejects leading operator', () => {
    const { tokens } = tokenize('+ A');
    expect(validate(tokens)).toMatch(/operator/i);
  });

  it('rejects trailing operator', () => {
    const { tokens } = tokenize('A +');
    expect(validate(tokens)).toMatch(/operator/i);
  });

  it('rejects unbalanced opening paren', () => {
    const { tokens } = tokenize('(A + B');
    expect(validate(tokens)).toMatch(/paren/i);
  });

  it('rejects unbalanced closing paren', () => {
    const { tokens } = tokenize('A + B)');
    expect(validate(tokens)).toMatch(/paren/i);
  });
});

// ─── toPostfix ────────────────────────────────────────────────────────────────
describe('toPostfix', () => {
  const pf = expr => {
    const { tokens } = tokenize(expr);
    return toPostfix(tokens).join(' ');
  };

  it('A + B * (C - D) → A B C D - * +', () => {
    expect(pf('A + B * (C - D)')).toBe('A B C D - * +');
  });

  it('left-associativity: A - B - C → A B - C -', () => {
    expect(pf('A - B - C')).toBe('A B - C -');
  });

  it('precedence: A + B * C → A B C * +', () => {
    expect(pf('A + B * C')).toBe('A B C * +');
  });

  it('nested parens: (A + B) * (C + D) → A B + C D + *', () => {
    expect(pf('(A + B) * (C + D)')).toBe('A B + C D + *');
  });

  it('single variable: A → A', () => {
    expect(pf('A')).toBe('A');
  });
});

// ─── generateThreeAddress ─────────────────────────────────────────────────────
describe('generateThreeAddress', () => {
  it('A + B → T1 = A + B', () => {
    const { tokens } = tokenize('A + B');
    const pf = toPostfix(tokens);
    const code = generateThreeAddress(pf);
    expect(code).toEqual(['T1 = A + B']);
  });

  it('A + B * (C - D) produces 3 instructions', () => {
    const { tokens } = tokenize('A + B * (C - D)');
    const pf = toPostfix(tokens);
    const code = generateThreeAddress(pf);
    expect(code.length).toBe(3);
    expect(code[0]).toContain('C - D');
    expect(code[1]).toContain('B * T1');
    expect(code[2]).toContain('A + T2');
  });
});

// ─── generateZeroAddress ──────────────────────────────────────────────────────
describe('generateZeroAddress', () => {
  it('A + B → PUSH A, PUSH B, ADD', () => {
    const { tokens } = tokenize('A + B');
    const pf = toPostfix(tokens);
    const code = generateZeroAddress(pf);
    expect(code).toEqual(['PUSH  A', 'PUSH  B', 'ADD']);
  });
});

// ─── simulate (integration) ───────────────────────────────────────────────────
describe('simulate', () => {
  it('full pipeline A + B * (C - D)', () => {
    const result = simulate('A + B * (C - D)');
    expect(result.error).toBeNull();
    expect(result.postfix).toBe('A B C D - * +');
    expect(result.threeAddr.length).toBe(3);
    expect(result.twoAddr.length).toBeGreaterThan(0);
    expect(result.oneAddr.length).toBeGreaterThan(0);
    expect(result.zeroAddr.length).toBeGreaterThan(0);
  });

  it('returns error for invalid expression', () => {
    const { error } = simulate('A ++ B');
    expect(error).toBeTruthy();
  });

  it('returns error for empty expression', () => {
    const { error } = simulate('');
    expect(error).toBeTruthy();
  });

  it('left-assoc A - B - C', () => {
    const result = simulate('A - B - C');
    expect(result.error).toBeNull();
    expect(result.postfix).toBe('A B - C -');
  });
});
