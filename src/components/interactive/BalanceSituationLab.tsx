import { useState } from 'react';
import { Check, RotateCcw, Eye } from 'lucide-react';
import { MathText } from '../math/MathText';

/**
 * مختبر المواقف التفاعلي (ص50 — نشاط «بيان معنى حذف الأقواس»، السؤال 1):
 *  • الجزء 1: أشر إلى العبارتين اللتين تسمحان بحساب رصيد ماهر (من 4 مطبوعة).
 *  • الجزء 2: اكتب عبارتين مختلفتين لسلمي (يُقبل كل زوج من صيغ مختلفة صحيحة
 *             تستخدم الأرقام الثلاثة 1250 و350 و225 وتعطي 675).
 *  • الجزء 3: احسب الرصيد الجديد لكل من ماهر (1375) وسلمى (675).
 *
 * مبنٍ بواجهة عربية RTL وحقول LTR معزولة للأرقام، ونفس نمط u3-lab-* المشترك.
 */

const MAHER_OPTIONS = [
  { id: 0, label: '①', expr: '1250 + 350 - 225' },
  { id: 1, label: '②', expr: '1250 - 350 + 225' },
  { id: 2, label: '③', expr: '1250 - 350 - 225' },
  { id: 3, label: '④', expr: '1250 + (350 - 225)' },
];

const MAHER_CORRECT = new Set([0, 3]);
const MAHER_BALANCE = 1375;
const SALAMI_BALANCE = 675;
const REQUIRED_NUMBERS = ['1250', '350', '225'];

/** محوّل آمن لعبارات الجمع والطرح (أرقام عشرية + أقواس + ناقص أولي) — بلا eval. */
export function evaluateArithmetic(input: string): number | null {
  const s = input
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/٫/g, '.')
    .replace(/\s+/g, '')
    .trim();
  if (!s) return null;
  let i = 0;

  function parseExpr(): number {
    let v = parseTerm();
    for (;;) {
      const c = s[i];
      if (c === '+') {
        i += 1;
        v += parseTerm();
      } else if (c === '-') {
        i += 1;
        v -= parseTerm();
      } else break;
    }
    return v;
  }

  function parseTerm(): number {
    const c = s[i];
    if (c === '-') {
      i += 1;
      return -parseTerm();
    }
    if (c === '(') {
      i += 1;
      const v = parseExpr();
      if (s[i] !== ')') throw new Error('unbalanced');
      i += 1;
      return v;
    }
    const m = /^\d+(?:\.\d+)?/.exec(s.slice(i));
    if (!m) throw new Error('bad-number');
    i += m[0].length;
    return Number(m[0]);
  }

  try {
    const v = parseExpr();
    if (i !== s.length || !Number.isFinite(v)) return null;
    return v;
  } catch {
    return null;
  }
}

/** هل تستخدم العبارة الأرقام الثلاثة المطلوبة بالضبط (بغض النظر عن الترتيب)؟ */
function literalsMatch(expr: string): boolean {
  const lits = (
    expr
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
      .replace(/٫/g, '.')
      .match(/\d+(?:\.\d+)?/g) ?? []
  )
    .slice()
    .sort();
  return (
    lits.length === REQUIRED_NUMBERS.length &&
    REQUIRED_NUMBERS
      .slice()
      .sort()
      .every((n, i) => lits[i] === n)
  );
}

type PartState = 'idle' | 'ok' | 'warn';

interface PartFeedback {
  state: PartState;
  message: string;
}

function PartFeedbackLine({ state, message }: { state: PartState; message: string }) {
  if (state === 'idle') return null;
  return (
    <p className={`u3-lab-feedback ${state === 'ok' ? 'is-ok' : 'is-warn'}`} role="status">
      <MathText text={message} />
    </p>
  );
}

