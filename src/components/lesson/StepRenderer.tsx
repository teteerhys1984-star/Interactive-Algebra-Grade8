import React from 'react';
import { LessonStep } from '../../data/unit1/lesson01';
import { SourceContentBlock } from './SourceContentBlock';
import { MathText } from '../math/MathText';

interface StepRendererProps {
  step: LessonStep;
  stepIndex: number;
  totalSteps: number;
}

export const StepRenderer: React.FC<StepRendererProps> = ({
  step,
  stepIndex,
  totalSteps,
}) => {
  return (
    <div className="step-content-view">
      <div className="step-header">
        <div className="step-badge-row">
          <span className="step-num-badge">
            الخطوة {stepIndex + 1} من {totalSteps}
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

      <div className="step-blocks-list">
        {step.blocks.map((block) => (
          <SourceContentBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
};

export default StepRenderer;
