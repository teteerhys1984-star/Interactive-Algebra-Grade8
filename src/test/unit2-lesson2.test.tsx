import { describe, expect, it } from 'vitest';
import { curriculum, getLessonById, getUnitById } from '../data/curriculum';
import { unit2Lesson2Data } from '../data/unit2/lesson02';
import { unit2Lesson2TeacherSolutions } from '../data/unit2/lesson02TeacherSolutions';
import { unit2Lesson2TestQuestions } from '../data/tests/unit2/lesson-2';
import { auditTestBank } from '../data/tests/audit';
import { blueprintForLesson } from '../data/tests/blueprints';
import { conceptProfileForLesson, resolveConceptReference } from '../data/tests/concepts';
import { getLessonTestId, lessonsMissingTests } from '../data/tests/lessonTests';
import { getTestsByType, questionBank, resolveTest } from '../data/tests/registry';
import { gradeQuestion, isAnswerProvided, scoreTest } from '../data/tests/scoring';
import type {
  ErrorAnalysisQuestion,
  MatchingQuestion,
  MultiSelectQuestion,
  NumericQuestion,
  OrderingQuestion,
  QuestionAnswer,
  SingleChoiceQuestion,
  TestQuestion,
  TrueFalseQuestion,
} from '../data/tests/types';

/**
 * Regression checks for Unit 2, Lesson 2 (قواعد قوى العدد 10, pages 29–31).
 *
 * They lock in three things that must not drift:
 *  1. registration — the lesson and its test appear exactly once, in curriculum
 *     order, and nothing belonging to Unit 1 or to Lesson 1 of Unit 2 changed;
 *  2. source honesty — the source notes (`verifyNote`, `sourceNote`), the
 *     platform-authored flags, and the two reviewed answer-key/math fixes stay;
 *  3. the 20-question test — its distribution matches its blueprint, and every
 *     stored key is the mathematically correct answer (recomputed here from the
 *     exponent arithmetic itself, not copied from the question).
 */

const LESSON_ID = 'u2-lesson-2';
const TEST_ID = 'u2-test-lesson-2';

const lesson = getLessonById('unit-2', LESSON_ID)!;
const blocks = lesson.steps.flatMap((step) => step.blocks);
const subItems = blocks.flatMap((block) => block.subItems ?? []);
const questions = unit2Lesson2TestQuestions;

const byId = (id: string): TestQuestion => {
  const question = questions.find((entry) => entry.id === id);
  if (!question) throw new Error(`missing question ${id}`);
  return question;
};

const single = (id: string): SingleChoiceQuestion => byId(id) as SingleChoiceQuestion;
const numericQuestion = (id: string): NumericQuestion => byId(id) as NumericQuestion;
const trueFalse = (id: string): TrueFalseQuestion => byId(id) as TrueFalseQuestion;
const errorAnalysis = (id: string): ErrorAnalysisQuestion => byId(id) as ErrorAnalysisQuestion;
const multiSelect = (id: string): MultiSelectQuestion => byId(id) as MultiSelectQuestion;
const ordering = (id: string): OrderingQuestion => byId(id) as OrderingQuestion;
const matching = (id: string): MatchingQuestion => byId(id) as MatchingQuestion;

/** The answer held inside the question model — what the grader must accept. */
const storedAnswer = (question: TestQuestion): QuestionAnswer => {
  switch (question.type) {
    case 'single-choice':
    case 'error-analysis':
      return question.correctOptionId;
    case 'true-false':
      return question.correctAnswer;
    case 'numeric':
      return question.acceptedAnswers[0];
    case 'multi-select':
      return [...question.correctOptionIds];
    case 'ordering':
      return [...question.correctOrder];
    case 'matching':
      return { ...question.correctPairs };
  }
};

/** A response that is provided but must be graded wrong. */
const wrongAnswer = (question: TestQuestion): QuestionAnswer => {
  switch (question.type) {
    case 'single-choice':
    case 'error-analysis': {
      const other = question.options.find((option) => option.id !== question.correctOptionId);
      return other ? other.id : 'zzz';
    }
    case 'true-false':
      return !question.correctAnswer;
    case 'numeric':
      return '987654321';
    case 'multi-select':
      return question.correctOptionIds.slice(0, -1);
    case 'ordering':
      return [...question.correctOrder].reverse();
    case 'matching': {
      const keys = Object.keys(question.correctPairs);
      const flipped = { ...question.correctPairs };
      flipped[keys[0]] = `${flipped[keys[0]]}-wrong`;
      return flipped;
    }
  }
};

