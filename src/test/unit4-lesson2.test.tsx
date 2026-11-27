import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { getLessonById, getUnitById } from '../data/curriculum';
import { unit4Lesson2Data } from '../data/unit4/lesson02';
import { unit4Lesson2TeacherSolutions } from '../data/unit4/lesson02TeacherSolutions';
import sourceAudit from '../data/unit4/lesson02.source-audit.json';
import { StepRenderer } from '../components/lesson/StepRenderer';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { EquationStepsLab, parseAmount } from '../components/interactive/EquationStepsLab';
import { getTestsByType, resolveTest } from '../data/tests/registry';
import { conceptProfileForLesson } from '../data/tests/concepts';
import { blueprintForLesson } from '../data/tests/blueprints';
import { gradeQuestion, scoreTest } from '../data/tests/scoring';
import { unit4Lesson2TestQuestions } from '../data/tests/unit4/lesson-2';
import type { QuestionAnswer } from '../data/tests/types';
import { QuestionRenderer } from '../components/tests/QuestionRenderer';

const LESSON_ID = 'u4-lesson-2';
const TEST_ID = 'u4-test-lesson-2';
const OFFICIAL_TITLE = 'حل معادلة';

const EXPECTED_TEST_ANSWERS: Record<string, QuestionAnswer> = {
  'u4-l2-01': 'b',
  'u4-l2-02': true,
  'u4-l2-03': '11',
  'u4-l2-04': 'a',
  'u4-l2-05': 'c',
  'u4-l2-06': '15',
  'u4-l2-07': 'b',
  'u4-l2-08': ['b', 'd', 'a', 'c'],
  'u4-l2-09': ['A', 'B', 'C'],
  'u4-l2-10': '5',
  'u4-l2-11': 'a',
  'u4-l2-12': 'b',
  'u4-l2-13': '-8',
  'u4-l2-14': 'a',
  'u4-l2-15': 'a',
  'u4-l2-16': ['A', 'B'],
  'u4-l2-17': 'a',
  'u4-l2-18': 'b',
  'u4-l2-19': false,
  'u4-l2-20': 'b',
};

describe('Unit 4, Lesson 2 — identity and source fidelity', () => {
  it('registers «حل معادلة» as lesson 2 over pages 72–74', () => {
    const lesson = getLessonById('unit-4', LESSON_ID);
    expect(lesson).toBe(unit4Lesson2Data);
    expect(lesson!.number).toBe(2);
    expect(lesson!.title).toBe(OFFICIAL_TITLE);
    expect(lesson!.unitTitle).toBe('الوحدة الرابعة: معادلات من الدرجة الأولى');
    expect(lesson!.sourcePages).toEqual([72, 73, 74]);
    expect(unit4Lesson2Data.steps).toHaveLength(13);
    for (const step of unit4Lesson2Data.steps) {
      expect(step.sourcePages.every((page) => page >= 72 && page <= 74), step.id).toBe(true);
    }
    // الوحدة لم تتغيّر بنيوياً بإضافة الدرس الثاني.
    expect(getUnitById('unit-4')!.lessons.map((entry) => entry.id)).toEqual([
      'u4-lesson-1',
      'u4-lesson-2',
      'u4-lesson-3',
      'u4-lesson-4',
    ]);
  });

  it('maps the audited block sequence, including the three rectangle sub-items, in exact order', () => {
    const nonAuthored = unit4Lesson2Data.steps
      .flatMap((step) => step.blocks)
      .filter((block) => !block.authored);
    expect(nonAuthored.map((block) => block.id)).toEqual(sourceAudit.bookBlockSequence);
    expect(sourceAudit.unresolvedAmbiguities).toEqual([]);
    expect(sourceAudit.sourceFiles.map((file) => file.page)).toEqual([72, 73, 74]);
  });

  it('documents the blank step chains and the corrected brackets example', () => {
    const blocks = unit4Lesson2Data.steps.flatMap((step) => step.blocks);
    const check1 = blocks.find((block) => block.id === 'p73-check-1')!;
    expect(check1.subItems).toHaveLength(4);
    for (const item of check1.subItems!) {
      expect(item.verifyNote, item.label).toBeDefined();
    }

    const bracket = blocks.find((block) => block.id === 'p72-solve-bracket-worked')!;
    const joined = [bracket.content, ...(bracket.subItems ?? []).map((item) => item.math ?? '')].join(' ');
    expect(joined).toContain('x = -1');
    expect(joined).not.toContain('x = -2');
  });

  it('ships teacher solutions with origin tags and resolvable block ids', () => {
    expect(unit4Lesson2TeacherSolutions).toHaveLength(40);
    const blockIds = new Set(unit4Lesson2Data.steps.flatMap((step) => step.blocks).map((block) => block.id));
    for (const solution of unit4Lesson2TeacherSolutions) {
      expect(['الكتاب', 'مُشتقة من المنصة']).toContain(solution.answerOrigin);
      expect(solution.steps.length).toBeGreaterThanOrEqual(2);
      expect(solution.principle.length).toBeGreaterThan(5);
      expect(blockIds.has(solution.blockId), solution.blockId).toBe(true);
    }
  });
});

