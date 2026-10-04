import { describe, expect, it } from 'vitest';
import { gradeQuestion, parseExactRational, scoreTest } from '../data/tests/scoring';
import type {
  CurriculumConceptRef,
  ErrorAnalysisQuestion,
  MatchingQuestion,
  MultiSelectQuestion,
  NumericQuestion,
  OrderingQuestion,
  SingleChoiceQuestion,
  TestQuestionBase,
  TrueFalseQuestion,
} from '../data/tests/types';

const curriculumRefs: CurriculumConceptRef[] = [
  { lessonId: 'lesson-1', conceptId: 'engine-fixture' },
];

const base = (id: string): TestQuestionBase => ({
  id,
  type: 'single-choice',
  prompt: 'سؤال اختباري للاختبار البرمجي.',
  points: 1,
  difficulty: 'basic',
  primaryLessonId: 'lesson-1',
  curriculumRefs,
  solution: {
    steps: ['خطوة تحقق للاختبار البرمجي.'],
    finalAnswer: 'الإجابة الصحيحة',
    explanation: 'تفسير الاختبار البرمجي.',
  },
});

const choiceQuestion: SingleChoiceQuestion = {
  ...base('choice'),
  type: 'single-choice',
  options: [{ id: 'a', label: 'الأول' }, { id: 'b', label: 'الثاني' }],
  correctOptionId: 'b',
};

const trueFalseQuestion: TrueFalseQuestion = {
  ...base('boolean'),
  type: 'true-false',
  correctAnswer: false,
};

const multiSelectQuestion: MultiSelectQuestion = {
  ...base('multi'),
  type: 'multi-select',
  options: [
    { id: 'a', label: 'الأول' },
    { id: 'b', label: 'الثاني' },
    { id: 'c', label: 'الثالث' },
  ],
  correctOptionIds: ['a', 'c'],
};

const numericQuestion: NumericQuestion = {
  ...base('numeric'),
  type: 'numeric',
  acceptedAnswers: ['3/4'],
  answerFormat: 'عدد أو كسر',
};

const orderingQuestion: OrderingQuestion = {
  ...base('order'),
  type: 'ordering',
  items: [
    { id: 'c', label: 'الخطوة الثالثة' },
    { id: 'a', label: 'الخطوة الأولى' },
    { id: 'b', label: 'الخطوة الثانية' },
  ],
  correctOrder: ['a', 'b', 'c'],
};

const matchingQuestion: MatchingQuestion = {
  ...base('matching'),
  type: 'matching',
  leftItems: [{ id: 'l1', label: 'الأول' }, { id: 'l2', label: 'الثاني' }],
  rightItems: [{ id: 'r1', label: 'النتيجة الأولى' }, { id: 'r2', label: 'النتيجة الثانية' }],
  correctPairs: { l1: 'r2', l2: 'r1' },
};

const errorAnalysisQuestion: ErrorAnalysisQuestion = {
  ...base('error'),
  type: 'error-analysis',
  options: [{ id: 'fix', label: 'التصحيح' }, { id: 'wrong', label: 'تصحيح غير مناسب' }],
  correctOptionId: 'fix',
};

describe('test engine exact scoring', () => {
  it('grades single-choice and error-analysis only against their answer ids', () => {
    expect(gradeQuestion(choiceQuestion, 'b')).toBe(true);
    expect(gradeQuestion(choiceQuestion, 'a')).toBe(false);
    expect(gradeQuestion(errorAnalysisQuestion, 'fix')).toBe(true);
    expect(gradeQuestion(errorAnalysisQuestion, 'wrong')).toBe(false);
  });

  it('grades both true and false responses without treating false as unanswered', () => {
    expect(gradeQuestion(trueFalseQuestion, false)).toBe(true);
    expect(gradeQuestion(trueFalseQuestion, true)).toBe(false);
    expect(gradeQuestion(trueFalseQuestion, undefined)).toBe(false);
  });

  it('requires an exact set for multi-select and rejects duplicate or incomplete sets', () => {
    expect(gradeQuestion(multiSelectQuestion, ['c', 'a'])).toBe(true);
    expect(gradeQuestion(multiSelectQuestion, ['a'])).toBe(false);
    expect(gradeQuestion(multiSelectQuestion, ['a', 'a', 'c'])).toBe(false);
  });

  it('compares numeric answers as exact rationals, including equivalent fractions and decimals', () => {
    expect(gradeQuestion(numericQuestion, '0.75')).toBe(true);
    expect(gradeQuestion(numericQuestion, '٦/٨')).toBe(true);
    expect(gradeQuestion(numericQuestion, '−3/4')).toBe(false);
    expect(gradeQuestion(numericQuestion, '3/0')).toBe(false);
    expect(parseExactRational('−0٫75')).toEqual({ numerator: -3n, denominator: 4n });
    expect(parseExactRational('1 + 2')).toBeNull();
  });

  it('requires the full correct ordering', () => {
    expect(gradeQuestion(orderingQuestion, ['a', 'b', 'c'])).toBe(true);
    expect(gradeQuestion(orderingQuestion, ['c', 'a', 'b'])).toBe(false);
    expect(gradeQuestion(orderingQuestion, ['a', 'b'])).toBe(false);
  });

  it('requires every matching pair to be correct', () => {
    expect(gradeQuestion(matchingQuestion, { l2: 'r1', l1: 'r2' })).toBe(true);
    expect(gradeQuestion(matchingQuestion, { l1: 'r1', l2: 'r2' })).toBe(false);
    expect(gradeQuestion(matchingQuestion, { l1: 'r2' })).toBe(false);
  });

  it('counts correct, incorrect, unanswered and weighted points only when scoreTest is called', () => {
    const weighted: NumericQuestion = {
      ...numericQuestion,
      id: 'weighted',
      points: 2,
      acceptedAnswers: ['1/2'],
    };
    const result = scoreTest(
      [choiceQuestion, weighted, trueFalseQuestion],
      { choice: 'b', weighted: '1/2', boolean: true },
    );

    expect(result).toEqual({
      correctCount: 2,
      incorrectCount: 1,
      unansweredCount: 0,
      earnedPoints: 3,
      totalPoints: 4,
      percentage: 75,
    });

    expect(scoreTest([choiceQuestion, numericQuestion], { choice: 'a' })).toEqual({
      correctCount: 0,
      incorrectCount: 1,
      unansweredCount: 1,
      earnedPoints: 0,
      totalPoints: 2,
      percentage: 0,
    });
  });
});
