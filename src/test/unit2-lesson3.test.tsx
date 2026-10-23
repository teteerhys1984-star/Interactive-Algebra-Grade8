import { describe, expect, it } from 'vitest';
import { curriculum, getLessonById, getUnitById } from '../data/curriculum';
import { unit2Lesson3Data } from '../data/unit2/lesson03';
import { unit2Lesson3TestQuestions } from '../data/tests/unit2/lesson-3';
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

import audit from '../data/unit2/lesson03.source-audit.json';
import { evaluateTex, fromFractionText, mathShape } from './fixtures/lesson3-exact-math';

const LESSON_ID = 'u2-lesson-3';
const TEST_ID = 'u2-test-lesson-3';

const lesson = getLessonById('unit-2', LESSON_ID)!;
const blocks = lesson.steps.flatMap((step) => step.blocks);
const subItems = blocks.flatMap((block) => block.subItems ?? []);
const questions = unit2Lesson3TestQuestions;

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

/** Exact integer/exponent arithmetic: 0.4^-3 must compare without float noise. */
const fractionValue = (num: number, den = 1): number => num / den;
const sameValue = (actual: number, expected: number): boolean =>
  actual === expected
  || Math.abs(actual - expected) <= 1e-9 * Math.max(1, Math.abs(expected));

function counts(values: string[]): Record<string, number> {
  const total: Record<string, number> = {};
  for (const value of values) total[value] = (total[value] ?? 0) + 1;
  return total;
}

describe('Unit 2, Lesson 3 — registration and curriculum position', () => {
  it('registers the lesson exactly once, right after Lesson 2', () => {
    const unit = getUnitById('unit-2')!;
    expect(unit.lessons.map((entry) => entry.id)).toEqual(['u2-lesson-1', 'u2-lesson-2', 'u2-lesson-3', 'u2-lesson-4', 'u2-lesson-5']);
    expect(unit.lessons.filter((entry) => entry.id === LESSON_ID)).toHaveLength(1);
    expect(getLessonById('unit-2', LESSON_ID)).toBe(unit2Lesson3Data);

    expect(lesson.id).toBe(LESSON_ID);
    expect(lesson.number).toBe(3);
    expect(lesson.unitId).toBe('unit-2');
    expect(lesson.title).toBe('قوى صحيحة لعدد نسبي');
    expect(lesson.sourcePages).toEqual([32, 33, 34]);
  });

  it('leaves Unit 1, the earlier Unit 2 lessons and the unit page range untouched', () => {
    expect(curriculum[0].id).toBe('unit-1');
    expect(curriculum[0].lessons.map((entry) => entry.id)).toEqual([
      'lesson-1', 'lesson-2', 'lesson-3', 'lesson-4',
    ]);
    // The unit keeps the range of Lessons 1–2 exactly as it was; Lesson 3 carries
    // its own pages 32–34 (pages 29–31 belong to Lesson 2 and were never added here).
    expect(getUnitById('unit-2')!.sourcePages).toEqual([25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37]);

    const lesson1 = getLessonById('unit-2', 'u2-lesson-1')!;
    expect(lesson1.title).toBe('قوى العدد 10');
    // الدرس الأول أُعيد بناؤه في مهمته الخاصة، فيُفحص بقاؤه مسجّلًا على صفحاته
    // (26–28) دون أن يبتلع صفحات هذا الدرس (32–34).
    expect(lesson1.sourcePages).toEqual([26, 27, 28]);
    expect(lesson1.steps.every((step) => step.sourcePages.every((page) => page >= 26 && page <= 28))).toBe(true);
    const lesson2 = getLessonById('unit-2', 'u2-lesson-2')!;
    expect(lesson2.title).toBe('قواعد قوى العدد 10');
    expect(lesson2.sourcePages).toEqual([29, 30, 31]);

    expect(resolveTest('u2-test-lesson-1')!.questionCount).toBe(20);
    expect(resolveTest('u2-test-lesson-2')!.questionCount).toBe(20);
    expect(resolveTest('u2-test-lesson-1')!.questions.every((q) => q.id.startsWith('u2-l1-'))).toBe(true);
    expect(resolveTest('u2-test-lesson-2')!.questions.every((q) => q.id.startsWith('u2-l2-'))).toBe(true);
  });

  it('gives every step and block a real source page in 32–34 with unique ids', () => {
    expect(lesson.steps).toHaveLength(17);
    expect(lesson.steps.map((step) => step.id)).toEqual(
      Array.from({ length: 17 }, (_, index) => `step-${index + 1}`),
    );

    for (const step of lesson.steps) {
      expect(step.sourcePages.length, step.id).toBeGreaterThan(0);
      expect(step.sourcePages.every((page) => page >= 32 && page <= 34), step.id).toBe(true);
      expect(step.blocks.length, step.id).toBeGreaterThan(0);
    }

    const blockIds = blocks.map((block) => block.id);
    expect(new Set(blockIds).size).toBe(blockIds.length);
    expect(blocks.every((block) => block.sourceRef.page >= 32 && block.sourceRef.page <= 34)).toBe(true);
    expect([...new Set(blocks.map((block) => block.sourceRef.page))].sort()).toEqual([32, 33, 34]);
  });

  it('leaves the Unit 2 unit test as the only unit-2 unit test, separate from its lesson tests', () => {
    expect(getTestsByType('unit').map((test) => test.unitId)).toEqual(['unit-1', 'unit-2']);
    expect(getTestsByType('unit').filter((test) => test.unitId === 'unit-2').map((test) => test.id)).toEqual(['u2-test-unit-2']);
  });
});

