import { useMemo, useState } from 'react';
import { RotateCcw, Check, X, Eye, Calculator } from 'lucide-react';
import { MathText } from '../math/MathText';

/**
 * مختبر حلّ المعادلة خطوة بخطوة (الوحدة الرابعة، ص72–74).
 *
 * يطبّق الطريقة التي يعلّمها الكتاب حرفيًا: نختار عملية من خواصّ المساواة
 * (نجمع/نطرح عددًا من الطرفين، أو نضرب/نقسم الطرفين على عدد غير معدوم) فتُطبَّق
 * على الطرفين معًا، وتُعرض المعادلة الجديدة.
 *
 * كل الحساب كسور تامة (Rational) — لا `eval` ولا أعداد عشرية مُقرَّبة، فتظهر
 * النتائج مثل `\frac{25}{2}` لا `12.5` حين لا تكون القسمة تامة.
 */

export interface Rational {
  n: number;
  d: number;
}

const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x === 0 ? 1 : x;
};

export const rat = (n: number, d = 1): Rational => {
  if (d === 0) throw new Error('مقام معدوم');
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { n: (sign * n) / g, d: Math.abs(d) / g };
};

export const ratAdd = (a: Rational, b: Rational): Rational => rat(a.n * b.d + b.n * a.d, a.d * b.d);
export const ratSub = (a: Rational, b: Rational): Rational => rat(a.n * b.d - b.n * a.d, a.d * b.d);
export const ratMul = (a: Rational, b: Rational): Rational => rat(a.n * b.n, a.d * b.d);
export const ratDiv = (a: Rational, b: Rational): Rational => {
  if (b.n === 0) throw new Error('قسمة على صفر');
  return rat(a.n * b.d, a.d * b.n);
};
export const ratIsZero = (a: Rational): boolean => a.n === 0;
export const ratEquals = (a: Rational, b: Rational): boolean => a.n === b.n && a.d === b.d;

/** `ax + b` — تعبير خطّي بمعاملات كسرية تامّة. */
export interface Linear {
  a: Rational;
  b: Rational;
}

export const linear = (a: Rational, b: Rational): Linear => ({ a, b });

export type OperationKind = 'add' | 'sub' | 'mul' | 'div';

/** العمليات تُجرى على الطرفين معًا، كما تسمح خواصّ المساواة. */
export const applyOperation = (side: Linear, kind: OperationKind, amount: Rational): Linear => {
  if (kind === 'add') return { a: side.a, b: ratAdd(side.b, amount) };
  if (kind === 'sub') return { a: side.a, b: ratSub(side.b, amount) };
  if (kind === 'mul') return { a: ratMul(side.a, amount), b: ratMul(side.b, amount) };
  return { a: ratDiv(side.a, amount), b: ratDiv(side.b, amount) };
};

/** `ax + b = cx + d` ⟹ x = (d − b) / (a − c)، أو null إن لم يكن الحلّ وحيدًا. */
export const solveLinear = (left: Linear, right: Linear): Rational | null => {
  const coefficient = ratSub(left.a, right.a);
  if (ratIsZero(coefficient)) return null;
  return ratDiv(ratSub(right.b, left.b), coefficient);
};

/** هل وصلنا إلى الصيغة `x = عدد` ؟ */
export const isSolved = (left: Linear, right: Linear): boolean =>
  ratEquals(left.a, rat(1)) && ratIsZero(left.b) && ratIsZero(right.a);

const showRat = (value: Rational, asDecimal = false): string => {
  if (asDecimal && value.d !== 1) {
    const decimal = value.n / value.d;
    if (Number.isFinite(decimal)) return String(Number(decimal.toFixed(4)));
  }
  return value.d === 1 ? String(value.n) : `\\frac{${value.n}}{${value.d}}`;
};

