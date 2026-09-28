import React, { useMemo, useState } from 'react';
import { Math as Formula } from '../math/Math';
import { Minus, Plus, RotateCcw } from 'lucide-react';

/**
 * باني خطوات القسمة — الدرس 3 (صفحة 13).
 *
 * يعيد إنتاج الخطوات الثلاث التي يذكرها الكتاب حرفيًا في المثال المحلول:
 *  ① نضع أولاً إشارة خارج القسمة.
 *  ② نضرب الكسر المقسوم بمقلوب المقسوم عليه.
 *  ③ لا نغفل الاختصار.
 * الطالب يكشف كل خطوة بنفسه بدل أن يرى الحل جاهزًا.
 */

interface DivisionStepBuilderProps {
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

function texFraction(n: number, d: number): string {
  if (d === 1) return `${n}`;
  if (d === -1) return `${-n}`;
  return `\\frac{${n}}{${d}}`;
}

const Stepper: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  allowZero?: boolean;
}> = ({ label, value, onChange, allowZero = true }) => {
  const step = (delta: number) => {
    let next = value + delta;
    if (!allowZero && next === 0) next += delta;
    if (next < -9 || next > 9) return;
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

const STAGES = [
  { key: 'sign', label: '① حدّد إشارة خارج القسمة' },
  { key: 'reciprocal', label: '② اضرب بمقلوب المقسوم عليه' },
  { key: 'simplify', label: '③ اختصر الناتج' },
];

export const DivisionStepBuilder: React.FC<DivisionStepBuilderProps> = ({
  initial = { n1: -1, d1: 2, n2: 5, d2: 4 },
}) => {
  const [n1, setN1] = useState(initial.n1);
  const [d1, setD1] = useState(initial.d1);
  const [n2, setN2] = useState(initial.n2);
  const [d2, setD2] = useState(initial.d2);
  const [stage, setStage] = useState(0);

  const data = useMemo(() => {
    const num = n1 * d2;
    const den = d1 * n2;
    const negative = num * den < 0;
    const zero = num === 0;
    const g = gcd(num, den);
    let sn = num / g;
    let sd = den / g;
    if (sd < 0) {
      sn = -sn;
      sd = -sd;
    }
    return { num, den, negative, zero, sn, sd, canDivide: n2 !== 0 };
  }, [n1, d1, n2, d2]);

  const reset = () => {
    setN1(initial.n1);
    setD1(initial.d1);
    setN2(initial.n2);
    setD2(initial.d2);
    setStage(0);
  };

  const first = texFraction(n1, d1);
  const second = texFraction(n2, d2);
  const recip = texFraction(d2, n2);

  return (
    <div className="interactive-card db-builder">
      <div className="db-controls">
        <div className="fm-fraction-controls">
          <span className="db-field-label">المقسوم</span>
          <Stepper label="البسط" value={n1} onChange={setN1} />
          <Stepper label="المقام" value={d1} onChange={setD1} allowZero={false} />
        </div>
        <span className="de-op" dir="ltr">
          ÷
        </span>
        <div className="fm-fraction-controls">
          <span className="db-field-label">المقسوم عليه</span>
          <Stepper label="البسط" value={n2} onChange={setN2} allowZero={false} />
          <Stepper label="المقام" value={d2} onChange={setD2} allowZero={false} />
        </div>
        <button type="button" className="reveal-btn fm-reset" onClick={reset}>
          <RotateCcw size={14} />
          <span>إعادة</span>
        </button>
      </div>

      <div className="db-expression">
        <Formula display math={`${first} \\div ${second}`} />
      </div>

      <div className="de-stage-buttons">
        {STAGES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            className={`de-stage-btn ${stage > i ? 'done' : ''}`}
            disabled={stage !== i || !data.canDivide}
            onClick={() => setStage(i + 1)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="db-stages">
        {stage >= 1 && (
          <div className="db-stage-line">
            <span className="db-stage-tag">الإشارة</span>
            <span>
              {data.zero
                ? 'المقسوم يساوي صفرًا، فخارج القسمة صفر.'
                : data.negative
                  ? 'العددان إشارتاهما مختلفتان، فخارج القسمة عددٌ سالب.'
                  : 'العددان لهما الإشارة نفسها، فخارج القسمة عددٌ موجب.'}
            </span>
          </div>
        )}

        {stage >= 2 && (
          <div className="db-stage-line">
            <span className="db-stage-tag">الضرب بالمقلوب</span>
            <Formula
              math={`${first} \\div ${second} = ${first} \\times ${recip} = ${texFraction(
                data.num,
                data.den,
              )}`}
            />
          </div>
        )}

        {stage >= 3 && (
          <div className="db-stage-line db-stage-final">
            <span className="db-stage-tag">الاختصار</span>
            <Formula math={`${texFraction(data.num, data.den)} = ${texFraction(data.sn, data.sd)}`} />
          </div>
        )}
      </div>

      {stage >= 3 && (
        <div className="db-note">
          القاعدة نفسها في كل مرة: القسمة على عدد هي الضرب بمقلوب ذلك العدد، والمقسوم عليه وحده هو
          الذي يُقلب.
        </div>
      )}
    </div>
  );
};

export default DivisionStepBuilder;
