import React, { useState } from 'react';
import { Math as TexMath } from '../math/Math';
import { MathText } from '../math/MathText';
import { Check, RotateCcw } from 'lucide-react';

/**
 * مختبر قلب الإشارات وحذف الأقواس — الصفحتان 48 و49.
 *
 * يدرّب الطالب على:
 *   1) قراءة كل حدّ داخل القوس مع إشارته الأصلية (+ أو -).
 *   2) اختيار الإشارة الجديدة لكل حدّ عند حذف القوس المسبوق بإشارة ناقص.
 *   3) التحقّق الفوري بالقاعدة وبالتعويض العددي ليرى لماذا تنكسر المساواة إن نسي
 *      قلب إشارة الحدّ الثاني أو الثالث.
 */

interface TermSpec {
  absTex: string;
  originalSign: '+' | '-';
  flippedSign: '+' | '-';
  evalTerm: (x: number) => number;
}

interface ExpressionPreset {
  id: string;
  labelTex: string;
  variableName: string;
  testX: number;
  terms: TermSpec[];
  finalTex: string;
  ruleExplain: string;
}

export const FLIPPER_PRESETS: readonly ExpressionPreset[] = [
  {
    id: 'sum-2',
    labelTex: '-(x + 6)',
    variableName: 'x',
    testX: 4,
    terms: [
      { absTex: 'x', originalSign: '+', flippedSign: '-', evalTerm: (x) => x },
      { absTex: '6', originalSign: '+', flippedSign: '-', evalTerm: () => 6 },
    ],
    finalTex: '-x - 6',
    ruleExplain: 'نظير المجموع $x + 6$ يغيّر إشارة الحدّين الموجبين إلى سالبين: $-(x + 6) = -x - 6$.',
  },
  {
    id: 'diff-2',
    labelTex: '-(8 - 3x)',
    variableName: 'x',
    testX: 5,
    terms: [
      { absTex: '8', originalSign: '+', flippedSign: '-', evalTerm: () => 8 },
      { absTex: '3x', originalSign: '-', flippedSign: '+', evalTerm: (x) => -3 * x },
    ],
    finalTex: '-8 + 3x',
    ruleExplain: 'نظير الفرق $8 - 3x$ يغيّر $+8$ إلى $-8$ ويغيّر $-3x$ إلى $+3x$: $-(8 - 3x) = -8 + 3x$.',
  },
  {
    id: 'both-neg',
    labelTex: '-(-4 - 5x)',
    variableName: 'x',
    testX: 2,
    terms: [
      { absTex: '4', originalSign: '-', flippedSign: '+', evalTerm: () => -4 },
      { absTex: '5x', originalSign: '-', flippedSign: '+', evalTerm: (x) => -5 * x },
    ],
    finalTex: '4 + 5x',
    ruleExplain: 'كلا الحدّين داخل القوس سالبان ($-4$ و$-5x$)، فعند أخذ النظير يصبح كلاهما موجبًا: $+4 + 5x = 4 + 5x$.',
  },
  {
    id: 'three-terms',
    labelTex: '-(2x^2 - 7x + 1)',
    variableName: 'x',
    testX: 3,
    terms: [
      { absTex: '2x^2', originalSign: '+', flippedSign: '-', evalTerm: (x) => 2 * x * x },
      { absTex: '7x', originalSign: '-', flippedSign: '+', evalTerm: (x) => -7 * x },
      { absTex: '1', originalSign: '+', flippedSign: '-', evalTerm: () => 1 },
    ],
    finalTex: '-2x^2 + 7x - 1',
    ruleExplain: 'تعميم القاعدة على ثلاثة حدود: نغيّر إشارة كل حدّ داخل القوس من الأول حتى الأخير دون استثناء.',
  },
];

