import React from 'react';
import { LessonData } from '../../data/unit1/lesson01';
import { LessonOutline } from './LessonOutline';
import { LessonProgress } from './LessonProgress';
import { X } from 'lucide-react';

interface LessonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonData;
  currentStepIndex: number;
  completedSteps: number[];
  onSelectStep: (index: number) => void;
  hasAssessment?: boolean;
  assessmentActive?: boolean;
  onSelectAssessment?: () => void;
}

export const LessonDrawer: React.FC<LessonDrawerProps> = ({
  isOpen,
  onClose,
  lesson,
  currentStepIndex,
  completedSteps,
  onSelectStep,
  hasAssessment = false,
  assessmentActive = false,
  onSelectAssessment,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="mobile-drawer-overlay" onClick={onClose} />
      <div className={`mobile-drawer ${isOpen ? 'open' : 'closed'}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <span className="unit-badge">{lesson.unitTitle}</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{lesson.title}</h3>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="إغلاق الفهرس">
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <LessonOutline
            steps={lesson.steps}
            currentStepIndex={assessmentActive ? -1 : currentStepIndex}
            completedSteps={completedSteps}
            onSelectStep={(idx) => {
              onSelectStep(idx);
              onClose();
            }}
            hasAssessment={hasAssessment}
            assessmentActive={assessmentActive}
            onSelectAssessment={
              onSelectAssessment
                ? () => {
                    onSelectAssessment();
                    onClose();
                  }
                : undefined
            }
          />
        </div>

        <LessonProgress
          currentStep={currentStepIndex}
          totalSteps={lesson.steps.length}
          completedSteps={completedSteps}
        />
      </div>
    </>
  );
};

export default LessonDrawer;
