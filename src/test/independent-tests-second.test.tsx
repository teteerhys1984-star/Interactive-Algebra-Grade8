import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import IndependentTestsArea from '../components/independent-tests/IndependentTestsArea';
import { independentTests } from '../data/independent-tests';
import { firstIndependentTest } from '../data/independent-tests/first-test';
import { secondIndependentTest } from '../data/independent-tests/second-test';
import { secondTestSolutions } from '../data/independent-tests/second-test-solutions';
import type { IndependentTestItem } from '../data/independent-tests/types';

/**
 * الاختبار المستقل الثاني (جبر + هندسة).
 *
 * هذه الاختبارات تحرس أربعة أشياء مختلفة:
 *  1. مطابقة ورقة المصدر سؤالًا بسؤال وترتيبًا وخيارًا (لا سؤال ضائع ولا مُضاف).
 *  2. أن كل معرّف بند/بند فرعي له حل واحد، وأن نصوص الحلول سليمة من TeX خام.
 *  3. صحة الإجابات المختارة والقيم العددية في الحلول، محسوبة هنا مستقلًّا عن ملف
 *     الحلول حتى لا يتحقق الملف من نفسه.
 *  4. أن تجربة الطالب هي تجربة الاختبار الأول نفسها: بطاقة ← ورقة ← بوابة كلمة
 *     سر ← حلول، دون أي مسار موازٍ.
 */

const collectItems = (test = secondIndependentTest): IndependentTestItem[] =>
  test.sections.flatMap((section) => section.blocks.flatMap((block) => block.items));

const visibleText = (root: HTMLElement): string => {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return clone.textContent ?? '';
};

/** بطاقة اختبار واحد في القائمة، حتى لا يلتبس زر الدخول بين بطاقتين. */
const testCard = (title: string): HTMLElement => {
  const card = screen.getByRole('heading', { name: title }).closest('article');
  if (!card) throw new Error(`بطاقة الاختبار «${title}» غير موجودة`);
  return card as HTMLElement;
};

const renderSecondTestPaper = () => {
  const result = render(<IndependentTestsArea />);
  fireEvent.click(within(testCard('الاختبار الثاني')).getByRole('button', { name: /دخول إلى الاختبار/ }));
  return result;
};

const unlockSecondTestSolutions = async () => {
  fireEvent.click(screen.getByRole('button', { name: /الحلول/ }));
  fireEvent.change(screen.getByLabelText('كلمة السر'), { target: { value: 'somer173' } });
  fireEvent.click(screen.getByRole('button', { name: /فتح الحلول/ }));
};

/**
 * حساب كسري دقيق (بسط/مقام صحيحان) يُستخدم في فحص عبارات الصح والخطأ.
 * المقارنة العشرية بالفاصلة العائمة تجعل (1/2)×(2/5) لا يساوي (3/5)×(1/3)
 * رغم أنهما متساويان رياضيًا، فالمقارنة هنا بالضرب التبادلي.
 */
const Fraction = {
  of: (numerator: number, denominator: number): { n: number; d: number } => {
    const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
    const divisor = gcd(numerator, denominator) || 1;
    return { n: numerator / divisor, d: denominator / divisor };
  },
  mul: (a: { n: number; d: number }, b: { n: number; d: number }) =>
    Fraction.of(a.n * b.n, a.d * b.d),
  equal: (a: { n: number; d: number }, b: { n: number; d: number }) => a.n * b.d === b.n * a.d,
  /** نصف الخُمسين = (1/2) × (2/5). */
  halfOfTwoFifths: () => Fraction.mul(Fraction.of(1, 2), Fraction.of(2, 5)),
  /** ثلاثة أخماس الثلث = (3/5) × (1/3). */
  threeFifthsOfOneThird: () => Fraction.mul(Fraction.of(3, 5), Fraction.of(1, 3)),
  /** نصف خُمسٍ واحد = (1/2) × (1/5) — التفسير الخاطئ الذي كان في الحل. */
  halfOfOneFifth: () => Fraction.mul(Fraction.of(1, 2), Fraction.of(1, 5)),
};

