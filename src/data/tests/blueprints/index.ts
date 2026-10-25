import type { LessonTestBlueprint } from '../types';
import { lesson1Blueprint } from './lesson-1';
import { lesson2Blueprint } from './lesson-2';
import { lesson3Blueprint } from './lesson-3';
import { lesson4Blueprint } from './lesson-4';
import { unit2Lesson1Blueprint } from './unit2-lesson-1';
import { unit2Lesson2Blueprint } from './unit2-lesson-2';
import { unit2Lesson3Blueprint } from './unit2-lesson-3';
import { unit2Lesson4Blueprint } from './unit2-lesson-4';
import { unit2Lesson5Blueprint } from './unit2-lesson-5';
import { unit3Lesson1Blueprint } from './unit3-lesson-1';
import { unit3Lesson2Blueprint } from './unit3-lesson-2';
import { unit3Lesson3Blueprint } from './unit3-lesson-3';
import { unit3Lesson4Blueprint } from './unit3-lesson-4';

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
  'u2-lesson-1': unit2Lesson1Blueprint,
  'u2-lesson-2': unit2Lesson2Blueprint,
  'u2-lesson-3': unit2Lesson3Blueprint,
  'u2-lesson-4': unit2Lesson4Blueprint,
  'u2-lesson-5': unit2Lesson5Blueprint,
  'u3-lesson-1': unit3Lesson1Blueprint,
  'u3-lesson-2': unit3Lesson2Blueprint,
  'u3-lesson-3': unit3Lesson3Blueprint,
  'u3-lesson-4': unit3Lesson4Blueprint,
};

export function blueprintForLesson(lessonId: string): LessonTestBlueprint | undefined {
  return lessonBlueprints[lessonId];
}
