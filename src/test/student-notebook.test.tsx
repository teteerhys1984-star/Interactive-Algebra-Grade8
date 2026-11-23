import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFile, readdir } from 'node:fs/promises';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../app/App';
import { lesson02Data } from '../data/unit1/lesson02';
import { lesson03Data } from '../data/unit1/lesson03';
import { lesson04Data, lesson04ExerciseGroups } from '../data/unit1/lesson04';

/**
 * تكامل «دفتر الطالب» مع واجهة الدرس:
 *  - يظهر في دروس الوحدة الأولى الأربعة (lesson-1 .. lesson-4) ودروس الوحدة
 *    الثانية الأربعة الأولى (u2-lesson-1 .. u2-lesson-4).
 *  - لا يظهر إطلاقًا في الإحماءات ولا في درس تمارين الوحدة الثانية
 *    (u2-lesson-5) ولا في الوحدة الثالثة.
 *  - الانتقالات بين step / assessment / notebook / completed حصرية وصحيحة.
 *  - الدفتر ليس خطوة: لا يغير نسبة المشاهدة ولا عداد الخطوات.
 *
 * ملاحظة صريحة: اختبار زر الطباعة أدناه (استدعاء window.print) اختبار مساند
 * فقط — الدليل على عزل الطباعة هو الفحص البصري بمحاكاة media=print في متصفح
 * حقيقي، ولا يمكن إثباته داخل jsdom.
 */

const clickOutlineNotebook = () => {
  const label = screen.getByText('دفتر الطالب');
  const button = label.closest('button');
  expect(button, 'notebook outline button').not.toBeNull();
  fireEvent.click(button as HTMLElement);
};

/**
 * نص شارة الخطوة في رأس الخطوة: «الخطوة» في الدروس النظرية، و«السؤال» في
 * الدروس ذات المحطات المجمّعة (مثل u2-lesson-4 التي كل خطواتها محطات نشاط).
 */
const stepBadge = (lessonId: string, step: number, totalSteps: number) => {
  const noun = lessonId === 'u2-lesson-4' ? 'السؤال' : 'الخطوة';
  return new RegExp(`${noun} ${step} من ${totalSteps}`);
};

