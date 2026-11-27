import { useMemo, useState } from 'react';
import { Scale, RotateCcw, Check, Eye } from 'lucide-react';
import { Math as MathBlock } from '../math/Math';
import { MathText } from '../math/MathText';

/**
 * مختبر الميزان التفاعلي (الوحدة الرابعة، ص68 و ص72).
 *
 * يحاكي فكرة الكتاب نفسها: كفّتا ميزان، وكل عملية تُجرى على إحدى الكفّتين يجب
 * أن تُجرى على الأخرى. المختبر يحقّق من *التوازن* لا من حساب الطالب: إن أضفت
 * 30 g إلى كفّة واحدة فقط، يميل الميزان ويشرح السبب، ويبيّن أنّ حفظ المساواة
 * مرهون بإجراء العملية نفسها على الطرفين.
 *
 * ×  عند توفّر قيمة للمجهول تُحسب كتلة كلّ كفّة عدديًّا: الكتلة = معامل الرمز ×
 *      قيمة الرمز + الثابت، والتوازن هو تساوي الكتلتين.
 * ×  وبلا قيمة للمجهول يُقارَن التعبيران نفسهما (المعامل والثابت).
 * ×  لا يُستخدم eval ولا `Function`: الحساب جمع وضرب مباشر.
 * ×  الأرقام داخل حقول LTR معزولة، والواجهة عربية RTL كما في بقية المختبرات.
 */

interface BalanceSide {
  /** Coefficient of the unknown x on this side. */
  xCount: number;
  /** Constant grams on this side. */
  constant: number;
}

interface EquationBalanceLabProps {
  /** Left pan content: coefficient of the unknown and the constant mass. */
  left: BalanceSide;
  /** Right pan content: coefficient of the unknown and the constant mass. */
  right: BalanceSide;
  /** Label of the variable, default "x". */
  variable?: string;
  /** Optional value assigned to the variable for the numeric read-out. */
  secretValue?: number;
  /** Unit shown next to the constant, default "g". */
  unit?: string;
}

interface Operation {
  id: string;
  label: string;
  /** Applied to both pans when true, to the left pan only otherwise. */
  both: boolean;
  apply: (side: BalanceSide) => BalanceSide;
}

const OPERATIONS: Operation[] = [
  {
    id: 'add-30',
    label: 'نضيف 30 g إلى كلّ كفّة',
    both: true,
    apply: (side) => ({ ...side, constant: side.constant + 30 }),
  },
  {
    id: 'add-left-only',
    label: 'نضيف 30 g إلى كفّة واحدة فقط',
    both: false,
    apply: (side) => ({ ...side, constant: side.constant + 30 }),
  },
  {
    id: 'remove-30',
    label: 'نطرح 30 g من كلّ كفّة',
    both: true,
    apply: (side) => ({ ...side, constant: side.constant - 30 }),
  },
  {
    id: 'double',
    label: 'نضاعف محتوى كلّ كفّة',
    both: true,
    apply: (side) => ({ xCount: side.xCount * 2, constant: side.constant * 2 }),
  },
  {
    id: 'half',
    label: 'نقسم محتوى كلّ كفّة على 2',
    both: true,
    apply: (side) => ({ xCount: side.xCount / 2, constant: side.constant / 2 }),
  },
];

const normalise = (value: number): string =>
  Number.isInteger(value) ? String(value) : String(Number(value.toFixed(3)));

/**
 * عرض عدد الكفّة: الأعداد الصحيحة كما هي، وغير الصحيحة ككسر تامّ
 * (مثل 17,5 ⟵ \frac{35}{2}) حتى لا يظهر 0,5x في المعادلة المعروضة.
 */
const formatAmount = (value: number): string => {
  if (Number.isInteger(value)) return String(value);
  for (let denominator = 2; denominator <= 100; denominator += 1) {
    const numerator = value * denominator;
    if (Math.abs(numerator - Math.round(numerator)) < 1e-9) {
      const rounded = Math.round(numerator);
      const sign = rounded < 0 ? '-' : '';
      return `${sign}\\frac{${Math.abs(rounded)}}{${denominator}}`;
    }
  }
  return String(Number(value.toFixed(3)));
};

/**
 * التوازن: تساوي كتلة الكفّتين. عند معرفة قيمة الرمز تُحسب الكتلتان عدديًّا؛
 * وبلا معرفتها نعتبر الكفّتين متوازنتين فقط إذا وصفتا الكتلة نفسها (المعامل
 * والثابت معًا)، أي أنّ المعادلتين متكافئتان لا أنّ عددين اتّفقا.
 */
const massOf = (side: BalanceSide, value: number): number => side.xCount * value + side.constant;

const isBalanced = (left: BalanceSide, right: BalanceSide, value?: number): boolean =>
  value === undefined
    ? left.xCount === right.xCount && left.constant === right.constant
    : Math.abs(massOf(left, value) - massOf(right, value)) < 1e-9;

