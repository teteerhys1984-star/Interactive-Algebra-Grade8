import { describe, it, expect } from 'vitest';
import { unit2Lesson4Data } from '../data/unit2/lesson04';
import { unit2Lesson4TeacherSolutions } from '../data/unit2/lesson04TeacherSolutions';

/**
 * تغطية حلول المعلّم — الوحدة الثانية، الدرس الرابع (الجذور التربيعية، الصفحات 35–37).
 *
 * المعيار: كل تعريف وقاعدة ومثال وتحقّق وتدرّب وكل بند فرعي فيها، وكل نشاط تفاعلي
 * يطلب إجابة أو مقارنة (جدول المربعات، واستوديوهات الجذور، ومبسّط الجذور، وحاسبة
 * المساحة)، يجب أن يملك حلًا خطوة بخطوة. الجرد يُستخرج من البيانات لا من عدد ثابت.
 *
 * مستثنى من الجرد: جمل التمهيد (نص النشاط في الصفحة 35)، وكتل «خطأ شائع» و«لماذا»
 * و«شرح المنصة» لأنها شروح لا تطلب إجابة.
 */

const COVERED_TYPES = new Set([
  'practice', 'learn', 'knowledge', 'example', 'check', 'word-problem', 'interactive-exercise',
]);

/** جملة تمهيد النشاط في الصفحة 35: لا تطلب إجابة. */
const FRAMING_BLOCK_IDS = new Set(['p35-activity-intro']);

interface Inventory {
  key: string;
  blockId: string;
  subIndex?: number;
  page: number;
}

function requiredInventory(blocks: any[]): Inventory[] {
  const out: Inventory[] = [];
  for (const block of blocks) {
    if (FRAMING_BLOCK_IDS.has(block.id)) continue;
    if (!COVERED_TYPES.has(block.type)) continue;
    if (block.type === 'word-problem' && !(Array.isArray(block.subItems) && block.subItems.length > 0)) continue;
    if (Array.isArray(block.subItems) && block.subItems.length > 0) {
      block.subItems.forEach((_: unknown, index: number) =>
        out.push({ key: `${block.id}#${index}`, blockId: block.id, subIndex: index, page: block.sourceRef?.page ?? 0 }),
      );
    } else {
      out.push({ key: block.id, blockId: block.id, page: block.sourceRef?.page ?? 0 });
    }
  }
  return out;
}

const allBlocks: any[] = unit2Lesson4Data.steps.flatMap((step: any) => step.blocks ?? []);
const allSubItems = allBlocks.flatMap((block: any) => block.subItems ?? []);

const solutionKey = (solution: (typeof unit2Lesson4TeacherSolutions)[number]): string =>
  solution.subIndex !== undefined ? `${solution.blockId}#${solution.subIndex}` : solution.blockId;

const textsOf = (solution: (typeof unit2Lesson4TeacherSolutions)[number]): string[] =>
  [solution.problem, solution.principle, solution.finalAnswer, solution.check ?? '', ...solution.steps, solution.sourceNote ?? ''];