describe('Student notebook — availability', () => {
  beforeEach(() => {
    window.location.hash = '';
    window.sessionStorage.clear();
    document.body.classList.remove('student-notebook-open');
  });

  it('appears for unit-1/lesson-1 and opens the notebook view', () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-1';
    render(<App />);
    expect(screen.getByText(/الخطوة 1 من 6/)).toBeInTheDocument();

    clickOutlineNotebook();

    expect(screen.getByTestId('student-notebook')).toBeInTheDocument();
    // الأقسام السبعة للدفتر النظري.
    expect(screen.getByRole('heading', { name: 'التعريفات والمصطلحات' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'القواعد والخواص' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'الصيغ والعلاقات' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'خطوات الحل المنهجية' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'أمثلة نموذجية محلولة' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'تنبيهات وأخطاء شائعة' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'تمارين مطلوبة للتدوين' })).toBeInTheDocument();
    // navigator الخطوات يختفي أثناء الدفتر (حالات العرض حصرية).
    expect(screen.queryByLabelText('الخطوة التالية')).not.toBeInTheDocument();
  });

  it('appears for unit-1/lesson-2 after الاختبار الشامل and opens the notebook view', () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-2';
    const { container } = render(<App />);
    expect(screen.getByText(/الخطوة 1 من 8/)).toBeInTheDocument();

    // التحقق من موضع زر الدفتر في نهاية الفهرس بعد «الاختبار الشامل».
    const outlineButtons = Array.from(
      container.querySelectorAll('.lesson-sidebar .outline-list .outline-item-btn'),
    );
    const assessmentIndex = outlineButtons.findIndex((b) => b.textContent?.includes('الاختبار الشامل'));
    const notebookIndex = outlineButtons.findIndex((b) => b.textContent?.includes('دفتر الطالب'));
    expect(assessmentIndex).toBeGreaterThan(-1);
    expect(notebookIndex).toBe(outlineButtons.length - 1);
    expect(notebookIndex).toBeGreaterThan(assessmentIndex);

    clickOutlineNotebook();

    const notebook = screen.getByTestId('student-notebook');
    expect(notebook).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /دفتر الطالب — الضرب/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'التعريفات والمصطلحات' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'القواعد والخواص' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'الصيغ والعلاقات' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'خطوات الحل المنهجية' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'أمثلة نموذجية محلولة' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'تنبيهات وأخطاء شائعة' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'تمارين مطلوبة للتدوين' })).toBeInTheDocument();
    expect(screen.queryByLabelText('الخطوة التالية')).not.toBeInTheDocument();
    expect(document.body.classList.contains('student-notebook-open')).toBe(true);
  });

  it('appears for unit-1/lesson-3 after الاختبار الشامل and opens the notebook view', () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-3';
    const { container } = render(<App />);
    expect(screen.getByText(/الخطوة 1 من 10/)).toBeInTheDocument();

    const outlineButtons = Array.from(
      container.querySelectorAll('.lesson-sidebar .outline-list .outline-item-btn'),
    );
    const assessmentIndex = outlineButtons.findIndex((b) => b.textContent?.includes('الاختبار الشامل'));
    const notebookIndex = outlineButtons.findIndex((b) => b.textContent?.includes('دفتر الطالب'));
    expect(assessmentIndex).toBeGreaterThan(-1);
    expect(notebookIndex).toBe(outlineButtons.length - 1);
    expect(notebookIndex).toBeGreaterThan(assessmentIndex);

    clickOutlineNotebook();

    const notebook = screen.getByTestId('student-notebook');
    expect(notebook).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /دفتر الطالب — القسمة/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'التعريفات والمصطلحات' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'القواعد والخواص' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'الصيغ والعلاقات' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'خطوات الحل المنهجية' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'أمثلة نموذجية محلولة' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'تنبيهات وأخطاء شائعة' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'تمارين مطلوبة للتدوين' })).toBeInTheDocument();
    expect(screen.queryByLabelText('الخطوة التالية')).not.toBeInTheDocument();
    expect(document.body.classList.contains('student-notebook-open')).toBe(true);
  });

  it('appears for unit-1/lesson-4 with the derived stations register', () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-4';
    render(<App />);

    clickOutlineNotebook();

    const notebook = screen.getByTestId('student-notebook');
    expect(notebook).toBeInTheDocument();
    for (const group of lesson04ExerciseGroups) {
      expect(
        screen.getByRole('heading', { name: group.title }),
        `station heading ${group.id}`,
      ).toBeInTheDocument();
    }
    // بلا أمثلة محلولة وبلا كشف لحلول التمارين.
    expect(screen.queryByRole('heading', { name: 'أمثلة نموذجية محلولة' })).not.toBeInTheDocument();
    expect(notebook.textContent).not.toContain('2535');
    expect(notebook.textContent).not.toContain('النتيجة النهائية');
  });

  it('appears for unit-2/u2-lesson-1 after الاختبار الشامل and opens the notebook view', () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-1';
    const { container } = render(<App />);
    expect(screen.getByText(/الخطوة 1 من 16/)).toBeInTheDocument();

    const outlineButtons = Array.from(
      container.querySelectorAll('.lesson-sidebar .outline-list .outline-item-btn'),
    );
    const assessmentIndex = outlineButtons.findIndex((b) => b.textContent?.includes('الاختبار الشامل'));
    const notebookIndex = outlineButtons.findIndex((b) => b.textContent?.includes('دفتر الطالب'));
    expect(assessmentIndex).toBeGreaterThan(-1);
    expect(notebookIndex).toBe(outlineButtons.length - 1);
    expect(notebookIndex).toBeGreaterThan(assessmentIndex);

    clickOutlineNotebook();

    expect(screen.getByTestId('student-notebook')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /دفتر الطالب — قوى العدد 10/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'التعريفات والمصطلحات' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'القواعد والخواص' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'الصيغ والعلاقات' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'خطوات الحل المنهجية' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'أمثلة نموذجية محلولة' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'تنبيهات وأخطاء شائعة' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'تمارين مطلوبة للتدوين' })).toBeInTheDocument();
    expect(screen.queryByLabelText('الخطوة التالية')).not.toBeInTheDocument();
    expect(document.body.classList.contains('student-notebook-open')).toBe(true);
  });

  it.each([
    ['u2-lesson-2', 11, /دفتر الطالب — قواعد قوى العدد 10/],
    ['u2-lesson-3', 17, /دفتر الطالب — قوى صحيحة لعدد نسبي/],
    ['u2-lesson-4', 15, /دفتر الطالب — الجذور التربيعية/],
  ])(
    'appears for unit-2/%s as the last outline item (no final assessment)',
    (lessonId, totalSteps, titlePattern) => {
      window.location.hash = `#/unit/unit-2/lesson/${lessonId}`;
      const { container } = render(<App />);
      expect(screen.getByText(stepBadge(lessonId, 1, totalSteps))).toBeInTheDocument();

      const outlineButtons = Array.from(
        container.querySelectorAll('.lesson-sidebar .outline-list .outline-item-btn'),
      );
      const notebookIndex = outlineButtons.findIndex((b) => b.textContent?.includes('دفتر الطالب'));
      expect(notebookIndex).toBe(outlineButtons.length - 1);
      // لا يوجد اختبار شامل في هذه الدروس، فالدفتر يلي آخر خطوة مباشرة.
      expect(
        outlineButtons.some((b) => b.textContent?.includes('الاختبار الشامل')),
      ).toBe(false);

      clickOutlineNotebook();

      expect(screen.getByTestId('student-notebook')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: titlePattern })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'التعريفات والمصطلحات' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'القواعد والخواص' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'الصيغ والعلاقات' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'خطوات الحل المنهجية' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'أمثلة نموذجية محلولة' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'تنبيهات وأخطاء شائعة' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'تمارين مطلوبة للتدوين' })).toBeInTheDocument();
      expect(screen.queryByLabelText('الخطوة التالية')).not.toBeInTheDocument();
      expect(document.body.classList.contains('student-notebook-open')).toBe(true);
    },
  );

  it.each([
    ['#/unit/unit-1/warmup', 'unit-1 warmup'],
    ['#/unit/unit-2/warmup', 'unit-2 warmup'],
    ['#/unit/unit-2/lesson/u2-lesson-5', 'unit-2 lesson-5 (unit exercises)'],
    ['#/unit/unit-3/warmup', 'unit-3 warmup'],
    ['#/unit/unit-3/lesson/u3-lesson-1', 'unit-3 lesson-1'],
    ['#/unit/unit-3/lesson/u3-lesson-6', 'unit-3 lesson-6'],
  ])('does NOT appear in %s (%s)', (hash) => {
    window.location.hash = hash;
    render(<App />);
    expect(screen.queryByText('دفتر الطالب')).not.toBeInTheDocument();
    expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
  });
});

