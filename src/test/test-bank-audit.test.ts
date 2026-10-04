import { describe, expect, it } from 'vitest';
import { auditTestBank } from '../data/tests/audit';
import { getTestsByType, questionBank, resolveTest } from '../data/tests/registry';

describe('curated test-bank integrity', () => {
  it('contains four 20-question lesson tests and one separately authored 60-question unit test', () => {
    const lessonTests = getTestsByType('lesson');
    const unitTests = getTestsByType('unit');

    expect(lessonTests).toHaveLength(4);
    expect(lessonTests.map((test) => test.questionIds.length)).toEqual([20, 20, 20, 20]);
    expect(unitTests).toHaveLength(1);
    expect(unitTests[0].questionIds).toHaveLength(60);
    expect(questionBank).toHaveLength(140);
    expect(getTestsByType('comprehensive')).toHaveLength(0);
    expect(unitTests[0].questionIds.every((id) => id.startsWith('u1-unit-'))).toBe(true);
  });

  it('covers all seven question renderers and the reviewed unit blueprint', () => {
    const unitTest = resolveTest('u1-test-unit-1');
    expect(unitTest).toBeDefined();
    expect(new Set(unitTest!.questions.map((question) => question.type)).size).toBe(7);
    expect(unitTest!.coverageBlueprint).toEqual({
      'lesson-1': 13,
      'lesson-2': 14,
      'lesson-3': 15,
      'lesson-4': 18,
    });
  });

  it('passes structural, solution, exact-answer, uniqueness, and coverage audits', () => {
    expect(auditTestBank()).toEqual([]);
  });
});
