import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import IndependentTestsArea from '../components/independent-tests/IndependentTestsArea';
import {
  firstIndependentTest,
  independentTests,
} from '../data/independent-tests/first-test';
import { firstTestSolutions } from '../data/independent-tests/first-test-solutions';
import type { IndependentTestItem } from '../data/independent-tests/types';

const collectItems = (test = firstIndependentTest): IndependentTestItem[] =>
  test.sections.flatMap((section) => section.blocks.flatMap((block) => block.items));

/**
 * كل بند يحتاج حلًّا: البنود المفردة، وكل بند فرعي على حدة.
 * أما البنود التي تُرقَّم بنودها الفرعية في المصدر (التمرين الثالث والمسألتان)
 * فحلّها موزّع على بنودها الفرعية، فلا حل مستقل للبند الأم.
 */
/** النص المرئي فقط: تُستثنى نسخة MathML التي تحمل TeX للقارئ الشاشي. */
const visibleText = (root: HTMLElement): string => {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return clone.textContent ?? '';
};

const allItemIds = collectItems().filter((item) => !item.parts).map((item) => item.id);
const allPartIds = collectItems().flatMap((item) => item.parts?.map((part) => part.id) ?? []);

describe('Independent Tests area: first exam (algebra + geometry)', () => {
  beforeEach(() => {
    window.location.hash = '#/independent-tests';
  });

  it('keeps the paper order of the source: two questions, three exercises, two problems', () => {
    expect(independentTests).toHaveLength(1);
    const headings = firstIndependentTest.sections.map((section) => section.heading);
    expect(headings).toEqual(['أولاً', 'ثانياً', 'ثالثاً']);

    expect(firstIndependentTest.sections[0].blocks.map((block) => block.heading))
      .toEqual(['السؤال الأول', 'السؤال الثاني']);
    expect(firstIndependentTest.sections[1].blocks.map((block) => block.heading))
      .toEqual(['التمرين الأول', 'التمرين الثاني', 'التمرين الثالث']);
    expect(firstIndependentTest.sections[2].blocks.map((block) => block.heading))
      .toEqual(['المسألة الأولى', 'المسألة الثانية']);

    // السؤال الأول: أربعة بنود بثلاثة خيارات لكل بند، بترتيب A ثم B ثم C.
    const choices = firstIndependentTest.sections[0].blocks[0].items;
    expect(choices).toHaveLength(4);
    expect(choices.every((item) => item.choices?.length === 3)).toBe(true);
    expect(choices.map((item) => item.choices?.map((choice) => choice.id)))
      .toEqual([['a', 'b', 'c'], ['a', 'b', 'c'], ['a', 'b', 'c'], ['a', 'b', 'c']]);

    // السؤال الثاني: أربع عبارات صح/خطأ.
    expect(firstIndependentTest.sections[0].blocks[1].items.every((item) => item.kind === 'true-false'))
      .toBe(true);

    // المسألة الثانية: خمسة بنود مطلوبة.
    expect(firstIndependentTest.sections[2].blocks[1].items[0].parts).toHaveLength(5);

    // تصحيح المصطلح في نص السؤال والحل، لا في الحل وحده.
    const congruencePrompt = firstIndependentTest.sections[2].blocks[1].items[0].parts?.[0].prompt ?? '';
    expect(congruencePrompt).toContain('طبوقان');
    expect(congruencePrompt).not.toContain('طبقان');
  });

  it('keeps every number, fraction and choice of the source verbatim', () => {
    const items = collectItems();
    const prompts = items.map((item) => item.prompt ?? '').join(' ');
    const maths = items.map((item) => item.math ?? '').join(' ');

    // أعداد السؤال الأول
    expect(prompts).toContain('(0.01)^{-1}');
    expect(prompts).toContain('\\dfrac{18}{5}');
    expect(prompts).toContain('67 \\times 10^{4}');
    // Preserve the original order of the printed true/false equation.
    expect(prompts).toContain('$2 - xy = 3$');
    expect(prompts).not.toContain('$3 = xy - 2$');
    expect(firstTestSolutions['q2-3'].finalAnswer).toContain('صح');
    expect(firstTestSolutions['q2-3'].finalAnswer).toContain('$2 - xy = 3$');
    expect(firstTestSolutions['q2-3'].finalAnswer).not.toContain('$xy - 2$');
    const congruenceSolution = firstTestSolutions['pb2-1-a'];
    const congruenceText = [...congruenceSolution.steps, congruenceSolution.finalAnswer].join(' ');
    expect(congruenceText).toContain('طبوقان');
    expect(congruenceText).not.toContain('طبقان');
    // كسور التمرين الأول
    expect(maths).toContain('1 - \\dfrac{-5 - \\dfrac{13}{4}}{2 + \\dfrac{7}{2}}');
    expect(maths).not.toContain('1 - \\dfrac{\\dfrac{13}{4} - 5}{2 + \\dfrac{7}{2}}');
    expect(maths).toContain('\\left(-6 + \\dfrac{8}{3}\\right)\\left(6 - \\dfrac{3}{4}\\right)');
    // التمرين الثاني والثالث
    expect(maths).toContain('\\dfrac{35 \\times 10^{5} \\times 25 \\times 10^{0}}{10^{-3} \\times 0.07 \\times 10^{7}}');
    expect(maths).toContain('A = \\dfrac{3}{4}\\left(\\dfrac{16}{9}x - \\dfrac{8}{3}\\right)');
    // معطيات المسألة الثانية
    expect(prompts).toContain('$MB = 5$');
    expect(prompts).toContain('$NC = 3$');
    expect(prompts).toContain('$AD = 4$');
    expect(prompts).toContain('$BC \\perp DC$');
    expect(prompts).toContain('$DA \\perp AB$');
  });

  it('omits identifying details that do not belong to the questions', () => {
    const serialized = JSON.stringify(firstIndependentTest) + JSON.stringify(firstTestSolutions);
    expect(serialized).not.toContain('نزار');
    expect(serialized).not.toContain('0988524392');
    expect(serialized).not.toContain('دمشق');
    expect(serialized).not.toContain('المذكرة');
    expect(serialized).not.toContain('انتهت الأسئلة');
  });

  it('renders the questions paper with the re-created geometry figure', () => {
    const { container } = render(<IndependentTestsArea />);

    expect(screen.getByRole('heading', { name: 'اختبارات مستقلة' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'السؤال الأول' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'المسألة الثانية' })).toBeInTheDocument();
    // 14 بندًا في الورقة، و12 خيارًا في السؤال الأول، و4 عبارات صح/خطأ.
    expect(container.querySelectorAll('.itest-item')).toHaveLength(collectItems().length);
    expect(container.querySelectorAll('.itest-choice')).toHaveLength(12);
    expect(container.querySelectorAll('.itest-true-false')).toHaveLength(4);

    // الشكل الهندسي أُعيد إنشاؤه بـ SVG، لا بصورة من الورقة.
    const figure = container.querySelector('figure.itest-figure svg');
    expect(figure).toBeInTheDocument();
    expect(container.querySelectorAll('img')).toHaveLength(0);
    const labels = Array.from(figure?.querySelectorAll('text') ?? []).map((node) => node.textContent);
    expect(labels).toEqual(expect.arrayContaining(['A', 'B', 'C', 'D', 'M', 'N', 'O', '5', '3']));
    // الضلعان المتعامدان معلَّمان، والقياسان المطبوعة في المصدر فقط (5 و 3) لا غيرهما.
    expect(figure?.querySelectorAll('polyline')).toHaveLength(2);
    expect(labels).not.toContain('4');

    // لا تُعرض أي حلول في تبويب الأسئلة.
    expect(container.querySelector('.itest-solution-final')).toBeNull();
  });

  it('never shows raw TeX or delimiters to the student', async () => {
    const { container } = render(<IndependentTestsArea />);
    const paperText = visibleText(container);
    expect(paperText).not.toContain('$');
    expect(paperText).not.toContain('\\dfrac');
    expect(paperText).not.toContain('\\perp');
    expect(container.querySelectorAll('.katex').length).toBeGreaterThan(10);

    fireEvent.click(screen.getByRole('button', { name: /الحلول/ }));
    fireEvent.change(screen.getByLabelText('كلمة السر'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: /فتح الحلول/ }));
    await waitFor(() => expect(container.querySelectorAll('.itest-solution-final').length).toBeGreaterThan(0));

    const solutionsText = visibleText(container);
    expect(solutionsText).not.toContain('$');
    expect(solutionsText).not.toContain('\\dfrac');
    expect(solutionsText).not.toContain('\\vec');
  });

  it('keeps the solutions tab behind the existing password gate', () => {
    const { container } = render(<IndependentTestsArea />);

    fireEvent.click(screen.getByRole('button', { name: /الحلول/ }));
    expect(screen.getByRole('heading', { name: 'الحلول محمية بكلمة سر' })).toBeInTheDocument();
    expect(container.querySelector('.itest-solution-final')).toBeNull();

    fireEvent.change(screen.getByLabelText('كلمة السر'), { target: { value: 'wrong-pass' } });
    fireEvent.click(screen.getByRole('button', { name: /فتح الحلول/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('كلمة السر غير صحيحة');
  });

  it('shows a complete solution for every question and sub-question after unlocking', async () => {
    const { container } = render(<IndependentTestsArea />);

    fireEvent.click(screen.getByRole('button', { name: /الحلول/ }));
    fireEvent.change(screen.getByLabelText('كلمة السر'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: /فتح الحلول/ }));

    await waitFor(() => expect(container.querySelectorAll('.itest-solution-final').length).toBeGreaterThan(0));

    const finals = Array.from(container.querySelectorAll('.itest-solution-final')).map(
      (node) => node.textContent ?? '',
    );
    expect(finals).toHaveLength(allItemIds.length + allPartIds.length);
    expect(finals.join(' ')).toContain('10^{2}');
    expect(finals.join(' ')).toContain('32');
    expect(finals.join(' ')).toContain('1.25');
    expect(container.querySelector('.itest-solution-missing')).toBeNull();

    // الحل الهندسي يُعيد استخدام الرسم عبر SVG.
    expect(container.querySelectorAll('.itest-solution-card figure.itest-figure svg').length)
      .toBeGreaterThanOrEqual(2);

    // الرجوع إلى الأسئلة يُغلق الحلول من جديد.
    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى الأسئلة' }));
    expect(container.querySelector('.itest-solution-final')).toBeNull();
    expect(screen.getByRole('heading', { name: 'السؤال الأول' })).toBeInTheDocument();
  });

  it('registers one solution per question id and no orphan solutions', () => {
    const expectedIds = [...allItemIds, ...allPartIds].sort();
    expect(Object.keys(firstTestSolutions).sort()).toEqual(expectedIds);
    for (const id of expectedIds) {
      expect(firstTestSolutions[id].steps.length).toBeGreaterThan(0);
      expect(firstTestSolutions[id].finalAnswer.trim().length).toBeGreaterThan(0);
    }
  });
});
