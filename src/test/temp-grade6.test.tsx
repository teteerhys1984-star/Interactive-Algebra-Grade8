import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../app/App';
import { parseHash } from '../app/useHashRoute';
import { curriculum } from '../data/curriculum';
import {
  GRADE6_BOOK_TITLE,
  GRADE6_PAGE_COUNT,
  GRADE6_PAGE_INVENTORY,
  grade6PageImageSrc,
  printedPageNumber,
} from '../temp/grade6Book';

/**
 * TEMP — Grade 6 book (temporary addition) regression suite.
 *
 * Verifies the isolated TEMP tab: header entry, landing card, page-by-page
 * reader (all 36 pages reachable), hash routing, and that the Grade 8
 * curriculum is untouched.
 */

describe('TEMP tab — Grade 6 book (temporary addition)', () => {
  beforeEach(() => {
    window.location.hash = '';
    window.sessionStorage.clear();
  });

  it('1. TEMP tab appears in the header next to the existing nav actions', () => {
    render(<App />);
    const tempBtn = screen.getByRole('button', { name: /فتح تبويب TEMP المؤقت/ });
    expect(tempBtn).toBeInTheDocument();
    expect(tempBtn).toHaveTextContent('TEMP');
  });

  it('2. TEMP landing shows exactly one entry: the Grade 6 book', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /فتح تبويب TEMP المؤقت/ }));
    await waitFor(() => expect(window.location.hash).toBe('#/temp'));

    expect(screen.getByRole('heading', { name: /TEMP/ })).toBeInTheDocument();
    expect(screen.getByText(GRADE6_BOOK_TITLE)).toBeInTheDocument();
    expect(screen.getByText(/36 صفحة/)).toBeInTheDocument();

    const bookLink = screen.getByRole('link', { name: new RegExp(`فتح كتاب ${GRADE6_BOOK_TITLE}`) });
    expect(bookLink).toHaveAttribute('href', '#/temp/grade6');

    // No Grade 8 lesson content leaks into the TEMP landing.
    expect(screen.queryByText(/الوحدة الأولى/)).not.toBeInTheDocument();
  });

  it('3. Opening the book shows page 1 with the original page image and indicator', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /فتح تبويب TEMP المؤقت/ }));
    await user.click(screen.getByRole('link', { name: new RegExp(`فتح كتاب ${GRADE6_BOOK_TITLE}`) }));

    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade6'));

    const img = screen.getByAltText(/صفحة 8 من كتاب رياضيات الصف السادس/);
    expect(img).toHaveAttribute('src', grade6PageImageSrc(1));
    expect(screen.getByText('صفحة 1 من 36 — الصفحة المطبوعة 8')).toBeInTheDocument();

    // Previous is disabled on the first page; Next is enabled.
    expect(screen.getByRole('button', { name: 'الصفحة السابقة' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'الصفحة التالية' })).not.toBeDisabled();
  });

  it('4. Next/Previous navigate page by page and keep the hash in sync', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/temp/grade6';
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'الصفحة التالية' }));
    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade6/2'));
    expect(screen.getByAltText(/الصفحة 2 من 36/)).toHaveAttribute('src', grade6PageImageSrc(2));
    expect(screen.getByText('صفحة 2 من 36 — الصفحة المطبوعة 9')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'الصفحة السابقة' })).not.toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'الصفحة السابقة' }));
    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade6/1'));
    expect(screen.getByAltText(/الصفحة 1 من 36/)).toHaveAttribute('src', grade6PageImageSrc(1));
  });

  it('5. Deep link to the last page (36) renders it and disables Next', () => {
    window.location.hash = '#/temp/grade6/36';
    render(<App />);

    expect(screen.getByAltText(/الصفحة 36 من 36/)).toHaveAttribute('src', grade6PageImageSrc(36));
    expect(screen.getByText('صفحة 36 من 36 — الصفحة المطبوعة 43')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'الصفحة التالية' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'الصفحة السابقة' })).not.toBeDisabled();
  });

  it('6. Direct page jump form navigates to the entered page', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/temp/grade6';
    render(<App />);

    const input = screen.getByLabelText('انتقل إلى صفحة:');
    await user.clear(input);
    await user.type(input, '17');
    await user.click(screen.getByRole('button', { name: 'الانتقال إلى الصفحة المدخلة' }));

    await waitFor(() => expect(window.location.hash).toBe('#/temp/grade6/17'));
    expect(screen.getByAltText(/الصفحة 17 من 36/)).toHaveAttribute('src', grade6PageImageSrc(17));
    expect(screen.getByText('صفحة 17 من 36 — الصفحة المطبوعة 24')).toBeInTheDocument();
  });

  it('7. Keyboard arrows flip pages (ArrowLeft advances in RTL)', () => {
    window.location.hash = '#/temp/grade6/5';
    render(<App />);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByAltText(/الصفحة 6 من 36/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByAltText(/الصفحة 5 من 36/)).toBeInTheDocument();
  });

  it('8. Back link returns to the TEMP landing', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/temp/grade6/3';
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'العودة إلى TEMP' }));
    await waitFor(() => expect(window.location.hash).toBe('#/temp'));
    expect(screen.getByRole('heading', { name: /TEMP/ })).toBeInTheDocument();
  });

  it('9. Page inventory covers PDF pages 1–36 in order with printed numbers 8–43', () => {
    expect(GRADE6_PAGE_COUNT).toBe(36);
    expect(GRADE6_PAGE_INVENTORY).toHaveLength(36);

    GRADE6_PAGE_INVENTORY.forEach((entry, index) => {
      expect(entry.pdfPage).toBe(index + 1);
      expect(entry.printedPage).toBe(printedPageNumber(index + 1));
      expect(entry.printedPage).toBe(index + 8);
      expect(entry.imageSrc).toBe(
        `${import.meta.env.BASE_URL}temp/grade6/page-${String(index + 1).padStart(2, '0')}.jpg`,
      );
    });

    expect(GRADE6_PAGE_INVENTORY[0].printedPage).toBe(8);
    expect(GRADE6_PAGE_INVENTORY[35].printedPage).toBe(43);
  });

  it('10. Hash routes for TEMP parse correctly and unknown TEMP paths fall back to the landing', () => {
    expect(parseHash('#/temp')).toEqual({ view: 'temp' });
    expect(parseHash('#/temp/grade6')).toEqual({ view: 'temp-grade6', tempPage: 1 });
    expect(parseHash('#/temp/grade6/12')).toEqual({ view: 'temp-grade6', tempPage: 12 });
    expect(parseHash('#/temp/grade6/abc')).toEqual({ view: 'temp-grade6', tempPage: 1 });
    expect(parseHash('#/temp/unknown')).toEqual({ view: 'temp' });
  });

  it('11. Grade 8 curriculum is untouched: still 3 units, home shows only unit cards', () => {
    expect(curriculum).toHaveLength(3);
    expect(curriculum.map((u) => u.id)).toEqual(['unit-1', 'unit-2', 'unit-3']);

    render(<App />);
    // Home still renders the Grade 8 unit catalog and no TEMP book card.
    const unitLinks = screen.getAllByRole('link', { name: /دخول إلى الوحدة/ });
    expect(unitLinks).toHaveLength(3);
    expect(screen.queryByText(GRADE6_BOOK_TITLE)).not.toBeInTheDocument();
  });
});
