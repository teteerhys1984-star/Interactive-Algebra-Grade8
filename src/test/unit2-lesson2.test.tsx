import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../app/App';
import { getLessonById, getUnitById } from '../data/curriculum';
import { unit2Lesson2Data } from '../data/unit2/lesson02';
import { unit2Lesson2TeacherSolutions } from '../data/unit2/lesson02TeacherSolutions';
import sourceAudit from '../data/unit2/lesson02.source-audit.json';
import { ExponentRulesExplorer } from '../components/interactive/ExponentRulesExplorer';
import { ScientificNotationLab } from '../components/interactive/ScientificNotationLab';
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
 * Regression coverage for the standalone Unit 2 Lesson 2 rebuild (pages 29–31):
 * source sequence and exact values, platform/source separation, teacher-solution
 * traceability, rendered RTL/math and both working interactions, plus the
 * independent 20-question test. The test is never graded until explicit submit.
 */

const LESSON_ID = 'u2-lesson-2';
const TEST_ID = 'u2-test-lesson-2';
const TEACHER_PASSWORD = 'somer173';

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

const storedAnswer = (question: TestQuestion): QuestionAnswer => {
  switch (question.type) {
    case 'single-choice':
    case 'error-analysis': return question.correctOptionId;
    case 'true-false': return question.correctAnswer;
    case 'numeric': return question.acceptedAnswers[0];
    case 'multi-select': return [...question.correctOptionIds];
    case 'ordering': return [...question.correctOrder];
    case 'matching': return { ...question.correctPairs };
  }
};

const wrongAnswer = (question: TestQuestion): QuestionAnswer => {
  switch (question.type) {
    case 'single-choice':
    case 'error-analysis': {
      const other = question.options.find((option) => option.id !== question.correctOptionId);
      return other ? other.id : 'zzz';
    }
    case 'true-false': return !question.correctAnswer;
    case 'numeric': return '987654321';
    case 'multi-select': return question.correctOptionIds.slice(0, -1);
    case 'ordering': return [...question.correctOrder].reverse();
    case 'matching': {
      const keys = Object.keys(question.correctPairs);
      const flipped = { ...question.correctPairs };
      flipped[keys[0]] = `${flipped[keys[0]]}-wrong`;
      return flipped;
    }
  }
};

const sameValue = (actual: number, expected: number): boolean =>
  actual === expected
  || Math.abs(actual - expected) <= 1e-9 * Math.max(Math.abs(actual), Math.abs(expected));

function counts(values: string[]): Record<string, number> {
  const total: Record<string, number> = {};
  for (const value of values) total[value] = (total[value] ?? 0) + 1;
  return total;
}

function visibleText(container: HTMLElement): string {
  const clone = container.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return clone.textContent ?? '';
}

