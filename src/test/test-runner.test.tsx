import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TestRunner } from '../components/tests/TestRunner';
import type {
  CurriculumConceptRef,
  ResolvedTest,
  SingleChoiceQuestion,
  TrueFalseQuestion,
  NumericQuestion,
} from '../data/tests/types';

const curriculumRefs: CurriculumConceptRef[] = [
  { lessonId: 'lesson-1', conceptId: 'runner-fixture' },
];

const shared = {
  points: 1,
  difficulty: 'basic' as const,
  primaryLessonId: 'lesson-1',
  curriculumRefs,
  solution: {
    steps: ['خطوة الحل لا تظهر أثناء الاختبار.'],
    finalAnswer: 'النتيجة المخفية أثناء الاختبار',
    explanation: 'شرح لا يعرض إلا في حلول الاختبارات.',
  },
};

const choiceQuestion: SingleChoiceQuestion = {
  ...shared,
  id: 'runner-choice',
  type: 'single-choice',
  prompt: 'اختر العبارة المكافئة.',
  options: [
    { id: 'wrong', label: 'الخيار الأول' },
    { id: 'right', label: 'الخيار الثاني' },
  ],
  correctOptionId: 'right',
};

const trueFalseQuestion: TrueFalseQuestion = {
  ...shared,
  id: 'runner-boolean',
  type: 'true-false',
  prompt: 'هذه العبارة غير صحيحة.',
  correctAnswer: false,
};

const numericQuestion: NumericQuestion = {
  ...shared,
  id: 'runner-numeric',
  type: 'numeric',
  prompt: 'اكتب ناتج العملية.',
  math: '2 + 3',
  acceptedAnswers: ['5'],
  answerFormat: 'عدد صحيح',
};

/**
 * Reads the "saved answers" counter from the runner header.
 *
 * The number is wrapped in `<bdi dir="ltr">` for RTL safety, so it is a separate
 * element rather than part of the label's text node. Query the readout by its
 * Arabic label, then read the isolated value and normalise Arabic-Indic digits
 * so the assertion holds in any locale/ICU build.
 */
const readSavedAnswerCount = (): number => {
  const readout = screen.getByText(
    (_text, element) =>
      element?.tagName === 'SPAN' && (element.textContent ?? '').includes('إجابات محفوظة'),
  );
  const isolatedValue = readout.querySelector('bdi[dir="ltr"]');
  expect(isolatedValue).not.toBeNull();
  const westernDigits = (isolatedValue?.textContent ?? '').replace(
    /[\u0660-\u0669]/g,
    (digit) => String(digit.charCodeAt(0) - 0x0660),
  );
  return Number(westernDigits.replace(/[\s\u066c,]/g, ''));
};

const testWith = (...questions: ResolvedTest['questions']): ResolvedTest => ({
  id: 'engine-ui-fixture',
  type: 'lesson',
  unitId: 'unit-1',
  lessonId: 'lesson-1',
  title: 'اختبار محرك الواجهة',
  description: 'بيانات اختبارية داخل الاختبارات الآلية فقط.',
  difficultyLabel: 'متدرّج',
  coverageLabel: 'اختبار المحرك',
  estimatedMinutes: 1,
  questions,
  questionCount: questions.length,
});

