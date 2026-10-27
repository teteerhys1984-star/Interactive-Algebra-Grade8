import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SourceContentBlock } from '../components/lesson/SourceContentBlock';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { QuestionRenderer } from '../components/tests/QuestionRenderer';
import { TestRunner } from '../components/tests/TestRunner';
import { TestSolutions } from '../components/tests/TestSolutions';
import { unit3Lesson5Data } from '../data/unit3/lesson05';
import { unit3Lesson5TeacherSolutions } from '../data/unit3/lesson05TeacherSolutions';
import { questionBank, resolveTest } from '../data/tests/registry';
import { gradeQuestion, parseExactRational } from '../data/tests/scoring';
import type { NumericQuestion, TestQuestion } from '../data/tests/types';

const blocks = unit3Lesson5Data.steps.flatMap((step) => step.blocks);
const sourceBlock = (id: string) => {
  const found = blocks.find((block) => block.id === id);
  if (!found) throw new Error(`Missing block ${id}`);
  return found;
};
const question = (id: string): TestQuestion => {
  const found = questionBank.find((item) => item.id === id);
  if (!found) throw new Error(`Missing question ${id}`);
  return found;
};
const teacherSolution = (id: string) => {
  const found = unit3Lesson5TeacherSolutions.find((item) => item.id === id);
  if (!found) throw new Error(`Missing teacher solution ${id}`);
  return found;
};

