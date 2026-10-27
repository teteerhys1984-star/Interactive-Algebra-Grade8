import React, { useState } from 'react';
import { BookOpen, LockKeyhole, FileCheck2, Search, ShieldCheck } from 'lucide-react';

type ActiveTab = 'questions' | 'solutions';

const SOLUTIONS_PASSWORD = 'somer173';

export const IndependentTestsArea: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('questions');
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  const openSolutions = () => {
    setActiveTab('solutions');
    setPassword('');
    setError('');
  };

  const checkPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === SOLUTIONS_PASSWORD) {
      setUnlocked(true);
      setError('');
    } else {
      setError('كلمة السر غير صحيحة. حاول مرة أخرى.');
    }
  };

  const returnToQuestions = () => {
    setActiveTab('questions');
    setUnlocked(false);
    setPassword('');
    setError('');
  };

  return (
    <main className="independent-tests-area" dir="rtl">
      <header className="independent-tests-hero">
        <div className="independent-tests-hero-icon"><FileCheck2 size={28} aria-hidden="true" /></div>
        <p className="independent-tests-eyebrow">الصف الثامن الأساسي</p>
        <h1>اختبارات مستقلة</h1>
        <p>مساحة مخصصة لأسئلة اختبارات الجبر والاختبارات المشتركة (جبر + هندسة)، مع الحلول الكاملة في تبويب مستقل.</p>
      </header>

      <nav className="independent-tests-tabs" aria-label="أقسام الاختبارات المستقلة">
        <button type="button" className={activeTab === 'questions' ? 'is-active' : ''} aria-current={activeTab === 'questions' ? 'page' : undefined} onClick={returnToQuestions}>
          <BookOpen size={18} aria-hidden="true" /> الأسئلة
        </button>
        <button type="button" className={activeTab === 'solutions' ? 'is-active' : ''} aria-current={activeTab === 'solutions' ? 'page' : undefined} onClick={openSolutions}>
          <LockKeyhole size={18} aria-hidden="true" /> الحلول <span className="independent-tests-lock-label">محمي</span>
        </button>
      </nav>

      {activeTab === 'questions' && (
        <section className="independent-tests-empty" aria-labelledby="independent-questions-title">
          <div className="independent-tests-empty-icon"><Search size={25} aria-hidden="true" /></div>
          <h2 id="independent-questions-title">الاختبارات ستُضاف هنا</h2>
          <p>هذه المنطقة جاهزة لاستقبال صور الاختبارات وتنظيمها إلى اختبارات جبر مستقلة واختبارات مشتركة بين الجبر والهندسة.</p>
          <div className="independent-tests-tags"><span>جبر</span><span>جبر + هندسة</span></div>
        </section>
      )}

      {activeTab === 'solutions' && !unlocked && (
        <section className="independent-tests-password" aria-labelledby="independent-solutions-title">
          <div className="independent-tests-password-icon"><LockKeyhole size={25} aria-hidden="true" /></div>
          <h2 id="independent-solutions-title">الحلول محمية بكلمة سر</h2>
          <p>أدخل كلمة السر المخصصة لفتح حلول الاختبارات.</p>
          <form onSubmit={checkPassword}>
            <label htmlFor="independent-solutions-password">كلمة السر</label>
            <input
              id="independent-solutions-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            {error && <p className="independent-tests-password-error" role="alert">{error}</p>}
            <button type="submit" className="independent-tests-primary-button"><LockKeyhole size={17} aria-hidden="true" /> فتح الحلول</button>
          </form>
          <p className="independent-tests-security-note"><ShieldCheck size={15} aria-hidden="true" /> بوابة كلمة السر الحالية تعمل في واجهة المتصفح فقط.</p>
        </section>
      )}

      {activeTab === 'solutions' && unlocked && (
        <section className="independent-tests-empty" aria-labelledby="independent-solutions-ready-title">
          <div className="independent-tests-empty-icon"><FileCheck2 size={25} aria-hidden="true" /></div>
          <h2 id="independent-solutions-ready-title">مساحة الحلول جاهزة</h2>
          <p>ستظهر هنا الحلول التفصيلية ورسومها المطابقة للأسئلة بعد إضافتها ومراجعتها.</p>
          <button type="button" className="independent-tests-primary-button" onClick={returnToQuestions}>العودة إلى الأسئلة</button>
        </section>
      )}
    </main>
  );
};

export default IndependentTestsArea;