export function BalanceSituationLab() {
  const [maherPicked, setMaherPicked] = useState<Set<number>>(new Set());
  const [part1, setPart1] = useState<PartFeedback>({ state: 'idle', message: '' });
  const [salami1, setSalami1] = useState('');
  const [salami2, setSalami2] = useState('');
  const [part2, setPart2] = useState<PartFeedback>({ state: 'idle', message: '' });
  const [maherBalance, setMaherBalance] = useState('');
  const [salamiBalance, setSalamiBalance] = useState('');
  const [part3, setPart3] = useState<PartFeedback>({ state: 'idle', message: '' });
  const [revealed, setRevealed] = useState(false);

  const allOk = part1.state === 'ok' && part2.state === 'ok' && part3.state === 'ok';

  const pickMaher = (id: number) => {
    setMaherPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const checkPart1 = () => {
    const exact =
      maherPicked.size === 2 && [...maherPicked].every((n) => MAHER_CORRECT.has(n));
    setPart1(
      exact
        ? {
            state: 'ok',
            message:
              'إجابة صحيحة: ① و④. العبارة ② تطرح المكافأة وتضيف الثمن ($1125$) و③ تطرح المبلغين معًا ($675$) — كلاهما لا يصف موقف ماهر.',
          }
        : {
            state: 'warn',
            message:
              'جرّب مرة أخرى: ما العمليات التي وقعت في قصة ماهر بالترتيب؟ (المكافأة = دخل $+350$، الكتاب = صرف $-225$).',
          },
    );
  };

  const checkPart2 = () => {
    const v1 = evaluateArithmetic(salami1);
    const v2 = evaluateArithmetic(salami2);
    const litOk1 = literalsMatch(salami1);
    const litOk2 = literalsMatch(salami2);
    const diff = salami1.replace(/\s+/g, '') !== salami2.replace(/\s+/g, '');
    if (v1 === SALAMI_BALANCE && v2 === SALAMI_BALANCE && litOk1 && litOk2 && diff) {
      setPart2({
        state: 'ok',
        message:
          'عبارتان صحيحتان مختلفتان (كلاهما = 675). لاحظ: $1250 - (350 + 225) = 1250 - 350 - 225$ — هذه بداية فهم «حذف الأقواس»!',
      });
    } else {
      const problems: string[] = [];
      if (v1 !== SALAMI_BALANCE) problems.push('العبارة الأولى لا تعطي 675 (أو غير مكتملة)');
      if (v2 !== SALAMI_BALANCE) problems.push('العبارة الثانية لا تعطي 675 (أو غير مكتملة)');
      if (!litOk1 && v1 === SALAMI_BALANCE) problems.push('العبارة الأولى يجب أن تستخدم الأرقام 1250 و350 و225');
      if (!litOk2 && v2 === SALAMI_BALANCE) problems.push('العبارة الثانية يجب أن تستخدم الأرقام 1250 و350 و225');
      if (problems.length === 0) problems.push('العبارتان يجب أن تكونا مختلفتين');
      setPart2({
        state: 'warn',
        message: `${problems.join(' • ')} — تذكير: سلمي أنفقت المبلغين (طرحان: $-350$ و$-225$).`,
      });
    }
  };

  const checkPart3 = () => {
    const mh = evaluateArithmetic(maherBalance);
    const sl = evaluateArithmetic(salamiBalance);
    if (mh === MAHER_BALANCE && sl === SALAMI_BALANCE) {
      setPart3({
        state: 'ok',
        message:
          'تأكدنا: رصيد ماهر الجديد $1375$ ليرة ورصيد سلمي الجديد $675$ ليرة.',
      });
    } else {
      setPart3({
        state: 'warn',
        message:
          'تأكدنا: احسب كل رصيد من عبارته الصحيحة (ماهر $1250 + 350 - 225$، سلمي $1250 - 350 - 225$).',
      });
    }
  };

  const reset = () => {
    setMaherPicked(new Set());
    setSalami1('');
    setSalami2('');
    setMaherBalance('');
    setSalamiBalance('');
    setPart1({ state: 'idle', message: '' });
    setPart2({ state: 'idle', message: '' });
    setPart3({ state: 'idle', message: '' });
  };

  return (
    <div className="u3-lab-card u3l2-lab" dir="rtl">
      <div className="u3l2-lab-head">
        <span className="u3l2-lab-title">مختبر المواقف (ص50 — النشاط 1)</span>
        {allOk && <span className="u3l2-badge-ok">✓ أكملت النشاط كاملًا</span>}
      </div>

      {/* الجزء 1: اختيار عبارات ماهر */}
      <div className="u3l2-section">
        <p className="u3l2-q">
          <strong>1.</strong> من العبارات الآتية فقط تسمحن بحساب رصيد ماهر — أشر إليهما:
        </p>
        <div className="u3l2-option-grid">
          {MAHER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`u3l2-option ${maherPicked.has(opt.id) ? 'is-picked' : ''}`}
              onClick={() => pickMaher(opt.id)}
              aria-pressed={maherPicked.has(opt.id)}
            >
              <span className="u3l2-option-label">{opt.label}</span>
              <span className="u3l2-option-expr" dir="ltr">
                {opt.expr}
              </span>
            </button>
          ))}
        </div>
        <div className="u3l2-actions">
          <button type="button" className="u3-btn-primary" onClick={checkPart1} aria-label="تحقق من اختيار ماهر">
            <Check size={16} /> تحقّق من اختيارك
          </button>
        </div>
        <PartFeedbackLine state={part1.state} message={part1.message} />
      </div>

      {/* الجزء 2: عبارتا سلمي */}
      <div className="u3l2-section">
        <p className="u3l2-q">
          <strong>2.</strong> اكتب عبارتين مختلفتين، تسمح كل منهما بحساب رصيد سلمي (استعمل الأرقام 1250 و350 و225):
        </p>
        <div className="u3l2-input-row">
          <input
            className="u3l2-input"
            dir="ltr"
            inputMode="text"
            placeholder="1250 - 350 - 225"
            value={salami1}
            onChange={(e) => setSalami1(e.target.value)}
            aria-label="العبارة الأولى لرصيد سلمي"
          />
          <input
            className="u3l2-input"
            dir="ltr"
            inputMode="text"
            placeholder="1250 - (350 + 225)"
            value={salami2}
            onChange={(e) => setSalami2(e.target.value)}
            aria-label="العبارة الثانية لرصيد سلمي"
          />
        </div>
        <div className="u3l2-actions">
          <button type="button" className="u3-btn-primary" onClick={checkPart2} aria-label="تحقق من عبارات سلمي">
            <Check size={16} /> تحقّق من عبارتيك
          </button>
        </div>
        <PartFeedbackLine state={part2.state} message={part2.message} />
      </div>

      {/* الجزء 3: الرصيدين الجديدين */}
      <div className="u3l2-section">
        <p className="u3l2-q">
          <strong>3.</strong> احسب الرصيد الجديد لكل من ماهر وسلمى:
        </p>
        <div className="u3l2-input-row">
          <label className="u3l2-field">
            <span className="u3l2-field-label">رصيد ماهر الجديد</span>
            <input
              className="u3l2-input"
              dir="ltr"
              inputMode="decimal"
              placeholder="…"
              value={maherBalance}
              onChange={(e) => setMaherBalance(e.target.value)}
              aria-label="رصيد ماهر الجديد"
            />
          </label>
          <label className="u3l2-field">
            <span className="u3l2-field-label">رصيد سلمي الجديد</span>
            <input
              className="u3l2-input"
              dir="ltr"
              inputMode="decimal"
              placeholder="…"
              value={salamiBalance}
              onChange={(e) => setSalamiBalance(e.target.value)}
              aria-label="رصيد سلمي الجديد"
            />
          </label>
        </div>
        <div className="u3l2-actions">
          <button type="button" className="u3-btn-primary" onClick={checkPart3} aria-label="تحقق من الرصيدين">
            <Check size={16} /> تحقّق من الرصيدين
          </button>
        </div>
        <PartFeedbackLine state={part3.state} message={part3.message} />
      </div>

      {/* الإجابات والتحقق */}
      {revealed && (
        <div className="u3l2-reveal">
          <h4 className="u3l2-reveal-title">الإجابات (من حلول المعلّم)</h4>
          <ol className="u3l2-reveal-list">
            <li>
              <MathText
                text="العبارتان ① و④: $1250 + 350 - 225$ مطابقة للنسق مباشرة، و$1250 + (350 - 225)$ تجمّع المبلغين الجديدين ثم تضيفهما — وكلاهما يعطي $1375$."
              />
            </li>
            <li>
              <MathText
                text="مثلا كتابية صحيحة لسلمي: $1250 - 350 - 225$ و$1250 - (350 + 225)$ — وكلاهما يعطي $675$."
              />
            </li>
            <li>
              <MathText
                text="ماهر: $1250 + 350 - 225 = 1375$ • سلمي: $1250 - 350 - 225 = 675$ ليرة سورية."
              />
            </li>
          </ol>
        </div>
      )}

      <div className="u3l2-footer">
        <button
          type="button"
          className="u3-btn-ghost"
          onClick={() => setRevealed((r) => !r)}
          aria-label={revealed ? 'إخفاء الإجابات' : 'عرض الإجابات'}
        >
          <Eye size={16} /> {revealed ? 'إخفاء الإجابات' : 'عرض الإجابات'}
        </button>
        <button type="button" className="u3-btn-ghost" onClick={reset} aria-label="إعادة ضبط المختبر">
          <RotateCcw size={16} /> إعادة ضبط
        </button>
      </div>
      <span className="sr-only" data-lab-status={allOk ? 'complete' : 'incomplete'} />
    </div>
  );
}
