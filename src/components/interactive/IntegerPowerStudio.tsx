import React, { useMemo, useState } from 'react';
// الاسم مستعار حتى لا يحجب مكوّن KaTeX كائن Math العام.
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';
import {
  ExactFraction,
  decimalOrRepeating,
  fractionPower,
  fractionTex,
  signedFractionTex,
} from './powerMath';

/**
 * استوديو القوى — الدرس الثالث من الوحدة الثانية (الصفحة 32).
 *
 * الطالب يختار الأساس (عدد صحيح أو كسر، موجب أو سالب) والأس (من −3 إلى 4)،
 * فيرى ثلاث صور للقوة نفسها في وقت واحد:
 *   1. الصيغة الموسّعة (تكرار العامل)،
 *   2. الناتج ككسر في أبسط صورة،
 *   3. العدد العشري إن كان منتهيًا، مع تنبيه إن كان دوريًا.
 *
 * ويتغيّر معهما تفسير الإشارة: أس سالب ← مقلوب، أس زوجي ← ناتج موجب، أس فردي
 * مع أساس سالب ← ناتج سالب. الحساب كله دقيق (كسور صحيحة)، والعرض الرياضي داخل
 * عناصر dir="ltr" معزولة مع واجهة عربية RTL.
 */

interface BaseOption {
  id: string;
  /** TeX الأساس كما يُعرض داخل القوسين. */
  tex: string;
  value: ExactFraction;
  /** نص الزر الواضح للطالب. */
  label: string;
}

const BASE_OPTIONS: BaseOption[] = [
  { id: '3', tex: '3', value: { num: 3, den: 1 }, label: '3' },
  { id: '5', tex: '5', value: { num: 5, den: 1 }, label: '5' },
  { id: '-2', tex: '-2', value: { num: -2, den: 1 }, label: '(−2)' },
  { id: '-3', tex: '-3', value: { num: -3, den: 1 }, label: '(−3)' },
  { id: '1/4', tex: '\\frac{1}{4}', value: { num: 1, den: 4 }, label: '1/4' },
  { id: '3/2', tex: '\\frac{3}{2}', value: { num: 3, den: 2 }, label: '3/2' },
  { id: '-2/3', tex: '-\\frac{2}{3}', value: { num: -2, den: 3 }, label: '(−2/3)' },
];

const MIN_EXPONENT = -3;
const MAX_EXPONENT = 4;
const DEFAULT_BASE = BASE_OPTIONS[0];
const DEFAULT_EXPONENT = 3;

/** الأساس داخل قوسين: \left(…\right) ليكون الأس على القوس لا على آخر عامل. */
const bracketed = (tex: string): string => `\\left(${tex}\\right)`;

const repeatTex = (part: string, times: number): string =>
  Array.from({ length: times }, () => part).join(' \\times ');

const clampExponent = (value: number): number =>
  Math.max(MIN_EXPONENT, Math.min(MAX_EXPONENT, Math.round(value)));

