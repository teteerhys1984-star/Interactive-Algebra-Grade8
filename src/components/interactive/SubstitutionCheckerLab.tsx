import { useState } from 'react';
import { Check, RotateCcw, Eye } from 'lucide-react';
import { Math as TexMath } from '../math/Math';
import { MathText } from '../math/MathText';

/**
 * مختبر «اختبر المساواة بوضع x = 1» (ص51 — تحقّق ② 2 وتدرّب ③):
 * أربع مساوات من الكتاب: يعوّض الطالب x في الطرفين بنفسه، يقارن الناتجين،
 * ثم يجرّب قيمًا أخرى من شريط x. التأكيد البيداغوجي: التطابق عند قيمة واحدة
 * يدعم التجربة ولا يبرهن المطابقة العامة — الرمز هو ما يبرهنها.
 */

interface SCPreset {
  id: string;
  label: string;
  leftTex: string;
  rightTex: string;
  evalLeft: (x: number) => number;
  evalRight: (x: number) => number;
  sourceRef: string;
}

const PRESETS: SCPreset[] = [
  {
    id: 'example',
    label: 'المثال (ص51)',
    leftTex: '3 - (2x - 5 + x^2)',
    rightTex: '3 - 2x + 5 - x^2',
    evalLeft: (x) => 3 - (2 * x - 5 + x * x),
    evalRight: (x) => 3 - 2 * x + 5 - x * x,
    sourceRef: 'ص51 • مثال',
  },
  {
    id: 'check-a',
    label: 'تحقّق ② (ص51)',
    leftTex: '5x - (x^2 + 1 - x)',
    rightTex: '5x - x^2 - 1 + x',
    evalLeft: (x) => 5 * x - (x * x + 1 - x),
    evalRight: (x) => 5 * x - x * x - 1 + x,
    sourceRef: 'ص51 • تحقّق من فهمك ②',
  },
  {
    id: 'drill-b',
    label: 'تدرّب ③ — B (ص51)',
    leftTex: '-(2x + 5) + (x - 3)',
    rightTex: '-2x - 5 + x - 3',
    evalLeft: (x) => -(2 * x + 5) + (x - 3),
    evalRight: (x) => -2 * x - 5 + x - 3,
    sourceRef: 'ص51 • تدرّب ③',
  },
  {
    id: 'drill-c',
    label: 'تدرّب ③ — C (ص51)',
    leftTex: '(x - 1) - (7x + 3)',
    rightTex: 'x - 1 - 7x - 3',
    evalLeft: (x) => (x - 1) - (7 * x + 3),
    evalRight: (x) => x - 1 - 7 * x - 3,
    sourceRef: 'ص51 • تدرّب ③ ③',
  },
];

interface LabState {
  lhs: string;
  rhs: string;
  checked: boolean;
  revealed: boolean;
}

const freshState = (): LabState => ({ lhs: '', rhs: '', checked: false, revealed: false });

function parseNumber(input: string): number | null {
  const s = input
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/٫/g, '.')
    .replace(/\s+/g, '');
  if (!s) return null;
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
}

