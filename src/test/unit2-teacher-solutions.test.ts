import { describe, it, expect } from 'vitest';
import { unit2WarmupData } from '../data/unit2/warmup';
import { unit2Lesson1Data } from '../data/unit2/lesson01';
import { unit2TeacherSolutions } from '../data/unit2/teacherSolutions';

/**
 * تغطية حلول المعلّم للوحدة الثانية — الدرس الأول.
 * المعيار: كل مثال، وكل تحقّق، وكل تدرّب، وكل تمرين في الصفحة 25، وكل بند فرعي
 * يجب أن يملك حلاً خطوة بخطوة. لا يُحسب العدد الكامل مسبقاً؛ يُستخرج من البيانات.
 */

const COVERED_TYPES = new Set(['example', 'check', 'practice', 'word-problem']);

type Inventory = { key: string; blockId: string; subIndex?: number; source: string };

function requiredInventory(blocks: any[]): Inventory[] {
  const out: Inventory[] = [];
  for (const b of blocks) {
    const isPage25Item = /^p25-item-\d+$/.test(b.id);
    // سياق مسألة كلامية بلا بنود فرعية (جملة تمهيدية) لا يُعدّ بنداً؛ بنوده الفرعية مغطاة.
    if (b.type === 'word-problem' && !(Array.isArray(b.subItems) && b.subItems.length > 0)) continue;
    if (!isPage25Item && !COVERED_TYPES.has(b.type)) continue;
    if (Array.isArray(b.subItems) && b.subItems.length > 0) {
      b.subItems.forEach((_: unknown, i: number) =>
        out.push({ key: `${b.id}#${i}`, blockId: b.id, subIndex: i, source: b.sourceRef?.page ?? '' }),
      );
    } else {
      out.push({ key: b.id, blockId: b.id, source: b.sourceRef?.page ?? '' });
    }
  }
  return out;
}

const allBlocks = [
  ...unit2WarmupData.steps.flatMap((s: any) => s.blocks ?? []),
  ...unit2Lesson1Data.steps.flatMap((s: any) => s.blocks ?? []),
];

describe('حلول المعلّم التفصيلية — الوحدة الثانية، الدرس الأول', () => {
  const required = requiredInventory(allBlocks);
  const solutionsByKey = new Map<string, typeof unit2TeacherSolutions>();
  for (const sol of unit2TeacherSolutions) {
    const key = sol.subIndex !== undefined ? `${sol.blockId}#${sol.subIndex}` : sol.blockId;
    solutionsByKey.set(key, [...(solutionsByKey.get(key) ?? []), sol]);
  }

  it('الجرد يحوي عدداً غير صفري من البنود المطلوبة (الاستخراج من البيانات)', () => {
    expect(required.length).toBeGreaterThan(0);
    console.info(`[unit2-teacher-solutions] required items: ${required.length}, solutions: ${unit2TeacherSolutions.length}`);
  });

  it('لكل بند مطلوب حل واحد على الأقل', () => {
    const missing = required.filter((r) => !solutionsByKey.has(r.key)).map((r) => r.key);
    expect(missing).toEqual([]);
  });

  it('لا يوجد حل يشير إلى كتلة أو بند فرعي غير موجود', () => {
    const blockIndex = new Map(allBlocks.map((b: any) => [b.id, b]));
    const dangling = unit2TeacherSolutions.filter((s) => {
      const b: any = blockIndex.get(s.blockId);
      if (!b) return true;
      if (s.subIndex === undefined) return false;
      return !Array.isArray(b.subItems) || s.subIndex >= b.subItems.length;
    });
    expect(dangling.map((s) => s.id)).toEqual([]);
  });

  it('معرّفات الحلول فريدة', () => {
    const ids = unit2TeacherSolutions.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('كل حل مكتمل: مسألة، خطوات، جواب نهائي، قاعدة، وصفحة وبند', () => {
    for (const s of unit2TeacherSolutions) {
      expect(s.problem.trim().length, s.id).toBeGreaterThan(0);
      expect(s.steps.length, s.id).toBeGreaterThanOrEqual(2);
      s.steps.forEach((st) => expect(st.trim().length, s.id).toBeGreaterThan(0));
      expect(s.finalAnswer.trim().length, s.id).toBeGreaterThan(0);
      expect(s.principle.trim().length, s.id).toBeGreaterThan(0);
      expect(s.source, s.id).toMatch(/ص\d+/);
    }
  });

  it('لا توجد عناصر نائبة أو عبارات «قريباً» في الحلول', () => {
    const bad = /TODO|TBD|قريباً|coming soon|placeholder|ـ\s*$/i;
    const hits = unit2TeacherSolutions.filter((s) =>
      [s.problem, s.principle, s.finalAnswer, ...s.steps, s.check ?? '', s.sourceNote ?? ''].some((t) => bad.test(t)),
    );
    expect(hits.map((h) => h.id)).toEqual([]);
  });

  it('أي علامة $ مفتوحة بلا إغلاق في النصوص تُكتشف', () => {
    const unbalanced = unit2TeacherSolutions.filter((s) =>
      [s.problem, s.principle, s.finalAnswer, s.check ?? '', ...s.steps].some((t) => (t.match(/\$/g) ?? []).length % 2 === 1),
    );
    expect(unbalanced.map((u) => u.id)).toEqual([]);
  });

  it('أجوبة مفاتيح الإجابة لا تحوي $ (تُعرض عبر Math الخام)', () => {
    const keys = (unit2Lesson1Data.teacherArea?.answerKeys ?? []).flatMap((g) => g.items);
    expect(keys.filter((k) => (k.answer ?? '').includes('$') || (k.note ?? '').includes('$')).map((k) => k.ref)).toEqual([]);
  });
});
