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
  // Group consecutive steps that share a groupId (presentation only).
  const sections: { groupId?: string; groupTitle?: string; indices: number[] }[] = [];
  steps.forEach((step, index) => {
    const last = sections[sections.length - 1];
    if (last && last.groupId === step.groupId) {
      last.indices.push(index);
    } else {
      sections.push({ groupId: step.groupId, groupTitle: step.groupTitle, indices: [index] });
    }
  });

  return (
    <nav className="lesson-outline" aria-label="فهرس خطوات الدرس">
      <ul className="outline-list">
        {sections.map((section, sectionIndex) => {
          const done = section.indices.filter((i) => completedSteps.includes(i)).length;
          const isCurrentSection = section.indices.includes(currentStepIndex);

          return (
            <li key={section.groupId ?? `section-${sectionIndex}`} className="outline-section">
              {section.groupTitle && (
                <div className={`outline-group-heading${isCurrentSection ? ' current' : ''}`}>
                  <span className="outline-group-title">{section.groupTitle}</span>
                  <span className="outline-group-count">
                    {done} / {section.indices.length}
                  </span>
                </div>
              )}
              <ul className="outline-sublist">
                {section.indices.map((index) => {
                  const step = steps[index];
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
              </ul>
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
