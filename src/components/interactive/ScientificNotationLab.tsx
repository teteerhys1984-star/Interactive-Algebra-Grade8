import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

interface OperandDraft {
  coefficient: string;
  exponent: string;
}

interface NormalizedNumber {
  coefficient: number;
  exponent: number;
  negative: boolean;
  isZero: boolean;
}

interface LabResult {
  formula: string;
  answer: string;
  explanation: string;
}

const INITIAL_LEFT: OperandDraft = { coefficient: '3.4', exponent: '5' };
const INITIAL_RIGHT: OperandDraft = { coefficient: '2.1', exponent: '3' };
const MIN_EXPONENT = -9;
const MAX_EXPONENT = 9;

const significant = (value: number): string => {
  const rounded = Number(value.toPrecision(12));
  return Object.is(rounded, -0) ? '0' : String(rounded);
};

/** Convert a coefficient and a power into 1 ≤ |a| < 10 form. */
function normalize(coefficient: number, exponent: number): NormalizedNumber {
  if (coefficient === 0) {
    return { coefficient: 0, exponent: 0, negative: false, isZero: true };
  }

  const negative = coefficient < 0;
  let magnitude = Math.abs(coefficient);
  let power = exponent;
  let guard = 0;

  while (magnitude >= 10 && guard < 100) {
    magnitude /= 10;
    power += 1;
    guard += 1;
  }
  while (magnitude < 1 && guard < 100) {
    magnitude *= 10;
    power -= 1;
    guard += 1;
  }

  magnitude = Number(magnitude.toPrecision(12));
  // Rounding can move a value such as 9.999999999 to 10; re-normalize it.
  if (magnitude >= 10) {
    magnitude /= 10;
    power += 1;
  }

  return { coefficient: magnitude, exponent: power, negative, isZero: false };
}

function numberTex(value: number): string {
  return significant(value);
}

function normalizedTex(value: NormalizedNumber): string {
  if (value.isZero) return '0';
  const sign = value.negative ? '-' : '';
  return `${sign}${numberTex(value.coefficient)}\\times10^{${value.exponent}}`;
}

function readOperand(operand: OperandDraft, label: string): { coefficient: number; exponent: number } | string {
  const coefficient = Number(operand.coefficient);
  const exponent = Number(operand.exponent);

  if (operand.coefficient.trim() === '' || !Number.isFinite(coefficient)) {
    return `أدخل معاملًا صالحًا في ${label}.`;
  }
  if (coefficient < 1 || coefficient >= 10) {
    return `يجب أن يكون معامل ${label} بين 1 و10، مع استبعاد 10.`;
  }
  if (operand.exponent.trim() === '' || !Number.isInteger(exponent)) {
    return `أدخل أسًا صحيحًا في ${label}.`;
  }
  if (exponent < MIN_EXPONENT || exponent > MAX_EXPONENT) {
    return `الأس في ${label} يجب أن يكون بين ${MIN_EXPONENT} و${MAX_EXPONENT}.`;
  }
  return { coefficient, exponent };
}