/** Float-safe comparison for power-of-ten arithmetic (relative tolerance). */
const sameValue = (actual: number, expected: number): boolean =>
  actual === expected
  || Math.abs(actual - expected) <= 1e-9 * Math.max(Math.abs(actual), Math.abs(expected));

function counts(values: string[]): Record<string, number> {
  const total: Record<string, number> = {};
  for (const value of values) total[value] = (total[value] ?? 0) + 1;
  return total;
}

describe('Unit 2, Lesson 2 — registration and curriculum position', () => {
  it('registers the lesson exactly once, right after Lesson 1', () => {
    const unit = getUnitById('unit-2')!;
    expect(unit.lessons.map((entry) => entry.id)).toEqual(['u2-lesson-1', 'u2-lesson-2']);
    expect(unit.lessons.filter((entry) => entry.id === LESSON_ID)).toHaveLength(1);
    expect(getLessonById('unit-2', LESSON_ID)).toBe(unit2Lesson2Data);

    expect(lesson.id).toBe(LESSON_ID);
    expect(lesson.number).toBe(2);
    expect(lesson.unitId).toBe('unit-2');
    expect(lesson.title).toBe('قواعد قوى العدد 10');
    expect(lesson.sourcePages).toEqual([29, 30, 31]);
  });

  it('leaves Unit 1, Unit 2 Lesson 1 and the unit page range untouched', () => {
    expect(curriculum[0].id).toBe('unit-1');
    expect(curriculum[0].lessons.map((entry) => entry.id)).toEqual([
      'lesson-1', 'lesson-2', 'lesson-3', 'lesson-4',
    ]);
    expect(getUnitById('unit-2')!.sourcePages).toEqual([25, 26, 27, 28]);

    const lesson1 = getLessonById('unit-2', 'u2-lesson-1')!;
    expect(lesson1.title).toBe('قوى العدد 10');
    expect(lesson1.steps).toHaveLength(13);
    expect(resolveTest('u2-test-lesson-1')!.questionCount).toBe(20);
    expect(resolveTest('u2-test-lesson-1')!.questions.every((q) => q.id.startsWith('u2-l1-'))).toBe(true);
  });

  it('gives every step and block a real source page in 29–31 with unique ids', () => {
    expect(lesson.steps).toHaveLength(11);
    const stepIds = lesson.steps.map((step) => step.id);
    expect(new Set(stepIds).size).toBe(stepIds.length);

    for (const step of lesson.steps) {
      expect(step.sourcePages.length, step.id).toBeGreaterThan(0);
      expect(step.sourcePages.every((page) => page >= 29 && page <= 31), step.id).toBe(true);
      expect(step.blocks.length, step.id).toBeGreaterThan(0);
    }

    const blockIds = blocks.map((block) => block.id);
    expect(new Set(blockIds).size).toBe(blockIds.length);
    expect(blocks.every((block) => block.sourceRef.page >= 29 && block.sourceRef.page <= 31)).toBe(true);
  });

  it('never enables a Unit 2 unit test', () => {
    expect(getTestsByType('unit').map((test) => test.unitId)).toEqual(['unit-1']);
    expect(getTestsByType('unit').some((test) => test.unitId === 'unit-2')).toBe(false);
  });
});

