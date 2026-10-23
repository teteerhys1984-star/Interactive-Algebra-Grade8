import React, { useMemo, useState } from 'react';
import { Math as Formula } from '../math/Math';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

/**
 * مختبر الصيغة المعيارية (الصفحة 27).
 *
 * الطالب يكتب عددًا عشريًا، ثم يحرّك الفاصلة خانةً خانةً بنفسه، ويرى في الوقت
 * نفسه:
 *   • العدد a الناتج عن تحريك الفاصلة،
 *   • الأس n المطابق لكل تحريك (يسار ⇒ +1، يمين ⇒ −1)،
 *   • هل الصيغة الحالية صيغة معيارية أم لا (الشرط: خانة واحدة غير صفرية قبل الفاصلة).
 *
 * ليس في المكوّن زر يعرض الجواب النهائي: القيم كلها محسوبة من رقم الطالب ومن
 * عدد الخانات التي حرّكها، ولا يظهر «الصحيح» إلا عندما يصبح a داخل المجال.
 */

interface ParsedDecimal {
  negative: boolean;
  /** الأرقام بلا فاصلة. */
  digits: string;
  /** عدد الأرقام التي تقع قبل الفاصلة. */
  point: number;
}

/** يقرأ عددًا عشريًا مكتوبًا بالأرقام اللاتينية، ويتجاهل فواصل الآلاف (المسافات). */
function parseDecimal(raw: string): ParsedDecimal | null {
  const cleaned = raw
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[\s\u00a0\u202f]/g, '')
    .replace(/[\u2212\u2013\u2014]/g, '-');

  if (!/^-?\d*\.?\d*$/.test(cleaned) || cleaned === '' || cleaned === '-' || cleaned === '.') return null;

  const negative = cleaned.startsWith('-');
  const body = negative ? cleaned.slice(1) : cleaned;
  if (!/\d/.test(body)) return null;

  const [integerPart, fractionPart = ''] = body.split('.');
  const digits = `${integerPart || '0'}${fractionPart}`;
  const point = (integerPart || '0').length;
  return { negative, digits, point };
}

/** يعيد كتابة الأرقام مع الفاصلة بعد `point` رقمًا (مع إضافة أصفار عند اللزوم). */
function formatWithPoint(digits: string, point: number): string {
  let integerPart: string;
  let fractionPart: string;

  if (point <= 0) {
    integerPart = '0';
    fractionPart = `${'0'.repeat(-point)}${digits}`;
  } else if (point >= digits.length) {
    integerPart = `${digits}${'0'.repeat(point - digits.length)}`;
    fractionPart = '';
  } else {
    integerPart = digits.slice(0, point);
    fractionPart = digits.slice(point);
  }

  // أصفار بادئة لا معنى لها في القراءة (0075 ← 75)؛ نحذفها عند العرض فقط.
  integerPart = integerPart.replace(/^0+(?=\d)/, '');
  return fractionPart ? `${integerPart}.${fractionPart}` : integerPart;
}

/**
 * هل يقع رقم واحد غير صفري قبل الفاصلة؟ (أي 1 ≤ |a| < 10)
 * يُحسب بالخانات لا بالقيمة العشرية، لتجنّب أخطاء الفاصلة العائمة.
 */
function isStandardMagnitude(digits: string, point: number): boolean {
  const firstSignificant = digits.search(/[1-9]/);
  if (firstSignificant === -1) return false;
  return point === firstSignificant + 1;
}

const PRESETS = ['2569.8', '-2569.8', '0.075', '0.000025'];

