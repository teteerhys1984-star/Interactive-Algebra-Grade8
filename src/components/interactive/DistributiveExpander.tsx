import React, { useMemo, useState } from 'react';
import { Math as Formula } from '../math/Math';
import { Minus, Plus, ArrowLeftRight } from 'lucide-react';

interface DistributiveExpanderProps {
  initial?: { a: number; x: number; y: number; op: '+' | '-'; varName: string };
}

const clamp = (v: number, min = -9, max = 9) => Math.max(min, Math.min(max, v));

export const DistributiveExpander: React.FC<DistributiveExpanderProps> = ({
  initial = { a: -3, x: 4, y: 5, op: '+', varName: 'x' },
}) => {
  const [a, setA] = useState(initial.a);
  const [x, setX] = useState(initial.x);
  const [y, setY] = useState(initial.y);
  const [op, setOp] = useState<'+' | '-'>(initial.op);
  const [stage, setStage] = useState(0); // 0: closed, 1: distributed, 2: simplified
  const v = initial.varName;

  const t1 = a * x; // constant term
  const t2 = a * y; // coefficient of variable (with distributed sign)
  const signedT2 = op === '+' ? t2 : -t2;

  const fmtTerm = (coef: number, withVar: boolean) => {
    const sign = coef < 0 ? '-' : '+';
    const mag = Math.abs(coef);
    return `${sign} ${mag}${withVar ? v : ''}`;
  };

  const simplified = useMemo(() => {
    // a*(x op y·v) = a·x  (op)  a·y·v  -> constant t1, variable coef signedT2
    let s = `${t1 < 0 ? '-' : ''}${Math.abs(t1)}`;
    s += ` ${fmtTerm(signedT2, true)}`;
    return s.trim();
  }, [t1, signedT2, v]);

  const closedForm = `${a} \\times (${x} ${op} ${y}${v})`;
  const distributedForm = `(${a}) \\times ${x} ${op} (${a}) \\times ${y}${v}`;

  return (
    <div className="interactive-card de-expander">
      <div className="de-controls">
        <div className="de-field">
          <span>العامل a</span>
          <div className="de-btns">
            <button type="button" onClick={() => { setA(clamp(a - 1)); setStage(0); }} aria-label="إنقاص a"><Minus size={14} /></button>
            <span dir="ltr">{a}</span>
            <button type="button" onClick={() => { setA(clamp(a + 1)); setStage(0); }} aria-label="زيادة a"><Plus size={14} /></button>
          </div>
        </div>
        <div className="de-field">
          <span>الحدّ الثابت</span>
          <div className="de-btns">
            <button type="button" onClick={() => { setX(clamp(x - 1)); setStage(0); }} aria-label="إنقاص الحد الأول"><Minus size={14} /></button>
            <span dir="ltr">{x}</span>
            <button type="button" onClick={() => { setX(clamp(x + 1)); setStage(0); }} aria-label="زيادة الحد الأول"><Plus size={14} /></button>
          </div>
        </div>
        <button
          type="button"
          className="de-op"
          onClick={() => { setOp(op === '+' ? '-' : '+'); setStage(0); }}
          aria-label="تبديل العملية"
          dir="ltr"
        >
          <ArrowLeftRight size={14} /> {op}
        </button>
        <div className="de-field">
          <span>معامل {v}</span>
          <div className="de-btns">
            <button type="button" onClick={() => { setY(clamp(y - 1)); setStage(0); }} aria-label="إنقاص معامل المتغير"><Minus size={14} /></button>
            <span dir="ltr">{y}</span>
            <button type="button" onClick={() => { setY(clamp(y + 1)); setStage(0); }} aria-label="زيادة معامل المتغير"><Plus size={14} /></button>
          </div>
        </div>
      </div>

      <div className="de-stage">
        <Formula
          display
          math={
            stage === 0
              ? closedForm
              : stage === 1
              ? `${closedForm} = ${distributedForm}`
              : `${closedForm} = ${distributedForm} = ${simplified}`
          }
        />
      </div>

      <div className="de-stage-buttons">
        <button type="button" className={`de-stage-btn ${stage >= 1 ? 'done' : ''}`} onClick={() => setStage(1)}>
          الخطوة 1: وزّع العامل
        </button>
        <button type="button" className={`de-stage-btn ${stage >= 2 ? 'done' : ''}`} onClick={() => setStage(2)} disabled={stage < 1}>
          الخطوة 2: بسّط الناتج
        </button>
        <button type="button" className="reveal-btn" onClick={() => setStage(0)}>
          البداية
        </button>
      </div>

      {stage >= 1 && (
        <p className="de-note">
          العامل <strong dir="ltr">{a}</strong> ضرب كل حدٍّ داخل القوس على حدة
          {a < 0 ? '، ولأنه سالب قلب إشارة كل حدّ.' : '.'}
        </p>
      )}
    </div>
  );
};

export default DistributiveExpander;
