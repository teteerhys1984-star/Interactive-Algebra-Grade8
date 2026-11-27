import { parseExactRational } from '../tests/scoring';

export interface RationalValue {
  numerator: bigint;
  denominator: bigint;
}

export interface LinearForm {
  /** Coefficient of the variable (a in a*x + b). */
  a: RationalValue;
  /** Constant term (b in a*x + b). */
  b: RationalValue;
}

export type GradeFailureReason =
  | 'empty'
  | 'invalid-number'
  | 'wrong-variable'
  | 'wrong-value'
  | 'missing-equals'
  | 'unexpected-equals'
  | 'invalid-expression'
  | 'nonlinear'
  | 'not-in-variable'
  | 'already-solved';

export interface GradeResult {
  ok: boolean;
  reason?: GradeFailureReason;
}

const ZERO: RationalValue = { numerator: 0n, denominator: 1n };
const ONE: RationalValue = { numerator: 1n, denominator: 1n };

const absBig = (v: bigint): bigint => (v < 0n ? -v : v);

function gcdBig(x: bigint, y: bigint): bigint {
  let a = absBig(x);
  let b = absBig(y);
  while (b !== 0n) {
    const r = a % b;
    a = b;
    b = r;
  }
  return a === 0n ? 1n : a;
}

export function makeExactRational(numerator: bigint, denominator: bigint): RationalValue | null {
  if (denominator === 0n) return null;
  const sign = denominator < 0n ? -1n : 1n;
  const num = numerator * sign;
  const den = absBig(denominator);
  const g = gcdBig(num, den);
  return { numerator: num / g, denominator: den / g };
}

export function rationalEquals(left: RationalValue, right: RationalValue): boolean {
  return left.numerator === right.numerator && left.denominator === right.denominator;
}

function addR(x: RationalValue, y: RationalValue): RationalValue {
  return makeExactRational(
    x.numerator * y.denominator + y.numerator * x.denominator,
    x.denominator * y.denominator,
  )!;
}

function subR(x: RationalValue, y: RationalValue): RationalValue {
  return makeExactRational(
    x.numerator * y.denominator - y.numerator * x.denominator,
    x.denominator * y.denominator,
  )!;
}

function mulR(x: RationalValue, y: RationalValue): RationalValue {
  return makeExactRational(x.numerator * y.numerator, x.denominator * y.denominator)!;
}

function divR(x: RationalValue, y: RationalValue): RationalValue | null {
  if (y.numerator === 0n) return null;
  return makeExactRational(x.numerator * y.denominator, x.denominator * y.numerator);
}

/** Normalizes digits, minus signs, division/multiplication glyphs, and simple LaTeX fractions. */
export function normalizeMathText(raw: string): string {
  let text = (raw ?? '')
    .normalize('NFKC')
    .trim()
    .replace(/\$/g, '')
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\u2212\u2013\u2014\ufe63\uff0d]/g, '-')
    .replace(/[×⋅·]/g, '*')
    .replace(/[÷⁄∕]/g, '/')
    .replace(/[٫،]/g, '.')
    .replace(/(\d),(?=\d{3}(?!\d))/g, '$1')
    .replace(/(\d),(?=\d{1,2}(?!\d))/g, '$1.')
    .replace(/\\left|\\right|\\,|\\;|\\!|\\quad|\\qquad/g, '')
    .replace(/\\times/g, '*')
    .replace(/\\div/g, '/');

  // Expand simple \frac{a}{b} forms iteratively so LaTeX inputs work seamlessly.
  for (let i = 0; i < 5 && /\\d?frac\s*\{/.test(text); i += 1) {
    text = text.replace(/\\d?frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '(($1)/($2))');
  }

  return text.replace(/\s+/g, '');
}

/**
 * Parses a rational literal including parenthesized signed forms such as
 * `-(13/3)`, `(-13)/3`, `13/(-3)`, `(-7)`, `-1.25`, `29/5`.
 */
export function parseFlexibleRational(raw: string): RationalValue | null {
  let s = normalizeMathText(raw);
  if (!s) return null;

  // Strip balanced outer parentheses, propagating leading +/- signs.
  let signFlip = 1n;
  let changed = true;
  while (changed) {
    changed = false;
    if (s.startsWith('+')) {
      s = s.slice(1);
      changed = true;
    } else if (s.startsWith('-(') && s.endsWith(')') && isOuterBalanced(s.slice(1))) {
      signFlip = -signFlip;
      s = s.slice(2, -1);
      changed = true;
    } else if (s.startsWith('(') && s.endsWith(')') && isOuterBalanced(s)) {
      s = s.slice(1, -1);
      changed = true;
    }
  }

  // Handle parenthesized numerator/denominator like (-13)/3 or 13/(-3)
  const slashIdx = findTopLevelSlash(s);
  if (slashIdx !== -1) {
    const leftPart = stripSimpleParens(s.slice(0, slashIdx));
    const rightPart = stripSimpleParens(s.slice(slashIdx + 1));
    if (/^[+-]?\d+$/.test(leftPart) && /^[+-]?\d+$/.test(rightPart)) {
      const r = makeExactRational(BigInt(leftPart) * signFlip, BigInt(rightPart));
      return r;
    }
  }

  const direct = parseExactRational(s);
  if (!direct) return null;
  return makeExactRational(direct.numerator * signFlip, direct.denominator);
}

