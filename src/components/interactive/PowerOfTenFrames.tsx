import React, { useMemo, useState } from 'react';
import { Math as Formula } from '../math/Math';
import { Check, RotateCcw, ArrowLeft } from 'lucide-react';

/**
 * إطارات نشاط «حساب قوى العدد 10» — الصفحة 26 من الكتاب.
 *
 * الشكل في الكتاب يعرض سبعة إطارات: 1000، 100، 10، 1، 0.1، 0.01، 0.001،
 * وعلى الطالب أن يكتب في كل إطار الأس المناسب للعدد 10، وأن يكمل في الإطارات
 * العشرية الصورة الكسرية 1/10^n. هذا المكوّن يحوّل الشكل إلى تمرين تفاعلي:
 * إجابة الطالب هي التي تُقارن، ولا يُعرَض الأس الصحيح قبل الضغط على «تحقّق».
 *
 * الأسهم بين الإطارات (÷10 نحو اليمين، ×10 نحو اليسار) هي النمط الذي يكشفه
 * النشاط، وتُعرَض في شريط مستقل لأنها جزء من تعليمة الكتاب لا زخرفة.
 */

interface Frame {
  id: string;
  value: string;
  exponent: number;
  /** الإطارات العشرية في الكتاب تحمل أيضًا الصورة 1/10^n. */
  showsFraction: boolean;
}

const FRAMES: Frame[] = [
  { id: 'f1000', value: '1000', exponent: 3, showsFraction: false },
  { id: 'f100', value: '100', exponent: 2, showsFraction: false },
  { id: 'f10', value: '10', exponent: 1, showsFraction: false },
  { id: 'f1', value: '1', exponent: 0, showsFraction: false },
  { id: 'f01', value: '0.1', exponent: -1, showsFraction: true },
  { id: 'f001', value: '0.01', exponent: -2, showsFraction: true },
  { id: 'f0001', value: '0.001', exponent: -3, showsFraction: true },
];

/** يقبل ‎3‎ أو ‎-3‎ أو ‎−3‎ أو ‎+3‎ (مع تجاهل المسافات). */
function parseExponent(raw: string): number | null {
  const cleaned = raw.replace(/[\s\u2212]/g, '-').replace(/^\+/, '');
  if (!/^-?\d+$/.test(cleaned)) return null;
  return Number(cleaned);
}

export const PowerOfTenFrames: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const results = useMemo(
    () =>
      FRAMES.map((frame) => {
        const parsed = parseExponent(answers[frame.id] ?? '');
        return { frame, parsed, correct: parsed === frame.exponent };
      }),
    [answers],
  );

  const answeredCount = results.filter((entry) => entry.parsed !== null).length;
  const correctCount = results.filter((entry) => entry.correct).length;
  const allCorrect = correctCount === FRAMES.length;

  const setAnswer = (id: string, value: string) => {
    if (checked) setChecked(false);
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const check = () => setChecked(true);

  const reset = () => {
    setAnswers({});
    setChecked(false);
  };

  return (
    <section className="power-frames" aria-label="نشاط إطارات قوى العدد 10">
      <p className="power-frames-intro">
        في كل إطار تجد العدد نفسه مكتوبًا بقوة للعدد <span dir="ltr">10</span>. اكتب الأس في كل إطار، ثم اضغط
        «تحقّق». الإطارات العشرية تحتاج أيضًا إلى الأس نفسه في الصورة الكسرية.
      </p>

      <div className="power-frames-arrows" aria-hidden="true">
        <span className="power-frames-arrow">× 10</span>
        <ArrowLeft size={16} />
        <span className="power-frames-arrow">× 10</span>
        <ArrowLeft size={16} />
        <span className="power-frames-arrow">× 10</span>
        <ArrowLeft size={16} />
        <span className="power-frames-arrow">× 10</span>
        <ArrowLeft size={16} />
        <span className="power-frames-arrow">× 10</span>
        <ArrowLeft size={16} />
        <span className="power-frames-arrow">× 10</span>
      </div>

      <div className="power-frames-grid">
        {results.map(({ frame, parsed, correct }) => {
          const stateClass = !checked || parsed === null ? '' : correct ? ' is-correct' : ' is-wrong';
          const inputId = `pff-${frame.id}`;
          const preview = parsed === null ? '\\square' : `10^{${parsed}}`;
          const fractionPreview =
            parsed === null ? '\\frac{1}{10^{\\square}}' : `\\frac{1}{10^{${parsed}}}`;
          return (
            <div key={frame.id} className={`power-frames-cell${stateClass}`}>
              <div className="power-frames-value" dir="ltr">
                {frame.value}
              </div>

              <label className="power-frames-label" htmlFor={inputId}>
                الأس
              </label>
              <input
                id={inputId}
                className="power-frames-input"
                dir="ltr"
                inputMode="numeric"
                autoComplete="off"
                value={answers[frame.id] ?? ''}
                onChange={(event) => setAnswer(frame.id, event.target.value)}
                aria-label={`أس العدد ${frame.value}`}
                readOnly={checked && correct}
              />

              <div className="power-frames-preview" aria-hidden="true">
                <Formula math={preview} />
              </div>

              {frame.showsFraction && (
                <div className="power-frames-preview power-frames-fraction" aria-hidden="true">
                  <Formula math={fractionPreview} />
                </div>
              )}

              {checked && parsed !== null && (
                <span className={`power-frames-badge ${correct ? 'is-ok' : 'is-bad'}`}>
                  {correct ? 'صحيح' : `الصحيح ${frame.exponent}`}
                </span>
              )}
              {checked && parsed === null && (
                <span className="power-frames-badge is-bad">اكتب عددًا صحيحًا</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="power-frames-controls">
        <button
          type="button"
          className="power-frames-button"
          onClick={check}
          disabled={answeredCount === 0 || checked}
        >
          <Check size={16} />
          <span>تحقّق</span>
        </button>
        <button type="button" className="power-frames-reset" onClick={reset}>
          <RotateCcw size={16} />
          <span>إعادة</span>
        </button>
        <span className="power-frames-count" aria-live="polite">
          أجبت عن {answeredCount} من {FRAMES.length}
          {checked ? ` — الصحيح ${correctCount} من ${FRAMES.length}` : ''}
        </span>
      </div>

      {checked && (
        <div className={`power-frames-feedback${allCorrect ? ' is-ok' : ''}`}>
          {allCorrect ? (
            <p>
              أكملت الإطارات السبعة. لاحظ النمط: عند الانتقال من إطار إلى الذي على يمينه نقسم على{' '}
              <span dir="ltr">10</span> فينقص الأس واحدًا، وعند الانتقال إلى الذي على يساره نضرب في{' '}
              <span dir="ltr">10</span> فيزيد الأس واحدًا. ولهذا <Formula math="10^{0}=1" /> تقع بين{' '}
              <Formula math="10^{1}=10" /> و <Formula math="10^{-1}=0.1" />.
            </p>
          ) : (
            <p>
              راجع الإطارات المعلَّمة بالأحمر: الأس الموجب يعني أصفارًا بعد الواحد، والأس السالب يعني أن الواحد
              يقع بعد الفاصلة. يمكنك أيضًا استعمال سُلّم القوى أسفل هذه الإطارات.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default PowerOfTenFrames;
