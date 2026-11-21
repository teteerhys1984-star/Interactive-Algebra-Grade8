import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import IndependentTestsArea from '../components/independent-tests/IndependentTestsArea';
import { independentTests } from '../data/independent-tests';
import { firstIndependentTest } from '../data/independent-tests/first-test';
import { secondIndependentTest } from '../data/independent-tests/second-test';
import { thirdIndependentTest } from '../data/independent-tests/third-test';
import { fourthIndependentTest } from '../data/independent-tests/fourth-test';
import { firstTestSolutions } from '../data/independent-tests/first-test-solutions';
import { secondTestSolutions } from '../data/independent-tests/second-test-solutions';
import { thirdTestSolutions } from '../data/independent-tests/third-test-solutions';
import { fourthTestSolutions } from '../data/independent-tests/fourth-test-solutions';
import type { IndependentTestItem } from '../data/independent-tests/types';

/**
 * الاختبار المستقل الرابع (ورقة عمل: الأعداد العادية والعمليات عليها).
 *
 * هذه الاختبارات تحرس خمسة أشياء:
 *  1. مطابقة ورقة المصدر سؤالًا بسؤال وترتيبًا وخيارًا (لا سؤال ضائع ولا مُضاف).
 *  2. أن كل معرّف بند/بند فرعي له حل واحد، وأن نصوص الحلول سليمة من TeX خام.
 *  3. صحة الإجابات والقيم العددية في الحلول، محسوبة هنا مستقلًّا عن ملف
 *     الحلول حتى لا يتحقق الملف من نفسه.
 *  4. أن تجربة الطالب هي تجربة الاختبارات السابقة نفسها: بطاقة ← ورقة ← بوابة
 *     كلمة سر ← حلول، دون أي مسار موازٍ.
 *  5. ألا يُعاد استخدام بيانات الاختبار الجديد في الاختبارات السابقة.
 */

const collectItems = (test = fourthIndependentTest): IndependentTestItem[] =>
  test.sections.flatMap((section) => section.blocks.flatMap((block) => block.items));

const visibleText = (root: HTMLElement): string => {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return clone.textContent ?? '';
};

const testCard = (title: string): HTMLElement => {
  const card = screen.getByRole('heading', { name: title }).closest('article');
  if (!card) throw new Error(`بطاقة الاختبار «${title}» غير موجودة`);
  return card as HTMLElement;
};

const renderFourthTestPaper = () => {
  const result = render(<IndependentTestsArea />);
  fireEvent.click(within(testCard('الاختبار الرابع')).getByRole('button', { name: /دخول إلى الاختبار/ }));
  return result;
};

const unlockFourthTestSolutions = () => {
  fireEvent.change(screen.getByLabelText('كلمة السر'), { target: { value: 'somer173' } });
  fireEvent.click(screen.getByRole('button', { name: /فتح الحلول/ }));
};

/**
 * حساب كسري دقيق (بسط/مقام صحيحان) للتحقق المستقل من نواتج الورقة.
 * المقارنة هنا بالضرب التبادلي لا بالفاصلة العائمة.
 */
const Fraction = {
  of: (numerator: number, denominator: number): { n: number; d: number } => {
    const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
    const divisor = gcd(numerator, denominator) || 1;
    return { n: numerator / divisor, d: denominator / divisor };
  },
  mul: (a: { n: number; d: number }, b: { n: number; d: number }) =>
    Fraction.of(a.n * b.n, a.d * b.d),
  div: (a: { n: number; d: number }, b: { n: number; d: number }) =>
    Fraction.of(a.n * b.d, a.d * b.n),
  add: (a: { n: number; d: number }, b: { n: number; d: number }) =>
    Fraction.of(a.n * b.d + b.n * a.d, a.d * b.d),
  sub: (a: { n: number; d: number }, b: { n: number; d: number }) =>
    Fraction.of(a.n * b.d - b.n * a.d, a.d * b.d),
  equal: (a: { n: number; d: number }, b: { n: number; d: number }) => a.n * b.d === b.n * a.d,
};

