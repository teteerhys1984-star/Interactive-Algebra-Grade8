import { describe, expect, it, vi } from 'vitest';
import { auditTestBank, createTestBankSnapshot, runTestBankAudit } from '../data/tests/audit';
import { lessonConceptProfiles, resolveConceptReference, sourceTopicsForQuestion } from '../data/tests/concepts';
import {
  curriculumLessonRefs,
  getLessonTest,
  getLessonTestId,
  lessonTestEntries,
  lessonsMissingTests,
} from '../data/tests/lessonTests';
import { LESSON_TEST_QUESTION_COUNT } from '../data/tests/policy';
import { getTestsByType, questionBank, resolveTest, testDefinitions } from '../data/tests/registry';
import {
  FIXTURE_LESSON_ID,
  fixtureConceptProfile,
  fixtureLessonRef,
  fixtureQuestions,
  fixtureTestDefinition,
  fixtureIsWellFormed,
  snapshotWithFixtureLesson,
} from './fixtures/lesson5-fixture';
import type { TestQuestion } from '../data/tests/types';

/**
 * Requirement: every lesson of the curriculum owns an independent, content-driven
 * test, and the system notices when one is missing. Nothing below hardcodes a
 * number of lessons — the curriculum is the only source of truth, so these tests
 * keep working when Lesson 5, 6, … are added.
 */

const unitTestId = testDefinitions.find((definition) => definition.type === 'unit')!.id;