function isOuterBalanced(str: string): boolean {
  if (!str.startsWith('(') || !str.endsWith(')')) return false;
  let depth = 0;
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === '(') depth += 1;
    else if (str[i] === ')') {
      depth -= 1;
      if (depth === 0 && i < str.length - 1) return false;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
}

function findTopLevelSlash(str: string): number {
  let depth = 0;
  let found = -1;
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === '(') depth += 1;
    else if (str[i] === ')') depth -= 1;
    else if (str[i] === '/' && depth === 0) {
      if (found !== -1) return -1;
      found = i;
    }
  }
  return found;
}

function stripSimpleParens(str: string): string {
  let out = str;
  while (out.startsWith('(') && out.endsWith(')') && isOuterBalanced(out)) {
    out = out.slice(1, -1);
  }
  return out;
}

/**
 * Grades a numeric / rational / equation-solution response.
 * Accepts exact integers, decimals, simplified or equivalent fractions, and
 * optional variable assignment (`a = 29/5`, `29/5 = a`) when `variable` is set.
 */
export function gradeRationalInput(
  raw: string,
  expectedRational: string,
  options?: { variable?: string },
): GradeResult {
  const cleaned = normalizeMathText(raw);
  if (!cleaned) return { ok: false, reason: 'empty' };

  const expected = parseFlexibleRational(expectedRational);
  if (!expected) return { ok: false, reason: 'invalid-number' };

  let candidate = cleaned;
  if (cleaned.includes('=')) {
    const parts = cleaned.split('=');
    if (parts.length !== 2) return { ok: false, reason: 'invalid-number' };
    const [lhs, rhs] = parts;
    const targetVar = options?.variable?.toLowerCase();
    if (/^[a-zA-Z]$/.test(lhs)) {
      if (targetVar && lhs.toLowerCase() !== targetVar) {
        return { ok: false, reason: 'wrong-variable' };
      }
      candidate = rhs;
    } else if (/^[a-zA-Z]$/.test(rhs)) {
      if (targetVar && rhs.toLowerCase() !== targetVar) {
        return { ok: false, reason: 'wrong-variable' };
      }
      candidate = lhs;
    } else {
      return { ok: false, reason: 'invalid-number' };
    }
  }

  const parsed = parseFlexibleRational(candidate);
  if (!parsed) return { ok: false, reason: 'invalid-number' };

  return rationalEquals(parsed, expected)
    ? { ok: true }
    : { ok: false, reason: 'wrong-value' };
}

/* ==========================================================================
   Exact Rational Linear Expression & Equation Parser (a*x + b)
   ========================================================================== */

type Token =
  | { type: 'num'; value: RationalValue }
  | { type: 'var' }
  | { type: 'op'; op: '+' | '-' | '*' | '/' }
  | { type: 'lparen' }
  | { type: 'rparen' };

function tokenizeLinear(expr: string, variable: string): { tokens?: Token[]; error?: GradeFailureReason } {
  const varChar = variable.toLowerCase();
  const s = normalizeMathText(expr).toLowerCase();
  if (!s) return { error: 'empty' };
  if (s.includes('=')) return { error: 'unexpected-equals' };

  const rawTokens: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch >= '0' && ch <= '9' || ch === '.') {
      let j = i;
      let dotCount = 0;
      while (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) {
        if (s[j] === '.') dotCount += 1;
        j += 1;
      }
      if (dotCount > 1) return { error: 'invalid-expression' };
      const lit = s.slice(i, j);
      const val = parseExactRational(lit);
      if (!val) return { error: 'invalid-expression' };
      rawTokens.push({ type: 'num', value: val });
      i = j;
    } else if (ch >= 'a' && ch <= 'z') {
      if (ch !== varChar) return { error: 'wrong-variable' };
      rawTokens.push({ type: 'var' });
      i += 1;
    } else if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      rawTokens.push({ type: 'op', op: ch });
      i += 1;
    } else if (ch === '(') {
      rawTokens.push({ type: 'lparen' });
      i += 1;
    } else if (ch === ')') {
      rawTokens.push({ type: 'rparen' });
      i += 1;
    } else {
      return { error: 'invalid-expression' };
    }
  }

  // Insert implicit multiplication ONLY in unambiguous algebraic juxtapositions:
  // num followed by var or '(', ')' followed by num/var/'(', var followed by '(' or num.
  const tokens: Token[] = [];
  for (let k = 0; k < rawTokens.length; k += 1) {
    const prev = tokens[tokens.length - 1];
    const curr = rawTokens[k];
    if (prev) {
      const prevIsAtomEnd = prev.type === 'num' || prev.type === 'var' || prev.type === 'rparen';
      const currIsAtomStart = curr.type === 'num' || curr.type === 'var' || curr.type === 'lparen';
      // Note: num followed immediately by num cannot happen from tokenizer, and we allow
      // standard algebraic juxtaposition such as 3x, 2(x+15), (x+15)2, (3/2)x.
      if (prevIsAtomEnd && currIsAtomStart && !(prev.type === 'num' && curr.type === 'num')) {
        tokens.push({ type: 'op', op: '*' });
      }
    }
    tokens.push(curr);
  }

  return { tokens };
}