export function SubstitutionCheckerLab() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [state, setState] = useState<LabState>(freshState);
  const [xVal, setXVal] = useState(1);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const leftTrue = preset.evalLeft(xVal);
  const rightTrue = preset.evalRight(xVal);

  const selectPreset = (id: string) => {
    setPresetId(id);
    setState(freshState());
  };

  const lhsNum = parseNumber(state.lhs);
  const rhsNum = parseNumber(state.rhs);
  const lhsOk = lhsNum === leftTrue;
  const rhsOk = rhsNum === rightTrue;
  const allOk = lhsOk && rhsOk;

  const check = () => setState((p) => ({ ...p, checked: true }));
  const reset = () => setState(freshState());

  return (
    <section className="u3-lab-card u3l2-lab" dir="rtl">
      <div className="u3-lab-head">
        <div>
          <span className="u3-lab-eyebrow">مختبر (ص51 — تحقّق وتدرّب)</span>
          <h3 className="u3-lab-title">اختبر المساواة بوضع x = 1</h3>
        </div>
      </div>

      <p className="u3l2-lab-intro">
        <MathText text="عوض قيمة $x$ في الطرف الأيسر (بالأقواس) وفي الطرف الأيمن (بدون أقواس)، ثم قارن: هل الطرفان متطابقان عند هذه القيمة؟" />
      </p>

      <div className="u3-preset-pills" role="tablist" aria-label="اختر مساواة من الكتاب">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={p.id === presetId}
            className={`u3-preset-pill${p.id === presetId ? ' is-active' : ''}`}
            onClick={() => selectPreset(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="u3l2-eq-display" dir="ltr">
        <div className="u3l2-eq-side">
          <span className="u3l2-eq-tag">الطرف الأيسر (بالأقواس)</span>
          <TexMath math={preset.leftTex} display />
        </div>
        <div className="u3l2-eq-side">
          <span className="u3l2-eq-tag">الطرف الأيمن (بدون أقواس)</span>
          <TexMath math={preset.rightTex} display />
        </div>
      </div>

      <div className="u3l2-numeric-row" dir="rtl">
        <label className="u3l2-x-slider">
          <span>قيمة x:</span>
          <input type="range" min={-3} max={3} step={1} value={xVal} aria-label="قيمة x للتعويض" onChange={(e) => setXVal(Number(e.target.value))} />
          <span dir="ltr">{xVal}</span>
        </label>
      </div>

      <div className="u3l2-input-row">
        <label className="u3l2-field">
          <span className="u3l2-field-label">قيمة الطرف الأيسر عند x = {xVal}</span>
          <input
            className="u3l2-input"
            dir="ltr"
            inputMode="decimal"
            placeholder="…"
            value={state.lhs}
            onChange={(e) => setState((p) => ({ ...p, lhs: e.target.value, checked: false }))}
            aria-label="قيمة الطرف الأيسر"
          />
        </label>
        <label className="u3l2-field">
          <span className="u3l2-field-label">قيمة الطرف الأيمن عند x = {xVal}</span>
          <input
            className="u3l2-input"
            dir="ltr"
            inputMode="decimal"
            placeholder="…"
            value={state.rhs}
            onChange={(e) => setState((p) => ({ ...p, rhs: e.target.value, checked: false }))}
            aria-label="قيمة الطرف الأيمن"
          />
        </label>
      </div>

      <div className="u3-lab-actions">
        <button type="button" className="u3-btn u3-btn-primary" onClick={check} aria-label="تحقق من قيم الطرفين">
          <Check size={15} /> تحقّق من القيم
        </button>
        <button type="button" className="u3-btn" onClick={reset} aria-label="إعادة الضبط">
          <RotateCcw size={15} /> إعادة
        </button>
        <button type="button" className="u3-btn" onClick={() => setState((p) => ({ ...p, revealed: !p.revealed }))} aria-label="عرض القيم المحسوبة">
          <Eye size={15} /> {state.revealed ? 'إخفاء القيم المحسوبة' : 'عرض القيم المحسوبة'}
        </button>
      </div>

      {state.checked && (
        <div className={`u3-lab-feedback ${allOk ? 'is-ok' : 'is-warn'}`} role="status" aria-live="polite">
          <div>
            <strong>{allOk ? 'الطرفان متطابقان عند هذه القيمة! ' : 'راجع حسابك: '}</strong>
            <MathText
              text={
                allOk
                  ? `بوضع $x = ${xVal}$: الطرف الأيسر $= ${leftTrue}$ والطرف الأيمن $= ${rightTrue}$ — التطابق **يدعم** صحة الحذف عند هذه القيمة. لتقوية قناعتك جرّب قيمتين أخريين من شريط $x$.`
                  : `احسب كل طرف عند $x = ${xVal}$ بنفسك (بدون آلة حاسبة إن أمكن): عوّض $x$ داخل الأقواس أولًا ثم أتمم النسق.`
              }
            />
          </div>
          <div className="u3-numeric-proof">
            <MathText text="تذكير من المنصة: التطابق عند قيمة واحدة ليس برهانًا للمطابقة العامة — القاعدة الرمزية (حذف القوس المسبوق بـ$-$ = جمع النظير) هي التي تثبت المساواة لكل $x$. التجربة العددية تأكيد سريع على صحة الحذف." />
          </div>
          {state.revealed && (
            <div className="u3l2-reveal-inline">
              <MathText
                text={`القيم عند $x = ${xVal}$: الطرف الأيسر $= ${preset.leftTex} = ${leftTrue}$، والطرف الأيمن $= ${preset.rightTex} = ${rightTrue}$.`}
              />
            </div>
          )}
        </div>
      )}

      <p className="u3l2-source-ref">{preset.sourceRef}</p>
    </section>
  );
}