describe('Unit 4, Lesson 2 — rendering and labs', () => {
  it('renders every step with zero KaTeX parse errors', () => {
    unit4Lesson2Data.steps.forEach((step, index) => {
      const { container, unmount } = render(
        <StepRenderer step={step} stepIndex={index} totalSteps={unit4Lesson2Data.steps.length} />,
      );
      expect(container.querySelectorAll('.katex-error'), step.id).toHaveLength(0);
      unmount();
    });
  });

  it('accepts only operations that preserve the solution set in the steps lab', () => {
    const { container } = render(
      <EquationStepsLab left={{ a: { n: 5, d: 1 }, b: { n: -6, d: 1 } }} right={{ a: { n: 0, d: 1 }, b: { n: 14, d: 1 } }} />,
    );
    const apply = () => [...container.querySelectorAll('button')]
      .find((button) => button.textContent?.includes('طبّق على الطرفين'))!;

    // عملية تُغيّر الحلّ (الضرب في 0) مرفوضة.
    const select = container.querySelector('select') as HTMLSelectElement;
    const input = container.querySelector('input[type="text"]') as HTMLInputElement;
    fireEvent.change(select, { target: { value: 'mul' } });
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(apply());
    expect(container.querySelector('.u4-steps-message.is-bad')).toBeTruthy();

    // إضافة 6 إلى الطرفين تحفظ الحلّ ثم القسمة على 5 تصل إلى صيغة الحلّ.
    fireEvent.change(select, { target: { value: 'add' } });
    fireEvent.change(input, { target: { value: '6' } });
    fireEvent.click(apply());
    expect(container.querySelector('.u4-steps-message.is-ok')).toBeTruthy();
    fireEvent.change(select, { target: { value: 'div' } });
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.click(apply());
    expect(container.querySelector('.u4-steps-status')?.textContent).toContain('وصلت إلى الحلّ');
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
  });

  it('turns decimal operands into exact fractions instead of binary floating-point fractions', () => {
    // العدد 0.1 لا يُخزَّن تخزينًا تامًّا في الفاصلة العائمة؛ التحويل يجب أن يبنيه
    // من خانات النصّ نفسها (1/10) لا من `rat(Number('0.1'))`.
    expect(parseAmount('0.1')).toEqual({ value: { n: 1, d: 10 }, label: '0.1' });
    expect(parseAmount('0.25')).toEqual({ value: { n: 1, d: 4 }, label: '0.25' });
    expect(parseAmount('1.5')).toEqual({ value: { n: 3, d: 2 }, label: '1.5' });
    expect(parseAmount('-0.2')).toEqual({ value: { n: -1, d: 5 }, label: '-0.2' });
    expect(parseAmount('2')).toEqual({ value: { n: 2, d: 1 }, label: '2' });
    expect(parseAmount('٠٫٥')).toEqual({ value: { n: 1, d: 2 }, label: '0.5' });

    // مدخلات غير صالحة تُرفض بدل أن تُقرأ صفرًا.
    for (const invalid of ['', 'abc', '1.2.3', '1/2', '1234567890123456']) {
      expect(parseAmount(invalid), invalid).toBeNull();
    }

    // داخل المختبر: القسمة على 0.5 تحفظ الحلّ وتُعرض بالكسور الصحيحة.
    const { container } = render(
      <EquationStepsLab left={{ a: { n: 2, d: 1 }, b: { n: 0, d: 1 } }} right={{ a: { n: 0, d: 1 }, b: { n: 8, d: 1 } }} />,
    );
    const select = container.querySelector('select') as HTMLSelectElement;
    const input = container.querySelector('input[type="text"]') as HTMLInputElement;
    const apply = () => [...container.querySelectorAll('button')]
      .find((button) => button.textContent?.includes('طبّق على الطرفين'))!;

    fireEvent.change(select, { target: { value: 'div' } });
    fireEvent.change(input, { target: { value: '0.5' } });
    fireEvent.click(apply());
    expect(container.querySelector('.u4-steps-message.is-ok')).toBeTruthy();

    const history = container.querySelector('.u4-steps-history')!;
    expect(history.textContent).toContain('0.5');
    // لا كسر ثنائي مزيّف (3602879701896397/…) من الفاصلة العائمة.
    expect(history.textContent).not.toMatch(/3602879|1801439|9007199/);
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);

    // عدد سالب عشري: الضرب في −0.2 يحفظ الحلّ ويُعرض بالكسر −1/5.
    fireEvent.change(select, { target: { value: 'mul' } });
    fireEvent.change(input, { target: { value: '-0.2' } });
    fireEvent.click(apply());
    expect(container.querySelector('.u4-steps-message.is-ok')).toBeTruthy();
    expect(container.querySelector('.u4-steps-history')!.textContent).not.toMatch(/3602879|1801439|9007199/);

    // قيمة غير عددية: رسالة خطأ ولا تغيير في المعادلة.
    const before = container.querySelector('.u4-steps-current')!.textContent;
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(apply());
    expect(container.querySelector('.u4-steps-message.is-bad')).toBeTruthy();
    expect(container.querySelector('.u4-steps-current')!.textContent).toBe(before);
  });

  it('shows the four mental-arithmetic diagrams and the rectangle figure without KaTeX errors', () => {
    const { container } = render(
      <StepRenderer step={unit4Lesson2Data.steps[0]} stepIndex={0} totalSteps={unit4Lesson2Data.steps.length} />,
    );
    expect(container.querySelectorAll('.u4-tiles-figure svg')).toHaveLength(1);
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);

    const rectangleStep = unit4Lesson2Data.steps[unit4Lesson2Data.steps.length - 1];
    const rectangle = render(
      <StepRenderer step={rectangleStep} stepIndex={12} totalSteps={unit4Lesson2Data.steps.length} />,
    );
    expect(rectangle.container.querySelectorAll('.u4-rectangle-figure svg')).toHaveLength(1);
    expect(rectangle.container.querySelectorAll('.katex-error')).toHaveLength(0);
  });

  it('unlocks the Teacher Area and lists this lesson', () => {
    sessionStorage.clear();
    const { container } = render(<TeacherArea onNavigateHome={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/كلمة المرور/), { target: { value: 'somer173' } });
    fireEvent.submit(container.querySelector('form')!);
    const tabs = screen.getAllByRole('button', { name: new RegExp(OFFICIAL_TITLE) });
    fireEvent.click(tabs[0]);
    expect(container.querySelectorAll('.ta-solution').length).toBe(unit4Lesson2TeacherSolutions.length);
  });
});

