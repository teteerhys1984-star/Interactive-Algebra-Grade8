import { describe, expect, it } from 'vitest';
import katex from 'katex';
import { unit2Lesson3Data as lesson } from '../data/unit2/lesson03';
import { unit2Lesson3TeacherSolutions as solutions } from '../data/unit2/lesson03TeacherSolutions';
import audit from '../data/unit2/lesson03.source-audit.json';
import { evaluateTex, fromFractionText, mathShape } from './fixtures/lesson3-exact-math';

const blocks = lesson.steps.flatMap((step) => step.blocks);
const source = blocks.filter((block) => !block.authored);
const framing = new Set(['p32-activity-intro', 'p33-example-instruction']);
const key = (blockId: string, subIndex?: number) => `${blockId}#${subIndex ?? 'block'}`;
const required = source.filter((block) => !framing.has(block.id)).flatMap((block) =>
  block.subItems?.length
    ? block.subItems.map((_, index) => key(block.id, index))
    : [key(block.id)],
);
const linked = (blockId: string, subIndex?: number) => solutions.find((solution) =>
  solution.blockId === blockId && solution.subIndex === subIndex,
)!;
const equalityParts = (math: string) => math.replace(/\$/g, '')
  .replace(/\\(?:begin|end)\{aligned\}/g, '').replace(/&/g, '')
  .split(/\\\\|=/).map((part) => part.trim()).filter((part) => part && !/^[A-Z]$/.test(part));