describe('Student notebook — view-state transitions', () => {
  beforeEach(() => {
    window.location.hash = '';
    window.sessionStorage.clear();
    document.body.classList.remove('student-notebook-open');
  });

  it('returns to the last viewed step via the back button, without touching progress', () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-1';
    render(<App />);
    fireEvent.click(screen.getByLabelText('الخطوة التالية'));
    expect(screen.getByText(/الخطوة 2 من 6/)).toBeInTheDocument();

    clickOutlineNotebook();
    expect(screen.getByTestId('student-notebook')).toBeInTheDocument();
    // الدفتر ليس خطوة: نسبة المشاهدة تبقى 2 من 6.
    expect(screen.getByText('تمت مشاهدته: 2 من 6')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('العودة إلى الدرس'));
    expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
    expect(screen.getByText(/الخطوة 2 من 6/)).toBeInTheDocument();
    expect(screen.getByText('تمت مشاهدته: 2 من 6')).toBeInTheDocument();
  });

  it.each([
    ['lesson-2', lesson02Data.steps.length, 3],
    ['lesson-3', lesson03Data.steps.length, 4],
  ])(
    'preserves step and progress in %s and transitions assessment → notebook → step with hash sync',
    (lessonId, totalSteps, targetStep) => {
      window.location.hash = `#/unit/unit-1/lesson/${lessonId}`;
      render(<App />);
      for (let i = 1; i < targetStep; i++) {
        fireEvent.click(screen.getByLabelText('الخطوة التالية'));
      }
      expect(screen.getByText(new RegExp(`الخطوة ${targetStep} من ${totalSteps}`))).toBeInTheDocument();
      expect(screen.getByText(`تمت مشاهدته: ${targetStep} من ${totalSteps}`)).toBeInTheDocument();

      // فتح الدفتر ثم العودة يحافظان على الخطوة ونسبة المشاهدة.
      clickOutlineNotebook();
      expect(screen.getByTestId('student-notebook')).toBeInTheDocument();
      expect(screen.getByText(`تمت مشاهدته: ${targetStep} من ${totalSteps}`)).toBeInTheDocument();
      expect(document.body.classList.contains('student-notebook-open')).toBe(true);

      fireEvent.click(screen.getByLabelText('العودة إلى الدرس'));
      expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
      expect(screen.getByText(new RegExp(`الخطوة ${targetStep} من ${totalSteps}`))).toBeInTheDocument();
      expect(screen.getByText(`تمت مشاهدته: ${targetStep} من ${totalSteps}`)).toBeInTheDocument();
      expect(document.body.classList.contains('student-notebook-open')).toBe(false);

      // الانتقال إلى الاختبار الشامل ← الدفتر ← خطوة محددة.
      const assessmentBtn = screen.getByText('الاختبار الشامل').closest('button')!;
      fireEvent.click(assessmentBtn);
      expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
      expect(document.body.classList.contains('student-notebook-open')).toBe(false);

      clickOutlineNotebook();
      expect(screen.getByTestId('student-notebook')).toBeInTheDocument();
      expect(document.body.classList.contains('student-notebook-open')).toBe(true);

      const stepButtons = document.querySelectorAll('.lesson-sidebar .outline-list .outline-item-btn');
      fireEvent.click(stepButtons[1] as HTMLElement);
      expect(screen.getByText(new RegExp(`الخطوة 2 من ${totalSteps}`))).toBeInTheDocument();
      expect(window.location.hash).toBe(`#/unit/unit-1/lesson/${lessonId}/2`);
      expect(document.body.classList.contains('student-notebook-open')).toBe(false);
    },
  );

  it('moves assessment → notebook → step exclusively in lesson-4 and re-syncs the hash', async () => {
    window.location.hash = `#/unit/unit-1/lesson/lesson-4/${lesson04Data.steps.length}`;
    render(<App />);
    expect(screen.getByText(/السؤال 47 من 47/)).toBeInTheDocument();

    // إلى الاختبار الشامل (سلوك قائم يجب أن يبقى).
    fireEvent.click(screen.getByLabelText('الانتقال إلى الاختبار الشامل'));
    expect(screen.queryByText(/السؤال 47 من 47/)).not.toBeInTheDocument();

    // من الاختبار إلى الدفتر — لا تداخل بين العرضين.
    clickOutlineNotebook();
    expect(screen.getByTestId('student-notebook')).toBeInTheDocument();

    // من الدفتر إلى خطوة محددة — يعود العرض خطوةً ويزامَن الـ hash.
    const stepButtons = document.querySelectorAll('.lesson-sidebar .outline-list .outline-item-btn');
    fireEvent.click(stepButtons[2] as HTMLElement);
    expect(screen.getByText(/السؤال 3 من 47/)).toBeInTheDocument();
    expect(window.location.hash).toBe('#/unit/unit-1/lesson/lesson-4/3');
  });

  it('resets the notebook when a URL-driven step change arrives (deep link / back-forward)', async () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-1';
    render(<App />);
    clickOutlineNotebook();
    expect(screen.getByTestId('student-notebook')).toBeInTheDocument();

    window.location.hash = '#/unit/unit-1/lesson/lesson-1/3';
    await waitFor(() => expect(screen.getByText(/الخطوة 3 من 6/)).toBeInTheDocument());
    expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
  });

  it('keeps the completion flow of lesson-1 (no assessment) intact', () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-1/6';
    render(<App />);
    fireEvent.click(screen.getByLabelText('إتمام الدرس'));
    expect(screen.getByText(/مبارك! أتممت بنجاح/)).toBeInTheDocument();
    expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
  });

  it.each(['lesson-1', 'lesson-2', 'lesson-3'])(
    'opens the notebook from the mobile drawer in %s, closing the drawer and returning to the step',
    (lessonId) => {
      window.location.hash = `#/unit/unit-1/lesson/${lessonId}/2`;
      render(<App />);

      // فتح الدرج فعليًا من زر الرأس (مسار الهاتف).
      fireEvent.click(screen.getByLabelText('فتح قائمة الدرس'));
      const drawer = document.querySelector('.mobile-drawer');
      expect(drawer, 'drawer must be open').not.toBeNull();

      // اختيار «دفتر الطالب» من داخل الدرج نفسه (لا من السايدبار).
      const drawerNotebookBtn = Array.from(drawer!.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('دفتر الطالب'),
      );
      expect(drawerNotebookBtn, 'notebook item inside the drawer').toBeDefined();
      fireEvent.click(drawerNotebookBtn as HTMLElement);

      // تحقق من حالة العرض: الدفتر ظاهر والدرج أُغلق فعليًا.
      expect(screen.getByTestId('student-notebook')).toBeInTheDocument();
      expect(document.querySelector('.mobile-drawer')).toBeNull();
      expect(document.querySelector('.mobile-drawer-overlay')).toBeNull();
      expect(document.body.classList.contains('student-notebook-open')).toBe(true);

      // العودة للدرس تعيد نفس الخطوة 2 وتزيل class الطباعة.
      fireEvent.click(screen.getByLabelText('العودة إلى الدرس'));
      expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
      expect(screen.getByText(/الخطوة 2 من/)).toBeInTheDocument();
      expect(document.body.classList.contains('student-notebook-open')).toBe(false);
    },
  );

  it('unit-2/u2-lesson-1: preserves progress and transitions assessment → notebook → step with hash sync', () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-1';
    render(<App />);
    expect(screen.getByText(/الخطوة 1 من 16/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('الخطوة التالية'));
    expect(screen.getByText(/الخطوة 2 من 16/)).toBeInTheDocument();

    clickOutlineNotebook();
    expect(screen.getByTestId('student-notebook')).toBeInTheDocument();
    // الدفتر ليس خطوة: نسبة المشاهدة تبقى 2 من 16.
    expect(screen.getByText('تمت مشاهدته: 2 من 16')).toBeInTheDocument();
    expect(document.body.classList.contains('student-notebook-open')).toBe(true);

    fireEvent.click(screen.getByLabelText('العودة إلى الدرس'));
    expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
    expect(screen.getByText(/الخطوة 2 من 16/)).toBeInTheDocument();
    expect(screen.getByText('تمت مشاهدته: 2 من 16')).toBeInTheDocument();

    // الانتقال إلى الاختبار الشامل ← الدفتر ← خطوة محددة.
    const assessmentBtn = screen.getByText('الاختبار الشامل').closest('button')!;
    fireEvent.click(assessmentBtn);
    expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
    expect(document.body.classList.contains('student-notebook-open')).toBe(false);

    clickOutlineNotebook();
    expect(screen.getByTestId('student-notebook')).toBeInTheDocument();
    expect(document.body.classList.contains('student-notebook-open')).toBe(true);

    const stepButtons = document.querySelectorAll('.lesson-sidebar .outline-list .outline-item-btn');
    fireEvent.click(stepButtons[1] as HTMLElement);
    expect(screen.getByText(/الخطوة 2 من 16/)).toBeInTheDocument();
    expect(window.location.hash).toBe('#/unit/unit-2/lesson/u2-lesson-1/2');
    expect(document.body.classList.contains('student-notebook-open')).toBe(false);
  });

  it.each([
    ['u2-lesson-2', 11],
    ['u2-lesson-3', 17],
    ['u2-lesson-4', 15],
  ])(
    'unit-2/%s: returns to the same step and keeps progress (no final assessment)',
    (lessonId, totalSteps) => {
      window.location.hash = `#/unit/unit-2/lesson/${lessonId}`;
      render(<App />);
      expect(screen.getByText(stepBadge(lessonId, 1, totalSteps))).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText('الخطوة التالية'));
      expect(screen.getByText(stepBadge(lessonId, 2, totalSteps))).toBeInTheDocument();

      clickOutlineNotebook();
      expect(screen.getByTestId('student-notebook')).toBeInTheDocument();
      expect(screen.getByText(`تمت مشاهدته: 2 من ${totalSteps}`)).toBeInTheDocument();
      expect(document.body.classList.contains('student-notebook-open')).toBe(true);

      fireEvent.click(screen.getByLabelText('العودة إلى الدرس'));
      expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
      expect(screen.getByText(stepBadge(lessonId, 2, totalSteps))).toBeInTheDocument();
      expect(screen.getByText(`تمت مشاهدته: 2 من ${totalSteps}`)).toBeInTheDocument();
      expect(document.body.classList.contains('student-notebook-open')).toBe(false);
    },
  );

  it('unit-2/u2-lesson-3: opens from the mobile drawer, closes the drawer and returns to the step', () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-3/2';
    render(<App />);

    fireEvent.click(screen.getByLabelText('فتح قائمة الدرس'));
    const drawer = document.querySelector('.mobile-drawer');
    expect(drawer, 'drawer must be open').not.toBeNull();

    const drawerNotebookBtn = Array.from(drawer!.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('دفتر الطالب'),
    );
    expect(drawerNotebookBtn, 'notebook item inside the drawer').toBeDefined();
    fireEvent.click(drawerNotebookBtn as HTMLElement);

    expect(screen.getByTestId('student-notebook')).toBeInTheDocument();
    expect(document.querySelector('.mobile-drawer')).toBeNull();
    expect(document.querySelector('.mobile-drawer-overlay')).toBeNull();
    expect(document.body.classList.contains('student-notebook-open')).toBe(true);

    fireEvent.click(screen.getByLabelText('العودة إلى الدرس'));
    expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
    expect(screen.getByText(/الخطوة 2 من 17/)).toBeInTheDocument();
    expect(document.body.classList.contains('student-notebook-open')).toBe(false);
  });

  it('unit-2/u2-lesson-4: keeps the completion flow (no assessment) and the notebook out of it', () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-4/15';
    render(<App />);
    fireEvent.click(screen.getByLabelText('إتمام الدرس'));
    expect(screen.getByText(/مبارك! أتممت بنجاح/)).toBeInTheDocument();
    expect(screen.queryByTestId('student-notebook')).not.toBeInTheDocument();
  });

  it('toggles body.student-notebook-open only while the notebook view is showing', () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-1';
    const { unmount } = render(<App />);
    expect(document.body.classList.contains('student-notebook-open')).toBe(false);

    clickOutlineNotebook();
    expect(document.body.classList.contains('student-notebook-open')).toBe(true);

    fireEvent.click(screen.getByLabelText('العودة إلى الدرس'));
    expect(document.body.classList.contains('student-notebook-open')).toBe(false);

    // Cleanup on unmount while notebook is open.
    clickOutlineNotebook();
    expect(document.body.classList.contains('student-notebook-open')).toBe(true);
    unmount();
    expect(document.body.classList.contains('student-notebook-open')).toBe(false);
  });

  it.each(['lesson-1', 'lesson-2', 'lesson-3'])(
    'print button triggers window.print in %s (supplementary check only — see file note)',
    (lessonId) => {
      const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
      window.location.hash = `#/unit/unit-1/lesson/${lessonId}`;
      render(<App />);
      clickOutlineNotebook();
      fireEvent.click(screen.getByLabelText('طباعة دفتر الطالب'));
      expect(printSpy).toHaveBeenCalledTimes(1);
      printSpy.mockRestore();
    },
  );
});

