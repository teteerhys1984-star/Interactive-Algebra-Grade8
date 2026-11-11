import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRight, ChevronLeft, ArrowRight, CornerDownLeft } from 'lucide-react';
import {
  GRADE6_BOOK_TITLE,
  GRADE6_PAGE_COUNT,
  grade6PageImageSrc,
  printedPageNumber,
} from './grade6Book';

interface Grade6BookReaderProps {
  /** 1-based page index from the route (`#/temp/grade6/:page`). */
  initialPage: number;
  /** Called whenever the visible page changes so the hash stays in sync. */
  onPageChange: (page: number) => void;
  /** Back to the TEMP landing. */
  onBackToTemp: () => void;
}

const clampPage = (page: number): number =>
  Math.min(GRADE6_PAGE_COUNT, Math.max(1, page));

/**
 * Page-by-page reader for the Grade 6 book (TEMP, temporary addition).
 *
 * Shows one original book page at a time as a high-resolution image, with
 * previous/next navigation, a clear page indicator, direct page jump, and
 * keyboard support. Adjacent pages are preloaded so flipping feels instant.
 * No Grade 8 lesson engine is involved.
 */
export const Grade6BookReader: React.FC<Grade6BookReaderProps> = ({
  initialPage,
  onPageChange,
  onBackToTemp,
}) => {
  const [page, setPage] = useState<number>(() => clampPage(initialPage));
  const [jumpValue, setJumpValue] = useState<string>(String(clampPage(initialPage)));
  const topRef = useRef<HTMLDivElement>(null);

  const goToPage = useCallback(
    (next: number) => {
      const target = clampPage(next);
      setPage(target);
      setJumpValue(String(target));
      onPageChange(target);
    },
    [onPageChange],
  );

  // Keep local state in sync when the route page changes (e.g. back button).
  useEffect(() => {
    const fromRoute = clampPage(initialPage);
    setPage((current) => {
      if (current !== fromRoute) {
        setJumpValue(String(fromRoute));
        return fromRoute;
      }
      return current;
    });
  }, [initialPage]);

  // Preload neighbouring pages for smooth flipping.
  useEffect(() => {
    [page - 1, page + 1].forEach((p) => {
      if (p >= 1 && p <= GRADE6_PAGE_COUNT) {
        const img = new Image();
        img.src = grade6PageImageSrc(p);
      }
    });
  }, [page]);

  // Keyboard navigation: in RTL reading order, ArrowLeft advances.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPage(page + 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToPage(page - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goToPage(1);
      } else if (event.key === 'End') {
        event.preventDefault();
        goToPage(GRADE6_PAGE_COUNT);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, goToPage]);

  // Scroll the page image back into view on change.
  useEffect(() => {
    topRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, [page]);

  const handleJumpSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = parseInt(jumpValue, 10);
    if (!Number.isNaN(parsed)) goToPage(parsed);
  };

  const isFirst = page === 1;
  const isLast = page === GRADE6_PAGE_COUNT;

  return (
    <main className="catalog-view temp-view" dir="rtl">
      <div className="catalog-inner temp-reader-inner">
        <div ref={topRef} className="temp-reader-head">
          <button type="button" className="catalog-back-link temp-back-link" onClick={onBackToTemp}>
            <ArrowRight size={16} aria-hidden="true" />
            <span>العودة إلى TEMP</span>
          </button>
          <div className="temp-reader-title-block">
            <h1 className="temp-reader-title">{GRADE6_BOOK_TITLE}</h1>
            <p className="temp-reader-subtitle">
              صفحة {page} من {GRADE6_PAGE_COUNT} — الصفحة المطبوعة {printedPageNumber(page)}
            </p>
          </div>
        </div>

        <figure className="temp-page-frame">
          <img
            key={page}
            className="temp-page-image"
            src={grade6PageImageSrc(page)}
            alt={`صفحة ${printedPageNumber(page)} من كتاب ${GRADE6_BOOK_TITLE} (الصفحة ${page} من ${GRADE6_PAGE_COUNT})`}
            draggable={false}
          />
        </figure>

        <nav className="temp-reader-controls" aria-label="التنقل بين صفحات الكتاب">
          <button
            type="button"
            className="temp-nav-btn"
            onClick={() => goToPage(page - 1)}
            disabled={isFirst}
            aria-label="الصفحة السابقة"
          >
            <ChevronRight size={18} aria-hidden="true" />
            <span>السابق</span>
          </button>

          <form className="temp-jump-form" onSubmit={handleJumpSubmit}>
            <label className="temp-jump-label" htmlFor="temp-page-jump">
              انتقل إلى صفحة:
            </label>
            <input
              id="temp-page-jump"
              className="temp-jump-input"
              type="number"
              min={1}
              max={GRADE6_PAGE_COUNT}
              value={jumpValue}
              onChange={(event) => setJumpValue(event.target.value)}
              aria-describedby="temp-page-range"
            />
            <span id="temp-page-range" className="temp-jump-range">
              من 1 إلى {GRADE6_PAGE_COUNT}
            </span>
            <button type="submit" className="temp-jump-btn" aria-label="الانتقال إلى الصفحة المدخلة">
              <CornerDownLeft size={16} aria-hidden="true" />
              <span>انتقال</span>
            </button>
          </form>

          <button
            type="button"
            className="temp-nav-btn"
            onClick={() => goToPage(page + 1)}
            disabled={isLast}
            aria-label="الصفحة التالية"
          >
            <span>التالي</span>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
        </nav>

        <p className="temp-reader-progress" aria-live="polite">
          الصفحة {page} من {GRADE6_PAGE_COUNT}
        </p>
      </div>
    </main>
  );
};

export default Grade6BookReader;
