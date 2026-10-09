import React, { useState } from 'react';
import { Math as TexMath } from '../math/Math';

/**
 * سُلّم قوى العدد 10 (نشاط الصفحة 26): كل درجة تمثل قيمة 10^n.
 * الضغط على «× 10» ينقل إلى الدرجة الأعلى (الأس يزيد 1)،
 * والضغط على «÷ 10» ينقل إلى الدرجة الأدنى (الأس ينقص 1).
 * الهدف التعليمي: إظهار أن الضرب في 10 يزيد الأس واحدًا، والقسمة عليه تنقصه.
 */
const RUNGS: { exponent: number; value: string }[] = [
  { exponent: 3, value: '1000' },
  { exponent: 2, value: '100' },
  { exponent: 1, value: '10' },
  { exponent: 0, value: '1' },
  { exponent: -1, value: '0.1' },
  { exponent: -2, value: '0.01' },
  { exponent: -3, value: '0.001' },
];

const START_INDEX = 0;

export const PowerOfTenLadder: React.FC = () => {
  const [index, setIndex] = useState<number>(START_INDEX);
  const rung = RUNGS[index];
  const canGoUp = index > 0;
  const canGoDown = index < RUNGS.length - 1;

  const exponentText = rung.exponent < 0 ? `-${Math.abs(rung.exponent)}` : `${rung.exponent}`;

  return (
    <section className="power-ladder" aria-label="سُلّم قوى العدد 10">
      <div className="power-ladder-rungs" role="list">
        {RUNGS.map((item, rungIndex) => (
          <button
            key={item.exponent}
            type="button"
            role="listitem"
            className={`power-ladder-rung${rungIndex === index ? ' is-active' : ''}`}
            onClick={() => setIndex(rungIndex)}
            aria-pressed={rungIndex === index}
            aria-label={`العدد ${item.value}، القوة 10 أس ${item.exponent}`}
          >
            <span className="power-ladder-rung-power">
              <TexMath math={`10^{${item.exponent < 0 ? `-${Math.abs(item.exponent)}` : item.exponent}}`} />
            </span>
            <span className="power-ladder-rung-value" dir="ltr">{item.value}</span>
          </button>
        ))}
      </div>

      <div className="power-ladder-controls">
        <button
          type="button"
          className="power-ladder-button"
          onClick={() => setIndex((current) => Math.max(0, current - 1))}
          disabled={!canGoUp}
        >
          × 10 — الأس يزيد 1
        </button>
        <button
          type="button"
          className="power-ladder-button"
          onClick={() => setIndex((current) => Math.min(RUNGS.length - 1, current + 1))}
          disabled={!canGoDown}
        >
          ÷ 10 — الأس ينقص 1
        </button>
        <button type="button" className="power-ladder-reset" onClick={() => setIndex(START_INDEX)}>
          إعادة
        </button>
      </div>

      <p className="power-ladder-readout" aria-live="polite">
        <span>العدد الحالي: </span>
        <span dir="ltr" className="power-ladder-current-value">{rung.value}</span>
        <span> = </span>
        <TexMath math={`10^{${rung.exponent < 0 ? `-${Math.abs(rung.exponent)}` : rung.exponent}}`} />
        <span className="power-ladder-exponent-note"> (الأس {exponentText})</span>
      </p>
    </section>
  );
};

export default PowerOfTenLadder;