export const BracketSignFlipperLab: React.FC = () => {
  const [presetId, setPresetId] = useState<string>(FLIPPER_PRESETS[0].id);
  const [chosenSigns, setChosenSigns] = useState<Record<number, '+' | '-'>>({});
  const [checked, setChecked] = useState<boolean>(false);
  const [xVal, setXVal] = useState<number>(FLIPPER_PRESETS[0].testX);

  const preset = FLIPPER_PRESETS.find((p) => p.id === presetId) ?? FLIPPER_PRESETS[0];

  const selectPreset = (next: ExpressionPreset) => {
    setPresetId(next.id);
    setChosenSigns({});
    setChecked(false);
    setXVal(next.testX);
  };

  const handleReset = () => {
    setChosenSigns({});
    setChecked(false);
    setXVal(preset.testX);
  };

  const allChosen = preset.terms.every((_, idx) => chosenSigns[idx] !== undefined);
  const allCorrect =
    allChosen && preset.terms.every((t, idx) => chosenSigns[idx] === t.flippedSign);

  const insideValue = preset.terms.reduce((sum, t) => sum + t.evalTerm(xVal), 0);
  const trueOppositeValue = -insideValue;

  const studentValue = allChosen
    ? preset.terms.reduce((sum, t, idx) => {
        const absVal = Math.abs(t.evalTerm(xVal));
        const termMag = t.originalSign === '-' ? -t.evalTerm(xVal) : t.evalTerm(xVal);
        void absVal;
        return sum + (chosenSigns[idx] === '+' ? termMag : -termMag);
      }, 0)
    : null;

  const buildStudentTex = (): string => {
    return preset.terms
      .map((t, idx) => {
        const s = chosenSigns[idx] ?? '?';
        if (idx === 0 && s === '+') return t.absTex;
        return `${s} ${t.absTex}`;
      })
      .join(' ');
  };

  return (
    <section className="u3-lab-card" aria-label="مختبر حذف الأقواس المسبوقة بإشارة ناقص">
      <div className="u3-lab-head">
        <div>
          <span className="u3-lab-eyebrow">تدريب بصري تفاعلي • الصفحتان 48–49</span>
          <h4 className="u3-lab-title">اختر الإشارة الجديدة لكل حدّ عند حذف القوس المسبوق بـ «−»</h4>
        </div>
      </div>

      {/* اختيار العبارة */}
      <div className="u3-preset-pills" role="tablist" aria-label="اختر عبارة لتجربة حذف الأقواس">
        {FLIPPER_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={p.id === presetId}
            className={`u3-preset-pill${p.id === presetId ? ' is-active' : ''}`}
            onClick={() => selectPreset(p)}
          >
            <TexMath math={p.labelTex} />
          </button>
        ))}
      </div>

      {/* بطاقات الحدود داخل القوس */}
      <div className="u3-flipper-stage">
        <div className="u3-flipper-source">
          <span className="u3-flipper-label">العبارة بالأقواس:</span>
          <TexMath math={preset.labelTex} display />
        </div>

        <p className="u3-flipper-prompt">
          حدّد الإشارة التي يأخذها كل حدّ بعد حذف القوس المسبوق بإشارة <TexMath math="-" />:
        </p>

        <div className="u3-term-cards" dir="ltr">
          {preset.terms.map((term, idx) => {
            const picked = chosenSigns[idx];
            const termState =
              !checked || !picked
                ? ''
                : picked === term.flippedSign
                  ? ' is-correct'
                  : ' is-wrong';
            return (
              <div key={idx} className={`u3-term-card${termState}`}>
                <div className="u3-term-orig">
                  <span>داخل القوس:</span>
                  <TexMath math={`${term.originalSign}${term.absTex}`} />
                </div>
                <div className="u3-sign-buttons" role="group" aria-label={`إشارة الحد ${idx + 1} بعد حذف القوس`}>
                  <button
                    type="button"
                    className={`u3-sign-btn${picked === '+' ? ' is-picked' : ''}`}
                    onClick={() => {
                      setChosenSigns((prev) => ({ ...prev, [idx]: '+' }));
                      setChecked(false);
                    }}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className={`u3-sign-btn${picked === '-' ? ' is-picked' : ''}`}
                    onClick={() => {
                      setChosenSigns((prev) => ({ ...prev, [idx]: '-' }));
                      setChecked(false);
                    }}
                  >
                    −
                  </button>
                </div>
                <div className="u3-term-preview">
                  <TexMath math={`${picked ?? '?'}\\,${term.absTex}`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="u3-flipper-preview-row">
          <span>عبارتك دون أقواس:</span>
          <TexMath math={buildStudentTex()} />
        </div>
      </div>

      <div className="u3-lab-actions">
        <button
          type="button"
          className="u3-btn u3-btn-primary"
          disabled={!allChosen}
          onClick={() => setChecked(true)}
        >
          <Check size={15} />
          <span>تحقّق من الإشارات</span>
        </button>

        <button type="button" className="u3-btn" onClick={handleReset}>
          <RotateCcw size={15} />
          <span>إعادة</span>
        </button>

        <label className="u3-inline-x-picker">
          <span>اختبر عدديًا عند <TexMath math={`${preset.variableName} = ${xVal}`} />:</span>
          <input
            type="range"
            min={-5}
            max={6}
            step={1}
            value={xVal}
            aria-label="قيمة التعويض للتحقق العددي"
            onChange={(e) => setXVal(Number(e.target.value))}
          />
        </label>
      </div>

      {checked && (
        <div
          className={`u3-lab-feedback ${allCorrect ? 'is-ok' : 'is-warn'}`}
          role="status"
          aria-live="polite"
        >
          <div>
            <strong>{allCorrect ? 'صحيح تمامًا! ' : 'راجع إشارة أحد الحدود: '}</strong>
            <MathText text={preset.ruleExplain} />
          </div>
          {studentValue !== null && (
            <div className="u3-numeric-proof">
              <MathText
                text={`التحقق العددي عند $${preset.variableName} = ${xVal}$: قيمة العبارة الأصلية بالأقواس هي $-(${insideValue}) = ${trueOppositeValue}$، وقيمة عبارتك المختارة هي $${studentValue}$${studentValue === trueOppositeValue ? ' — متساويتان!' : ' — غير متساويتين لأن إحدى الإشارات لم تُقلب!'}`}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default BracketSignFlipperLab;
