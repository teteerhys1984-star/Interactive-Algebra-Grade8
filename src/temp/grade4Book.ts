/**
 * TEMP — Grade 4 Mathematics book (temporary addition).
 *
 * Self-contained and isolated, like the Grade 6 module next to it
 * (`grade6Book.ts`): it reads nothing from the Grade 8 curriculum
 * (`src/data/curriculum.ts`) and nothing from the Grade 6 book. Its images
 * live in their own folder, `public/temp/grade4/`.
 *
 * Source: the attached PDF "رياضيات الصف الرابع صفحات 8 الى 28 الصحيحة".
 * The file contains 21 pages (counted with three independent PDF libraries).
 * Every page is a single full-page raster; the only live text objects in
 * the file are the page-number badge and, on two pages, the chapter running
 * header — the lesson content itself has no text layer. Each page is
 * therefore rendered once at 200 DPI and served as a JPEG. Displaying the
 * original page images preserves every word, number, symbol, figure, and
 * table exactly as printed — nothing is re-typed, summarized, or corrected.
 *
 * Page inventory and verification notes: `docs/temp-grade4-inventory.md`.
 */

export const GRADE4_BOOK_TITLE = 'رياضيات الصف الرابع';
export const GRADE4_BOOK_SUBTITLE =
  'كتاب الرياضيات للصف الرابع — صفحات الكتاب الأصلية كما وردت في الملف المرفق.';

/** Number of pages in the attached PDF (PDF pages 1–21, in original order). */
export const GRADE4_PAGE_COUNT = 21;

/**
 * Page number printed on each PDF page, in PDF order (index 0 → PDF page 1).
 *
 * Recorded page by page rather than derived from a formula: each value was
 * read from that page's own footer badge, both in the PDF text layer and on
 * the rendered image. The numbers happen to run 8 → 28 without a gap, but
 * nothing in the code relies on that. `null` marks a page with no printed
 * number (none in this file).
 */
export const GRADE4_PRINTED_PAGES: ReadonlyArray<number | null> = [
  8, // PDF page 1
  9, // PDF page 2
  10, // PDF page 3
  11, // PDF page 4
  12, // PDF page 5
  13, // PDF page 6
  14, // PDF page 7
  15, // PDF page 8
  16, // PDF page 9
  17, // PDF page 10
  18, // PDF page 11
  19, // PDF page 12
  20, // PDF page 13
  21, // PDF page 14
  22, // PDF page 15
  23, // PDF page 16
  24, // PDF page 17
  25, // PDF page 18
  26, // PDF page 19
  27, // PDF page 20
  28, // PDF page 21
];

/** 1-based PDF page index → printed page number, or `null` when unknown. */
export function grade4PrintedPageNumber(pdfPage: number): number | null {
  return GRADE4_PRINTED_PAGES[pdfPage - 1] ?? null;
}

/** 1-based PDF page index → image file name inside `public/temp/grade4/`. */
export function grade4PageImageFile(pdfPage: number): string {
  return `page-${String(pdfPage).padStart(2, '0')}.jpg`;
}

/** 1-based PDF page index → static image URL served from `public/`. */
export function grade4PageImageSrc(pdfPage: number): string {
  // BASE_URL keeps the path correct under the Vite `base` (GitHub Pages subpath).
  return `${import.meta.env.BASE_URL}temp/grade4/${grade4PageImageFile(pdfPage)}`;
}

/**
 * Internal page inventory: proves coverage of PDF pages 1–21 in original
 * order. Each entry pairs the PDF page index with the page number printed on
 * that page and the image rendered from it. Mirrored, row for row, by the
 * table in `docs/temp-grade4-inventory.md`.
 */
export interface Grade4PageInventoryEntry {
  /** 1-based index within the attached PDF (1–21). */
  pdfPage: number;
  /** Page number printed on the book page itself, or `null` when unknown. */
  printedPage: number | null;
  /** Image file name inside `public/temp/grade4/`. */
  imageFile: string;
  /** Static image URL rendered from that PDF page. */
  imageSrc: string;
}

export const GRADE4_PAGE_INVENTORY: Grade4PageInventoryEntry[] = GRADE4_PRINTED_PAGES.map(
  (printedPage, i) => {
    const pdfPage = i + 1;
    return {
      pdfPage,
      printedPage,
      imageFile: grade4PageImageFile(pdfPage),
      imageSrc: grade4PageImageSrc(pdfPage),
    };
  },
);
