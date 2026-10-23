import { describe, expect, it } from 'vitest';
import { unit2Lesson5Data } from '../data/unit2/lesson05';
import { unit2Lesson5Questions } from '../data/unit2/lesson05Questions';
import {
  unit2Lesson5SubItemCount,
  unit2Lesson5TeacherSolutions,
} from '../data/unit2/lesson05TeacherSolutions';

/**
 * تغطية حلول المعلّم — الوحدة الثانية، الدرس الخامس (تمارين الوحدة الثانية).
 *
 * المعيار: كل بند فرعي في الأسئلة 1–39 (165 بندًا) يملك حلًا واحدًا فقط في مساحة
 * المعلّم، مربوطًا بالسؤال نفسه عبر `blockId = source-N` و`subIndex`، مع خطوات
 * وتعليل وقاعدة وتحقّق، ولا حل زائد أو يتيم أو مكرّر.
 */

const sourceBlocks = unit2Lesson5Data.steps.flatMap((step) =>
  step.blocks.filter((block) => block.id.startsWith('source-')),
);

const requiredKeys = new Set(
  sourceBlocks.flatMap((block) =>
    (block.subItems ?? []).map((_, index) => `${block.id}#${index}`),
  ),
);

const solutionKey = (solution: (typeof unit2Lesson5TeacherSolutions)[number]): string =>
  `${solution.blockId}#${solution.subIndex}`;

const solutionsByKey = new Map<string, typeof unit2Lesson5TeacherSolutions>();
for (const solution of unit2Lesson5TeacherSolutions) {
  const key = solutionKey(solution);
  solutionsByKey.set(key, [...(solutionsByKey.get(key) ?? []), solution]);
}

/** يتحقّق أن الجواب النهائي في مساحة المعلّم مطابق لجواب الطالب نفسه. */
const studentAnswerOf = (solution: (typeof unit2Lesson5TeacherSolutions)[number]): string => {
  const questionNumber = Number(solution.blockId.replace('source-', ''));
  const item = unit2Lesson5Questions
    .find((question) => question.n === questionNumber)!
    .items[solution.subIndex!];
  return item.answer ? `$${item.answer}$` : (item.answerText ?? '');
};

describe('حلول المعلّم — تمارين الوحدة الثانية (165 بندًا)', () => {
  it('الجرد المطلوب يساوي عدد بنود المصدر', () => {
    expect(requiredKeys.size).toBe(165);
    expect(unit2Lesson5SubItemCount).toBe(165);
    expect(unit2Lesson5TeacherSolutions).toHaveLength(165);
  });

  it('لكل بند حل واحد على الأقل، ولا حل زائد خارج البنود', () => {
    const missing = [...requiredKeys].filter((key) => !solutionsByKey.has(key));
    expect(missing).toEqual([]);

    const extra = [...solutionsByKey.keys()].filter((key) => !requiredKeys.has(key));
    expect(extra).toEqual([]);
  });

  it('لا بند له أكثر من حل (لا تكرار ولا حلول مزدوجة)', () => {
    const duplicated = [...solutionsByKey.entries()]
      .filter(([, list]) => list.length > 1)
      .map(([key]) => key);
    expect(duplicated).toEqual([]);
  });

  it('معرّفات الحلول فريدة وتشير كلها إلى كتل المصدر الموجودة', () => {
    const ids = unit2Lesson5TeacherSolutions.map((solution) => solution.id);
    expect(new Set(ids).size).toBe(ids.length);

    const blockIds = new Set(sourceBlocks.map((block) => block.id));
    const dangling = unit2Lesson5TeacherSolutions
      .filter((solution) => !blockIds.has(solution.blockId))
      .map((solution) => solution.id);
    expect(dangling).toEqual([]);
  });

  it('كل حل مكتمل: مسألة، خطوتان على الأقل، جواب، قاعدة، وتحقّق', () => {
    for (const solution of unit2Lesson5TeacherSolutions) {
      expect(solution.problem.trim().length, solution.id).toBeGreaterThan(0);
      expect(solution.steps.length, solution.id).toBeGreaterThanOrEqual(2);
      solution.steps.forEach((step) => expect(step.trim().length, solution.id).toBeGreaterThan(0));
      expect(solution.finalAnswer.trim().length, solution.id).toBeGreaterThan(0);
      expect(solution.principle.trim().length, solution.id).toBeGreaterThan(0);
      expect(solution.check?.trim().length ?? 0, solution.id).toBeGreaterThan(0);
    }
  });

  it('جواب المعلّم مطابق حرفيًا لجواب البند المعروض للطالب', () => {
    const mismatched = unit2Lesson5TeacherSolutions
      .filter((solution) => solution.finalAnswer !== studentAnswerOf(solution))
      .map((solution) => solution.id);
    expect(mismatched).toEqual([]);
  });

  it('يذكر كل حل السؤال والبند في وسم المصدر (بلا رقم صفحة مختلق)', () => {
    for (const solution of unit2Lesson5TeacherSolutions) {
      expect(solution.source).toContain('تمارين الوحدة الثانية');
      expect(solution.source).toContain(`السؤال ${solution.blockId.replace('source-', '')}`);
      expect(solution.source).not.toMatch(/صفحة|ص\d/);
    }
  });

  it('كل الحلول مُشتقّة من المنصة لأن المصدر لا يحمل مفتاح إجابات', () => {
    const origins = new Set(unit2Lesson5TeacherSolutions.map((solution) => solution.answerOrigin));
    expect([...origins]).toEqual(['مُشتقة من المنصة']);
  });

  it('المحطات الثماني كلها ممثّلة في مجموعات الحلول', () => {
    const groups = new Set(unit2Lesson5TeacherSolutions.map((solution) => solution.group));
    expect(groups.size).toBe(unit2Lesson5Data.teacherArea!.answerKeys.length);
    expect(
      unit2Lesson5Data.teacherArea!.answerKeys.every((key) => groups.has(key.section)),
    ).toBe(true);
  });

  it('نقاط المصدر الموثّقة تظهر كملاحظة مصدر في الحل نفسه', () => {
    // Q9①: المساواة المطبوعة لا تتحقّق مع أي قوة صحيحة للعدد 10.
    expect(solutionsByKey.get('source-9#0')?.[0].sourceNote).toMatch(/12\s*185|لا توجد|خطأ/);
    // Q30 2.①: «dcg» ديكاغرام بتعريف الكتاب، فالجواب 10^8.
    expect(solutionsByKey.get('source-30#2')?.[0].sourceNote).toContain('ديكاغرام');
    // Q1①: 10^-4 = 0.0001 والجواب في البند الأول من سؤال الاختيار.
    expect(solutionsByKey.get('source-1#0')?.[0].sourceNote).toBeTruthy();
  });

  it('الأسئلة الحرجة (9، 26، 29، 30، 39) لها تحقّق صريح في الحل', () => {
    const critical = ['source-9#0', 'source-26#1', 'source-29#0', 'source-29#1', 'source-30#2', 'source-39#0'];
    for (const key of critical) {
      const solution = solutionsByKey.get(key)?.[0];
      expect(solution, key).toBeDefined();
      expect(solution!.check?.trim().length ?? 0, key).toBeGreaterThan(0);
    }
  });
});
