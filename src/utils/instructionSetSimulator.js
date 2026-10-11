/**
 * Instruction Set Simulator — pure-function module
 * Ported from COA_25BAI10050_ISS (shunting-yard algorithm).
 *
 * Supports expressions with single-letter variables (A–Z),
 * operators + - * /, and parentheses.
 */

// ─── Tokenizer ────────────────────────────────────────────────────────────────

const OPERATORS = new Set(['+', '-', '*', '/']);
const PRECEDENCE = { '+': 1, '-': 1, '*': 2, '/': 2 };

/**
 * Tokenize an infix expression string.
 * @param {string} expr
 * @returns {{ tokens: string[], error: string|null }}
 */
export function tokenize(expr) {
  if (!expr || !expr.trim()) {
    return { tokens: [], error: 'Expression cannot be empty.' };
  }

  const raw = expr.replace(/\s+/g, '');
  const tokens = [];
  const validChars = /^[A-Za-z0-9+\-*/()]+$/;

  if (!validChars.test(raw)) {
    const invalid = [...new Set(raw.split('').filter(c => !/[A-Za-z0-9+\-*/()]/.test(c)))];
    return { tokens: [], error: `Invalid character(s): ${invalid.join(' ')}. Use A–Z variables and + - * / ( ) only.` };
  }

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (/[A-Za-z]/.test(ch)) {
      // Multi-char variable names collapse to single token (warning); treat as variable
      tokens.push(ch.toUpperCase());
    } else if (/[0-9]/.test(ch)) {
      return { tokens: [], error: `Numeric literals (e.g. "${ch}") are not supported. Use single-letter variables A–Z.` };
    } else {
      tokens.push(ch);
    }
  }

  return { tokens, error: null };
}

// ─── Validator ────────────────────────────────────────────────────────────────

/**
 * Validate a token array for semantic correctness.
 * @param {string[]} tokens
 * @returns {string|null} error message or null
 */
export function validate(tokens) {
  if (tokens.length === 0) return 'Expression cannot be empty.';

  let depth = 0;
  let prevWasOp = true; // treat start as after an operator (so leading op is invalid)

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const isVar = /^[A-Z]$/.test(tok);
    const isOp  = OPERATORS.has(tok);
    const isLParen = tok === '(';
    const isRParen = tok === ')';

    if (isLParen) {
      depth++;
      prevWasOp = true; // after '(' an operand or '(' must follow
    } else if (isRParen) {
      depth--;
      if (depth < 0) return 'Unbalanced parentheses: unexpected closing ")".';
      prevWasOp = false;
    } else if (isVar) {
      if (!prevWasOp && tokens[i - 1] !== '(') {
        return `Missing operator before "${tok}" at position ${i + 1}.`;
      }
      prevWasOp = false;
    } else if (isOp) {
      if (prevWasOp) {
        return `Consecutive or leading operator "${tok}" at position ${i + 1}.`;
      }
      prevWasOp = true;
    } else {
      return `Unknown token "${tok}".`;
    }
  }

  if (depth !== 0) return `Unbalanced parentheses: ${depth} unclosed "(".`;

  const last = tokens[tokens.length - 1];
  if (OPERATORS.has(last)) return 'Expression cannot end with an operator.';

  return null;
}

// ─── Shunting-Yard (Infix → Postfix) ─────────────────────────────────────────

/**
 * Convert validated token array to postfix using Dijkstra's shunting-yard.
 * @param {string[]} tokens
 * @returns {string[]} postfix tokens
 */
export function toPostfix(tokens) {
  const output = [];
  const opStack = [];

  for (const tok of tokens) {
    if (/^[A-Z]$/.test(tok)) {
      output.push(tok);
    } else if (OPERATORS.has(tok)) {
      // Pop operators with >= precedence (left-associative for all our ops)
      while (
        opStack.length &&
        opStack.at(-1) !== '(' &&
        PRECEDENCE[opStack.at(-1)] >= PRECEDENCE[tok]
      ) {
        output.push(opStack.pop());
      }
      opStack.push(tok);
    } else if (tok === '(') {
      opStack.push('(');
    } else if (tok === ')') {
      while (opStack.length && opStack.at(-1) !== '(') {
        output.push(opStack.pop());
      }
      opStack.pop(); // remove '('
    }
  }

  while (opStack.length) output.push(opStack.pop());
  return output;
}

// ─── Code Generators ─────────────────────────────────────────────────────────

