import React from 'react';

interface LessonProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

export const LessonProgress: React.FC<LessonProgressProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
}) => {
  const percentage = Math.round((completedSteps.length / totalSteps) * 100);

  return (
    <div className="sidebar-progress">
      <div className="progress-label">
        <span>نسبة الإنجاز</span>
        <span>{percentage}%</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>الخطوة الحالية: {currentStep + 1}</span>
        <span>مكتمل: {completedSteps.length} من {totalSteps}</span>
      </div>
    </div>
  );
};

export default LessonProgress;