export const StandardFormLab: React.FC = () => {
  const [raw, setRaw] = useState<string>('2569.8');
  const [shift, setShift] = useState<number>(0);

  const parsed = useMemo(() => parseDecimal(raw), [raw]);

  const current = useMemo(() => {
    if (!parsed) return null;
    // تحريك الفاصلة `shift` خانة إلى اليسار يعني a = العدد × 10^-shift.
    const point = parsed.point - shift;
    const digits = parsed.digits;
    const isStandard = isStandardMagnitude(digits, point);
    const aText = formatWithPoint(digits, point);
    return {
      aText: parsed.negative ? `-${aText}` : aText,
      exponent: shift,
      isStandard,
    };
  }, [parsed, shift]);

  const setRawValue = (value: string) => {
    setRaw(value);
    setShift(0);
  };

  return (
    <section className="sf-lab" aria-label="مختبر الصيغة المعيارية">
      <p className="sf-lab-intro">
        اكتب عددًا عشريًا، ثم حرّك الفاصلة بزرّي التحريك. راقب في الوقت نفسه قيمة{' '}
        <Formula math="a" /> وقيمة <Formula math="n" />: كل خانة إلى اليسار تزيد الأس واحدًا، وكل خانة
        إلى اليمين تنقصه واحدًا. الصيغة تصبح معيارية عندما يبقى رقم واحد غير صفري قبل الفاصلة.
      </p>

      <div className="sf-lab-input-row">
        <label className="sf-lab-label" htmlFor="sf-lab-input">
          العدد
        </label>
        <input
          id="sf-lab-input"
          className="sf-lab-input"
          dir="ltr"
          inputMode="decimal"
          autoComplete="off"
          value={raw}
          onChange={(event) => setRawValue(event.target.value)}
          placeholder="مثال: 2569.8"
          aria-describedby="sf-lab-hint"
        />
        <span id="sf-lab-hint" className="sf-lab-hint">
          استعمل الفاصلة العشرية أو اتركها للأعداد الصحيحة.
        </span>
      </div>

      <div className="sf-lab-presets" role="group" aria-label="أمثلة جاهزة">
        <span className="sf-lab-presets-label">أمثلة:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className="sf-lab-preset"
            onClick={() => setRawValue(preset)}
          >
            <span dir="ltr">{preset}</span>
          </button>
        ))}
      </div>

      {!parsed ? (
        <p className="sf-lab-error" role="status">
          اكتب عددًا صحيحًا أو عشريًا (يمكن أن يكون سالبًا) لتظهر الصيغة.
        </p>
      ) : (
        <>
          <div className="sf-lab-controls">
            <button
              type="button"
              className="sf-lab-move"
              onClick={() => setShift((value) => value + 1)}
              aria-label="انقل الفاصلة خانة إلى اليسار"
            >
              <ArrowLeft size={16} />
              <span>الفاصلة إلى اليسار</span>
            </button>
            <button
              type="button"
              className="sf-lab-move"
              onClick={() => setShift((value) => value - 1)}
              aria-label="انقل الفاصلة خانة إلى اليمين"
            >
              <span>الفاصلة إلى اليمين</span>
              <ArrowRight size={16} />
            </button>
            <button type="button" className="sf-lab-reset" onClick={() => setShift(0)}>
              <RotateCcw size={16} />
              <span>إعادة</span>
            </button>
            <span className="sf-lab-shift" aria-live="polite">
              {shift === 0
                ? 'الفاصلة في مكانها الأصلي'
                : `حرّكت الفاصلة ${Math.abs(shift)} خانة إلى ${shift > 0 ? 'اليسار' : 'اليمين'}`}
            </span>
          </div>

          <div className="sf-lab-readout" aria-live="polite">
            <div className="sf-lab-equation">
              <Formula math={`${current?.aText} \\times 10^{${current?.exponent}}`} />
            </div>
            <div className={`sf-lab-status${current?.isStandard ? ' is-standard' : ''}`}>
              {current?.isStandard
                ? 'هذه صيغة معيارية: قبل الفاصلة رقم واحد غير صفري، والأس عدد صحيح.'
                : 'ليست صيغة معيارية بعد: يلزم أن يقع قبل الفاصلة رقم واحد فقط وغير صفري.'}
            </div>
          </div>

          <div className="sf-lab-track" dir="ltr">
            <span className="sf-lab-track-value">{current?.aText}</span>
            <span className="sf-lab-track-arrow">× 10</span>
            <span className="sf-lab-track-value">{current?.exponent}</span>
            <span className="sf-lab-track-eq">=</span>
            <span className="sf-lab-track-value">{parsed.negative ? '-' : ''}{formatWithPoint(parsed.digits, parsed.point)}</span>
          </div>

          <p className="sf-lab-note">
            القيمة لا تتغيّر أبدًا عند تحريك الفاصلة؛ يتغيّر فقط شكل الكتابة. تحقّق بنفسك: اضرب{' '}
            <Formula math="a" /> في <Formula math="10^{n}" /> فتحصل على العدد نفسه.
          </p>
        </>
      )}
    </section>
  );
};

export default StandardFormLab;
