import React, { useState } from 'react';
import { MathText } from '../math/MathText';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export interface MCQOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface MultipleChoiceQuestionProps {
  options: MCQOption[];
  onAnswer?: (isCorrect: boolean) => void;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  options,
  onAnswer,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setSubmitted(true);
    const selected = options.find((o) => o.id === id);
    if (selected && onAnswer) {
      onAnswer(selected.isCorrect);
    }
  };

  const selectedOption = options.find((o) => o.id === selectedId);

  return (
    <div className="mcq-container">
      <div className="options-grid">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          let btnClass = 'mcq-option-btn';
          if (submitted) {
            if (option.isCorrect) {
              btnClass += ' correct';
            } else if (isSelected) {
              btnClass += ' incorrect';
            }
          } else if (isSelected) {
            btnClass += ' selected';
          }

          return (
            <button
              key={option.id}
              className={btnClass}
              onClick={() => handleSelect(option.id)}
            >
              <span className="option-letter-badge">{option.label}</span>
              <MathText text={`$${option.text}$`} />
              {submitted && option.isCorrect && (
                <CheckCircle2 size={18} className="icon-correct" style={{ marginRight: 'auto', color: 'var(--color-emerald-600)' }} />
              )}
              {submitted && isSelected && !option.isCorrect && (
                <XCircle size={18} className="icon-incorrect" style={{ marginRight: 'auto', color: 'var(--color-rose-600)' }} />
              )}
            </button>
          );
        })}
      </div>

      {submitted && selectedOption && (
        <div className={`feedback-box ${selectedOption.isCorrect ? 'success' : 'error'}`}>
          <HelpCircle size={20} />
          <div>
            <strong>{selectedOption.isCorrect ? 'إجابة صحيحة! ' : 'إجابة غير دقيقة! '}</strong>
            <MathText text={selectedOption.explanation} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;
