import React from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface StepNavigatorProps {
  currentStepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  isLastStep: boolean;
}

export const StepNavigator: React.FC<StepNavigatorProps> = ({
  currentStepIndex,
  totalSteps,
  onPrev,
  onNext,
  onComplete,
  isLastStep,
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

      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
        {currentStepIndex + 1} / {totalSteps}
      </span>

      {isLastStep ? (
        <button
          className="nav-action-btn complete-btn"
          onClick={onComplete}
          aria-label="إتمام الدرس"
        >
          <CheckCircle2 size={18} />
          <span>إتمام الدرس</span>
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
