import React, { useMemo, useState } from 'react';
import { Math as TexMath } from '../math/Math';
import { MathText } from '../math/MathText';

/**
 * مختبر خواص الجذور التربيعية — الصفحتان 36 و37.
 *
 * يعرض كل خاصية بالرموز ($a$ و$b$ و$n$) كما في الكتاب، ثم يطبّقها على أعداد
 * يختارها الطالب، ويحسب الطرفين عدديًا ويتحقّق من تساويهما.
 *
 * يُستعمل المكوّن أربع مرات في الدرس عبر الخاصية `rules`، فلا تظهر خاصية قبل
 * أن يشرحها الدرس:
 *  - product: الجذر التربيعي لجداء عددين موجبين (الصفحة 36، البند 1)
 *  - quotient: الجذر التربيعي لنسبة عددين موجبين (الصفحة 36، البند 2)
 *  - power: قوّة جذر تربيعي لعدد موجب (الصفحة 36، البند 3)
 *  - even-power: الجذر التربيعي لقوّة أسها عدد زوجي طبيعي (الصفحة 36، البند 4)
 */

export type RootRuleId = 'product' | 'quotient' | 'power' | 'even-power';

interface RuleConfig {
  id: RootRuleId;
  label: string;
  symbolic: string;
  firstChoices: number[];
  secondChoices: number[];
  exponentChoices?: number[];
}

const ALL_RULES: RuleConfig[] = [
  {
    id: 'product',
    label: 'جداء عددين',
    symbolic: '\\sqrt{a\\times b} = \\sqrt{a}\\times\\sqrt{b}',
    firstChoices: [2, 3, 4, 8, 9, 16, 25],
    secondChoices: [2, 3, 4, 5, 9, 16, 25],
  },
  {
    id: 'quotient',
    label: 'نسبة عددين',
    symbolic: '\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}',
    firstChoices: [4, 6, 9, 16, 25, 36, 50],
    secondChoices: [1, 2, 4, 9, 16, 25],
  },
  {
    id: 'power',
    label: 'قوّة الجذر',
    symbolic: '\\left(\\sqrt{b}\\right)^{n} = \\sqrt{b^{n}}',
    firstChoices: [2, 3, 5, 7],
    secondChoices: [],
    exponentChoices: [2, 3, 4, 6],
  },
  {
    id: 'even-power',
    label: 'جذر قوّة أسها زوجي',
    symbolic: '\\sqrt{b^{n}} = b^{\\frac{n}{2}}',
    firstChoices: [2, 3, 5, 7],
    secondChoices: [],
    exponentChoices: [2, 4, 6, 8],
  },
];

interface RootRulesStudioProps {
  rules?: RootRuleId[];
}

interface Evaluation {
  left: string;
  right: string;
  leftValue: number;
  rightValue: number;
}

const evaluate = (rule: RootRuleId, first: number, second: number, exponent: number): Evaluation => {
  switch (rule) {
    case 'product':
      return {
        left: `\\sqrt{${first}}\\times\\sqrt{${second}}`,
        right: `\\sqrt{${first}\\times${second}} = \\sqrt{${first * second}}`,
        leftValue: Math.sqrt(first) * Math.sqrt(second),
        rightValue: Math.sqrt(first * second),
      };
    case 'quotient':
      return {
        left: `\\sqrt{\\frac{${first}}{${second}}}`,
        right: `\\frac{\\sqrt{${first}}}{\\sqrt{${second}}}`,
        leftValue: Math.sqrt(first / second),
        rightValue: Math.sqrt(first) / Math.sqrt(second),
      };
    case 'power':
      return {
        left: `\\left(\\sqrt{${first}}\\right)^{${exponent}}`,
        right: `\\sqrt{${first}^{${exponent}}}`,
        leftValue: Math.pow(Math.sqrt(first), exponent),
        rightValue: Math.sqrt(Math.pow(first, exponent)),
      };
    case 'even-power':
    default:
      return {
        left: `\\sqrt{${first}^{${exponent}}}`,
        right: `${first}^{\\frac{${exponent}}{2}}`,
        leftValue: Math.sqrt(Math.pow(first, exponent)),
        rightValue: Math.pow(first, exponent / 2),
      };
  }
};

