import React, { useState } from 'react';
import { Math as TexMath } from '../math/Math';
import { MathText } from '../math/MathText';
import { Check, Eye, RotateCcw, Sparkles } from 'lucide-react';

/**
 * مختبر جدول «التخمين وإيجاد النظير» — الصفحة 47، النشاط 1 و2.
 *
 * يحاكي جدول الكتاب ذا الأعمدة الثمانية والصفوف الأربعة حرفيًا:
 *   a | b | a+b | a-b | -(a+b) | -(a-b) | -a-b | -a+b
 * للصفوف (2,1)، (-1,-2)، (-5,3)، (-2,8)، مع تمييز لوني للأعمدة المتساوية
 * وتجربة صف حرّ يختاره الطالب للتحقق من تخمينه على أعداد جديدة.
 */

export interface OppositeTableRowSpec {
  id: string;
  a: number;
  b: number;
}

export const BOOK_TABLE_ROWS: readonly OppositeTableRowSpec[] = [
  { id: 'r1', a: 2, b: 1 },
  { id: 'r2', a: -1, b: -2 },
  { id: 'r3', a: -5, b: 3 },
  { id: 'r4', a: -2, b: 8 },
];

export type ComputedColKey =
  | 'sum'
  | 'diff'
  | 'oppSum'
  | 'oppDiff'
  | 'negANegB'
  | 'negAPosB';

interface ColumnMeta {
  key: ComputedColKey;
  tex: string;
  labelAr: string;
  pairGroup?: 'sum-pair' | 'diff-pair';
  compute: (a: number, b: number) => number;
}

export const COMPUTED_COLUMNS: readonly ColumnMeta[] = [
  { key: 'sum', tex: 'a + b', labelAr: 'المجموع a+b', compute: (a, b) => a + b },
  { key: 'diff', tex: 'a - b', labelAr: 'الفرق a-b', compute: (a, b) => a - b },
  {
    key: 'oppSum',
    tex: '-(a + b)',
    labelAr: 'نظير المجموع -(a+b)',
    pairGroup: 'sum-pair',
    compute: (a, b) => -(a + b),
  },
  {
    key: 'oppDiff',
    tex: '-(a - b)',
    labelAr: 'نظير الفرق -(a-b)',
    pairGroup: 'diff-pair',
    compute: (a, b) => -(a - b),
  },
  {
    key: 'negANegB',
    tex: '-a - b',
    labelAr: 'العبارة -a-b',
    pairGroup: 'sum-pair',
    compute: (a, b) => -a - b,
  },
  {
    key: 'negAPosB',
    tex: '-a + b',
    labelAr: 'العبارة -a+b',
    pairGroup: 'diff-pair',
    compute: (a, b) => -a + b,
  },
];

function normalizeIntInput(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw
    .trim()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[−–—]/g, '-')
    .replace(/\s+/g, '');
  if (!/^[+-]?\d+$/.test(cleaned)) return null;
  return Number(cleaned);
}