describe('curriculum → test registry → lesson tests stay in sync', () => {
  it('Test 1: every curriculum lesson owns exactly one registered test', () => {
    const lessons = curriculumLessonRefs();
    expect(lessons.length).toBeGreaterThan(0);
    expect(lessonsMissingTests()).toEqual([]);

    for (const lesson of lessons) {
      const testId = getLessonTestId(lesson.lessonId);
      expect(testId, `no test registered for ${lesson.lessonId}`).toBeDefined();

      const definition = getLessonTest(lesson.lessonId);
      expect(definition?.id).toBe(testId);
      expect(definition?.type).toBe('lesson');
      expect(definition?.unitId).toBe(lesson.unitId);
    }

    // The link is one-to-one: no lesson without a test, no test without a lesson.
    expect(lessonTestEntries()).toHaveLength(lessons.length);
    expect(getTestsByType('lesson').map((test) => test.lessonId)).toEqual(lessons.map((lesson) => lesson.lessonId));
  });

  it('Test 2: every lesson test contains exactly the required number of questions', () => {
    for (const entry of lessonTestEntries()) {
      const resolved = resolveTest(entry.testId);
      expect(resolved, `unresolved test ${entry.testId}`).toBeDefined();
      expect(resolved!.questionCount).toBe(LESSON_TEST_QUESTION_COUNT);
      expect(resolved!.questions).toHaveLength(LESSON_TEST_QUESTION_COUNT);
      expect(entry.questionCount).toBe(LESSON_TEST_QUESTION_COUNT);
      // Every question really belongs to that lesson.
      expect(new Set(resolved!.questions.map((question) => question.primaryLessonId))).toEqual(
        new Set([entry.lessonId]),
      );
    }
  });

  it('keeps the whole bank consistent, with no hardcoded counts', () => {
    expect(auditTestBank()).toEqual([]);

    const report = runTestBankAudit();
    expect(report.errors).toEqual([]);
    expect(report.summary.lessonTests).toBe(report.summary.curriculumLessons);
    expect(report.summary.questionBankSize).toBe(questionBank.length);
    expect(Object.values(report.summary.questionsPerLessonTest).every((count) => count === LESSON_TEST_QUESTION_COUNT)).toBe(true);
    // A complete bank leaves no question of unknown provenance.
    expect(report.suspiciousQuestions).toEqual([]);
  });

  it('Test 22: curriculum lessons, registry links, and lesson tests are the same set', () => {
    const curriculumIds = curriculumLessonRefs().map((lesson) => lesson.lessonId);
    const registryIds = [...lessonTestEntries()].map((entry) => entry.lessonId);
    const uiIds = getTestsByType('lesson').map((test) => test.lessonId);

    expect(registryIds).toEqual(curriculumIds);
    expect(uiIds).toEqual(curriculumIds);

    for (const entry of lessonTestEntries()) {
      const resolved = resolveTest(entry.testId);
      expect(resolved?.lessonId).toBe(entry.lessonId);
      expect(resolved?.unitId).toBe(entry.unitId);
      expect(resolved?.blueprint?.lessonId).toBe(entry.lessonId);
      expect(resolved?.blueprint?.concepts.reduce((sum, concept) => sum + concept.questionCount, 0))
        .toBe(LESSON_TEST_QUESTION_COUNT);
    }
  });

  it('Test 6: every question of every lesson test ships a complete worked solution', () => {
    for (const entry of lessonTestEntries()) {
      const resolved = resolveTest(entry.testId)!;
      for (const question of resolved.questions) {
        expect(question.solution, `${question.id} has no solution`).toBeDefined();
        expect(question.solution.steps.filter((step) => step.trim()).length).toBeGreaterThanOrEqual(2);
        expect(question.solution.finalAnswer.trim()).not.toBe('');
        expect(question.solution.explanation.trim()).not.toBe('');
      }
    }
  });

  it('Test 7: question ids are unique inside each test and across the bank', () => {
    for (const definition of testDefinitions) {
      expect(new Set(definition.questionIds).size, definition.id).toBe(definition.questionIds.length);
    }
    expect(new Set(questionBank.map((question) => question.id)).size).toBe(questionBank.length);
  });

  it('Test 8/9: the audit finds duplicates and placeholders when they are planted', () => {
    const [first, second] = questionBank;
    const cloned = { ...second, id: 'planted-clone' } as TestQuestion;

    const duplicated = runTestBankAudit(
      createTestBankSnapshot({ questions: [...questionBank, { ...cloned, prompt: first.prompt }] }),
    );
    expect(duplicated.errors.some((issue) => issue.startsWith('Duplicate prompt on'))).toBe(true);

    const nearDuplicate = runTestBankAudit(
      createTestBankSnapshot({
        questions: [...questionBank, { ...cloned, prompt: first.prompt.replace(/\d+/g, '7') }],
      }),
    );
    expect(nearDuplicate.errors.some((issue) => issue.includes('Near-duplicate question'))).toBe(true);

    const placeholder = runTestBankAudit(
      createTestBankSnapshot({
        questions: [...questionBank, { ...cloned, prompt: 'TODO: write this question' }],
      }),
    );
    expect(placeholder.errors.some((issue) => issue.includes('placeholder text'))).toBe(true);

    // The shipped bank contains none of these.
    const clean = runTestBankAudit();
    expect(clean.errors.filter((issue) => /Duplicate|Near-duplicate|placeholder|filler/.test(issue))).toEqual([]);
  });

  it('keeps every question attached to a concept that the lesson really teaches', () => {
    for (const question of questionBank) {
      for (const reference of question.curriculumRefs) {
        const concept = resolveConceptReference(reference.lessonId, reference.conceptId);
        expect(concept, `${question.id} → ${reference.lessonId}/${reference.conceptId}`).toBeDefined();
        expect(concept!.taughtInSteps.length).toBeGreaterThan(0);
      }
      expect(sourceTopicsForQuestion(question).length).toBeGreaterThan(0);
    }
    expect(lessonConceptProfiles.every((profile) => profile.concepts.length > 0)).toBe(true);
  });

  it('Test 15: a question that no concept explains is reported as suspicious', () => {
    const stranger = {
      ...questionBank[0],
      id: 'planted-stranger',
      curriculumRefs: [{ lessonId: 'lesson-1', conceptId: 'quantum-tunnelling' }],
    } as TestQuestion;

    const report = runTestBankAudit(createTestBankSnapshot({ questions: [...questionBank, stranger] }));
    expect(report.suspiciousQuestions).toContain('planted-stranger');
    expect(report.warnings.some((warning) => warning.includes('quantum-tunnelling'))).toBe(true);
  });
});

