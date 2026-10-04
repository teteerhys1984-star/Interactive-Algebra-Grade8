import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ResolvedTest, TestQuestion } from '../../data/tests/types';
import { Math } from '../math/Math';
import { MathText } from '../math/MathText';
import { TestAreaNav } from './TestAreaNav';

const QUESTIONS_PER_PAGE = 5;

interface TestSolutionsProps {
  test: ResolvedTest;
  onReturnToSolutions: () => void;
  onReturnToTests: () => void;
}

function questionTypeLabel(question: TestQuestion): string {
  switch (question.type) {
    case 'single-choice': return 'اختيار من متعدد';
    case 'true-false': return 'صح أو خطأ';
    case 'multi-select': return 'اختيارات متعددة';
    case 'numeric': return 'إجابة عددية';
    case 'ordering': return 'ترتيب خطوات';
    case 'matching': return 'مطابقة';
    case 'error-analysis': return 'تحليل خطأ';
  }
}

export const TestSolutions: React.FC<TestSolutionsProps> = ({
  test,
  onReturnToSolutions,
  onReturnToTests,
}) => {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(test.questions.length / QUESTIONS_PER_PAGE);
  const firstIndex = page * QUESTIONS_PER_PAGE;
  const visibleQuestions = test.questions.slice(firstIndex, firstIndex + QUESTIONS_PER_PAGE);
  const rangeStart = test.questions.length === 0 ? 0 : firstIndex + 1;
  const rangeEnd = Math.min(firstIndex + QUESTIONS_PER_PAGE, test.questions.length);

  return (
    <main className="test-solutions" dir="rtl">
      <header className="test-solutions-header">
        <p className="test-eyebrow">مرجع تعلّم للطالب • {test.questionCount} سؤالًا</p>
        <h1>حلول الاختبارات</h1>
        <h2>{test.title}</h2>
        <p>هذه الحلول متاحة بصورة مستقلة عن محاولة الاختبار. اقرأ خطوات كل سؤال ثم راجع الإجابة النهائية والمبدأ المستخدم.</p>
      </header>

      <TestAreaNav active="solutions" />

      <nav className="test-solution-group-nav" aria-label="التنقل بين صفحات الحلول">
        <button
          type="button"
          className="test-button"
          onClick={() => setPage((current) => Math.max(0, current - 1))}
          disabled={page === 0}
        >
          <ChevronRight size={17} aria-hidden="true" />
          <span>الأسئلة السابقة</span>
        </button>
        <span className="test-solution-group-label" aria-live="polite">
          الأسئلة <bdi dir="ltr">{rangeStart}–{rangeEnd}</bdi> من <bdi dir="ltr">{test.questionCount}</bdi>
        </span>
        <button
          type="button"
          className="test-button"
          onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
          disabled={page >= pageCount - 1}
        >
          <span>الأسئلة التالية</span>
          <ChevronLeft size={17} aria-hidden="true" />
        </button>
      </nav>

      <section className="test-solution-list" aria-label="الحلول خطوة بخطوة">
        {visibleQuestions.map((question, localIndex) => {
          const questionNumber = firstIndex + localIndex + 1;
          return (
            <article className="test-solution-card" key={question.id}>
              <h3>
                السؤال <bdi dir="ltr">{questionNumber}</bdi>
                <span aria-hidden="true"> • </span>
                {questionTypeLabel(question)}
              </h3>
              <div className="test-solution-prompt"><MathText text={question.prompt} /></div>
              {question.math && !question.prompt.includes('$') && (
                <Math math={question.math} display />
              )}
              <ol className="test-solution-steps">
                {question.solution.steps.map((step, index) => (
                  <li key={`${question.id}-step-${index}`}><MathText text={step} /></li>
                ))}
              </ol>
              <p className="test-solution-rationale"><MathText text={question.solution.explanation} /></p>
              <div className="test-solution-answer">
                <span className="test-solution-answer-label">الإجابة النهائية</span>
                <MathText text={question.solution.finalAnswer} />
              </div>
            </article>
          );
        })}
      </section>

      <nav className="test-solution-group-nav" aria-label="التنقل بعد مراجعة الحلول">
        <button type="button" className="test-button" onClick={onReturnToSolutions}>
          <ArrowRight size={17} aria-hidden="true" />
          <span>اختيار اختبار آخر للحلول</span>
        </button>
        <button type="button" className="test-button test-button-primary" onClick={onReturnToTests}>
          <span>العودة إلى الاختبارات</span>
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </nav>
    </main>
  );
};
