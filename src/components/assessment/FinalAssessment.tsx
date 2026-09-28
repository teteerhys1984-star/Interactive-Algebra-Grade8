import React, { useMemo, useState } from 'react';
import { FinalAssessment as FinalAssessmentData, AssessmentQuestion } from '../../data/assessment';
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';
import {
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Award,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface FinalAssessmentProps {
  assessment: FinalAssessmentData;
  onExit: () => void;
  onGoToStep: (stepIndex: number) => void;
}

/** Normalizes a free-text math answer for tolerant comparison. */
export function normalizeAnswer(input: string): string {
  return (input || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\u2212\u2013\u2014]/g, '-') // unicode minus / dashes -> hyphen
    .replace(/[×x\u00d7*]/g, '') // drop explicit multiplication between number and variable
    .replace(/[()]/g, '')
    .replace(/\u066b|\u060c/g, (m) => (m === '\u066b' ? '.' : ',')); // arabic decimal sep
}

function isCorrect(q: AssessmentQuestion, answer: string | undefined): boolean {
  if (answer === undefined || answer === '') return false;
  if (q.acceptedAnswers && q.acceptedAnswers.length > 0) {
    const norm = normalizeAnswer(answer);
    return q.acceptedAnswers.some((a) => normalizeAnswer(a) === norm);
  }
  return answer === q.correctId;
}

