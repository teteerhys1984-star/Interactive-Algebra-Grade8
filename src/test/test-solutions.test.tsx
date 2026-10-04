import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TestSolutions } from '../components/tests/TestSolutions';
import type { ResolvedTest, SingleChoiceQuestion } from '../data/tests/types';

const QUESTIONS_PER_PAGE = 5;

const solutionQuestion = (number: number): SingleChoiceQuestion => ({
  id: `solutions-fixture-q${number}`,
  type: 'single-choice',
  prompt: `السؤال ${number}: اختر العبارة المكافئة.`,
  options: [
    { id: 'a', label: 'الخيار الأول' },
    { id: 'b', label: 'الخيار الثاني' },
  ],
  correctOptionId: 'a',
  points: 1,
  difficulty: 'basic',
  primaryLessonId: 'lesson-1',
  curriculumRefs: [{ lessonId: 'lesson-1', conceptId: 'solutions-fixture' }],
  solution: {
    steps: ['الخطوة الأولى في الحل.', 'الخطوة الثانية في الحل.'],
    finalAnswer: 'الإجابة النهائية للنموذج',
    explanation: 'شرح المبدأ المستخدم في الحل.',
  },
});

const testWith = (questionCount: number): ResolvedTest => ({
  id: 'solutions-ui-fixture',
  type: 'unit',
  unitId: 'unit-1',
  title: 'اختبار محرك الحلول',
  description: 'بيانات اختبارية داخل الاختبارات الآلية فقط.',
  difficultyLabel: 'متدرّج',
  coverageLabel: 'اختبار المحرك',
  estimatedMinutes: 5,
  questions: Array.from({ length: questionCount }, (_, index) => solutionQuestion(index + 1)),
  questionCount,
});

const renderSolutions = (questionCount: number) => {
  const view = render(
    <TestSolutions
      test={testWith(questionCount)}
      onReturnToSolutions={() => {}}
      onReturnToTests={() => {}}
    />,
  );
  const pageLabel = () =>
    view.container.querySelector('.test-solution-group-label')?.textContent
      ?.replace(/\s+/g, ' ')
      .trim();
  const cardCount = () => view.container.querySelectorAll('.test-solution-card').length;
  const nextPage = () => screen.getByRole('button', { name: /الأسئلة التالية/ });
  return { ...view, pageLabel, cardCount, nextPage };
};

describe('TestSolutions pagination', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows full worked solutions directly, without a stored attempt or a prior submission', () => {
    const { container, cardCount, pageLabel } = renderSolutions(12);

    expect(cardCount()).toBe(QUESTIONS_PER_PAGE);
    expect(pageLabel()).toBe('الأسئلة 1–5 من 12');
    expect(window.sessionStorage.length).toBe(0);
    expect(container.querySelector('.test-solution-steps li')?.textContent).toContain(
      'الخطوة الأولى في الحل.',
    );
    expect(container.querySelector('.test-solution-answer')?.textContent).toContain(
      'الإجابة النهائية للنموذج',
    );
  });

  it('computes the page count with Math.ceil so no question is dropped', () => {
    const { cardCount, pageLabel, nextPage } = renderSolutions(12);

    fireEvent.click(nextPage());
    expect(pageLabel()).toBe('الأسئلة 6–10 من 12');
    expect(cardCount()).toBe(QUESTIONS_PER_PAGE);

    fireEvent.click(nextPage());
    expect(pageLabel()).toBe('الأسئلة 11–12 من 12');
    expect(cardCount()).toBe(2);
    expect(nextPage()).toBeDisabled();
  });

  it('keeps a partial last page for counts that are not a multiple of the page size', () => {
    const { cardCount, pageLabel, nextPage } = renderSolutions(7);

    expect(pageLabel()).toBe('الأسئلة 1–5 من 7');
    fireEvent.click(nextPage());
    expect(pageLabel()).toBe('الأسئلة 6–7 من 7');
    expect(cardCount()).toBe(2);
    expect(nextPage()).toBeDisabled();
  });

  it('uses the real global Math object for page arithmetic', () => {
    const ceilSpy = vi.spyOn(Math, 'ceil');
    const { pageLabel } = renderSolutions(12);

    expect(ceilSpy).toHaveBeenCalledWith(12 / QUESTIONS_PER_PAGE);
    expect(pageLabel()).toBe('الأسئلة 1–5 من 12');
  });
});