describe('Unit 4, Lesson 2 — `u4-l2-05` shows the value table it asks about', () => {
  it('renders the 2x+1 table inside the question itself with every printed value', () => {
    const question = unit4Lesson2TestQuestions.find((entry) => entry.id === 'u4-l2-05')!;
    const { container } = render(<QuestionRenderer question={question} questionNumber={5} answer={undefined} onChange={() => {}} />);

    // الجدول موجود في نصّ السؤال نفسه، فلا إحالة إلى جدول غائب.
    const rows = [...container.querySelectorAll('mtr')].map((row) => row.textContent);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toContain('x');
    for (const value of ['0', '2', '4', '6']) expect(rows[0]).toContain(value);
    for (const value of ['1', '5', '9', '13']) expect(rows[1]).toContain(value);
    expect(container.querySelectorAll('mtd')).toHaveLength(10);
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
    // الجدول يُعرض كتلةً مستقلّة ($$…$$) تحت نصّ السؤال، لا حشوًا داخل السطر.
    expect(container.querySelectorAll('.katex-display')).toHaveLength(1);

    // لا يظهر TeX خامًا للطالب: نقرأ النصّ المرئي بعد إسقاط نسخة MathML
    // (التي تحمل تعبير المصدر في <annotation> عمدًا لقارئ الشاشة).
    const visible = container.querySelector('.test-question-prompt')!.cloneNode(true) as HTMLElement;
    visible.querySelectorAll('.katex-mathml, annotation').forEach((node) => node.remove());
    expect(visible.textContent).not.toContain('begin{array}');
    expect(visible.textContent).not.toContain('\\hline');

    // الجواب نفسه: القيمة 9 تقابل x = 4، والمشتتات ما زالت ثلاثة أعداد أخرى.
    expect(question.type).toBe('single-choice');
    expect(gradeQuestion(question, 'c')).toBe(true);
    for (const wrong of ['a', 'b', 'd']) expect(gradeQuestion(question, wrong)).toBe(false);
  });
});