const RAW_TEX = /\\(frac|times|cdot|div|sqrt|text|mathrm|Longrightarrow|Longleftarrow|leq|geq|neq|quad|qquad)\b|\^\{|_\{/;

function expectNoRawMath(container: HTMLElement, where: string): void {
  const text = visibleText(container);
  const rawAt = text.search(RAW_TEX);
  expect(rawAt === -1 ? '' : text.slice(Math.max(0, rawAt - 50), rawAt + 60), `raw TeX in ${where}`).toBe('');
  expect(text.includes('$'), `visible $ in ${where}`).toBe(false);
  expect(container.querySelector('.katex-error'), `KaTeX error in ${where}`).toBeNull();
}

function findBlock(id: string) {
  const block = blocks.find((entry) => entry.id === id);
  if (!block) throw new Error(`missing lesson block ${id}`);
  return block;
}

function openStep(index: number) {
  window.location.hash = `#/unit/unit-2/lesson/${LESSON_ID}/${index + 1}`;
  return render(<App />);
}

function textOfFormula(element: Element | null): string {
  return element?.querySelector('.katex-html')?.textContent ?? '';
}

beforeEach(() => {
  window.sessionStorage.clear();
  window.location.hash = '#/';
});

describe('Unit 2 Lesson 2 — curriculum and source sequence', () => {
  it('registers once after Lesson 1 and preserves the separate Unit 2 warm-up', () => {
    const unit = getUnitById('unit-2')!;
    expect(unit.lessons.map((entry) => entry.id)).toEqual(['u2-lesson-1', LESSON_ID, 'u2-lesson-3', 'u2-lesson-4']);
    expect(unit.lessons.filter((entry) => entry.id === LESSON_ID)).toHaveLength(1);
    expect(getLessonById('unit-2', LESSON_ID)).toBe(unit2Lesson2Data);
    expect(lesson.title).toBe('قواعد قوى العدد 10');
    expect(lesson.number).toBe(2);
    expect(lesson.sourcePages).toEqual([29, 30, 31]);
    expect(unit.warmup.sourcePages).toEqual([25]);
    expect(lesson.steps.flatMap((step) => step.blocks).some((block) => block.sourceRef.page === 25)).toBe(false);
  });

  it('uses all three supplied pages in source order and keeps the page-25 warm-up out', () => {
    expect(lesson.steps).toHaveLength(11);
    expect(lesson.steps[0].sourcePages).toEqual([29]);
    expect(lesson.steps[1].sourcePages).toEqual([29]);
    expect(lesson.steps[4].sourcePages).toEqual([29, 30]);
    expect(lesson.steps[5].sourcePages).toEqual([29, 30]);
    expect(lesson.steps[6].sourcePages).toEqual([30]);
    expect(lesson.steps.slice(7, 10).every((step) => step.sourcePages.length === 1 && step.sourcePages[0] === 31)).toBe(true);
    expect(lesson.steps[10].sourcePages).toEqual([29, 30, 31]);

    const ids = blocks.map((block) => block.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const step of lesson.steps) {
      expect(step.sourcePages.length, step.id).toBeGreaterThan(0);
      expect(step.sourcePages.every((page) => page >= 29 && page <= 31), step.id).toBe(true);
    }
    expect(blocks.every((block) => block.sourceRef.page >= 29 && block.sourceRef.page <= 31)).toBe(true);
    expect(blocks.some((block) => /p25-|warmup/i.test(block.id))).toBe(false);
  });

  it('records the uploaded source inventory, independent audit and no unresolved text', () => {
    expect(sourceAudit.sourcePages).toEqual([29, 30, 31]);
    expect(sourceAudit.sourceFiles).toEqual(['image-1.png (الصفحة 29)', 'image-2.png (الصفحة 30)', 'image-3.png (الصفحة 31)']);
    expect(sourceAudit.startBoundary.lessonBeginsOn).toBe(29);
    expect(sourceAudit.unresolvedSourcePositions).toEqual([]);
    expect(sourceAudit.verifiedContent).toHaveLength(3);
    expect(sourceAudit.independentRecalculation.exampleA).toContain('6×10^13');
    expect(sourceAudit.independentRecalculation.exampleB).toContain('9.3×10^-9');
  });

  it('keeps book blocks separate from original platform instruction and interactions', () => {
    const authored = blocks.filter((block) => block.authored === true);
    const sourceBlocks = blocks.filter((block) => block.authored !== true);
    expect(authored.length).toBeGreaterThan(20);
    expect(authored.every((block) => block.sourceRef.section === 'شرح المنصة')).toBe(true);
    expect(sourceBlocks.length).toBeGreaterThan(0);
    expect(sourceBlocks.every((block) => block.sourceRef.page >= 29 && block.sourceRef.page <= 31)).toBe(true);

    for (const type of ['teach', 'insight', 'mistake'] as const) {
      const ofType = blocks.filter((block) => block.type === type);
      expect(ofType.length, type).toBeGreaterThan(0);
      expect(ofType.every((block) => block.authored === true), `${type} must be authored`).toBe(true);
    }
    expect(findBlock('p29-explorer').interactiveType).toBe('exponent-rules-explorer');
    expect(findBlock('p30-scientific-lab').interactiveType).toBe('scientific-notation-lab');
    expect(findBlock('p30-standard-form-lab').interactiveType).toBe('standard-form-lab');
    expect(findBlock('p29-explorer').authored).toBe(true);
    expect(findBlock('p30-scientific-lab').authored).toBe(true);

    const notes = [
      ...blocks.map((block) => block.verifyNote),
      ...subItems.map((item) => item.verifyNote),
    ].filter(Boolean);
    expect(notes).toEqual([]);
  });

  it('locks the page-29 numbered expressions and the book examples exactly', () => {
    expect(findBlock('p29-activity-q1').subItems?.map((item) => item.math)).toEqual([
      '10^{3} \\times 10^{2}',
      '10^{3} \\times 10^{-3}',
      '10^{-1} \\times 10^{-2}',
      '10^{3} \\times 10^{-2}',
      '10^{3} \\times 10^{1}',
      '10^{4} \\times 10^{0}',
    ]);
    expect(findBlock('p29-activity-q2').subItems?.map((item) => item.math)).toEqual([
      '\\frac{10^{5}}{10^{2}}',
      '\\frac{10^{3}}{10^{-1}}',
      '\\frac{10^{-3}}{10^{2}}',
      '\\frac{10^{-2}}{10^{2}}',
    ]);
    expect(findBlock('p29-activity-q3').subItems?.map((item) => item.math)).toEqual([
      '(10^{3})^{2}', '(10^{2})^{3}', '(10^{-1})^{2}', '(10^{-3})^{-2}',
    ]);

    expect(findBlock('p29-rule-multiply').mathFormula).toBe('10^{n} \\times 10^{m}=10^{n+m}');
    expect(findBlock('p29-rule-reciprocal').mathFormula).toBe('\\frac{1}{10^{n}}=10^{-n}');
    expect(findBlock('p29-rule-divide').mathFormula).toBe('\\frac{10^{n}}{10^{m}}=10^{n-m}');
    expect(findBlock('p29-rule-power').mathFormula).toBe('(10^{n})^{m}=10^{n\\times m}');
    expect(findBlock('p29-rule-multiply').subItems?.[0].math).toBe('10^{6} \\times 10^{-4}=10^{6-4}=10^{2}');
    expect(findBlock('p29-rule-reciprocal').subItems?.[0].math).toBe('\\frac{1}{10^{-6}}=10^{-(-6)}=10^{6}');
    expect(findBlock('p29-rule-divide').subItems?.[0].math).toBe('\\frac{10^{2}}{10^{-3}}=10^{2-(-3)}=10^{5}');
    expect(findBlock('p29-rule-power').subItems?.[0].math).toBe('(10^{-3})^{2}=10^{-3\\times2}=10^{-6}');
  });

  it('preserves the exact page-30 expressions, the 1 400 grouping, and the bounds', () => {
    expect(findBlock('p30-example-A').subItems?.[0].math).toBe('A=\\frac{0.75\\times10^{12}\\times4\\times10^{-5}}{5\\times10^{-7}}');
    expect(findBlock('p30-example-A').subItems?.[0].solution).toContain('6\\times10^{13}');
    expect(findBlock('p30-example-B').subItems?.[0].math).toBe('B=7.9\\times10^{-9}+1\\,400\\times10^{-12}');
    expect(findBlock('p30-example-B').subItems?.[0].solution).toContain('1\\,400\\times10^{-12}');
    expect(findBlock('p30-example-B').subItems?.[0].solution).toContain('9.3\\times10^{-9}');

    const bounds = findBlock('p30-bound-example').subItems ?? [];
    expect(bounds.map((item) => item.math)).toEqual(['A=2.105\\,395\\times10^{6}', 'B=5.94\\times10^{-2}']);
    expect(bounds[0].solution).toContain('10^{6}<A<10^{7}');
    expect(bounds[1].solution).toContain('10^{-2}<B<10^{-1}');
    expect(findBlock('p30-bound-rule').mathFormula).toContain('10^n\\le a\\times10^n<10^{n+1}');
  });

  it('preserves every page-31 check, practice item and the hydrogen unit', () => {
    expect(findBlock('p31-check-product').subItems?.map((item) => item.math)).toEqual([
      '10^{5} \\times 10^{7}', '10^{10} \\times 10^{-5}', '10^{-8} \\times 10^{4}', '10^{-9} \\times 10^{-3}',
    ]);
    expect(findBlock('p31-check-reciprocal').subItems?.map((item) => item.math)).toEqual([
      '\\frac{1}{10^{3}}', '\\frac{1}{10^{-8}}', '\\frac{1}{10^{-4}} \\times 10^{4}',
    ]);
    expect(findBlock('p31-check-quotient').subItems?.map((item) => item.math)).toEqual([
      '\\frac{10^{11}}{10^{6}}', '\\frac{10^{5}}{10^{-8}}', '\\frac{10^{-30}}{10^{-10}}',
    ]);
    expect(findBlock('p31-check-power').subItems?.map((item) => item.math)).toEqual([
      '(10^{3})^{5}', '(10^{4})^{-3}', '(10^{-1})^{-9}',
    ]);
    expect(findBlock('p31-drill-1').subItems?.map((item) => item.math)).toEqual([
      '\\frac{10^{2}}{10^{-4}}', '(10^{-2})^{4}', '\\frac{1}{10^{1}} \\times 10^{-7}',
    ]);
    expect(findBlock('p31-drill-2').subItems?.map((item) => item.math)).toEqual([
      '(10^{2})^{3} \\times 10^{4}', '10^{-1} \\times (10^{-2})^{4}', '\\frac{(10^{5})^{2}}{10^{7}}', '\\frac{10^{4} \\times 10^{9}}{(10^{5})^{3}}',
    ]);
    const hydrogen = findBlock('p31-drill-3');
    expect(hydrogen.subItems).toHaveLength(2);
    expect(hydrogen.subItems?.[0].math).toContain('0.000');
    expect(hydrogen.subItems?.[0].math).toContain('\\text{mm}');
    expect(hydrogen.subItems?.[1].math).toContain('10^{-7}');
    expect(hydrogen.subItems?.[1].solution).toContain('1\\ \\text{mm}');
    expect(hydrogen.content).toContain('عشر ملايين');
  });

  it('recalculates the copied answers independently, including negative exponents', () => {
    const productPowers = [[3, 2, 5], [3, -3, 0], [-1, -2, -3], [3, -2, 1], [3, 1, 4], [4, 0, 4]];
    for (const [left, right, result] of productPowers) expect(left + right).toBe(result);
    const quotientPowers = [[5, 2, 3], [3, -1, 4], [-3, 2, -5], [-2, 2, -4]];
    for (const [top, bottom, result] of quotientPowers) expect(top - bottom).toBe(result);
    const powerPowers = [[3, 2, 6], [2, 3, 6], [-1, 2, -2], [-3, -2, 6]];
    for (const [base, outer, result] of powerPowers) expect(base * outer).toBe(result);

    const A = (0.75 * 10 ** 12 * 4 * 10 ** -5) / (5 * 10 ** -7);
    expect(sameValue(A, 6 * 10 ** 13)).toBe(true);
    const B = 7.9 * 10 ** -9 + 1400 * 10 ** -12;
    expect(sameValue(B, 9.3 * 10 ** -9)).toBe(true);
    expect(10 ** 6).toBeLessThan(2_105_395);
    expect(2_105_395).toBeLessThan(10 ** 7);
    expect(10 ** -2).toBeLessThan(0.0594);
    expect(0.0594).toBeLessThan(10 ** -1);
    expect(0.0000001).toBe(10 ** -7);
    expect(10 ** 7 * 10 ** -7).toBe(1);

    const page31Results = [
      5 + 7, 10 + (-5), -8 + 4, -9 + (-3),
      -3, 8, 4 + 4,
      11 - 6, 5 - (-8), -30 - (-10),
      3 * 5, 4 * (-3), (-1) * (-9),
      2 - (-4), (-2) * 4, -1 + (-7),
      2 * 3 + 4, -1 + (-2) * 4, 5 * 2 - 7, (4 + 9) - 5 * 3,
    ];
    expect(page31Results).toEqual([
      12, 5, -4, -12,
      -3, 8, 8,
      5, 13, -20,
      15, -12, 9,
      6, -8, -8,
      10, -9, 3, -2,
    ]);
  });

  it('keeps all raw math fields TeX-only and gives every sourced item a teacher solution', () => {
    for (const item of subItems) {
      expect(item.math ?? '').not.toContain('$');
      expect(item.solution ?? '').not.toContain('$');
    }
    for (const block of blocks) expect(block.mathFormula ?? '', block.id).not.toContain('$');

    const solutions = unit2Lesson2TeacherSolutions;
    expect(lesson.teacherArea?.solutions).toBe(solutions);
    expect(solutions).toHaveLength(48);
    expect(new Set(solutions.map((solution) => solution.id)).size).toBe(solutions.length);
    expect(solutions.every((solution) => solution.sourceNote === undefined)).toBe(true);

    // Independent answer-to-item mapping audit: each expected value is keyed
    // to the printed exercise/example, not inferred from the stored finalAnswer.
    const expectedFinalAnswers = [
      // ص29 — activity 1: products, quotients, powers.
      '$10^5$', '$10^0=1$', '$10^{-3}$', '$10^1$', '$10^4$', '$10^4$',
      '$10^3$', '$10^4$', '$10^{-5}$', '$10^{-4}$',
      '$10^6$', '$10^6$', '$10^{-2}$', '$10^6$',
      // ص29 — four printed examples and the four rules in سؤال 2.
      '$10^2$', '$10^6$', '$10^5$', '$10^{-6}$',
      '$10^n\\times10^m=10^{n+m}$', '$\\frac{1}{10^n}=10^{-n}$',
      '$\\frac{10^n}{10^m}=10^{n-m}$', '$(10^n)^m=10^{n\\times m}$',
      // ص30 — examples A/B and the two bounds.
      '$A=6\\times10^{13}$', '$B=9.3\\times10^{-9}$',
      '$10^6<A<10^7$', '$10^{-2}<B<10^{-1}$',
      // ص31 — check, drills, and the hydrogen application.
      '$10^{12}$', '$10^5$', '$10^{-4}$', '$10^{-12}$',
      '$10^{-3}$', '$10^8$', '$10^8$',
      '$10^5$', '$10^{13}$', '$10^{-20}$',
      '$10^{15}$', '$10^{-12}$', '$10^9$',
      '$10^6$', '$10^{-8}$', '$10^{-8}$',
      '$10^{10}$', '$10^{-9}$', '$10^3$', '$10^{-2}$',
      '$10^{-7}\\;\\text{mm}$', '$1\\text{ mm}$',
    ];
    expect(solutions.map((solution) => solution.finalAnswer)).toEqual(expectedFinalAnswers);

    for (const solution of solutions) {
      expect(solution.steps.length, solution.id).toBeGreaterThanOrEqual(2);
      expect(solution.steps.every((step) => step.trim().length > 0), solution.id).toBe(true);
      expect(solution.finalAnswer.trim(), solution.id).not.toBe('');
      expect(solution.principle.trim(), solution.id).not.toBe('');
      expect(solution.problem.trim(), solution.id).not.toBe('');
      expect(/ص(29|30|31)/.test(solution.source), solution.id).toBe(true);
      const target = findBlock(solution.blockId);
      if (solution.subIndex !== undefined) {
        expect(target.subItems?.[solution.subIndex], solution.id).toBeDefined();
      }
      if (solution.answerOrigin === 'الكتاب') {
        expect([29, 30].includes(target.sourceRef.page), solution.id).toBe(true);
      }
    }
    expect(new Set(solutions.map((solution) => solution.group)).size).toBe(11);
    expect(solutions.some((solution) => solution.blockId === 'p31-drill-3' && solution.subIndex === 1)).toBe(true);

    expect(lesson.teacherArea?.answerKeys).toHaveLength(11);
    expect(lesson.teacherArea?.answerKeys.reduce((sum, group) => sum + group.items.length, 0)).toBe(39);
    const rules = lesson.teacherArea?.answerKeys.find((group) => group.section.includes('القواعد الأربع'));
    expect(rules?.items.map((item) => item.ref)).toEqual(['الضرب', 'المقلوب', 'القسمة', 'قوة القوة']);
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

describe('Unit 2 Lesson 2 — student rendering and RTL/math isolation', () => {
  it('opens every ordered lesson step without leaking source notes or raw TeX', () => {
    for (let index = 0; index < lesson.steps.length; index += 1) {
      const { container, unmount } = openStep(index);
      expect(container.querySelector('.step-content-view')).not.toBeNull();
      expect(container.querySelector('.source-content-block')).not.toBeNull();
      expectNoRawMath(container, `الخطوة ${index + 1}`);
      expect(container.textContent).not.toContain('ملاحظة المصدر');
      expect(container.textContent).not.toContain('unresolvedSourcePositions');
      unmount();
    }
  });

  it('keeps the book source reference distinct from platform-authored teaching', () => {
    const { container, unmount } = openStep(0);
    expect(container.textContent).toContain('صفحة 29 • نشاط • 1');
    expect(container.textContent).toContain('شرح الأستاذ');
    expect(container.textContent).not.toContain('lesson02.source-audit.json');
    expect(container.textContent).not.toContain('ملاحظة مصدر');
    unmount();
  });

  it('keeps the source-audit record out of the student route and shows teaching notes only to teachers', () => {
    const student = openStep(10);
    expect(student.container.textContent).not.toContain('سجل المطابقة');
    expect(student.container.textContent).not.toContain('lesson02.source-audit.json');
    student.unmount();

    window.location.hash = '#/teacher';
    const teacher = render(<App />);
    fireEvent.change(screen.getByLabelText('كلمة المرور'), { target: { value: TEACHER_PASSWORD } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول' }));
    fireEvent.click(screen.getByRole('button', { name: /الدرس 2: قواعد قوى العدد 10/ }));
    expect(teacher.container.textContent).toContain('سجل المطابقة lesson02.source-audit.json');
    expect(teacher.container.textContent).toContain('مخرجات المختبرات من إعداد المنصة');
    expect(teacher.container.querySelector('.ta-source-notes')).toBeNull();
    expectNoRawMath(teacher.container, 'مساحة المعلم للدرس 2');

    const solutionDetails = teacher.container.querySelectorAll('.ta-solutions .ta-solution');
    expect(solutionDetails).toHaveLength(48);
    const first = solutionDetails[0] as HTMLDetailsElement;
    fireEvent.click(first.querySelector('summary')!);
    expect(first.textContent).toContain('الخطوات:');
    expect(first.textContent).toContain('الجواب النهائي:');
    expect(first.textContent).toContain('القاعدة:');
    teacher.unmount();
  });
});

describe('Unit 2 Lesson 2 — working interactions and recovery paths', () => {
  it('the exponent explorer responds to rule and exponent changes, verifies, and resets', () => {
    const { container, unmount } = render(<ExponentRulesExplorer />);
    expect(container.querySelector('.exponent-rules-explorer')).not.toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: 'القسمة' }));
    fireEvent.change(screen.getByLabelText('قيمة الأس m'), { target: { value: '7' } });
    fireEvent.change(screen.getByLabelText('قيمة الأس n'), { target: { value: '-2' } });
    expect(container.querySelector('.exponent-result-math')?.getAttribute('data-result-exponent')).toBe('9');
    expect(container.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toBe('القسمة');

    fireEvent.click(screen.getByRole('button', { name: 'تحقق بالقيم العشرية' }));
    expect(container.querySelector('.exponent-verify-panel .katex')).not.toBeNull();
    expect(container.querySelector('.exponent-verify-panel .katex-error')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'إعادة التجربة إلى القيم الابتدائية' }));
    expect((screen.getByLabelText('قيمة الأس m') as HTMLInputElement).value).toBe('3');
    expect((screen.getByLabelText('قيمة الأس n') as HTMLInputElement).value).toBe('2');
    expect(container.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toBe('الضرب');
    expect(container.querySelector('.exponent-verify-panel')).toBeNull();
    unmount();
  });

  it('the scientific-notation lab computes all four operations, validates, and resets', () => {
    const { container, unmount } = render(<ScientificNotationLab />);
    const answer = () => textOfFormula(container.querySelector('.scientific-lab-answer'));

    expect(answer()).toContain('3.421');
    expect(answer()).toContain('5'); // 3.4×10^5 + 2.1×10^3 = 3.421×10^5.

    fireEvent.change(screen.getByLabelText('العملية'), { target: { value: 'multiply' } });
    expect(answer()).toContain('7.14');
    expect(answer()).toContain('8');

    fireEvent.change(screen.getByLabelText('العملية'), { target: { value: 'divide' } });
    expect(answer()).toContain('1.619');
    expect(answer()).toContain('2');

    fireEvent.change(screen.getByLabelText('العملية'), { target: { value: 'subtract' } });
    fireEvent.change(screen.getByLabelText('معامل العدد الأول'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('أس العدد الأول'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('معامل العدد الثاني'), { target: { value: '9' } });
    fireEvent.change(screen.getByLabelText('أس العدد الثاني'), { target: { value: '0' } });
    expect(answer()).toContain('−8');

    fireEvent.change(screen.getByLabelText('معامل العدد الأول'), { target: { value: '0' } });
    expect(screen.getByRole('status').textContent).toContain('بين 1 و10');
    expect(container.querySelector('.scientific-lab-answer')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'إعادة التجربة' }));
    expect((screen.getByLabelText('معامل العدد الأول') as HTMLInputElement).value).toBe('3.4');
    expect((screen.getByLabelText('أس العدد الأول') as HTMLInputElement).value).toBe('5');
    expect((screen.getByLabelText('العملية') as HTMLSelectElement).value).toBe('add');
    expect(answer()).toContain('3.421');
    unmount();
  });

  it('the in-lesson check responds only after check and can be retried', () => {
    const { container, unmount } = openStep(0);
    const question = container.querySelector('.pc-question');
    expect(question).not.toBeNull();
    expect(question?.querySelector('.pc-feedback')).toBeNull();
    const choices = question!.querySelectorAll<HTMLButtonElement>('.pc-choice');
    fireEvent.click(choices[1]); // اختير مشتت، لكن لم يظهر تصحيح بعد.
    expect(question?.querySelector('.pc-feedback')).toBeNull();
    fireEvent.click(question!.querySelector<HTMLButtonElement>('.pc-check-btn')!);
    expect(question?.querySelector('.pc-feedback')?.textContent).toContain('لنراجع');
    expect(question?.textContent).toContain('نجمع الأسين');
    fireEvent.click(question!.querySelector<HTMLButtonElement>('.pc-retry')!);
    expect(question?.querySelector('.pc-feedback')).toBeNull();
    expect(question?.querySelector('.pc-selected')).toBeNull();
    unmount();
  });

  it('the standard-form lab preserves the number, updates on input, and has reset/fallback paths', () => {
    const { container, unmount } = openStep(6);
    const input = screen.getByLabelText('العدد') as HTMLInputElement;
    expect(container.querySelector('.sf-lab')).not.toBeNull();
    expect(container.textContent).toContain('ليست صيغة معيارية بعد');

    fireEvent.change(input, { target: { value: '0.0594' } });
    expect(container.textContent).toContain('0.0594');
    fireEvent.click(screen.getByRole('button', { name: 'انقل الفاصلة خانة إلى اليسار' }));
    expect(container.textContent).toContain('حرّكت الفاصلة 1 خانة إلى اليسار');
    fireEvent.click(screen.getByRole('button', { name: 'إعادة' }));
    expect(container.textContent).toContain('الفاصلة في مكانها الأصلي');

    fireEvent.change(input, { target: { value: 'not a number' } });
    expect(screen.getByRole('status').textContent).toContain('اكتب عددًا صحيحًا أو عشريًا');
    unmount();
  });
});

describe('Unit 2 Lesson 2 — independent assessment flow', () => {
  it('starts the registered 20-question test and reveals no grade until submit', async () => {
    window.location.hash = '#/tests';
    const { container, unmount } = render(<App />);
    const lessonTestCard = Array.from(container.querySelectorAll('.test-card')).find((card) =>
      card.textContent?.includes('اختبار الدرس الثاني: قواعد قوى العدد 10'),
    );
    expect(lessonTestCard).toBeDefined();
    fireEvent.click(within(lessonTestCard as HTMLElement).getByRole('button', { name: 'بدء الاختبار' }));

    await waitFor(() => expect(container.querySelector('.test-runner')).not.toBeNull());
    expect(container.textContent).toContain('اختبار الدرس الثاني: قواعد قوى العدد 10');
    expect(container.querySelectorAll('.test-question-map-button')).toHaveLength(20);

    const firstQuestion = single('u2-l2-01');
    const incorrectIndex = firstQuestion.options.findIndex((option) => option.id !== firstQuestion.correctOptionId);
    const firstRadios = container.querySelectorAll<HTMLInputElement>('.test-question-body input[type="radio"]');
    fireEvent.click(firstRadios[incorrectIndex]);
    expect(container.querySelector('.test-results')).toBeNull();
    expect(container.textContent).not.toContain('أحسنت على إكمال الاختبار');
    expect(container.textContent).not.toContain('إجابات صحيحة');

    fireEvent.click(screen.getByRole('button', { name: /تسليم الاختبار/ }));
    expect(container.querySelector('.test-results')).not.toBeNull();
    expect(container.textContent).toContain('أحسنت على إكمال الاختبار');
    expect(container.textContent).toContain('غير مجاب');
    unmount();
  });
});
