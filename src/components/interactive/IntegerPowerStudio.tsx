import React, { useMemo, useState } from 'react';
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';
import { decimalOrRepeating, fractionPower, fractionTex } from './powerMath';
import type { ExactFraction } from './powerMath';

/** Reuses the lesson's exact-fraction engine; the zero cases never enter it. */
interface BaseOption { id: string; tex: string; value: ExactFraction; label: string }
const tex = String.raw;
const BASE_OPTIONS: BaseOption[] = [
  { id: '3', tex: '3', value: { num: 3, den: 1 }, label: '3' },
  { id: '5', tex: '5', value: { num: 5, den: 1 }, label: '5' },
  { id: '-2', tex: '-2', value: { num: -2, den: 1 }, label: '(−2)' },
  { id: '-3', tex: '-3', value: { num: -3, den: 1 }, label: '(−3)' },
  { id: '1/4', tex: tex`\frac14`, value: { num: 1, den: 4 }, label: '1/4' },
  { id: '3/2', tex: tex`\frac32`, value: { num: 3, den: 2 }, label: '3/2' },
  { id: '-2/3', tex: tex`-\frac23`, value: { num: -2, den: 3 }, label: '(−2/3)' },
  { id: '-0.4', tex: '-0.4', value: { num: -2, den: 5 }, label: '(−0.4)' },
  { id: '1', tex: '1', value: { num: 1, den: 1 }, label: '1' },
  { id: '0', tex: '0', value: { num: 0, den: 1 }, label: '0' },
];
const MIN_EXPONENT = -5;
const MAX_EXPONENT = 7;
const DEFAULT_BASE = BASE_OPTIONS[0];
const DEFAULT_EXPONENT = 3;
const PATTERN_EXPONENTS = [2, 1, 0, -1, -2];
const bracket = (value: string): string => tex`\left(${value}\right)`;