const itemIds = collectItems().filter((item) => !item.parts).map((item) => item.id);
const partIds = collectItems().flatMap((item) => item.parts?.map((part) => part.id) ?? []);

describe('الاختبار المستقل الرابع — ورقة عمل الأعداد العادية والعمليات عليها', () => {
  beforeEach(() => {
    window.location.hash = '#/independent-tests';
  });

  it('is registered after the three existing exams without changing their order or identities', () => {
    expect(independentTests).toHaveLength(4);
    expect(independentTests[0]).toBe(firstIndependentTest);
    expect(independentTests[1]).toBe(secondIndependentTest);
    expect(independentTests[2]).toBe(thirdIndependentTest);
    expect(independentTests[3]).toBe(fourthIndependentTest);
    expect(fourthIndependentTest.id).toBe('independent-test-4');
    expect(fourthIndependentTest.title).toBe('الاختبار الرابع');

    render(<IndependentTestsArea />);
    expect(screen.getByRole('heading', { name: 'الاختبار الأول' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'الاختبار الثاني' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'الاختبار الثالث' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'الاختبار الرابع' })).toBeInTheDocument();
    expect(screen.getByText('اختبار مستقل رقم 4')).toBeInTheDocument();

    // نقاط حراسة لمحتوى الاختبارات السابقة؛ لا يُعاد استخدام بيانات الاختبار الجديد فيها.
    expect(firstIndependentTest.sections[0].blocks[0].items[0].prompt).toBe('العدد $(0.01)^{-1}$ يساوي:');
    expect(secondIndependentTest.sections[0].blocks[0].items[0].prompt).toBe('مقلوب سدس العدد $-24$ :');
    expect(thirdIndependentTest.sections[0].blocks[0].items[0].prompt).toContain('محيط مثلث يساوي');
    expect(firstTestSolutions['q1-1'].finalAnswer).toContain('$10^{2}$');
    expect(secondTestSolutions['q1-1'].finalAnswer).toContain('$-\\dfrac{1}{4}$');
    expect(thirdTestSolutions['q1-1'].finalAnswer).toContain('$24\\,\\text{cm}$');
  });

  it('preserves the four source questions, their marks, item counts and types', () => {
    expect(fourthIndependentTest.subtitle).toContain('الصف الثامن الأساسي');
    expect(fourthIndependentTest.subtitle).toContain('الفصل الأول');
    expect(fourthIndependentTest.subtitle).toContain('الأعداد العادية والعمليات عليها');
    expect(fourthIndependentTest.description).toContain('100 درجة');

    expect(fourthIndependentTest.sections.map((section) => section.heading)).toEqual([
      'السؤال الأول',
      'السؤال الثاني',
      'السؤال الثالث',
      'السؤال الرابع',
    ]);
    // عنوان كل سؤال في المصدر هو تعليمته، فلا تُضاف عناوين أقسام غير موجودة في الورقة.
    expect(fourthIndependentTest.sections.map((section) => section.title)).toEqual(['', '', '', '']);
    expect(fourthIndependentTest.sections.map((section) => section.pointsLabel)).toEqual([
      '20 درجة',
      '20 درجة',
      '40 درجة',
      '20 درجة',
    ]);
    // مجموع الدرجات المطبوعة في الورقة = 100 درجة.
    const total = fourthIndependentTest.sections.reduce(
      (sum, section) => sum + Number(section.pointsLabel?.match(/(\d+)/)?.[1] ?? 0),
      0,
    );
    expect(total).toBe(100);

    expect(fourthIndependentTest.sections[0].blocks.map((block) => block.heading)).toEqual([
      'اختر الإجابة الصحيحة مما يأتي',
    ]);
    expect(fourthIndependentTest.sections[1].blocks.map((block) => block.heading)).toEqual([
      'أجب بكلمة (صح) أو (خطأ)',
    ]);
    expect(fourthIndependentTest.sections[2].blocks.map((block) => block.heading)).toEqual([
      'أوجد ناتج ما يأتي بأبسط صورة ممكنة',
    ]);
    expect(fourthIndependentTest.sections[3].blocks.map((block) => block.heading)).toEqual([
      'حل المسألة الآتية',
    ]);

    const sections = fourthIndependentTest.sections;
    // السؤال الأول: خمسة بنود اختيار من متعدد، لكل بند ثلاثة خيارات a ثم b ثم c.
    const choices = sections[0].blocks[0].items;
    expect(choices).toHaveLength(5);
    expect(choices.every((item) => item.kind === 'choice' && item.choices?.length === 3)).toBe(true);
    expect(choices.map((item) => item.choices?.map((choice) => choice.id))).toEqual([
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
    ]);
    // السؤال الثاني: خمس عبارات صح/خطأ.
    expect(sections[1].blocks[0].items).toHaveLength(5);
    expect(sections[1].blocks[0].items.every((item) => item.kind === 'true-false')).toBe(true);
    // السؤال الثالث: أربعة تمارين حسابية.
    expect(sections[2].blocks[0].items).toHaveLength(4);
    expect(sections[2].blocks[0].items.every((item) => item.kind === 'free' && item.math)).toBe(true);
    // السؤال الرابع: مسألة كلامية بثلاثة بنود فرعية.
    expect(sections[3].blocks[0].items).toHaveLength(1);
    expect(sections[3].blocks[0].items[0].parts).toHaveLength(3);
    expect(sections[3].blocks[0].items[0].partsLabel).toBe('أوجد:');
  });

  it('keeps every number, fraction and choice of the source verbatim', () => {
    const items = collectItems();
    const prompts = items.map((item) => item.prompt ?? '').join(' ');
    const maths = items.map((item) => item.math ?? '').join(' ');

    // السؤال الأول: نصوص البنود والخيارات كما في المصدر.
    expect(prompts).toContain('مقلوب العدد $-\\dfrac{7}{9}$ هو:');
    expect(prompts).toContain('قيمة $-\\dfrac{5}{8}$ من العدد $64$ تساوي:');
    expect(prompts).toContain('ناتج $\\left(-\\dfrac{4}{7}\\right) \\div \\left(-\\dfrac{2}{9}\\right)$ هو:');
    expect(prompts).toContain('ناتج $(-5) \\times (-8) \\times (-2)$ هو:');
    expect(prompts).toContain('أبسط صورة للعبارة $14x - 6x + 8x$ هي:');

    const firstChoices = items[0].choices ?? [];
    expect(firstChoices.map((choice) => choice.label)).toEqual([
      '$\\dfrac{9}{-7}$',
      '$-\\dfrac{9}{7}$',
      '$\\dfrac{7}{9}$',
    ]);
    // الخياران الأول والثاني متكافئان رياضيًّا، وكلاهما يساوي مقلوب العدد المعطى.
    expect(Fraction.equal(Fraction.of(9, -7), Fraction.of(-9, 7))).toBe(true);

    expect(items[1].choices?.map((choice) => choice.label)).toEqual(['$-40$', '$40$', '$-25$']);
    expect(items[2].choices?.map((choice) => choice.label)).toEqual([
      '$\\dfrac{18}{7}$',
      '$-\\dfrac{18}{7}$',
      '$\\dfrac{9}{7}$',
    ]);
    expect(items[3].choices?.map((choice) => choice.label)).toEqual(['$-80$', '$80$', '$-20$']);
    expect(items[4].choices?.map((choice) => choice.label)).toEqual(['$16x$', '$8x$', '$4x$']);

    // السؤال الثاني: العبارات الخمس كما في المصدر.
    expect(prompts).toContain('تحليل العبارة $18x - 12$ هو $6(3x - 2)$.');
    expect(prompts).toContain('حاصل ضرب عددين مختلفي الإشارة هو عدد سالب.');
    expect(prompts).toContain('مقلوب العدد $-\\dfrac{3}{5}$ هو $\\dfrac{5}{-3}$.');
    expect(prompts).toContain('إذا كان $\\dfrac{x}{18} = \\dfrac{7}{9}$، فإن $x = 14$.');
    expect(prompts).toContain('عند قسمة عدد موجب على عدد سالب يكون الناتج موجبًا.');

    // السؤال الثالث: التعبيرات الأربعة كما في المصدر.
    expect(maths).toContain('A = 6(4x - 3) - 5(2x + 7) + 4');
    expect(maths).toContain('B = \\dfrac{7}{8} \\times (-24) + \\dfrac{5}{6}');
    expect(maths).toContain('C = \\left(\\dfrac{5}{6} - \\dfrac{3}{4}\\right) \\div \\left(\\dfrac{7}{8} - \\dfrac{1}{2}\\right)');
    expect(maths).toContain('D = \\dfrac{5}{7} - \\dfrac{3}{4} \\div \\left(-\\dfrac{6}{11}\\right)');

    // السؤال الرابع: المعطيات والبنود الفرعية كما في المصدر.
    expect(prompts).toContain('عدد الطلاب الذين يدرسون اللغة الإنجليزية $\\dfrac{3}{5}$ من العدد الكلي للطلاب');
    expect(prompts).toContain('$\\dfrac{2}{7}$ من هؤلاء الطلاب يشاركون في الأنشطة الثقافية');
    expect(prompts).toContain('عدد طلاب المدرسة $70$ طالبًا');
    const parts = items.find((item) => item.parts)?.parts ?? [];
    expect(parts.map((part) => part.prompt)).toEqual([
      'عدد الطلاب الذين يدرسون اللغة الإنجليزية.',
      'عدد الطلاب المشاركين في الأنشطة الثقافية.',
      'نسبة الطلاب الذين لا يدرسون اللغة الإنجليزية إلى العدد الكلي، معبّرًا عنها بالنسبة المئوية.',
    ]);
  });

  it('omits identifying details that do not belong to the questions', () => {
    const serialized = JSON.stringify(fourthIndependentTest) + JSON.stringify(fourthTestSolutions);
    expect(serialized).not.toContain('عمر دويا');
    expect(serialized).not.toContain('إعداد المدرس');
    expect(serialized).not.toContain('تصميم وتنسيق');
    expect(serialized).not.toContain('انتهت الأسئلة');
  });

  it('shows the source paper without answer inputs, score controls or premature solutions', () => {
    const { container } = renderFourthTestPaper();
    expect(container.querySelectorAll('.itest-item')).toHaveLength(15);
    expect(container.querySelectorAll('.itest-choice')).toHaveLength(15);
    expect(container.querySelectorAll('.itest-true-false')).toHaveLength(5);
    expect(container.querySelectorAll('.itest-part')).toHaveLength(3);
    expect(container.querySelectorAll('input, select, textarea, [role="radio"], [role="checkbox"]')).toHaveLength(0);
    expect(container.querySelectorAll('.itest-solution-final')).toHaveLength(0);
    expect(screen.getByRole('button', { name: /العودة إلى قائمة الاختبارات/ })).toBeInTheDocument();
    expect(visibleText(container)).not.toContain('$');
    expect(visibleText(container)).not.toContain('\\dfrac');
    expect(container.querySelectorAll('.katex').length).toBeGreaterThan(10);
  });

  it('displays item and sub-item numbers with Latin digits', () => {
    const { container } = renderFourthTestPaper();
    const numbers = Array.from(container.querySelectorAll('.itest-item-number'))
      .map((node) => node.textContent ?? '');

    expect(numbers.length).toBeGreaterThan(0);
    expect(numbers.join(' ')).toMatch(/[0-9]/);
    expect(numbers.join(' ')).not.toMatch(/[٠-٩۰-۹]/);
  });

  it('keeps the solutions tab behind the existing password gate', () => {
    const { container } = renderFourthTestPaper();

    fireEvent.click(screen.getByRole('button', { name: /الحلول/ }));
    expect(screen.getByRole('heading', { name: 'الحلول محمية بكلمة سر' })).toBeInTheDocument();
    expect(container.querySelector('.itest-solution-final')).toBeNull();

    fireEvent.change(screen.getByLabelText('كلمة السر'), { target: { value: 'wrong-pass' } });
    fireEvent.click(screen.getByRole('button', { name: /فتح الحلول/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('كلمة السر غير صحيحة');
  });

  it('registers one solution per question id and no orphan solutions', () => {
    const expectedIds = [...itemIds, ...partIds].sort();
    expect(Object.keys(fourthTestSolutions).sort()).toEqual(expectedIds);
    expect(Object.keys(fourthTestSolutions)).toHaveLength(17);
    for (const id of expectedIds) {
      expect(fourthTestSolutions[id].steps.length).toBeGreaterThan(0);
      expect(fourthTestSolutions[id].finalAnswer.trim().length).toBeGreaterThan(0);
    }
  });

  it('shows a complete solution for every question and sub-question after unlocking', async () => {
    const { container } = renderFourthTestPaper();

    fireEvent.click(screen.getByRole('button', { name: /الحلول/ }));
    unlockFourthTestSolutions();

    await waitFor(() => expect(container.querySelectorAll('.itest-solution-final').length).toBeGreaterThan(0));

    const finals = Array.from(container.querySelectorAll('.itest-solution-final')).map(
      (node) => node.textContent ?? '',
    );
    expect(finals).toHaveLength(17);
    expect(container.querySelector('.itest-solution-missing')).toBeNull();
    expect(finals.join(' ')).toContain('14x - 49');
    expect(finals.join(' ')).toContain('121');
    expect(finals.join(' ')).toContain('117');
    expect(finals.join(' ')).toContain('40');

    const solutionsText = visibleText(container);
    expect(solutionsText).not.toContain('$');
    expect(solutionsText).not.toContain('\\dfrac');

    // الرجوع إلى الأسئلة يُغلق الحلول من جديد.
    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى الأسئلة' }));
    expect(container.querySelector('.itest-solution-final')).toBeNull();
    expect(screen.getByRole('heading', { name: 'السؤال الأول' })).toBeInTheDocument();
  });

  it('verifies every numeric answer independently of the solutions file', () => {
    // السؤال الأول: مقلوب العدد المعطى هو -9/7، والخياران الأول والثاني متكافئان.
    expect(Fraction.equal(
      Fraction.div(Fraction.of(1, 1), Fraction.of(-7, 9)),
      Fraction.of(-9, 7),
    )).toBe(true);
    expect(Fraction.equal(Fraction.of(9, -7), Fraction.of(-9, 7))).toBe(true);
    expect(fourthTestSolutions['q1-1'].finalAnswer).toContain('-\\dfrac{9}{7}');
    expect(fourthTestSolutions['q1-1'].finalAnswer).toContain('\\dfrac{9}{-7}');

    // قيمة -5/8 من 64 هي -40.
    expect(Fraction.mul(Fraction.of(-5, 8), Fraction.of(64, 1)).n).toBe(-40);
    expect(fourthTestSolutions['q1-2'].finalAnswer).toContain('-40');

    // ناتج قسمة (-4/7) على (-2/9) هو 18/7.
    const q13 = Fraction.div(Fraction.of(-4, 7), Fraction.of(-2, 9));
    expect(Fraction.equal(q13, Fraction.of(18, 7))).toBe(true);
    expect(fourthTestSolutions['q1-3'].finalAnswer).toContain('\\dfrac{18}{7}');

    // ناتج (-5) × (-8) × (-2) هو -80.
    expect((-5) * (-8) * (-2)).toBe(-80);
    expect(fourthTestSolutions['q1-4'].finalAnswer).toContain('-80');

    // أبسط صورة لـ $14x - 6x + 8x$ هي $16x$.
    expect(14 - 6 + 8).toBe(16);
    expect(fourthTestSolutions['q1-5'].finalAnswer).toContain('16x');

    // السؤال الثاني: تحليل $18x - 12$ هو $6(3x - 2)$ لأن $6(3x - 2) = 18x - 12$.
    expect(6 * 3).toBe(18);
    expect(6 * -2).toBe(-12);
    expect(fourthTestSolutions['q2-1'].finalAnswer).toContain('صح');
    // مقلوب -3/5 هو 5/-3.
    expect(Fraction.equal(
      Fraction.div(Fraction.of(1, 1), Fraction.of(-3, 5)),
      Fraction.of(5, -3),
    )).toBe(true);
    expect(fourthTestSolutions['q2-3'].finalAnswer).toContain('صح');
    // إذا كان x/18 = 7/9 فإن x = 14.
    expect(Fraction.equal(Fraction.mul(Fraction.of(7, 9), Fraction.of(18, 1)), Fraction.of(14, 1))).toBe(true);
    expect(fourthTestSolutions['q2-4'].finalAnswer).toContain('14');
    // العبارة المغلوطة: قسمة موجب على سالب تعطي سالبًا.
    expect(fourthTestSolutions['q2-5'].finalAnswer).toContain('خطأ');

    // السؤال الثالث: القيم المرجعية محسوبة مستقلًّا.
    // $A = 6(4x - 3) - 5(2x + 7) + 4 = 14x - 49$.
    expect(6 * 4 - 5 * 2).toBe(14);
    expect(6 * -3 - 5 * 7 + 4).toBe(-49);
    expect(fourthTestSolutions['q3-1'].finalAnswer).toContain('14x - 49');

    // B = (7/8) × (-24) + 5/6 = -121/6.
    const b = Fraction.add(Fraction.mul(Fraction.of(7, 8), Fraction.of(-24, 1)), Fraction.of(5, 6));
    expect(Fraction.equal(b, Fraction.of(-121, 6))).toBe(true);
    expect(fourthTestSolutions['q3-2'].finalAnswer).toContain('-\\dfrac{121}{6}');

    // C = (5/6 - 3/4) ÷ (7/8 - 1/2) = 2/9.
    const c = Fraction.div(
      Fraction.sub(Fraction.of(5, 6), Fraction.of(3, 4)),
      Fraction.sub(Fraction.of(7, 8), Fraction.of(1, 2)),
    );
    expect(Fraction.equal(c, Fraction.of(2, 9))).toBe(true);
    expect(fourthTestSolutions['q3-3'].finalAnswer).toContain('\\dfrac{2}{9}');

    // D = 5/7 - (3/4) ÷ (-6/11) = 117/56.
    const d = Fraction.sub(
      Fraction.of(5, 7),
      Fraction.div(Fraction.of(3, 4), Fraction.of(-6, 11)),
    );
    expect(Fraction.equal(d, Fraction.of(117, 56))).toBe(true);
    expect(fourthTestSolutions['q3-4'].finalAnswer).toContain('\\dfrac{117}{56}');

    // السؤال الرابع: 42 طالبًا، 12 مشاركًا، والنسبة 40%.
    expect(70 * 3 / 5).toBe(42);
    expect(42 * 2 / 7).toBe(12);
    expect((70 - 42) / 70).toBe(0.4);
    expect(fourthTestSolutions['q4-1'].finalAnswer).toContain('42');
    expect(fourthTestSolutions['q4-2'].finalAnswer).toContain('12');
    expect(fourthTestSolutions['q4-3'].finalAnswer).toContain('40');
  });
});