describe('Lesson 3 — teacher solutions: authentic coverage, not just a count', () => {
  it('covers every one of the 54 source targets exactly once, with no authored or dangling links', () => {
    expect(required).toHaveLength(54);
    expect(solutions).toHaveLength(54);
    const actual = solutions.map((solution) => key(solution.blockId, solution.subIndex));
    expect([...actual].sort()).toEqual([...required].sort());
    expect(new Set(actual).size).toBe(54);
    expect(new Set(solutions.map((solution) => solution.id)).size).toBe(54);
    expect(lesson.teacherArea!.solutions).toBe(solutions);
    for (const solution of solutions) {
      const block = source.find((entry) => entry.id === solution.blockId)!;
      expect(solution.source, solution.id).toContain(`ص${block.sourceRef.page}`);
      if (solution.subIndex !== undefined) {
        const item = block.subItems![solution.subIndex];
        if (/^[①-⑨]$/.test(item.label ?? '')) expect(solution.source).toContain(item.label);
      }
    }
  });

  it('has meaningful steps, a principle and an independent check for every target', () => {
    for (const solution of solutions) {
      expect(solution.problem.trim().length, solution.id).toBeGreaterThan(10);
      expect(solution.steps.length, solution.id).toBeGreaterThanOrEqual(2);
      expect(solution.steps.every((step) => step.trim().length > 0), solution.id).toBe(true);
      expect(solution.principle.trim().length, solution.id).toBeGreaterThan(10);
      expect(solution.check!.trim().length, solution.id).toBeGreaterThan(10);
      expect(solution.finalAnswer, solution.id).toMatch(/^\$[^$]+\$$/);
      expect(JSON.stringify(solution), solution.id).not.toMatch(/TODO|TBD|placeholder|قريباً|يحتاج مطابقة/i);
    }
  });

  it('keeps 13 printed-result origins and 41 independently derived answers in 13 book-ordered groups', () => {
    expect(solutions.filter((solution) => solution.answerOrigin === 'الكتاب')).toHaveLength(13);
    expect(solutions.filter((solution) => solution.answerOrigin === 'مُشتقة من المنصة')).toHaveLength(41);
    expect(new Set(solutions.map((solution) => solution.group)).size).toBe(13);
    for (const group of audit.exerciseGroups) {
      for (let index = 0; index < group.items.length; index++) {
        expect(linked(group.blockId, index).answerOrigin).toBe('مُشتقة من المنصة');
      }
    }
    // Generalization to 1^n and qualification n>0 are authored, not a printed result.
    expect(linked('p32-def1-special').answerOrigin).toBe('مُشتقة من المنصة');
    expect(linked('p32-def1-special').sourceNote).toContain('1^1');
    expect(solutions.filter((solution) => solution.sourceNote)).toHaveLength(1);
  });

  it('matches and independently recomputes every exercise answer and every student reveal chain', () => {
    for (const group of audit.exerciseGroups) {
      const block = blocks.find((entry) => entry.id === group.blockId)!;
      group.items.forEach((item, index) => {
        const solution = linked(group.blockId, index);
        expect(mathShape(solution.finalAnswer.slice(1, -1)), solution.id).toBe(mathShape(item.answer));
        const expected = fromFractionText(item.value);
        for (const part of equalityParts(solution.finalAnswer)) {
          expect(evaluateTex(part), `${solution.id}: ${part}`).toEqual(expected);
        }
        if (group.blockId === 'p34-drill-4') {
          const lines = block.subItems![index].solution!.replace(/\\(?:begin|end)\{aligned\}/g, '').split('\\\\');
          lines.forEach((line, lineIndex) => {
            const expectedLine = lineIndex === 0 ? fromFractionText('15') : expected;
            for (const part of equalityParts(line)) expect(evaluateTex(part, { s: 15 })).toEqual(expectedLine);
          });
        } else {
          for (const part of equalityParts(block.subItems![index].solution!)) {
            expect(evaluateTex(part), `${block.id}/${index}: ${part}`).toEqual(expected);
          }
        }
      });
    }
  });

  it('recomputes all nine printed examples, including all four symbolic rule examples and every C line', () => {
    const variables = { a: 2, y: -1 };
    for (const example of audit.printedExamples) {
      const block = source.find((entry) => entry.id === example.blockId)!;
      const subIndex = example.subIndex ?? undefined;
      const math = subIndex === undefined ? block.mathFormula! : block.subItems![subIndex].math!;
      const solution = linked(example.blockId, subIndex);
      const expected = example.value
        ? fromFractionText(example.value)
        : evaluateTex(example.answer.split('=')[0], variables);
      for (const part of equalityParts(math)) {
        expect(evaluateTex(part, variables), `${block.id}: ${part}`).toEqual(expected);
      }
      for (const part of equalityParts(solution.finalAnswer)) {
        expect(evaluateTex(part, variables), `${solution.id}: ${part}`).toEqual(expected);
      }
    }
    expect(5 * (-4) ** 3 + 6 * (-4) ** 2 - 10).toBe(-234);
    expect((3 / 2 * 10) ** 3).toBe(3375);
    expect((3 / 2) ** 3 * 1000).toBe(3375);
  });

  it('independently checks every purely numeric worked equality in steps and cross-checks', () => {
    let checked = 0;
    for (const solution of solutions) {
      for (const prose of [...solution.steps, solution.check!]) {
        for (const match of prose.matchAll(/\$([^$]+)\$/g)) {
          const math = match[1];
          // Unit conversions and assignments/conditions are not dimensionless equalities.
          if (!math.includes('=') || /\\text|\\ne|[<>]/.test(math)) continue;
          const plain = math.replace(/\\[a-zA-Z]+/g, '');
          if (/[a-zA-Z]/.test(plain)) continue;
          const parts = equalityParts(math);
          if (parts.length < 2) continue;
          if (math === '0^{-1}=\\frac10') {
            parts.forEach((part) => expect(() => evaluateTex(part)).toThrow(RangeError));
            checked++;
            continue;
          }
          const values = parts.map((part) => evaluateTex(part));
          for (const value of values.slice(1)) expect(value, `${solution.id}: ${math}`).toEqual(values[0]);
          checked++;
        }
      }
    }
    expect(checked).toBeGreaterThan(80);
  });

  it('derives all 54 answer-key entries from the same linked final answers, without raw delimiters', () => {
    const groups = lesson.teacherArea!.answerKeys;
    expect(groups).toHaveLength(13);
    const keys = groups.flatMap((group) => group.items);
    expect(keys).toHaveLength(54);
    expect(keys.map((item) => item.ref)).toEqual(solutions.map((solution) => solution.source));
    expect(keys.map((item) => item.answer)).toEqual(solutions.map((solution) => solution.finalAnswer.slice(1, -1)));
    expect(keys.every((item) => !item.answer.includes('$'))).toBe(true);
  });

  it('renders every teacher math fragment through strict KaTeX (aligned breaks remain legitimate)', () => {
    for (const solution of solutions) {
      for (const prose of [solution.problem, ...solution.steps, solution.finalAnswer, solution.principle, solution.check!, solution.sourceNote ?? '']) {
        expect((prose.match(/\$/g) ?? []).length % 2, solution.id).toBe(0);
        for (const match of prose.matchAll(/\$([^$]+)\$/g)) {
          expect(() => katex.renderToString(match[1], { throwOnError: true }), `${solution.id}: ${match[1]}`).not.toThrow();
        }
      }
    }
  });
});
