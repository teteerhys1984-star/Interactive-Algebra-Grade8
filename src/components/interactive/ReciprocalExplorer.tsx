import React, { useMemo, useState } from 'react';
import { Math as Formula } from '../math/Math';
import { Minus, Plus, RotateCcw, Ban } from 'lucide-react';

/**
 * مختبر المقلوب — الدرس 3 (الصفحتان 12 و 13).
 *
 * يعالج مفهومي المصدر مباشرةً:
 *  - مقلوب العدد x (مع x ≠ 0) هو خارج قسمة 1 على x، ويحقق x × (1/x) = 1.
 *  - مقلوب c/d هو d/c، مع حالة الصفر التي لا مقلوب لها.
 * ويقابل بينه وبين «النظير» لأنّ الكتاب يطرح الفرق بينهما صراحةً (صفحة 15).
 */

interface ReciprocalExplorerProps {
  initial?: { n: number; d: number };
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

/** يعيد الكسر مختصرًا مع نقل الإشارة إلى البسط. */
function normalize(n: number, d: number): { n: number; d: number } {
  if (d === 0) return { n, d };
  const g = gcd(n, d);
  let sn = n / g;
  let sd = d / g;
  if (sd < 0) {
    sn = -sn;
    sd = -sd;
  }
  return { n: sn, d: sd };
}

function texFraction(n: number, d: number): string {
  if (d === 1) return `${n}`;
  return `\\frac{${n}}{${d}}`;
}

const Stepper: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  allowZero?: boolean;
}> = ({ label, value, onChange, min = -9, max = 9, allowZero = true }) => {
  const step = (delta: number) => {
    let next = value + delta;
    if (!allowZero && next === 0) next += delta;
    if (next < min || next > max) return;
    onChange(next);
  };
  return (
    <div className="fm-stepper">
      <span className="fm-stepper-label">{label}</span>
      <div className="fm-stepper-controls">
        <button type="button" onClick={() => step(-1)} aria-label={`إنقاص ${label}`}>
          <Minus size={14} />
        </button>
        <span className="fm-stepper-value" dir="ltr">
          {value}
        </span>
        <button type="button" onClick={() => step(1)} aria-label={`زيادة ${label}`}>
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

export const ReciprocalExplorer: React.FC<ReciprocalExplorerProps> = ({
  initial = { n: 3, d: 4 },
}) => {
  const [n, setN] = useState(initial.n);
  const [d, setD] = useState(initial.d);

  const value = useMemo(() => normalize(n, d), [n, d]);
  const isZero = value.n === 0;
  const reciprocal = useMemo(() => (isZero ? null : normalize(d, n)), [d, n, isZero]);
  const opposite = useMemo(() => normalize(-value.n, value.d), [value]);

  const reset = () => {
    setN(initial.n);
    setD(initial.d);
  };

  return (
    <div className="interactive-card rc-explorer">
      <div className="fm-controls">
        <div className="fm-fraction-controls">
          <Stepper label="البسط" value={n} onChange={setN} />
          <Stepper label="المقام" value={d} onChange={setD} allowZero={false} />
        </div>
        <button type="button" className="reveal-btn fm-reset" onClick={reset}>
          <RotateCcw size={14} />
          <span>إعادة</span>
        </button>
      </div>

      <div className="rc-row">
        <div className="rc-cell">
          <span className="rc-cell-label">العدد</span>
          <Formula math={`x = ${texFraction(value.n, value.d)}`} />
        </div>

        <div className="rc-cell rc-cell-main">
          <span className="rc-cell-label">المقلوب</span>
          {isZero ? (
            <span className="rc-nozero">
              <Ban size={16} />
              <span>الصفر لا مقلوب له</span>
            </span>
          ) : (
            <Formula math={`\\frac{1}{x} = ${texFraction(reciprocal!.n, reciprocal!.d)}`} />
          )}
        </div>

        <div className="rc-cell">
          <span className="rc-cell-label">النظير (للمقارنة)</span>
          <Formula math={`-x = ${texFraction(opposite.n, opposite.d)}`} />
        </div>
      </div>

      <div className="rc-check">
        {isZero ? (
          <span className="rc-check-text">
            لا يوجد عدد نضربه بالصفر فنحصل على <Formula math={'1'} />، لذلك القسمة على الصفر مستحيلة.
          </span>
        ) : (
          <Formula
            display
            math={`${texFraction(value.n, value.d)} \\times ${texFraction(
              reciprocal!.n,
              reciprocal!.d,
            )} = \\frac{${value.n} \\times ${reciprocal!.n}}{${value.d} \\times ${
              reciprocal!.d
            }} = 1`}
          />
        )}
      </div>

      <div className="fm-readout">
        <span className="fm-chip fm-chip-num">المقلوب: نقلب البسط والمقام</span>
        <span className="fm-chip fm-chip-den">النظير: نغيّر الإشارة فقط</span>
        <span className={`fm-chip ${isZero ? 'fm-chip-neg' : 'fm-chip-pos'}`}>
          {isZero ? 'حالة خاصة: x = 0' : 'جداء العدد بمقلوبه = 1'}
        </span>
      </div>
    </div>
  );
};

export default ReciprocalExplorer;