describe('Unit 2, Lesson 2 — source notes and reviewed fixes', () => {
  it('keeps all eight verifyNote flags and the «شرح المنصة» tagging of authored blocks', () => {
    const verifyNotes = [
      ...blocks.map((block) => block.verifyNote),
      ...subItems.map((item) => item.verifyNote),
    ].filter((note): note is string => Boolean(note));

    expect(verifyNotes).toHaveLength(8);
    expect(verifyNotes.every((note) => note.startsWith('ملاحظة المصدر'))).toBe(true);

    // Platform-authored teaching material is never attributed to the textbook:
    // every teach/insight/mistake block (plus the rules explorer) is flagged.
    const authored = blocks.filter((block) => block.authored === true);
    expect(authored).toHaveLength(26);
    expect(authored.every((block) => block.sourceRef.section === 'شرح المنصة')).toBe(true);
    for (const type of ['teach', 'insight', 'mistake'] as const) {
      const ofType = blocks.filter((block) => block.type === type);
      expect(ofType.length, type).toBeGreaterThan(0);
      expect(ofType.every((block) => block.authored === true), `${type} must be authored`).toBe(true);
    }
    const explorer = blocks.find((block) => block.id === 'p29-explorer');
    expect(explorer, 'the exponent-rules explorer must exist').toBeDefined();
    expect(explorer!.authored).toBe(true);
    expect(explorer!.interactiveType).toBe('exponent-rules-explorer');
  });

  it('keeps sub-item math and mathFormula as raw TeX for the <Math> renderer (F1)', () => {
    const drill = blocks.find((block) => block.id === 'p31-drill-3');
    expect(drill, 'p31-drill-3 must exist').toBeDefined();
    expect(drill!.subItems).toHaveLength(2);
    expect(drill!.subItems![0].math).toBe('0.000\\,000\\,1\\ \\text{mm}');
    expect(drill!.subItems![1].math).toBe('\\frac{1}{10^{-7}}');

    // Raw-Math fields must never carry $ delimiters (they are not MathText).
    for (const item of subItems) {
      expect(item.math ?? '', 'subItem math').not.toContain('$');
      expect(item.solution ?? '', 'subItem solution').not.toContain('$');
    }
    for (const block of blocks) {
      expect(block.mathFormula ?? '', block.id).not.toContain('$');
    }
  });

  it('keeps the answer-key rule order of the book: ضرب، مقلوب، قسمة، قوة القوة (F2)', () => {
    const answerKeys = lesson.teacherArea!.answerKeys;
    expect(answerKeys).toHaveLength(10);
    expect(answerKeys.reduce((total, group) => total + group.items.length, 0)).toBe(44);

    const rules = answerKeys.find((group) => group.section.includes('القواعد الأربع'));
    expect(rules, 'the four-rules answer key must exist').toBeDefined();
    expect(rules!.items.map((item) => item.ref)).toEqual([
      'قاعدة الضرب', 'قاعدة المقلوب', 'قاعدة القسمة', 'قاعدة قوة القوة',
    ]);
    expect(rules!.items.map((item) => item.answer)).toEqual([
      '10^{n}\\times10^{m}=10^{n+m}',
      '\\frac{1}{10^{n}}=10^{-n}',
      '\\frac{10^{n}}{10^{m}}=10^{n-m}',
      '(10^{n})^{m}=10^{n\\times m}',
    ]);
  });

  it('keeps the 49 step-by-step teacher solutions with their 20 source notes', () => {
    expect(lesson.teacherArea!.solutions).toBe(unit2Lesson2TeacherSolutions);
    const solutions = lesson.teacherArea!.solutions!;
    expect(solutions).toHaveLength(49);

    const ids = solutions.map((solution) => solution.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(solutions.filter((solution) => Boolean(solution.sourceNote))).toHaveLength(20);

    for (const solution of solutions) {
      expect(solution.steps.length, solution.id).toBeGreaterThanOrEqual(2);
      expect(solution.steps.every((step) => step.trim().length > 0), solution.id).toBe(true);
      expect(solution.finalAnswer.trim(), solution.id).not.toBe('');
      expect(solution.principle.trim(), solution.id).not.toBe('');
      expect(solution.problem.trim(), solution.id).not.toBe('');
      expect(/29|30|31/.test(solution.source), solution.id).toBe(true);
    }

    // Every textbook item the teacher sees is grouped, and no group is empty.
    const groups = [...new Set(solutions.map((solution) => solution.group))];
    expect(groups).toHaveLength(10);
    for (const group of groups) {
      expect(solutions.some((solution) => solution.group === group)).toBe(true);
    }
  });
});

describe('Unit 2, Lesson 2 — test registration', () => {
  it('links exactly one lesson test holding exactly 20 questions', () => {
    expect(getLessonTestId(LESSON_ID)).toBe(TEST_ID);
    const resolved = resolveTest(TEST_ID)!;
    expect(resolved.type).toBe('lesson');
    expect(resolved.unitId).toBe('unit-2');
    expect(resolved.lessonId).toBe(LESSON_ID);
    expect(resolved.questionCount).toBe(20);
    expect(resolved.questions).toHaveLength(20);
    expect(questions).toHaveLength(20);

    const definition = getTestsByType('lesson').find((test) => test.id === TEST_ID)!;
    expect(definition.questionIds).toHaveLength(20);
    expect(definition.questionIds).toEqual(questions.map((question) => question.id));

    const ids = questions.map((question) => question.id);
    expect(new Set(ids).size).toBe(20);
    expect(ids.every((id) => /^u2-l2-\d{2}$/.test(id))).toBe(true);
    // Each question is registered once in the shared bank (no duplicates).
    for (const id of ids) {
      expect(questionBank.filter((question) => question.id === id), id).toHaveLength(1);
    }
    expect(lessonsMissingTests()).toEqual([]);
  });

  it('attaches the blueprint and the concept catalog of the lesson', () => {
    const blueprint = blueprintForLesson(LESSON_ID);
    expect(blueprint, 'blueprint must be registered').toBeDefined();
    expect(blueprint!.lessonId).toBe(LESSON_ID);
    expect(blueprint!.sourceSteps).toEqual(lesson.steps.map((step) => step.id));
    expect(blueprint!.commonMistakes.length).toBeGreaterThan(0);
    expect(resolveTest(TEST_ID)!.blueprint).toBe(blueprint);

    const profile = conceptProfileForLesson(LESSON_ID);
    expect(profile, 'concept profile must be registered').toBeDefined();
    expect(profile!.lessonId).toBe(LESSON_ID);
    expect(profile!.unitId).toBe('unit-2');
    expect(profile!.concepts).toHaveLength(7);

    for (const question of questions) {
      expect(question.primaryLessonId, question.id).toBe(LESSON_ID);
      expect(
        resolveConceptReference(LESSON_ID, question.curriculumRefs[0].conceptId),
        `${question.id} must reference a catalogued concept`,
      ).toBeDefined();
    }
  });

  it('matches the blueprint difficulty, type and concept distribution', () => {
    const blueprint = blueprintForLesson(LESSON_ID)!;

    const difficulty = counts(questions.map((question) => question.difficulty));
    expect(difficulty).toEqual({ basic: 6, intermediate: 7, advanced: 4, reasoning: 3 });
    expect(blueprint.difficultyPlan).toEqual(difficulty);
    // The plan follows the recommended 6/7/4/3 profile, so no rationale is needed.
    expect(blueprint.deviationRationale).toBeUndefined();

    const types = counts(questions.map((question) => question.type));
    expect(types).toEqual({
      'single-choice': 6,
      numeric: 6,
      'true-false': 3,
      'error-analysis': 2,
      'multi-select': 1,
      ordering: 1,
      matching: 1,
    });
    expect(blueprint.questionTypePlan).toEqual(types);
    expect(Object.keys(types).length).toBeGreaterThanOrEqual(4);
    for (const [type, count] of Object.entries(types)) {
      expect(count / questions.length, `${type} share`).toBeLessThanOrEqual(0.5);
    }

    const concepts = counts(questions.map((question) => question.curriculumRefs[0].conceptId));
    expect(Object.keys(concepts)).toHaveLength(7);
    for (const [conceptId, count] of Object.entries(concepts)) {
      expect(count / questions.length, `${conceptId} share`).toBeLessThanOrEqual(0.4);
      const planned = blueprint.concepts.find((entry) => entry.conceptId === conceptId);
      expect(planned, `${conceptId} must be planned`).toBeDefined();
      expect(planned!.questionCount, conceptId).toBe(count);
      expect(
        conceptProfileForLesson(LESSON_ID)!.concepts.find((entry) => entry.id === conceptId)!.title,
        conceptId,
      ).toBe(planned!.title);
    }
    expect(blueprint.concepts.reduce((total, entry) => total + entry.questionCount, 0)).toBe(20);
  });

  it('passes the whole-bank audit with no errors', () => {
    expect(auditTestBank()).toEqual([]);
  });
});

describe('Unit 2, Lesson 2 — every stored key is the correct answer', () => {
  it('grades the stored answer right and any other provided answer wrong', () => {
    for (const question of questions) {
      expect(gradeQuestion(question, storedAnswer(question)), `${question.id} stored key`).toBe(true);
      expect(gradeQuestion(question, wrongAnswer(question)), `${question.id} wrong answer`).toBe(false);
      expect(question.solution.steps.length, question.id).toBeGreaterThanOrEqual(2);
      expect(question.solution.finalAnswer.trim(), question.id).not.toBe('');
      expect(question.solution.explanation.trim(), question.id).not.toBe('');
    }
  });

  it('recomputes the exponent arithmetic behind each of the 20 keys', () => {
    // 01 — product rule: 10^3 × 10^4 = 10^7, and only option a gives 10^7.
    expect(single('u2-l2-01').correctOptionId).toBe('a');
    expect(3 + 4).toBe(7);
    expect(10 ** 3 * 10 ** 4).toBe(10 ** 7);
    expect(10 ** 3 * 10 ** 21).not.toBe(10 ** 7);
    expect(10 ** 3 + 10 ** 4).not.toBe(10 ** 7);
    expect(20 ** 7).not.toBe(10 ** 7);

    // 02 — unknown exponent in a product: 10^6 × 10^n = 10^14 ⇒ n = 8.
    expect(numericQuestion('u2-l2-02').acceptedAnswers).toEqual(['8']);
    expect(6 + 8).toBe(14);
    expect(10 ** 6 * 10 ** 8).toBe(10 ** 14);

    // 03 — quotient rule: 10^9 ÷ 10^4 = 10^5.
    expect(numericQuestion('u2-l2-03').acceptedAnswers).toEqual(['5']);
    expect(9 - 4).toBe(5);
    expect(10 ** 9 / 10 ** 4).toBe(10 ** 5);

    // 04 — power of a power: (10^4)^3 = 10^12.
    expect(numericQuestion('u2-l2-04').acceptedAnswers).toEqual(['12']);
    expect(4 * 3).toBe(12);
    expect((10 ** 4) ** 3).toBe(10 ** 12);

    // 05 — reciprocal: 1/10^6 = 10^-6 (the sign flips, it is not a positive 6).
    expect(numericQuestion('u2-l2-05').acceptedAnswers).toEqual(['-6']);
    expect(sameValue(1 / 10 ** 6, 10 ** -6)).toBe(true);
    expect(10 ** -6).not.toBe(10 ** 6);

    // 06 — bounding: 10^-3 < 0.004 < 10^-2 is true.
    expect(trueFalse('u2-l2-06').correctAnswer).toBe(true);
    expect(10 ** -3).toBeLessThan(0.004);
    expect(0.004).toBeLessThan(10 ** -2);

    // 07 — a wrong product claim: 10^5 × 10^2 = 10^7, not 10^10.
    expect(trueFalse('u2-l2-07').correctAnswer).toBe(false);
    expect(10 ** 5 * 10 ** 2).toBe(10 ** 7);
    expect(10 ** 5 * 10 ** 2).not.toBe(10 ** 10);

    // 08 — quotient with a negative result: 10^3 ÷ 10^5 = 10^-2.
    expect(single('u2-l2-08').correctOptionId).toBe('b');
    expect(3 - 5).toBe(-2);
    expect(10 ** 3 / 10 ** 5).toBe(10 ** -2);

    // 09 — power of a negative power: (10^-4)^3 = 10^-12.
    expect(single('u2-l2-09').correctOptionId).toBe('a');
    expect(-4 * 3).toBe(-12);
    expect(sameValue((10 ** -4) ** 3, 10 ** -12)).toBe(true);
    expect((10 ** -6) ** -2).not.toBe(10 ** -12);
    expect(10 ** -4 * 10 ** -3).not.toBe(10 ** -12);

    // 10 — reciprocal of a negative power: 1/10^-9 = 10^9.
    expect(single('u2-l2-10').correctOptionId).toBe('b');
    expect(-(-9)).toBe(9);
    expect(sameValue(1 / 10 ** -9, 10 ** 9)).toBe(true);

    // 11 — coefficients times powers: (3×10^5)(4×10^2) = 12×10^7 = 1.2×10^8.
    expect(numericQuestion('u2-l2-11').acceptedAnswers).toEqual(['8']);
    expect(3 * 4).toBe(12);
    expect(5 + 2).toBe(7);
    expect(3e5 * 4e2).toBe(1.2e8);
    expect(12e7).toBe(1.2e8);

    // 12 — the method order is a permutation of the four presented items.
    const order = ordering('u2-l2-12');
    expect(order.correctOrder).toEqual(['s2', 's1', 's3', 's4']);
    expect([...order.correctOrder].sort()).toEqual(order.items.map((item) => item.id).sort());
    expect(order.correctOrder).not.toEqual(order.items.map((item) => item.id));

    // 13 — 3.6×10^5 sits between two consecutive powers: 10^5 < N < 10^6.
    expect(single('u2-l2-13').correctOptionId).toBe('b');
    expect(10 ** 5).toBeLessThan(3.6e5);
    expect(3.6e5).toBeLessThan(10 ** 6);
    expect(10 ** 6 / 10 ** 5).toBe(10); // consecutive powers differ by a factor of 10
    expect(10 ** 7 / 10 ** 5).not.toBe(10); // so 10^5 < N < 10^7 is not a consecutive bound

    // 14 — adding two negative exponents: -3 + (-5) = -8.
    expect(errorAnalysis('u2-l2-14').correctOptionId).toBe('a');
    expect(-3 + -5).toBe(-8);
    expect(-3 * -5).toBe(15);
    expect(sameValue(10 ** -3 * 10 ** -5, 10 ** -8)).toBe(true);

    // 15 — three expressions equal 10^4 and one equals 10^6.
    expect([...multiSelect('u2-l2-15').correctOptionIds].sort()).toEqual(['a', 'b', 'c']);
    expect(sameValue(1 / 10 ** -4, 10 ** 4)).toBe(true);
    expect(10 ** 7 / 10 ** 3).toBe(10 ** 4);
    expect((10 ** 2) ** 2).toBe(10 ** 4);
    expect(10 ** 8 / 10 ** 2).toBe(10 ** 6);
    expect(10 ** 8 / 10 ** 2).not.toBe(10 ** 4);

    // 16 — division in a×10^n form: (6×10^8) ÷ (3×10^2) = 2×10^6.
    expect(numericQuestion('u2-l2-16').acceptedAnswers).toEqual(['6']);
    expect(6 / 3).toBe(2);
    expect(8 - 2).toBe(6);
    expect(6e8 / 3e2).toBe(2e6);

    // 17 — each left item matches exactly one distinct right value.
    const pairs = matching('u2-l2-17');
    expect(pairs.correctPairs).toEqual({ l1: 'r2', l2: 'r4', l3: 'r1', l4: 'r3' });
    expect(Object.keys(pairs.correctPairs).sort()).toEqual(pairs.leftItems.map((item) => item.id).sort());
    expect(Object.values(pairs.correctPairs).sort()).toEqual(pairs.rightItems.map((item) => item.id).sort());
    expect(10 ** 8).toBe(1e8);
    expect(10 ** -3).toBe(1e-3);
    expect(sameValue((10 ** -2) ** 4, 1e-8)).toBe(true);
    expect(sameValue(1 / 10 ** 1, 1e-1)).toBe(true);

    // 18 — the claim "10^n ÷ 10^m is always smaller than 10^n" fails for m < 0.
    expect(trueFalse('u2-l2-18').correctAnswer).toBe(false);
    expect(sameValue(10 ** 1 / 10 ** -2, 10 ** 3)).toBe(true);
    expect(10 ** 3).toBeGreaterThan(10 ** 1);

    // 19 — power of a power multiplies: (10^2)^5 = 10^10, not 10^7.
    expect(errorAnalysis('u2-l2-19').correctOptionId).toBe('c');
    expect(2 * 5).toBe(10);
    expect((10 ** 2) ** 5).toBe(10 ** 10);
    expect((10 ** 2) ** 5).not.toBe(10 ** 7);

    // 20 — for every integer n: 10^n × 10^-n = 10^0 = 1.
    expect(single('u2-l2-20').correctOptionId).toBe('a');
    for (const n of [-3, -1, 0, 1, 5]) {
      expect(sameValue(10 ** n * 10 ** -n, 1), `n = ${n}`).toBe(true);
      expect(n + -n).toBe(0);
    }
    expect(10 ** 0).toBe(1);
  });

  it('gives no result before submission and a full score only for correct answers', () => {
    for (const question of questions) {
      expect(isAnswerProvided(question, undefined), question.id).toBe(false);
    }

    const beforeSubmit = scoreTest(questions, {});
    expect(beforeSubmit.correctCount).toBe(0);
    expect(beforeSubmit.incorrectCount).toBe(0);
    expect(beforeSubmit.unansweredCount).toBe(20);
    expect(beforeSubmit.earnedPoints).toBe(0);
    expect(beforeSubmit.percentage).toBe(0);

    const allAnswers = questions.reduce<Record<string, QuestionAnswer>>((map, question) => {
      map[question.id] = storedAnswer(question);
      return map;
    }, {});
    const afterSubmit = scoreTest(questions, allAnswers);
    expect(afterSubmit.correctCount).toBe(20);
    expect(afterSubmit.unansweredCount).toBe(0);
    expect(afterSubmit.earnedPoints).toBe(afterSubmit.totalPoints);
    expect(afterSubmit.percentage).toBe(100);

    // One wrong answer costs exactly that question — the retry path starts clean.
    const oneWrong = { ...allAnswers, 'u2-l2-01': wrongAnswer(byId('u2-l2-01')) };
    const partial = scoreTest(questions, oneWrong);
    expect(partial.correctCount).toBe(19);
    expect(partial.incorrectCount).toBe(1);
    expect(scoreTest(questions, {}).correctCount).toBe(0);
  });
});
