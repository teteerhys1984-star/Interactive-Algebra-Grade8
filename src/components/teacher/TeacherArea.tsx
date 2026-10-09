import React, { useState } from 'react';
import { curriculum } from '../../data/curriculum';
import { LessonData } from '../../data/unit1/lesson01';
import { TeacherArea as TeacherAreaData } from '../../data/assessment';
import { Math } from '../math/Math';
import { MathText } from '../math/MathText';
import {
  Lock,
  ShieldAlert,
  Target,
  AlertTriangle,
  LifeBuoy,
  NotebookPen,
  ClipboardList,
  KeyRound,
  ArrowRight,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const TEACHER_PASSWORD = 'somer173';
const SESSION_KEY = 'teacher-access-granted';

interface TeacherAreaProps {
  onNavigateHome: () => void;
}

const lessonsWithTeacherArea = (): LessonData[] =>
  curriculum.flatMap((u) => u.lessons).filter((l) => !!l.teacherArea);

const TeacherContent: React.FC<{ lesson: LessonData; data: TeacherAreaData }> = ({ lesson, data }) => (
  <div className="ta-content">
    <div className="ta-lesson-head">
      <span className="step-num-badge">الدرس {lesson.number}</span>
      <h2>{lesson.title}</h2>
      <span className="source-page-badge">الصفحات {lesson.sourcePages.join('، ')}</span>
    </div>

    <section className="ta-section">
      <h3><Target size={18} /> أهداف الدرس</h3>
      <ul className="ta-list">
        {data.objectives.map((o, i) => (
          <li key={i}><MathText text={o} /></li>
        ))}
      </ul>
    </section>

    <section className="ta-section">
      <h3><AlertTriangle size={18} /> الأخطاء الشائعة وتصويبها</h3>
      <div className="ta-mistakes">
        {data.commonMistakes.map((m, i) => (
          <div key={i} className="ta-mistake">
            <div className="ta-mistake-bad"><span>الخطأ:</span> <MathText text={m.mistake} /></div>
            <div className="ta-mistake-fix"><span>الصواب:</span> <MathText text={m.correction} /></div>
          </div>
        ))}
      </div>
    </section>

    <section className="ta-section">
      <h3><LifeBuoy size={18} /> اقتراحات المعالجة</h3>
      <ul className="ta-list">
        {data.remediation.map((r, i) => (
          <li key={i}><MathText text={r} /></li>
        ))}
      </ul>
    </section>

    <section className="ta-section">
      <h3><NotebookPen size={18} /> ملاحظات تدريسية</h3>
      <ul className="ta-list">
        {data.teachingNotes.map((n, i) => (
          <li key={i}><MathText text={n} /></li>
        ))}
      </ul>
    </section>

    <section className="ta-section">
      <h3><ClipboardList size={18} /> إرشادات التقويم</h3>
      <ul className="ta-list">
        {data.assessmentGuidance.map((g, i) => (
          <li key={i}><MathText text={g} /></li>
        ))}
      </ul>
    </section>

    <section className="ta-section">
      <h3><KeyRound size={18} /> مفاتيح الإجابة (الكتاب + الاختبار)</h3>
      <div className="ta-keys">
        {data.answerKeys.map((group, gi) => (
          <div key={gi} className="ta-key-group">
            <div className="ta-key-head">
              <span className="ta-key-title">{group.section}</span>
              <span className="source-page-badge">{group.source}</span>
            </div>
            <div className="ta-key-items">
              {group.items.map((it, ii) => (
                <div key={ii} className="ta-key-item">
                  <span className="ta-key-ref">{it.ref}</span>
                  <span className="ta-key-answer"><Math math={it.answer} /></span>
                  {it.note && <span className="ta-key-note">{it.note}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    {data.solutions && data.solutions.length > 0 && (
      <section className="ta-section ta-solutions">
        <h3><NotebookPen size={18} /> الحلول التفصيلية خطوة بخطوة ({data.solutions.length} بنداً)</h3>
        {Array.from(
          data.solutions.reduce((map, sol) => {
            map.set(sol.group, [...(map.get(sol.group) ?? []), sol]);
            return map;
          }, new Map<string, typeof data.solutions>()),
        ).map(([group, items]) => (
          <div key={group} className="ta-solution-group">
            <h4 className="ta-solution-group-title">{group}</h4>
            {items.map((sol) => (
              <details key={sol.id} className="ta-solution">
                <summary>
                  <span className="source-page-badge"><MathText text={sol.source} /></span>{' '}
                  <MathText text={sol.problem} />
                </summary>
                <div className="ta-solution-body">
                  <div className="ta-solution-row"><span>الخطوات:</span>
                    <ol>{sol.steps.map((st, i) => <li key={i}><MathText text={st} /></li>)}</ol>
                  </div>
                  <div className="ta-solution-row"><span>الجواب النهائي:</span> <MathText text={sol.finalAnswer} />
                    {sol.answerOrigin && <em className="ta-solution-origin"> ({sol.answerOrigin})</em>}
                  </div>
                  <div className="ta-solution-row"><span>القاعدة:</span> <MathText text={sol.principle} /></div>
                  {sol.check && <div className="ta-solution-row"><span>التحقق:</span> <MathText text={sol.check} /></div>}
                  {sol.sourceNote && <div className="ta-solution-row ta-solution-warn"><span>ملاحظة المصدر:</span> <MathText text={sol.sourceNote} /></div>}
                </div>
              </details>
            ))}
          </div>
        ))}
      </section>
    )}
  </div>
);

const LESSON4_SECTION_LABELS = [
  'نظرة عامة للمدرّس',
  'الحلول التفصيلية: Q1–10',
  'الحلول التفصيلية: Q11–20',
  'الحلول التفصيلية: Q21–30',
  'الحلول التفصيلية: Q31–40',
  'الحلول التفصيلية: Q41–47',
  'مفتاح الاختبار الختامي',
  'الإرشادات التعليمية',
] as const;

const LESSON4_QUESTION_RANGES = [
  [1, 10],
  [11, 20],
  [21, 30],
  [31, 40],
  [41, 47],
] as const;

/**
 * Lesson 4 alone has a large, sequential answer key. This keeps its teacher
 * material navigable without changing the data or the shared Lesson 2–3 view.
 */
const Lesson4TeacherContent: React.FC<{ lesson: LessonData; data: TeacherAreaData }> = ({ lesson, data }) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const questionKey = data.answerKeys[0];
  const finalTestKey = data.answerKeys[1];
  const activeLabel = LESSON4_SECTION_LABELS[activeSectionIndex];
  const activeQuestionRange = LESSON4_QUESTION_RANGES[activeSectionIndex - 1];

  const questionsInActiveRange = activeQuestionRange
    ? questionKey?.items.filter((item) => {
      const questionNumber = Number(item.ref.replace(/^Q/, ''));
      return Number.isInteger(questionNumber)
        && questionNumber >= activeQuestionRange[0]
        && questionNumber <= activeQuestionRange[1];
    })
    : [];

  const renderAnswerKeyGroup = (
    group: NonNullable<typeof questionKey>,
    items = group.items,
  ) => (
    <div className="ta-key-group">
      <div className="ta-key-head">
        <span className="ta-key-title">{group.section}</span>
        <span className="source-page-badge">{group.source}</span>
      </div>
      <div className="ta-key-items">
        {items.map((it, ii) => (
          <div key={ii} className="ta-key-item">
            <span className="ta-key-ref">{it.ref}</span>
            <span className="ta-key-answer"><Math math={it.answer} /></span>
            {it.note && <span className="ta-key-note">{it.note}</span>}
          </div>
        ))}
      </div>
    </div>
  );

  const renderActiveSection = () => {
    if (activeSectionIndex === 0) {
      return (
        <>
          <div className="ta-lesson-head">
            <span className="step-num-badge">الدرس {lesson.number}</span>
            <h2>{lesson.title}</h2>
            <span className="source-page-badge">الصفحات {lesson.sourcePages.join('، ')}</span>
          </div>

          <section className="ta-section">
            <h3><Target size={18} /> أهداف الدرس</h3>
            <ul className="ta-list">
              {data.objectives.map((o, i) => (
                <li key={i}><MathText text={o} /></li>
              ))}
            </ul>
          </section>
        </>
      );
    }

    if (activeQuestionRange) {
      const [from, to] = activeQuestionRange;
      return (
        <section className="ta-section">
          <h3><KeyRound size={18} /> الحلول التفصيلية: Q{from}–{to}</h3>
          <div className="ta-keys">
            {questionKey && renderAnswerKeyGroup(questionKey, questionsInActiveRange)}
          </div>
        </section>
      );
    }

    if (activeSectionIndex === 6) {
      return (
        <section className="ta-section">
          <h3><KeyRound size={18} /> مفتاح الاختبار الختامي</h3>
          <div className="ta-keys">
            {finalTestKey && renderAnswerKeyGroup(finalTestKey)}
          </div>
        </section>
      );
    }

    return (
      <>
        <section className="ta-section">
          <h3><AlertTriangle size={18} /> الأخطاء الشائعة وتصويبها</h3>
          <div className="ta-mistakes">
            {data.commonMistakes.map((m, i) => (
              <div key={i} className="ta-mistake">
                <div className="ta-mistake-bad"><span>الخطأ:</span> <MathText text={m.mistake} /></div>
                <div className="ta-mistake-fix"><span>الصواب:</span> <MathText text={m.correction} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="ta-section">
          <h3><LifeBuoy size={18} /> اقتراحات المعالجة</h3>
          <ul className="ta-list">
            {data.remediation.map((r, i) => (
              <li key={i}><MathText text={r} /></li>
            ))}
          </ul>
        </section>

        <section className="ta-section">
          <h3><NotebookPen size={18} /> ملاحظات تدريسية</h3>
          <ul className="ta-list">
            {data.teachingNotes.map((n, i) => (
              <li key={i}><MathText text={n} /></li>
            ))}
          </ul>
        </section>

        <section className="ta-section">
          <h3><ClipboardList size={18} /> إرشادات التقويم</h3>
          <ul className="ta-list">
            {data.assessmentGuidance.map((g, i) => (
              <li key={i}><MathText text={g} /></li>
            ))}
          </ul>
        </section>
      </>
    );
  };

  return (
    <div className="ta-content">
      <nav className="ta-section-selector" aria-label="أقسام مساحة مدرس الدرس 4">
        {LESSON4_SECTION_LABELS.map((label, index) => (
          <button
            key={label}
            type="button"
            className={`ta-section-tab ${index === activeSectionIndex ? 'active' : ''}`}
            aria-label={`القسم ${index + 1}: ${label}`}
            aria-current={index === activeSectionIndex ? 'step' : undefined}
            onClick={() => setActiveSectionIndex(index)}
          >
            <span className="ta-section-number">{index + 1}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="ta-section-status" aria-live="polite">
        <span data-testid="lesson4-teacher-section-progress">{activeSectionIndex + 1} / {LESSON4_SECTION_LABELS.length}</span>
        <span>{activeLabel}</span>
      </div>

      {renderActiveSection()}

      <footer className="ta-section-navigator">
        <button
          type="button"
          className="nav-action-btn prev-btn"
          onClick={() => setActiveSectionIndex((index) => index - 1)}
          disabled={activeSectionIndex === 0}
          aria-label="القسم السابق"
        >
          <ChevronRight size={18} />
          <span>القسم السابق</span>
        </button>

        <button
          type="button"
          className="nav-action-btn next-btn"
          onClick={() => setActiveSectionIndex((index) => index + 1)}
          disabled={activeSectionIndex === LESSON4_SECTION_LABELS.length - 1}
          aria-label="القسم التالي"
        >
          <span>القسم التالي</span>
          <ChevronLeft size={18} />
        </button>
      </footer>
    </div>
  );
};

export const TeacherArea: React.FC<TeacherAreaProps> = ({ onNavigateHome }) => {
  const [granted, setGranted] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const lessons = lessonsWithTeacherArea();
  const [activeLessonId, setActiveLessonId] = useState<string>(lessons[0]?.id ?? '');
  const activeLesson = lessons.find((l) => l.id === activeLessonId) ?? lessons[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === TEACHER_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setGranted(true);
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة. حاول مرة أخرى.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setGranted(false);
    setPassword('');
  };

  if (!granted) {
    return (
      <div className="teacher-gate-wrap">
        <div className="teacher-gate">
          <div className="tg-icon">
            <Lock size={30} />
          </div>
          <h1>مساحة المدرّس</h1>
          <p className="tg-sub">هذه المنطقة مخصّصة للمعلّم وتحتوي على مفاتيح الإجابة والحلول والإرشادات التدريسية.</p>

          <form onSubmit={handleSubmit} className="tg-form">
            <label htmlFor="teacher-pass">كلمة المرور</label>
            <input
              id="teacher-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              autoComplete="current-password"
            />
            {error && <div className="tg-error">{error}</div>}
            <button type="submit" className="nav-action-btn next-btn tg-submit">
              دخول
            </button>
          </form>

          <div className="tg-note">
            <ShieldAlert size={16} />
            <span>
              تنبيه أمني: هذا موقع ثابت (GitHub Pages) وكلمة المرور تُتحقّق في المتصفح فقط، لذا فهي
              بوابة وصول عملية للمعلّم وليست حماية خادمية مشفّرة.
            </span>
          </div>

          <button className="tg-back" onClick={onNavigateHome}>
            <ArrowRight size={15} /> العودة إلى المنصة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-area">
      <div className="ta-topbar">
        <div className="ta-topbar-title">
          <NotebookPen size={20} />
          <span>مساحة المدرّس</span>
        </div>
        <div className="ta-topbar-actions">
          <button className="tg-back" onClick={onNavigateHome}>
            <ArrowRight size={15} /> المنصة
          </button>
          <button className="tg-back ta-logout" onClick={handleLogout}>
            <LogOut size={15} /> خروج
          </button>
        </div>
      </div>

      {lessons.length > 1 && (
        <div className="ta-lesson-tabs">
          {lessons.map((l) => (
            <button
              key={l.id}
              className={`ta-tab ${l.id === activeLesson?.id ? 'active' : ''}`}
              onClick={() => setActiveLessonId(l.id)}
            >
              الدرس {l.number}: {l.title}
            </button>
          ))}
        </div>
      )}

      {activeLesson?.teacherArea ? (
        activeLesson.id === 'lesson-4' ? (
          <Lesson4TeacherContent lesson={activeLesson} data={activeLesson.teacherArea} />
        ) : (
          <TeacherContent lesson={activeLesson} data={activeLesson.teacherArea} />
        )
      ) : (
        <p className="ta-empty">لا توجد مواد للمدرّس متاحة بعد.</p>
      )}
    </div>
  );
};

export default TeacherArea;
