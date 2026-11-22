import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../app/App';

describe('Lesson state isolation, hash sync and progress wording', () => {
  beforeEach(() => {
    window.location.hash = '';
    window.sessionStorage.clear();
  });

  /* --------------------- Hash ↔ step synchronization -------------------- */
  describe('Hash ↔ step synchronization', () => {
    it('updates the URL hash on next and previous', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2';
      render(<App />);
      expect(screen.getByText(/الخطوة 1 من 8/)).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText('الخطوة التالية'));
      expect(screen.getByText(/الخطوة 2 من 8/)).toBeInTheDocument();
      expect(window.location.hash).toBe('#/unit/unit-1/lesson/lesson-2/2');

      fireEvent.click(screen.getByLabelText('الخطوة السابقة'));
      expect(screen.getByText(/الخطوة 1 من 8/)).toBeInTheDocument();
      expect(window.location.hash).toBe('#/unit/unit-1/lesson/lesson-2/1');
    });

    it('updates the URL hash when a step is picked from the outline', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-3';
      const { container } = render(<App />);
      const items = container.querySelectorAll('.lesson-sidebar .outline-list .outline-item-btn');
      expect(items.length).toBeGreaterThanOrEqual(10);
      fireEvent.click(items[4] as HTMLElement);
      expect(screen.getByText(/الخطوة 5 من 10/)).toBeInTheDocument();
      expect(window.location.hash).toBe('#/unit/unit-1/lesson/lesson-3/5');
    });

    it('restores the step when the hash changes (browser back/forward path)', async () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2/3';
      render(<App />);
      expect(screen.getByText(/الخطوة 3 من 8/)).toBeInTheDocument();

      // Simulate the browser Back button: only the URL hash changes.
      window.location.hash = '#/unit/unit-1/lesson/lesson-2/1';
      await waitFor(() => expect(screen.getByText(/الخطوة 1 من 8/)).toBeInTheDocument());

      // And Forward again.
      window.location.hash = '#/unit/unit-1/lesson/lesson-2/3';
      await waitFor(() => expect(screen.getByText(/الخطوة 3 من 8/)).toBeInTheDocument());
    });

    it('restores the previous step on a real history.back()', async () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2/1';
      render(<App />);
      fireEvent.click(screen.getByLabelText('الخطوة التالية'));
      fireEvent.click(screen.getByLabelText('الخطوة التالية'));
      await waitFor(() => expect(window.location.hash).toBe('#/unit/unit-1/lesson/lesson-2/3'));
      expect(screen.getByText(/الخطوة 3 من 8/)).toBeInTheDocument();

      window.history.back();
      await waitFor(() => expect(screen.getByText(/الخطوة 2 من 8/)).toBeInTheDocument());
      expect(window.location.hash).toBe('#/unit/unit-1/lesson/lesson-2/2');
    });

    it('constrains the invalid step index /0 to the first step', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2/0';
      render(<App />);
      expect(screen.getByText(/الخطوة 1 من 8/)).toBeInTheDocument();
    });

    it('constrains an oversized step index /99 to the last step', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2/99';
      render(<App />);
      expect(screen.getByText(/الخطوة 8 من 8/)).toBeInTheDocument();
    });

    it('falls back to the first step for a non-numeric index', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2/abc';
      render(<App />);
      expect(screen.getByText(/الخطوة 1 من 8/)).toBeInTheDocument();
    });

    it('preserves the existing step-less and legacy deep links', () => {
      window.location.hash = '#/lesson/lesson-2/4';
      render(<App />);
      expect(screen.getByText(/الخطوة 4 من 8/)).toBeInTheDocument();
    });
  });

  /* ------------------------- Lesson state isolation ---------------------- */
  describe('Lesson state isolation (key per lesson)', () => {
    it('starts viewed-step progress fresh when switching lessons', async () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2/8';
      render(<App />);
      expect(screen.getByText(/الخطوة 8 من 8/)).toBeInTheDocument();

      // Jump directly to another lesson — progress must not carry over.
      window.location.hash = '#/unit/unit-1/lesson/lesson-3';
      await waitFor(() => expect(screen.getByText(/الخطوة 1 من 10/)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByText(/تمت مشاهدته: 1 من 10/)).toBeInTheDocument());
      expect(screen.queryByText(/تمت مشاهدته: 2 من 10/)).not.toBeInTheDocument();
    });

    it('does not stay in the previous lesson assessment when the step index matches', async () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2/8';
      render(<App />);
      fireEvent.click(screen.getByLabelText('الانتقال إلى الاختبار الشامل'));
      expect(screen.getAllByText(/الاختبار الشامل/).length).toBeGreaterThan(0);

      // Another lesson at the SAME step index must start fresh at its step view
      // instead of leaking the assessment flag.
      window.location.hash = '#/unit/unit-1/lesson/lesson-3/8';
      await waitFor(() => expect(screen.getByText(/الخطوة 8 من 10/)).toBeInTheDocument());
    });
  });

  /*---------------------------- Progress wording -------------------------- */
  describe('Progress wording', () => {
    it('uses viewed-step wording instead of completion wording', () => {
      window.location.hash = '#/unit/unit-1/lesson/lesson-2';
      render(<App />);
      expect(screen.getByText('نسبة المشاهدة')).toBeInTheDocument();
      expect(screen.getByText(/تمت مشاهدته: 1 من 8/)).toBeInTheDocument();
      expect(screen.queryByText(/مكتمل:/)).not.toBeInTheDocument();
      expect(screen.queryByText('نسبة الإنجاز')).not.toBeInTheDocument();
    });
  });
});