function calculate(
  left: { coefficient: number; exponent: number },
  right: { coefficient: number; exponent: number },
  operation: Operation,
): LabResult {
  const leftTerm = `${numberTex(left.coefficient)}\\times10^{${left.exponent}}`;
  const rightTerm = `${numberTex(right.coefficient)}\\times10^{${right.exponent}}`;

  if (operation === 'add' || operation === 'subtract') {
    // Use the greater exponent as a common unit. The other coefficient is
    // scaled by an exact power of ten before the coefficients are combined.
    const commonExponent = Math.max(left.exponent, right.exponent);
    const leftShift = left.exponent - commonExponent;
    const rightShift = right.exponent - commonExponent;
    const sign = operation === 'add' ? '+' : '-';
    const alignedLeft = left.coefficient * 10 ** leftShift;
    const alignedRight = right.coefficient * 10 ** rightShift;
    const combined = operation === 'add' ? alignedLeft + alignedRight : alignedLeft - alignedRight;
    const normalized = normalize(combined, commonExponent);
    const leftAlignedTex = leftShift === 0
      ? numberTex(left.coefficient)
      : `${numberTex(left.coefficient)}\\times10^{${leftShift}}`;
    const rightAlignedTex = rightShift === 0
      ? numberTex(right.coefficient)
      : `${numberTex(right.coefficient)}\\times10^{${rightShift}}`;
    const formula = `${leftTerm}${sign}${rightTerm}=\\left(${leftAlignedTex}${sign}${rightAlignedTex}\\right)\\times10^{${commonExponent}}=${normalizedTex(normalized)}`;
    const explanation = operation === 'add'
      ? 'وحّدنا قوة العدد 10، ثم جمعنا المعاملين. لم نجمع الأسين لأن العملية جمع لا ضرب.'
      : 'وحّدنا قوة العدد 10، ثم طرحنا المعاملين. إذا ظهر معامل سالب نبقي الإشارة خارج المعامل المعياري.';
    return { formula, answer: normalizedTex(normalized), explanation };
  }

  if (operation === 'multiply') {
    const normalized = normalize(
      left.coefficient * right.coefficient,
      left.exponent + right.exponent,
    );
    const formula = `\\left(${leftTerm}\\right)\\times\\left(${rightTerm}\\right)=\\left(${numberTex(left.coefficient)}\\times${numberTex(right.coefficient)}\\right)\\times10^{${left.exponent}+${right.exponent}}=${normalizedTex(normalized)}`;
    return {
      formula,
      answer: normalizedTex(normalized),
      explanation: 'ضربنا المعاملين، وجمعنا أسّي قوى العدد 10، ثم كتبنا الناتج بمعامل بين 1 و10.',
    };
  }

  const normalized = normalize(
    left.coefficient / right.coefficient,
    left.exponent - right.exponent,
  );
  const formula = `\\frac{${leftTerm}}{${rightTerm}}=\\left(\\frac{${numberTex(left.coefficient)}}{${numberTex(right.coefficient)}}\\right)\\times10^{${left.exponent}-${right.exponent}}=${normalizedTex(normalized)}`;
  return {
    formula,
    answer: normalizedTex(normalized),
    explanation: 'قسمنا المعاملين، وطرحنا أس المقام من أس البسط، ثم طبّعنا المعامل إذا لزم.',
  };
}

/**
 * Lab for operations on standard-form numbers a×10^n.
 * Inputs are constrained to the standard coefficient interval and small integer
 * exponents, preventing invalid/overflow cases while still covering signed powers.
 */
