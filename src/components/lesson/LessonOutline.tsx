import React from 'react';
import { LessonStep } from '../../data/unit1/lesson01';
import { MathText } from '../math/MathText';
import { Check, ClipboardCheck } from 'lucide-react';

interface LessonOutlineProps {
  steps: LessonStep[];
  currentStepIndex: number;
  completedSteps: number[];
  onSelectStep: (index: number) => void;
  hasAssessment?: boolean;
  assessmentActive?: boolean;
  onSelectAssessment?: () => void;
}

export const LessonOutline: React.FC<LessonOutlineProps> = ({
  steps,
  currentStepIndex,
  completedSteps,
  onSelectStep,
  hasAssessment = false,
  assessmentActive = false,
  onSelectAssessment,
}) => {
  return (
    <nav className="lesson-outline" aria-label="فهرس خطوات الدرس">
      <ul className="outline-list">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = completedSteps.includes(index);

          let btnClass = 'outline-item-btn';
          if (isActive) btnClass += ' active';
          if (isCompleted) btnClass += ' completed';

          let indicatorClass = 'step-indicator';
          if (isActive) {
            indicatorClass += ' active';
          } else if (isCompleted) {
            indicatorClass += ' completed';
          } else {
            indicatorClass += ' upcoming';
          }

          return (
            <li key={step.id}>
              <button
                className={btnClass}
                onClick={() => onSelectStep(index)}
                aria-current={isActive ? 'step' : undefined}
              >
                <div className={indicatorClass}>
                  {isCompleted ? <Check size={14} /> : index + 1}
                </div>
                <div className="outline-info">
                  <div className="outline-step-title">
                    <MathText text={step.title} />
                  </div>
                  <div className="outline-step-meta">
                    <span>صفحة {step.sourcePages.join('، ')}</span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}

        {hasAssessment && onSelectAssessment && (
          <li>
            <button
              className={`outline-item-btn assessment-outline-btn ${assessmentActive ? 'active' : ''}`}
              onClick={onSelectAssessment}
              aria-current={assessmentActive ? 'step' : undefined}
            >
              <div className={`step-indicator ${assessmentActive ? 'active' : 'upcoming'}`}>
                <ClipboardCheck size={14} />
              </div>
              <div className="outline-info">
                <div className="outline-step-title">الاختبار الشامل</div>
                <div className="outline-step-meta">
                  <span>تقويم نهائي</span>
                </div>
              </div>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default LessonOutline;
