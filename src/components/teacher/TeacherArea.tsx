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
  </div>
);

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
        <TeacherContent lesson={activeLesson} data={activeLesson.teacherArea} />
      ) : (
        <p className="ta-empty">لا توجد مواد للمدرّس متاحة بعد.</p>
      )}
    </div>
  );
};

export default TeacherArea;
