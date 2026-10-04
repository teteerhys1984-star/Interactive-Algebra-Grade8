import type { QuestionFields } from './builders';
import type { CurriculumConceptRef, QuestionDifficulty, TestSolution } from './types';

export interface QuestionFieldsInput {
  id: string;
  prompt: string;
  difficulty: QuestionDifficulty;
  primaryLessonId: string;
  curriculumRefs: CurriculumConceptRef[];
  solution: TestSolution;
  math?: string;
  points?: number;
}

export function questionFields(input: QuestionFieldsInput): QuestionFields {
  return {
    ...input,
    points: input.points ?? 1,
  };
}