export function parseLinearExpression(
  raw: string,
  variable = 'x',
): { form?: LinearForm; error?: GradeFailureReason } {
  const tok = tokenizeLinear(raw, variable);
  if (!tok.tokens) return { error: tok.error ?? 'invalid-expression' };
  const tokens = tok.tokens;
  let pos = 0;

  const parseExpr = (): { form?: LinearForm; error?: GradeFailureReason } => {
    const first = parseTerm();
    if (!first.form) return first;
    let current: LinearForm = first.form;
    while (pos < tokens.length) {
      const t = tokens[pos];
      if (t.type === 'op' && (t.op === '+' || t.op === '-')) {
        pos += 1;
        const right = parseTerm();
        if (!right.form) return right;
        current =
          t.op === '+'
            ? { a: addR(current.a, right.form.a), b: addR(current.b, right.form.b) }
            : { a: subR(current.a, right.form.a), b: subR(current.b, right.form.b) };
      } else {
        break;
      }
    }
    return { form: current };
  };

  const parseTerm = (): { form?: LinearForm; error?: GradeFailureReason } => {
    const first = parseFactor();
    if (!first.form) return first;
    let current: LinearForm = first.form;
    while (pos < tokens.length) {
      const t = tokens[pos];
      if (t.type === 'op' && (t.op === '*' || t.op === '/')) {
        pos += 1;
        const right = parseFactor();
        if (!right.form) return right;
        if (t.op === '*') {
          // Product is linear iff at least one factor has a === 0.
          if (current.a.numerator !== 0n && right.form.a.numerator !== 0n) {
            return { error: 'nonlinear' };
          }
          if (current.a.numerator === 0n) {
            const c = current.b;
            current = { a: mulR(c, right.form.a), b: mulR(c, right.form.b) };
          } else {
            const c = right.form.b;
            current = { a: mulR(current.a, c), b: mulR(current.b, c) };
          }
        } else {
          // Division is linear iff divisor is a non-zero constant.
          if (right.form.a.numerator !== 0n) return { error: 'nonlinear' };
          const nextA = divR(current.a, right.form.b);
          const nextB = divR(current.b, right.form.b);
          if (!nextA || !nextB) return { error: 'invalid-expression' };
          current = { a: nextA, b: nextB };
        }
      } else {
        break;
      }
    }
    return { form: current };
  };

  const parseFactor = (): { form?: LinearForm; error?: GradeFailureReason } => {
    if (pos >= tokens.length) return { error: 'invalid-expression' };
    const t = tokens[pos];
    if (t.type === 'op' && (t.op === '+' || t.op === '-')) {
      pos += 1;
      const inner = parseFactor();
      if (!inner.form) return inner;
      if (t.op === '+') return inner;
      return {
        form: {
          a: makeExactRational(-inner.form.a.numerator, inner.form.a.denominator)!,
          b: makeExactRational(-inner.form.b.numerator, inner.form.b.denominator)!,
        },
      };
    }
    if (t.type === 'num') {
      pos += 1;
      return { form: { a: ZERO, b: t.value } };
    }
    if (t.type === 'var') {
      pos += 1;
      return { form: { a: ONE, b: ZERO } };
    }
    if (t.type === 'lparen') {
      pos += 1;
      const inner = parseExpr();
      if (!inner.form) return inner;
      if (pos >= tokens.length || tokens[pos].type !== 'rparen') {
        return { error: 'invalid-expression' };
      }
      pos += 1;
      return inner;
    }
    return { error: 'invalid-expression' };
  };

  const result = parseExpr();
  if (!result.form) return result;
  if (pos !== tokens.length) return { error: 'invalid-expression' };
  return result;
}

