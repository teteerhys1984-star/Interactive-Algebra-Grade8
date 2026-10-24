import { useState } from 'react';
import { Check, RotateCcw, Eye } from 'lucide-react';
import { Math as TexMath } from '../math/Math';
import { MathText } from '../math/MathText';

/**
 * مختبر «ما الإشارة المسبقة للقوس؟» (ص50 — بنود «تعلّم» الستة):
 * المرحلة 1: ما الإشارة المسبقة للقوس؟ (+ صريحة أو ضمنية، أو −).
 * المرحلة 2: ما إشارة كل حدّ بعد حذف القوس؟
 * ثم تحقق عددي بأشرطة a و b و c: قيمة العبارة الأصلية مقابل قيمة ما كتبه الطالب.
 */

type Sign = '+' | '-';

interface BCTerm {
  /** كيف يظهر الحد داخل القوس (بإشارته الأصلية)، مثل 'b' أو '-b' */
  originalTex: string;
  /** الإشارة الصحيحة للحد بعد الحذف */
  correctSign: Sign;
  /** القيمة المطلقة للحد عند (a, b, c) */
  mag: (v: { a: number; b: number; c: number }) => number;
  absTex: string;
}

interface BCPreset {
  id: string;
  labelTex: string;
  /** الإشارة الصحيحة المسبقة للقوس */
  precedingSign: Sign;
  precedingHint: string;
  fixedTex: string;
  fixedValue: (v: { a: number; b: number; c: number }) => number;
  terms: BCTerm[];
  resultTex: string;
  ruleText: string;
  /** تسمية الكشف: «إجابة الكتاب» للبيانات المطبوعة، و«الإجابة الصحيحة (المعتمدة)» حيث طباعة الكتاب خطأ موثق. */
  revealLabel: string;
}

