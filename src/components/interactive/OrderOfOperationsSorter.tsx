import React, { useState } from 'react';
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';
import { RotateCcw, ListOrdered } from 'lucide-react';

/**
 * ترتيب خطوات الحل حسب الأولويات — الدرس 3 (صفحة 14: «كيف تتم مراعاة الأولويات؟»).
 *
 * الطالب يرتّب بطاقات الحل بالترتيب الصحيح. التغذية الراجعة هادئة: لا حكم فوري بعد كل
 * نقرة، بل مراجعة بعد اكتمال الترتيب مع إمكانية إعادة المحاولة.
 */

export interface OrderStep {
  /** نص الخطوة (عربي + رياضيات بصيغة $...$). */
  text: string;
  /** صيغة رياضية اختيارية تُعرض تحت النص. */
  math?: string;
}

interface OrderOfOperationsSorterProps {
  /** العبارة المطلوب حسابها. */
  expression: string;
  /** الخطوات بالترتيب الصحيح. */
  steps: OrderStep[];
  /** ترتيب العرض الأولي (فهارس داخل steps). إن غاب تُعرض معكوسة. */
  shuffled?: number[];
  /** ملاحظة ختامية تظهر بعد الترتيب الصحيح. */
  conclusion?: string;
}

export const OrderOfOperationsSorter: React.FC<OrderOfOperationsSorterProps> = ({
  expression,
  steps,
  shuffled,
  conclusion,
}) => {
  const displayOrder = shuffled ?? steps.map((_, i) => steps.length - 1 - i);
  const [picked, setPicked] = useState<number[]>([]);
  const [reviewed, setReviewed] = useState(false);

  const isComplete = picked.length === steps.length;
  const isCorrect = picked.every((v, i) => v === i);

  const pick = (idx: number) => {
    if (reviewed || picked.includes(idx)) return;
    setPicked((prev) => [...prev, idx]);
  };

  const reset = () => {
    setPicked([]);
    setReviewed(false);
  };

  return (
    <div className="interactive-card oo-sorter">
      <div className="oo-head">
        <ListOrdered size={18} />
        <span>رتّب خطوات الحل بالترتيب الصحيح حسب الأولويات</span>
      </div>

      <div className="oo-expression">
        <Formula display math={expression} />
      </div>

      <div className="oo-pool">
        {displayOrder.map((idx) => {
          const order = picked.indexOf(idx);
          const chosen = order !== -1;
          let cls = 'oo-card';
          if (chosen) cls += ' oo-chosen';
          if (reviewed && chosen) cls += order === idx ? ' oo-right' : ' oo-misplaced';
          return (
            <button key={idx} type="button" className={cls} onClick={() => pick(idx)} disabled={reviewed}>
              <span className="oo-order">{chosen ? order + 1 : '•'}</span>
              <span className="oo-card-body">
                <MathText text={steps[idx].text} />
                {steps[idx].math && <Formula math={steps[idx].math!} />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pc-actions">
        <button
          type="button"
          className="reveal-btn pc-check-btn"
          disabled={!isComplete || reviewed}
          onClick={() => setReviewed(true)}
        >
          <ListOrdered size={14} />
          <span>راجع الترتيب</span>
        </button>
        {(picked.length > 0 || reviewed) && (
          <button type="button" className="pc-retry" onClick={reset}>
            <RotateCcw size={13} /> إعادة الترتيب
          </button>
        )}
      </div>

      {reviewed && (
        <div className={`pc-feedback ${isCorrect ? 'pc-feedback-ok' : 'pc-feedback-info'}`}>
          <span className="pc-feedback-tag">{isCorrect ? 'ترتيب سليم' : 'لنراجع الترتيب'}</span>
          <span>
            {isCorrect
              ? 'هذا هو ترتيب الأولويات: الأقواس، ثم الضرب والقسمة، ثم الجمع والطرح.'
              : 'البطاقات المحدّدة باللون البرتقالي ليست في موضعها. تذكّر: الأقواس أولاً، ثم الضرب والقسمة، ثم الجمع والطرح.'}
          </span>
        </div>
      )}

      {reviewed && isCorrect && conclusion && (
        <div className="oo-conclusion">
          <MathText text={conclusion} />
        </div>
      )}
    </div>
  );
};

export default OrderOfOperationsSorter;