const formatValue = (value: number): string => {
  if (Number.isInteger(Math.round(value)) && Math.abs(value - Math.round(value)) < 1e-9) {
    return String(Math.round(value));
  }
  return value.toFixed(6);
};

export const RootRulesStudio: React.FC<RootRulesStudioProps> = ({ rules }) => {
  const activeRules = useMemo<RuleConfig[]>(() => {
    if (!rules || rules.length === 0) return ALL_RULES;
    const selected = ALL_RULES.filter((rule) => rules.includes(rule.id));
    return selected.length > 0 ? selected : ALL_RULES;
  }, [rules]);

  const [ruleId, setRuleId] = useState<RootRuleId>(activeRules[0].id);
  const rule = activeRules.find((entry) => entry.id === ruleId) ?? activeRules[0];

  const [first, setFirst] = useState<number>(rule.firstChoices[0]);
  const [second, setSecond] = useState<number>(rule.secondChoices[0] ?? 1);
  const [exponent, setExponent] = useState<number>(rule.exponentChoices?.[0] ?? 2);

  const selectRule = (next: RuleConfig) => {
    setRuleId(next.id);
    setFirst(next.firstChoices[0]);
    setSecond(next.secondChoices[0] ?? 1);
    setExponent(next.exponentChoices?.[0] ?? 2);
  };

  const evaluation = evaluate(rule.id, first, second, exponent);
  const matches = Math.abs(evaluation.leftValue - evaluation.rightValue) < 1e-9 * Math.max(1, Math.abs(evaluation.leftValue));

  const firstLabel = rule.id === 'product' || rule.id === 'quotient' ? 'a' : 'b';

  return (
    <section className="root-rules-studio" aria-label={`مختبر: ${rule.label}`}>
      <div className="root-rule-tabs" role="tablist" aria-label="اختيار الخاصية">
        {activeRules.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={entry.id === rule.id}
            className={`root-pill${entry.id === rule.id ? ' is-active' : ''}`}
            onClick={() => selectRule(entry)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="root-rule-symbolic">
        <TexMath math={rule.symbolic} display />
      </div>

      <div className="root-rule-choices">
        <div className="root-choice-row">
          <span className="root-choice-name"><MathText text={`$${firstLabel}$`} /></span>
          {rule.firstChoices.map((choice) => (
            <button
              key={choice}
              type="button"
              dir="ltr"
              className={`root-pill${choice === first ? ' is-active' : ''}`}
              onClick={() => setFirst(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
        {rule.secondChoices.length > 0 && (
          <div className="root-choice-row">
            <span className="root-choice-name"><MathText text="$b$" /></span>
            {rule.secondChoices.map((choice) => (
              <button
                key={choice}
                type="button"
                dir="ltr"
                className={`root-pill${choice === second ? ' is-active' : ''}`}
                onClick={() => setSecond(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
        {rule.exponentChoices && (
          <div className="root-choice-row">
            <span className="root-choice-name"><MathText text="$n$" /></span>
            {rule.exponentChoices.map((choice) => (
              <button
                key={choice}
                type="button"
                dir="ltr"
                className={`root-pill${choice === exponent ? ' is-active' : ''}`}
                onClick={() => setExponent(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="root-rule-result" aria-live="polite">
        <div className="root-rule-sides">
          <TexMath math={evaluation.left} display />
          <span className="root-rule-equals" aria-hidden="true">=</span>
          <TexMath math={evaluation.right} display />
        </div>
        <p className="root-rule-values">
          <TexMath math={`${formatValue(evaluation.leftValue)} \\approx ${formatValue(evaluation.rightValue)}`} />
        </p>
        <p className={`root-check ${matches ? 'is-ok' : 'is-bad'}`}>
          <MathText
            text={matches
              ? 'الطرفان متساويان، إذن الخاصية محققة لهذه الأعداد.'
              : 'الطرفان غير متساويين؛ تحقّق من الشروط (a و b موجبان).'}
          />
        </p>
      </div>
    </section>
  );
};

export default RootRulesStudio;
