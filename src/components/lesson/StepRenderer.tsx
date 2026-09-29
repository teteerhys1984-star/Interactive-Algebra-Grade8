import React from 'react';
import { LessonStep } from '../../data/unit1/lesson01';
import { SourceContentBlock } from './SourceContentBlock';
import { ExerciseStepView } from './ExerciseStepView';
import { MathText } from '../math/MathText';

interface StepGroupInfo {
  title: string;
  positionInGroup: number;
  groupSize: number;
  completedInGroup: number;
}

interface StepRendererProps {
  step: LessonStep;
  stepIndex: number;
  totalSteps: number;
  group?: StepGroupInfo;
}

export const StepRenderer: React.FC<StepRendererProps> = ({
  step,
  stepIndex,
  totalSteps,
  group,
}) => {
  const groupPercent = group
    ? Math.round((group.completedInGroup / group.groupSize) * 100)
    : 0;

  return (
    <div className={`step-content-view${group ? ' exercise-mode' : ''}`}>
      {group && (
        <div className="step-group-banner">
          <div className="step-group-banner-top">
            <span className="step-group-name">{group.title}</span>
            <span className="step-group-position">
              {group.positionInGroup} من {group.groupSize} في هذه المجموعة
            </span>
          </div>
          <div className="step-group-track" role="progressbar" aria-valuenow={groupPercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="step-group-fill" style={{ width: `${groupPercent}%` }} />
          </div>
        </div>
      )}

      <div className="step-header">
        <div className="step-badge-row">
          <span className="step-num-badge">
            {group ? 'السؤال' : 'الخطوة'} {stepIndex + 1} من {totalSteps}
          </span>
          <span className="source-page-badge">
            كتاب الطالب: صفحة {step.sourcePages.join('، ')}
          </span>
        </div>
        <h2 className="step-title">
          <MathText text={step.title} />
        </h2>
        {step.subtitle && (
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
            <MathText text={step.subtitle} />
          </p>
        )}
      </div>

      {group ? (
        <ExerciseStepView key={step.id} step={step} stepIndex={stepIndex} />
      ) : (
        <div className="step-blocks-list">
          {step.blocks.map((block) => (
            <SourceContentBlock key={block.id} block={block} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StepRenderer;
