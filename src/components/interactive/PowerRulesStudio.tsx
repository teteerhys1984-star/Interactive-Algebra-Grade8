import React, { useMemo, useState } from 'react';
// الاسم مستعار حتى لا يحجب مكوّن KaTeX كائن Math العام.
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';
import { ExactFraction, decimalOf, fractionEquals, fractionPower, fractionTex, normalise } from './powerMath';

/**
 * مختبر قواعد القوى — الدرس الثالث من الوحدة الثانية (الصفحتان 32 و33).
 *
 * يعرض القاعدة رمزًا بالحروف ($a$ و$b$ و$n$ و$m$) كما في الكتاب، ثم يطبّقها
 * على أعداد يختارها الطالب، ويعرض النتيجة ككسر دقيق مع الصيغة العشرية إن كانت
 * منتهية، ثم يتحقّق من التساوي بين الطرفين حسابيًا.
 *
 * يُستعمل المكوّن مرتين في الدرس عبر الخاصية `rules`: مرة للقاعدتين (1) و(2)
 * ومرة للقاعدتين (3) و(4)، فلا تظهر قاعدة قبل أن يشرحها الدرس.
 */

export type PowerRuleId = 'product' | 'quotient' | 'product-power' | 'quotient-power';

interface RuleConfig {
  id: PowerRuleId;
  label: string;
  symbolic: string;
  reading: string;
  usesTwoBases: boolean;
}

const ALL_RULES: RuleConfig[] = [
  {
    id: 'product',
    label: 'جداء قوتين',
    symbolic: 'a^{n} \\times a^{m} = a^{n+m}',
    reading: 'نجمع الأسين ويبقى الأساس نفسه.',
    usesTwoBases: false,
  },
  {
    id: 'product-power',
    label: 'قوة الجداء',
    symbolic: 'a^{n} \\times b^{n} = (a \\times b)^{n}',
    reading: 'نجمع الأساسين داخل قوة واحدة ويبقى الأس نفسه.',
    usesTwoBases: true,
  },
  {
    id: 'quotient',
    label: 'خارج قسمة قوتين',
    symbolic: '\\frac{a^{n}}{a^{m}} = a^{n-m}',
    reading: 'نطرح أس المقام من أس البسط.',
    usesTwoBases: false,
  },
  {
    id: 'quotient-power',
    label: 'قوة الخارج',
    symbolic: '\\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}',
    reading: 'نرفع البسط والمقام إلى الأس نفسه.',
    usesTwoBases: true,
  },
];

const BASE_CHOICES = [2, 3, 5, -2, -3];
const SECOND_BASE_CHOICES = [3, 4, 5, 7];
const MIN_EXPONENT = -3;
const MAX_EXPONENT = 4;

const integerTex = (value: number): string => (value < 0 ? `\\left(${value}\\right)` : `${value}`);

const divideFractions = (left: ExactFraction, right: ExactFraction): ExactFraction =>
  normalise(left.num * right.den, left.den * right.num);

const exponentSumTex = (n: number, m: number): string =>
  `${n}${m < 0 ? `+\\left(${m}\\right)` : `+${m}`}`;

const clampExponent = (value: number): number => Math.max(MIN_EXPONENT, Math.min(MAX_EXPONENT, value));

interface PowerRulesStudioProps {
  /** القواعد التي يعرضها المختبر؛ الافتراض: القواعد الأربع. */
  rules?: PowerRuleId[];
}