describe('Print isolation — static CSS audit (selector-level guarantee)', () => {
  // فحص ساكن مكمّل (لا يغني عن المعاينة البصرية): يثبت أن كل قاعدة طباعة في
  // notebook.css مشروطة بـ body.student-notebook-open، وأن بقية ملفات الأنماط
  // في التطبيق لا تحتوي أي @media print — فلا يمكن أن تتأثر طباعة واجهة أخرى.
  const stylesDir = new URL('./src/styles/', `file://${process.cwd()}/`);

  const extractPrintBlocks = (css: string): string[] => {
    const blocks: string[] = [];
    let index = css.indexOf('@media print');
    while (index !== -1) {
      let depth = 0;
      const start = css.indexOf('{', index);
      let cursor = start;
      for (; cursor < css.length; cursor++) {
        if (css[cursor] === '{') depth++;
        else if (css[cursor] === '}') {
          depth--;
          if (depth === 0) break;
        }
      }
      blocks.push(css.slice(start + 1, cursor));
      index = css.indexOf('@media print', cursor);
    }
    return blocks;
  };

  it('every print rule in notebook.css is scoped under body.student-notebook-open', async () => {
    const css = await readFile(new URL('notebook.css', stylesDir), 'utf8');
    const blocks = extractPrintBlocks(css);
    expect(blocks.length).toBeGreaterThan(0);

    for (const block of blocks) {
      // كل مجموعة اختيارات (ما قبل `{`) داخل كتلة الطباعة يجب أن تتضمن الشرط.
      const selectorGroups = block.match(/([^{}]+)\{/g) ?? [];
      expect(selectorGroups.length).toBeGreaterThan(0);
      for (const group of selectorGroups) {
        const selector = group.replace('{', '').trim();
        expect(
          selector.includes('body.student-notebook-open'),
          `unscoped print selector found: "${selector}"`,
        ).toBe(true);
      }
    }
  });

  it('no other stylesheet in the app declares any @media print rules', async () => {
    const entries = await readdir(stylesDir);
    const others = entries.filter((name) => name.endsWith('.css') && name !== 'notebook.css');
    expect(others.length).toBeGreaterThan(5);
    for (const name of others) {
      const css = await readFile(new URL(name, stylesDir), 'utf8');
      expect(css, `${name} must stay print-free`).not.toContain('@media print');
    }
  });
});
