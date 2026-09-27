import React from 'react';
import { curriculum } from '../data/curriculum';
import { BookOpen, Sparkles, Compass, ChevronLeft } from 'lucide-react';

interface CourseHomeProps {
  onSelectUnit: (unitId: string) => void;
  onSelectLesson: (unitId: string, lessonId: string) => void;
}

export const CourseHome: React.FC<CourseHomeProps> = ({
  onSelectUnit,
  onSelectLesson,
}) => {
  return (
    <div className="course-home-view" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', width: '100%' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0d9488 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2rem',
          color: '#ffffff',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={16} />
            <span>المنهاج السوري الحديث • الصف الثامن الأساسي</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.25, marginBottom: '1rem' }}>
            كتاب الجبر التفاعلي
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.92, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            منصة تعليمية تفاعلية تفصل كل قاعدة وتمرين ومسألة من كتاب الرياضيات المدرسي مع حلول خطوة بخطوة وتوضيح رياضي أصيل.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="nav-action-btn"
              style={{ backgroundColor: '#ffffff', color: 'var(--color-primary-800)', fontWeight: 800 }}
              onClick={() => onSelectLesson('unit-1', 'lesson-1')}
            >
              <BookOpen size={18} />
              <span>ابدأ الدرس 1: الجمع والطرح</span>
            </button>
            <button
              className="nav-action-btn"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.4)' }}
              onClick={() => onSelectLesson('unit-1', 'warmup')}
            >
              <Compass size={18} />
              <span>الانطلاقة النشطة (صفحة 3 و 4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Units Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
            وحدات كتاب الجبر
          </h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            الفصل الدراسي الأول
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {curriculum.map((unit) => (
            <div
              key={unit.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
              }}
            >
              {/* Unit Header */}
              <div
                style={{
                  padding: '1.5rem 2rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'linear-gradient(90deg, #f8fafc 0%, #ffffff 100%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span className="step-num-badge">الوحدة {unit.number}</span>
                    <span className="source-page-badge">الصفحات {unit.sourcePages.join('، ')}</span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                    {unit.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                    {unit.description}
                  </p>
                </div>

                <button
                  className="nav-action-btn prev-btn"
                  onClick={() => onSelectUnit(unit.id)}
                  style={{ padding: '0.5rem 1.25rem' }}
                >
                  <span>عرض محتويات الوحدة</span>
                  <ChevronLeft size={16} />
                </button>
              </div>

              {/* Unit Content Grid */}
              <div style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {/* Launchpad Card */}
                <div
                  style={{
                    backgroundColor: 'var(--color-amber-50)',
                    border: '1px solid #fde68a',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Compass size={18} style={{ color: 'var(--color-amber-600)' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-amber-800)' }}>
                        الصفحتان 3 و 4
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-slate-900)', marginBottom: '0.4rem' }}>
                      {unit.warmup.title}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-700)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {unit.warmup.description}
                    </p>
                  </div>

                  <button
                    className="nav-action-btn"
                    style={{ backgroundColor: 'var(--color-amber-500)', color: '#ffffff', width: '100%', justifyContent: 'center' }}
                    onClick={() => onSelectLesson(unit.id, 'warmup')}
                  >
                    <span>فتح الانطلاقة النشطة (12 تمريناً)</span>
                    <ChevronLeft size={16} />
                  </button>
                </div>

                {/* Lesson 1 Card */}
                {unit.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    style={{
                      backgroundColor: 'var(--color-primary-50)',
                      border: '1px solid var(--color-primary-200)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <BookOpen size={18} style={{ color: 'var(--color-primary-600)' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-800)' }}>
                          الدرس {lesson.number} • الصفحات {lesson.sourcePages.join('، ')}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-slate-900)', marginBottom: '0.4rem' }}>
                        {lesson.title}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-700)', lineHeight: 1.5, marginBottom: '1rem' }}>
                        {lesson.description}
                      </p>
                    </div>

                    <button
                      className="nav-action-btn"
                      style={{ backgroundColor: 'var(--color-primary-600)', color: '#ffffff', width: '100%', justifyContent: 'center' }}
                      onClick={() => onSelectLesson(unit.id, lesson.id)}
                    >
                      <span>فتح الدرس التفاعلي (6 خطوات)</span>
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CourseHome;
