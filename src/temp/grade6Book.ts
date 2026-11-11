/**
 * TEMP — Grade 6 Mathematics book (temporary addition).
 *
 * This module is intentionally self-contained and isolated from the Grade 8
 * curriculum (`src/data/curriculum.ts`). Removing the TEMP tab later only
 * requires deleting this folder, `public/temp/`, and the small wiring edits
 * in `App.tsx`, `Header.tsx`, `useHashRoute.ts`, and `main.tsx`.
 *
 * Source: the attached scanned PDF "رياضيات الصف السادس من صفحة 6 إلى 41"
 * (36 pages). The PDF is image-only (no text layer), so each page is
 * rendered once at 200 DPI and served as a JPEG under `public/temp/grade6/`.
 * Displaying the original page images preserves every word, fraction,
 * symbol, figure, and table exactly as printed — nothing is re-typed,
 * summarized, or guessed.
 */

export const GRADE6_BOOK_ID = 'grade6-math';
export const GRADE6_BOOK_TITLE = 'رياضيات الصف السادس';
export const GRADE6_BOOK_SUBTITLE =
  'كتاب الرياضيات للصف السادس الأساسي — صفحات الكتاب الأصلية كما وردت في الملف المرفق.';

/** Number of pages in the attached PDF (PDF pages 1–36, in original order). */
export const GRADE6_PAGE_COUNT = 36;

/**
 * Printed page number shown at the bottom of the first PDF page.
 * Verified against the PDF text layer: PDF page N carries printed number N + 7
 * (PDF 1 → 8, PDF 36 → 43), with no gaps.
 */
export const GRADE6_FIRST_PRINTED_PAGE = 8;

/** 1-based PDF page index → printed page number (e.g. 1 → 8, 36 → 43). */
export function printedPageNumber(pdfPage: number): number {
  return GRADE6_FIRST_PRINTED_PAGE + pdfPage - 1;
}

/** 1-based PDF page index → static image URL served from `public/`. */
export function grade6PageImageSrc(pdfPage: number): string {
  const padded = String(pdfPage).padStart(2, '0');
  // BASE_URL keeps the path correct under the Vite `base` (GitHub Pages subpath).
  return `${import.meta.env.BASE_URL}temp/grade6/page-${padded}.jpg`;
}

/**
 * Internal page inventory: proves coverage of PDF pages 1–36 in original
 * order. Each entry pairs the PDF page index with the printed page number
 * visible on that page. See `docs/temp-grade6-inventory.md`.
 */
export interface Grade6PageInventoryEntry {
  /** 1-based index within the attached PDF (1–36). */
  pdfPage: number;
  /** Page number printed on the book page itself (8–43). */
  printedPage: number;
  /** Static image URL rendered from that PDF page. */
  imageSrc: string;
}

export const GRADE6_PAGE_INVENTORY: Grade6PageInventoryEntry[] = Array.from(
  { length: GRADE6_PAGE_COUNT },
  (_, i) => {
    const pdfPage = i + 1;
    return {
      pdfPage,
      printedPage: printedPageNumber(pdfPage),
      imageSrc: grade6PageImageSrc(pdfPage),
    };
  },
);
