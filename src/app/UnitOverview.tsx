import React from 'react';
import { UnitData } from '../data/curriculum';
import { ArrowRight, ChevronLeft, Hourglass } from 'lucide-react';
import { LessonCard } from '../components/catalog/LessonCard';
import { CatalogMotif } from '../components/catalog/CatalogMotif';
import { getUnitAccent, accentStyle } from '../components/catalog/catalogAccents';

interface UnitOverviewProps {
  unit: UnitData;
}

/**
 * Unit landing page — the second (and last) catalog level.
 *
 * Lists only the launchpad and the lessons registered to this unit, in
 * registry order. Navigation is link-based (`#/unit/:id/lesson/:lid`),
 * so existing lesson routes, refresh, and browser back/forward keep
 * working exactly as before.
 */
export const UnitOverview: React.FC<UnitOverviewProps> = ({ unit }) => {
  const accent = getUnitAccent(unit.number);

  return (
    <main className="catalog-view" dir="rtl">
      <div className="catalog-inner">
        {/* Navigation path back to the unit catalog */}
        <div className="unit-topbar">
          <nav className="catalog-breadcrumb" aria-label="مسار التنقل">
            <ol>
              <li>
                <a href="#/">الوحدات</a>
              </li>
              <li className="crumb-sep" aria-hidden="true">
                <ChevronLeft size={14} />
              </li>
              <li aria-current="page">
                الوحدة {unit.number}: {unit.title}
              </li>
            </ol>
          </nav>

          <a className="catalog-back-link" href="#/">
            <ArrowRight size={16} aria-hidden="true" />
            <span>العودة إلى الوحدات</span>
          </a>
        </div>

        {/* Unit header */}
        <header
          className="unit-hero"
          style={accentStyle(accent) as React.CSSProperties}
        >
          <CatalogMotif className="unit-hero-motif" variant={unit.number - 1} />
          <div className="unit-hero-emblem" aria-hidden="true">
            <span className="unit-emblem-label">الوحدة</span>
            <span className="unit-emblem-num">{unit.number}</span>
          </div>
          <div className="unit-hero-text">
            <div className="unit-hero-badges">
              <span className="unit-hero-badge">الوحدة {unit.number}</span>
              <span className="unit-hero-badge is-neutral">
                صفحات الكتاب {Math.min(...unit.sourcePages)} – {Math.max(...unit.sourcePages)}
              </span>
            </div>
            <h1 className="unit-hero-title">{unit.title}</h1>
            <p className="unit-hero-desc">{unit.description}</p>
          </div>
        </header>

        {/* This unit's lessons — and no other unit's */}
        <section className="catalog-section" aria-labelledby="unit-lessons-heading">
          <div className="catalog-section-head">
            <h2 className="catalog-section-title" id="unit-lessons-heading">
              دروس الوحدة
            </h2>
            <p className="catalog-section-hint">تُعرض هنا محتويات هذه الوحدة فقط وبالترتيب المعتمد في الكتاب</p>
          </div>

          <div className="lesson-grid">
            {/* Registered launchpad (warmup) for this unit */}
            <LessonCard
              unitId={unit.id}
              lesson={unit.warmup}
              unitNumber={unit.number}
              isWarmup
            />

            {unit.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                unitId={unit.id}
                lesson={lesson}
                unitNumber={unit.number}
              />
            ))}
          </div>

          {unit.lessons.length === 0 && (
            <div className="lesson-empty-state">
              <Hourglass size={30} aria-hidden="true" />
              <h3>دروس هذه الوحدة قيد الإعداد</h3>
              <p>
                لم تُسجَّل بعد أي دروس تفاعلية في هذه الوحدة. ستظهر بطاقات الدروس
                هنا تلقائياً فور إضافتها إلى المنهاج.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default UnitOverview;