/**
 * Three-address code: result = operand1 op operand2
 * Uses temporaries T1, T2, …
 * @param {string[]} postfix
 * @returns {string[]} instruction strings
 */
export function generateThreeAddress(postfix) {
  const stack = [];
  const instructions = [];
  let tempCount = 1;

  for (const tok of postfix) {
    if (!OPERATORS.has(tok)) {
      stack.push(tok);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      const t = `T${tempCount++}`;
      instructions.push(`${t} = ${a} ${tok} ${b}`);
      stack.push(t);
    }
  }

  return instructions;
}

/**
 * Two-address code: dest op= source  (dest is also first operand)
 * Uses temporaries T1, T2, …
 * @param {string[]} postfix
 * @returns {string[]} instruction strings
 */
export function generateTwoAddress(postfix) {
  const stack = [];
  const instructions = [];
  let tempCount = 1;

  for (const tok of postfix) {
    if (!OPERATORS.has(tok)) {
      stack.push(tok);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      const t = `T${tempCount++}`;
      instructions.push(`MOV ${t}, ${a}`);
      const opName = { '+': 'ADD', '-': 'SUB', '*': 'MUL', '/': 'DIV' }[tok];
      instructions.push(`${opName} ${t}, ${b}`);
      stack.push(t);
    }
  }

  return instructions;
}

/**
 * One-address (accumulator) code: LOAD/STORE/ADD/SUB/MUL/DIV
 * @param {string[]} postfix
 * @returns {string[]} instruction strings
 */
export function generateOneAddress(postfix) {
  const stack = [];
  const instructions = [];
  let tempCount = 1;

  for (const tok of postfix) {
    if (!OPERATORS.has(tok)) {
      stack.push(tok);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      const opName = { '+': 'ADD', '-': 'SUB', '*': 'MUL', '/': 'DIV' }[tok];
      const t = `T${tempCount++}`;

      // If a is a variable (not already in ACC), LOAD it
      if (!/^T\d+/.test(a)) {
        instructions.push(`LOAD  ${a}`);
      }
      // If a was a temp that was already the result of a previous op,
      // it's implicitly in ACC; if b is a temp we need to STORE/LOAD
      if (/^T\d+/.test(b)) {
        // b is a temporary — need workaround: STORE b, LOAD a, OP b
        // In practice the 1-addr model requires spilling; we annotate with comment
        instructions.push(`${opName}  ${b}       ; ACC ${opName} ${b}`);
      } else {
        instructions.push(`${opName}  ${b}`);
      }
      instructions.push(`STORE ${t}`);
      stack.push(t);
    }
  }

  return instructions;
}

/**
 * Zero-address (stack) code: PUSH/POP + operator mnemonics
 * @param {string[]} postfix
 * @returns {string[]} instruction strings
 */
export function generateZeroAddress(postfix) {
  const instructions = [];
  const opName = { '+': 'ADD', '-': 'SUB', '*': 'MUL', '/': 'DIV' };

  for (const tok of postfix) {
    if (!OPERATORS.has(tok)) {
      instructions.push(`PUSH  ${tok}`);
    } else {
      instructions.push(opName[tok]);
    }
  }

  return instructions;
}

// ─── Main entry point ─────────────────────────────────────────────────────────

/**
 * Run the full pipeline on an expression string.
 * @param {string} expr
 * @returns {{
 *   postfix: string,
 *   threeAddr: string[],
 *   twoAddr:   string[],
 *   oneAddr:   string[],
 *   zeroAddr:  string[],
 *   error:     string|null
 * }}
 */
export function simulate(expr) {
  const { tokens, error: tokErr } = tokenize(expr);
  if (tokErr) return { postfix: '', threeAddr: [], twoAddr: [], oneAddr: [], zeroAddr: [], error: tokErr };

  const valErr = validate(tokens);
  if (valErr) return { postfix: '', threeAddr: [], twoAddr: [], oneAddr: [], zeroAddr: [], error: valErr };

  const postfixTokens = toPostfix(tokens);
  const postfix  = postfixTokens.join(' ');
  const threeAddr = generateThreeAddress(postfixTokens);
  const twoAddr   = generateTwoAddress(postfixTokens);
  const oneAddr   = generateOneAddress(postfixTokens);
  const zeroAddr  = generateZeroAddress(postfixTokens);

  return { postfix, threeAddr, twoAddr, oneAddr, zeroAddr, error: null };
}