export const showLinear = (expression: Linear, variable: string): string => {
  const parts: string[] = [];
  if (!ratIsZero(expression.a)) {
    const coefficient = showRat(expression.a);
    if (expression.a.d === 1) {
      parts.push(expression.a.n === 1 ? variable : expression.a.n === -1 ? `-${variable}` : `${coefficient}${variable}`);
    } else {
      parts.push(`${coefficient}${variable}`);
    }
  }
  if (!ratIsZero(expression.b) || parts.length === 0) {
    if (parts.length === 0) {
      parts.push(showRat(expression.b));
    } else if (expression.b.n < 0) {
      parts.push(`- ${showRat(rat(-expression.b.n, expression.b.d))}`);
    } else {
      parts.push(`+ ${showRat(expression.b)}`);
    }
  }
  return parts.join(' ');
};

const OPERATION_WORD: Record<OperationKind, string> = {
  add: 'نجمع',
  sub: 'نطرح',
  mul: 'نضرب الطرفين في',
  div: 'نقسم الطرفين على',
};

/** أرقام عربية-هندية وفاصلة عشرية عربية ← أرقام غربية ونقطة عشرية. */
const normaliseDigits = (input: string): string =>
  input
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/٫/g, '.')
    .trim();

/**
 * تحويل نصّ عدد (صحيح أو عشري) إلى كسر تام بدقّة عشرية كاملة:
 * «0.1» ← 1/10، لا 3602879701896397/36028797018963970 التي ينتجها `rat(Number('0.1'))`
 * لأن العدد 0.1 لا يُخزَّن في الفاصلة العائمة تخزينًا تامًّا. تُبنى البسطة والمقام
 * من خانات النصّ نفسها (المقام قوّة عشرية)، فلا يظهر أي كسر ثنائي مزيّف.
 *
 * تُعاد `null` إن كان النصّ غير صالح أو تجاوز حدًّا آمنًا من الخانات.
 */
export const parseAmount = (input: string): { value: Rational; label: string } | null => {
  const text = normaliseDigits(input);
  const match = text.match(/^([+-]?)(\d*)(?:\.(\d*))?$/);
  if (!match) return null;

  const [, sign = '', wholeRaw = '', fractionRaw = ''] = match;
  if (wholeRaw === '' && fractionRaw === '') return null;
  // حدّ أمان: 15 خانة عشرية / 15 رقمًا تبقى داخل نطاق الأعداد الصحيحة الآمنة.
  if (fractionRaw.length > 15) return null;

  const whole = wholeRaw === '' ? '0' : wholeRaw;
  const digits = `${whole}${fractionRaw}`.replace(/^0+(?=\d)/, '');
  if (digits.length > 15) return null;

  const numerator = Number(digits);
  const denominator = 10 ** fractionRaw.length;
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) return null;

  const signed = sign === '-' ? -numerator : numerator;
  const value = rat(signed, denominator);
  const label = `${sign === '-' ? '-' : ''}${whole}${fractionRaw === '' ? '' : `.${fractionRaw}`}`;
  return { value, label };
};

export interface EquationStepsLabProps {
  left: Linear;
  right: Linear;
  variable?: string;
}