describe('Unit 2, Lesson 3 — source inventory and independent image audit', () => {
  it('starts at the actual p32 lesson title, not at the separate p25 warmup', () => {
    expect(audit.startBoundary.lessonBeginsOn).toBe(32);
    expect(audit.startBoundary.separateWarmup).toContain('ص25');
    expect(audit.sourceFiles.map((file) => file.page)).toEqual([32, 33, 34]);
    expect(audit.unresolvedSourcePositions).toEqual([]);
  });

  it('preserves all 27 source blocks in exact textbook sequence', () => {
    expect(blocks.filter((block) => !block.authored).map((block) => block.id)).toEqual(audit.bookBlockSequence);
    expect(blocks.filter((block) => !block.authored)).toHaveLength(27);
  });

  it('matches every sign, exponent, factor, fraction and label in all 39 exercise items', () => {
    expect(audit.exerciseGroups.reduce((sum, group) => sum + group.items.length, 0)).toBe(39);
    for (const group of audit.exerciseGroups) {
      const block = blocks.find((entry) => entry.id === group.blockId)!;
      expect(block.sourceRef.page, block.id).toBe(group.page);
      expect(block.sourceRef.section, block.id).toBe(group.section);
      expect(block.sourceRef.item, block.id).toBe(group.item);
      expect(block.subItems, block.id).toHaveLength(group.items.length);
      group.items.forEach((expected, index) => {
        const item = block.subItems![index];
        expect(item.label, `${block.id}/${index}`).toBe(expected.label);
        if (expected.math) {
          expect(mathShape(item.math!), `${block.id}/${index}`).toBe(mathShape(expected.math));
          expect(evaluateTex(item.math!), `${block.id}/${index}`).toEqual(fromFractionText(expected.value));
        }
      });
    }
    const cube = blocks.find((block) => block.id === 'p34-drill-4')!;
    expect(cube.content).toContain('\\frac32');
    expect(cube.content).toContain('السنتيمترات المكعبة');
  });

  it('preserves the literal definitions while qualifying their domains in platform teaching', () => {
    const text = (id: string) => blocks.find((block) => block.id === id)!.content;
    expect(text('p32-def1-power')).toContain('$n\\ge2$');
    expect(text('p32-def1-zero')).toContain('$a^1=a$');
    expect(text('p32-def1-zero')).toContain('$a\\ne0$');
    expect(text('p32-def1-special')).toContain('$1^1=1$');
    expect(text('p32-def1-special')).toContain('$n\\ne0$');
    expect(text('p32-def1-special')).not.toContain('1^n');
    expect(text('p32-special-domain')).toContain('موجبًا فقط');
    expect(text('p32-special-domain')).toContain('$0^0$ غير معرّف');
    expect(text('p32-def2-reciprocal')).toContain('$a\\ne0$');
    expect(text('p33-quotient-power-why')).toContain('$b\\ne0$');
    expect(text('p33-quotient-power-why')).toContain('$a\\ne0$');
  });

  it('separates authored teaching, examples, experiments and graduated practice from the textbook', () => {
    for (const block of blocks.filter((block) => block.authored)) {
      expect(block.sourceRef.section, block.id).toBe('شرح المنصة');
    }
    for (const type of ['teach', 'insight', 'mistake', 'interactive-exercise']) {
      expect(blocks.filter((block) => block.type === type).every((block) => block.authored)).toBe(true);
    }
    const labs = blocks.filter((block) => block.interactiveType && block.interactiveType !== 'practice-check');
    expect(labs.map((block) => block.interactiveType)).toEqual([
      'integer-power-studio', 'power-rules-studio', 'power-rules-studio', 'order-of-operations-lab', 'cube-volume-lab',
    ]);
    expect(blocks.find((block) => block.id === 'p32-rule-studio-12')!.interactiveData?.rules).toEqual(['product', 'product-power']);
    expect(blocks.find((block) => block.id === 'p33-rule-studio-34')!.interactiveData?.rules).toEqual(['quotient', 'quotient-power']);
    expect(labs.every((block) => block.authored && block.content.length > 100)).toBe(true);
    expect(lesson.steps[15].blocks.every((block) => block.authored)).toBe(true);
    expect(lesson.steps[16].blocks).toHaveLength(6);
  });

  it('keeps Arabic explanatory labels in prose and avoids unrendered TeX in plain lesson-test metadata', () => {
    const natural = blocks.find((block) => block.id === 'p32-def1-power')!;
    expect(natural.content).toContain('$n$ مرة');
    expect(natural.mathFormula).toContain('_{n}');
    const cube = blocks.find((block) => block.interactiveType === 'cube-volume-lab')!;
    expect(cube.authored).toBe(true);
    const test = resolveTest(TEST_ID)!;
    expect(test.title + test.description).not.toMatch(/\$|[a-z]\^/);
  });

  it('documents 14 transcription corrections and the separate legible zero-domain issue for teachers only', () => {
    expect(audit.corrections).toHaveLength(14);
    const notes = [...blocks, ...subItems].flatMap((entry) => entry.verifyNote ? [entry.verifyNote] : []);
    expect(notes).toHaveLength(15);
    expect(notes.every((note) => note.startsWith('ملاحظة المصدر'))).toBe(true);
    expect(notes.some((note) => /غير مقروء|يحتاج مطابقة|لم يُحسم/.test(note))).toBe(false);
    for (const correction of audit.corrections) {
      expect(notes.some((note) => note.includes(correction.note)), correction.location).toBe(true);
    }
    expect(audit.sourceInterpretationNotes).toHaveLength(1);
  });
});

