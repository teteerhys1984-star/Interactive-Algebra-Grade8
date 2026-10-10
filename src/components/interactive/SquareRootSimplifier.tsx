import React, { useMemo, useState } from 'react';
import { Math as TexMath } from '../math/Math';
import { MathText } from '../math/MathText';

/**
 * مبسّط الجذور التربيعية — الصفحة 37 (مثال تبسيط √8 و√50 و√27، وتدرّب ②).
 *
 * يبحث عن أكبر عدد مربع كامل k² يقسم العدد n، فيكتب n = k² × m ثم √n = k√m،
 * ويحوّل الطالب الكتابة من العدد إلى صيغة الجذر المبسّط بخطوات ظاهرة.
 */

const MAX_VALUE = 400;
const PRESETS = [8, 50, 27, 75, 32, 108, 72, 196];

/** أكبر k بحيث يقسم k² العدد n (بفرض n ≥ 1). */
export const largestSquareFactor = (n: number): number => {
  for (let k = Math.floor(Math.sqrt(n)); k >= 1; k -= 1) {
    if (n % (k * k) === 0) return k;
  }
  return 1;
};

export const SquareRootSimplifier: React.FC<{ initialValue?: number }> = ({ initialValue = 8 }) => {
  const [raw, setRaw] = useState<string>(String(initialValue));

  const parsed = raw.trim() === '' ? NaN : Number(raw);
  const valid = Number.isInteger(parsed) && parsed >= 1 && parsed <= MAX_VALUE;

  const details = useMemo(() => {
    if (!valid) return null;
    const k = largestSquareFactor(parsed);
    const m = parsed / (k * k);
    return { k, m };
  }, [parsed, valid]);

  return (
    <section className="root-simplifier" aria-label="تبسيط الجذر التربيعي">
      <div className="root-explorer-input">
        <label className="root-explorer-label" htmlFor="root-simplify-input">
          <MathText text="العدد الصحيح الموجب $n$ (من 1 إلى 400)" />
        </label>
        <input
          id="root-simplify-input"
          type="number"
          inputMode="numeric"
          className="root-number-input"
          dir="ltr"
          min={1}
          max={MAX_VALUE}
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
        />
        <input
          type="range"
          min={1}
          max={MAX_VALUE}
          step={1}
          value={valid ? parsed : 1}
          aria-label="اختيار العدد بالتمرير"
          dir="ltr"
          onChange={(event) => setRaw(event.target.value)}
        />
      </div>

      <div className="root-presets" role="group" aria-label="أعداد جاهزة للتبسيط">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            dir="ltr"
            className={`root-pill${valid && parsed === preset ? ' is-active' : ''}`}
            onClick={() => setRaw(String(preset))}
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="root-result" aria-live="polite">
        {!valid && (
          <p className="root-hint">
            <MathText text="أدخل عددًا صحيحًا موجبًا بين 1 و400." />
          </p>
        )}

        {details && (
          <>
            <div className="root-equation">
              <TexMath math={`${parsed} = ${details.k * details.k}\\times${details.m}`} display />
            </div>
            <div className="root-equation">
              <TexMath
                math={
                  details.m === 1
                    ? `\\sqrt{${parsed}} = ${details.k}`
                    : `\\sqrt{${parsed}} = \\sqrt{${details.k * details.k}}\\times\\sqrt{${details.m}} = ${details.k}\\sqrt{${details.m}}`
                }
                display
              />
            </div>
            <p className="root-hint">
              <MathText
                text={
                  details.m === 1
                    ? `العدد ${parsed} مربع كامل، لذلك جذره التربيعي عدد صحيح.`
                    : `أكبر عدد مربع كامل يقسم ${parsed} هو $${details.k * details.k}$، والباقي $${details.m}$ لا يقبل القسمة على مربع كامل أكبر من 1، فالصيغة المبسطة هي $${details.k}\\sqrt{${details.m}}$.`
                }
              />
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default SquareRootSimplifier;
