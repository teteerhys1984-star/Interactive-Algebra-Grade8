import React from 'react';
import { curriculum } from '../data/curriculum';
import { Sparkles, BookOpen, MousePointerClick, Sigma } from 'lucide-react';
import { UnitCard } from '../components/catalog/UnitCard';
import { HeroMotif } from '../components/catalog/CatalogMotif';

/**
 * Platform home — the curriculum gateway.
 *
 * Shows ONLY the unit catalog: one card per registered unit, in registry
 * order. Lesson cards, test content, and the teacher area intentionally
 * do not appear here; they live on the unit page / dedicated routes.
 * Every unit registered in `curriculum` is rendered automatically,
 * present and future.
 */
export const CourseHome: React.FC = () => {
  return (
    <main className="catalog-view" dir="rtl">
      {/* Hero — platform identity only, no lesson shortcuts */}
      <section className="catalog-hero">
        <div className="catalog-hero-grid" aria-hidden="true" />
        <HeroMotif />
        <div className="catalog-inner">
          <div className="catalog-hero-content">
            <div className="catalog-hero-badge">
              <Sparkles size={15} aria-hidden="true" />
              <span>المنهاج السوري الحديث • الصف الثامن الأساسي</span>
            </div>
            <h1 className="catalog-hero-title">الجبر التفاعلي — الصف الثامن</h1>
            <p className="catalog-hero-subtitle">
              منصّة تعليمية تفاعلية تحوّل كتاب الجبر المدرسي إلى رحلة تعلّم حيّة:
              قواعد مفصّلة خطوة بخطوة، أنشطة استكشافية، تمارين بحدودها العلمية،
              وحلول رياضية أصيلة بترميز دقيق — كل ذلك ضمن وحدات المنهاج الرسمية.
            </p>
            <div className="catalog-hero-meta">
              <span className="catalog-hero-chip">
                <BookOpen size={14} aria-hidden="true" />
                محتوى مطابق للكتاب المدرسي
              </span>
              <span className="catalog-hero-chip">
                <Sigma size={14} aria-hidden="true" />
                ترميز رياضي دقيق
              </span>
              <span className="catalog-hero-chip">
                <MousePointerClick size={14} aria-hidden="true" />
                تعلّم تفاعلي خطوة بخطوة
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Unit catalog — the only catalog level on the home page */}
      <section className="catalog-section" aria-labelledby="units-catalog-heading">
        <div className="catalog-inner">
          <div className="catalog-section-head">
            <h2 className="catalog-section-title" id="units-catalog-heading">
              وحدات المنهاج
            </h2>
            <p className="catalog-section-hint">اختر وحدة لاستكشاف دروسها التفاعلية</p>
          </div>

          <div className="unit-grid">
            {curriculum.map((unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CourseHome;
