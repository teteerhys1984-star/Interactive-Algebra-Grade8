import React, { useState } from 'react';
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';
import { Check, Eye, RefreshCw } from 'lucide-react';

/**
 * قارئ الكسر المركّب — الدرس 3 (الصفحتان 13 و 15).
 *
 * الكتاب يشدّد على أنّ «خط الكسر المحاذي للرمز = » هو الذي يحدّد العملية. هنا يختار
 * الطالب القراءة الصحيحة للعبارة المركّبة قبل أن يرى الحل، فالمهارة المستهدفة هي
 * قراءة الكسر لا مجرّد الحساب.
 */

export interface CompoundFractionItem {
  /** العبارة كما تُكتب في الكتاب. */
  expression: string;
  /** القراءات المقترحة (واحدة صحيحة). */
  readings: { text: string; correct?: boolean }[];
  /** خطوات الحل التي تُكشف بعد الاختيار. */
  solution: string;
  /** شرح مرافق. */
  explain: string;
}

interface CompoundFractionReaderProps {
  items: CompoundFractionItem[];
}

const SingleItem: React.FC<{ item: CompoundFractionItem; index: number }> = ({ item, index }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const correctIndex = item.readings.findIndex((r) => r.correct);
  const isCorrect = checked && selected === correctIndex;

  return (
    <div className="cf-item">
      <div className="cf-head">
        <span className="step-badge-mini">{index + 1}</span>
        <span>أيّ قراءة توافق خط الكسر الرئيسي؟</span>
      </div>

      <div className="cf-expression">
        <Formula display math={item.expression} />
      </div>

      <div className="cf-readings">
        {item.readings.map((r, i) => {
          let cls = 'cf-reading';
          if (checked) {
            if (i === correctIndex) cls += ' pc-correct';
            else if (i === selected) cls += ' pc-wrong';
          } else if (i === selected) {
            cls += ' pc-selected';
          }
          return (
            <button
              key={i}
              type="button"
              className={cls}
              disabled={checked}
              onClick={() => setSelected(i)}
            >
              <Formula math={r.text} />
            </button>
          );
        })}
      </div>

      <div className="pc-actions">
        <button
          type="button"
          className="reveal-btn pc-check-btn"
          disabled={selected === null || checked}
          onClick={() => setChecked(true)}
        >
          <Check size={14} />
          <span>تحقّق</span>
        </button>
        {checked && (
          <button
            type="button"
            className="pc-retry"
            onClick={() => {
              setChecked(false);
              setSelected(null);
              setShowSolution(false);
            }}
          >
            حاول مجددًا
          </button>
        )}
        {checked && (
          <button type="button" className="reveal-btn" onClick={() => setShowSolution((s) => !s)}>
            {showSolution ? <RefreshCw size={14} /> : <Eye size={14} />}
            <span>{showSolution ? 'إخفاء الحل' : 'إظهار خطوات الحل'}</span>
          </button>
        )}
      </div>

      {checked && (
        <div className={`pc-feedback ${isCorrect ? 'pc-feedback-ok' : 'pc-feedback-info'}`}>
          <span className="pc-feedback-tag">{isCorrect ? 'قراءة صحيحة' : 'لنعد القراءة'}</span>
          <MathText text={item.explain} />
        </div>
      )}

      {showSolution && (
        <div className="solution-panel">
          <div className="solution-panel-header">
            <Check size={16} />
            <span>خطوات الحل:</span>
          </div>
          <Formula display math={item.solution} />
        </div>
      )}
    </div>
  );
};

export const CompoundFractionReader: React.FC<CompoundFractionReaderProps> = ({ items }) => (
  <div className="interactive-card cf-reader">
    {items.map((item, i) => (
      <SingleItem key={i} item={item} index={i} />
    ))}
  </div>
);

export default CompoundFractionReader;
