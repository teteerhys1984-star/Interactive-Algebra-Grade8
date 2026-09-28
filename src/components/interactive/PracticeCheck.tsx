import React, { useState } from 'react';
import { Math } from '../math/Math';
import { MathText } from '../math/MathText';
import { Check } from 'lucide-react';

export interface PracticeCheckQuestion {
  prompt: string; // MathText (Arabic + $...$)
  choices: string[]; // LaTeX
  correctIndex: number;
  explain: string; // MathText
}

interface PracticeCheckProps {
  questions: PracticeCheckQuestion[];
}

const SingleQuestion: React.FC<{ q: PracticeCheckQuestion; index: number }> = ({ q, index }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = checked && selected === q.correctIndex;

  return (
    <div className="pc-question">
      <div className="pc-prompt">
        <span className="step-badge-mini">{index + 1}</span>
        <MathText text={q.prompt} />
      </div>

      <div className="pc-choices">
        {q.choices.map((c, i) => {
          const isSel = selected === i;
          let cls = 'pc-choice';
          if (checked) {
            if (i === q.correctIndex) cls += ' pc-correct';
            else if (isSel) cls += ' pc-wrong';
          } else if (isSel) {
            cls += ' pc-selected';
          }
          return (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => {
                if (checked) return;
                setSelected(i);
              }}
            >
              <Math math={c} />
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
            }}
          >
            حاول مجددًا
          </button>
        )}
      </div>

      {checked && (
        <div className={`pc-feedback ${isCorrect ? 'pc-feedback-ok' : 'pc-feedback-info'}`}>
          <span className="pc-feedback-tag">{isCorrect ? 'أحسنت' : 'لنراجع'}</span>
          <MathText text={q.explain} />
        </div>
      )}
    </div>
  );
};

export const PracticeCheck: React.FC<PracticeCheckProps> = ({ questions }) => {
  return (
    <div className="interactive-card pc-container">
      {questions.map((q, i) => (
        <SingleQuestion key={i} q={q} index={i} />
      ))}
    </div>
  );
};

export default PracticeCheck;
