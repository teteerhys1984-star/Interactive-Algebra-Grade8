export type TestType = 'lesson' | 'unit' | 'comprehensive';

export type QuestionDifficulty = 'basic' | 'intermediate' | 'advanced' | 'reasoning';

export type TestQuestionType =
  | 'single-choice'
  | 'true-false'
  | 'multi-select'
  | 'numeric'
  | 'ordering'
  | 'matching'
  | 'error-analysis';

export interface TestChoice {
  id: string;
  /** Arabic prose and/or inline LaTeX delimited with $...$. */
  label: string;
}

export interface CurriculumConceptRef {
  lessonId: string;
  conceptId: string;
}

export interface TestSolution {
  /** Step-by-step explanation; math may be embedded as $LaTeX$. */
  steps: string[];
  /** Final result, rendered as Arabic prose and/or inline math. */
  finalAnswer: string;
  /** Short conceptual reason for the chosen method. */
  explanation: string;
}

export interface TestQuestionBase {
  id: string;
  type: TestQuestionType;
  prompt: string;
  /** Optional display-mode LaTeX expression without delimiters. */
  math?: string;
  points: number;
  difficulty: QuestionDifficulty;
  /** Primary lesson used for unit-test coverage accounting. */
  primaryLessonId: string;
  /** One or more curriculum concepts; integrated questions may span lessons. */
  curriculumRefs: CurriculumConceptRef[];
  /** Correct answer and worked solution remain attached to the same question. */
  solution: TestSolution;
}

export interface SingleChoiceQuestion extends TestQuestionBase {
  type: 'single-choice';
  options: TestChoice[];
  correctOptionId: string;
}

export interface TrueFalseQuestion extends TestQuestionBase {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface MultiSelectQuestion extends TestQuestionBase {
  type: 'multi-select';
  options: TestChoice[];
  correctOptionIds: string[];
}

export interface NumericQuestion extends TestQuestionBase {
  type: 'numeric';
  /** Accepted exact integers, decimals, or rational forms (for example, -3/5). */
  acceptedAnswers: string[];
  answerFormat: string;
}

export interface OrderingQuestion extends TestQuestionBase {
  type: 'ordering';
  /** Deliberately presented in a non-solution order. */
  items: TestChoice[];
  correctOrder: string[];
}

export interface MatchingQuestion extends TestQuestionBase {
  type: 'matching';
  leftItems: TestChoice[];
  rightItems: TestChoice[];
  correctPairs: Record<string, string>;
}

export interface ErrorAnalysisQuestion extends TestQuestionBase {
  type: 'error-analysis';
  /** Each option identifies and corrects a plausible reasoning error. */
  options: TestChoice[];
  correctOptionId: string;
}

export type TestQuestion =
  | SingleChoiceQuestion
  | TrueFalseQuestion
  | MultiSelectQuestion
  | NumericQuestion
  | OrderingQuestion
  | MatchingQuestion
  | ErrorAnalysisQuestion;

export type QuestionAnswer = string | boolean | string[] | Record<string, string>;
export type AnswerMap = Record<string, QuestionAnswer>;

export interface TestDefinition {
  id: string;
  type: TestType;
  unitId: string;
  lessonId?: string;
  title: string;
  description: string;
  /** Fixed, curated question IDs. The count is derived from this list. */
  questionIds: string[];
  difficultyLabel: string;
  coverageLabel: string;
  estimatedMinutes: number;
  /** Expected primary-lesson distribution, validated for unit assessments. */
  coverageBlueprint?: Record<string, number>;
}

export interface ResolvedTest extends Omit<TestDefinition, 'questionIds'> {
  questions: TestQuestion[];
  questionCount: number;
}

export interface TestScore {
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
}
