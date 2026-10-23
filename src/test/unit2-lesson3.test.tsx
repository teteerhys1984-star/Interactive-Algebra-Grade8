import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SourceContentBlock } from '../components/lesson/SourceContentBlock';
import { IntegerPowerStudio } from '../components/interactive/IntegerPowerStudio';
import { PowerRulesStudio } from '../components/interactive/PowerRulesStudio';
import { OrderOfOperationsLab } from '../components/interactive/OrderOfOperationsLab';
import { curriculum, getLessonById, getUnitById } from '../data/curriculum';
import { unit2Lesson3Data } from '../data/unit2/lesson03';
import { unit2Lesson3TeacherSolutions } from '../data/unit2/lesson03TeacherSolutions';
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

/**
 * Regression checks for Unit 2, Lesson 3 (قوى صحيحة لعدد نسبي, pages 32–34).
 *
 * They lock in three things that must not drift:
 *  1. registration — the lesson and its test appear exactly once, in curriculum
 *     order, and nothing belonging to Unit 1 or to Lessons 1–2 of Unit 2 changed;
 *  2. source honesty — the `verifyNote` flags, the «شرح المنصة» tagging of every
 *     platform-authored block, and the raw-TeX hygiene of the data;
 *  3. the 20-question test — its distribution matches its blueprint, and every
 *     stored key is the mathematically correct answer (recomputed here from the
 *     power arithmetic itself, not copied from the question).
 *
 * The three new interactives are exercised at the end: each one must render RTL
 * prose around LTR-isolated KaTeX, and must show no raw TeX or `$` to students.
 */

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

const allStrings = (root: unknown): string[] => {
  const out: string[] = [];
  const walk = (node: unknown): void => {
    if (typeof node === 'string') out.push(node);
    else if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === 'object') Object.values(node).forEach(walk);
  };
  walk(root);
  return out;
};

/** النص المرئي فعلًا: نستثني نصف MathML الذي يحمل صيغة TeX المصدرية. */
const visibleTextOf = (container: HTMLElement): string => {
  const clone = container.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return clone.textContent ?? '';
};

function counts(values: string[]): Record<string, number> {
  const total: Record<string, number> = {};
  for (const value of values) total[value] = (total[value] ?? 0) + 1;
  return total;
}

