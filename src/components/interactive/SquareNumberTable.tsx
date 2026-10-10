import React, { useState } from 'react';
import { Math as TexMath } from '../math/Math';
import { MathText } from '../math/MathText';

/**
 * جداول المربعات — نشاط الصفحة 35 (إيجاد الجذر التربيعي لعدد موجب).
 *
 * الجداول الثلاثة كما وردت في الكتاب وبترتيبه: كل خانة في صف «العدد a» تقابلها
 * خانة في صف «a²». الخانات المطبوعة في الكتاب (0 و1 و4 للعددين 0 و1 و2) تظهر
 * ثابتة، والباقي خانات يملؤها الطالب ثم يتحقّق منها.
 */

interface TableSpec {
  id: string;
  values: number[];
  /** الخانات المطبوعة في الكتاب: قيمة a² المعطاة لكل عدد. */
  printed: Record<number, number>;
}

const TABLES: TableSpec[] = [
  { id: 'table-0-8', values: [8, 7, 6, 5, 4, 3, 2, 1, 0], printed: { 2: 4, 1: 1, 0: 0 } },
  { id: 'table-9-17', values: [17, 16, 15, 14, 13, 12, 11, 10, 9], printed: {} },
  { id: 'table-18-20', values: [20, 19, 18], printed: {} },
];

const ALL_VALUES = TABLES.flatMap((table) => table.values);

const isCorrectEntry = (value: number, raw: string | undefined): boolean =>
  raw !== undefined && raw.trim() !== '' && Number(raw) === value * value;

export const SquareNumberTable: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);

  const printedValues = new Set(TABLES.flatMap((table) => Object.keys(table.printed).map(Number)));
  const blankValues = ALL_VALUES.filter((value) => !printedValues.has(value));
  const correctCount = blankValues.filter((value) => isCorrectEntry(value, answers[value])).length;

  const reset = () => {
    setAnswers({});
    setChecked(false);
    setRevealed(false);
  };

  return (
    <section className="root-table-activity" aria-label="جداول مربعات الأعداد">
      {TABLES.map((table) => (
        <div key={table.id} className="root-table-scroll">
          <table className="root-square-table">
            <tbody>
              <tr>
                <th scope="row">العدد <span dir="ltr"><TexMath math="a" /></span></th>
                {table.values.map((value) => (
                  <td key={value} dir="ltr" className="root-square-value">{value}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">مربع العدد <span dir="ltr"><TexMath math="a^{2}" /></span></th>
                {table.values.map((value) => {
                  const printed = table.printed[value];
                  if (printed !== undefined) {
                    return (
                      <td key={value} dir="ltr" className="root-square-printed">{printed}</td>
                    );
                  }
                  const raw = answers[value];
                  const state = !checked || raw === undefined || raw.trim() === ''
                    ? ''
                    : isCorrectEntry(value, raw) ? ' is-correct' : ' is-wrong';
                  return (
                    <td key={value} dir="ltr">
                      <input
                        type="number"
                        inputMode="numeric"
                        className={`root-square-input${state}`}
                        aria-label={`مربع العدد ${value}`}
                        value={revealed ? String(value * value) : (raw ?? '')}
                        readOnly={revealed}
                        onChange={(event) => {
                          const next = event.target.value;
                          setAnswers((current) => ({ ...current, [value]: next }));
                          setChecked(false);
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <div className="root-controls">
        <button type="button" className="root-button primary" onClick={() => setChecked(true)} disabled={revealed}>
          تحقّق من الخانات
        </button>
        <button type="button" className="root-button" onClick={() => setRevealed((value) => !value)}>
          {revealed ? 'إخفاء الحل' : 'إظهار الحل'}
        </button>
        <button type="button" className="root-button" onClick={reset}>إعادة</button>
      </div>

      {checked && !revealed && (
        <p className="root-feedback" aria-live="polite">
          <MathText text={`الصحيح: ${correctCount} من ${blankValues.length} خانة فارغة.${correctCount < blankValues.length ? ' راجع الخانات المعلَّمة بالأحمر، وتذكّر أن $a^{2} = a \\times a$.' : ''}`} />
        </p>
      )}
    </section>
  );
};

export default SquareNumberTable;
