import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardCheck } from 'lucide-react';
import { isAnswerProvided, scoreTest } from '../../data/tests/scoring';
import type { AnswerMap, QuestionAnswer, ResolvedTest, TestScore } from '../../data/tests/types';
import { QuestionRenderer } from './QuestionRenderer';
import { TestResults } from './TestResults';

interface TestRunnerProps {
  test: ResolvedTest;
  onReturnToTests: () => void;
  onOpenSolutions: () => void;
}

interface AttemptDraft {
  version: 1;
  currentIndex: number;
  answers: AnswerMap;
}

const storageKey = (testId: string) => `interactive-algebra:test-attempt:${testId}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function restoreAttempt(test: ResolvedTest): AttemptDraft {
  const initial: AttemptDraft = { version: 1, currentIndex: 0, answers: {} };
  if (typeof window === 'undefined') return initial;

  try {
    const raw = window.sessionStorage.getItem(storageKey(test.id));
    if (!raw) return initial;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.answers)) return initial;

    const knownQuestionIds = new Set(test.questions.map((question) => question.id));
    const answers = Object.fromEntries(
      Object.entries(parsed.answers).filter(([id, answer]) => {
        return knownQuestionIds.has(id)
          && (typeof answer === 'string'
            || typeof answer === 'boolean'
            || Array.isArray(answer)
            || isRecord(answer));
      }),
    ) as AnswerMap;
    const currentIndex = typeof parsed.currentIndex === 'number'
      && Number.isInteger(parsed.currentIndex)
      ? Math.max(0, Math.min(parsed.currentIndex, test.questions.length - 1))
      : 0;
    return { version: 1, currentIndex, answers };
  } catch {
    return initial;
  }
}

function saveAttempt(testId: string, draft: AttemptDraft): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(storageKey(testId), JSON.stringify(draft));
  } catch {
    // The test still works if browser storage is unavailable or full.
  }
}

function clearAttempt(testId: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(storageKey(testId));
  } catch {
    // Storage is only an optional recovery aid; it is not required to submit.
  }
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  test,
  onReturnToTests,
  onOpenSolutions,
}) => {
  const restored = useMemo(() => restoreAttempt(test), [test]);
  const [currentIndex, setCurrentIndex] = useState(restored.currentIndex);
  const [answers, setAnswers] = useState<AnswerMap>(restored.answers);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<TestScore | null>(null);
  const questionHeading = useRef<HTMLHeadingElement>(null);

  const questions = test.questions;
  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.reduce(
    (count, question) => count + (isAnswerProvided(question, answers[question.id]) ? 1 : 0),
    0,
  );
  const progress = questions.length > 0
    ? Math.round(((currentIndex + 1) / questions.length) * 100)
    : 0;

  useEffect(() => {
    if (!submitted && questions.length > 0) {
      saveAttempt(test.id, { version: 1, currentIndex, answers });
    }
  }, [answers, currentIndex, questions.length, submitted, test.id]);

  useEffect(() => {
    questionHeading.current?.focus();
  }, [currentIndex]);

  if (questions.length === 0 || !currentQuestion) {
    return (
      <section className="test-empty-state" role="alert" dir="rtl">
        <h1>تعذّر فتح الاختبار</h1>
        <p>لا يحتوي هذا الاختبار على أسئلة قابلة للعرض.</p>
        <button type="button" className="test-button" onClick={onReturnToTests}>العودة إلى الاختبارات</button>
      </section>
    );
  }

  if (submitted && result) {
    return (
      <TestResults
        test={test}
        result={result}
        onRestart={() => {
          clearAttempt(test.id);
          setCurrentIndex(0);
          setAnswers({});
          setResult(null);
          setSubmitted(false);
        }}
        onReturnToTests={onReturnToTests}
        onOpenSolutions={onOpenSolutions}
      />
    );
  }

  const goToQuestion = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, questions.length - 1)));
  };

  const updateAnswer = (answer: QuestionAnswer) => {
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: answer }));
  };

  const handleSubmit = () => {
    // Correctness is evaluated only from this explicit submit action.
    const finalScore = scoreTest(questions, answers);
    clearAttempt(test.id);
    setResult(finalScore);
    setSubmitted(true);
  };

  return (
    <section className="test-runner" aria-label={test.title} dir="rtl">
      <header className="test-runner-header">
        <div className="test-runner-heading-row">
          <div>
            <p className="test-eyebrow">اختبار تقييمي</p>
            <h1>{test.title}</h1>
          </div>
          <span className="test-question-total"><bdi dir="ltr">{questions.length}</bdi> سؤالًا</span>
        </div>
        <p className="test-runner-description">{test.description}</p>
        <div className="test-progress-copy">
          <span>السؤال <bdi dir="ltr">{currentIndex + 1}</bdi> من <bdi dir="ltr">{questions.length}</bdi></span>
          <span>إجابات محفوظة: <bdi dir="ltr">{answeredCount.toLocaleString('ar')}</bdi></span>
        </div>
        <div
          className="test-progress-track"
          role="progressbar"
          aria-label="التقدم في الاختبار"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-valuetext={`السؤال ${currentIndex + 1} من ${questions.length}`}
        >
          <div className="test-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <article className="test-question-card">
        <div className="test-question-card-meta">
          <span className="test-question-number">السؤال {currentIndex + 1}</span>
          <span className="test-question-difficulty">{difficultyLabel(currentQuestion.difficulty)}</span>
        </div>
        <h2 ref={questionHeading} className="test-sr-only" tabIndex={-1}>
          السؤال <bdi dir="ltr">{currentIndex + 1} / {questions.length}</bdi>
        </h2>
        <QuestionRenderer
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          answer={answers[currentQuestion.id]}
          onChange={updateAnswer}
        />
      </article>

      <div className="test-runner-navigation" aria-label="التنقل بين الأسئلة">
        <button
          type="button"
          className="test-button"
          onClick={() => goToQuestion(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <ChevronRight size={18} aria-hidden="true" />
          <span>السابق</span>
        </button>
        <div className="test-runner-step-actions">
          {currentIndex < questions.length - 1 && (
            <button
              type="button"
              className="test-button test-button-primary"
              onClick={() => goToQuestion(currentIndex + 1)}
            >
              <span>التالي</span>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
          )}
          <button type="button" className="test-button test-button-submit" onClick={handleSubmit}>
            <ClipboardCheck size={18} aria-hidden="true" />
            <span>تسليم الاختبار</span>
          </button>
        </div>
      </div>

      <details className="test-question-map">
        <summary>قائمة الأسئلة والتنقل المباشر</summary>
        <p className="test-question-map-help">حالة «تمت الإجابة» تعني وجود اختيار محفوظ فقط، ولا تعرض صحة الإجابة.</p>
        <div className="test-question-map-grid">
          {questions.map((question, index) => {
            const answered = isAnswerProvided(question, answers[question.id]);
            return (
              <button
                key={question.id}
                type="button"
                className={`test-question-map-button${index === currentIndex ? ' is-current' : ''}${answered ? ' has-answer' : ''}`}
                aria-label={`انتقل إلى السؤال ${index + 1}${answered ? '، تمت الإجابة' : '، غير مجاب'}`}
                aria-current={index === currentIndex ? 'step' : undefined}
                onClick={() => goToQuestion(index)}
              >
                <span dir="ltr">{index + 1}</span>
                <span className="test-question-map-status">{answered ? 'أجبت' : 'فارغ'}</span>
              </button>
            );
          })}
        </div>
      </details>
    </section>
  );
};

function difficultyLabel(difficulty: ResolvedTest['questions'][number]['difficulty']): string {
  switch (difficulty) {
    case 'basic': return 'أساسي';
    case 'intermediate': return 'متوسط';
    case 'advanced': return 'متقدم';
    case 'reasoning': return 'تفكير';
  }
}