export const ScientificNotationLab: React.FC = () => {
  const [left, setLeft] = useState<OperandDraft>(INITIAL_LEFT);
  const [right, setRight] = useState<OperandDraft>(INITIAL_RIGHT);
  const [operation, setOperation] = useState<Operation>('add');

  const result = useMemo(() => {
    const parsedLeft = readOperand(left, 'العدد الأول');
    if (typeof parsedLeft === 'string') return { error: parsedLeft } as const;
    const parsedRight = readOperand(right, 'العدد الثاني');
    if (typeof parsedRight === 'string') return { error: parsedRight } as const;
    return { value: calculate(parsedLeft, parsedRight, operation) } as const;
  }, [left, right, operation]);

  const updateOperand = (
    side: 'left' | 'right',
    field: keyof OperandDraft,
    value: string,
  ) => {
    const setter = side === 'left' ? setLeft : setRight;
    setter((current) => ({ ...current, [field]: value }));
  };

  const reset = () => {
    setLeft(INITIAL_LEFT);
    setRight(INITIAL_RIGHT);
    setOperation('add');
  };

  return (
    <section className="scientific-lab" dir="rtl" aria-label="مختبر العمليات على الصيغة المعيارية">
      <p className="scientific-lab-intro">
        غيّر العددين والعملية. يجب أن يبقى كل معامل بين 1 و10، والأس عددًا صحيحًا من -9 إلى 9.
        تتحدث خطوات الحل والنتيجة فورًا من المدخلات.
      </p>

      <div className="scientific-lab-controls">
        <fieldset className="scientific-lab-operand">
          <legend>العدد الأول</legend>
          <label>
            <span>المعامل a</span>
            <input
              type="number"
              min="1"
              max="9.9"
              step="any"
              inputMode="decimal"
              dir="ltr"
              value={left.coefficient}
              onChange={(event) => updateOperand('left', 'coefficient', event.target.value)}
              aria-label="معامل العدد الأول"
            />
          </label>
          <label>
            <span>أس 10، n</span>
            <input
              type="number"
              min={MIN_EXPONENT}
              max={MAX_EXPONENT}
              step="1"
              inputMode="numeric"
              dir="ltr"
              value={left.exponent}
              onChange={(event) => updateOperand('left', 'exponent', event.target.value)}
              aria-label="أس العدد الأول"
            />
          </label>
        </fieldset>

        <label className="scientific-lab-operation">
          <span>العملية</span>
          <select
            value={operation}
            onChange={(event) => setOperation(event.target.value as Operation)}
            aria-label="العملية"
          >
            <option value="add">جمع (+)</option>
            <option value="subtract">طرح (−)</option>
            <option value="multiply">ضرب (×)</option>
            <option value="divide">قسمة (÷)</option>
          </select>
        </label>

        <fieldset className="scientific-lab-operand">
          <legend>العدد الثاني</legend>
          <label>
            <span>المعامل b</span>
            <input
              type="number"
              min="1"
              max="9.9"
              step="any"
              inputMode="decimal"
              dir="ltr"
              value={right.coefficient}
              onChange={(event) => updateOperand('right', 'coefficient', event.target.value)}
              aria-label="معامل العدد الثاني"
            />
          </label>
          <label>
            <span>أس 10، m</span>
            <input
              type="number"
              min={MIN_EXPONENT}
              max={MAX_EXPONENT}
              step="1"
              inputMode="numeric"
              dir="ltr"
              value={right.exponent}
              onChange={(event) => updateOperand('right', 'exponent', event.target.value)}
              aria-label="أس العدد الثاني"
            />
          </label>
        </fieldset>
      </div>

      <div className="scientific-lab-equation" aria-live="polite">
        <div className="scientific-lab-input-equation" dir="ltr">
          <Formula
            math={`${numberTex(Number(left.coefficient) || 0)}\\times10^{${left.exponent || 0}}`}
            display
          />
          <span className="scientific-lab-op-sign" aria-hidden="true">
            {operation === 'add' ? '+' : operation === 'subtract' ? '−' : operation === 'multiply' ? '×' : '÷'}
          </span>
          <Formula
            math={`${numberTex(Number(right.coefficient) || 0)}\\times10^{${right.exponent || 0}}`}
            display
          />
        </div>

        {'error' in result ? (
          <p className="scientific-lab-error" role="status">{result.error}</p>
        ) : (
          <>
            <div className="scientific-lab-steps" dir="ltr">
              <Formula math={result.value.formula} display />
            </div>
            <div className="scientific-lab-answer">
              <span>الناتج بالصيغة المعيارية:</span>
              <Formula math={result.value.answer} display />
            </div>
            <p className="scientific-lab-explanation">
              <MathText text={result.value.explanation} />
            </p>
          </>
        )}
      </div>

      <div className="scientific-lab-footer">
        <button type="button" className="scientific-lab-reset" onClick={reset}>
          <RotateCcw size={16} aria-hidden="true" />
          <span>إعادة التجربة</span>
        </button>
        <span className="scientific-lab-range">المعامل: 1 ≤ a,b &lt; 10 • الأس الصحيح: −9 إلى 9</span>
      </div>
    </section>
  );
};

export default ScientificNotationLab;