describe('adding a new lesson is detected automatically', () => {
  it('Test 3: a lesson registered without a test fails the audit by name', () => {
    const withoutTest = snapshotWithFixtureLesson({ withTest: false, withPendingUnitCoverage: false });
    const report = runTestBankAudit(withoutTest);

    expect(report.errors).toContain(`Missing test for lesson: ${FIXTURE_LESSON_ID}`);
    expect(report.errors.some((issue) => issue.startsWith('Missing test for lesson:'))).toBe(true);
    // The unit test must not silently ignore the new lesson either.
    expect(report.errors.some((issue) => issue.includes(`${unitTestId}: does not cover ${FIXTURE_LESSON_ID}`))).toBe(true);
    expect(auditTestBank(withoutTest)).toEqual(report.errors);
  });

  it('Test 4: a complete lesson test (questions + blueprint + concepts) makes the audit pass', () => {
    expect(fixtureIsWellFormed).toBe(true);
    expect(fixtureQuestions).toHaveLength(LESSON_TEST_QUESTION_COUNT);
    expect(new Set(fixtureQuestions.map((question) => question.type)).size).toBeGreaterThanOrEqual(4);

    const report = runTestBankAudit(snapshotWithFixtureLesson());

    expect(report.errors).toEqual([]);
    expect(report.summary.curriculumLessons).toBe(curriculumLessonRefs().length + 1);
    expect(report.summary.lessonTests).toBe(report.summary.curriculumLessons);
    expect(report.summary.questionsPerLessonTest[fixtureTestDefinition.id]).toBe(LESSON_TEST_QUESTION_COUNT);
    // The deferred unit-test update stays visible as a warning, never as silence.
    expect(report.warnings.some((warning) => warning.includes(`${FIXTURE_LESSON_ID} is not covered yet`))).toBe(true);
  });

  it('an incomplete lesson test is rejected question count by question count', () => {
    const snapshot = snapshotWithFixtureLesson();
    const shortTest = { ...fixtureTestDefinition, questionIds: fixtureTestDefinition.questionIds.slice(0, 19) };

    const report = runTestBankAudit(
      createTestBankSnapshot({
        ...snapshot,
        definitions: snapshot.definitions.map((definition) => (definition.id === shortTest.id ? shortTest : definition)),
      }),
    );
    expect(report.errors.some((issue) => issue.includes('must contain exactly 20 questions'))).toBe(true);
  });

  it('a lesson test without a blueprint is rejected', () => {
    const snapshot = snapshotWithFixtureLesson({ withBlueprint: false });
    expect(runTestBankAudit(snapshot).errors).toContain(`Missing test blueprint for lesson: ${FIXTURE_LESSON_ID}`);
  });

  it('flags questions whose concept is not taught by the lesson as suspicious', () => {
    const withoutCatalog = runTestBankAudit(snapshotWithFixtureLesson({ withConcepts: false }));
    // Provenance itself is a review signal (warning), and the blueprint check
    // additionally fails because the concepts it plans are no longer catalogued.
    expect(withoutCatalog.suspiciousQuestions.length).toBeGreaterThan(0);
    expect(
      withoutCatalog.warnings.filter((warning) => warning.includes('is not a catalogued concept')).length,
    ).toBeGreaterThan(0);
    expect(withoutCatalog.errors.some((issue) => issue.includes('is not catalogued for lesson-5'))).toBe(true);

    // A single off-lesson reference on one question is caught the same way.
    const snapshot = snapshotWithFixtureLesson();
    const stranger = {
      ...fixtureQuestions[0],
      id: 'fixture-l5-01',
      curriculumRefs: [{ lessonId: FIXTURE_LESSON_ID, conceptId: 'not-taught-anywhere' }],
    };
    const report = runTestBankAudit(
      createTestBankSnapshot({
        ...snapshot,
        questions: snapshot.questions.map((question) => (question.id === stranger.id ? stranger : question)),
      }),
    );
    expect(report.suspiciousQuestions).toContain('fixture-l5-01');
    expect(report.warnings.some((warning) => warning.includes('not-taught-anywhere'))).toBe(true);
  });

  it('validates declared sourceTopics against the concept catalog', () => {
    const snapshot = snapshotWithFixtureLesson();
    const mislabelled = {
      ...fixtureQuestions[4],
      sourceTopics: ['موضوع غير موجود في الدرس'],
    };
    const report = runTestBankAudit(
      createTestBankSnapshot({
        ...snapshot,
        questions: snapshot.questions.map((question) => (question.id === mislabelled.id ? mislabelled : question)),
      }),
    );
    expect(report.warnings.some((warning) => warning.includes('موضوع غير موجود في الدرس'))).toBe(true);

    // The fixture declares a real concept title, so a clean run raises no
    // sourceTopics warning at all.
    const clean = runTestBankAudit(snapshotWithFixtureLesson());
    expect(clean.errors).toEqual([]);
    expect(clean.warnings.filter((warning) => warning.includes('sourceTopics'))).toEqual([]);
  });

  it('declaring the unit-test update as pending turns the gap into a warning', () => {
    const undeclared = runTestBankAudit(snapshotWithFixtureLesson({ withPendingUnitCoverage: false }));
    expect(undeclared.errors.some((issue) => issue.includes(`does not cover ${FIXTURE_LESSON_ID}`))).toBe(true);

    const declared = runTestBankAudit(snapshotWithFixtureLesson());
    expect(declared.errors.some((issue) => issue.includes(`does not cover ${FIXTURE_LESSON_ID}`))).toBe(false);
  });
});

