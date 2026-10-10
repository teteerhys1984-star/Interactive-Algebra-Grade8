import React, { useMemo, useState } from 'react';
import { Math as TexMath } from '../math/Math';
import { MathText } from '../math/MathText';

/**
 * مستكشف الجذر التربيعي — الصفحة 35 (التعريف والنتيجتان) والصفحة 37 (الآلة الحاسبة).
 *
 * - الوضع «root»: يُدخل الطالب عددًا فيرى جذره التربيعي الموجب، ويتحقّق أن مربعه
 *   يساوي العدد نفسه. للعدد السالب لا يوجد جذر تربيعي (نتيجة الصفحة 35).
 * - الوضع «area»: مربع مساحته S، فيكون طول ضلعه الجذر التربيعي للمساحة (مثال الصفحة 37).
 */

export type SquareRootMode = 'root' | 'area';

interface SquareRootExplorerProps {
  mode?: SquareRootMode;
  initialValue?: number;
}

const MAX_VALUE = 400;
const PRESETS = [0, 1, 3, 4, 5, 8, 25, 30, 36, 64, 196];

const parseInput = (raw: string): number | null => {
  if (raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
};

const isPerfectSquare = (value: number): boolean =>
  Number.isInteger(value) && value >= 0 && Number.isInteger(Math.sqrt(value));

export const SquareRootExplorer: React.FC<SquareRootExplorerProps> = ({ mode = 'root', initialValue = 16 }) => {
  const [raw, setRaw] = useState<string>(String(initialValue));
  const value = parseInput(raw);
  const isArea = mode === 'area';

  const view = useMemo(() => {
    if (value === null) return null;
    if (!isArea && value < 0) {
      return { kind: 'negative' as const };
    }
    const root = Math.sqrt(value);
    const exact = isPerfectSquare(value);
    const check = Math.abs(root * root - value) < 1e-9 * Math.max(1, value);
    return { kind: 'ok' as const, root, exact, check };
  }, [value, isArea]);

  const symbol = isArea ? 'S' : 'a';
  const sliderValue = value !== null && value >= 0 && value <= MAX_VALUE ? value : 0;

  return (
    <section className="root-explorer" aria-label={isArea ? 'حساب طول ضلع مربع من مساحته' : 'مستكشف الجذر التربيعي'}>
      <div className="root-explorer-input">
        <label className="root-explorer-label" htmlFor={`root-input-${mode}`}>
          <MathText text={isArea ? 'المساحة $S$ بالسنتيمتر المربع' : 'العدد $a$'} />
        </label>
        <input
          id={`root-input-${mode}`}
          type="number"
          inputMode="decimal"
          className="root-number-input"
          dir="ltr"
          value={raw}
          min={isArea ? 0 : undefined}
          onChange={(event) => setRaw(event.target.value)}
        />
        <input
          type="range"
          min={0}
          max={MAX_VALUE}
          step={1}
          value={sliderValue}
          aria-label={isArea ? 'اختيار المساحة بالتمرير' : 'اختيار العدد بالتمرير'}
          onChange={(event) => setRaw(event.target.value)}
          dir="ltr"
        />
      </div>

      <div className="root-presets" role="group" aria-label="قيم جاهزة">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`root-pill${value === preset ? ' is-active' : ''}`}
            onClick={() => setRaw(String(preset))}
            dir="ltr"
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="root-result" aria-live="polite">
        {view === null && <p className="root-hint">أدخل عددًا لترى النتيجة.</p>}

        {view?.kind === 'negative' && (
          <p className="root-hint">
            <MathText text={`العدد ${value} سالب، ولا يوجد عدد مربعه يساوي ${value}، لذلك ليس له جذر تربيعي.`} />
          </p>
        )}

        {view?.kind === 'ok' && !isArea && (
          <>
            <div className="root-equation">
              <TexMath math={`\\sqrt{${value}} = ${view.exact ? view.root : `${view.root.toFixed(9)}\\ldots`}`} display />
            </div>
            <p className="root-hint">
              <MathText
                text={
                  view.exact
                    ? `الجذر التربيعي للعدد ${value} هو العدد الموجب ${view.root} لأن $${view.root}^{2} = ${value}$.`
                    : `العدد ${value} ليس مربعًا كاملًا، لذلك يُكتب جذره بالرمز $\\sqrt{${value}}$، وقيمته التقريبية هي $${view.root.toFixed(9)}$.`
                }
              />
            </p>
            <p className="root-check">
              <MathText
                text={
                  view.check
                    ? `تحقّق: مربع الجذر يساوي $${value}$ ✓`
                    : 'تحقّق: مربع القيمة التقريبية قريب من العدد.'
                }
              />
            </p>
          </>
        )}

        {view?.kind === 'ok' && isArea && (
          <>
            <div className="root-equation">
              <TexMath math={`x^{2} = ${value} \\quad \\Rightarrow \\quad x = \\sqrt{${value}} \\approx ${view.root.toFixed(1)}`} display />
            </div>
            <p className="root-hint">
              <MathText
                text={`طول الضلع بالسنتيمتر: الآلة الحاسبة تعطي $\\sqrt{${value}} \\approx ${view.root.toFixed(9)}$، فنكتب $x \\approx ${view.root.toFixed(1)}$ تقريبًا لأقرب جزء من عشرة.`}
              />
            </p>
          </>
        )}
      </div>

      <p className="root-note">
        <MathText text={`الرمز $\\sqrt{\\ }$ على الآلة الحاسبة يعطي الجذر التربيعي للعدد $${symbol}$ المدخل.`} />
      </p>
    </section>
  );
};

export default SquareRootExplorer;
