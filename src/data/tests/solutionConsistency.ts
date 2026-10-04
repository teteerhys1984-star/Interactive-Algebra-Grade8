import type { TestQuestion } from './types';

/**
 * Does the worked solution actually agree with the answer key?
 *
 * A test can be structurally valid and still teach the wrong thing if the answer
 * key was changed without updating the solution (or the other way round). These
 * checks are deliberately conservative:
 *
 *  - `contradiction`: the solution demonstrably disagrees with the key. This is
 *    an audit error (exact numeric answers, true/false polarity).
 *  - `review`: the solution could not be tied to the key mechanically, usually
 *    because the author paraphrased it. Listed for human review, never failed.
 *  - `verified`: the key is recoverable from the solution text.
 */
export type SolutionConsistency =
  | { status: 'verified' }
  | { status: 'review'; detail: string }
  | { status: 'contradiction'; detail: string };

const ARABIC_OPTION_LETTERS: Record<string, string> = {
  a: 'أ', b: 'ب', c: 'ج', d: 'د', e: 'هـ', f: 'و', g: 'ز', h: 'ح',
};

const normalize = (value: string): string => value.normalize('NFKC').replace(/\s+/g, ' ').trim();
const unescapeLatex = (value: string): string => normalize(value).replace(/\\\\/g, '\\');
const squash = (value: string): string => unescapeLatex(value).replace(/\s+/g, '');

function solutionText(question: TestQuestion): string {
  return [question.solution.finalAnswer, question.solution.explanation, ...question.solution.steps].join(' \n ');
}

/**
 * Signed exact numbers written in prose or inline LaTeX:
 * `-\frac{3}{10}`, `\frac{3}{10}`, `-3/10`, `-21`, `0.25`.
 */
export function signedRationalsIn(text: string): number[] {
  const values: number[] = [];
  const pattern = /(-?)\s*(?:\\frac\{(-?\d+)\}\{(-?\d+)\}|(-?\d+(?:\.\d+)?)(?:\/(-?\d+))?)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const sign = match[1] === '-' ? -1 : 1;
    if (match[2] !== undefined) {
      const denominator = Number(match[3]);
      if (denominator !== 0) values.push((sign * Number(match[2])) / denominator);
    } else if (match[4] !== undefined) {
      const denominator = match[5] !== undefined ? Number(match[5]) : 1;
      if (denominator !== 0) values.push((sign * Number(match[4])) / denominator);
    }
  }
  return values;
}

function rationalValue(input: string): number {
  const parts = input.split('/');
  if (parts.length === 2) {
    const denominator = Number(parts[1]);
    return denominator === 0 ? Number.NaN : Number(parts[0]) / denominator;
  }
  return Number(input);
}

function mathFragments(text: string): string[] {
  return [...text.matchAll(/\$([^$]+)\$/g)].map((match) => squash(match[1])).filter(Boolean);
}

function optionCoveredBySolution(
  label: string,
  optionId: string,
  solution: string,
  finalAnswer: string,
): boolean {
  const normalizedLabel = unescapeLatex(label).toLowerCase();
  if (normalizedLabel && solution.toLowerCase().includes(normalizedLabel)) return true;
  if (mathFragments(label).some((fragment) => squash(solution).includes(fragment))) return true;
  const letter = ARABIC_OPTION_LETTERS[optionId.toLowerCase()];
  return !!letter && finalAnswer.includes(letter);
}

export function checkSolutionConsistency(question: TestQuestion): SolutionConsistency {
  const solution = solutionText(question);
  const finalAnswer = question.solution.finalAnswer;

  switch (question.type) {
    case 'numeric': {
      const values = signedRationalsIn(finalAnswer);
      const accepted = question.acceptedAnswers.some((answer) => {
        const expected = rationalValue(answer);
        return Number.isFinite(expected) && values.some((value) => Math.abs(value - expected) < 1e-9);
      });
      return accepted
        ? { status: 'verified' }
        : {
          status: 'contradiction',
          detail: `final answer "${finalAnswer}" does not contain any accepted answer (${question.acceptedAnswers.join(', ')}).`,
        };
    }
    case 'true-false': {
      const affirmative = /صحيح|صواب|نعم/.test(finalAnswer);
      const negative = /خاطئ|خطأ|غير صحيح/.test(finalAnswer);
      if (question.correctAnswer && negative && !affirmative) {
        return { status: 'contradiction', detail: `key is "true" but the final answer reads "${finalAnswer}".` };
      }
      if (!question.correctAnswer && affirmative && !negative) {
        return { status: 'contradiction', detail: `key is "false" but the final answer reads "${finalAnswer}".` };
      }
      return { status: 'verified' };
    }
    case 'single-choice':
    case 'error-analysis': {
      const correct = question.options.find((option) => option.id === question.correctOptionId);
      if (!correct) return { status: 'contradiction', detail: 'correct option is missing from the option list.' };
      return optionCoveredBySolution(correct.label, correct.id, solution, finalAnswer)
        ? { status: 'verified' }
        : { status: 'review', detail: `final answer does not restate option "${correct.id}": ${finalAnswer}` };
    }
    case 'multi-select': {
      const uncovered = question.options.filter(
        (option) => question.correctOptionIds.includes(option.id)
          && !optionCoveredBySolution(option.label, option.id, solution, finalAnswer),
      );
      return uncovered.length === 0
        ? { status: 'verified' }
        : { status: 'review', detail: `final answer does not restate option(s) ${uncovered.map((o) => o.id).join(', ')}.` };
    }
    case 'ordering':
    case 'matching':
      // Both are fully described by their structural key, checked by the audit.
      return { status: 'verified' };
  }
}
