import React from 'react';
import { Award, RotateCcw, ArrowRight } from 'lucide-react';

interface CompletionStateProps {
  lessonTitle: string;
  onRestart: () => void;
  onBackToUnit: () => void;
}

export const CompletionState: React.FC<CompletionStateProps> = ({
  lessonTitle,
  onRestart,
  onBackToUnit,
}) => {
  return (
    <div className="completion-container">
      <div className="completion-icon-wrapper">
        <Award size={48} />
      </div>
      <h2 className="completion-title">مبارك! أتممت بنجاح: {lessonTitle}</h2>
      <p className="completion-desc">
        لقد أتممت دراسة جميع خطوات الدرس وتعرفت على القواعد والأمثلة والتمارين المحلولة مع التحقق وتدرب وفق المنهاج المدرسي السوري.
      </p>

      <div className="completion-actions">
        <button
          className="nav-action-btn next-btn"
          onClick={onBackToUnit}
        >
          <span>العودة إلى قائمة الوحدة</span>
          <ArrowRight size={18} />
        </button>

        <button
          className="nav-action-btn prev-btn"
          onClick={onRestart}
        >
          <RotateCcw size={18} />
          <span>إعادة مراجعة الدرس من البداية</span>
        </button>
      </div>
    </div>
  );
};

export default CompletionState;