export const IntegerPowerStudio: React.FC = () => {
  const [base, setBase] = useState<BaseOption>(DEFAULT_BASE);
  const [exponent, setExponent] = useState<number>(DEFAULT_EXPONENT);

  const result = useMemo(() => fractionPower(base.value, exponent), [base, exponent]);

  const expandedTex = useMemo(() => {
    if (exponent === 0) return '1';
    if (exponent > 0) return repeatTex(base.tex, exponent);
    const positive = Math.abs(exponent);
    return `\\frac{1}{${repeatTex(base.tex, positive)}}`;
  }, [base, exponent]);

  const expressionTex = useMemo(() => {
    if (exponent < 0) {
      return `${bracketed(base.tex)}^{${exponent}} = \\frac{1}{${bracketed(base.tex)}^{${Math.abs(exponent)}}} = ${fractionTex(result)}`;
    }
    return `${bracketed(base.tex)}^{${exponent}} = ${fractionTex(result)}`;
  }, [base, exponent, result]);

  const signNote = useMemo(() => {
    if (exponent === 0) {
      return 'الأس صفر: الناتج 1 دائمًا لأن الأساس غير معدوم.';
    }
    if (exponent < 0) {
      const parity = Math.abs(exponent) % 2 === 0 ? 'زوجي' : 'فردي';
      const baseNote = base.value.num < 0
        ? ` ولأن الأساس سالب والأس ${parity} فإن إشارة القوة الموجبة ${parity === 'زوجي' ? 'موجبة' : 'سالبة'}، وهذه الإشارة تنتقل إلى المقلوب.`
        : '';
      return `الأس سالب: الناتج مقلوب القوة الموجبة.${baseNote}`;
    }
    if (base.value.num < 0) {
      return exponent % 2 === 0
        ? 'الأساس سالب والأس زوجي: الناتج موجب.'
        : 'الأساس سالب والأس فردي: الناتج سالب.';
    }
    return 'الأساس موجب: الناتج موجب مهما كان الأس.';
  }, [base, exponent]);

  const decimalText = useMemo(() => {
    if (exponent === 0) return '1';
    return decimalOrRepeating(result);
  }, [exponent, result]);

  /** عرض إشارة القوة الموجبة نفسها عندما يكون الأساس سالبًا. */
  const signTex = useMemo(() => {
    if (base.value.num >= 0 || exponent === 0) return null;
    const positivePower = fractionPower(base.value, Math.abs(exponent));
    return `${bracketed(base.tex)}^{${Math.abs(exponent)}} = ${signedFractionTex(positivePower)}`;
  }, [base, exponent]);

  return (
    <section className="power-studio" dir="rtl" aria-label="استوديو القوى">
      <p className="power-studio-intro">
        <MathText text="اختر الأساس والأس، ثم تابع الصيغة الموسّعة والناتج. القوة $a^{n}$ تعني تكرار العامل $a$ عدد $n$ مرة." />
      </p>

      <div className="power-studio-row">
        <span className="power-studio-row-label">الأساس</span>
        <div className="power-studio-bases" role="group" aria-label="اختيار الأساس">
          {BASE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`power-studio-base${option.id === base.id ? ' is-active' : ''}`}
              aria-pressed={option.id === base.id}
              aria-label={`الأساس ${option.label}`}
              onClick={() => setBase(option)}
            >
              <Formula math={option.tex} />
            </button>
          ))}
        </div>
      </div>

      <div className="power-studio-row">
        <span className="power-studio-row-label">الأس</span>
        <div className="power-studio-exponent">
          <button
            type="button"
            className="power-studio-step"
            aria-label="إنقاص الأس"
            disabled={exponent <= MIN_EXPONENT}
            onClick={() => setExponent((value) => clampExponent(value - 1))}
          >
            −
          </button>
          <span className="power-studio-exponent-value" dir="ltr" aria-live="polite">
            {exponent}
          </span>
          <button
            type="button"
            className="power-studio-step"
            aria-label="زيادة الأس"
            disabled={exponent >= MAX_EXPONENT}
            onClick={() => setExponent((value) => clampExponent(value + 1))}
          >
            +
          </button>
        </div>
        <span className="power-studio-range-note" dir="ltr">
          {MIN_EXPONENT} … {MAX_EXPONENT}
        </span>
      </div>

      <div className="power-studio-panel">
        <span className="power-studio-panel-label">الصيغة الموسّعة:</span>
        <div className="power-studio-formula" dir="ltr">
          <Formula math={expandedTex} display />
        </div>
      </div>

      <div className="power-studio-panel">
        <span className="power-studio-panel-label">القوة والناتج:</span>
        <div className="power-studio-formula" dir="ltr">
          <Formula math={expressionTex} display />
        </div>
      </div>

      <dl className="power-studio-facts">
        <div className="power-studio-fact">
          <dt>الناتج بالصيغة الكسرية</dt>
          <dd dir="ltr">
            <Formula math={fractionTex(result)} />
          </dd>
        </div>
        <div className="power-studio-fact">
          <dt>الناتج بالصيغة العشرية</dt>
          <dd dir="ltr">{decimalText}</dd>
        </div>
        <div className="power-studio-fact power-studio-fact-wide">
          <dt>قراءة الإشارة والأس</dt>
          <dd>
            <MathText text={signNote} />
          </dd>
        </div>
      </dl>

      {signTex && (
        <div className="power-studio-hint" dir="ltr">
          <Formula math={signTex} />
        </div>
      )}
    </section>
  );
};

export default IntegerPowerStudio;
