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
  /**
   * Optional author-declared provenance: the lesson topics this question was
   * built from. When omitted it is derived from `curriculumRefs` through the
   * curriculum concept catalog, so it is always available to audits, coverage
   * reports, and quality review. It is never shown to students.
   */
  sourceTopics?: string[];
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
  /** Expected difficulty distribution; validated whenever it is declared. */
  difficultyBlueprint?: Record<QuestionDifficulty, number>;
  /**
   * Content blueprint of a lesson test: authored from the lesson itself before
   * its questions, and verified against the actual question set.
   */
  blueprint?: LessonTestBlueprint;
  /**
   * Lessons of this unit that the test deliberately does not cover yet. Unit
   * tests are never extended automatically when a lesson is added; declaring a
   * pending lesson keeps that gap explicit and reviewed instead of silent.
   */
  pendingLessonCoverage?: PendingLessonCoverage[];
}

/** One concept a lesson test must cover, with the number of questions devoted to it. */
export interface LessonTestBlueprintConcept {
  /** Must exist in the curriculum concept catalog of the lesson. */
  conceptId: string;
  /** Human-readable concept title, kept in sync with the catalog. */
  title: string;
  /** Number of questions in this test that assess the concept. */
  questionCount: number;
  /** What students must be able to do (skills the questions measure). */
  skills: string[];
}

/**
 * Content-driven blueprint for one lesson test. It is authored after reading the
 * lesson and before writing the questions, then verified by the audit so it
 * cannot drift away from the questions it describes.
 */
export interface LessonTestBlueprint {
  lessonId: string;
  /** Lesson steps the covered concepts are taught in. */
  sourceSteps: string[];
  /** Balanced coverage: concept by concept, with the questions devoted to each. */
  concepts: LessonTestBlueprintConcept[];
  /** Planned difficulty distribution; must add up to the test question count. */
  difficultyPlan: Record<QuestionDifficulty, number>;
  /** Planned question-type distribution; must add up to the test question count. */
  questionTypePlan: Partial<Record<TestQuestionType, number>>;
  /** Misconceptions taught in the lesson that the test probes. */
  commonMistakes: string[];
  /**
   * Required whenever `difficultyPlan` deviates from the recommended profile,
   * so a deviation is a documented pedagogical choice rather than an accident.
   */
  deviationRationale?: string;
}

/** A unit lesson intentionally not covered by its unit test yet. */
export interface PendingLessonCoverage {
  lessonId: string;
  /** Why coverage is deferred; free text shown in the audit report. */
  reason: string;
  /** Where the follow-up is tracked (issue, milestone, task). */
  trackedBy: string;
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
