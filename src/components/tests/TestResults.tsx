import React from 'react';
import { BookOpenCheck, RotateCcw, ArrowRight } from 'lucide-react';
import type { ResolvedTest, TestScore } from '../../data/tests/types';

interface TestResultsProps {
  test: ResolvedTest;
  result: TestScore;
  onRestart: () => void;
  onReturnToTests: () => void;
  onOpenSolutions: () => void;
}

export const TestResults: React.FC<TestResultsProps> = ({
  test,
  result,
  onRestart,
  onReturnToTests,
  onOpenSolutions,
}) => (
  <section className="test-results" aria-live="polite" aria-labelledby="test-results-title" dir="rtl">
    <div className="test-results-hero">
      <div className="test-results-icon" aria-hidden="true"><BookOpenCheck size={30} /></div>
      <p className="test-eyebrow">انتهى الاختبار</p>
      <h1 id="test-results-title">أحسنت على إكمال الاختبار</h1>
      <h2>{test.title}</h2>
      <div className="test-score-line" dir="ltr" aria-label={`${result.earnedPoints} من ${result.totalPoints}`}>
        <span>{result.earnedPoints}</span>
        <span aria-hidden="true">/</span>
        <span>{result.totalPoints}</span>
      </div>
      <p className="test-percentage">النسبة: <bdi dir="ltr">{result.percentage}٪</bdi></p>
    </div>

    <div className="test-result-counts" aria-label="ملخص النتيجة">
      <div className="test-count-card">
        <span className="test-count-value" dir="ltr">{result.correctCount}</span>
        <span>إجابات صحيحة</span>
      </div>
      <div className="test-count-card">
        <span className="test-count-value" dir="ltr">{result.incorrectCount}</span>
        <span>إجابات خاطئة</span>
      </div>
      <div className="test-count-card">
        <span className="test-count-value" dir="ltr">{result.unansweredCount}</span>
        <span>أسئلة غير مجابة</span>
      </div>
    </div>

    <p className="test-results-note">
      تظهر خطوات الحل في قسم حلول الاختبارات، وليس في شاشة النتيجة.
    </p>

    <div className="test-results-actions">
      <button type="button" className="test-button test-button-primary" onClick={onRestart}>
        <RotateCcw size={17} aria-hidden="true" />
        <span>إعادة الاختبار</span>
      </button>
      <button type="button" className="test-button" onClick={onOpenSolutions}>
        <BookOpenCheck size={17} aria-hidden="true" />
        <span>حلول هذا الاختبار</span>
      </button>
      <button type="button" className="test-button" onClick={onReturnToTests}>
        <ArrowRight size={17} aria-hidden="true" />
        <span>العودة إلى الاختبارات</span>
      </button>
    </div>
  </section>
);
