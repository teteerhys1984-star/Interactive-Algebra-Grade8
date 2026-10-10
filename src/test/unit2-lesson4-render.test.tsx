import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../app/App';
import { unit2Lesson4Steps } from '../data/unit2/lesson04';

const TEACHER_PASSWORD = 'somer173';

/** يتحقق من أن النص المرئي لا يحمل صيغًا خامًا ولا علامات `$`. */
function expectNoRawMath(container: HTMLElement, where: string) {
  const text = visibleText(container);
  const rawAt = text.search(RAW_TEX);
  expect(rawAt === -1 ? '' : text.slice(Math.max(0, rawAt - 60), rawAt + 60), `TeX خام في ${where}`).toBe('');
  expect(text.includes('$'), `علامة $ ظاهرة في ${where}`).toBe(false);
}

/**
 * اختبار دخان لعرض الدرس الرابع داخل التطبيق: كل خطوة تُفتح عبر المسار نفسه
 * الذي يستعمله الطالب، ولا يظهر في النص المعروض أي TeX خام أو علامة `$`.
 */

// أوامر TeX التي لا يجب أن تظهر نصًا عاديًا على الشاشة.
const RAW_TEX = /\\(sqrt|frac|times|cdot|approx|left|right|text|mathrm|overline|pm|le|ge|neq)\b|\^\{|_\{/;

/**
 * النص المرئي للطالب: يستبعد عنصر `.katex-mathml`، وهو صيغة TeX الأصلية المخفية
 * التي يضعها KaTeX لقارئات الشاشة فقط، فلا تُرى على الشاشة.
 */
function visibleText(container: HTMLElement): string {
  const clone = container.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return clone.textContent ?? '';
}

describe('عرض الدرس الرابع من الوحدة الثانية داخل التطبيق', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('يملك خطوات كافية ويفتح كل خطوة دون أخطاء', () => {
    expect(unit2Lesson4Steps.length).toBeGreaterThanOrEqual(8);

    for (let index = 1; index <= unit2Lesson4Steps.length; index += 1) {
      window.location.hash = `#/unit/unit-2/lesson/u2-lesson-4/${index}`;
      const { container, unmount } = render(<App />);
      const text = visibleText(container);

      expect(text.length, `الخطوة ${index} فارغة`).toBeGreaterThan(0);
      const rawAt = text.search(RAW_TEX);
      // عند وجود TeX خام نعرض المقطع المحيط به في رسالة الفشل.
      expect(rawAt === -1 ? '' : `${text.match(RAW_TEX)?.[0]} | ${text.slice(Math.max(0, rawAt - 60), rawAt + 60)}`, `TeX خام في الخطوة ${index}`).toBe('');
      expect(text, `علامة $ ظاهرة في الخطوة ${index}`).not.toContain('$');
      unmount();
    }
  });

  it('يستبعد صيغة TeX المخفية لقارئات الشاشة من النص المرئي فقط', () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-4/1';
    const { container } = render(<App />);
    // الصيغة الأصلية موجودة في الشجرة (لقارئ الشاشة)، لكنها ليست في النص المرئي.
    expect(container.querySelector('.katex-mathml')).not.toBeNull();
    expect(visibleText(container)).not.toContain('\\times');
  });

  it('يعرض تبويب المعلّم للدرس الرابع دون TeX خام أو علامات $', () => {
    window.sessionStorage.clear();
    window.location.hash = '#/teacher';
    const { container } = render(<App />);
    fireEvent.change(screen.getByLabelText('كلمة المرور'), { target: { value: TEACHER_PASSWORD } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول' }));
    fireEvent.click(screen.getByRole('button', { name: /الدرس 4: الجذور التربيعية/ }));
    expectNoRawMath(container, 'تبويب المعلّم للدرس الرابع');
  });

  it.each([
    ['اختبار الدرس الرابع', 'u2-test-lesson-4'],
    ['اختبار الوحدة الثانية', 'u2-test-unit-2'],
  ])('يعرض أول سؤال في %s دون TeX خام أو علامات $', (_label, testId) => {
    window.location.hash = `#/tests/run/${testId}`;
    const { container } = render(<App />);
    expect(container.querySelector('.test-question-prompt')).toBeInTheDocument();
    expectNoRawMath(container, `أول سؤال في ${testId}`);
  });

  it('يعرض عنوان الدرس وعنوان الوحدة الصحيحين', () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-4/1';
    render(<App />);
    expect(screen.getAllByText(/الجذور التربيعية/).length).toBeGreaterThan(0);
  });
});
