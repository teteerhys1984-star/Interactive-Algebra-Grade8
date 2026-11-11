import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import App from '../app/App';
import { parseHash } from '../app/useHashRoute';
import { curriculum } from '../data/curriculum';
import { Grade6BookReader, type TempReaderBook } from '../temp/Grade6BookReader';
import {
  GRADE4_BOOK_SUBTITLE,
  GRADE4_BOOK_TITLE,
  GRADE4_PAGE_COUNT,
  GRADE4_PAGE_INVENTORY,
  GRADE4_PRINTED_PAGES,
  grade4PageImageSrc,
  grade4PrintedPageNumber,
} from '../temp/grade4Book';
import {
  GRADE6_BOOK_TITLE,
  GRADE6_PAGE_COUNT,
  GRADE6_PAGE_INVENTORY,
} from '../temp/grade6Book';

/**
 * TEMP — Grade 4 book (temporary addition) regression suite.
 *
 * Covers the Grade 4 card on the TEMP landing, the page-by-page reader
 * (all 21 pages, in PDF order), its own hash routes, the page inventory
 * (data, image files, and the inventory doc), and that the Grade 6 book and
 * the Grade 8 curriculum are unaffected.
 *
 * The numbers below are the "source scale": they were read from the attached
 * PDF itself (21 pages; the footer of each page carries its printed number).
 * They are written out literally on purpose — change them only after
 * re-checking the PDF, never to make a test pass.
 */

/** Number of pages in the attached PDF. */
const SOURCE_PAGE_COUNT = 21;

/** Printed page number of each PDF page, in PDF order (PDF page 1 first). */
const SOURCE_PRINTED_PAGES = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
];

const GRADE4_TITLE = 'رياضيات الصف الرابع';
const GRADE4_IMAGE_DIR = 'public/temp/grade4';
const GRADE6_IMAGE_DIR = 'public/temp/grade6';
const INVENTORY_DOC = 'docs/temp-grade4-inventory.md';

/** Image file name of a 1-based PDF page, e.g. 3 → `page-03.jpg`. */
const fileName = (pdfPage: number) => `page-${String(pdfPage).padStart(2, '0')}.jpg`;

/** Expected image URL of a Grade 4 page, built independently of the app code. */
const grade4Src = (pdfPage: number) =>
  `${import.meta.env.BASE_URL}temp/grade4/${fileName(pdfPage)}`;

/** The page image the reader currently shows. */
const shownPage = () => screen.getByAltText(/كتاب/);

const nextButton = () => screen.getByRole('button', { name: 'الصفحة التالية' });
const previousButton = () => screen.getByRole('button', { name: 'الصفحة السابقة' });

/** Asserts that the reader shows the given Grade 4 PDF page, image and indicators. */
function expectGrade4Page(pdfPage: number) {
  const printed = SOURCE_PRINTED_PAGES[pdfPage - 1];
  const image = shownPage();
  expect(image).toHaveAttribute('src', grade4Src(pdfPage));
  expect(image).toHaveAttribute(
    'alt',
    `صفحة ${printed} من كتاب ${GRADE4_TITLE} (الصفحة ${pdfPage} من ${SOURCE_PAGE_COUNT})`,
  );
  expect(
    screen.getByText(`صفحة ${pdfPage} من ${SOURCE_PAGE_COUNT} — الصفحة المطبوعة ${printed}`),
  ).toBeInTheDocument();
  expect(screen.getByText(`الصفحة ${pdfPage} من ${SOURCE_PAGE_COUNT}`)).toBeInTheDocument();
}

/** Width and height stored in a JPEG file's frame header (SOFn marker). */
function jpegSize(file: Buffer): { width: number; height: number } {
  let offset = 2; // skip the SOI marker (FF D8)
  while (offset + 9 < file.length && file[offset] === 0xff) {
    const marker = file[offset + 1];
    const isFrameHeader =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrameHeader) {
      return { height: file.readUInt16BE(offset + 5), width: file.readUInt16BE(offset + 7) };
    }
    offset += 2 + file.readUInt16BE(offset + 2);
  }
  throw new Error('JPEG frame header not found');
}

