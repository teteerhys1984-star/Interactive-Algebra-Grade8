import { useState } from 'react';
import { Link2, RotateCcw, Check, X } from 'lucide-react';
import { MathText } from '../math/MathText';

/**
 * مختبر «اربط كل مساويتين متكافئتين» (الوحدة الرابعة، ص70 — تحقّق من فهمك ①).
 *
 * الطالب يختار مساواة من العمود الأيمن ثم نظيرتها من العمود الأيسر. التصحيح
 * فوري، ويبقى الربط ظاهرًا بعد الاختيار مع إمكانية المحاولة من جديد.
 * الربط معتمد على أزواج صريحة من بيانات الدرس، لا على مقارنة نصوص.
 */

export interface EquationPair {
  id: string;
  left: string;
  right: string;
  /** Why those two statements are equivalent — shown once the pair is matched. */
  reason: string;
}

interface EquationMatchLabProps {
  pairs: EquationPair[];
  /** Shuffle the right column so its order never leaks the answer. */
  rightOrder?: string[];
}

export function EquationMatchLab({ pairs, rightOrder }: EquationMatchLabProps) {
  const orderedPairs = rightOrder
    ? rightOrder.map((id) => pairs.find((pair) => pair.id === id)!).filter(Boolean)
    : [...pairs].reverse();

  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrong, setWrong] = useState<{ left: string; right: string } | null>(null);
  const [checked, setChecked] = useState(false);

  const solvedCount = Object.keys(matches).length;
  const complete = solvedCount === pairs.length;

  const pickLeft = (id: string) => {
    if (checked) return;
    setActiveLeft(id);
    setWrong(null);
  };

  const pickRight = (id: string) => {
    if (checked || !activeLeft) return;
    if (activeLeft === id) {
      setMatches((previous) => ({ ...previous, [activeLeft]: id }));
      setActiveLeft(null);
      setWrong(null);
      return;
    }
    setWrong({ left: activeLeft, right: id });
    setActiveLeft(null);
  };

  const reset = () => {
    setMatches({});
    setActiveLeft(null);
    setWrong(null);
    setChecked(false);
  };

  return (
    <div className="interactive-card u4-match-lab" dir="rtl">
      <div className="u4-match-head">
        <span className="u4-match-title">
          <Link2 size={18} aria-hidden="true" /> اربط كل مساويتين متكافئتين
        </span>
        <span className="u4-match-progress" role="status">
          {solvedCount} من {pairs.length}
        </span>
      </div>

      <div className="u4-match-grid">
        <div className="u4-match-column">
          {pairs.map((pair) => {
            const state = matches[pair.id] ? 'is-matched' : activeLeft === pair.id ? 'is-active' : '';
            return (
              <button
                key={`left-${pair.id}`}
                type="button"
                className={`u4-match-cell ${state}`}
                onClick={() => pickLeft(pair.id)}
              >
                <MathText text={`$${pair.left}$`} />
                {matches[pair.id] && <Check size={14} aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <div className="u4-match-column">
          {orderedPairs.map((pair) => {
            const taken = Object.values(matches).includes(pair.id);
            const isWrong = wrong?.right === pair.id;
            return (
              <button
                key={`right-${pair.id}`}
                type="button"
                className={`u4-match-cell${taken ? ' is-matched' : ''}${isWrong ? ' is-wrong' : ''}`}
                onClick={() => pickRight(pair.id)}
                disabled={taken}
              >
                <MathText text={`$${pair.right}$`} />
                {taken && <Check size={14} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      {wrong && (
        <p className="u4-match-message is-bad" role="status">
          <X size={15} aria-hidden="true" /> هاتان المساويتان غير متكافئتين: إحداهما لا تنتج من الأخرى بالعملية
          المطبوعة نفسها. جرّب أخرى.
        </p>
      )}

      <div className="u4-match-footer">
        <button
          type="button"
          className="reveal-btn"
          onClick={() => setChecked(true)}
          disabled={!complete || checked}
        >
          <Check size={15} aria-hidden="true" /> تحقّق من الربط
        </button>
        <button type="button" className="reveal-btn" onClick={reset}>
          <RotateCcw size={15} aria-hidden="true" /> إعادة
        </button>
      </div>

      {checked && complete && (
        <div className="solution-panel">
          <p className="u4-match-verdict">
            <Check size={16} aria-hidden="true" /> كل الأزواج صحيحة. لاحظ أنّ كل مساواة في العمود الأيسر نتجت
            عن المساواة المقابلة بعملية واحدة أُجريت على الطرفين.
          </p>
          <ul className="u4-match-reasons">
            {pairs.map((pair) => (
              <li key={`reason-${pair.id}`}>
                <MathText text={`$${pair.left}$ ↔ $${pair.right}$ — ${pair.reason}`} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EquationMatchLab;
