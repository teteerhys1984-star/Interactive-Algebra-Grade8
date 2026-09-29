import React from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface StepNavigatorProps {
  currentStepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  isLastStep: boolean;
  completeLabel?: string;
  /** When the next step opens a new group, show its title as a hint. */
  nextGroupTitle?: string;
}

export const StepNavigator: React.FC<StepNavigatorProps> = ({
  currentStepIndex,
  totalSteps,
  onPrev,
  onNext,
  onComplete,
  isLastStep,
  completeLabel = 'إتمام الدرس',
  nextGroupTitle,
}) => {
  return (
    <footer className="step-navigator">
      <button
        className="nav-action-btn prev-btn"
        onClick={onPrev}
        disabled={currentStepIndex === 0}
        aria-label="الخطوة السابقة"
      >
        <ChevronRight size={18} />
        <span>الخطوة السابقة</span>
      </button>

      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>
        {currentStepIndex + 1} / {totalSteps}
        {nextGroupTitle && (
          <span className="next-group-hint">التالي: {nextGroupTitle}</span>
        )}
      </span>

      {isLastStep ? (
        <button
          className="nav-action-btn complete-btn"
          onClick={onComplete}
          aria-label={completeLabel}
        >
          <CheckCircle2 size={18} />
          <span>{completeLabel}</span>
        </button>
      ) : (
        <button
          className="nav-action-btn next-btn"
          onClick={onNext}
          aria-label="الخطوة التالية"
        >
          <span>الخطوة التالية</span>
          <ChevronLeft size={18} />
        </button>
      )}
    </footer>
  );
};

export default StepNavigator;
