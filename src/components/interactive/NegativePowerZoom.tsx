import React, { useMemo, useState } from 'react';
import { Math as Formula } from '../math/Math';

/**
 * مختبر القوة السالبة (تعريف 2 — الصفحة 26، ومثال 10^-6 — الصفحة 27).
 *
 * الطالب يغيّر الأس السالب فيرى في الوقت نفسه:
 *   • الصورة الكسرية 1/10^n،
 *   • قيمة المقام 10^n،
 *   • العدد العشري مع إبراز خانات ما بعد الفاصلة،
 *   • عدد الأصفار بين الفاصلة والرقم 1 (وهو n−1)،
 *   • التحقّق بأن حاصل ضرب العدد في 10^n يساوي 1.
 *
 * الهدف: أن يرى الطالب أن الأس السالب يضع 1 في الخانة n بعد الفاصلة، وأن الناتج
 * عدد موجب أصغر من 1، فلا يخلط بين «أس سالب» و«عدد سالب».
 */

const MIN_N = 1;
const MAX_N = 6;

/** 10^n كعدد صحيح، مكتوبًا دون فواصل لتسهيل المقارنة. */
const powerOfTen = (n: number): string => `1${'0'.repeat(n)}`;

/** العدد العشري 10^{-n} = 0.⟨n−1 صفرًا⟩1. */
const decimalOfNegativePower = (n: number): string => `0.${'0'.repeat(n - 1)}1`;

export const NegativePowerZoom: React.FC = () => {
  const [n, setN] = useState<number>(3);

  const decimal = useMemo(() => decimalOfNegativePower(n), [n]);
  const denominator = useMemo(() => powerOfTen(n), [n]);

  /** خانات ما بعد الفاصلة: صفر في الخانات 1..n−1، والرقم 1 في الخانة n. */
  const places = useMemo(
    () => Array.from({ length: n }, (_, index) => ({ place: index + 1, digit: index === n - 1 ? '1' : '0' })),
    [n],
  );

  return (
    <section className="neg-zoom" aria-label="مختبر القوة السالبة للعدد 10">
      <p className="neg-zoom-intro">
        اختر الأس السالب <Formula math="n" /> ولاحظ ما يحدث للعدد في الوقت نفسه. غيّر القيمة ثم أجب:
        هل يمكن أن يكون <Formula math={`10^{-${n}}`} /> عددًا سالبًا؟
      </p>

      <div className="neg-zoom-picker" role="group" aria-label="اختيار قيمة الأس السالب">
        {Array.from({ length: MAX_N - MIN_N + 1 }, (_, index) => MIN_N + index).map((value) => (
          <button
            key={value}
            type="button"
            className={`neg-zoom-pick${value === n ? ' is-active' : ''}`}
            aria-pressed={value === n}
            onClick={() => setN(value)}
          >
            <Formula math={`10^{-${value}}`} />
          </button>
        ))}
      </div>

      <div className="neg-zoom-chain" aria-live="polite">
        <span className="neg-zoom-term">
          <Formula math={`10^{-${n}}`} />
        </span>
        <span className="neg-zoom-eq">=</span>
        <span className="neg-zoom-term">
          <Formula math={`\\frac{1}{10^{${n}}}`} />
        </span>
        <span className="neg-zoom-eq">=</span>
        <span className="neg-zoom-term neg-zoom-fraction">
          <Formula math={`\\frac{1}{${denominator}}`} />
        </span>
        <span className="neg-zoom-eq">=</span>
        <span className="neg-zoom-term neg-zoom-decimal" dir="ltr">
          {decimal}
        </span>
      </div>

      <div className="neg-zoom-places">
        <span className="neg-zoom-places-label">خانات ما بعد الفاصلة:</span>
        <div className="neg-zoom-place-row" dir="ltr">
          {places.map((entry) => (
            <div key={entry.place} className={`neg-zoom-place${entry.digit === '1' ? ' is-one' : ''}`}>
              <span className="neg-zoom-place-digit">{entry.digit}</span>
              <span className="neg-zoom-place-index">{entry.place}</span>
            </div>
          ))}
        </div>
      </div>

      <ul className="neg-zoom-facts">
        <li>
          الرقم <span dir="ltr">1</span> يقع في الخانة <Formula math={`${n}`} /> بعد الفاصلة.
        </li>
        <li>
          عدد الأصفار بين الفاصلة والرقم <span dir="ltr">1</span> هو{' '}
          <Formula math={`${n - 1}`} /> (أي <Formula math={`n-1`} />).
        </li>
        <li>
          العدد الناتج موجب، وأصغر من <span dir="ltr">1</span>، ومقلوبه هو{' '}
          <Formula math={`10^{${n}}=${denominator}`} />.
        </li>
        <li>
          التحقّق: <Formula math={`${decimal}\\times${denominator}=1`} />.
        </li>
      </ul>

      <p className="neg-zoom-note">
        عندما نكبّر الأس السالب يزداد عدد الأصفار فيصغر العدد: كل زيادة <span dir="ltr">1</span> في قيمة الأس
        تعني قسمة العدد على <span dir="ltr">10</span>. لذلك <Formula math={`10^{-${n}}`} /> أصغر من{' '}
        <Formula math={`10^{${n - 1}}`} /> لكنه أكبر من <Formula math="0" /> دائمًا.
      </p>
    </section>
  );
};

export default NegativePowerZoom;
