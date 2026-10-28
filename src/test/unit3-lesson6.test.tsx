import { describe, expect, it } from 'vitest';
import { getLessonById, getUnitById } from '../data/curriculum';
import { blueprintForLesson } from '../data/tests/blueprints';
import { conceptProfileForLesson, resolveConceptReference } from '../data/tests/concepts';
import { auditTestBank, createTestBankSnapshot, runTestBankAudit } from '../data/tests/audit';
import { getLessonTestId } from '../data/tests/lessonTests';
import { questionBank, resolveTest } from '../data/tests/registry';
import { gradeQuestion, scoreTest } from '../data/tests/scoring';
import { unit3Lesson6Data } from '../data/unit3/lesson06';
import { unit3Lesson6TestQuestions } from '../data/tests/unit3/lesson-6';
import type { QuestionAnswer } from '../data/tests/types';

const answers: Record<string, QuestionAnswer> = {
'u3-l6-01':'b','u3-l6-02':'b','u3-l6-03':'b','u3-l6-04':'26',
'u3-l6-05':true,'u3-l6-06':'a','u3-l6-07':'a','u3-l6-08':'20','u3-l6-09':'13',
'u3-l6-10':'a','u3-l6-11':'8x^2-12x','u3-l6-12':'a','u3-l6-13':'-x-8',
'u3-l6-14':false,'u3-l6-15':['a','c'],'u3-l6-16':'b','u3-l6-17':'-16',
'u3-l6-18':{A:'1',B:'2',C:'3'},'u3-l6-19':'a','u3-l6-20':'a',
};

describe('Unit 3 Lesson 6 assessment', () => {
  it('is included in curriculum and has a registered independent test', () => {
    expect(getUnitById('unit-3')!.lessons.map(({id})=>id)).toEqual([
      'u3-lesson-1','u3-lesson-2','u3-lesson-3','u3-lesson-4','u3-lesson-5','u3-lesson-6',
    ]);
    expect(getLessonById('unit-3','u3-lesson-6')).toBe(unit3Lesson6Data);
    expect(getLessonTestId('u3-lesson-6')).toBe('u3-test-lesson-6');
    expect(resolveTest('u3-test-lesson-6')!.questionCount).toBe(20);
  });

  it('documents the intentional difficulty profile without bypassing the audit', () => {
    const blueprint = blueprintForLesson('u3-lesson-6')!;
    expect(blueprint.difficultyPlan).toEqual({ basic: 8, intermediate: 7, advanced: 3, reasoning: 2 });
    expect(blueprint.deviationRationale?.trim()).toBeTruthy();

    const snapshot = createTestBankSnapshot();
    const clean = runTestBankAudit(snapshot);
    expect(clean.errors).toEqual([]);
    expect(clean.warnings.filter((warning) => warning.includes('u3-test-lesson-6'))).toEqual([]);

    // Removing the pedagogical explanation must restore the original CI warning.
    const undocumented = runTestBankAudit(createTestBankSnapshot({
      blueprints: {
        ...snapshot.blueprints,
        'u3-lesson-6': { ...blueprint, deviationRationale: undefined },
      },
    }));
    expect(undocumented.errors).toEqual([]);
    expect(undocumented.warnings).toContain(
      'u3-test-lesson-6: difficulty plan deviates from the recommended 6/7/4/3 profile without a documented rationale.',
    );

    // A rationale explains a deviation; it must never excuse inconsistent counts.
    const inconsistent = runTestBankAudit(createTestBankSnapshot({
      blueprints: {
        ...snapshot.blueprints,
        'u3-lesson-6': {
          ...blueprint,
          difficultyPlan: { ...blueprint.difficultyPlan, intermediate: 6 },
        },
      },
    }));
    expect(inconsistent.errors).toEqual(expect.arrayContaining([
      'u3-test-lesson-6: difficulty plan adds up to 19 but the test has 20 questions.',
      'u3-test-lesson-6: difficulty plan expects 6 "intermediate"; the test has 7.',
    ]));
  });

  it('keeps source-step, concept and question-type coverage aligned', () => {
    const blueprint = blueprintForLesson('u3-lesson-6')!;
    const test = resolveTest('u3-test-lesson-6')!;
    const sourceSteps = unit3Lesson6Data.steps.map((step) => step.id);
    expect(blueprint.sourceSteps).toEqual(sourceSteps);

    const conceptCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    for (const question of test.questions) {
      const concept = resolveConceptReference('u3-lesson-6', question.curriculumRefs[0].conceptId)!;
      expect(concept).toBeDefined();
      conceptCounts[concept.id] = (conceptCounts[concept.id] ?? 0) + 1;
      typeCounts[question.type] = (typeCounts[question.type] ?? 0) + 1;
    }
    expect(typeCounts).toEqual(blueprint.questionTypePlan);
    for (const planned of blueprint.concepts) {
      const concept = resolveConceptReference('u3-lesson-6', planned.conceptId)!;
      expect(concept.title).toBe(planned.title);
      expect(concept.taughtInSteps.length).toBeGreaterThan(0);
      expect(concept.taughtInSteps.every((step) => blueprint.sourceSteps.includes(step))).toBe(true);
      expect(conceptCounts[planned.conceptId], planned.conceptId).toBe(planned.questionCount);
    }
  });

  it('validates all 20 answers, concept references, blueprint coverage, and audit', () => {
    const test=resolveTest('u3-test-lesson-6')!;
    expect(test.questions).toEqual(unit3Lesson6TestQuestions);
    expect(unit3Lesson6Data.steps).toHaveLength(16);
    expect(conceptProfileForLesson('u3-lesson-6')!.concepts).toHaveLength(8);
    expect(blueprintForLesson('u3-lesson-6')!.concepts.reduce((n,c)=>n+c.questionCount,0)).toBe(20);
    const blueprint = blueprintForLesson('u3-lesson-6')!;
    const difficultyCounts = test.questions.reduce<Record<string, number>>((counts, question) => {
      counts[question.difficulty] = (counts[question.difficulty] ?? 0) + 1;
      return counts;
    }, {});
    expect(difficultyCounts).toEqual(blueprint.difficultyPlan);
    for(const q of test.questions) {
      expect(questionBank.filter((entry)=>entry.id===q.id)).toHaveLength(1);
      expect(resolveConceptReference('u3-lesson-6',q.curriculumRefs[0].conceptId)).toBeDefined();
      expect(gradeQuestion(q,answers[q.id]),q.id).toBe(true);
    }
    expect(scoreTest(test.questions,answers).percentage).toBe(100);
    expect(auditTestBank()).toEqual([]);
    expect(runTestBankAudit().warnings.filter((w)=>w.includes('u3-test-lesson-6'))).toEqual([]);
  });
});