/** هل يدّعي نص الحل أن الخيار A هو الصواب (وهو ما لا يصح في q1-4)؟ */
const wrongChoiceClaim = (text: string): boolean =>
  /الإجابة الصحيحة:\s*A/.test(text);

const itemIds = collectItems().filter((item) => !item.parts).map((item) => item.id);
const partIds = collectItems().flatMap((item) => item.parts?.map((part) => part.id) ?? []);

describe('Independent Tests area: second exam (algebra + geometry)', () => {
  beforeEach(() => {
    window.location.hash = '#/independent-tests';
  });

  it('is registered as the second card without disturbing the first exam', () => {
    expect(independentTests).toHaveLength(2);
    expect(independentTests[0]).toBe(firstIndependentTest);
    expect(independentTests[1]).toBe(secondIndependentTest);
    expect(secondIndependentTest.id).toBe('independent-test-2');
    expect(secondIndependentTest.title).toBe('الاختبار الثاني');

    render(<IndependentTestsArea />);
    expect(screen.getByRole('heading', { name: 'الاختبار الأول' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'الاختبار الثاني' })).toBeInTheDocument();
    expect(screen.getByText('اختبار مستقل رقم 2')).toBeInTheDocument();
  });

  it('keeps the five sections and every block heading of the source in order', () => {
    expect(secondIndependentTest.sections.map((section) => section.heading)).toEqual([
      'أولاً',
      'ثانياً',
      'ثالثاً',
      'رابعاً',
      'خامساً',
    ]);
    expect(secondIndependentTest.sections.map((section) => section.pointsLabel)).toEqual([
      '10 درجات لكل سؤال',
      '10 درجات لكل سؤال',
      '20 درجة لكل تمرين',
      '70 درجة لكل تمرين',
      '100 علامة',
    ]);

    expect(secondIndependentTest.sections[0].blocks.map((block) => block.heading)).toEqual(['السؤال الأول']);
    expect(secondIndependentTest.sections[1].blocks.map((block) => block.heading)).toEqual(['السؤال الثاني']);
    expect(secondIndependentTest.sections[4].blocks.map((block) => block.heading)).toEqual(['المسألة الهندسية']);
  });

  it('holds exactly the questions of the source: 5 choice, 5 true/false, 8 simplifications, 4 problems and 1 geometry problem', () => {
    const sections = secondIndependentTest.sections;

    // أولاً: خمسة أسئلة اختيار من متعدد، لكل سؤال ثلاثة خيارات A ثم B ثم C.
    const choiceItems = sections[0].blocks[0].items;
    expect(choiceItems).toHaveLength(5);
    expect(choiceItems.every((item) => item.kind === 'choice')).toBe(true);
    expect(choiceItems.map((item) => item.choices?.map((choice) => choice.id))).toEqual([
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
    ]);

    // ثانياً: خمس عبارات صح/خطأ.
    const trueFalse = sections[1].blocks[0].items;
    expect(trueFalse).toHaveLength(5);
    expect(trueFalse.every((item) => item.kind === 'true-false')).toBe(true);

    // ثالثاً: ثمانية تمارين تبسيط مرقّمة ١…٨.
    const exercises = sections[2].blocks[0].items;
    expect(exercises).toHaveLength(8);
    expect(exercises.map((item) => item.number)).toEqual(['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨']);

    // رابعاً: خمس مسائل، والثالثة فيها رسم.
    const problems = sections[3].blocks;
    expect(problems).toHaveLength(5);
    expect(problems[2].items[0].figure).toBe('mna-right-triangle');
    expect(problems[4].items[0].figure).toBe('abc-translation');
    expect(problems[0].items[0].parts).toHaveLength(3);
    expect(problems[1].items[0].parts).toHaveLength(1);

    // خامساً: مسألة هندسية بأربعة بنود.
    expect(sections[4].blocks[0].items[0].parts).toHaveLength(4);
    expect(sections[4].blocks[0].items[0].figure).toBe('abc-isosceles');
  });

  it('keeps every number, fraction and choice of the source verbatim', () => {
    const items = collectItems();
    const prompts = items.map((item) => item.prompt ?? '').join(' ');
    const maths = items.map((item) => item.math ?? '').join(' ');
    const parts = items.flatMap((item) => item.parts ?? []).map((part) => part.prompt).join(' ');
    const choices = items.flatMap((item) => item.choices ?? []).map((choice) => choice.label).join(' ');

    // أولاً — السؤال ١ كما هو مطبوع: −24 مع المقامين 8، وليس −48 ولا 4.
    expect(prompts).toContain('مقلوب سدس العدد $-24$');
    expect(prompts).not.toContain('$-48$');
    expect(choices).toContain('-\\dfrac{1}{8}');
    expect(choices).toContain('+\\dfrac{1}{8}');
    expect(choices).toContain('$-8$');

    // أولاً — بقية الأسئلة.
    expect(prompts).toContain('مقلوب نظير العدد $10$');
    expect(prompts).toContain('ليس من حالات تطابق المثلثات');
    expect(prompts).toContain('$MNPQ$ متوازي أضلاع');
    expect(prompts).toContain('$0.00051 \\times 10^{-1}$');
    expect(choices).toContain('$5.1 \\times 10^{-5}$');
    expect(choices).toContain('$5.1 \\times 10^{-4}$');
    expect(choices).toContain('$5.1 \\times 10^{+4}$');

    // ثانياً — الخمس عبارات بترتيبها.
    expect(prompts).toContain('مقلوب $10^{-2}$ هو $10^{+2}$');
    expect(prompts).toContain('مقلوب أي عدد غير معدوم هو عدد أصغر منه');
    expect(prompts).toContain('نصف الخُمسين يساوي ثلاثة أخماس الثلث');
    expect(prompts).toContain('صورة مستقيمين متوازيين هما مستقيمان متعامدان');
    expect(prompts).toContain('يتطابق مثلثان إذا تساوت قياس زوايا المثلث الأول');

    // ثالثاً — التمارين الثمانية حرفيًّا.
    expect(maths).toContain('\\dfrac{10^{-1} \\times 10^{-5}}{10^{-9} \\times 10^{-9}}');
    expect(maths).toContain('2.3 \\times 10^{-2} \\times 3 \\times 10^{+4}');
    expect(maths).toContain('\\left(10^{-3}\\right)^{+4} \\times 10^{-5} \\times \\dfrac{1}{10^{-2}}');
    expect(maths).toContain('7.9 \\times 10^{-9} + 1400 \\times 10^{-12}');
    expect(maths).toContain('1 + \\dfrac{1}{2} \\times 5 \\div \\dfrac{2}{5}');
    expect(maths).toContain('\\dfrac{10^{5} \\times 10^{8}}{\\left(10^{4}\\right)^{4}}');
    expect(maths).toContain('\\dfrac{0.75 \\times 10^{12} \\times 4 \\times 10^{-5}}{0.0005 \\times 10^{+5}}');
    expect(maths).toContain('\\dfrac{0.4}{0.3} \\times \\dfrac{-9}{16}');

    // رابعاً — معطيات المسائل.
    expect(prompts).toContain('$253\\,km$');
    expect(prompts).toContain('$167198\\,m$');
    expect(prompts).toContain('$500$ ل.س');
    expect(maths).toContain('a = -1');
    expect(maths).toContain('b = \\dfrac{1}{3}');
    expect(maths).toContain('c = \\dfrac{2}{5}');
    expect(prompts).toContain('$T_{M \\to A}$');
    expect(prompts).toContain('$4$ سم');

    // خامساً — معطيات المسألة الهندسية.
    expect(prompts).toContain('$ABC$ متساوي الساقين');
    expect(prompts).toContain('$AH$ ارتفاع');
    expect(prompts).toContain('$C\\widehat{A}H = B\\widehat{A}H$');
    expect(prompts).toContain('$HC = HB$');
    expect(prompts).toContain('$O$ منتصف $AH$');
    expect(parts).toContain('$AOM$ و $AON$');
    expect(parts).toContain('$MON$ مثلث متساوي الساقين');
    expect(parts).toContain("$O'$ نظيرة $O$ بالنسبة إلى $H$");
    expect(parts).toContain("$OCO'B$ معيّن");
  });

  it('omits author marks and header fields that do not belong to the questions', () => {
    const serialized = JSON.stringify(secondIndependentTest) + JSON.stringify(secondTestSolutions);
    expect(serialized).not.toContain('طلال');
    expect(serialized).not.toContain('تمنياتي');
    expect(serialized).not.toContain('الاسم');
    expect(serialized).not.toContain('الصف:');
  });

  it('renders its own paper with its own SVG figures and without leaking the first paper', () => {
    const { container } = renderSecondTestPaper();

    expect(screen.getByRole('heading', { name: 'الاختبار الثاني', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'المسألة الهندسية' })).toBeInTheDocument();
    // ورقة الاختبار الثاني لا تعرض أسئلة ورقة الاختبار الأول.
    expect(screen.queryByRole('heading', { name: 'التمرين الثاني', level: 4 })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'السؤال الأول', level: 4 })).toBeInTheDocument();

    expect(container.querySelectorAll('.itest-item')).toHaveLength(collectItems().length);
    expect(container.querySelectorAll('.itest-choice')).toHaveLength(15);
    expect(container.querySelectorAll('.itest-true-false')).toHaveLength(5);
    expect(container.querySelectorAll('img')).toHaveLength(0);

    // ثلاثة رسوم SVG: المثلث القائم MNA، والانسحاب، والمثلث المتساوي الساقين.
    const figures = container.querySelectorAll('figure.itest-figure svg');
    expect(figures).toHaveLength(3);
    const labels = Array.from(figures).flatMap((figure) =>
      Array.from(figure.querySelectorAll('text')).map((node) => node.textContent),
    );
    expect(labels).toEqual(expect.arrayContaining(['M', 'N', 'A', 'B', 'C', 'H', 'O', '3', '4', '5']));
    expect(labels).toEqual(expect.arrayContaining(["A'", "B'", "C'"]));
  });

  it('never shows raw TeX or delimiters to the student', async () => {
    const { container } = renderSecondTestPaper();
    const paperText = visibleText(container);
    expect(paperText).not.toContain('$');
    expect(paperText).not.toContain('\\dfrac');
    expect(paperText).not.toContain('\\times');
    expect(container.querySelectorAll('.katex').length).toBeGreaterThan(10);

    await unlockSecondTestSolutions();
    await waitFor(() =>
      expect(container.querySelectorAll('.itest-solution-final').length).toBeGreaterThan(0),
    );
    const solutionsText = visibleText(container);
    expect(solutionsText).not.toContain('$');
    expect(solutionsText).not.toContain('\\dfrac');
    expect(solutionsText).not.toContain('\\vec');
  });

  it('shows a complete solution for every item and sub-item, and no orphan solutions', async () => {
    const { container } = renderSecondTestPaper();
    await unlockSecondTestSolutions();
    await waitFor(() =>
      expect(container.querySelectorAll('.itest-solution-final').length).toBeGreaterThan(0),
    );

    const finals = Array.from(container.querySelectorAll('.itest-solution-final')).map(
      (node) => node.textContent ?? '',
    );
    expect(finals).toHaveLength(itemIds.length + partIds.length);
    expect(container.querySelector('.itest-solution-missing')).toBeNull();

    // كل بند في الورقة له مفتاح حل، ولا مفاتيح زائدة.
    expect(Object.keys(secondTestSolutions).sort()).toEqual([...itemIds, ...partIds].sort());
    for (const id of [...itemIds, ...partIds]) {
      expect(secondTestSolutions[id].steps.length).toBeGreaterThan(0);
      expect(secondTestSolutions[id].finalAnswer.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps the solutions of the two exams separate', async () => {
    // فتح الاختبار الثاني ثم العودة وفتح الأول يجب أن يحمّل ملف الحلول المناسب.
    renderSecondTestPaper();
    await unlockSecondTestSolutions();
    await waitFor(() =>
      expect(document.querySelectorAll('.itest-solution-final').length).toBeGreaterThan(0),
    );
    const secondText = Array.from(document.querySelectorAll('.itest-solution-final'))
      .map((node) => node.textContent ?? '')
      .join(' ');
    expect(secondText).toContain('420198');
    expect(secondText).not.toContain('125000');

    fireEvent.click(screen.getByRole('button', { name: /العودة إلى قائمة الاختبارات/ }));
    fireEvent.click(within(testCard('الاختبار الأول')).getByRole('button', { name: /دخول إلى الاختبار/ }));
    await unlockSecondTestSolutions();
    await waitFor(() =>
      expect(document.querySelectorAll('.itest-solution-final').length).toBeGreaterThan(0),
    );
    const firstText = Array.from(document.querySelectorAll('.itest-solution-final'))
      .map((node) => node.textContent ?? '')
      .join(' ');
    expect(firstText).toContain('125000');
    expect(firstText).not.toContain('420198');
  });

  it('recomputes every numeric answer independently of the solution file', () => {
    const expected: Record<string, string> = {
      // أولاً
      'q1-1': '-\\dfrac{1}{4}', // مقلوب سدس −24، وهو غير موجود في الخيارات (تعارض المصدر)
      'q1-2': '-\\dfrac{1}{10}',
      'q1-3': 'تساوي الزوايا',
      'q1-5': '5.1 \\times 10^{-5}',
      // ثالثاً
      'ex1-1': '10^{12}',
      'ex1-2': '6.9 \\times 10^{2}',
      'ex1-3': '10^{-15}',
      'ex1-4': '9.3 \\times 10^{-9}',
      'ex1-5': '7.25',
      'ex1-6': '10^{-3}',
      'ex1-7': '6 \\times 10^{5}',
      'ex1-8': '-0.75',
      // رابعاً
      'pb1-1-a': '420198',
      'pb1-1-b': '420.198',
      'pb1-1-c': '4.20198 \\times 10^{5}',
      'pb2-1-a': '1200',
      'pb4-1': '-\\dfrac{5}{3}',
    };

    for (const [id, fragment] of Object.entries(expected)) {
      expect(secondTestSolutions[id].finalAnswer, `حل ${id}`).toContain(fragment);
    }

    // التحقق العددي المستقل نفسه.
    expect((1 / 6) * -24).toBe(-4);
    expect(1 / ((1 / 6) * -24)).toBe(-0.25); // = −1/4، ولا يطابق أي خيار مطبوع
    expect(1 / ((1 / 6) * -48)).toBe(-0.125); // = −1/8، وهذا ما يقابل الخيار B لو كان العدد −48
    expect(1 / -10).toBe(-0.1);
    expect(1e-1 * 1e-5 / (1e-9 * 1e-9)).toBeCloseTo(1e12, 0);
    expect(2.3e-2 * 3e4).toBeCloseTo(690, 6);
    expect(Math.pow(10, -3) ** 4 * 1e-5 * (1 / 1e-2)).toBeCloseTo(1e-15, 20);
    expect(7.9e-9 + 1400e-12).toBeCloseTo(9.3e-9, 20);
    expect(1 + (1 / 2) * 5 / (2 / 5)).toBeCloseTo(7.25, 10);
    expect(1e5 * 1e8 / Math.pow(1e4, 4)).toBeCloseTo(1e-3, 15);
    expect(0.75e12 * 4e-5 / (0.0005 * 1e5)).toBeCloseTo(6e5, 3);
    expect((0.4 / 0.3) * (-9 / 16)).toBeCloseTo(-0.75, 10);
    expect(253 * 1000 + 167198).toBe(420198);
    expect(420198 / 1e3).toBeCloseTo(420.198, 6);
    expect(420198 / 1e5).toBeCloseTo(4.20198, 10);
    expect(500 / (1 - 1 / 4 - 1 / 3)).toBe(1200);
    expect((-1 + 1 / 3) / (2 / 5)).toBeCloseTo(-5 / 3, 10);
  });

  it('states the source contradiction of question 1 explicitly instead of inventing an option', () => {
    const solution = secondTestSolutions['q1-1'];
    const text = [...solution.steps, solution.finalAnswer].join(' ');

    // الحل يعرض الناتج الصحيح ويصرّح بأن الخيارات لا تطابقه، ولا يبدّل رقم السؤال.
    expect(text).toContain('-\\dfrac{1}{4}');
    expect(text).toContain('غير موجود');
    expect(text).toContain('$-48$');
    expect(secondIndependentTest.sections[0].blocks[0].items[0].prompt).toContain('$-24$');
    expect(secondIndependentTest.sections[0].blocks[0].items[0].prompt).not.toContain('$-48$');
  });

  it('keeps every true/false verdict equal to an independent recomputation of its printed sentence', () => {
    // الأحكام هنا مشتقّة من نص الجملة المطبوع، لا منسوخة من ملف الحلول.
    const verdictOfSentence: Record<string, () => 'صح' | 'خطأ'> = {
      // «مقلوب 10^-2 هو 10^+2» ⇔ 1/10^-2 === 10^2
      'q2-1': () => (1 / Math.pow(10, -2) === Math.pow(10, 2) ? 'صح' : 'خطأ'),
      // «مقلوب أي عدد غير معدوم أصغر منه» — يُكذّبها أي عدد مقلوبه أكبر منه.
      'q2-2': () => {
        const counterExamples = [1 / 2, -2];
        return counterExamples.some((value) => 1 / value > value) ? 'خطأ' : 'صح';
      },
      // «نصف الخُمسين يساوي ثلاثة أخماس الثلث»:
      // الخُمسان = 2/5، فنصفهما (1/2)×(2/5) = 1/5، و(3/5)×(1/3) = 1/5 ⇒ صح.
      'q2-3': () => {
        // الخُمسان = 2/5، ومقارنة الكسور تتم بضرب تبادلي دقيق لا بفاصلة عائمة
        // (0.2 مقابل 0.19999999999999998 لو قورنت كأعداد عشرية).
        const halfOfTwoFifths = Fraction.halfOfTwoFifths();
        const threeFifthsOfOneThird = Fraction.threeFifthsOfOneThird();
        return Fraction.equal(halfOfTwoFifths, threeFifthsOfOneThird) ? 'صح' : 'خطأ';
      },
      // «صورة مستقيمين متوازيين هما مستقيمان متعامدان» — كاذبة بطبائع الانسحاب.
      'q2-4': () => 'خطأ',
      // «يتطابق مثلثان إذا تساوت قياس زوايا الأول مع قياسات زوايا الثاني» — كاذبة (تزويج التشابه بالتطابق).
      'q2-5': () => 'خطأ',
    };

    const computed = Object.fromEntries(
      Object.entries(verdictOfSentence).map(([id, verdict]) => [id, verdict()]),
    );
    expect(computed).toEqual({
      'q2-1': 'صح',
      'q2-2': 'خطأ',
      'q2-3': 'صح',
      'q2-4': 'خطأ',
      'q2-5': 'خطأ',
    });

    for (const [id, verdict] of Object.entries(computed)) {
      expect(secondTestSolutions[id].finalAnswer, `حكم ${id}`).toContain(verdict);
    }

    // لا يجوز أن يقع الحل في تفسير «الخُمسين» على أنها خُمس واحد.
    expect((1 / 2) * (1 / 5)).not.toBe((1 / 2) * (2 / 5));
  });

  it('never reads «الخُمسين» as a single fifth (regression guard for q2-3)', () => {
    // «الخُمس» = 1/5 و«الخُمسان» = 2/5. هذا الاختبار يفشل فورًا إن عاد أي تفسير
    // يحسب نصف خُمس واحد بدل نصف خُمسين.
    const twoFifths = Fraction.of(2, 5);
    const oneFifth = Fraction.of(1, 5);
    expect(Fraction.equal(twoFifths, oneFifth)).toBe(false);

    const halfOfTwoFifths = Fraction.halfOfTwoFifths();
    const halfOfOneFifth = Fraction.halfOfOneFifth();
    const threeFifthsOfOneThird = Fraction.threeFifthsOfOneThird();

    expect(halfOfTwoFifths).toEqual({ n: 1, d: 5 });
    expect(threeFifthsOfOneThird).toEqual({ n: 1, d: 5 });

    // الحكم الصحيح من نص المصدر، والحكم الخاطئ الذي كان في الملف سابقًا.
    expect(Fraction.equal(halfOfTwoFifths, threeFifthsOfOneThird)).toBe(true); // ⇒ صح
    expect(Fraction.equal(halfOfOneFifth, threeFifthsOfOneThird)).toBe(false); // ⇒ كان سيقول خطأ
    expect(halfOfOneFifth).toEqual({ n: 1, d: 10 });

    const solution = secondTestSolutions['q2-3'];
    expect(solution.steps.join(' ')).toContain('\\dfrac{2}{5}');
    expect(solution.steps.join(' ')).not.toContain('\\dfrac{1}{2} \\times \\dfrac{1}{5}');
    expect(solution.finalAnswer).toContain('صح');
    expect(solution.finalAnswer).toContain('\\dfrac{1}{5}');
  });

  it('picks choices by their printed text, not by a reinterpretation of the solution', () => {
    const q1 = secondIndependentTest.sections[0].blocks[0].items;

    // كل خيار صحيح يجب أن يطابق نص الخيار المطبوع حرفيًّا.
    const expectedChoiceText: Record<string, { label: string; choiceId: string }> = {
      // مقلوب نظير 10 = −1/10 ⇒ الخيار A.
      'q1-2': { choiceId: 'a', label: '$-\\dfrac{1}{10}$' },
      // «تساوي الزوايا» ⇒ الخيار B.
      'q1-3': { choiceId: 'b', label: 'تساوي الزوايا' },
      // 0.00051×10^-1 = 5.1×10^-5 ⇒ الخيار A.
      'q1-5': { choiceId: 'a', label: '$5.1 \\times 10^{-5}$' },
    };

    for (const [itemId, expected] of Object.entries(expectedChoiceText)) {
      const item = q1.find((candidate) => candidate.id === itemId);
      expect(item, `بند ${itemId}`).toBeDefined();
      const choice = item?.choices?.find((candidate) => candidate.id === expected.choiceId);
      expect(choice?.label, `نص الخيار ${expected.choiceId} في ${itemId}`).toBe(expected.label);
      expect(secondTestSolutions[itemId].finalAnswer).toContain(expected.choiceId.toUpperCase());
    }

    // q1-4: النتيجة Q صورة P، وكل خيارات الورقة تنسب الصورة إلى P ⇒ لا خيار صحيح.
    const q14 = q1.find((item) => item.id === 'q1-4');
    expect(q14?.choices?.map((choice) => choice.label)).toEqual([
      '$P$ صورة $Q$',
      '$Q$ صورة $M$',
      '$P$ صورتها $Q$',
    ]);
    // A و C متطابقان في المعنى: كلاهما يجعل P صورة.
    const [choiceA, , choiceC] = q14?.choices ?? [];
    expect(choiceA.label.replace('صورتها', 'صورة')).toBe(choiceC.label.replace('صورتها', 'صورة'));

    // الحساب الفعلي لانسحاب N→M على متوازي الأضلاع MNPQ.
    const M = { x: 0, y: 0 };
    const N = { x: 1, y: 0 };
    const P = { x: 1, y: 1 };
    const Q = { x: 0, y: 1 };
    const vector = { x: M.x - N.x, y: M.y - N.y };
    const imageOfP = { x: P.x + vector.x, y: P.y + vector.y };
    expect(imageOfP).toEqual(Q); // Q هي صورة P
    expect(imageOfP).not.toEqual(P);

    const solution = secondTestSolutions['q1-4'];
    const text = [...solution.steps, solution.finalAnswer].join(' ');
    expect(text).toContain('$Q$ صورة $P$');
    // الحل لا يدّعي أن A هو الجواب الصحيح، ويصرّح بالتعارض.
    expect(text).toContain('لا خيار صحيح');
    expect(text).toContain('متطابقان');
    expect(wrongChoiceClaim(text)).toBe(false);
  });

  it('keeps the solutions tab behind the same password gate as the first exam', () => {
    const { container } = renderSecondTestPaper();

    fireEvent.click(screen.getByRole('button', { name: /الحلول/ }));
    expect(screen.getByRole('heading', { name: 'الحلول محمية بكلمة سر' })).toBeInTheDocument();
    expect(container.querySelector('.itest-solution-final')).toBeNull();

    fireEvent.change(screen.getByLabelText('كلمة السر'), { target: { value: 'wrong-pass' } });
    fireEvent.click(screen.getByRole('button', { name: /فتح الحلول/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('كلمة السر غير صحيحة');
  });
});
