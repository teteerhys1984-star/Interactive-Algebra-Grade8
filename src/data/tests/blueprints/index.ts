import type { LessonTestBlueprint } from '../types';
import { lesson1Blueprint } from './lesson-1';
import { lesson2Blueprint } from './lesson-2';
import { lesson3Blueprint } from './lesson-3';
import { lesson4Blueprint } from './lesson-4';

/**
 * Content blueprint of every lesson test, keyed by `lessonId`.
 *
 * Adding a lesson means adding its blueprint here (one import + one entry); the
 * completeness audit fails until the lesson has both a blueprint and a test.
 */
export const lessonBlueprints: Record<string, LessonTestBlueprint> = {
  'lesson-1': lesson1Blueprint,
  'lesson-2': lesson2Blueprint,
  'lesson-3': lesson3Blueprint,
  'lesson-4': lesson4Blueprint,
};

export function blueprintForLesson(lessonId: string): LessonTestBlueprint | undefined {
  return lessonBlueprints[lessonId];
}
