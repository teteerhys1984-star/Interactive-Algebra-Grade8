import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../app/App';
import { getLessonById, getUnitById } from '../data/curriculum';
import { unit2Lesson1Data } from '../data/unit2/lesson01';

/**
 * الدرس الأول من الوحدة الثانية بعد إعادة بنائه وفق معيار التدريس الجديد:
 *   • «انطلاقة نشطة» (ص25) مرحلة تمهيدية مستقلة مسجّلة في الوحدة، لا في الدرس.
 *   • الشرح الفعلي يبدأ من نشاط الصفحة 26.
 *   • كل خطوة تُفتح عبر المسار الحقيقي للتطبيق دون TeX خام أو علامة `$`.
 *   • المكوّنات التفاعلية الثلاثة الجديدة مربوطة بكتل الدرس فعليًا.
 *   • الاختبار المستقل لا يكشف التصحيح قبل التسليم.
 */

const TEACHER_PASSWORD = 'somer173';
const RAW_TEX = /\\(sqrt|frac|times|cdot|approx|left|right|text|mathrm|overline|underbrace|pm|le|ge|neq)\b|\^\{|_\{/;

function visibleText(container: HTMLElement): string {
  const clone = container.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return clone.textContent ?? '';
}

function expectNoRawMath(container: HTMLElement, where: string) {
  const text = visibleText(container);
  const rawAt = text.search(RAW_TEX);
  expect(rawAt === -1 ? '' : text.slice(Math.max(0, rawAt - 60), rawAt + 60), `TeX خام في ${where}`).toBe('');
  expect(text.includes('$'), `علامة $ ظاهرة في ${where}`).toBe(false);
}

const openStep = (index: number): HTMLElement => {
  window.location.hash = `#/unit/unit-2/lesson/u2-lesson-1/${index + 1}`;
  const { container } = render(<App />);
  return container;
};

describe('بنية الدرس الأول: الانطلاقة النشطة ثم الشرح', () => {
  it('«انطلاقة نشطة» مرحلة مستقلة في الوحدة، خارج خطوات الدرس', () => {
    const unit = getUnitById('unit-2')!;
    expect(unit.warmup.id).toBe('warmup');
    expect(unit.warmup.sourcePages).toEqual([25]);

    const lesson = getLessonById('unit-2', 'u2-lesson-1')!;
    expect(lesson.sourcePages).toEqual([26, 27, 28]);
    expect(lesson.steps.every((step) => step.sourcePages.every((page) => page >= 26))).toBe(true);
    // لا يُدمج أي سؤال من الصفحة 25 داخل خطوات الدرس.
    const ids = lesson.steps.flatMap((step) => step.blocks.map((block) => block.id));
    expect(ids.filter((id) => id.startsWith('p25-'))).toEqual([]);
  });

  it('الخطوة الأولى تمهيد من إعداد المنصة، والخطوة الثانية تبدأ بنشاط الصفحة 26', () => {
    const [intro, first] = unit2Lesson1Data.steps;

    expect(intro.blocks.every((block) => block.authored)).toBe(true);
    expect(intro.blocks.some((block) => block.type === 'teach')).toBe(true);

    const activity = first.blocks.find((block) => block.id === 'p26-activity');
    expect(activity, 'نشاط الصفحة 26 يجب أن يفتح الشرح الفعلي').toBeDefined();
    expect(activity?.authored).toBeFalsy();
    expect(activity?.sourceRef.page).toBe(26);
  });

  it('كل مرحلة من مراحل الدرس موجودة بترتيبها التعليمي', () => {
    const titles = unit2Lesson1Data.steps.map((step) => step.title).join(' | ');
    for (const keyword of [
      'مدخل',
      'نشاط',
      'تعريف 1',
      'تعريف 2',
      'الصيغة المعيارية',
      'من قوى العدد 10',
      'تحويل عدد من صيغة',
      'الأخطاء الشائعة',
      'تحقّق من فهمك ① و②',
      'تحقّق من فهمك ③',
      'تدرّب 1',
      'تدرّب 2',
      'تدرّب 3',
      'تدرّب 4',
      'تدريب إضافي',
      'ملخص الدرس',
    ]) {
      expect(titles, `خُطوة مفقودة: ${keyword}`).toContain(keyword);
    }
  });

  it('يربط المكوّنات التفاعلية الجديدة بكتل الدرس', () => {
    const types = new Set(
      unit2Lesson1Data.steps
        .flatMap((step) => step.blocks)
        .map((block) => block.interactiveType)
        .filter(Boolean),
    );
    for (const type of [
      'power-of-ten-frames',
      'power-of-ten-ladder',
      'negative-power-zoom',
      'standard-form-lab',
      'practice-check',
      'mcq',
    ]) {
      expect(types, `مكوّن غير مربوط: ${type}`).toContain(type);
    }
  });

  it('الشرح المضاف موسوم، ونصوص الكتاب تبقى بمرجع صفحتها', () => {
    const blocks = unit2Lesson1Data.steps.flatMap((step) => step.blocks);
    const authored = blocks.filter((block) => block.authored);
    expect(authored.length).toBeGreaterThanOrEqual(20);
    expect(authored.every((block) => block.sourceRef.section === 'شرح المنصة')).toBe(true);

    const fromBook = blocks.filter((block) => !block.authored);
    expect(fromBook.length).toBeGreaterThan(0);
    expect(fromBook.every((block) => block.sourceRef.page >= 26 && block.sourceRef.page <= 28)).toBe(true);
  });
});

describe('عرض الدرس داخل التطبيق', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('يفتح كل خطوة دون TeX خام أو علامة $', () => {
    for (let index = 0; index < unit2Lesson1Data.steps.length; index += 1) {
      const container = openStep(index);
      const text = visibleText(container);
      expect(text.length, `الخطوة ${index + 1} فارغة`).toBeGreaterThan(0);
      expectNoRawMath(container, `الخطوة ${index + 1}`);
      container.remove();
    }
  });

  it('يعرض المكوّنات التفاعلية الثلاثة في خطواتها', () => {
    const frames = openStep(1);
    expect(frames.querySelector('.power-frames')).not.toBeNull();
    expect(frames.querySelector('.power-ladder')).not.toBeNull();
    frames.remove();

    const negative = openStep(3);
    expect(negative.querySelector('.neg-zoom')).not.toBeNull();
    negative.remove();

    const standard = openStep(4);
    expect(standard.querySelector('.sf-lab')).not.toBeNull();
    standard.remove();
  });

  it('يعرض تبويب المعلّم للدرس الأول دون TeX خام', () => {
    window.location.hash = '#/teacher';
    const { container } = render(<App />);
    fireEvent.change(screen.getByLabelText('كلمة المرور'), { target: { value: TEACHER_PASSWORD } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول' }));
    fireEvent.click(screen.getByRole('button', { name: /الدرس 1: قوى العدد 10/ }));

    expect(container.textContent).toContain('أهداف الدرس');
    expect(container.textContent).toContain('الأخطاء الشائعة وتصويبها');
    expect(container.textContent).toContain('الحلول التفصيلية');
    expectNoRawMath(container, 'تبويب المعلّم للدرس الأول');
  });
});

/** زرّ في الحاوية يحوي نصًّا معيّنًا — يتجنّب حساب الاسم المتاح على أيقونات KaTeX. */
function buttonWithText(container: HTMLElement, text: string): HTMLButtonElement {
  const found = Array.from(container.querySelectorAll('button')).find((button) =>
    (button.textContent ?? '').includes(text),
  );
  if (!found) throw new Error(`زر مفقود: ${text}`);
  return found as HTMLButtonElement;
}

describe('الاختبار المستقل داخل الدرس', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('لا يعرض أي تصحيح قبل التسليم، ثم يعرض النتيجة والمراجعة', () => {
    const container = openStep(unit2Lesson1Data.steps.length - 1);
    fireEvent.click(buttonWithText(container, 'الانتقال إلى الاختبار الشامل'));

    expect(screen.getByText('الاختبار المستقل — قوى العدد 10')).toBeInTheDocument();

    // اختيار إجابة لا يكشف صحّتها.
    const choices = container.querySelectorAll('.aq-choice');
    fireEvent.click(choices[1]);
    expect(container.querySelector('.ar-review')).toBeNull();
    expect(container.textContent).not.toContain('الصواب');

    // الانتقال إلى آخر سؤال ثم التسليم.
    for (let i = 0; i < unit2Lesson1Data.finalAssessment!.questions.length - 1; i += 1) {
      fireEvent.click(buttonWithText(container, 'التالي'));
    }
    fireEvent.click(buttonWithText(container, 'إنهاء الاختبار وعرض النتيجة'));

    expect(container.querySelector('.ar-score')).not.toBeNull();
    expect(container.querySelector('.ar-review')).not.toBeNull();
    expect(container.textContent).toContain('الصواب');
    expect(container.textContent).toContain('النتيجة');
  });
});
