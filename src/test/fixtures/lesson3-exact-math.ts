import katex from 'katex';

/** Independent TEST-ONLY BigInt arithmetic. Never imports the application's power helpers. */
export interface Rational { n: bigint; d: bigint }
const gcd = (a: bigint, b: bigint): bigint => b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b);
export const rational = (n: bigint | number, d: bigint | number = 1): Rational => {
  const numerator = BigInt(n), denominator = BigInt(d);
  if (denominator === 0n) throw new RangeError('Undefined rational');
  const sign = denominator < 0n ? -1n : 1n;
  const divisor = gcd(numerator, denominator) || 1n;
  return { n: numerator * sign / divisor, d: denominator * sign / divisor };
};
const add = (a: Rational, b: Rational) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
const multiply = (a: Rational, b: Rational) => rational(a.n * b.n, a.d * b.d);
const divide = (a: Rational, b: Rational) => rational(a.n * b.d, a.d * b.n);
export const exactPower = (a: Rational, exponent: number): Rational => {
  if (!Number.isSafeInteger(exponent) || (a.n === 0n && exponent <= 0)) throw new RangeError('Undefined power');
  const power = BigInt(Math.abs(exponent));
  return exponent >= 0 ? rational(a.n ** power, a.d ** power) : rational(a.d ** power, a.n ** power);
};
export const fromFractionText = (value: string): Rational => {
  const [n, d = '1'] = value.split('/');
  return rational(BigInt(n), BigInt(d));
};

/** A tiny recursive-descent parser for this lesson's numeric TeX, NOT eval().
 * Supports exact decimals, parentheses, implicit multiplication, fractions,
 * signed integer exponents, and the ordinary precedence of unary minus.
 * Unbraced TeX arguments consume one token: \\frac17 means 1/7, not 17.
 */
export function evaluateTex(input: string, variables: Record<string, number> = {}): Rational {
  const source = input
    .replace(/\\text\{[^}]*\}(?:\^(?:\{\d+\}|\d))?/g, '')
    .replace(/\\(?:left|right)/g, '')
    .replace(/\\(?:times|cdot)/g, '*').replace(/\\div/g, '/')
    .replace(/\\frac/g, 'F').replace(/\\[,;! ]/g, '')
    .replace(/[\s$]/g, '');
  let position = 0;
  const peek = () => source[position] ?? '';
  const fail = (): never => { throw new Error(`Unsupported numeric TeX at ${position}: ${input}`); };
  const group = (close: string): Rational => {
    position++;
    const value = sum();
    if (peek() !== close) fail();
    position++;
    return value;
  };
  const argument = (): Rational => {
    if (peek() === '{') return group('}');
    if (/\d/.test(peek()) && peek()) return rational(Number(source[position++]));
    return atom();
  };
  const atom = (): Rational => {
    const char = peek();
    if (char === '{') return group('}');
    if (char === '(') return group(')');
    if (char === 'F') { position++; const numerator = argument(); return divide(numerator, argument()); }
    if (char && /[\d.]/.test(char)) {
      const start = position;
      while (peek() && /[\d.]/.test(peek())) position++;
      const number = source.slice(start, position);
      const [whole, decimal = ''] = number.split('.');
      return rational(BigInt(whole + decimal), 10n ** BigInt(decimal.length));
    }
    if (char in variables) { position++; return rational(variables[char]); }
    return fail();
  };
  const power = (): Rational => {
    let value = atom();
    if (peek() === '^') {
      position++;
      const exponent = argument();
      if (exponent.d !== 1n) fail();
      value = exactPower(value, Number(exponent.n));
    }
    return value;
  };
  const unary = (): Rational => {
    if (peek() === '+') { position++; return unary(); }
    if (peek() === '-') { position++; const value = unary(); return rational(-value.n, value.d); }
    return power();
  };
  const product = (): Rational => {
    let value = unary();
    while (peek()) {
      if (peek() === '*') { position++; value = multiply(value, unary()); }
      else if (peek() === '/') { position++; value = divide(value, unary()); }
      else if (/[\d.({Fa-z]/.test(peek())) value = multiply(value, unary());
      else break;
    }
    return value;
  };
  const sum = (): Rational => {
    let value = product();
    while (peek() === '+' || peek() === '-') {
      const sign = source[position++];
      const next = product();
      value = add(value, sign === '+' ? next : rational(-next.n, next.d));
    }
    return value;
  };
  const result = sum();
  if (position !== source.length) fail();
  return result;
}

/** Presentation-neutral MathML shape: signs/exponents/factors remain ordered. */
export function mathShape(tex: string): string {
  const element = document.createElement('div');
  element.innerHTML = katex.renderToString(tex, { output: 'mathml', throwOnError: true });
  const walk = (node: Element): string => {
    if (node.localName === 'annotation') return '';
    const body = node.children.length ? [...node.children].map(walk).join('') : node.textContent ?? '';
    if (['math', 'semantics', 'mrow', 'mstyle'].includes(node.localName)) return body;
    return `${node.localName}[${body}]`;
  };
  return walk(element.querySelector('math')!);
}

export function visibleTextOf(container: Element): string {
  const clone = container.cloneNode(true) as Element;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return clone.textContent ?? '';
}