describe('حلول المعلّم التفصيلية — الوحدة الثانية، الدرس الرابع', () => {
  const required = requiredInventory(allBlocks);
  const solutionsByKey = new Map<string, typeof unit2Lesson4TeacherSolutions>();
  for (const solution of unit2Lesson4TeacherSolutions) {
    const key = solutionKey(solution);
    solutionsByKey.set(key, [...(solutionsByKey.get(key) ?? []), solution]);
  }

  it('الجرد يحوي عدد البنود المطلوبة كما استُخرج من الدرس (تعريفات وأمثلة وتحقّق وتدرّب وأنشطة)', () => {
    expect(required.length).toBeGreaterThan(0);
    // 50 بندًا تعليميًا و9 أنشطة تفاعلية تطلب إجابة أو مقارنة.
    expect(required.length).toBe(59);
    console.info(
      `[unit2-lesson4-teacher-solutions] required items: ${required.length}, solutions: ${unit2Lesson4TeacherSolutions.length}`,
    );
  });

  it('لكل بند مطلوب حل واحد على الأقل، ولا حل زائد عن البنود', () => {
    const missing = required.filter((entry) => !solutionsByKey.has(entry.key)).map((entry) => entry.key);
    expect(missing).toEqual([]);

    const requiredKeys = new Set(required.map((entry) => entry.key));
    const extra = [...solutionsByKey.keys()].filter((key) => !requiredKeys.has(key));
    expect(extra).toEqual([]);
  });

  it('كل بند مطلوب له حل واحد فقط (لا تكرار في الحلول)', () => {
    const duplicated = [...solutionsByKey.entries()].filter(([, list]) => list.length > 1).map(([key]) => key);
    expect(duplicated).toEqual([]);
  });

  it('لا يوجد حل يشير إلى كتلة أو بند فرعي غير موجود', () => {
    const blockIndex = new Map(allBlocks.map((block: any) => [block.id, block]));
    const dangling = unit2Lesson4TeacherSolutions.filter((solution) => {
      const block: any = blockIndex.get(solution.blockId);
      if (!block) return true;
      if (solution.subIndex === undefined) return false;
      return !Array.isArray(block.subItems) || solution.subIndex >= block.subItems.length;
    });
    expect(dangling.map((solution) => solution.id)).toEqual([]);
  });

  it('معرّفات الحلول فريدة، وكل صفحات الدرس الثلاث مغطاة', () => {
    const ids = unit2Lesson4TeacherSolutions.map((solution) => solution.id);
    expect(new Set(ids).size).toBe(ids.length);

    const pages = new Set(unit2Lesson4TeacherSolutions.map((solution) => solution.source.match(/ص(\d+)/)?.[1]));
    expect([...pages].sort()).toEqual(['35', '36', '37']);
  });

  it('كل حل مكتمل: مسألة، خطوتان على الأقل، جواب نهائي، قاعدة، وصفحة', () => {
    for (const solution of unit2Lesson4TeacherSolutions) {
      expect(solution.problem.trim().length, solution.id).toBeGreaterThan(0);
      expect(solution.steps.length, solution.id).toBeGreaterThanOrEqual(2);
      solution.steps.forEach((step) => expect(step.trim().length, solution.id).toBeGreaterThan(0));
      expect(solution.finalAnswer.trim().length, solution.id).toBeGreaterThan(0);
      expect(solution.principle.trim().length, solution.id).toBeGreaterThan(0);
      expect(solution.source, solution.id).toMatch(/ص(35|36|37)/);
    }
  });

  it('يملك كل حل تحقّقًا رياضيًا أو مرجعًا للكتاب، باستثناء ما لا يحتاجه', () => {
    const withoutCheck = unit2Lesson4TeacherSolutions.filter((solution) => !(solution.check?.trim()));
    expect(withoutCheck.map((solution) => solution.id)).toEqual([]);
  });

  it('يفصل بين ما طُبع في الكتاب وما اشتقّته المنصة', () => {
    const printed = unit2Lesson4TeacherSolutions.filter((solution) => solution.answerOrigin === 'الكتاب');
    const derived = unit2Lesson4TeacherSolutions.filter((solution) => solution.answerOrigin === 'مُشتقة من المنصة');
    expect(printed.length + derived.length).toBe(unit2Lesson4TeacherSolutions.length);
    expect(printed.length).toBe(32);
    expect(derived.length).toBe(27);

    // أمثلة الكتاب المطبوعة (التعريف والمثالان والخواص والتبسيط والآلة الحاسبة) تُنسب إلى الكتاب.
    for (const solution of unit2Lesson4TeacherSolutions) {
      if (/^s35-(def|ex)-/.test(solution.id) || /^s36-ex-/.test(solution.id)) {
        expect(solution.answerOrigin, solution.id).toBe('الكتاب');
      }
    }
  });

  it('كل نشاط تفاعلي له حل مُشتقّ من المنصة مع قيمة يمكن للطالب تجربتها في الأداة', () => {
    const interactive = allBlocks.filter((block: any) => block.type === 'interactive-exercise');
    expect(interactive.length).toBe(9);
    for (const block of interactive) {
      const solution = unit2Lesson4TeacherSolutions.find((entry) => entry.blockId === block.id);
      expect(solution, block.id).toBeDefined();
      expect(solution!.answerOrigin, block.id).toBe('مُشتقة من المنصة');
    }
  });

  it('لا توجد عناصر نائبة أو عبارات «قريباً» في الحلول', () => {
    const bad = /TODO|TBD|قريباً|coming soon|placeholder|ـ\s*$/i;
    const hits = unit2Lesson4TeacherSolutions.filter((solution) => textsOf(solution).some((text) => bad.test(text)));
    expect(hits.map((hit) => hit.id)).toEqual([]);
  });

  it('أي علامة $ مفتوحة بلا إغلاق في النصوص تُكتشف', () => {
    const unbalanced = unit2Lesson4TeacherSolutions.filter((solution) =>
      textsOf(solution).some((text) => (text.match(/\$/g) ?? []).length % 2 === 1),
    );
    expect(unbalanced.map((entry) => entry.id)).toEqual([]);
  });

  it('لا تصل صيغة TeX مزدوجة الشرطة المائلة إلى العرض (كل الشرطات مفردة)', () => {
    const doubled = unit2Lesson4TeacherSolutions.filter((solution) =>
      textsOf(solution).some((text) => text.includes('\\\\\\\\')),
    );
    expect(doubled.map((entry) => entry.id)).toEqual([]);
  });

  it('كل بند فرعي معروض للطالب له حل، وكل حل يقابل بندًا معروضًا', () => {
    const visibleSubItemKeys = new Set(
      allBlocks.flatMap((block: any) => (block.subItems ?? []).map((_: unknown, index: number) => `${block.id}#${index}`)),
    );
    const solvedSubItemKeys = new Set(
      unit2Lesson4TeacherSolutions.filter((solution) => solution.subIndex !== undefined).map(solutionKey),
    );
    for (const key of solvedSubItemKeys) {
      expect(visibleSubItemKeys.has(key), key).toBe(true);
    }
    expect(allSubItems.length).toBeGreaterThan(0);
  });

  it('الدرس يربط هذه الحلول بمنطقة المعلّم دون نسخ', () => {
    expect(unit2Lesson4Data.teacherArea?.solutions).toBe(unit2Lesson4TeacherSolutions);
  });
});