const PRESETS: BCPreset[] = [
  {
    id: 'plus-sum',
    labelTex: 'a + (b + c)',
    precedingSign: '+',
    precedingHint: 'قوس مسبق بزائد صريح',
    fixedTex: 'a',
    fixedValue: (v) => v.a,
    terms: [
      { originalTex: 'b', correctSign: '+', mag: (v) => Math.abs(v.b), absTex: 'b' },
      { originalTex: 'c', correctSign: '+', mag: (v) => Math.abs(v.c), absTex: 'c' },
    ],
    resultTex: 'a + b + c',
    ruleText:
      'القوس $(b + c)$ مسبوق بإشارة $+$، فيُحذف دون تغيير محتوياته: $a + (b + c) = a + b + c$.',
    revealLabel: 'إجابة الكتاب',
  },
  {
    id: 'plus-neg',
    labelTex: 'a + (-b + c)',
    precedingSign: '+',
    precedingHint: 'قوس مسبق بزائد صريح — والحد الأول داخله سالب',
    fixedTex: 'a',
    fixedValue: (v) => v.a,
    terms: [
      { originalTex: '-b', correctSign: '-', mag: (v) => Math.abs(v.b), absTex: 'b' },
      { originalTex: 'c', correctSign: '+', mag: (v) => Math.abs(v.c), absTex: 'c' },
    ],
    resultTex: 'a - b + c',
    ruleText:
      'الحذف لا يغيّر المحتويات: $(-b)$ يبقى $-b$ و$c$ يبقى $+c$: $a + (-b + c) = a - b + c$.',
    revealLabel: 'إجابة الكتاب',
  },
  {
    id: 'implicit-plus',
    labelTex: '(a + b) - c',
    precedingSign: '+',
    precedingHint: 'القوس في بداية النسق — ما إشارته المسبقة؟',
    fixedTex: '- c',
    fixedValue: (v) => -v.c,
    terms: [
      { originalTex: 'a', correctSign: '+', mag: (v) => Math.abs(v.a), absTex: 'a' },
      { originalTex: 'b', correctSign: '+', mag: (v) => Math.abs(v.b), absTex: 'b' },
    ],
    resultTex: 'a + b - c',
    ruleText:
      'إشارة $(a + b)$ هي $+$ **ضمنًا** (لأنه في بداية النسق)، فيُحذف دون تغيير: $(a + b) - c = a + b - c$. (تنبيه: الكتاب طباعة البند الثالث $a + b + c$ وهو خطأ مطبعي موثق.)',
    revealLabel: 'الإجابة الصحيحة (المعتمدة)',
  },
  {
    id: 'minus-sum',
    labelTex: 'c - (a + b)',
    precedingSign: '-',
    precedingHint: 'قوس مسبق بناقص',
    fixedTex: 'c',
    fixedValue: (v) => v.c,
    terms: [
      { originalTex: 'a', correctSign: '-', mag: (v) => Math.abs(v.a), absTex: 'a' },
      { originalTex: 'b', correctSign: '-', mag: (v) => Math.abs(v.b), absTex: 'b' },
    ],
    resultTex: 'c - a - b',
    ruleText:
      'الطرح من $(a + b)$ = الجمع مع نظيره $-a - b$: $c - (a + b) = c - a - b$.',
    revealLabel: 'إجابة الكتاب',
  },
  {
    id: 'minus-diff',
    labelTex: 'c - (a - b)',
    precedingSign: '-',
    precedingHint: 'قوس مسبق بناقص',
    fixedTex: 'c',
    fixedValue: (v) => v.c,
    terms: [
      { originalTex: 'a', correctSign: '-', mag: (v) => Math.abs(v.a), absTex: 'a' },
      { originalTex: '-b', correctSign: '+', mag: (v) => Math.abs(v.b), absTex: 'b' },
    ],
    resultTex: 'c - a + b',
    ruleText:
      'الطرح من $(a - b)$ = الجمع مع نظيره $-a + b$: $c - (a - b) = c - a + b$ (انتبه: $b$ صارت موجبة!).',
    revealLabel: 'إجابة الكتاب',
  },
  {
    id: 'minus-neg',
    labelTex: 'c - (-a + b)',
    precedingSign: '-',
    precedingHint: 'قوس مسبق بناقص — ويبدأ بحد سالب',
    fixedTex: 'c',
    fixedValue: (v) => v.c,
    terms: [
      { originalTex: '-a', correctSign: '+', mag: (v) => Math.abs(v.a), absTex: 'a' },
      { originalTex: 'b', correctSign: '-', mag: (v) => Math.abs(v.b), absTex: 'b' },
    ],
    resultTex: 'c + a - b',
    ruleText:
      'نظير $(-a + b)$ هو $+a - b$: $c - (-a + b) = c + a - b$ (كل حد يقلب إشارته، حتى السالب!).',
    revealLabel: 'إجابة الكتاب',
  },
];

const DEFAULTS = { a: 2, b: 3, c: 1 };

interface LabState {
  precedingSign: Sign | null;
  termSigns: Sign[];
  checked: boolean;
  revealed: boolean;
}

const freshState = (): LabState => ({
  precedingSign: null,
  termSigns: PRESETS[0].terms.map(() => '+'),
  checked: false,
  revealed: false,
});