export function EquationBalanceLab({
  left,
  right,
  variable = 'x',
  secretValue,
  unit = 'g',
}: EquationBalanceLabProps) {
  const [state, setState] = useState<{ left: BalanceSide; right: BalanceSide; log: string[] }>({
    left,
    right,
    log: [],
  });
  const [hint, setHint] = useState<boolean>(false);

  const balanced = useMemo(() => isBalanced(state.left, state.right, secretValue), [state, secretValue]);

  const tilt = useMemo(() => {
    if (balanced) return 0;
    const difference =
      secretValue === undefined
        ? state.left.constant - state.right.constant
        : massOf(state.left, secretValue) - massOf(state.right, secretValue);
    return Math.max(-14, Math.min(14, difference / 10));
  }, [balanced, secretValue, state]);

  const run = (operation: Operation) => {
    setState((previous) => {
      const nextLeft = operation.apply(previous.left);
      const nextRight = operation.both ? operation.apply(previous.right) : previous.right;
      const nextBalanced = isBalanced(nextLeft, nextRight, secretValue);
      const verdict = nextBalanced
        ? balanced
          ? 'التوازن محفوظ: العملية أُجريت على الكفّتين.'
          : 'الميزان عاد إلى التوازن.'
        : 'اختلّ التوازن: العملية أُجريت على إحدى الكفّتين فقط.';
      return {
        left: nextLeft,
        right: nextRight,
        log: [ `${operation.label} — ${verdict}`, ...previous.log ].slice(0, 4),
      };
    });
    setHint(false);
  };

  const reset = () => {
    setState({ left, right, log: [] });
    setHint(false);
  };

  const panSummary = (side: BalanceSide) => {
    const parts: string[] = [];
    if (side.xCount !== 0) {
      parts.push(side.xCount === 1 ? variable : `${formatAmount(side.xCount)}${variable}`);
    }
    if (side.constant !== 0 || parts.length === 0) {
      parts.push(
        side.constant < 0 && parts.length > 0
          ? `- ${formatAmount(Math.abs(side.constant))} ${unit}`.trim()
          : `${formatAmount(side.constant)} ${unit}`.trim(),
      );
    }
    return parts.join(' + ').replace(/\+ -/g, '− ');
  };

  const readOut = (side: BalanceSide) =>
    secretValue === undefined ? null : normalise(massOf(side, secretValue));

  return (
    <div className="interactive-card u4-balance-lab" dir="rtl">
      <div className="u4-balance-head">
        <span className="u4-balance-title">
          <Scale size={18} aria-hidden="true" /> مختبر الميزان
        </span>
        <span className={`u4-balance-status ${balanced ? 'is-balanced' : 'is-tilted'}`} role="status">
          {balanced ? <Check size={15} aria-hidden="true" /> : null}
          {balanced ? 'الميزان متوازن' : 'الميزان غير متوازن'}
        </span>
      </div>

      <div className="u4-balance-stage">
        <div className="u4-balance-beam" style={{ transform: `rotate(${tilt}deg)` }} aria-hidden="true" />
        <div className="u4-balance-pans">
          <div className="u4-balance-pan u4-balance-pan-left" style={{ transform: `translateY(${tilt}px)` }}>
            <span className="u4-balance-pan-label">الكفّة اليسرى</span>
            <MathText text={`$${panSummary(state.left)}$`} />
          </div>
          <div className="u4-balance-pan u4-balance-pan-right" style={{ transform: `translateY(${-tilt}px)` }}>
            <span className="u4-balance-pan-label">الكفّة اليمنى</span>
            <MathText text={`$${panSummary(state.right)}$`} />
          </div>
        </div>
      </div>

      <div className="u4-balance-equation">
        <MathBlock math={`${panSummary(state.left)} = ${panSummary(state.right)}`} display />
      </div>

      {secretValue !== undefined && (
        <p className="u4-balance-readout">
          إذا كانت قيمة {variable} = {normalise(secretValue)} فكتلة الكفّة اليسرى {readOut(state.left)} {unit}،
          وكتلة الكفّة اليمنى {readOut(state.right)} {unit}. تساوي الكتلتين هو معنى التوازن.
        </p>
      )}

      <div className="u4-balance-actions">
        {OPERATIONS.map((operation) => (
          <button
            key={operation.id}
            type="button"
            className={`u4-balance-btn${operation.both ? '' : ' is-one-sided'}`}
            onClick={() => run(operation)}
          >
            {operation.label}
          </button>
        ))}
      </div>

      <div className="u4-balance-footer">
        <button type="button" className="reveal-btn" onClick={() => setHint((value) => !value)}>
          <Eye size={15} aria-hidden="true" />
          <span>{hint ? 'إخفاء القاعدة' : 'لماذا يبقى التوازن؟'}</span>
        </button>
        <button type="button" className="reveal-btn" onClick={reset}>
          <RotateCcw size={15} aria-hidden="true" />
          <span>إعادة</span>
        </button>
      </div>

      {hint && (
        <div className="solution-panel">
          <p>
            إذا أضفنا العدد نفسه إلى طرفي مساواة، أو طرحناه من طرفيها، حصلنا على مساواة جديدة. وبالمثل: إذا
            ضربنا كلًّا من الطرفين في العدد نفسه، أو قسمنا كلًّا منهما على العدد غير المعدوم نفسه. هذا هو سبب
            بقاء الميزان متوازنًا عندما نجري العملية على الكفّتين معًا.
          </p>
        </div>
      )}

      {state.log.length > 0 && (
        <ol className="u4-balance-log">
          {state.log.map((entry, index) => (
            <li key={`${entry}-${index}`}>
              <MathText text={entry} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default EquationBalanceLab;