export const IntegerPowerStudio: React.FC = () => {
  const [base, setBase] = useState(DEFAULT_BASE);
  const [exponent, setExponent] = useState(DEFAULT_EXPONENT);
  const undefinedPower = base.value.num === 0 && exponent <= 0;
  const result = useMemo(
    () => undefinedPower ? null : fractionPower(base.value, exponent),
    [base, exponent, undefinedPower],
  );
  // Parentheses preserve the WHOLE negative/fractional factor on expansion.
  const factors = Array.from({ length: Math.abs(exponent) }, () => bracket(base.tex)).join(tex`\times`);
  const expandedTex = exponent === 0 ? '1' : exponent > 0 ? factors : tex`\frac1{${factors}}`;
  const powerTex = `${bracket(base.tex)}^{${exponent}}`;
  const expressionTex = result
    ? exponent < 0
      ? tex`${powerTex}=\frac1{${bracket(base.tex)}^{${Math.abs(exponent)}}}=${fractionTex(result)}`
      : `${powerTex}=${fractionTex(result)}`
    : powerTex;
  const signNote = undefinedPower
    ? exponent === 0
      ? 'القوة صفر أس صفر غير معرّفة في هذا الدرس؛ قاعدة الأس صفر تشترط أساسًا غير صفر.'
      : 'لا مقلوب للصفر: الأس السالب يتطلب القسمة على صفر، لذلك هذه القوة غير معرّفة.'
    : base.value.num === 0
      ? 'الأساس صفر والأس موجب: تكرار العامل صفر يعطي صفرًا.'
      : exponent === 0
        ? 'الأس صفر: الناتج 1 لأن الأساس غير صفر، حتى إذا كان سالبًا أو كسرًا.'
        : base.value.num < 0
          ? `الأساس سالب والأس ${Math.abs(exponent) % 2 === 0 ? 'زوجي: الناتج موجب.' : 'فردي: الناتج سالب.'}${exponent < 0 ? ' والأس السالب يأخذ المقلوب مع بقاء هذه الإشارة.' : ''}`
          : exponent < 0
            ? 'الأس السالب يأخذ المقلوب؛ الناتج موجب، وقد يكون أكبر من 1 عندما يكون الأساس بين 0 و1.'
            : 'الأساس موجب؛ الناتج موجب. الأس الموجب يعدّ العوامل.';

  const outsidePower = base.value.num < 0 && result
    ? fractionPower({ num: -base.value.num, den: base.value.den }, exponent)
    : null;
  const outsideTex = outsidePower
    ? tex`-${bracket(fractionTex({ num: -base.value.num, den: base.value.den }))}^{${exponent}}=${fractionTex({ num: -outsidePower.num, den: outsidePower.den })}`
    : '';

  return (
    <section className="power-studio" dir="rtl" aria-label="استوديو القوى">
      <p className="power-studio-intro">
        <MathText text="الأس الموجب يعدّ العوامل، والأس السالب يأخذ المقلوب. توقّع الإشارة، ثم غيّر قيمة واحدة وفسّر ما تغيّر." />
      </p>
      <div className="power-studio-row">
        <span className="power-studio-row-label">الأساس</span>
        <div className="power-studio-bases" role="group" aria-label="اختيار الأساس">
          {BASE_OPTIONS.map((option) => (
            <button key={option.id} type="button"
              className={`power-studio-base${option.id === base.id ? ' is-active' : ''}`}
              aria-pressed={option.id === base.id} aria-label={`الأساس ${option.label}`}
              onClick={() => setBase(option)}>
              <Formula math={option.tex} />
            </button>
          ))}
        </div>
      </div>
      <div className="power-studio-row">
        <span className="power-studio-row-label">الأس</span>
        <div className="power-studio-exponent" dir="ltr">
          <button type="button" className="power-studio-step" aria-label="إنقاص الأس"
            disabled={exponent <= MIN_EXPONENT} onClick={() => setExponent((value) => Math.max(MIN_EXPONENT, value - 1))}>−</button>
          <span className="power-studio-exponent-value" dir="ltr" aria-live="polite">{exponent}</span>
          <button type="button" className="power-studio-step" aria-label="زيادة الأس"
            disabled={exponent >= MAX_EXPONENT} onClick={() => setExponent((value) => Math.min(MAX_EXPONENT, value + 1))}>+</button>
        </div>
        <span className="power-studio-range-note" dir="ltr">{MIN_EXPONENT} … {MAX_EXPONENT}</span>
      </div>
      <div className="power-studio-panel">
        <span className="power-studio-panel-label">القوة والناتج:</span>
        <div className="power-studio-formula" dir="ltr"><Formula math={expressionTex} display /></div>
      </div>
      {result && (
        <>
          <div className="power-studio-panel">
            <span className="power-studio-panel-label">{exponent < 0 ? 'مقلوب جداء العوامل:' : 'الصيغة الموسّعة:'}</span>
            <div className="power-studio-formula" dir="ltr"><Formula math={expandedTex} display /></div>
          </div>
          <dl className="power-studio-facts">
            <div className="power-studio-fact">
              <dt>الناتج بالصيغة الكسرية</dt>
              <dd dir="ltr" data-testid="power-exact-result" data-num={result.num} data-den={result.den}>
                <Formula math={fractionTex(result)} />
              </dd>
            </div>
            <div className="power-studio-fact">
              <dt>الناتج بالصيغة العشرية</dt><dd dir="ltr">{decimalOrRepeating(result)}</dd>
            </div>
          </dl>
        </>
      )}
      <p className="power-studio-hint" role="status"><MathText text={signNote} /></p>
      {base.value.num < 0 && result && (
        <div className="power-studio-panel">
          <span className="power-studio-panel-label">قارن: ماذا لو كان السالب خارج القوة؟</span>
          <div className="power-studio-formula" dir="ltr">
            <Formula display math={outsideTex} />
          </div>
          <p>المقارنة مع القوة أعلاه تبيّن أن موضع السالب يحدّد هل يُرفع إلى الأس أم يبقى خارج القوة.</p>
        </div>
      )}
      <div className="power-studio-panel">
        <span className="power-studio-panel-label">محطات النمط: أنقص الأس واحدًا، أي اقسم على الأساس إذا كان غير صفر.</span>
        <div className="power-pattern" role="group" aria-label="محطات الأس">
          {PATTERN_EXPONENTS.map((power) => {
            const defined = base.value.num !== 0 || power > 0;
            return (
              <button key={power} type="button" className="power-pattern-stop" aria-label={`انتقل إلى الأس ${power}`}
                aria-pressed={exponent === power} onClick={() => setExponent(power)}>
                <Formula math={`${bracket(base.tex)}^{${power}}`} />
                <span>{defined ? <Formula math={fractionTex(fractionPower(base.value, power))} /> : 'غير معرّفة'}</span>
              </button>
            );
          })}
        </div>
      </div>
      <button type="button" className="reveal-btn power-lab-reset" onClick={() => { setBase(DEFAULT_BASE); setExponent(DEFAULT_EXPONENT); }}>
        إعادة تجربة القوى إلى البداية
      </button>
    </section>
  );
};
export default IntegerPowerStudio;