describe('the Test Area lists lesson tests from the registry', () => {
  it('Test 5: a newly registered lesson test appears without touching the component', async () => {
    vi.resetModules();
    vi.doMock('../data/tests/registry', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../data/tests/registry')>();
      return {
        ...actual,
        getTestsByType: (type: Parameters<typeof actual.getTestsByType>[0]) => {
          const tests = actual.getTestsByType(type);
          if (type !== 'lesson') return tests;
          return [...tests, fixtureTestDefinition];
        },
      };
    });

    const { render, screen } = await import('@testing-library/react');
    const { TestsArea } = await import('../components/tests/TestsArea');
    const { container } = render(<TestsArea onStartTest={() => {}} />);

    const cards = [...container.querySelectorAll('.test-card h3')].map((heading) => heading.textContent);
    expect(cards).toContain(fixtureTestDefinition.title);
    for (const test of getTestsByType('lesson')) {
      expect(cards, `missing card for ${test.id}`).toContain(test.title);
    }
    expect(screen.getByRole('heading', { name: 'اختبارات الدروس' })).toBeInTheDocument();
    // The section copy must not hardcode how many lesson tests exist.
    const intros = [...container.querySelectorAll('.test-section-intro')]
      .map((intro) => intro.textContent ?? '');
    expect(intros.some((intro) => intro.includes(`${getTestsByType('lesson').length + 1} اختبارات مستقلة`))).toBe(true);

    vi.doUnmock('../data/tests/registry');
    vi.resetModules();
  });

  it('the catalog section copy is derived from the registry, not from a fixed number', async () => {
    const { render } = await import('@testing-library/react');
    const { TestsArea } = await import('../components/tests/TestsArea');
    const { container } = render(<TestsArea onStartTest={() => {}} />);

    const intros = [...container.querySelectorAll('.test-section-intro')]
      .map((intro) => intro.textContent ?? '');
    expect(intros.some((intro) => intro.includes(`${getTestsByType('lesson').length} اختبارات مستقلة`))).toBe(true);
    expect(fixtureLessonRef.lessonId).toBe(FIXTURE_LESSON_ID);
    expect(fixtureConceptProfile.lessonId).toBe(FIXTURE_LESSON_ID);
  });
});
