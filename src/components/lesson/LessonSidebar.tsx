import React from 'react';
import { LessonData } from '../../data/unit1/lesson01';
import { LessonOutline } from './LessonOutline';
import { LessonProgress } from './LessonProgress';

interface LessonSidebarProps {
  lesson: LessonData;
  currentStepIndex: number;
  completedSteps: number[];
  onSelectStep: (index: number) => void;
  hasAssessment?: boolean;
  assessmentActive?: boolean;
  onSelectAssessment?: () => void;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  lesson,
  currentStepIndex,
  completedSteps,
  onSelectStep,
  hasAssessment = false,
  assessmentActive = false,
  onSelectAssessment,
}) => {
  return (
    <aside className="lesson-sidebar">
      <div className="sidebar-header">
        <span className="unit-badge">{lesson.unitTitle}</span>
        <h2>{lesson.title}</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <LessonOutline
          steps={lesson.steps}
          currentStepIndex={assessmentActive ? -1 : currentStepIndex}
          completedSteps={completedSteps}
          onSelectStep={onSelectStep}
          hasAssessment={hasAssessment}
          assessmentActive={assessmentActive}
          onSelectAssessment={onSelectAssessment}
        />
      </div>

      <LessonProgress
        currentStep={currentStepIndex}
        totalSteps={lesson.steps.length}
        completedSteps={completedSteps}
      />
    </aside>
  );
};

export default LessonSidebar;
