import { describe, it, expect } from 'vitest';
import { normalizeAnswer, isCorrect } from '../components/assessment/FinalAssessment';
import { lesson02Data } from '../data/unit1/lesson02';
import { lesson04Data } from '../data/unit1/lesson04';
import { LessonData } from '../data/unit1/lesson01';

const questionOf = (data: LessonData, id: string) => {
  const question = data.finalAssessment?.questions.find((item) => item.id === id);
  if (!question) throw new Error(`missing assessment question: ${id}`);
  return question;
};

describe('normalizeAnswer — variable vs multiplication (regression)', () => {
  it('preserves the variable x instead of deleting it', () => {
    expect(normalizeAnswer('-5x')).toBe('-5x');
    expect(normalizeAnswer('x')).toBe('x');
    // An answer that drops the variable must not collide with the real one.
    expect(normalizeAnswer('-5x')).not.toBe(normalizeAnswer('-5'));
  });

  it('treats explicit multiplication next to a letter as the implicit one', () => {
    expect(normalizeAnswer('6*x')).toBe(normalizeAnswer('6x'));
    expect(normalizeAnswer('6×x')).toBe(normalizeAnswer('6x'));
    expect(normalizeAnswer('6 * x')).toBe(normalizeAnswer('6x'));
    expect(normalizeAnswer('x*6')).toBe(normalizeAnswer('x6'));
  });

  it('keeps digit-digit multiplication so digits never merge', () => {
    expect(normalizeAnswer('2*3')).toBe('2*3');
    expect(normalizeAnswer('2*3')).not.toBe('23');
    expect(normalizeAnswer('3×4')).not.toBe('34');
  });

  it('maps the division sign onto the fraction bar', () => {
    expect(normalizeAnswer('7÷12')).toBe(normalizeAnswer('7/12'));
    expect(normalizeAnswer('-1÷6')).toBe(normalizeAnswer('-1/6'));
  });

  it('drops parentheses before multiplication handling', () => {
    expect(normalizeAnswer('(-15/2)')).toBe('-15/2');
    expect(normalizeAnswer('6*(x)')).toBe(normalizeAnswer('6x'));
    expect(normalizeAnswer('(-6-8x)')).toBe('-6-8x');
  });

  it('still tolerates spacing, unicode minus and the Arabic decimal separator', () => {
    expect(normalizeAnswer('  -3/5 ')).toBe(normalizeAnswer('−3 / 5'));
    expect(normalizeAnswer('6x')).toBe(normalizeAnswer('6 × x'));
    expect(normalizeAnswer('3٫5')).toBe('3.5');
  });
});

describe('isCorrect — Lesson 2 assessment (confirmed failing cases)', () => {
  const q6 = questionOf(lesson02Data, 'q6');
  const q9 = questionOf(lesson02Data, 'q9');

  it('accepts equivalent writings of the expanded expression -6-8x', () => {
    expect(isCorrect(q6, '-6-8x')).toBe(true);
    expect(isCorrect(q6, '-6 - 8x')).toBe(true);
    expect(isCorrect(q6, '-6-8*x')).toBe(true);
    expect(isCorrect(q6, '(-6-8x)')).toBe(true);
    expect(isCorrect(q6, '−6−8x')).toBe(true);
  });

  it('rejects answers that drop the variable (old normalizer falsely accepted them)', () => {
    expect(isCorrect(q6, '-6-8')).toBe(false);
    expect(isCorrect(q6, '')).toBe(false);
  });

  it('accepts -5x variants and rejects the bare coefficient', () => {
    expect(isCorrect(q9, '-5x')).toBe(true);
    expect(isCorrect(q9, '-5*x')).toBe(true);
    expect(isCorrect(q9, '−5x')).toBe(true);
    expect(isCorrect(q9, '-5')).toBe(false);
  });
});

describe('isCorrect — Lesson 4 assessment (confirmed failing cases)', () => {
  it('f1 accepts 24', () => {
    expect(isCorrect(questionOf(lesson04Data, 'f1'), '24')).toBe(true);
  });

  it('f2 accepts 7/12 in fraction and division writings', () => {
    const f2 = questionOf(lesson04Data, 'f2');
    expect(isCorrect(f2, '7/12')).toBe(true);
    expect(isCorrect(f2, '7 / 12')).toBe(true);
    expect(isCorrect(f2, '7÷12')).toBe(true);
  });

  it('f9 accepts 28', () => {
    expect(isCorrect(questionOf(lesson04Data, 'f9'), '28')).toBe(true);
  });

  it('f10 accepts 5x/2 writings and rejects the answer without x', () => {
    const f10 = questionOf(lesson04Data, 'f10');
    expect(isCorrect(f10, '5x/2')).toBe(true);
    expect(isCorrect(f10, '5*x/2')).toBe(true);
    expect(isCorrect(f10, '5/2')).toBe(false);
  });

  it('f11 accepts -6-2x writings and rejects the answer without x', () => {
    const f11 = questionOf(lesson04Data, 'f11');
    expect(isCorrect(f11, '-6-2x')).toBe(true);
    expect(isCorrect(f11, '-6-2*x')).toBe(true);
    expect(isCorrect(f11, '-6-2')).toBe(false);
  });
});
