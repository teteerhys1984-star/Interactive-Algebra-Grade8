import React from 'react';
import { UnitData } from '../data/curriculum';
import { BookOpen, Compass, ChevronLeft, ArrowRight } from 'lucide-react';

interface UnitOverviewProps {
  unit: UnitData;
  onNavigateHome: () => void;
  onSelectLesson: (unitId: string, lessonId: string) => void;
}

export const UnitOverview: React.FC<UnitOverviewProps> = ({
  unit,
  onNavigateHome,
  onSelectLesson,
}) => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem', width: '100%' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          className="nav-action-btn prev-btn"
          onClick={onNavigateHome}
        >
          <ArrowRight size={16} />
          <span>العودة إلى الصفحة الرئيسية</span>
        </button>
      </div>

      {/* Unit Header Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <span className="step-num-badge">الوحدة {unit.number}</span>
          <span className="source-page-badge">الصفحات {unit.sourcePages.join('، ')}</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-slate-900)', marginBottom: '0.75rem' }}>
          {unit.title}
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {unit.description}
        </p>
      </div>

      {/* Sections List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Launchpad card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid #fde68a',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Compass size={18} style={{ color: 'var(--color-amber-600)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-amber-800)' }}>
                مدخل تشخيصي • الصفحتان 3 و 4
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
              {unit.warmup.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              12 تمريناً تفاعلياً تشمل الاختيار من متعدد، التحويل لنسب مئوية، التبسيط، واكتشاف الكسر الدخيل والضرب التقاطعي.
            </p>
          </div>

          <button
            className="nav-action-btn"
            style={{ backgroundColor: 'var(--color-amber-500)', color: '#ffffff' }}
            onClick={() => onSelectLesson(unit.id, 'warmup')}
          >
            <span>بدء الانطلاقة النشطة</span>
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Lessons List */}
        {unit.lessons.map((lesson) => (
          <div
            key={lesson.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--color-primary-200)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <BookOpen size={18} style={{ color: 'var(--color-primary-600)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary-800)' }}>
                  الدرس {lesson.number} • الصفحات {lesson.sourcePages.join('، ')}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                {lesson.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {lesson.description}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-slate-100)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--color-slate-700)', fontWeight: 600 }}>
                  {lesson.steps.length} خطوات تفاعلية
                </span>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-teal-50)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--color-teal-600)', fontWeight: 600 }}>
                  تحقق من فهمك وتدرب
                </span>
                {lesson.finalAssessment && (
                  <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-primary-50)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--color-primary-700)', fontWeight: 600 }}>
                    اختبار شامل
                  </span>
                )}
              </div>
            </div>

            <button
              className="nav-action-btn next-btn"
              onClick={() => onSelectLesson(unit.id, lesson.id)}
            >
              <span>دخول الدرس {lesson.number}</span>
              <ChevronLeft size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitOverview;