describe('Unit 2, Lesson 3 — registration and curriculum position', () => {
  it('registers the lesson exactly once, right after Lesson 2', () => {
    const unit = getUnitById('unit-2')!;
    expect(unit.lessons.map((entry) => entry.id)).toEqual(['u2-lesson-1', 'u2-lesson-2', 'u2-lesson-3', 'u2-lesson-4']);
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
    expect(lesson.steps).toHaveLength(13);
    expect(lesson.steps.map((step) => step.id)).toEqual(
      Array.from({ length: 13 }, (_, index) => `step-${index + 1}`),
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

describe('Unit 2, Lesson 3 — source notes and platform-authored material', () => {
  it('keeps the ten verifyNote flags and no longer claims any unreadable item', () => {
    const verifyNotes = [
      ...blocks.map((block) => block.verifyNote),
      ...subItems.map((item) => item.verifyNote),
    ].filter((note): note is string => Boolean(note));

    expect(verifyNotes).toHaveLength(10);
    expect(verifyNotes.every((note) => note.startsWith('ملاحظة المصدر'))).toBe(true);
    // The one item that used to be flagged unreadable was resolved by a magnified
    // image of page 34, so no note may keep claiming an omitted item.
    expect(verifyNotes.filter((note) => note.includes('غير مقروء'))).toEqual([]);
  });

  it('carries all six items of «تحقّق من فهمك ②» in the book order and numbering', () => {
    const block = blocks.find((entry) => entry.id === 'p34-check-2')!;
    const items = block.subItems!;
    expect(items.map((item) => item.label)).toEqual(['①', '②', '③', '④', '⑤', '⑥']);
    expect(items.map((item) => item.math)).toEqual([
      '5^{2}',
      '5^{-2}',
      '(-9)^{2}',
      '\\left(\\frac{2}{5}\\right)^{2}',
      '\\left(-\\frac{1}{4}\\right)^{3}',
      '(-2)^{-5}',
    ]);

    // The student sees the same six labels once the block is rendered.
    const rendered = render(<SourceContentBlock block={block} />);
    const renderedText = rendered.container.textContent ?? '';
    for (const label of ['①', '②', '③', '④', '⑤', '⑥']) {
      expect(renderedText, label).toContain(label);
    }
    rendered.unmount();

    // The answer key of the same question lists the six labels with the matching values.
    const key = lesson.teacherArea!.answerKeys.find((group) => group.section.includes('② حساب الناتج'))!;
    expect(key.items.map((item) => item.ref)).toEqual(['①', '②', '③', '④', '⑤', '⑥']);
    expect(key.items.map((item) => item.answer)).toEqual([
      '5^{2}=25',
      '5^{-2}=\\frac{1}{25}=0.04',
      '(-9)^{2}=81',
      '\\left(\\frac{2}{5}\\right)^{2}=\\frac{4}{25}=0.16',
      '\\left(-\\frac{1}{4}\\right)^{3}=-\\frac{1}{64}',
      '(-2)^{-5}=-\\frac{1}{32}',
    ]);
  });

  it('tags every platform-authored block as «شرح المنصة» and keeps the four interactives', () => {
    const authored = blocks.filter((block) => block.authored === true);
    expect(authored).toHaveLength(40);
    expect(authored.every((block) => block.sourceRef.section === 'شرح المنصة')).toBe(true);

    for (const type of ['teach', 'insight', 'mistake'] as const) {
      const ofType = blocks.filter((block) => block.type === type);
      expect(ofType.length, type).toBeGreaterThan(0);
      expect(ofType.every((block) => block.authored === true), `${type} must be authored`).toBe(true);
    }

    const interactives = blocks.filter((block) => Boolean(block.interactiveType));
    expect(interactives.map((block) => `${block.id}:${block.interactiveType}`)).toEqual([
      'p32-studio-power:integer-power-studio',
      'p32-rule-studio-12:power-rules-studio',
      'p33-rule-studio-34:power-rules-studio',
      'p33-priority-lab:order-of-operations-lab',
    ]);
    expect(interactives.every((block) => block.authored === true)).toBe(true);

    // Each rules studio shows only the rules the lesson has explained so far.
    const studio12 = blocks.find((block) => block.id === 'p32-rule-studio-12')!;
    const studio34 = blocks.find((block) => block.id === 'p33-rule-studio-34')!;
    expect(studio12.interactiveData?.rules).toEqual(['product', 'product-power']);
    expect(studio34.interactiveData?.rules).toEqual(['quotient', 'quotient-power']);
  });

  it('shows no raw TeX and no `$` where the <Math> renderer receives the string', () => {
    // Backslashes are written once in the source and arrive once at the renderer:
    // a doubled backslash would print «\\times» as text inside KaTeX.
    for (const value of allStrings(lesson)) {
      expect(value.includes('\\\\'), `double backslash in: ${value.slice(0, 60)}`).toBe(false);
    }

    // Raw-Math fields must never carry $ delimiters (they are not MathText).
    for (const block of blocks) {
      expect(block.mathFormula ?? '', block.id).not.toContain('$');
    }
    for (const item of subItems) {
      expect(item.math ?? '', 'subItem math').not.toContain('$');
      expect(item.solution ?? '', 'subItem solution').not.toContain('$');
    }
    for (const group of lesson.teacherArea!.answerKeys) {
      for (const item of group.items) {
        expect(item.answer, item.ref).not.toContain('$');
        expect(item.note ?? '', item.ref).not.toContain('$');
      }
    }
  });

  it('keeps the thousand separators of the book as thin spaces, not as KaTeX line breaks', () => {
    // $8\\,000$ must reach KaTeX with a single backslash before the comma.
    const solution = unit2Lesson3TeacherSolutions.find((entry) => entry.id === 's33-ex-A')!;
    expect(solution.finalAnswer).toBe('$A = 8\\,000$');
    const check = unit2Lesson3TeacherSolutions.find((entry) => entry.id === 's34-drill4-0')!;
    expect(check.finalAnswer).toContain('3\\,375');
    expect(check.steps.some((step) => step.includes('1\\,000'))).toBe(true);
  });
});

describe('Unit 2, Lesson 3 — teacher area', () => {
  it('keeps the 13 answer-key groups, in book order, covering pages 32–34', () => {
    const answerKeys = lesson.teacherArea!.answerKeys;
    expect(answerKeys).toHaveLength(13);
    expect(answerKeys.reduce((total, group) => total + group.items.length, 0)).toBe(56);

    const rules = answerKeys.find((group) => group.section.includes('قواعد حساب القوى'));
    expect(rules, 'the four-rules answer key must exist').toBeDefined();
    expect(rules!.items.map((item) => item.ref)).toEqual(['قاعدة 1', 'قاعدة 2', 'قاعدة 3', 'قاعدة 4']);
    expect(rules!.items.map((item) => item.answer)).toEqual([
      'a^{n}\\times a^{m}=a^{n+m}',
      '(a\\times b)^{n}=a^{n}\\times b^{n}',
      '\\frac{a^{n}}{a^{m}}=a^{n-m}',
      '\\left(\\frac{a}{b}\\right)^{n}=\\frac{a^{n}}{b^{n}}',
    ]);

    // The activity items keep the order in which they are printed on page 32.
    const activity = answerKeys[0];
    expect(activity.items.map((item) => item.ref)).toEqual(['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨']);
    expect(activity.items.map((item) => item.answer)).toEqual([
      '5^{5}=3\\,125',
      '7^{3}=343',
      '8^{7}=2\\,097\\,152',
      '5^{1}=5',
      '7^{-1}=\\frac{1}{7}',
      '8^{-3}=\\frac{1}{512}',
      '15^{3}=3\\,375',
      '35^{2}=1\\,225',
      '24^{3}=13\\,824',
    ]);
  });

  it('keeps the 56 step-by-step teacher solutions, grouped and complete', () => {
    expect(lesson.teacherArea!.solutions).toBe(unit2Lesson3TeacherSolutions);
    const solutions = lesson.teacherArea!.solutions!;
    expect(solutions).toHaveLength(56);

    const ids = solutions.map((solution) => solution.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(solutions.map((solution) => solution.group)).size).toBe(11);
    expect(solutions.filter((solution) => Boolean(solution.sourceNote))).toHaveLength(40);

    // Book answers and platform-derived answers are counted separately.
    const origins = counts(solutions.map((solution) => solution.answerOrigin ?? ''));
    expect(origins).toEqual({ الكتاب: 14, 'مُشتقة من المنصة': 42 });

    for (const solution of solutions) {
      expect(solution.steps.length, solution.id).toBeGreaterThanOrEqual(2);
      expect(solution.steps.every((step) => step.trim().length > 0), solution.id).toBe(true);
      expect(solution.finalAnswer.trim(), solution.id).not.toBe('');
      expect(solution.principle.trim(), solution.id).not.toBe('');
      expect(solution.problem.trim(), solution.id).not.toBe('');
      expect(solution.check?.trim() ?? '', solution.id).not.toBe('');
      expect(solution.source, solution.id).toMatch(/ص(32|33|34)/);
    }

    // Every page of the lesson is answered, and no group is empty.
    for (const page of ['32', '33', '34']) {
      expect(solutions.filter((solution) => solution.source.includes(`ص${page}`)).length, page)
        .toBeGreaterThan(0);
    }
    for (const group of new Set(solutions.map((solution) => solution.group))) {
      expect(solutions.some((solution) => solution.group === group), group).toBe(true);
    }
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

    // 03 — the zero exponent: 12^0 = 1, so «= 0» is false.
    expect(trueFalse('u2-l3-03').correctAnswer).toBe(false);
    expect(12 ** 0).toBe(1);
    expect(12 ** 0).not.toBe(0);

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
    expect(sameValue(10 ** -2, 1 / 100)).toBe(true);
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

    // 13 — quotient rule with the bigger exponent on top: 5^9 ÷ 5^6 = 5^3 = 125.
    expect(numericQuestion('u2-l3-13').acceptedAnswers).toEqual(['3']);
    expect(9 - 6).toBe(3);
    expect(5 ** 9 / 5 ** 6).toBe(5 ** 3);
    expect(5 ** 9 / 5 ** 6).toBe(1953125 / 15625);
    expect(5 ** 3).toBe(125);

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

    // 17 — priority: 3 + 2^3×4 = 35 and 2^5 + 3 = 35 both hold; the two parenthesised
    //      expressions do not.
    expect([...multiSelect('u2-l3-17').correctOptionIds].sort()).toEqual(['a', 'c']);
    expect(2 ** 3 * 4).toBe(32);
    expect(3 + 2 ** 3 * 4).toBe(35);
    expect(2 ** 5 + 3).toBe(35);
    expect((3 + 2 ** 3) * 4).toBe(44);
    expect((3 + 2) ** 2 * 4).toBe(100);

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

describe('Unit 2, Lesson 3 — the three new interactives', () => {
  it('استوديو القوى: يعرض الصيغة الموسّعة والناتج الدقيق ويتابع الإشارة', () => {
    const { container } = render(<IntegerPowerStudio />);
    expect(container.querySelector('.power-studio')?.getAttribute('dir')).toBe('rtl');

    // Default state: 3^3 = 27 with the expanded product and the exact fraction.
    expect(document.querySelector('.power-studio-exponent-value')?.textContent).toBe('3');
    const facts = Array.from(document.querySelectorAll('.power-studio-fact dd'));
    expect(facts[0]?.textContent).toContain('27');
    expect(document.querySelectorAll('.power-studio-formula .katex').length).toBeGreaterThan(0);
    expect(container.querySelector('.power-studio-hint')).toBeNull(); // positive base

    // Raising the exponent to 4 turns 3^3 into 3^4 = 81, and back down to 2^… no: to 3^2 = 9.
    fireEvent.click(screen.getByRole('button', { name: 'زيادة الأس' }));
    expect(document.querySelector('.power-studio-exponent-value')?.textContent).toBe('4');
    expect(Array.from(document.querySelectorAll('.power-studio-fact dd'))[0]?.textContent).toContain('81');
    fireEvent.click(screen.getByRole('button', { name: 'إنقاص الأس' }));
    fireEvent.click(screen.getByRole('button', { name: 'إنقاص الأس' }));
    expect(document.querySelector('.power-studio-exponent-value')?.textContent).toBe('2');
    expect(Array.from(document.querySelectorAll('.power-studio-fact dd'))[0]?.textContent).toContain('9');

    // A negative base: the sign hint appears, and the even/odd parity is spelled out.
    fireEvent.click(screen.getByRole('button', { name: 'الأساس (−3)' }));
    expect(screen.getByRole('button', { name: 'الأساس (−3)' }).getAttribute('aria-pressed')).toBe('true');
    expect(document.querySelector('.power-studio-hint')).not.toBeNull();
    // The exponent is still 2 at this point, so the signed power stays positive…
    expect(document.querySelector('.power-studio-fact-wide')?.textContent).toContain('موجب');
    // …and the next step up makes it odd, so the result turns negative.
    fireEvent.click(screen.getByRole('button', { name: 'زيادة الأس' }));
    expect(document.querySelector('.power-studio-fact-wide')?.textContent).toContain('سالب');
    fireEvent.click(screen.getByRole('button', { name: 'إنقاص الأس' }));
    expect(document.querySelector('.power-studio-fact-wide')?.textContent).toContain('موجب');

    // A fraction base with a negative exponent: (3/2)^(−1) = 2/3.
    fireEvent.click(screen.getByRole('button', { name: 'الأساس 3/2' }));
    fireEvent.click(screen.getByRole('button', { name: 'إنقاص الأس' })); // 2 → 1
    fireEvent.click(screen.getByRole('button', { name: 'إنقاص الأس' })); // 1 → 0
    fireEvent.click(screen.getByRole('button', { name: 'إنقاص الأس' })); // 0 → −1
    expect(document.querySelector('.power-studio-exponent-value')?.textContent).toBe('-1');
    // The exact fraction is typeset vertically, not printed as \frac{2}{3}.
    const fractionFact = document.querySelectorAll('.power-studio-fact dd')[0] as HTMLElement;
    expect(fractionFact.querySelector('.katex')).not.toBeNull();
    expect(visibleTextOf(fractionFact)).not.toContain('frac');
    expect(visibleTextOf(fractionFact)).toContain('2');
    expect(visibleTextOf(fractionFact)).toContain('3');

    // The exponent never leaves the declared range −3 … 4.
    for (let step = 0; step < 8; step += 1) {
      const decrease = screen.getByRole('button', { name: 'إنقاص الأس' }) as HTMLButtonElement;
      if (decrease.disabled) break;
      fireEvent.click(decrease);
    }
    expect(document.querySelector('.power-studio-exponent-value')?.textContent).toBe('-3');
    expect((screen.getByRole('button', { name: 'إنقاص الأس' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('مختبر قواعد القوى: يعرض القواعد المطلوبة فقط ويتحقّق من القاعدة عدديًا', () => {
    const { container } = render(<PowerRulesStudio rules={['product', 'product-power']} />);
    expect(container.querySelector('.power-rules-studio')?.getAttribute('dir')).toBe('rtl');

    // Only the two rules the lesson has explained so far are offered.
    const tabs = screen.getAllByRole('tab').map((tab) => tab.textContent);
    expect(tabs).toEqual(['جداء قوتين', 'قوة الجداء']);
    expect(screen.queryByRole('tab', { name: 'خارج قسمة قوتين' })).toBeNull();
    expect(screen.queryByRole('tab', { name: 'قوة الخارج' })).toBeNull();

    // Default numbers: 2^3 × 2^2 = 2^5 = 32, and the component confirms the equality.
    expect(document.querySelector('.power-rules-result-math')?.getAttribute('dir')).toBe('ltr');
    expect(Array.from(document.querySelectorAll('.power-rules-fact dd'))[0]?.textContent).toContain('32');
    expect(document.querySelector('.power-rules-verdict')?.textContent).toBe(
      'القاعدة محقّقة: الطرفان متساويان في هذا المثال.',
    );
    expect(document.querySelectorAll('.power-rules-symbolic .katex').length).toBeGreaterThan(0);

    // The one-base rule exposes the m stepper; the two-base rule swaps it for b.
    expect(screen.getByRole('button', { name: 'زيادة الأس m' })).toBeTruthy();
    expect(screen.queryByRole('group', { name: 'اختيار الأساس b' })).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: 'قوة الجداء' }));
    expect(screen.getByRole('group', { name: 'اختيار الأساس b' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'زيادة الأس m' })).toBeNull();
    // 2^3 × 3^3 = 8 × 27 = 216 = 6^3.
    expect(Array.from(document.querySelectorAll('.power-rules-fact dd'))[0]?.textContent).toContain('216');
    expect(216).toBe(2 ** 3 * 3 ** 3);
    expect(216).toBe(6 ** 3);

    // Choosing a negative base keeps the verdict honest (the check follows the numbers).
    fireEvent.click(screen.getByRole('button', { name: 'الأساس a يساوي -2' }));
    fireEvent.click(screen.getByRole('button', { name: 'زيادة الأس n' })); // 3 → 4 (even)
    expect(document.querySelector('.power-rules-verdict')?.textContent).toBe(
      'القاعدة محقّقة: الطرفان متساويان في هذا المثال.',
    );
    // (−2)^4 × 3^4 = 16 × 81 = 1,296 = 6^4, while the even exponent kills the sign.
    expect(Array.from(document.querySelectorAll('.power-rules-fact dd'))[0]?.textContent).toContain('1296');
    expect((-2) ** 4 * 3 ** 4).toBe(1296);
  });

  it('مختبر أولويات العمليات: يفرّق بين A و B و C عند x = −4', () => {
    const { container } = render(<OrderOfOperationsLab />);
    expect(container.querySelector('.priority-lab')?.getAttribute('dir')).toBe('rtl');

    // Case A — the bracket is computed first: (5 × 4)^3 = 8,000.
    expect(screen.getByTestId('priority-lab-result').textContent).toBe('8000');
    expect(5 * 4).toBe(20);
    expect(20 ** 3).toBe(8000);
    expect(document.querySelector('.priority-lab-result-math')?.getAttribute('dir')).toBe('ltr');
    expect(screen.queryByRole('slider')).toBeNull();

    // Case B — no bracket: the power belongs to 4 alone, so 5 × 4^3 = 320.
    fireEvent.click(screen.getByRole('tab', { name: 'الحالة B: بلا قوس' }));
    expect(screen.getByTestId('priority-lab-result').textContent).toBe('320');
    expect(4 ** 3).toBe(64);
    expect(5 * 64).toBe(320);
    expect(8000).not.toBe(320);

    // Case C — substitution: 5(−4)^3 + 6(−4)^2 − 10 = −320 + 96 − 10 = −234.
    fireEvent.click(screen.getByRole('tab', { name: 'الحالة C: تعويض' }));
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.value).toBe('-4');
    expect(screen.getByTestId('priority-lab-result').textContent).toBe('-234');
    expect(5 * (-4) ** 3 + 6 * (-4) ** 2 - 10).toBe(-234);
    expect(5 * (-64)).toBe(-320);
    expect(6 * 16).toBe(96);

    // Moving the slider recomputes every term with the sign kept by the parentheses.
    fireEvent.change(slider, { target: { value: '3' } });
    expect(document.querySelector('.priority-lab-x-value')?.textContent).toBe('3');
    expect(screen.getByTestId('priority-lab-result').textContent).toBe('179');
    expect(5 * 27 + 6 * 9 - 10).toBe(179);

    fireEvent.change(slider, { target: { value: '0' } });
    expect(screen.getByTestId('priority-lab-result').textContent).toBe('-10');
    expect(0 + 0 - 10).toBe(-10);
  });

  it('يربط LessonRenderer الأنواع الثلاثة الجديدة بكتل الدرس نفسها', () => {
    const blockOf = (id: string) => {
      const block = blocks.find((entry) => entry.id === id);
      if (!block) throw new Error(`missing block ${id}`);
      return block;
    };

    const studio = render(<SourceContentBlock block={blockOf('p32-studio-power')} />);
    expect(studio.container.querySelector('.power-studio')).not.toBeNull();
    studio.unmount();

    // The first rules studio shows rules (1) and (2) only…
    const rules12 = render(<SourceContentBlock block={blockOf('p32-rule-studio-12')} />);
    expect(rules12.container.querySelector('.power-rules-studio')).not.toBeNull();
    expect(Array.from(rules12.container.querySelectorAll('.power-rules-tab')).map((tab) => tab.textContent))
      .toEqual(['جداء قوتين', 'قوة الجداء']);
    rules12.unmount();

    // …and the second shows rules (3) and (4), so no rule is shown before it is taught.
    const rules34 = render(<SourceContentBlock block={blockOf('p33-rule-studio-34')} />);
    expect(Array.from(rules34.container.querySelectorAll('.power-rules-tab')).map((tab) => tab.textContent))
      .toEqual(['خارج قسمة قوتين', 'قوة الخارج']);
    rules34.unmount();

    const lab = render(<SourceContentBlock block={blockOf('p33-priority-lab')} />);
    expect(lab.container.querySelector('.priority-lab')).not.toBeNull();
    expect(lab.container.querySelector('[data-testid="priority-lab-result"]')?.textContent).toBe('8000');
    lab.unmount();
  });

  it('يعرض المكوّنات الثلاثة نصًا عربيًا RTL ورياضيات LTR معزولة بلا TeX خام', () => {
    const surfaces = [
      <IntegerPowerStudio key="studio" />,
      <PowerRulesStudio key="rules" />,
      <OrderOfOperationsLab key="priority" />,
    ];

    for (const surface of surfaces) {
      const { container, unmount } = render(surface);
      const root = container.firstElementChild!;
      expect(root.getAttribute('dir')).toBe('rtl');

      // Every math surface that carries a bare formula is isolated to LTR.
      const mathSurfaces = container.querySelectorAll(
        '.power-studio-formula, .power-rules-symbolic, .power-rules-result-math, .priority-lab-result-math',
      );
      expect(mathSurfaces.length).toBeGreaterThan(0);
      for (const surface of Array.from(mathSurfaces)) {
        expect(surface.getAttribute('dir')).toBe('ltr');
      }

      // KaTeX rendered the formulas — no raw TeX and no `$` reaches the student.
      // (KaTeX keeps the source TeX inside its MathML <annotation>, which is not
      // visible text, so the check strips the MathML half before reading.)
      expect(container.querySelectorAll('.katex').length).toBeGreaterThan(0);
      expect(container.querySelectorAll('.katex-error').length).toBe(0);
      const visibleText = visibleTextOf(container);
      expect(visibleText).not.toContain('$');
      expect(visibleText).not.toContain('\\');
      // No TeX command name may survive into the visible text (raw-TeX leak guard).
      for (const token of ['frac', 'times', 'cdot', 'left', 'right', 'sqrt']) {
        expect(visibleText, token).not.toContain(token);
      }

      unmount();
    }
  });
});