describe('Lesson 3 — authored practice keys', () => {
  it('recomputes all 14 progressive check answers, including the counterexample and the zero-domain choice', () => {
    const checks = blocks.filter((block) => block.interactiveType === 'practice-check')
      .flatMap((block) => block.interactiveData!.questions as { choices: string[]; correctIndex: number }[]);
    const values = ['128', '2', '16', '-16', '1/9', '8', '4', '16', '1', '16/9', '4', 'identity', '13', 'domain'];
    expect(checks).toHaveLength(values.length);
    checks.forEach((question, index) => {
      const expected = values[index];
      if (expected === 'domain') {
        expect(question.choices[question.correctIndex]).toBe('n>0');
      } else if (expected === 'identity') {
        const trueChoices = question.choices.map((choice) => choice.split('=').map((side) => evaluateTex(side)))
          .map(([left, right]) => left.n === right.n && left.d === right.d);
        expect(trueChoices).toEqual([false, true, false]);
        expect(question.correctIndex).toBe(1);
      } else {
        question.choices.forEach((choice, choiceIndex) => {
          const actual = evaluateTex(choice.split('=')[0]);
          const target = fromFractionText(expected);
          expect(actual.n === target.n && actual.d === target.d, `${index}/${choiceIndex}`).toBe(choiceIndex === question.correctIndex);
        });
      }
    });
  });
});

