import React from 'react';
import { BookOpen, FlaskConical, ArrowLeft } from 'lucide-react';
import {
  GRADE6_BOOK_TITLE,
  GRADE6_BOOK_SUBTITLE,
  GRADE6_PAGE_COUNT,
  GRADE6_FIRST_PRINTED_PAGE,
  printedPageNumber,
} from './grade6Book';

/**
 * TEMP tab landing (temporary addition).
 *
 * Shows a single entry — the Grade 6 mathematics book — and nothing else.
 * This view is fully isolated from the Grade 8 curriculum: it reads no
 * lesson data and renders no Grade 8 content.
 */
export const TempArea: React.FC = () => {
  return (
    <main className="catalog-view temp-view" dir="rtl">
      <section className="catalog-section" aria-labelledby="temp-heading">
        <div className="catalog-inner">
          <div className="catalog-section-head">
            <h2 className="catalog-section-title" id="temp-heading">
              <FlaskConical size={20} aria-hidden="true" />
              <span>TEMP — محتوى مؤقت للتجربة</span>
            </h2>
            <p className="catalog-section-hint">
              هذا القسم إضافة مؤقتة لاختبار الحاجة إلى المحتوى، وسيُحذف لاحقاً.
              لا يؤثر على دروس الصف الثامن أو اختباراته.
            </p>
          </div>

          <div className="unit-grid">
            <article className="unit-card temp-book-card">
              <div className="unit-card-visual temp-book-visual" aria-hidden="true">
                <BookOpen size={44} />
              </div>
              <div className="unit-card-body">
                <p className="unit-card-pages">
                  {GRADE6_PAGE_COUNT} صفحة — من الصفحة المطبوعة {GRADE6_FIRST_PRINTED_PAGE} إلى{' '}
                  {printedPageNumber(GRADE6_PAGE_COUNT)}
                </p>
                <h3 className="unit-card-title">{GRADE6_BOOK_TITLE}</h3>
                <p className="unit-card-desc">{GRADE6_BOOK_SUBTITLE}</p>
                <a
                  className="unit-card-cta temp-book-cta"
                  href="#/temp/grade6"
                  aria-label={`فتح كتاب ${GRADE6_BOOK_TITLE}`}
                >
                  <span>فتح الكتاب</span>
                  <ArrowLeft size={16} aria-hidden="true" />
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TempArea;
