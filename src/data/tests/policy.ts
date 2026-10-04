import type { QuestionDifficulty } from './types';

/**
 * Policy constants for lesson tests. They are the single place where the shape of
 * a lesson test is decided, so audits, blueprints, and future lessons cannot
 * disagree about it. None of them hardcodes a number of lessons.
 */

/** A lesson test always contains exactly this many questions. */
export const LESSON_TEST_QUESTION_COUNT = 20;

/** Recommended difficulty distribution of a lesson test (adds up to 20). */
export const RECOMMENDED_LESSON_DIFFICULTY_PROFILE: Record<QuestionDifficulty, number> = {
  basic: 6,
  intermediate: 7,
  advanced: 4,
  reasoning: 3,
};

/** A lesson test must not be a single-format test. */
export const MIN_LESSON_QUESTION_TYPES = 4;

/** No question type may take more than this share of a lesson test. */
export const MAX_LESSON_TYPE_SHARE = 0.5;

/** Balanced coverage: no single concept may take more than this share. */
export const MAX_LESSON_CONCEPT_SHARE = 0.4;