/** Grades an algebraic linear expression (e.g., `1.5x`, `3x/2`, `5(10-x)/2`, `25 - 2.5x`). */
export function gradeLinearExpression(
  raw: string,
  expectedExpr: string,
  variable = 'x',
): GradeResult {
  const expected = parseLinearExpression(expectedExpr, variable);
  if (!expected.form) return { ok: false, reason: 'invalid-expression' };

  const actual = parseLinearExpression(raw, variable);
  if (!actual.form) return { ok: false, reason: actual.error ?? 'invalid-expression' };

  const same =
    rationalEquals(actual.form.a, expected.form.a) &&
    rationalEquals(actual.form.b, expected.form.b);
  return same ? { ok: true } : { ok: false, reason: 'wrong-value' };
}

/**
 * Grades a linear modeling equation `LHS = RHS` against one or more accepted
 * reference equations (e.g., `2(x + 15) = 44`, `1.5x = 25 - 2.5x`).
 * Ensures both sides are valid linear expressions, the unknown is non-degenerate,
 * the root matches the reference equation's exact rational root, and (by default)
 * rejects already-isolated answers like `x = 7` when the task asks to form the equation.
 */
export function gradeLinearEquation(
  raw: string,
  acceptedEquations: string | string[],
  variable = 'x',
  options?: { forbidIsolatedVariable?: boolean },
): GradeResult {
  const cleaned = normalizeMathText(raw);
  if (!cleaned) return { ok: false, reason: 'empty' };

  const parts = cleaned.split('=');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { ok: false, reason: 'missing-equals' };
  }

  const lhs = parseLinearExpression(parts[0], variable);
  if (!lhs.form) return { ok: false, reason: lhs.error ?? 'invalid-expression' };
  const rhs = parseLinearExpression(parts[1], variable);
  if (!rhs.form) return { ok: false, reason: rhs.error ?? 'invalid-expression' };

  const netA = subR(lhs.form.a, rhs.form.a);
  const netB = subR(lhs.form.b, rhs.form.b);
  if (netA.numerator === 0n) {
    return { ok: false, reason: 'not-in-variable' };
  }

  const actualRoot = divR(makeExactRational(-netB.numerator, netB.denominator)!, netA);
  if (!actualRoot) return { ok: false, reason: 'not-in-variable' };

  const forbidIsolated = options?.forbidIsolatedVariable ?? true;
  if (forbidIsolated) {
    const lhsIsBareVar =
      rationalEquals(lhs.form.a, ONE) &&
      rationalEquals(lhs.form.b, ZERO) &&
      rhs.form.a.numerator === 0n &&
      /^[+]?[a-zA-Z]$/.test(parts[0]);
    const rhsIsBareVar =
      rationalEquals(rhs.form.a, ONE) &&
      rationalEquals(rhs.form.b, ZERO) &&
      lhs.form.a.numerator === 0n &&
      /^[+]?[a-zA-Z]$/.test(parts[1]);
    if (lhsIsBareVar || rhsIsBareVar) {
      return { ok: false, reason: 'already-solved' };
    }
  }

  const refList = Array.isArray(acceptedEquations) ? acceptedEquations : [acceptedEquations];
  for (const refEq of refList) {
    const refParts = normalizeMathText(refEq).split('=');
    if (refParts.length !== 2) continue;
    const refL = parseLinearExpression(refParts[0], variable);
    const refR = parseLinearExpression(refParts[1], variable);
    if (!refL.form || !refR.form) continue;
    const refNetA = subR(refL.form.a, refR.form.a);
    const refNetB = subR(refL.form.b, refR.form.b);
    const refRoot = divR(makeExactRational(-refNetB.numerator, refNetB.denominator)!, refNetA);
    if (refRoot && rationalEquals(actualRoot, refRoot)) {
      return { ok: true };
    }
  }

  return { ok: false, reason: 'wrong-value' };
}

/** Grades a 4-node cycle diagram (`[top, right, bottom, left]`) using exact rationals. */
export function gradeCycleNodes(
  inputs: readonly string[],
  expected: readonly string[],
): { ok: boolean; cellOk: boolean[]; hasEmpty: boolean; hasInvalid: boolean } {
  let hasEmpty = false;
  let hasInvalid = false;
  const cellOk = expected.map((exp, idx) => {
    const res = gradeRationalInput(inputs[idx] ?? '', exp);
    if (res.reason === 'empty') hasEmpty = true;
    else if (res.reason === 'invalid-number') hasInvalid = true;
    return res.ok;
  });
  return {
    ok: cellOk.length === expected.length && cellOk.every(Boolean),
    cellOk,
    hasEmpty,
    hasInvalid,
  };
}