export const OppositeTableLab: React.FC = () => {
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [highlightPairs, setHighlightPairs] = useState(false);
  const [customA, setCustomA] = useState<number>(6);
  const [customB, setCustomB] = useState<number>(-4);

  const cellKey = (rowId: string, colKey: ComputedColKey) => `${rowId}:${colKey}`;

  const totalBlanks = BOOK_TABLE_ROWS.length * COMPUTED_COLUMNS.length;
  const correctCount = BOOK_TABLE_ROWS.reduce((acc, row) => {
    return (
      acc +
      COMPUTED_COLUMNS.filter((col) => {
        const parsed = normalizeIntInput(entries[cellKey(row.id, col.key)]);
        return parsed !== null && parsed === col.compute(row.a, row.b);
      }).length
    );
  }, 0);

  const handleReset = () => {
    setEntries({});
    setChecked(false);
    setRevealed(false);
    setHighlightPairs(false);
    setCustomA(6);
    setCustomB(-4);
  };

  return (
    <section className="u3-lab-card" aria-label="جدول التخمين وإيجاد النظير">
      <div className="u3-lab-head">
        <div>
          <span className="u3-lab-eyebrow">نشاط تفاعلي • الصفحة 47</span>
          <h4 className="u3-lab-title">أكمل الجدول وقارن الأعمدة المتطابقة</h4>
        </div>
        <button
          type="button"
          className={`u3-pair-toggle${highlightPairs ? ' is-active' : ''}`}
          onClick={() => setHighlightPairs((v) => !v)}
        >
          <Sparkles size={15} />
          <span>{highlightPairs ? 'إخفاء تلوين الأعمدة المتطابقة' : 'قارن الأعمدة لاكتشاف القاعدة'}</span>
        </button>
      </div>

      {/* الجدول يُقرأ من اليسار إلى اليمين كما طُبع في الكتاب */}
      <div className="u3-table-scroll" dir="ltr">
        <table className="u3-opp-table">
          <thead>
            <tr>
              <th scope="col"><TexMath math="a" /></th>
              <th scope="col"><TexMath math="b" /></th>
              {COMPUTED_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={highlightPairs && col.pairGroup ? `is-${col.pairGroup}` : ''}
                >
                  <TexMath math={col.tex} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOOK_TABLE_ROWS.map((row) => (
              <tr key={row.id}>
                <td className="u3-given-cell"><TexMath math={String(row.a)} /></td>
                <td className="u3-given-cell"><TexMath math={String(row.b)} /></td>
                {COMPUTED_COLUMNS.map((col) => {
                  const k = cellKey(row.id, col.key);
                  const expected = col.compute(row.a, row.b);
                  const raw = entries[k] ?? '';
                  const parsed = normalizeIntInput(raw);
                  const isCellCorrect = parsed !== null && parsed === expected;
                  const stateCls =
                    revealed
                      ? ' is-revealed'
                      : !checked || raw.trim() === ''
                        ? ''
                        : isCellCorrect
                          ? ' is-correct'
                          : ' is-wrong';
                  const pairCls = highlightPairs && col.pairGroup ? ` is-${col.pairGroup}` : '';

                  return (
                    <td key={col.key} className={`u3-input-cell${pairCls}`}>
                      <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        className={`u3-cell-input${stateCls}`}
                        aria-label={`${col.labelAr} عندما a=${row.a} و b=${row.b}`}
                        value={revealed ? String(expected) : raw}
                        readOnly={revealed}
                        placeholder="؟"
                        onChange={(e) => {
                          const val = e.target.value;
                          setEntries((prev) => ({ ...prev, [k]: val }));
                          setChecked(false);
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* صف إضافي حرّ من المنصة لاختبار التخمين على أي عددين */}
            <tr className="u3-custom-row">
              <td className="u3-given-cell">
                <input
                  type="number"
                  min={-20}
                  max={20}
                  dir="ltr"
                  className="u3-custom-num"
                  aria-label="قيمة حرة للرمز a"
                  value={customA}
                  onChange={(e) => setCustomA(Math.max(-20, Math.min(20, Number(e.target.value) || 0)))}
                />
              </td>
              <td className="u3-given-cell">
                <input
                  type="number"
                  min={-20}
                  max={20}
                  dir="ltr"
                  className="u3-custom-num"
                  aria-label="قيمة حرة للرمز b"
                  value={customB}
                  onChange={(e) => setCustomB(Math.max(-20, Math.min(20, Number(e.target.value) || 0)))}
                />
              </td>
              {COMPUTED_COLUMNS.map((col) => (
                <td
                  key={col.key}
                  className={`u3-computed-live${highlightPairs && col.pairGroup ? ` is-${col.pairGroup}` : ''}`}
                >
                  <TexMath math={String(col.compute(customA, customB))} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="u3-custom-hint">
        الصف الأخير تجريبي من المنصة: غيّر قيمتي <TexMath math="a" /> و<TexMath math="b" /> لترى هل يبقى تطابق العمودين صحيحًا مع أعدادك الخاصة.
      </p>

      <div className="u3-lab-actions">
        <button
          type="button"
          className="u3-btn u3-btn-primary"
          disabled={revealed}
          onClick={() => {
            setChecked(true);
            if (correctCount === totalBlanks) setHighlightPairs(true);
          }}
        >
          <Check size={15} />
          <span>تحقّق من الجدول</span>
        </button>

        <button
          type="button"
          className="u3-btn"
          onClick={() => {
            setRevealed((prev) => {
              const next = !prev;
              if (next) setHighlightPairs(true);
              return next;
            });
          }}
        >
          <Eye size={15} />
          <span>{revealed ? 'إخفاء الحل' : 'إظهار الحل'}</span>
        </button>

        <button type="button" className="u3-btn" onClick={handleReset}>
          <RotateCcw size={15} />
          <span>إعادة</span>
        </button>
      </div>

      {checked && !revealed && (
        <div
          className={`u3-lab-feedback ${correctCount === totalBlanks ? 'is-ok' : 'is-warn'}`}
          role="status"
          aria-live="polite"
        >
          <MathText
            text={
              correctCount === totalBlanks
                ? `أحسنت! جميع الخانات الـ ${totalBlanks} صحيحة. لاحظ الآن تطابق العمودين $-(a+b)$ و$-a-b$، وتطابق العمودين $-(a-b)$ و$-a+b$.`
                : `عدد الخانات الصحيحة حاليًا: ${correctCount} من ${totalBlanks}. انتبه عند طرح عدد سالب: $a - (-2) = a + 2$، وعند حساب $-a$ حين يكون $a$ سالبًا فإن $-(-5) = +5$.`
            }
          />
        </div>
      )}

      {highlightPairs && (
        <div className="u3-pair-legend">
          <div className="u3-pair-chip is-sum-pair">
            <span className="u3-dot" />
            <MathText text="تطابق تام في كل الصفوف: $-(a + b) = -a - b$ (نظير المجموع هو مجموع النظيرين)" />
          </div>
          <div className="u3-pair-chip is-diff-pair">
            <span className="u3-dot" />
            <MathText text="تطابق تام في كل الصفوف: $-(a - b) = -a + b$ (نظير الفرق هو مجموع $b$ ونظير $a$)" />
          </div>
        </div>
      )}
    </section>
  );
};

export default OppositeTableLab;
