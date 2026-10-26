import { useState } from 'react';
import { MathText } from '../math/MathText';

/** المختبر يقارن مساواة الطالب الأصلية ذات 3x²، لا عبارة السؤال ذات x². */
export function studentClaimValues(x: number): { left: number; right: number } {
  return { left: (3 * x + 1) * (x + 2), right: 3 * x * x + 6 * x + 2 };
}

function readNumber(value: string): number | null {
  const normalized = value.trim().replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660)).replace(/٫/g, '.');
  if (!normalized) return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

export function Unit3Lesson5SubstitutionLab() {
  const [x, setX] = useState(0);
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [checked, setChecked] = useState(false);
  const { left, right } = studentClaimValues(x);
  const correct = readNumber(leftInput) === left && readNumber(rightInput) === right;

  function reset() {
    setLeftInput('');
    setRightInput('');
    setChecked(false);
  }

  return (
    <section className="u3-lab-card u3l2-lab u3l5-substitution-lab" dir="rtl" aria-label="مختبر اختبار مساواة الطالب">
      <p><MathText text="قارن $(3x+1)(x+2)$ بالطرف الأصلي $3x^2+6x+2$." /></p>
      <label className="u3l2-x-slider">
        <span>قيمة x للتعويض: </span>
        <select aria-label="قيمة x في المختبر" value={x} onChange={(event) => { setX(Number(event.target.value)); reset(); }}>
          {[-3, -2, -1, 0, 1, 2, 3].map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </label>
      <div className="u3l2-input-row">
        <label className="u3l2-field">
          <span className="u3l2-field-label">قيمة الطرف الأيسر</span>
          <input className="u3l2-input" dir="ltr" inputMode="decimal" aria-label="قيمة الطرف الأيسر في المختبر"
            value={leftInput} onChange={(event) => { setLeftInput(event.target.value); setChecked(false); }} />
        </label>
        <label className="u3l2-field">
          <span className="u3l2-field-label">قيمة طرف الطالب الأصلي</span>
          <input className="u3l2-input" dir="ltr" inputMode="decimal" aria-label="قيمة الطرف الأيمن في المختبر"
            value={rightInput} onChange={(event) => { setRightInput(event.target.value); setChecked(false); }} />
        </label>
      </div>
      <div className="u3-lab-actions">
        <button type="button" className="u3-btn u3-btn-primary" onClick={() => setChecked(true)}>تحقّق من الطرفين</button>
        <button type="button" className="u3-btn" onClick={reset}>إعادة المحاولة</button>
      </div>
      {checked && (
        <div className={`u3-lab-feedback ${correct ? 'is-ok' : 'is-warn'}`} role="status" aria-live="polite">
          {!correct ? 'راجع التعويض في كل طرف ثم حاول مجددًا.' : left === right
            ? `حسابك صحيح: الطرفان متساويان ويساوي كل منهما ${left} عند هذه القيمة. هذا لا يثبت المطابقة لكل القيم.`
            : `حسابك صحيح: الطرف الأيسر ${left} والأيمن ${right}؛ الطرفان مختلفان. هذه القيمة مثال معاكس ينقض صحة المساواة لكل القيم.`}
        </div>
      )}
    </section>
  );
}
