import type {
  ErrorAnalysisQuestion,
  MatchingQuestion,
  MultiSelectQuestion,
  NumericQuestion,
  OrderingQuestion,
  SingleChoiceQuestion,
  TestChoice,
  TestQuestionBase,
  TrueFalseQuestion,
} from './types';

export type QuestionFields = Omit<TestQuestionBase, 'type'>;

export const singleChoice = (
  question: QuestionFields & { options: TestChoice[]; correctOptionId: string },
): SingleChoiceQuestion => ({ ...question, type: 'single-choice' });

export const errorAnalysis = (
  question: QuestionFields & { options: TestChoice[]; correctOptionId: string },
): ErrorAnalysisQuestion => ({ ...question, type: 'error-analysis' });

export const trueFalse = (
  question: QuestionFields & { correctAnswer: boolean },
): TrueFalseQuestion => ({ ...question, type: 'true-false' });

export const multiSelect = (
  question: QuestionFields & { options: TestChoice[]; correctOptionIds: string[] },
): MultiSelectQuestion => ({ ...question, type: 'multi-select' });

export const numeric = (
  question: QuestionFields & { acceptedAnswers: string[]; answerFormat: string },
): NumericQuestion => ({ ...question, type: 'numeric' });

export const ordering = (
  question: QuestionFields & { items: TestChoice[]; correctOrder: string[] },
): OrderingQuestion => ({ ...question, type: 'ordering' });

export const matching = (
  question: QuestionFields & {
    leftItems: TestChoice[];
    rightItems: TestChoice[];
    correctPairs: Record<string, string>;
  },
): MatchingQuestion => ({ ...question, type: 'matching' });