export const FinalAssessment: React.FC<FinalAssessmentProps> = ({
  assessment,
  onExit,
  onGoToStep,
}) => {
  const { questions } = assessment;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const q = questions[current];
  const answeredCount = questions.filter((qq) => answers[qq.id] !== undefined && answers[qq.id] !== '').length;

  const results = useMemo(() => {
    const perQuestion = questions.map((qq) => ({
      q: qq,
      answer: answers[qq.id],
      correct: isCorrect(qq, answers[qq.id]),
    }));
    const score = perQuestion.filter((r) => r.correct).length;
    const percent = Math.round((score / questions.length) * 100);
    const weakConcepts = Array.from(
      new Set(perQuestion.filter((r) => !r.correct).map((r) => r.q.concept))
    );
    return { perQuestion, score, percent, weakConcepts };
  }, [questions, answers, submitted]);

  const setAnswer = (val: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  };

  const goNext = () => {
    setShowHint(false);
    if (current < questions.length - 1) setCurrent((c) => c + 1);
  };
  const goPrev = () => {
    setShowHint(false);
    if (current > 0) setCurrent((c) => c - 1);
  };

  /* ----------------------------- Results view ---------------------------- */
  if (submitted) {
    const passed = results.percent >= assessment.passThreshold;
    return (
      <div className="assessment-results">
        <div className={`ar-hero ${passed ? 'ar-pass' : 'ar-review'}`}>
          <div className="ar-hero-icon">
            <Award size={40} />
          </div>
          <h2>{passed ? 'أداء ممتاز!' : 'أنجزت الاختبار — لنراجع معًا'}</h2>
          <div className="ar-score" dir="ltr">
            {results.score} / {questions.length}
          </div>
          <div className="ar-percent">النتيجة: {results.percent}٪ (حدّ النجاح {assessment.passThreshold}٪)</div>
        </div>

        <div className="ar-summary">
          <h3>ملخّص الأداء</h3>
          {results.weakConcepts.length === 0 ? (
            <p className="ar-all-good">أتقنتَ جميع مفاهيم الدرس. عمل رائع!</p>
          ) : (
            <>
              <p>مفاهيم يُنصح بمراجعتها:</p>
              <div className="ar-concepts">
                {results.weakConcepts.map((c) => (
                  <span key={c} className="ar-concept-chip">
                    {c}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="ar-review">
          <h3>مراجعة الأسئلة</h3>
          {results.perQuestion.map((r, i) => (
            <div key={r.q.id} className={`ar-review-item ${r.correct ? 'ar-ri-ok' : 'ar-ri-bad'}`}>
              <div className="ar-ri-head">
                <span className="ar-ri-num">{i + 1}</span>
                {r.correct ? (
                  <CheckCircle2 size={18} className="ar-ri-ic-ok" />
                ) : (
                  <XCircle size={18} className="ar-ri-ic-bad" />
                )}
                <span className="ar-ri-concept">{r.q.concept}</span>
              </div>
              <div className="ar-ri-prompt">
                <MathText text={r.q.prompt} />
              </div>
              {r.q.math && <Formula display math={r.q.math} />}
              <div className="ar-ri-answers">
                <div className="ar-ri-yours">
                  إجابتك:{' '}
                  {r.answer ? (
                    r.q.choices ? (
                      <Formula math={r.q.choices.find((c) => c.id === r.answer)?.text ?? r.answer} />
                    ) : (
                      <span dir="ltr">{r.answer}</span>
                    )
                  ) : (
                    <em>لم تُجب</em>
                  )}
                </div>
                {r.q.answerDisplay && (
                  <div className="ar-ri-correct">
                    الصواب: <Formula math={r.q.answerDisplay} />
                  </div>
                )}
              </div>
              <div className="ar-ri-explain">
                <MathText text={r.q.explanation} />
              </div>
              <button className="ar-ri-link" onClick={() => onGoToStep(r.q.relatedStepIndex)}>
                <BookOpen size={14} />
                <span>مراجعة الشرح في الدرس</span>
              </button>
            </div>
          ))}
        </div>

        <div className="ar-actions">
          <button
            className="nav-action-btn next-btn"
            onClick={() => {
              setSubmitted(false);
              setCurrent(0);
              setAnswers({});
            }}
          >
            <RotateCcw size={16} />
            <span>إعادة الاختبار</span>
          </button>
          <button className="nav-action-btn prev-btn" onClick={onExit}>
            <span>إنهاء ومتابعة</span>
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------ Quiz view ------------------------------ */
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="assessment-quiz">
      <div className="aq-header">
        <div className="aq-title">
          <ClipboardCheck size={22} />
          <h2>{assessment.title}</h2>
        </div>
        <p className="aq-desc">{assessment.description}</p>
        <div className="aq-progress-row">
          <span>
            السؤال {current + 1} من {questions.length}
          </span>
          <span>تمّت الإجابة عن {answeredCount}</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="aq-card">
        <div className="aq-concept-tag">{q.concept}</div>
        <div className="aq-prompt">
          <MathText text={q.prompt} />
        </div>
        {q.math && <Formula display math={q.math} />}

        {q.choices ? (
          <div className="aq-choices">
            {q.choices.map((c) => {
              const isSel = answers[q.id] === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`aq-choice ${isSel ? 'aq-choice-sel' : ''}`}
                  onClick={() => setAnswer(c.id)}
                >
                  <span className="aq-choice-radio" aria-hidden />
                  <Formula math={c.text} />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="aq-numeric">
            <label htmlFor={`ans-${q.id}`}>اكتب إجابتك:</label>
            <input
              id={`ans-${q.id}`}
              type="text"
              dir="ltr"
              inputMode="text"
              autoComplete="off"
              value={answers[q.id] ?? ''}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="مثال: -3/5"
            />
          </div>
        )}

        {q.hint && (
          <div className="aq-hint-row">
            <button type="button" className="aq-hint-btn" onClick={() => setShowHint((s) => !s)}>
              {showHint ? 'إخفاء التلميح' : 'تلميح'}
            </button>
            {showHint && (
              <div className="aq-hint">
                <MathText text={q.hint} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="aq-nav">
        <button className="nav-action-btn prev-btn" onClick={goPrev} disabled={current === 0}>
          <ChevronRight size={16} />
          <span>السابق</span>
        </button>

        {current === questions.length - 1 ? (
          <button className="nav-action-btn complete-btn" onClick={() => setSubmitted(true)}>
            <ClipboardCheck size={16} />
            <span>إنهاء الاختبار وعرض النتيجة</span>
          </button>
        ) : (
          <button className="nav-action-btn next-btn" onClick={goNext}>
            <span>التالي</span>
            <ChevronLeft size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FinalAssessment;
