import React, { useMemo, useState } from 'react';
import { Math as Formula } from '../math/Math';
import { Minus, Plus, RotateCcw } from 'lucide-react';

interface FractionMultiplyExplorerProps {
  initial?: { n1: number; d1: number; n2: number; d2: number };
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
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
    if (!allowZero && next === 0) next += delta; // skip zero for denominators
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

export const FractionMultiplyExplorer: React.FC<FractionMultiplyExplorerProps> = ({
  initial = { n1: 3, d1: 4, n2: 7, d2: 5 },
}) => {
  const [n1, setN1] = useState(initial.n1);
  const [d1, setD1] = useState(initial.d1);
  const [n2, setN2] = useState(initial.n2);
  const [d2, setD2] = useState(initial.d2);

  const result = useMemo(() => {
    const num = n1 * n2;
    const den = d1 * d2;
    const g = gcd(num, den);
    let sNum = num / g;
    let sDen = den / g;
    if (sDen < 0) {
      sNum = -sNum;
      sDen = -sDen;
    }
    return { num, den, sNum, sDen, reduced: g !== 1 || den < 0 };
  }, [n1, d1, n2, d2]);

  const sign = result.num * result.den < 0 ? 'سالب' : result.num === 0 ? 'صفر' : 'موجب';

  const reset = () => {
    setN1(initial.n1);
    setD1(initial.d1);
    setN2(initial.n2);
    setD2(initial.d2);
  };

  return (
    <div className="interactive-card fm-explorer">
      <div className="fm-controls">
        <div className="fm-fraction-controls">
          <Stepper label="البسط" value={n1} onChange={setN1} />
          <Stepper label="المقام" value={d1} onChange={setD1} allowZero={false} />
        </div>
        <span className="fm-times" dir="ltr">
          ×
        </span>
        <div className="fm-fraction-controls">
          <Stepper label="البسط" value={n2} onChange={setN2} />
          <Stepper label="المقام" value={d2} onChange={setD2} allowZero={false} />
        </div>
        <button type="button" className="reveal-btn fm-reset" onClick={reset}>
          <RotateCcw size={14} />
          <span>إعادة</span>
        </button>
      </div>

      <div className="fm-result">
        <Formula
          display
          math={`\\frac{${n1}}{${d1}} \\times \\frac{${n2}}{${d2}} = \\frac{${n1} \\times ${n2}}{${d1} \\times ${d2}} = \\frac{${result.num}}{${result.den}}${
            result.reduced ? ` = \\frac{${result.sNum}}{${result.sDen}}` : ''
          }`}
        />
      </div>

      <div className="fm-readout">
        <span className="fm-chip fm-chip-num">البسط × البسط = {n1 * n2}</span>
        <span className="fm-chip fm-chip-den">المقام × المقام = {d1 * d2}</span>
        <span
          className={`fm-chip ${
            sign === 'سالب' ? 'fm-chip-neg' : sign === 'موجب' ? 'fm-chip-pos' : 'fm-chip-zero'
          }`}
        >
          إشارة الناتج: {sign}
        </span>
      </div>
    </div>
  );
};

export default FractionMultiplyExplorer;