describe('TEMP tab — Grade 4 book (temporary addition)', () => {
  beforeEach(() => {
    window.location.hash = '';
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('1. TEMP landing shows the Grade 4 card beside the Grade 6 card, in that order', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /فتح تبويب TEMP المؤقت/ }));
    await waitFor(() => expect(window.location.hash).toBe('#/temp'));

    // Exactly two book cards, side by side in the same grid: Grade 6 first, Grade 4 second.
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(2);
    expect(cards[0].parentElement).toBe(cards[1].parentElement);
    expect(cards[0].parentElement).toHaveClass('unit-grid');
    expect(
      cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent),
    ).toEqual([GRADE6_BOOK_TITLE, GRADE4_TITLE]);
    expect(screen.getAllByRole('link', { name: /^فتح كتاب / })).toHaveLength(2);

    // Grade 4 card: book name, actual page count, short description, open button.
    const grade4Card = within(cards[1]);
    expect(grade4Card.getByRole('heading', { level: 3 })).toHaveTextContent(GRADE4_TITLE);
    expect(grade4Card.getByText('21 صفحة — من الصفحة المطبوعة 8 إلى 28')).toBeInTheDocument();
    expect(grade4Card.getByText(GRADE4_BOOK_SUBTITLE)).toBeInTheDocument();
    const openGrade4 = grade4Card.getByRole('link', { name: `فتح كتاب ${GRADE4_TITLE}` });
    expect(openGrade4).toHaveAttribute('href', '#/temp/grade4');
    expect(openGrade4).toHaveTextContent('فتح الكتاب');

    // Grade 6 card is still there, unchanged.
    const grade6Card = within(cards[0]);
    expect(grade6Card.getByText('36 صفحة — من الصفحة المطبوعة 8 إلى 43')).toBeInTheDocument();
    expect(
      grade6Card.getByRole('link', { name: `فتح كتاب ${GRADE6_BOOK_TITLE}` }),
    ).toHaveAttribute('href', '#/temp/grade6');
  });

  it('2. Opening the book from its card shows PDF page 1 with the original page image', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /فتح تبويب TEMP المؤقت/ }));
    await user.click(screen.getByRole('link', { name: `فتح كتاب ${GRADE4_TITLE}` }));
    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade4'));

    // The reader's own heading (the site header carries another h1).
    expect(screen.getByRole('heading', { level: 1, name: GRADE4_TITLE })).toBeInTheDocument();

    // First page: its own image file from the Grade 4 folder, printed page 8.
    expectGrade4Page(1);
    expect(shownPage().getAttribute('src')).toMatch(/temp\/grade4\/page-01\.jpg$/);
    expect(shownPage().getAttribute('src')).toBe(grade4PageImageSrc(1));

    // Previous is disabled on the first page; Next is enabled.
    expect(previousButton()).toBeDisabled();
    expect(nextButton()).not.toBeDisabled();
  });

  it('3. Next/Previous move one page at a time and keep the hash in sync', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/temp/grade4';
    render(<App />);

    await user.click(nextButton());
    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade4/2'));
    expectGrade4Page(2);
    expect(previousButton()).not.toBeDisabled();

    await user.click(nextButton());
    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade4/3'));
    expectGrade4Page(3);

    await user.click(previousButton());
    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade4/2'));
    expectGrade4Page(2);

    await user.click(previousButton());
    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade4/1'));
    expectGrade4Page(1);
    expect(previousButton()).toBeDisabled();
  });

  it('4. Keyboard arrows flip pages (ArrowLeft advances in RTL); Home/End jump to the ends', () => {
    window.location.hash = '#/temp/grade4/5';
    render(<App />);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expectGrade4Page(6);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expectGrade4Page(5);

    fireEvent.keyDown(window, { key: 'End' });
    expectGrade4Page(21);

    fireEvent.keyDown(window, { key: 'Home' });
    expectGrade4Page(1);

    // Arrow keys pressed while typing in the jump box must not flip the page.
    fireEvent.keyDown(screen.getByLabelText('انتقل إلى صفحة:'), { key: 'ArrowLeft' });
    expectGrade4Page(1);
  });

  it('5. Direct page jump goes to the entered page and is limited to pages 1–21', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/temp/grade4';
    render(<App />);

    const input = screen.getByLabelText('انتقل إلى صفحة:');
    await user.clear(input);
    await user.type(input, '14');
    await user.click(screen.getByRole('button', { name: 'الانتقال إلى الصفحة المدخلة' }));

    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade4/14'));
    expectGrade4Page(14);
    expect(input).toHaveValue(14);

    // The box advertises this book's range, so the browser itself refuses 22, 29, 36…
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '21');
    expect(screen.getByText('من 1 إلى 21')).toBeInTheDocument();

    // Even if that check is bypassed, a number past the end lands on the last
    // real page (21) — never on a page that does not exist.
    fireEvent.change(input, { target: { value: '29' } });
    fireEvent.submit(input.closest('form') as HTMLFormElement);
    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade4/21'));
    expectGrade4Page(21);
    expect(input).toHaveValue(21);
  });

  it('6. Next reaches every page in PDF order and stops at the last page (21)', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/temp/grade4';
    render(<App />);

    const visited: (string | null)[] = [];
    for (let pdfPage = 1; pdfPage <= SOURCE_PAGE_COUNT; pdfPage += 1) {
      expectGrade4Page(pdfPage);
      visited.push(shownPage().getAttribute('src'));
      if (pdfPage < SOURCE_PAGE_COUNT) {
        await user.click(nextButton());
        await waitFor(() => expect(window.location.hash).toBe(`#/temp/grade4/${pdfPage + 1}`));
      }
    }

    // 21 different images, shown in the inventory (= PDF) order.
    expect(visited).toEqual(GRADE4_PAGE_INVENTORY.map((entry) => entry.imageSrc));
    expect(new Set(visited).size).toBe(SOURCE_PAGE_COUNT);

    // Last page: Next is disabled and neither the button nor the keyboard goes further.
    expect(nextButton()).toBeDisabled();
    expect(previousButton()).not.toBeDisabled();
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expectGrade4Page(21);
    expect(window.location.hash).toBe('#/temp/grade4/21');
  });

  it('7. Page count, inventory, and order match the source PDF (21 pages, printed 8–28)', () => {
    expect(GRADE4_BOOK_TITLE).toBe(GRADE4_TITLE);
    expect(GRADE4_PAGE_COUNT).toBe(SOURCE_PAGE_COUNT);
    expect(GRADE4_PRINTED_PAGES).toEqual(SOURCE_PRINTED_PAGES);
    expect(GRADE4_PAGE_INVENTORY).toHaveLength(SOURCE_PAGE_COUNT);

    GRADE4_PAGE_INVENTORY.forEach((entry, index) => {
      const pdfPage = index + 1;
      expect(entry.pdfPage).toBe(pdfPage);
      expect(entry.printedPage).toBe(SOURCE_PRINTED_PAGES[index]);
      expect(entry.imageFile).toBe(fileName(pdfPage));
      expect(entry.imageSrc).toBe(grade4Src(pdfPage));
      expect(grade4PrintedPageNumber(pdfPage)).toBe(SOURCE_PRINTED_PAGES[index]);
      expect(grade4PageImageSrc(pdfPage)).toBe(grade4Src(pdfPage));
    });

    expect(GRADE4_PAGE_INVENTORY[0].printedPage).toBe(8);
    expect(GRADE4_PAGE_INVENTORY[20].printedPage).toBe(28);

    // Outside the book there is no printed number to report.
    expect(grade4PrintedPageNumber(0)).toBeNull();
    expect(grade4PrintedPageNumber(22)).toBeNull();
  });

  it('8. Every inventory page has its own image file — none missing, extra, or duplicated', () => {
    // Exactly the 21 inventory files, in the Grade 4 folder.
    expect(readdirSync(GRADE4_IMAGE_DIR).sort()).toEqual(
      GRADE4_PAGE_INVENTORY.map((entry) => entry.imageFile),
    );

    const digests = GRADE4_PAGE_INVENTORY.map((entry) => {
      const file = readFileSync(`${GRADE4_IMAGE_DIR}/${entry.imageFile}`);
      // A complete JPEG (start and end markers) of a full page rendered at 200 DPI.
      expect(file.subarray(0, 3)).toEqual(Buffer.from([0xff, 0xd8, 0xff]));
      expect(file.subarray(-2)).toEqual(Buffer.from([0xff, 0xd9]));
      expect(jpegSize(file)).toEqual({ width: 1615, height: 2205 });
      return createHash('sha256').update(file).digest('hex');
    });
    // No two pages share the same image.
    expect(new Set(digests).size).toBe(SOURCE_PAGE_COUNT);

    // The Grade 6 folder still holds exactly its own 36 pages.
    expect(readdirSync(GRADE6_IMAGE_DIR).sort()).toEqual(
      Array.from({ length: 36 }, (_, index) => fileName(index + 1)),
    );
  });

  it('9. The inventory doc lists the same pages, row for row', () => {
    const doc = readFileSync(INVENTORY_DOC, 'utf8');
    const rows = [...doc.matchAll(/^\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*`(page-\d+\.jpg)`\s*\|/gm)].map(
      ([, pdfPage, printedPage, imageFile]) => ({
        pdfPage: Number(pdfPage),
        printedPage: Number(printedPage),
        imageFile,
      }),
    );

    expect(rows).toEqual(
      GRADE4_PAGE_INVENTORY.map(({ pdfPage, printedPage, imageFile }) => ({
        pdfPage,
        printedPage,
        imageFile,
      })),
    );
  });

  it('10. Direct routes #/temp/grade4 and #/temp/grade4/:page open the right page', async () => {
    expect(parseHash('#/temp/grade4')).toEqual({ view: 'temp-grade4', tempPage: 1 });
    expect(parseHash('#/temp/grade4/7')).toEqual({ view: 'temp-grade4', tempPage: 7 });
    expect(parseHash('#/temp/grade4/21')).toEqual({ view: 'temp-grade4', tempPage: 21 });
    expect(parseHash('#/temp/grade4/abc')).toEqual({ view: 'temp-grade4', tempPage: 1 });

    // Deep link to a page in the middle of the book.
    window.location.hash = '#/temp/grade4/7';
    const middle = render(<App />);
    expectGrade4Page(7);

    // The address bar changes while the reader is open (Back/Forward, typed URL).
    window.location.hash = '#/temp/grade4/9';
    await waitFor(() => expectGrade4Page(9));
    middle.unmount();

    // A page number past the end opens the last page; below 1 opens the first.
    window.location.hash = '#/temp/grade4/29';
    const pastEnd = render(<App />);
    expectGrade4Page(21);
    expect(nextButton()).toBeDisabled();
    pastEnd.unmount();

    window.location.hash = '#/temp/grade4/0';
    render(<App />);
    expectGrade4Page(1);
    expect(previousButton()).toBeDisabled();
  });

  it('11. Neighbouring pages are preloaded, and never a page outside the book', () => {
    const preloaded: string[] = [];
    class RecordingImage {
      set src(value: string) {
        preloaded.push(value);
      }
    }
    vi.stubGlobal('Image', RecordingImage);

    window.location.hash = '#/temp/grade4/5';
    const middle = render(<App />);
    expect(preloaded).toEqual([grade4Src(4), grade4Src(6)]);
    middle.unmount();

    preloaded.length = 0;
    window.location.hash = '#/temp/grade4/1';
    const first = render(<App />);
    expect(preloaded).toEqual([grade4Src(2)]);
    first.unmount();

    preloaded.length = 0;
    window.location.hash = '#/temp/grade4/21';
    render(<App />);
    expect(preloaded).toEqual([grade4Src(20)]);
  });

  it('12. The reader shows a printed page number only when the book knows it', async () => {
    const user = userEvent.setup();
    // A made-up book whose second page has no known printed number.
    const book: TempReaderBook = {
      title: 'كتاب تجريبي',
      pageCount: 3,
      imageSrc: (page) => `/sample/page-${page}.jpg`,
      printedPage: (page) => (page === 2 ? null : 40 + page),
    };
    render(
      <Grade6BookReader initialPage={1} onPageChange={() => {}} onBackToTemp={() => {}} book={book} />,
    );

    expect(screen.getByText('صفحة 1 من 3 — الصفحة المطبوعة 41')).toBeInTheDocument();
    expect(shownPage()).toHaveAttribute('alt', 'صفحة 41 من كتاب كتاب تجريبي (الصفحة 1 من 3)');

    await user.click(nextButton());

    // PDF page number only — no printed number is invented.
    expect(screen.getByText('صفحة 2 من 3')).toBeInTheDocument();
    expect(screen.queryByText(/الصفحة المطبوعة/)).not.toBeInTheDocument();
    expect(shownPage()).toHaveAttribute('src', '/sample/page-2.jpg');
    expect(shownPage()).toHaveAttribute('alt', 'كتاب كتاب تجريبي (الصفحة 2 من 3)');
  });

  it('13. The Grade 6 book and its routes are unaffected', async () => {
    const user = userEvent.setup();

    // Grade 6 routes parse exactly as before; unknown TEMP paths still open the landing.
    expect(parseHash('#/temp')).toEqual({ view: 'temp' });
    expect(parseHash('#/temp/grade6')).toEqual({ view: 'temp-grade6', tempPage: 1 });
    expect(parseHash('#/temp/grade6/12')).toEqual({ view: 'temp-grade6', tempPage: 12 });
    expect(parseHash('#/temp/grade6/abc')).toEqual({ view: 'temp-grade6', tempPage: 1 });
    expect(parseHash('#/temp/grade5')).toEqual({ view: 'temp' });

    // Grade 6 data: still 36 pages, printed 8–43, images in its own folder.
    expect(GRADE6_PAGE_COUNT).toBe(36);
    expect(GRADE6_PAGE_INVENTORY).toHaveLength(36);
    expect(GRADE6_PAGE_INVENTORY[0].printedPage).toBe(8);
    expect(GRADE6_PAGE_INVENTORY[35].printedPage).toBe(43);
    GRADE6_PAGE_INVENTORY.forEach((entry, index) => {
      expect(entry.imageSrc).toBe(`${import.meta.env.BASE_URL}temp/grade6/${fileName(index + 1)}`);
    });

    // Grade 6 reader: a page that Grade 4 does not have (30 of 36), with Grade 6 text and image.
    window.location.hash = '#/temp/grade6/30';
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: GRADE6_BOOK_TITLE })).toBeInTheDocument();
    expect(shownPage()).toHaveAttribute(
      'src',
      `${import.meta.env.BASE_URL}temp/grade6/page-30.jpg`,
    );
    expect(shownPage()).toHaveAttribute(
      'alt',
      'صفحة 37 من كتاب رياضيات الصف السادس (الصفحة 30 من 36)',
    );
    expect(screen.getByText('صفحة 30 من 36 — الصفحة المطبوعة 37')).toBeInTheDocument();
    expect(screen.getByLabelText('انتقل إلى صفحة:')).toHaveAttribute('max', '36');

    // Flipping pages in Grade 6 stays on Grade 6 routes.
    await user.click(nextButton());
    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade6/31'));

    // Switching books by URL: each book keeps its own pages and page count.
    window.location.hash = '#/temp/grade4/21';
    await waitFor(() => expectGrade4Page(21));
    window.location.hash = '#/temp/grade6/36';
    await waitFor(() =>
      expect(shownPage()).toHaveAttribute(
        'alt',
        'صفحة 43 من كتاب رياضيات الصف السادس (الصفحة 36 من 36)',
      ),
    );
    expect(shownPage()).toHaveAttribute(
      'src',
      `${import.meta.env.BASE_URL}temp/grade6/page-36.jpg`,
    );
    expect(nextButton()).toBeDisabled();
  });

  it('14. Grade 8 curriculum is untouched: still 3 units, home shows no TEMP book', () => {
    expect(curriculum).toHaveLength(3);
    expect(curriculum.map((unit) => unit.id)).toEqual(['unit-1', 'unit-2', 'unit-3']);

    render(<App />);
    // Home still renders the Grade 8 unit catalog and neither TEMP book.
    expect(screen.getAllByRole('link', { name: /دخول إلى الوحدة/ })).toHaveLength(3);
    expect(screen.queryByText(GRADE4_TITLE)).not.toBeInTheDocument();
    expect(screen.queryByText(GRADE6_BOOK_TITLE)).not.toBeInTheDocument();
  });
});