describe('Unit 3 Lesson 5 — targeted fidelity corrections', () => {
  it('accepts the requested comma, point and fractional forms for question 17 only', () => {
    const q17 = question('u3-l5-17');
    expect(q17.type).toBe('numeric');
    for (const answer of ['-4,5', '-4.5', '-9/2', '-٤,٥', '−٤٫٥', '-4،5', '-4,50']) {
      expect(gradeQuestion(q17, answer), answer).toBe(true);
    }
    for (const answer of ['4,5', '-4,6', '-4,,5', '-4.5.0', '-9/0', 'نص']) {
      expect(gradeQuestion(q17, answer), answer).toBe(false);
    }
    // The shared parser and every other numeric question retain their prior
    // behavior: the comma branch is enabled only by an explicit comma answer.
    expect(parseExactRational('-4,5')).toBeNull();
    const otherNumeric = questionBank.filter((item): item is NumericQuestion =>
      item.type === 'numeric' && item.id !== q17.id);
    expect(otherNumeric.length).toBeGreaterThan(0);
    for (const item of otherNumeric) {
      expect(item.acceptedAnswers.some((answer) => /^[+-]?\d+,\d+$/.test(answer.trim())), item.id).toBe(false);
      expect(gradeQuestion(item, '4,5'), item.id).toBe(false);
      expect(gradeQuestion(item, '-4,5'), item.id).toBe(false);
    }
    const priorLesson = question('u2-l5-11');
    expect(gradeQuestion(priorLesson, '4.5')).toBe(true);
    expect(gradeQuestion(priorLesson, '9/2')).toBe(true);
    expect(gradeQuestion(priorLesson, '4,5')).toBe(false);
  });

  it('displays the platform provenance and scores a comma answer through the actual runner', () => {
    sessionStorage.clear();
    const test = resolveTest('u3-test-lesson-5')!;
    const view = render(<TestRunner test={test} onReturnToTests={() => {}} onOpenSolutions={() => {}} />);
    const description = view.container.querySelector('.test-runner-description')!;
    expect(description).toHaveTextContent('أسئلة هذا الاختبار من إعداد المنصة');
    expect(description).toHaveTextContent('مبنية على كتاب الطالب ص58–60');
    expect(description).toHaveTextContent('وليست اختبارًا مطبوعًا في الكتاب');
    fireEvent.click(screen.getByText('قائمة الأسئلة والتنقل المباشر'));
    fireEvent.click(screen.getByRole('button', { name: /^انتقل إلى السؤال 17/ }));
    const input = view.container.querySelector('#test-numeric-u3-l5-17')!;
    fireEvent.change(input, { target: { value: '-4,5' } });
    expect(input).toHaveValue('-4,5');
    fireEvent.click(screen.getByRole('button', { name: /تسليم الاختبار/ }));
    expect(screen.getByLabelText('1 من 20')).toBeInTheDocument();
    view.unmount();
    sessionStorage.clear();
  });

  it('uses the actual numbered markers in all ten affected solution answers', () => {
    const test = resolveTest('u3-test-lesson-5')!;
    const expected: Record<string, string> = {
      'u3-l5-02': 'الخيار 1:', 'u3-l5-03': 'الخيار 2:', 'u3-l5-05': 'الخيار 3:',
      'u3-l5-06': 'الخيار 1:', 'u3-l5-08': 'الخيار 4:', 'u3-l5-10': 'الخيار 2:',
      'u3-l5-13': 'الخيار 3:', 'u3-l5-15': 'الخيار 4:', 'u3-l5-18': 'الخيار 2:',
      'u3-l5-20': 'الخياران 2 و4:',
    };
    expect(Object.keys(expected)).toHaveLength(10);
    for (const [id, expectedLabel] of Object.entries(expected)) {
      const item = question(id);
      expect(item.solution.finalAnswer).toContain(expectedLabel);
      const view = render(<QuestionRenderer question={item} questionNumber={1} answer={undefined} onChange={() => {}} />);
      expect(Array.from(view.container.querySelectorAll('.test-option-marker')).map((marker) => marker.textContent))
        .toEqual(['1', '2', '3', '4']);
      view.unmount();
    }
    const view = render(<TestSolutions test={test} onReturnToSolutions={() => {}} onReturnToTests={() => {}} />);
    expect(view.container.querySelector('.test-solution-card:nth-child(2) .test-solution-answer'))
      .toHaveTextContent('الخيار 1');
    view.unmount();
  });

  it('does not infer the student’s unshown error or uniqueness from one substitution', () => {
    const q6 = question('u3-l5-06');
    expect(q6.prompt).toContain('ما الحد الذي يجب إضافته');
    expect(q6.prompt).not.toContain('أغفله في النشر');
    expect(q6.solution.explanation).toContain('لا نعلم من النتيجة وحدها موضع خطأ الطالب');
    expect(gradeQuestion(q6, 'a')).toBe(true);
    expect(sourceBlock('p58-first-test').subItems![1].solutionText).toContain('عند هذه القيمة');
    expect(sourceBlock('p58-first-test').subItems![1].solutionText).not.toContain('فقط');
    expect(teacherSolution('s58-first-2').finalAnswer).not.toContain('فقط');
    expect(teacherSolution('s58-second-3').check).toContain('لا تحدّد موضع الخطأ');
    expect(sourceBlock('p58-substitution-lab').content).toContain('بنفسك');
    expect(sourceBlock('p58-substitution-lab').content).not.toContain('بنفسيك');
    expect(question('u3-l5-20').solution.steps.join(' ')).toContain('وكلاهما يصل');
  });

  it('removes added prose from book blocks and labels platform-only headings', () => {
    const knowledge = sourceBlock('p59-knowledge-question');
    expect(knowledge.title).toBe('اكتساب معارف');
    expect(knowledge.content).toBe('كيف يتم حساب قيمة عبارة رمزية');
    const printed = sourceBlock('p59-example-solution');
    expect(printed.title).toBe('الحل');
    expect(printed.content).toBe('');
    expect(printed.subItems![0].text).toBe('1.');
    expect(printed.subItems![1].math).toBe('=x^2+5x+x - +5-6x=x^2+5x+x-6x+5');
    expect(printed.subItems![3].text).toContain('2. حساب $A$ عند $x=-30$');
    expect(sourceBlock('p59-printed-sign-correction').authored).toBe(true);
    expect(sourceBlock('p60-lina-figure').content).toBe('');
    expect(sourceBlock('p60-lina-figure').interactiveType).toBe('u3l5-distribution-figure');
    for (const id of [
      'p58-activity-warning', 'p58-learn-solution', 'p58-learn-warning', 'p59-special-case',
      'p60-prism-statement', 'p60-prism-questions', 'p60-identity-statement', 'p60-lina-work',
    ]) expect(sourceBlock(id).title, id).toContain('عنوان تنظيمي من المنصة');
    expect(sourceBlock('p58-activity-statement').mathFormula).toBe('(3x+1)(x+2)=3x^2+6x+2');
    expect(sourceBlock('p58-first-test').subItems![0].text).toContain('$x^2+6x+2$');
  });

  it('renders the grouped textbook numbers once and each duplicated source formula once', () => {
    for (const id of ['p59-check-z', 'p59-check-b']) {
      const item = sourceBlock(id);
      expect(item.title).toBe(id === 'p59-check-z' ? '①' : '②');
      expect(item.content).toMatch(/^ليكن \$/);
      const view = render(<SourceContentBlock block={item} />);
      const cards = Array.from(view.container.querySelectorAll('.step-card'));
      expect(cards).toHaveLength(4);
      expect(view.container.querySelectorAll('.step-badge-mini, .step-header-mini')).toHaveLength(0);
      expect(cards[0]).toHaveTextContent('1. انشر ثم اختزل');
      expect(cards[1]).toHaveTextContent('2. احسب قيمة');
      expect(cards[1]).toHaveTextContent('في كل من الحالات التالية: ①');
      expect(cards[2]).toHaveTextContent('②');
      expect(cards[3]).toHaveTextContent('③');
      expect(item.subItems!.every((sub) => sub.solutionText?.startsWith('حل المنصة:'))).toBe(true);
      view.unmount();
    }
    const formulas: Record<string, string> = {
      'p59-example-question': 'A=(x+1)(x+5)-6x',
      'p59-check-z': 'Z=3(5x-1)-4(-2x+3)',
      'p59-check-b': 'B=x(-x+3)-3(x^2+2x)',
      'p60-identity-statement': '(x+3)(x+4)=x^2+7x+12',
    };
    for (const [id, formula] of Object.entries(formulas)) {
      const view = render(<SourceContentBlock block={sourceBlock(id)} />);
      const occurrences = Array.from(view.container.querySelectorAll('annotation'))
        .filter((annotation) => annotation.textContent === formula);
      expect(occurrences, id).toHaveLength(1);
      view.unmount();
    }
    // Lina's factors are already visible in her arrow diagram. Continue with
    // the printed products in the next block without repeating those factors.
    const figure = render(<SourceContentBlock block={sourceBlock('p60-lina-figure')} />);
    expect(figure.container.querySelector('svg g[font-size="30"]')).toHaveTextContent('(x+3)(x+4)');
    expect(figure.getByRole('img', { name: /أسهم لينا لنشر/ })).toBeInTheDocument();
    figure.unmount();
    const work = render(<SourceContentBlock block={sourceBlock('p60-lina-work')} />);
    const lines = Array.from(work.container.querySelectorAll('.math-block-isolated annotation'))
      .map((annotation) => annotation.textContent);
    expect(lines).toEqual(['=x\\times x+x\\times4+3\\times x+3\\times4', '=x^2+(4+3)x+12', '=x^2+7x+12']);
    work.unmount();
  });

  it('attributes each teacher answer independently of its textbook reference and platform steps', () => {
    // Each id has been checked against pages 58–60: a printed prompt or a
    // platform extraction is not itself a printed answer.
    const derivedIds = [
      's58-statement', 's58-first-1', 's58-first-2', 's58-second-1', 's58-second-2', 's58-second-3',
      's58-turn-1', 's58-turn-2', 's58-activity-warning', 's58-learn-example', 's58-learn-solution',
      's58-learn-warning', 's59-knowledge', 's59-example-question', 's59-example-line-1',
      's59-example-line-2', 's59-example-line-4', 's59-special', 's59-z-1', 's59-z-2a',
      's59-z-2b', 's59-z-2c', 's59-b-1', 's59-b-2a', 's59-b-2b', 's59-b-2c',
      's60-prism-figure', 's60-prism-1', 's60-prism-2', 's60-prism-3', 's60-identity',
      's60-hassan', 's60-wadah', 's60-lina-figure', 's60-lina',
    ];
    const printedIds = ['s59-example-line-3'];
    expect(unit3Lesson5TeacherSolutions.map((row) => row.id).sort()).toEqual([...derivedIds, ...printedIds].sort());
    for (const id of derivedIds) expect(teacherSolution(id).answerOrigin, id).toBe('مُشتقة من المنصة');
    for (const id of printedIds) expect(teacherSolution(id).answerOrigin, id).toBe('الكتاب');
    for (const row of unit3Lesson5TeacherSolutions) {
      expect(row.source, row.id).toMatch(/^مرجع المادة في الكتاب: ص/);
      expect(row.problem, row.id).toContain('صياغة المنصة للمطلب:');
      expect(row.steps.every((step) => /^(تلخيص المنصة|شرح المنصة|تصويب المنصة|النص المطبوع في الكتاب)/.test(step)), row.id).toBe(true);
      expect(row.principle, row.id).toContain('توضيح المنصة:');
      expect(row.check, row.id).toContain('تحقق أو ملاحظة من المنصة:');
    }
    expect(teacherSolution('s58-statement').sourceNote).toContain('نتيجة الطالب');
    expect(teacherSolution('s59-example-line-1').sourceNote).toContain('اقتطاعها');
    const printed = teacherSolution('s59-example-line-3');
    expect(printed.finalAnswer).toBe('$A=x^2+5$.');
    expect(sourceBlock('p59-example-solution').subItems![2].explanation).toContain('$A=x^2+5$');
    expect(printed.sourceNote).toContain('الخطوات');
    expect(printed.sourceNote).toContain('المنصة');
    expect(teacherSolution('s59-example-line-2').steps[0]).toContain('- +5-6x=x^2+5x+x-6x+5');

    sessionStorage.setItem('teacher-access-granted', 'true');
    const view = render(<TeacherArea onNavigateHome={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /الدرس 5: اختبار مساواة رمزية/ }));
    const findRow = (text: string) => Array.from(view.container.querySelectorAll('.ta-solution'))
      .find((detail) => detail.querySelector('summary')?.textContent?.includes(text))!;
    const derived = findRow('مساواة الطالب:');
    expect(derived.querySelector('.source-page-badge')).toHaveTextContent('مرجع المادة في الكتاب: ص58');
    expect(derived.querySelector('.ta-solution-origin')).toHaveTextContent('مُشتقة من المنصة');
    const printedRow = findRow('اختزال حدود x.');
    expect(printedRow.querySelector('.source-page-badge')).toHaveTextContent('مرجع المادة في الكتاب: ص59');
    expect(printedRow.querySelector('.ta-solution-origin')).toHaveTextContent('الكتاب');
    expect(printedRow).toHaveTextContent('الخطوات');
    view.unmount();
    sessionStorage.clear();
  });

  it('identifies printed lines, corrections, paraphrases and derived teacher answers separately', () => {
    const line = teacherSolution('s59-example-line-2');
    expect(line.steps[0]).toContain('النص المطبوع في الكتاب:');
    expect(line.steps[0]).toContain('- +5-6x=x^2+5x+x-6x+5');
    expect(line.steps[1]).toContain('تصويب المنصة:');
    expect(line.answerOrigin).toBe('مُشتقة من المنصة');
    const example = teacherSolution('s59-example-question');
    expect(example.steps[0]).toContain('تصويب المنصة للسطر المطبوع');
    expect(example.steps[1]).toContain('تلخيص المنصة لما في الكتاب');
    expect(example.sourceNote).toContain('النتيجتان');
    expect(example.sourceNote).toContain('مطبوعتان');
    for (const id of ['s58-activity-warning', 's58-learn-warning', 's59-example-question']) {
      expect(teacherSolution(id).answerOrigin, id).toBe('مُشتقة من المنصة');
      expect(teacherSolution(id).sourceNote, id).toContain('المنصة');
    }
    for (const item of unit3Lesson5TeacherSolutions) {
      expect(item.problem).toContain('صياغة المنصة للمطلب:');
      expect(item.principle).toContain('توضيح المنصة:');
      expect(item.check).toContain('تحقق أو ملاحظة من المنصة:');
      expect(item.steps.every((step) => /^(تلخيص المنصة|شرح المنصة|تصويب المنصة|النص المطبوع في الكتاب):?/.test(step))).toBe(true);
    }
    const keys = unit3Lesson5Data.teacherArea!.answerKeys.flatMap((group) => group.items);
    expect(keys.every((item) => item.note?.includes('المنصة'))).toBe(true);

    sessionStorage.setItem('teacher-access-granted', 'true');
    const view = render(<TeacherArea onNavigateHome={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /الدرس 5: اختبار مساواة رمزية/ }));
    const row = Array.from(view.container.querySelectorAll('.ta-solution'))
      .find((detail) => detail.textContent?.includes('السطر الثاني كما طُبع'))!;
    expect(row).toHaveTextContent('النص المطبوع في الكتاب');
    expect(row).toHaveTextContent('تصويب المنصة');
    expect(row).toHaveTextContent('مُشتقة من المنصة');
    expect(view.container.querySelector('.ta-keys')).toHaveTextContent('الكتاب يطبع المطالب فقط');
    view.unmount();
    sessionStorage.clear();
  });
});