export const PowerRulesStudio: React.FC<PowerRulesStudioProps> = ({ rules }) => {
  const activeRules = useMemo<RuleConfig[]>(() => {
    if (!rules || rules.length === 0) return ALL_RULES;
    const selected = ALL_RULES.filter((rule) => rules.includes(rule.id));
    return selected.length > 0 ? selected : ALL_RULES;
  }, [rules]);

  const [ruleId, setRuleId] = useState<PowerRuleId>(activeRules[0].id);
  const [base, setBase] = useState<number>(2);
  const [secondBase, setSecondBase] = useState<number>(3);
  const [n, setN] = useState<number>(3);
  const [m, setM] = useState<number>(2);

  const rule = activeRules.find((entry) => entry.id === ruleId) ?? activeRules[0];

  const { leftTex, rightTex, result, checkTex } = useMemo(() => {
    const aTex = integerTex(base);
    const bTex = integerTex(secondBase);
    const aFraction: ExactFraction = { num: base, den: 1 };
    const bFraction: ExactFraction = { num: secondBase, den: 1 };

    switch (rule.id) {
      case 'product': {
        const left = fractionPower(aFraction, n);
        const right = fractionPower(aFraction, m);
        const value = normalise(left.num * right.num, left.den * right.den);
        return {
          leftTex: `${aTex}^{${n}} \\times ${aTex}^{${m}}`,
          rightTex: `${aTex}^{${exponentSumTex(n, m)}} = ${aTex}^{${n + m}}`,
          result: value,
          checkTex: `${fractionTex(left)} \\times ${fractionTex(right)} = ${fractionTex(value)}`,
        };
      }
      case 'quotient': {
        const numerator = fractionPower(aFraction, n);
        const denominator = fractionPower(aFraction, m);
        const value = divideFractions(numerator, denominator);
        return {
          leftTex: `\\frac{${aTex}^{${n}}}{${aTex}^{${m}}}`,
          rightTex: `${aTex}^{${n}-${m < 0 ? `\\left(${m}\\right)` : m}} = ${aTex}^{${n - m}}`,
          result: value,
          checkTex: `\\frac{${fractionTex(numerator)}}{${fractionTex(denominator)}} = ${fractionTex(value)}`,
        };
      }
      case 'product-power': {
        const first = fractionPower(aFraction, n);
        const second = fractionPower(bFraction, n);
        const value = normalise(first.num * second.num, first.den * second.den);
        return {
          leftTex: `${aTex}^{${n}} \\times ${bTex}^{${n}}`,
          rightTex: `\\left(${aTex} \\times ${bTex}\\right)^{${n}} = ${integerTex(base * secondBase)}^{${n}}`,
          result: value,
          checkTex: `${fractionTex(first)} \\times ${fractionTex(second)} = ${fractionTex(value)}`,
        };
      }
      case 'quotient-power':
      default: {
        const baseFraction: ExactFraction = { num: base, den: secondBase };
        const value = fractionPower(baseFraction, n);
        const numerator = fractionPower(aFraction, n);
        const denominator = fractionPower(bFraction, n);
        return {
          leftTex: `\\left(\\frac{${base}}{${secondBase}}\\right)^{${n}}`,
          rightTex: `\\frac{${aTex}^{${n}}}{${bTex}^{${n}}} = \\frac{${fractionTex(numerator)}}{${fractionTex(denominator)}}`,
          result: value,
          checkTex: `${fractionTex(numerator)} \\div ${fractionTex(denominator)} = ${fractionTex(value)}`,
        };
      }
    }
  }, [rule, base, secondBase, n, m]);

  /** يتحقّق المكوّن من اتّفاق الطرفين قبل أن يعرضهما للطالب. */
  const verified = useMemo(() => {
    const aFraction: ExactFraction = { num: base, den: 1 };
    const bFraction: ExactFraction = { num: secondBase, den: 1 };
    switch (rule.id) {
      case 'product':
        return fractionEquals(
          normalise(fractionPower(aFraction, n).num * fractionPower(aFraction, m).num,
            fractionPower(aFraction, n).den * fractionPower(aFraction, m).den),
          fractionPower(aFraction, n + m),
        );
      case 'quotient':
        return fractionEquals(
          divideFractions(fractionPower(aFraction, n), fractionPower(aFraction, m)),
          fractionPower(aFraction, n - m),
        );
      case 'product-power':
        return fractionEquals(
          normalise(fractionPower(aFraction, n).num * fractionPower(bFraction, n).num,
            fractionPower(aFraction, n).den * fractionPower(bFraction, n).den),
          fractionPower({ num: base * secondBase, den: 1 }, n),
        );
      case 'quotient-power':
      default:
        return fractionEquals(
          fractionPower({ num: base, den: secondBase }, n),
          divideFractions(fractionPower(aFraction, n), fractionPower(bFraction, n)),
        );
    }
  }, [rule, base, secondBase, n, m]);

  const decimalText = decimalOf(result);

  return (
    <section className="power-rules-studio" dir="rtl" aria-label="مختبر قواعد القوى">
      <p className="power-rules-intro">
        <MathText text="اختر القاعدة، ثم غيّر الأساس والأس. يطبّق المختبر القاعدة رمزًا بالحروف، ثم بالأعداد، ويتحقّق من التساوي." />
      </p>

      <div className="power-rules-tabs" role="tablist" aria-label="قواعد القوى">
        {activeRules.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={entry.id === rule.id}
            className={`power-rules-tab${entry.id === rule.id ? ' active' : ''}`}
            onClick={() => setRuleId(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="power-rules-symbolic" dir="ltr">
        <Formula math={rule.symbolic} display />
      </div>
      <p className="power-rules-reading">
        <MathText text={rule.reading} />
      </p>

      <div className="power-rules-controls">
        <div className="power-rules-control">
          <span className="power-rules-control-label">الأساس a</span>
          <div className="power-rules-choices" role="group" aria-label="اختيار الأساس a">
            {BASE_CHOICES.map((choice) => (
              <button
                key={choice}
                type="button"
                className={`power-rules-choice${choice === base ? ' is-active' : ''}`}
                aria-pressed={choice === base}
                aria-label={`الأساس a يساوي ${choice}`}
                onClick={() => setBase(choice)}
              >
                <Formula math={integerTex(choice)} />
              </button>
            ))}
          </div>
        </div>

        {rule.usesTwoBases && (
          <div className="power-rules-control">
            <span className="power-rules-control-label">الأساس b</span>
            <div className="power-rules-choices" role="group" aria-label="اختيار الأساس b">
              {SECOND_BASE_CHOICES.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  className={`power-rules-choice${choice === secondBase ? ' is-active' : ''}`}
                  aria-pressed={choice === secondBase}
                  aria-label={`الأساس b يساوي ${choice}`}
                  onClick={() => setSecondBase(choice)}
                >
                  <Formula math={`${choice}`} />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="power-rules-control">
          <span className="power-rules-control-label">الأس n</span>
          <div className="power-rules-stepper">
            <button
              type="button"
              aria-label="إنقاص الأس n"
              disabled={n <= MIN_EXPONENT}
              onClick={() => setN((value) => clampExponent(value - 1))}
            >
              −
            </button>
            <span dir="ltr" aria-live="polite">{n}</span>
            <button
              type="button"
              aria-label="زيادة الأس n"
              disabled={n >= MAX_EXPONENT}
              onClick={() => setN((value) => clampExponent(value + 1))}
            >
              +
            </button>
          </div>
        </div>

        {!rule.usesTwoBases && (
          <div className="power-rules-control">
            <span className="power-rules-control-label">الأس m</span>
            <div className="power-rules-stepper">
              <button
                type="button"
                aria-label="إنقاص الأس m"
                disabled={m <= MIN_EXPONENT}
                onClick={() => setM((value) => clampExponent(value - 1))}
              >
                −
              </button>
              <span dir="ltr" aria-live="polite">{m}</span>
              <button
                type="button"
                aria-label="زيادة الأس m"
                disabled={m >= MAX_EXPONENT}
                onClick={() => setM((value) => clampExponent(value + 1))}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="power-rules-result">
        <span className="power-rules-result-label">التطبيق بالأعداد:</span>
        <div className="power-rules-result-math" dir="ltr">
          <Formula math={`${leftTex} = ${rightTex}`} display />
        </div>
      </div>

      <dl className="power-rules-facts">
        <div className="power-rules-fact">
          <dt>الناتج (كسر في أبسط صورة)</dt>
          <dd dir="ltr">
            <Formula math={fractionTex(result)} />
          </dd>
        </div>
        {decimalText && (
          <div className="power-rules-fact">
            <dt>الناتج بالصيغة العشرية</dt>
            <dd dir="ltr">{decimalText}</dd>
          </div>
        )}
        <div className="power-rules-fact power-rules-fact-wide">
          <dt>التحقّق من القاعدة</dt>
          <dd dir="ltr" className="power-rules-check">
            <Formula math={checkTex} />
          </dd>
        </div>
      </dl>

      <p className={`power-rules-verdict${verified ? ' is-ok' : ' is-bad'}`}>
        {verified
          ? 'القاعدة محقّقة: الطرفان متساويان في هذا المثال.'
          : 'تنبيه: الطرفان غير متساويين — تحقّق من القاعدة المختارة.'}
      </p>
    </section>
  );
};

export default PowerRulesStudio;
