import React, { useMemo, useState } from 'react';
// الاسم مستعار حتى لا يحجب مكوّن KaTeX كائن Math العام.
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';
import { intPow } from './powerMath';

/**
 * مختبر أولويات العمليات — الدرس الثالث من الوحدة الثانية (الصفحة 33).
 *
 * ثلاث حالات من مثال الكتاب نفسه:
 *   A = (5×4)^{3}            ← نبدأ بما داخل القوسين،
 *   B = 5×4^{3}              ← لا أقواس: نبدأ بالقوة،
 *   C = 5x^{3}+6x^{2}-10     ← نعوّض بقيمة x ونحسب القوى أولًا.
 *
 * الحالة C تفاعلية: الطالب يحرّك قيمة x (من −6 إلى 6) ويرى أثر الإشارة في كل
 * حد. الحساب كله بعدد صحيح دقيق، والقيمة النهائية هي مجموع الحدود.
 */

type LabCase = 'A' | 'B' | 'C';

const MIN_X = -6;
const MAX_X = 6;
const DEFAULT_X = -4;

interface Step {
  title: string;
  tex: string;
}

const OrderOfOperationsLab: React.FC = () => {
  const [activeCase, setActiveCase] = useState<LabCase>('A');
  const [x, setX] = useState<number>(DEFAULT_X);

  const cubeOfTwenty = intPow(20, 3);
  const cubeOfFour = intPow(4, 3);
  const bResult = 5 * cubeOfFour;

  const cTerms = useMemo(() => {
    const cube = intPow(x, 3);
    const square = intPow(x, 2);
    const first = 5 * cube;
    const second = 6 * square;
    return { cube, square, first, second, total: first + second - 10 };
  }, [x]);

  const caseSteps = useMemo<Step[]>(() => {
    switch (activeCase) {
      case 'A':
        return [
          { title: 'أولوية القوسين: نضرب ما داخل القوس', tex: `(5 \\times 4) = 20` },
          { title: 'ثم نحسب القوة', tex: `20^{3} = ${cubeOfTwenty}` },
        ];
      case 'B':
        return [
          { title: 'لا أقواس: نبدأ بالقوة وحدها', tex: `4^{3} = ${cubeOfFour}` },
          { title: 'ثم ننجز الضرب', tex: `5 \\times ${cubeOfFour} = ${bResult}` },
        ];
      case 'C':
      default:
        return [
          { title: 'نبدأ بالقوتين', tex: `x^{3} = ${cTerms.cube}, \\quad x^{2} = ${cTerms.square}` },
          { title: 'ثم نضرب كل قوة في معاملها', tex: `5 \\times (${cTerms.cube}) = ${cTerms.first}, \\quad 6 \\times ${cTerms.square} = ${cTerms.second}` },
          { title: 'وأخيرًا نجمع ونطرح من اليسار إلى اليمين', tex: `${cTerms.first} + ${cTerms.second} - 10 = ${cTerms.total}` },
        ];
    }
  }, [activeCase, cTerms, cubeOfFour, cubeOfTwenty, bResult]);

  const resultValue = activeCase === 'A' ? cubeOfTwenty : activeCase === 'B' ? bResult : cTerms.total;

  const resultTex = activeCase === 'A'
    ? `A = (5 \\times 4)^{3} = 20^{3} = ${cubeOfTwenty}`
    : activeCase === 'B'
      ? `B = 5 \\times 4^{3} = 5 \\times ${cubeOfFour} = ${bResult}`
      : `C = 5\\left(${x}\\right)^{3} + 6\\left(${x}\\right)^{2} - 10 = ${cTerms.first} + ${cTerms.second} - 10 = ${cTerms.total}`;

  return (
    <section className="priority-lab" dir="rtl" aria-label="مختبر أولويات العمليات">
      <p className="priority-lab-intro">
        <MathText text="القوى تُحسب أولًا، ثم الضرب والقسمة، ثم الجمع والطرح. جرّب الحالات الثلاث ولاحظ كيف يغيّر القوس النتيجة." />
      </p>

      <div className="priority-lab-tabs" role="tablist" aria-label="حالات المثال">
        {(['A', 'B', 'C'] as LabCase[]).map((entry) => (
          <button
            key={entry}
            type="button"
            role="tab"
            aria-selected={entry === activeCase}
            className={`priority-lab-tab${entry === activeCase ? ' active' : ''}`}
            onClick={() => setActiveCase(entry)}
          >
            {entry === 'A' ? 'الحالة A: قوس' : entry === 'B' ? 'الحالة B: بلا قوس' : 'الحالة C: تعويض'}
          </button>
        ))}
      </div>

      {activeCase === 'C' && (
        <div className="priority-lab-slider">
          <label htmlFor="priority-lab-x">قيمة المتغير x</label>
          <input
            id="priority-lab-x"
            type="range"
            min={MIN_X}
            max={MAX_X}
            step={1}
            value={x}
            onChange={(event) => setX(Number.parseInt(event.target.value, 10))}
            aria-label="قيمة المتغير x"
          />
          <span className="priority-lab-x-value" dir="ltr" aria-live="polite">
            {x}
          </span>
        </div>
      )}

      <ol className="priority-lab-steps">
        {caseSteps.map((step, index) => (
          <li key={step.title} className="priority-lab-step">
            <span className="priority-lab-step-index">{index + 1}</span>
            <span className="priority-lab-step-title">
              <MathText text={step.title} />
            </span>
            <span className="priority-lab-step-math" dir="ltr">
              <Formula math={step.tex} />
            </span>
          </li>
        ))}
      </ol>

      <div className="priority-lab-result">
        <span className="priority-lab-result-label">الناتج</span>
        <div className="priority-lab-result-math" dir="ltr">
          <Formula math={resultTex} display />
        </div>
        <span className="priority-lab-result-value" data-testid="priority-lab-result" dir="ltr">
          {resultValue}
        </span>
      </div>

      <p className="priority-lab-note">
        <MathText
          text={
            activeCase === 'A'
              ? 'القوس يفرض إنجاز $5\\times4$ أولًا، ثم يُرفع الناتج 20 إلى الأس 3.'
              : activeCase === 'B'
                ? 'غياب القوس يعني أن الأس يخصّ العدد 4 وحده، فالناتج أصغر بكثير من الحالة A.'
                : 'في التعويض نضع قيمة x بين قوسين، فتصبح $5\\left(x\\right)^{3}$ لا $5x^{3}$؛ وهذا يحفظ إشارة الأساس مع الأس الفردي.'
          }
        />
      </p>
    </section>
  );
};

export default OrderOfOperationsLab;
export { OrderOfOperationsLab };
