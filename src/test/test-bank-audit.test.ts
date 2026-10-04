import { describe, expect, it } from 'vitest';
import { auditTestBank, runTestBankAudit } from '../data/tests/audit';
import { curriculumLessonRefs } from '../data/tests/lessonTests';
import { LESSON_TEST_QUESTION_COUNT } from '../data/tests/policy';
import { getTestsByType, questionBank, resolveTest } from '../data/tests/registry';
import type { QuestionDifficulty, TestQuestion } from '../data/tests/types';

/**
 * Integrity of the curated bank. Counts are derived from the curriculum and from
 * the tests' own metadata — never from a literal number of lessons — so the suite
 * stays correct when lessons are added.
 */

const unitTest = resolveTest('u1-test-unit-1')!;
const unitBlueprintTotal = Object.values(unitTest.coverageBlueprint ?? {}).reduce((sum, count) => sum + count, 0);

const difficultyCounts = (questions: readonly TestQuestion[]): Record<QuestionDifficulty, number> =>
  questions.reduce(
    (counts, question) => ({ ...counts, [question.difficulty]: (counts[question.difficulty] ?? 0) + 1 }),
    { basic: 0, intermediate: 0, advanced: 0, reasoning: 0 } as Record<QuestionDifficulty, number>,
  );

describe('curated test-bank integrity', () => {
  it('has one 20-question test per curriculum lesson, plus the separately authored unit test', () => {
    const lessons = curriculumLessonRefs();
    const lessonTests = getTestsByType('lesson');
    const unitTests = getTestsByType('unit');

    expect(lessonTests).toHaveLength(lessons.length);
    expect(lessonTests.every((test) => test.questionIds.length === LESSON_TEST_QUESTION_COUNT)).toBe(true);
    expect(unitTests).toHaveLength(1);
    expect(unitTests[0].questionIds).toHaveLength(unitBlueprintTotal);
    expect(questionBank).toHaveLength(lessons.length * LESSON_TEST_QUESTION_COUNT + unitBlueprintTotal);
    expect(getTestsByType('comprehensive')).toHaveLength(0);
    expect(unitTests[0].questionIds.every((id) => id.startsWith('u1-unit-'))).toBe(true);
  });

  it('covers all seven question renderers and keeps the declared unit blueprint truthful', () => {
    expect(new Set(unitTest.questions.map((question) => question.type)).size).toBe(7);

    // The declared blueprint is checked against the questions it claims to describe.
    const actual = unitTest.questions.reduce<Record<string, number>>((counts, question) => {
      counts[question.primaryLessonId] = (counts[question.primaryLessonId] ?? 0) + 1;
      return counts;
    }, {});
    expect(unitTest.coverageBlueprint).toEqual(actual);
    expect(unitTest.difficultyBlueprint).toEqual(difficultyCounts(unitTest.questions));
  });

  it('gives every lesson test a content blueprint that matches its questions', () => {
    for (const test of getTestsByType('lesson')) {
      const resolved = resolveTest(test.id)!;
      expect(resolved.blueprint?.lessonId).toBe(test.lessonId);

      const planned = resolved.blueprint!.concepts.reduce((sum, concept) => sum + concept.questionCount, 0);
      expect(planned).toBe(resolved.questionCount);
      expect(
        Object.values(resolved.blueprint!.difficultyPlan).reduce((sum, count) => sum + count, 0),
      ).toBe(resolved.questionCount);
      expect(resolved.blueprint!.commonMistakes.length).toBeGreaterThan(0);
      expect(resolved.blueprint!.concepts.every((concept) => concept.skills.length > 0)).toBe(true);
    }
  });

  it('passes structural, solution, exact-answer, uniqueness, provenance, and coverage audits', () => {
    expect(auditTestBank()).toEqual([]);

    const report = runTestBankAudit();
    expect(report.errors).toEqual([]);
    expect(report.warnings).toEqual([]);
    expect(report.suspiciousQuestions).toEqual([]);
    // Review notes are informational; every one must name a question that exists.
    const ids = new Set(questionBank.map((question) => question.id));
    for (const note of report.reviewNotes) {
      expect(ids.has(note.split(':')[0])).toBe(true);
    }
  });
});
