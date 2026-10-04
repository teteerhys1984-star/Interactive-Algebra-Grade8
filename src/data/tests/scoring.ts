import type {
  AnswerMap,
  QuestionAnswer,
  TestQuestion,
  TestScore,
} from './types';

interface ExactRational {
  numerator: bigint;
  denominator: bigint;
}

const absolute = (value: bigint): bigint => (value < 0n ? -value : value);

function greatestCommonDivisor(left: bigint, right: bigint): bigint {
  let a = absolute(left);
  let b = absolute(right);
  while (b !== 0n) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a === 0n ? 1n : a;
}

function makeRational(numerator: bigint, denominator: bigint): ExactRational | null {
  if (denominator === 0n) return null;
  const sign = denominator < 0n ? -1n : 1n;
  const positiveDenominator = absolute(denominator);
  const signedNumerator = numerator * sign;
  const divisor = greatestCommonDivisor(signedNumerator, positiveDenominator);
  return {
    numerator: signedNumerator / divisor,
    denominator: positiveDenominator / divisor,
  };
}

/**
 * Parses only exact numeric forms used by the tests: integers, finite decimals,
 * and fractions. It intentionally does not evaluate arbitrary expressions.
 */
export function parseExactRational(input: string): ExactRational | null {
  if (typeof input !== 'string' || input.length > 100) return null;

  const normalized = input
    .trim()
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[−﹣－]/g, '-')
    .replace(/[⁄∕]/g, '/')
    .replace(/\s+/g, '')
    .replace(/٫/g, '.');

  if (!normalized) return null;

  const fraction = normalized.match(/^([+-]?\d+)\/([+-]?\d+)$/);
  if (fraction) {
    try {
      return makeRational(BigInt(fraction[1]), BigInt(fraction[2]));
    } catch {
      return null;
    }
  }

  const decimal = normalized.match(/^([+-]?)(\d*)(?:\.(\d+))?$/);
  if (!decimal || (!decimal[2] && !decimal[3])) return null;

  try {
    const sign = decimal[1] === '-' ? -1n : 1n;
    const whole = decimal[2] || '0';
    const fractional = decimal[3] || '';
    const scale = 10n ** BigInt(fractional.length);
    const numerator = BigInt(whole) * scale + BigInt(fractional || '0');
    return makeRational(sign * numerator, scale);
  } catch {
    return null;
  }
}

function sameRational(left: string, right: string): boolean {
  const a = parseExactRational(left);
  const b = parseExactRational(right);
  return !!a && !!b && a.numerator === b.numerator && a.denominator === b.denominator;
}

function isString(value: QuestionAnswer | undefined): value is string {
  return typeof value === 'string';
}

function sameOrderedIds(actual: string[], expected: string[]): boolean {
  return actual.length === expected.length
    && actual.every((id, index) => id === expected[index]);
}

function sameUnorderedIds(actual: string[], expected: string[]): boolean {
  if (actual.length !== expected.length || new Set(actual).size !== actual.length) return false;
  const actualSorted = [...actual].sort();
  const expectedSorted = [...expected].sort();
  return sameOrderedIds(actualSorted, expectedSorted);
}

/** Whether the student provided any response; this never checks correctness. */
export function isAnswerProvided(
  question: TestQuestion,
  answer: QuestionAnswer | undefined,
): boolean {
  if (answer === undefined || answer === null) return false;

  switch (question.type) {
    case 'single-choice':
    case 'error-analysis':
      return isString(answer) && answer.trim().length > 0;
    case 'true-false':
      return typeof answer === 'boolean';
    case 'numeric':
      return isString(answer) && answer.trim().length > 0;
    case 'multi-select':
    case 'ordering':
      return Array.isArray(answer) && answer.length > 0;
    case 'matching':
      return !Array.isArray(answer)
        && typeof answer === 'object'
        && Object.values(answer).some((value) => typeof value === 'string' && value.length > 0);
  }
}

/** Pure grading function; call it only from the explicit submit action. */
export function gradeQuestion(
  question: TestQuestion,
  answer: QuestionAnswer | undefined,
): boolean {
  if (!isAnswerProvided(question, answer)) return false;

  switch (question.type) {
    case 'single-choice':
    case 'error-analysis':
      return isString(answer) && answer === question.correctOptionId;
    case 'true-false':
      return typeof answer === 'boolean' && answer === question.correctAnswer;
    case 'numeric':
      return isString(answer)
        && question.acceptedAnswers.some((accepted) => sameRational(answer, accepted));
    case 'multi-select':
      return Array.isArray(answer)
        && sameUnorderedIds(answer, question.correctOptionIds);
    case 'ordering':
      return Array.isArray(answer)
        && sameOrderedIds(answer, question.correctOrder);
    case 'matching': {
      if (Array.isArray(answer) || typeof answer !== 'object' || answer === null) return false;
      const actual = answer as Record<string, string>;
      const expectedKeys = Object.keys(question.correctPairs).sort();
      const actualKeys = Object.keys(actual).sort();
      return sameOrderedIds(actualKeys, expectedKeys)
        && expectedKeys.every((key) => actual[key] === question.correctPairs[key]);
    }
  }
}

export function scoreTest(questions: readonly TestQuestion[], answers: AnswerMap): TestScore {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let earnedPoints = 0;
  const totalPoints = questions.reduce((total, question) => total + question.points, 0);

  for (const question of questions) {
    const answer = answers[question.id];
    if (!isAnswerProvided(question, answer)) {
      unansweredCount += 1;
    } else if (gradeQuestion(question, answer)) {
      correctCount += 1;
      earnedPoints += question.points;
    } else {
      incorrectCount += 1;
    }
  }

  return {
    correctCount,
    incorrectCount,
    unansweredCount,
    earnedPoints,
    totalPoints,
    percentage: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
  };
}
