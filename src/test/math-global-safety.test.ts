import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkSolutionConsistency } from '../data/tests/solutionConsistency';
import { scoreTest } from '../data/tests/scoring';
import { questionBank, resolveTest } from '../data/tests/registry';
import type { AnswerMap, QuestionAnswer, TestQuestion } from '../data/tests/types';

/**
 * Math safety for the test system.
 *
 * The repository has a React component named `Math` (KaTeX renderer). Importing
 * it without an alias shadows the JavaScript global and silently breaks
 * `Math.round`, `Math.ceil`, `Math.min`, `Math.max`, `Math.abs`. These checks
 * scan the test-system sources that call the global and then exercise the real
 * code paths that depend on it, so a future import cannot break them.
 */

const SOURCE_ROOTS = ['src/data/tests', 'src/components/tests'];

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) return collectSourceFiles(full);
    return /\.(ts|tsx)$/.test(full) ? [full] : [];
  });
}

/** `import { Math } from ...` (no alias) or a local `const/function/class Math`. */
const SHADOWING_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /import\s*\{[^}]*\bMath\b(?!\s+as\s)/, label: 'unaliased `import { Math }`' },
  { pattern: /import\s+Math\s+from/, label: 'default `import Math`' },
  { pattern: /\b(?:const|let|var|function|class|enum)\s+Math\b/, label: 'local binding named Math' },
];

const GLOBAL_MATH_CALL = /\bMath\s*\.\s*(?:round|ceil|floor|min|max|abs|sqrt|pow|trunc|sign)\s*\(/;

const sources = SOURCE_ROOTS.flatMap(collectSourceFiles);
const globalMathUsers = sources.filter((file) => GLOBAL_MATH_CALL.test(readFileSync(file, 'utf8')));

describe('global Math is never shadowed where the test system uses it', () => {
  it('scans every module that calls the global for a shadowing Math binding', () => {
    expect(sources.length).toBeGreaterThan(0);
    // The check is not vacuous: these modules really do call the global.
    expect(globalMathUsers).toEqual(
      expect.arrayContaining(['src/data/tests/scoring.ts', 'src/data/tests/solutionConsistency.ts']),
    );

    for (const file of globalMathUsers) {
      const source = readFileSync(file, 'utf8');
      for (const { pattern, label } of SHADOWING_PATTERNS) {
        expect(pattern.test(source), `${file} calls the global Math but contains ${label}`).toBe(false);
      }
      // A module that needs the KaTeX component *and* the global must alias it,
      // exactly as `import { Math as Formula } from '../math/Math'` does.
      if (/from\s+'[^']*math\/Math'/.test(source)) {
        expect(/\bMath\s+as\s+\w+/.test(source), `${file} imports the Math component without an alias`).toBe(true);
      }
    }
  });

  it('keeps Math.round in the scoring engine and Math.abs in the solution audit', () => {
    // Runtime proof through the real code paths, not a re-implementation.
    const lessonTest = resolveTest('u1-test-lesson-1')!;
    const answers: AnswerMap = Object.fromEntries(
      lessonTest.questions.map((question) => [question.id, correctAnswerOf(question)]),
    );
    const score = scoreTest(lessonTest.questions, answers);
    expect(score.percentage).toBe(100);
    expect(Number.isInteger(score.percentage)).toBe(true);

    const numeric = questionBank.find((question) => question.type === 'numeric')!;
    expect(checkSolutionConsistency(numeric).status).toBe('verified');

    // The global itself is intact in this module.
    expect(Math.ceil(0.2)).toBe(1);
    expect(Math.min(1, 2)).toBe(1);
    expect(Math.max(3, 4)).toBe(4);
    expect(Math.abs(-5)).toBe(5);
  });
});

function correctAnswerOf(question: TestQuestion): QuestionAnswer {
  switch (question.type) {
    case 'single-choice':
    case 'error-analysis': return question.correctOptionId;
    case 'true-false': return question.correctAnswer;
    case 'numeric': return question.acceptedAnswers[0] ?? '';
    case 'multi-select': return question.correctOptionIds;
    case 'ordering': return question.correctOrder;
    case 'matching': return question.correctPairs;
  }
}
