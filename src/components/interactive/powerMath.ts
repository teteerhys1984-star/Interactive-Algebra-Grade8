/**
 * حساب دقيق للقوى الصحيحة — مشترك بين مكوّنات الوحدة الثانية التفاعلية.
 *
 * كل الحساب يجري على كسور صحيحة (بسط/مقام) لتفادي أخطاء الفاصلة العائمة في
 * العرض: فمثلًا (−0.4)^{−3} = −125/8 لا يُحتسب بالتقريب، بل يبقى كسرًا دقيقًا
 * ثم يُحوَّل إلى عدد عشري عند الطلب فقط إذا كان العدد العشري منتهيًا.
 *
 * الدوال هنا تعيد نصوص TeX/CSS آمنة، ولا تمرّ أبدًا نصوصٌ تحوي $ إلى Math.
 */

export interface ExactFraction {
  num: number;
  den: number;
}

export const gcd = (left: number, right: number): number => {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    const rest = a % b;
    a = b;
    b = rest;
  }
  return a === 0 ? 1 : a;
};

/** قوة عدد صحيح بأس غير سالب؛ لا تقريب صامت ولا أس كسري في هذا الدرس. */
export const intPow = (base: number, exponent: number): number => {
  if (!Number.isSafeInteger(base) || !Number.isSafeInteger(exponent) || exponent < 0 || (base === 0 && exponent === 0)) {
    throw new RangeError('Integer power requires a safe integer base and a non-negative integer exponent.');
  }
  let result = 1;
  for (let i = 0; i < exponent; i += 1) {
    result *= base;
    if (!Number.isSafeInteger(result)) throw new RangeError('Power exceeds exact integer range.');
  }
  return result;
};

/** كسر في أبسط صورة وبإشارة على البسط. */
export const normalise = (num: number, den: number): ExactFraction => {
  if (den === 0) throw new RangeError('Division by zero is undefined.');
  if (!Number.isSafeInteger(num) || !Number.isSafeInteger(den)) {
    throw new RangeError('Exact fractions require safe integer terms.');
  }
  if (num === 0) return { num: 0, den: 1 };
  const sign = den < 0 ? -1 : 1;
  const divisor = gcd(num, den) || 1;
  return { num: (sign * num) / divisor, den: Math.abs(den) / divisor };
};

/** (بسط/مقام) مرفوعًا إلى أس صحيح موجب أو سالب. */
export const fractionPower = (base: ExactFraction, exponent: number): ExactFraction => {
  if (!Number.isSafeInteger(exponent) || base.den === 0 || (base.num === 0 && exponent <= 0)) {
    throw new RangeError('This power is undefined in the lesson domain.');
  }
  const steps = Math.abs(exponent);
  const numPow = intPow(base.num, steps);
  const denPow = intPow(base.den, steps);
  return exponent >= 0 ? normalise(numPow, denPow) : normalise(denPow, numPow);
};

export const multiplyFractions = (left: ExactFraction, right: ExactFraction): ExactFraction =>
  normalise(left.num * right.num, left.den * right.den);

export const fractionEquals = (left: ExactFraction, right: ExactFraction): boolean =>
  left.num * right.den === right.num * left.den;

/** TeX للكسر: عدد صحيح إن كان المقام 1، وإلا كسرًا عموديًا. */
export const fractionTex = (value: ExactFraction): string => {
  if (value.den === 1) return `${value.num}`;
  const absoluteTex = `\\frac{${Math.abs(value.num)}}{${value.den}}`;
  return value.num < 0 ? `-${absoluteTex}` : absoluteTex;
};

/** TeX لكسر قد يكون سالبًا، مع إشارة صريحة عند الطلب (مثلًا في التعويض). */
export const signedFractionTex = (value: ExactFraction): string =>
  value.num < 0 ? `\\left(${fractionTex(value)}\\right)` : fractionTex(value);

/** هل العدد العشري منتهٍ (المقام قوته من 2 و5 فقط)؟ */
export const terminatingDecimalDigits = (den: number): number | null => {
  if (!Number.isSafeInteger(den) || den <= 0) throw new RangeError('Expected a positive integer denominator.');
  let rest = den;
  let twos = 0;
  let fives = 0;
  while (rest % 2 === 0) {
    rest /= 2;
    twos += 1;
  }
  while (rest % 5 === 0) {
    rest /= 5;
    fives += 1;
  }
  if (rest !== 1) return null;
  return Math.max(twos, fives);
};

/** الصيغة العشرية المنتهية للكسر، أو null إذا كان العشري دوريًا. */
export const decimalOf = (value: ExactFraction): string | null => {
  const digits = terminatingDecimalDigits(value.den);
  if (digits === null) return null;
  if (digits === 0) return `${value.num}`;
  const scale = intPow(10, digits);
  const scaled = (value.num * scale) / value.den;
  const sign = scaled < 0 ? '-' : '';
  const text = Math.abs(scaled).toString().padStart(digits + 1, '0');
  const whole = text.slice(0, text.length - digits);
  const fraction = text.slice(text.length - digits);
  return `${sign}${whole}.${fraction}`;
};

/** نص العدد العشري إن وُجد، وإلا تنبيه على أن الكسر دوري. */
export const decimalOrRepeating = (value: ExactFraction): string =>
  decimalOf(value) ?? 'عدد عشري دوري (لا ينتهي)';

/** المضاعف المشترك الأصغر — يُستعمل لمقارنة الأسس في العرض. */
export const lcm = (left: number, right: number): number =>
  Math.abs(left * right) / (gcd(left, right) || 1);
