import type { TestQuestion } from '../types';
import { unit1QuestionsPart1 } from './unit-1-part-1';
import { unit1QuestionsPart2 } from './unit-1-part-2';
import { unit1QuestionsPart3 } from './unit-1-part-3';

/** A separately authored, fixed 60-question assessment—not a concatenation of lesson tests. */
export const unit1TestQuestions: TestQuestion[] = [
  ...unit1QuestionsPart1,
  ...unit1QuestionsPart2,
  ...unit1QuestionsPart3,
];