export function EquationStepsLab({ left, right, variable = 'x' }: EquationStepsLabProps) {
  const [state, setState] = useState<{ left: Linear; right: Linear; history: string[] }>({
    left,
    right,
    history: [],
  });
  const [kind, setKind] = useState<OperationKind>('sub');
  const [amount, setAmount] = useState<string>('2');
  const [message, setMessage] = useState<{ tone: 'ok' | 'warn' | 'bad'; text: string } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const root = useMemo(() => solveLinear(state.left, state.right), [state]);
  const solved = useMemo(() => isSolved(state.left, state.right), [state]);
  const currentLabel = `${showLinear(state.left, variable)} = ${showLinear(state.right, variable)}`;

  const run = () => {
    const parsed = parseAmount(amount);
    if (!parsed) {
      setMessage({ tone: 'bad', text: 'أدخل عددًا صحيحًا أو عشريًا صالحًا.' });
      return;
    }
    const { value, label } = parsed;
    if ((kind === 'mul' || kind === 'div') && value.n === 0) {
      setMessage({ tone: 'bad', text: 'لا نضرب ولا نقسم على الصفر؛ فالقسمة على صفر غير معرّفة.' });
      return;
    }

    const nextLeft = applyOperation(state.left, kind, value);
    const nextRight = applyOperation(state.right, kind, value);
    const nextRoot = solveLinear(nextLeft, nextRight);

    // العملية المسموحة تحفظ مجموعة الحلول؛ أي تغيّر فيها يعني خطأً.
    if (root && !nextRoot) {
      setMessage({ tone: 'bad', text: 'هذه العملية ألغت المجهول من المعادلة، فلا تُفيد في الحلّ.' });
      return;
    }
    if (root && nextRoot && !ratEquals(root, nextRoot)) {
      setMessage({ tone: 'bad', text: 'هذه العملية غيّرت حلّ المعادلة، فهي غير مسموحة.' });
      return;
    }

    const shown = showLinear(nextLeft, variable) + ' = ' + showLinear(nextRight, variable);
    const step = `${OPERATION_WORD[kind]} ${label} — فتصبح $${shown}$$`;

    setState((previous) => ({ left: nextLeft, right: nextRight, history: [...previous.history, step] }));

    if (isSolved(nextLeft, nextRight)) {
      setMessage({ tone: 'ok', text: 'وصلت إلى صيغة الحلّ. تحقّق أخيرًا بالتعويض في المعادلة الأصلية.' });
    } else {
      setMessage({ tone: 'ok', text: 'عملية صحيحة: أُجريت على الطرفين، فبقيت مجموعة الحلول نفسها.' });
    }
  };

  const reset = () => {
    setState({ left, right, history: [] });
    setMessage(null);
    setShowHint(false);
  };

  return (
    <div className="interactive-card u4-steps-lab" dir="rtl">
      <div className="u4-steps-head">
        <span className="u4-steps-title">
          <Calculator size={18} aria-hidden="true" /> مختبر حلّ المعادلة
        </span>
        <span className={`u4-steps-status${solved ? ' is-solved' : ''}`} role="status">
          {solved ? <Check size={15} aria-hidden="true" /> : null}
          {solved ? 'وصلت إلى الحلّ' : 'الهدف: الوصول إلى صيغة المجهول وحده'}
        </span>
      </div>

      <p className="u4-steps-current">
        <span className="u4-steps-label">المعادلة الحالية:</span>{' '}
        <MathText text={`$${currentLabel}$`} />
      </p>

      <div className="u4-steps-controls">
        <label className="u4-steps-field">
          <span>العملية على الطرفين</span>
          <select value={kind} onChange={(event) => setKind(event.target.value as OperationKind)}>
            <option value="add">نجمع العدد</option>
            <option value="sub">نطرح العدد</option>
            <option value="mul">نضرب في العدد</option>
            <option value="div">نقسم على العدد</option>
          </select>
        </label>

        <label className="u4-steps-field">
          <span>العدد</span>
          <input
            type="text"
            inputMode="decimal"
            dir="ltr"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <button type="button" className="u4-steps-apply" onClick={run}>
          طبّق على الطرفين
        </button>
        <button type="button" className="reveal-btn" onClick={reset}>
          <RotateCcw size={15} aria-hidden="true" /> إعادة
        </button>
      </div>

      {message && (
        <p className={`u4-steps-message is-${message.tone}`} role="status">
          {message.tone === 'ok' ? <Check size={15} aria-hidden="true" /> : <X size={15} aria-hidden="true" />}
          <MathText text={message.text} />
        </p>
      )}

      {state.history.length > 0 && (
        <ol className="u4-steps-history">
          {state.history.map((entry, index) => (
            <li key={`${index}-${entry}`}>
              <MathText text={entry} />
            </li>
          ))}
        </ol>
      )}

      <div className="u4-steps-footer">
        <button type="button" className="reveal-btn" onClick={() => setShowHint((value) => !value)}>
          <Eye size={15} aria-hidden="true" /> {showHint ? 'إخفاء التلميح' : 'تلميح للخطوة التالية'}
        </button>
      </div>

      {showHint && (
        <div className="solution-panel">
          <p>
            الهدف أن يبقى المجهول في طرف والعدد في الطرف الآخر. ابدأ بإزالة الثابت المضاف إلى حدّ المجهول
            بجمع نظيره إلى الطرفين، ثم اقسم الطرفين على معامل المجهول. كل عملية تُجرى على الطرفين معًا تحفظ
            حلّ المعادلة.
          </p>
        </div>
      )}
    </div>
  );
}

export default EquationStepsLab;