describe('Unit 2, Lesson 3 — test registration', () => {
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
    expect(ids.every((id) => /^u2-l3-\d{2}$/.test(id))).toBe(true);
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
    expect(blueprint!.commonMistakes).toHaveLength(10);
    expect(resolveTest(TEST_ID)!.blueprint).toBe(blueprint);

    const profile = conceptProfileForLesson(LESSON_ID);
    expect(profile, 'concept profile must be registered').toBeDefined();
    expect(profile!.lessonId).toBe(LESSON_ID);
    expect(profile!.unitId).toBe('unit-2');
    expect(profile!.concepts).toHaveLength(10);

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
      'single-choice': 5,
      numeric: 5,
      'true-false': 3,
      'error-analysis': 2,
      'multi-select': 2,
      ordering: 2,
      matching: 1,
    });
    expect(blueprint.questionTypePlan).toEqual(types);
    expect(Object.keys(types).length).toBeGreaterThanOrEqual(4);
    for (const [type, count] of Object.entries(types)) {
      expect(count / questions.length, `${type} share`).toBeLessThanOrEqual(0.5);
    }

    const concepts = counts(questions.map((question) => question.curriculumRefs[0].conceptId));
    expect(Object.keys(concepts)).toHaveLength(10);
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

describe('Unit 2, Lesson 3 — every stored key is the correct answer', () => {
  it('grades the stored answer right and any other provided answer wrong', () => {
    for (const question of questions) {
      expect(gradeQuestion(question, storedAnswer(question)), `${question.id} stored key`).toBe(true);
      expect(gradeQuestion(question, wrongAnswer(question)), `${question.id} wrong answer`).toBe(false);
      expect(question.solution.steps.length, question.id).toBeGreaterThanOrEqual(2);
      expect(question.solution.finalAnswer.trim(), question.id).not.toBe('');
      expect(question.solution.explanation.trim(), question.id).not.toBe('');
    }
  });

  it('recomputes the power arithmetic behind each of the 20 keys', () => {
    // 01 — the meaning of a power: 4^4 = 4×4×4×4 = 256 (not 4×4 = 16).
    expect(numericQuestion('u2-l3-01').acceptedAnswers).toEqual(['256']);
    expect(4 ** 4).toBe(256);
    expect(4 * 4).not.toBe(256);
    expect(256).toBe(16 * 16);

    // 02 — the same number written as a power: 6×6×6×6 = 6^4, and only (أ) says so.
    expect(single('u2-l3-02').correctOptionId).toBe('a');
    expect(6 ** 4).toBe(1296);
    expect(6 * 4).not.toBe(1296);
    expect(4 ** 6).not.toBe(1296);
    expect(24).not.toBe(1296);

    // 03 — nonzero n alone is insufficient for a zero base over the integers.
    expect(trueFalse('u2-l3-03').correctAnswer).toBe(false);
    expect(trueFalse('u2-l3-03').prompt).toContain('لكل عدد صحيح');
    expect(0 ** 3).toBe(0);
    expect(() => evaluateTex('0^{-1}')).toThrow(RangeError);
    expect(() => evaluateTex('0^0')).toThrow(RangeError);

    // 04 — the special cases together: 5^0 + 0^3 + 1^9 = 1 + 0 + 1 = 2.
    expect(single('u2-l3-04').correctOptionId).toBe('a');
    expect(5 ** 0).toBe(1);
    expect(0 ** 3).toBe(0);
    expect(1 ** 9).toBe(1);
    expect(5 ** 0 + 0 ** 3 + 1 ** 9).toBe(2);

    // 05 — reciprocal written as a negative exponent: 1/7^5 = 7^-5 ⇒ p = −5.
    expect(numericQuestion('u2-l3-05').acceptedAnswers).toEqual(['-5']);
    expect(sameValue(1 / 7 ** 5, 7 ** -5)).toBe(true);
    expect(7 ** -5).toBeLessThan(1); // a negative exponent is not a negative number

    // 06 — each negative power matches the reciprocal of its positive power.
    const pairs = matching('u2-l3-06');
    expect(pairs.correctPairs).toEqual({ l1: 'r2', l2: 'r4', l3: 'r1', l4: 'r3' });
    expect(Object.keys(pairs.correctPairs).sort()).toEqual(pairs.leftItems.map((item) => item.id).sort());
    expect(Object.values(pairs.correctPairs).sort()).toEqual(pairs.rightItems.map((item) => item.id).sort());
    expect(sameValue(4 ** -1, 1 / 4)).toBe(true);
    expect(sameValue(2 ** -3, 1 / 8)).toBe(true);
    expect(pairs.leftItems[2].label).toContain('frac12');
    expect(sameValue((1 / 2) ** -3, 8)).toBe(true);
    expect(pairs.rightItems.find((item) => item.id === 'r1')!.label).toBe('$8$');
    expect(sameValue((-5) ** -2, 1 / 25)).toBe(true);
    expect(sameValue(1 / 4, 1 / 25)).toBe(false);

    // 07 — an even exponent wipes the sign: (−3)^4 = 81 > 0.
    expect(trueFalse('u2-l3-07').correctAnswer).toBe(false);
    expect((-3) ** 4).toBe(81);
    expect((-3) ** 4).toBeGreaterThan(0);
    expect((-3) ** 3).toBeLessThan(0); // the odd case keeps the sign

    // 08 — (−2)^6 = 64, and the same value comes from 2^6.
    expect(numericQuestion('u2-l3-08').acceptedAnswers).toEqual(['64']);
    expect((-2) ** 6).toBe(64);
    expect(2 ** 6).toBe(64);
    expect((-2) ** 4 * (-2) ** 2).toBe(64);
    expect((-2) ** 5).not.toBe(64);

    // 09 — product rule: 2^5 × 2^4 = 2^(5+4) = 2^9 = 512.
    expect(single('u2-l3-09').correctOptionId).toBe('a');
    expect(5 + 4).toBe(9);
    expect(2 ** 5 * 2 ** 4).toBe(2 ** 9);
    expect(2 ** 9).toBe(512);
    expect(2 ** 5 * 2 ** 4).toBe(32 * 16);
    expect(2 ** 20).not.toBe(512);
    expect(2 ** 1).not.toBe(512);

    // 10 — the classic slip: 3^2 × 3^5 = 3^7, not 3^10 (2 × 5 instead of 2 + 5).
    expect(errorAnalysis('u2-l3-10').correctOptionId).toBe('a');
    expect(2 + 5).toBe(7);
    expect(2 * 5).toBe(10);
    expect(3 ** 2 * 3 ** 5).toBe(3 ** 7);
    expect(3 ** 7).toBe(2187);
    expect(3 ** 2 * 3 ** 5).not.toBe(3 ** 10);

    // 11 — power of a product: 5^3 × 2^3 = 10^3 = 1,000, and the order is observational first.
    const order = ordering('u2-l3-11');
    expect(order.correctOrder).toEqual(['b', 'd', 'a', 'c']);
    expect([...order.correctOrder].sort()).toEqual(order.items.map((item) => item.id).sort());
    expect(order.correctOrder).not.toEqual(order.items.map((item) => item.id));
    expect(5 ** 3 * 2 ** 3).toBe(10 ** 3);
    expect(5 ** 3 * 2 ** 3).toBe(125 * 8);
    expect(5 ** 3 * 2 ** 3).toBe(1000);

    // 12 — two expressions equal 1,296: 6^4 and 2^4 × (−3)^4.
    expect([...multiSelect('u2-l3-12').correctOptionIds].sort()).toEqual(['a', 'd']);
    expect((-2) ** 4 * 3 ** 4).toBe(1296);
    expect(6 ** 4).toBe(1296);
    expect(2 ** 4 * (-3) ** 4).toBe(1296);
    expect(6 ** 5).toBe(7776);
    expect((-6) ** 3).toBe(-216);

    // 13 — subtracting a negative denominator exponent: −2 − (−5) = 3.
    expect(numericQuestion('u2-l3-13').acceptedAnswers).toEqual(['3']);
    expect(numericQuestion('u2-l3-13').prompt).toContain('5^{-5}');
    expect(-2 - (-5)).toBe(3);
    expect(5 ** -2 / 5 ** -5).toBeCloseTo(125, 12);

    // 14 — ordering the quotient steps of 2^7 ÷ 2^3 and verifying 2^4 = 16.
    const quotientOrder = ordering('u2-l3-14');
    expect(quotientOrder.correctOrder).toEqual(['b', 'c', 'd', 'a']);
    expect([...quotientOrder.correctOrder].sort()).toEqual(quotientOrder.items.map((item) => item.id).sort());
    expect(7 - 3).toBe(4);
    expect(2 ** 7 / 2 ** 3).toBe(2 ** 4);
    expect(2 ** 4).toBe(16);
    expect(128 / 8).toBe(16);

    // 15 — power of a quotient: (2/3)^4 = 2^4/3^4 = 16/81 (raising the numerator alone is wrong).
    expect(single('u2-l3-15').correctOptionId).toBe('a');
    expect(fractionValue(2 ** 4, 3 ** 4)).toBe(fractionValue(16, 81));
    expect(2 ** 4).toBe(16);
    expect(3 ** 4).toBe(81);
    expect(fractionValue(16, 3)).not.toBe(fractionValue(16, 81));
    expect(fractionValue(16, 81)).toBeCloseTo(0.1975308641, 9);

    // 16 — (5/2)^3 = 125/8 in lowest terms, so the numerator asked for is 125.
    expect(numericQuestion('u2-l3-16').acceptedAnswers).toEqual(['125']);
    expect(fractionValue(5 ** 3, 2 ** 3)).toBe(fractionValue(125, 8));
    expect(125 % 1).toBe(0);
    let gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    expect(gcd(125, 8)).toBe(1); // already in lowest terms

    // 17 — negative substitution AND priority; every provided option is recomputed.
    expect([...multiSelect('u2-l3-17').correctOptionIds].sort()).toEqual(['a', 'c']);
    expect(multiSelect('u2-l3-17').prompt).toContain('$x=-2$');
    const values = multiSelect('u2-l3-17').options.map((option) => evaluateTex(option.label, { x: -2 }));
    expect(values).toEqual([35, 56, 35, 4].map((value) => fromFractionText(String(value))));

    // 18 — the same slip with a product: 6 × 2^2 = 24, not (6 × 2)^2 = 144.
    expect(errorAnalysis('u2-l3-18').correctOptionId).toBe('a');
    expect(2 ** 2).toBe(4);
    expect(6 * 2 ** 2).toBe(24);
    expect(6 * 2 ** 2).not.toBe(144);
    expect((6 * 2) ** 2).toBe(144);

    // 19 — a cube of edge 1/2 dm holds 125 cm³: (1/2)³ dm³ = 1/8 dm³ = 125 cm³.
    expect(trueFalse('u2-l3-19').correctAnswer).toBe(true);
    expect(fractionValue(1, 2 ** 3)).toBe(fractionValue(1, 8));
    expect(fractionValue(1, 8) * 1000).toBe(125);
    expect(5 ** 3).toBe(125); // 1/2 dm = 5 cm, and 5³ = 125

    // 20 — doubling the edge multiplies the volume by 2³ = 8.
    expect(single('u2-l3-20').correctOptionId).toBe('c');
    expect(2 ** 3).toBe(8);
    expect(2 * 2 * 2).toBe(8);
    const volume = (side: number): number => side ** 3;
    expect(volume(2 * 3) / volume(3)).toBe(8);
    expect(volume(2 * 3) / volume(3)).not.toBe(2);
    expect(volume(2 * 3) / volume(3)).not.toBe(4);
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
    const oneWrong = { ...allAnswers, 'u2-l3-01': wrongAnswer(byId('u2-l3-01')) };
    const partial = scoreTest(questions, oneWrong);
    expect(partial.correctCount).toBe(19);
    expect(partial.incorrectCount).toBe(1);
    expect(scoreTest(questions, {}).correctCount).toBe(0);
  });
});