describe('TestRunner: deferred result flow', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('does not show correctness, score, or solutions when a correct answer is selected', () => {
    const { container } = render(
      <TestRunner test={testWith(choiceQuestion)} onReturnToTests={() => {}} onOpenSolutions={() => {}} />,
    );

    const questionCard = container.querySelector('.test-question-card')!;
    const textBefore = questionCard.textContent;
    fireEvent.click(container.querySelector('input[value="right"]')!);

    expect((container.querySelector('input[value="right"]') as HTMLInputElement).checked).toBe(true);
    expect(questionCard.textContent).toBe(textBefore);
    expect(container.querySelector('.is-correct, .is-incorrect, [data-correctness]')).not.toBeInTheDocument();
    expect(screen.queryByText(/correct|incorrect|score/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/صحيح|خاطئ|الدرجة|النسبة|خطوة الحل|شرح لا يعرض/)).not.toBeInTheDocument();
    expect(screen.queryByText('النتيجة المخفية أثناء الاختبار')).not.toBeInTheDocument();
  });

  it('does not change correctness or score feedback when switching between wrong and right choices before submit', () => {
    const { container } = render(
      <TestRunner test={testWith(choiceQuestion)} onReturnToTests={() => {}} onOpenSolutions={() => {}} />,
    );
    const root = container.querySelector('.test-runner')!;

    fireEvent.click(container.querySelector('input[value="wrong"]')!);
    const visibleTextWithWrongChoice = root.textContent;
    const feedbackStateWithWrongChoice = {
      results: container.querySelector('.test-results')?.textContent ?? null,
      solutions: container.querySelector('.test-solution-steps')?.textContent ?? null,
      correctnessMarkers: container.querySelectorAll('.is-correct, .is-incorrect, [data-correctness], [aria-invalid="true"]').length,
      score: container.querySelector('.test-score-line')?.textContent ?? null,
    };

    fireEvent.click(container.querySelector('input[value="right"]')!);

    expect(root.textContent).toBe(visibleTextWithWrongChoice);
    expect({
      results: container.querySelector('.test-results')?.textContent ?? null,
      solutions: container.querySelector('.test-solution-steps')?.textContent ?? null,
      correctnessMarkers: container.querySelectorAll('.is-correct, .is-incorrect, [data-correctness], [aria-invalid="true"]').length,
      score: container.querySelector('.test-score-line')?.textContent ?? null,
    }).toEqual(feedbackStateWithWrongChoice);
    expect(container.querySelectorAll('.test-option.is-selected')).toHaveLength(1);
    expect(screen.queryByText(/الدرجة|النسبة|خطوة الحل|شرح لا يعرض/)).not.toBeInTheDocument();
  });

  it('shows exact aggregate counts only after submit and does not reveal worked solutions', () => {
    const test = testWith(choiceQuestion, trueFalseQuestion, numericQuestion);
    const { container } = render(
      <TestRunner test={test} onReturnToTests={() => {}} onOpenSolutions={() => {}} />,
    );

    fireEvent.click(container.querySelector('input[value="right"]')!);
    fireEvent.click(screen.getByRole('button', { name: /التالي/ }));
    fireEvent.click(container.querySelector('input[value="true"]')!); // incorrect; the expected value is false
    fireEvent.click(screen.getByRole('button', { name: /التالي/ }));

    expect(screen.queryByText(/إجابات صحيحة/)).not.toBeInTheDocument();
    expect(screen.queryByText(/النتيجة المخفية/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /تسليم الاختبار/ }));

    expect(container.querySelector('.test-score-line')?.textContent?.replace(/\s/g, '')).toBe('1/3');
    expect(screen.getByText('إجابات صحيحة')).toBeInTheDocument();
    expect(screen.getByText('إجابات خاطئة')).toBeInTheDocument();
    expect(screen.getByText('أسئلة غير مجابة')).toBeInTheDocument();
    expect(Array.from(container.querySelectorAll('.test-count-value')).map((node) => node.textContent)).toEqual(['1', '1', '1']);
    expect(container.querySelector('.test-percentage')?.textContent?.replace(/\s/g, '')).toBe('النسبة:33٪');
    expect(screen.queryByText('خطوة الحل لا تظهر أثناء الاختبار.')).not.toBeInTheDocument();
    expect(screen.queryByText('شرح لا يعرض إلا في حلول الاختبارات.')).not.toBeInTheDocument();
  });

  it('restarts from a clean answer state and clears the saved attempt', () => {
    const { container } = render(
      <TestRunner test={testWith(choiceQuestion)} onReturnToTests={() => {}} onOpenSolutions={() => {}} />,
    );

    fireEvent.click(container.querySelector('input[value="right"]')!);
    expect(window.sessionStorage.getItem('interactive-algebra:test-attempt:engine-ui-fixture')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /تسليم الاختبار/ }));
    fireEvent.click(screen.getByRole('button', { name: /إعادة الاختبار/ }));

    expect((container.querySelector('input[value="right"]') as HTMLInputElement).checked).toBe(false);
    expect(readSavedAnswerCount()).toBe(0);

    // The runner mirrors its current draft, so the key itself is not the contract:
    // what must not survive a restart is the previous attempt's answer.
    const savedDraft = window.sessionStorage.getItem('interactive-algebra:test-attempt:engine-ui-fixture');
    expect(JSON.parse(savedDraft as string)).toEqual({ version: 1, currentIndex: 0, answers: {} });
  });
});
