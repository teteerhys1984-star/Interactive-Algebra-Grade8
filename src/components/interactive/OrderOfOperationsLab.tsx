import React, { useId, useMemo, useState } from 'react';
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';
import { intPow } from './powerMath';

type LabCase = 'A' | 'B' | 'C';
const tex = String.raw;
const MIN_X = -6;
const MAX_X = 6;
const DEFAULT_X = -4;
interface Step { title: string; tex: string }

/**
 * Existing lesson-3 lab, expanded rather than duplicated: A/B now share real
 * editable factors and exponent. The initial values reproduce the book only;
 * changed values are explicitly labelled as a platform experiment.
 */
export const OrderOfOperationsLab: React.FC = () => {
  const id = useId();
  const [activeCase, setActiveCase] = useState<LabCase>('A');
  const [x, setX] = useState(DEFAULT_X);
  const [a, setA] = useState(5);
  const [b, setB] = useState(4);
  const [n, setN] = useState(3);
  const aResult = intPow(a * b, n);
  const bPower = intPow(b, n);
  const bResult = a * bPower;
  const cTerms = useMemo(() => {
    const cube = intPow(x, 3);
    const square = intPow(x, 2);
    const first = 5 * cube;
    const second = 6 * square;
    return { cube, square, first, second, total: first + second - 10 };
  }, [x]);
  const caseSteps: Step[] = activeCase === 'A'
    ? [
      { title: 'داخل القوس أولًا: نحسب الجداء', tex: tex`${a}\times${b}=${a * b}` },
      { title: 'ثم نرفع الجداء كله إلى القوة', tex: `${a * b}^{${n}}=${aResult}` },
    ]
    : activeCase === 'B'
      ? [
        { title: 'لا قوس: نحسب القوة على العامل الثاني وحده', tex: `${b}^{${n}}=${bPower}` },
        { title: 'ثم نضرب في العامل الأول', tex: tex`${a}\times${bPower}=${bResult}` },
      ]
      : [
        { title: 'نعوّض بقيمة المتغير كاملة بين قوسين', tex: tex`C=5(${x})^3+6(${x})^2-10` },
        { title: 'نحسب القوتين مستقلتين', tex: tex`(${x})^3=${cTerms.cube}\ ;\ (${x})^2=${cTerms.square}` },
        { title: 'ثم نضرب كل قوة في معاملها', tex: tex`5(${cTerms.cube})=${cTerms.first}\ ;\ 6(${cTerms.square})=${cTerms.second}` },
        { title: 'وأخيرًا نجمع ونطرح', tex: `${cTerms.first}+${cTerms.second}-10=${cTerms.total}` },
      ];
  const resultValue = activeCase === 'A' ? aResult : activeCase === 'B' ? bResult : cTerms.total;
  const resultTex = activeCase === 'A'
    ? tex`A=(${a}\times${b})^{${n}}=${aResult}`
    : activeCase === 'B'
      ? tex`B=${a}\times${b}^{${n}}=${bResult}`
      : tex`C=${cTerms.first}+${cTerms.second}-10=${cTerms.total}`;

  return (
    <section className="priority-lab" dir="rtl" aria-label="مختبر أولويات العمليات">
      <p className="priority-lab-intro">تجربة من تصميم المنصة؛ القيم الابتدائية تطابق مثال الكتاب. غيّر القيم لتختبر أثر القوس، أو غيّر قيمة المتغير لتراقب كل حد.</p>
      <div className="priority-lab-tabs" role="tablist" aria-label="حالات المثال">
        {(['A', 'B', 'C'] as LabCase[]).map((entry) => (
          <button key={entry} type="button" role="tab" aria-selected={entry === activeCase}
            className={`priority-lab-tab${entry === activeCase ? ' active' : ''}`} onClick={() => setActiveCase(entry)}>
            {entry === 'A' ? 'الحالة A: قوس' : entry === 'B' ? 'الحالة B: بلا قوس' : 'الحالة C: تعويض'}
          </button>
        ))}
      </div>
      {activeCase !== 'C' ? (
        <>
          <div className="priority-lab-inputs">
            <label htmlFor={`${id}-a`}>العامل الأول
              <select id={`${id}-a`} dir="ltr" value={a} onChange={(event) => setA(Number(event.target.value))}>
                {[2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label htmlFor={`${id}-b`}>العامل الثاني
              <select id={`${id}-b`} dir="ltr" value={b} onChange={(event) => setB(Number(event.target.value))}>
                {[2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label htmlFor={`${id}-n`}>الأس المشترك
              <select id={`${id}-n`} dir="ltr" value={n} onChange={(event) => setN(Number(event.target.value))}>
                {[0, 1, 2, 3, 4].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </div>
          <div className="priority-lab-comparison" role="group" aria-label="مقارنة أثر القوس">
            <div dir="ltr" data-testid="priority-comparison-A"><Formula math={tex`A=(${a}\times${b})^{${n}}=${aResult}`} display /></div>
            <div dir="ltr" data-testid="priority-comparison-B"><Formula math={tex`B=${a}\times${b}^{${n}}=${bResult}`} display /></div>
          </div>
          <p className="priority-lab-note" role="status">
            {aResult === bResult ? 'تساوت القيمتان هنا لأن الأس 1؛ جرّب أسًا آخر ولا تعمّم من حالة واحدة.' : 'القيمتان مختلفتان: في A يُرفع العاملان إلى القوة، وفي B يُرفع العامل الثاني وحده.'}
          </p>
        </>
      ) : (
        <div className="priority-lab-slider">
          <label htmlFor={`${id}-x`}>قيمة المتغير x</label>
          <input id={`${id}-x`} type="range" min={MIN_X} max={MAX_X} step={1} value={x} dir="ltr"
            onChange={(event) => setX(Math.max(MIN_X, Math.min(MAX_X, Math.round(Number(event.target.value)))))} />
          <span className="priority-lab-x-value" dir="ltr" aria-live="polite">{x}</span>
        </div>
      )}
      <ol className="priority-lab-steps">
        {caseSteps.map((step, index) => (
          <li key={step.title} className="priority-lab-step">
            <span className="priority-lab-step-index">{index + 1}</span>
            <span className="priority-lab-step-title"><MathText text={step.title} /></span>
            <span className="priority-lab-step-math" dir="ltr"><Formula math={step.tex} /></span>
          </li>
        ))}
      </ol>
      <div className="priority-lab-result">
        <span className="priority-lab-result-label">الناتج</span>
        <div className="priority-lab-result-math" dir="ltr"><Formula math={resultTex} display /></div>
        <span className="priority-lab-result-value" data-testid="priority-lab-result" dir="ltr" aria-live="polite">{resultValue}</span>
      </div>
      <p className="priority-lab-note">
        <MathText text={activeCase === 'C'
          ? tex`عند التعويض نضع العدد السالب كاملًا بين قوسين. الحد $6x^2$ غير سالب، أما إشارة $5x^3$ فتتبع إشارة $x$؛ ثم يبقى الحد الثابت $-10$.`
          : tex`الأقواس تحدّد مدى الأس. جميع العاملين في هذه التجربة موجبان وغير صفر، لذلك الأس صفر معرّف أيضًا. جرّب الأس 0 ثم 1 ثم 2.`} />
      </p>
      <button type="button" className="reveal-btn power-lab-reset" onClick={() => {
        setActiveCase('A'); setA(5); setB(4); setN(3); setX(DEFAULT_X);
      }}>إعادة تجربة الأولويات إلى البداية</button>
    </section>
  );
};
export default OrderOfOperationsLab;
