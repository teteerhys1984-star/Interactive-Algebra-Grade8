import { curriculum } from '../curriculum';
import { testDefinitions } from './registry';
import type { TestDefinition } from './types';

/**
 * Typed link between the curriculum and the Test Area.
 *
 * The curriculum is the source of truth for *which* lessons exist; the test
 * registry is the source of truth for *which* tests exist. This module joins the
 * two by `lessonId` (never by file name), exposes the link with types, and tells
 * the audit which lessons are still missing a test. The Test Area renders from
 * the same data, so a new lesson test shows up without touching any component.
 */

/** A numbered lesson of the curriculum. The unit warm-up is not a lesson and needs no test. */
export interface CurriculumLessonRef {
  unitId: string;
  unitTitle: string;
  lessonId: string;
  lessonTitle: string;
}

/** Every lesson that must own an independent test, in curriculum order. */
export function curriculumLessonRefs(): CurriculumLessonRef[] {
  return curriculum.flatMap((unit) =>
    unit.lessons.map((lesson) => ({
      unitId: unit.id,
      unitTitle: unit.title,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
    })),
  );
}

export interface LessonTestEntry {
  lessonId: string;
  unitId: string;
  testId: string;
  title: string;
  questionCount: number;
  definition: TestDefinition;
}

function lessonTestDefinitions(): TestDefinition[] {
  return testDefinitions.filter((definition) => definition.type === 'lesson' && definition.lessonId);
}

/** `lessonId → testId`, the single typed mapping used by audits and the UI. */
export function lessonTestIdMap(): ReadonlyMap<string, string> {
  return new Map(
    lessonTestDefinitions().map((definition) => [definition.lessonId as string, definition.id]),
  );
}

export function getLessonTestId(lessonId: string): string | undefined {
  return lessonTestIdMap().get(lessonId);
}

export function getLessonTest(lessonId: string): TestDefinition | undefined {
  return lessonTestDefinitions().find((definition) => definition.lessonId === lessonId);
}

/** Lesson tests in curriculum order (unknown lessons keep their registry order, last). */
export function lessonTestEntries(): LessonTestEntry[] {
  const order = curriculumLessonRefs().map((lesson) => lesson.lessonId);
  return lessonTestDefinitions()
    .map((definition) => ({
      lessonId: definition.lessonId as string,
      unitId: definition.unitId,
      testId: definition.id,
      title: definition.title,
      questionCount: definition.questionIds.length,
      definition,
    }))
    .sort((a, b) => {
      const left = order.indexOf(a.lessonId);
      const right = order.indexOf(b.lessonId);
      return (left === -1 ? Number.MAX_SAFE_INTEGER : left) - (right === -1 ? Number.MAX_SAFE_INTEGER : right);
    });
}

/** Curriculum lessons without a registered test — each one is an audit error. */
export function lessonsMissingTests(): CurriculumLessonRef[] {
  const known = lessonTestIdMap();
  return curriculumLessonRefs().filter((lesson) => !known.has(lesson.lessonId));
}

/** Lesson tests whose `lessonId` is not in the curriculum (stale registrations). */
export function orphanLessonTests(): TestDefinition[] {
  const known = new Set(curriculumLessonRefs().map((lesson) => lesson.lessonId));
  return lessonTestDefinitions().filter((definition) => !known.has(definition.lessonId as string));
}