describe('Unit 4, Lesson 2 — independent 20-question lesson test (`u4-test-lesson-2`)', () => {
  it('satisfies the blueprint and grades all 20 correct answers exactly', () => {
    const resolved = resolveTest(TEST_ID);
    expect(resolved).toBeDefined();
    expect(resolved!.title).toBe('اختبار الدرس الثاني: حل معادلة');
    expect(resolved!.questionCount).toBe(20);
    expect(unit4Lesson2TestQuestions).toHaveLength(20);
    expect(conceptProfileForLesson(LESSON_ID)!.concepts).toHaveLength(7);
    expect(blueprintForLesson(LESSON_ID)).toBeDefined();

    const difficultyCounts = { basic: 0, intermediate: 0, advanced: 0, reasoning: 0 };
    const types = new Set<string>();
    for (const question of resolved!.questions) {
      difficultyCounts[question.difficulty] += 1;
      types.add(question.type);
      expect(gradeQuestion(question, EXPECTED_TEST_ANSWERS[question.id]), question.id).toBe(true);
    }
    expect(difficultyCounts).toEqual({ basic: 6, intermediate: 7, advanced: 4, reasoning: 3 });
    expect(types.size).toBeGreaterThanOrEqual(4);

    const fullScore = scoreTest(resolved!.questions, EXPECTED_TEST_ANSWERS);
    expect(fullScore.percentage).toBe(100);

    const wrong = { ...EXPECTED_TEST_ANSWERS, 'u4-l2-13': '8', 'u4-l2-09': ['A', 'D'] };
    expect(scoreTest(resolved!.questions, wrong).correctCount).toBe(18);
  });

  it('adds no Unit 4 unit test', () => {
    expect(getTestsByType('unit').some((test) => test.unitId === 'unit-4')).toBe(false);
  });
});
