import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../app/App';
import { unit2Lesson5Data } from '../data/unit2/lesson05';

/**
 * اختبار دخان لعرض الدرس الخامس من الوحدة الثانية داخل التطبيق.
 *
 * يفتح كل الأسئلة الـ39 عبر المسار الذي يستعمله الطالب ويتأكد أن:
 *  - الواجهة تعرض الدرس فعلاً (نص غير فارغ)،
 *  - لا يظهر TeX خام ولا علامة `$` على الشاشة،
 *  - نص السؤال الأصلي ظاهر،
 *  - خانة كشف الحل لا تُظهر الجواب قبل الضغط عليها، ثم تُظهره بعده.
 */

const RAW_TEX = /\\\\(sqrt|frac|times|cdot|approx|left|right|text|mathrm|overline|pm|le|ge|neq|cdots|div)\b|\^\{|_\{/;

const visibleText = (container: HTMLElement): string => {
  const clone = container.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return clone.textContent ?? '';
};

const expectNoRawMath = (container: HTMLElement, where: string): void => {
  const text = visibleText(container);
  const rawAt = text.search(RAW_TEX);
  expect(
    rawAt === -1 ? '' : `${text.match(RAW_TEX)?.[0]} | ${text.slice(Math.max(0, rawAt - 60), rawAt + 60)}`,
    `TeX خام في ${where}`,
  ).toBe('');
  expect(text.includes('$'), `علامة $ ظاهرة في ${where}`).toBe(false);
};

describe('تمارين الوحدة الثانية — العرض داخل التطبيق', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.location.hash = '#/';
  });

  it('يفتح كل الأسئلة الـ39 دون TeX خام أو أخطاء', { timeout: 120_000 }, () => {
    expect(unit2Lesson5Data.steps).toHaveLength(39);

    for (let index = 1; index <= unit2Lesson5Data.steps.length; index += 1) {
      window.location.hash = `#/unit/unit-2/lesson/u2-lesson-5/${index}`;
      const { container, unmount } = render(<App />);

      const text = visibleText(container);
      expect(text.length, `الخطوة ${index} فارغة`).toBeGreaterThan(0);
      expect(text, `عنوان السؤال ${index}`).toContain(`السؤال ${index}`);
      expectNoRawMath(container, `الخطوة ${index}`);

      unmount();
    }
  });

  it('يعرض النص الأصلي للسؤال قبل أي تفاعل', () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-5/1';
    const { container } = render(<App />);

    // من نص السؤال 1 المطبوع: «هناك إجابة صحيحة واحدة من بين ثلاث إجابات مقترحة».
    expect(visibleText(container)).toContain('إجابة صحيحة واحدة');
  });

  it('لا يكشف جواب البند قبل الضغط على «إظهار الحل والخطوات»', () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-5/1';
    const { container } = render(<App />);

    // خيارات السؤال المطبوعة تظهر دائمًا (هي نصّ المصدر)، أما لوحة الحل فلا تظهر إطلاقًا.
    expect(container.querySelectorAll('.solution-panel')).toHaveLength(0);

    const revealButtons = screen.getAllByRole('button', { name: /إظهار الحل والخطوات/ });
    expect(revealButtons.length).toBe(10);

    fireEvent.click(revealButtons[0]);
    const panels = container.querySelectorAll('.solution-panel');
    expect(panels).toHaveLength(1);
    expect(panels[0].textContent).toContain('0.0001');
    expect(panels[0].textContent).toContain('10');
  });

  it('يعرض العلامات المتداخلة (1.①) كما في المصدر في السؤال 3', () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-5/3';
    const { container } = render(<App />);

    const labels = Array.from(container.querySelectorAll('.step-badge-mini')).map((node) => node.textContent);
    expect(labels.length).toBeGreaterThanOrEqual(9);
    expect(visibleText(container)).toContain('1.①');
    expect(visibleText(container)).toContain('3.③');
  });

  it('يفتح التلميح والحل عند الطلب فقط', { timeout: 20_000 }, () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-5/7';
    const { container } = render(<App />);

    expect(screen.queryByRole('button', { name: /إخفاء الحل/ })).not.toBeInTheDocument();
    expect(visibleText(container)).not.toContain('4.73');

    fireEvent.click(screen.getByRole('button', { name: /أظهر الحل/ }));
    expect(visibleText(container)).toContain('4.73');
  });

  it('يفتح بندًا وملاحظة الحل، ثم يعيد الحالة عند الانتقال لسؤال آخر', { timeout: 30_000 }, () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-5/9';
    const { container } = render(<App />);

    // نبحث بالنص لا بالدور، لأن حساب الاسم المتاح في jsdom على صفحة طويلة يفشل.
    const buttonWith = (text: string): HTMLElement =>
      Array.from(container.querySelectorAll('button')).find((node) =>
        node.textContent?.includes(text),
      ) as HTMLElement;

    fireEvent.click(buttonWith('أظهر التلميح'));
    fireEvent.click(buttonWith('أظهر الحل'));
    const revealButtons = Array.from(container.querySelectorAll('button')).filter((node) =>
      node.textContent?.includes('إظهار الحل والخطوات'),
    );
    fireEvent.click(revealButtons[1]);
    expect(container.querySelectorAll('.exercise-reveal')).toHaveLength(2);
    expect(container.querySelectorAll('.solution-panel')).toHaveLength(1);

    // الانتقال إلى السؤال التالي: كل الكشوف مغلقة من جديد.
    fireEvent.click(buttonWith('الخطوة التالية'));
    expect(visibleText(container)).toContain('السؤال 10 من 39');
    expect(container.querySelectorAll('.exercise-reveal')).toHaveLength(0);
    expect(container.querySelectorAll('.solution-panel')).toHaveLength(0);

    // العودة إلى السؤال 9: لا يحتفظ العرض بحالة الكشف.
    fireEvent.click(buttonWith('الخطوة السابقة'));
    expect(visibleText(container)).toContain('السؤال 9 من 39');
    expect(container.querySelectorAll('.exercise-reveal')).toHaveLength(0);
  });

  it('يظهر تبويب المعلّم للدرس الخامس دون TeX خام', { timeout: 60_000 }, () => {
    window.location.hash = '#/teacher';
    const { container } = render(<App />);

    fireEvent.change(screen.getByLabelText('كلمة المرور'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول' }));
    fireEvent.click(screen.getByRole('button', { name: /تمارين ومسائل الوحدة الثانية/ }));

    expect(visibleText(container)).toContain('الحلول التفصيلية خطوة بخطوة');
    expect(visibleText(container)).toContain('165');
    expectNoRawMath(container, 'مساحة المعلّم للدرس الخامس');
  });
});