export function BracketCaseLab() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [state, setState] = useState<LabState>(freshState);
  const [aVal, setAVal] = useState(DEFAULTS.a);
  const [bVal, setBVal] = useState(DEFAULTS.b);
  const [cVal, setCVal] = useState(DEFAULTS.c);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const vals = { a: aVal, b: bVal, c: cVal };

  const selectPreset = (p: BCPreset) => {
    setPresetId(p.id);
    setState({ ...freshState(), termSigns: p.terms.map(() => '+') });
  };

  const originalValue = preset.fixedValue(vals) + preset.terms.reduce((s, t) => s + (t.correctSign === '+' ? 1 : -1) * t.mag(vals), 0);
  const studentValue =
    preset.fixedValue(vals) + preset.terms.reduce((s, t, i) => s + (state.termSigns[i] === '+' ? 1 : -1) * t.mag(vals), 0);

  const stage1Ok = state.precedingSign === preset.precedingSign;
  const stage2Ok = preset.terms.every((t, i) => state.termSigns[i] === t.correctSign);
  const allOk = stage1Ok && stage2Ok;
  const canCheck = state.precedingSign !== null;

  const studentTex =
    preset.fixedTex +
    preset.terms.map((t, i) => ` ${state.termSigns[i] === '+' ? '+' : '-'} ${t.absTex}`).join('');

  const setPreceding = (s: Sign) => setState((prev) => ({ ...prev, precedingSign: s, checked: false }));
  const setTermSign = (idx: number, s: Sign) =>
    setState((prev) => {
      const termSigns = prev.termSigns.slice();
      termSigns[idx] = s;
      return { ...prev, termSigns, checked: false };
    });

  return (
    <section className="u3-lab-card u3l2-lab" dir="rtl">
      <div className="u3-lab-head">
        <div>
          <span className="u3-lab-eyebrow">مختبر (ص50 — تعلّم)</span>
          <h3 className="u3-lab-title">ما الإشارة المسبقة للقوس؟ — الحالات الست</h3>
        </div>
      </div>

      <p className="u3l2-lab-intro">
        <MathText text="في كل حالة: (1) حدّد الإشارة المسبقة للقوس، (2) حدّد إشارة كل حدّ بعد الحذف، ثم (3) تحقّق رقميًا من أشرطة $a$ و$b$ و$c$ — القيمة الأصلية يجب أن تساوي قيمة ما كتبت." />
      </p>

      <div className="u3-preset-pills" role="tablist" aria-label="اختر حالة من حالات بنود تعلّم">
        {PRESETS.map((p) => (
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

      <div className="u3-flipper-source">
        <span className="u3-flipper-label">العبارة بالأقواس:</span>
        <TexMath math={preset.labelTex} display />
        <span className="u3l2-hint">{preset.precedingHint}</span>
      </div>

      {/* المرحلة 1: الإشارة المسبقة */}
      <p className="u3-flipper-prompt">
        <strong>المرحلة 1:</strong> ما الإشارة المسبقة للقوس؟
      </p>
      <div className="u3l2-sign-row" role="group" aria-label="الإشارة المسبقة للقوس">
        <button
          type="button"
          className={`u3-sign-btn u3l2-big-sign${state.precedingSign === '+' ? ' is-picked' : ''}`}
          onClick={() => setPreceding('+')}
          aria-pressed={state.precedingSign === '+'}
        >
          <span dir="ltr">+</span>
          <small>زائد</small>
        </button>
        <button
          type="button"
          className={`u3-sign-btn u3l2-big-sign${state.precedingSign === '-' ? ' is-picked' : ''}`}
          onClick={() => setPreceding('-')}
          aria-pressed={state.precedingSign === '-'}
        >
          <span dir="ltr">−</span>
          <small>ناقص</small>
        </button>
      </div>

      {/* المرحلة 2: إشارة كل حد */}
      <p className="u3-flipper-prompt">
        <strong>المرحلة 2:</strong> بعد حذف القوس، ما إشارة كل حدّ؟
      </p>
      <div className="u3-term-cards" dir="ltr">
        {preset.terms.map((term, idx) => {
          const picked = state.termSigns[idx];
          const termState = state.checked ? (picked === term.correctSign ? ' is-correct' : ' is-wrong') : '';
          return (
            <div key={idx} className={`u3-term-card${termState}`}>
              <div className="u3-term-orig">
                <span>داخل القوس:</span>
                <TexMath math={term.originalTex} />
              </div>
              <div className="u3-sign-buttons" role="group" aria-label={`إشارة الحد ${idx + 1} بعد حذف القوس`}>
                <button
                  type="button"
                  className={`u3-sign-btn${picked === '+' ? ' is-picked' : ''}`}
                  onClick={() => setTermSign(idx, '+')}
                >
                  +
                </button>
                <button
                  type="button"
                  className={`u3-sign-btn${picked === '-' ? ' is-picked' : ''}`}
                  onClick={() => setTermSign(idx, '-')}
                >
                  −
                </button>
              </div>
              <div className="u3-term-preview">
                <TexMath math={`${picked === '+' ? '+' : '-'}\\,${term.absTex}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="u3-flipper-preview-row">
        <span>عبارتك دون أقواس:</span>
        <TexMath math={studentTex} />
      </div>

      <div className="u3-lab-actions">
        <button type="button" className="u3-btn u3-btn-primary" disabled={!canCheck} onClick={() => setState((p) => ({ ...p, checked: true }))} aria-label="تحقق من الإشارات">
          <Check size={15} /> تحقّق
        </button>
        <button
          type="button"
          className="u3-btn"
          onClick={() => setState({ ...freshState(), termSigns: preset.terms.map(() => '+') })}
          aria-label="إعادة حالة هذه العبارة"
        >
          <RotateCcw size={15} /> إعادة
        </button>
        <button
          type="button"
          className="u3-btn"
          onClick={() => setState((p) => ({ ...p, revealed: !p.revealed }))}
          aria-label={state.revealed ? 'إخفاء الإجابة' : 'إظهار الإجابة'}
        >
          <Eye size={15} /> {state.revealed ? 'إخفاء الإجابة' : 'إظهار الإجابة'}
        </button>
      </div>

      <div className="u3l2-numeric-row" dir="rtl">
        <label>
          <span>قيمة a:</span>
          <input type="range" min={-4} max={4} step={1} value={aVal} aria-label="قيمة a للتحقق العددي" onChange={(e) => setAVal(Number(e.target.value))} />
          <span dir="ltr">{aVal}</span>
        </label>
        <label>
          <span>قيمة b:</span>
          <input type="range" min={-4} max={4} step={1} value={bVal} aria-label="قيمة b للتحقق العددي" onChange={(e) => setBVal(Number(e.target.value))} />
          <span dir="ltr">{bVal}</span>
        </label>
        <label>
          <span>قيمة c:</span>
          <input type="range" min={-4} max={4} step={1} value={cVal} aria-label="قيمة c للتحقق العددي" onChange={(e) => setCVal(Number(e.target.value))} />
          <span dir="ltr">{cVal}</span>
        </label>
      </div>

      {state.checked && (
        <div className={`u3-lab-feedback ${allOk ? 'is-ok' : 'is-warn'}`} role="status" aria-live="polite">
          <div>
            <strong>{allOk ? 'صحيح تمامًا! ' : 'راجع إجابتك: '}</strong>
            <MathText text={allOk ? preset.ruleText : stage1Ok ? 'الإشارة المسبقة صحيحة، لكن إشارات بعض الحدود بعد الحذف غير صحيحة.' : `الإشارة المسبقة للقوس في ${preset.labelTex} هي ${preset.precedingSign === '+' ? '+ (مع ما قد يكون ضمنيًا)' : '−'} — ارجع المرحلة 1 ثم حدّد الإشارات.`} />
          </div>
          <div className="u3-numeric-proof">
            <MathText
              text={`التحقق العددي عند $a = ${aVal}$ و$b = ${bVal}$ و$c = ${cVal}$: قيمة العبارة الأصلية $${preset.labelTex}$ هي $${originalValue}$، وقيمة عبارتك $${studentValue}$${studentValue === originalValue ? ' — متساويتان هنا!' : ' — غير متساويتين (انتبه: قد تتطابق القيم عند قيم خاصة، لكن القاعدة هي ما يضمن التطابق لكل الأعداد).'}`}
            />
          </div>
          {state.revealed && (
            <div className="u3l2-reveal-inline">
              <strong>{preset.revealLabel}: </strong>
              <TexMath math={`${preset.labelTex} = ${preset.resultTex}`} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
