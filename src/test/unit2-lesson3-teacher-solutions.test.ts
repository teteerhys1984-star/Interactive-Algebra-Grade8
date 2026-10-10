import { describe, it, expect } from 'vitest';
import { unit2Lesson3Data } from '../data/unit2/lesson03';
import { unit2Lesson3TeacherSolutions } from '../data/unit2/lesson03TeacherSolutions';

/**
 * تغطية حلول المعلّم للوحدة الثانية — الدرس الثالث (قوى صحيحة لعدد نسبي، الصفحات 32–34).
 * المعيار: كل تعريف وقاعدة ومثال و«تحقّق من فهمك» و«تدرّب» — وكل بند فرعي فيها —
 * يجب أن يملك حلًا خطوة بخطوة. لا يُحسب العدد الكامل مسبقًا؛ يُستخرج من البيانات.
 *
 * يبقى الاستثناءان الموثّقان أدناه: جملتان تمهيديتان لا تحملان مطلوبًا (تمهيد نشاط
 * الصفحة 32، وتعليمة «تحقّق من فهمك» في الصفحة 34) فلا تُطلبان في الحلول.
 */

const COVERED_TYPES = new Set(['practice', 'learn', 'knowledge', 'example', 'check', 'word-problem']);

/** جملتان تمهيديتان (لا سؤال فيهما): تمهيد النشاط، وتعليمة «تحقّق من فهمك». */
const FRAMING_BLOCK_IDS = new Set(['p32-activity-intro', 'p34-check-instruction']);

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
    // سياق مسألة كلامية بلا بنود فرعية (جملة تمهيدية) لا يُعدّ بندًا؛ بنوده الفرعية مغطاة.
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

const allBlocks = unit2Lesson3Data.steps.flatMap((step: any) => step.blocks ?? []);
const allSubItems = allBlocks.flatMap((block: any) => block.subItems ?? []);

const solutionKey = (solution: (typeof unit2Lesson3TeacherSolutions)[number]): string =>
  solution.subIndex !== undefined ? `${solution.blockId}#${solution.subIndex}` : solution.blockId;

describe('حلول المعلّم التفصيلية — الوحدة الثانية، الدرس الثالث', () => {
  const required = requiredInventory(allBlocks);
  const solutionsByKey = new Map<string, typeof unit2Lesson3TeacherSolutions>();
  for (const solution of unit2Lesson3TeacherSolutions) {
    const key = solutionKey(solution);
    solutionsByKey.set(key, [...(solutionsByKey.get(key) ?? []), solution]);
  }

  it('الجرد يحوي عدداً غير صفري من البنود المطلوبة (الاستخراج من البيانات)', () => {
    expect(required.length).toBeGreaterThan(0);
    expect(required.length).toBe(55);
    console.info(
      `[unit2-lesson3-teacher-solutions] required items: ${required.length}, solutions: ${unit2Lesson3TeacherSolutions.length}`,
    );
  });

  it('لكل بند مطلوب حل واحد على الأقل، ولا حل زائد عن البنود', () => {
    const missing = required.filter((entry) => !solutionsByKey.has(entry.key)).map((entry) => entry.key);
    expect(missing).toEqual([]);

    const requiredKeys = new Set(required.map((entry) => entry.key));
    const extra = [...solutionsByKey.keys()].filter((key) => !requiredKeys.has(key));
    expect(extra).toEqual([]);
  });

  it('لا يوجد حل يشير إلى كتلة أو بند فرعي غير موجود', () => {
    const blockIndex = new Map(allBlocks.map((block: any) => [block.id, block]));
    const dangling = unit2Lesson3TeacherSolutions.filter((solution) => {
      const block: any = blockIndex.get(solution.blockId);
      if (!block) return true;
      if (solution.subIndex === undefined) return false;
      return !Array.isArray(block.subItems) || solution.subIndex >= block.subItems.length;
    });
    expect(dangling.map((solution) => solution.id)).toEqual([]);
  });

  it('معرّفات الحلول فريدة، وكل صفحة من صفحات الدرس مغطاة', () => {
    const ids = unit2Lesson3TeacherSolutions.map((solution) => solution.id);
    expect(new Set(ids).size).toBe(ids.length);

    const pages = new Set(unit2Lesson3TeacherSolutions.map((solution) => solution.source.match(/ص(\d+)/)?.[1]));
    expect([...pages].sort()).toEqual(['32', '33', '34']);
  });

  it('كل حل مكتمل: مسألة، خطوتان على الأقل، جواب نهائي، قاعدة، تحقّق، وصفحة', () => {
    for (const solution of unit2Lesson3TeacherSolutions) {
      expect(solution.problem.trim().length, solution.id).toBeGreaterThan(0);
      expect(solution.steps.length, solution.id).toBeGreaterThanOrEqual(2);
      solution.steps.forEach((step) => expect(step.trim().length, solution.id).toBeGreaterThan(0));
      expect(solution.finalAnswer.trim().length, solution.id).toBeGreaterThan(0);
      expect(solution.principle.trim().length, solution.id).toBeGreaterThan(0);
      expect(solution.check?.trim().length ?? 0, solution.id).toBeGreaterThan(0);
      expect(solution.source, solution.id).toMatch(/ص(32|33|34)/);
    }
  });

  it('يفصل بين ما طُبع في الكتاب وما اشتقّته المنصة', () => {
    const printed = unit2Lesson3TeacherSolutions.filter((solution) => solution.answerOrigin === 'الكتاب');
    const derived = unit2Lesson3TeacherSolutions.filter((solution) => solution.answerOrigin === 'مُشتقة من المنصة');
    expect(printed.length + derived.length).toBe(unit2Lesson3TeacherSolutions.length);
    expect(printed.length).toBe(14);
    expect(derived.length).toBe(41);

    // الحلول المأخوذة من أمثلة الكتاب المطبوعة لا يجوز أن تُنسب إلى المنصة.
    for (const solution of unit2Lesson3TeacherSolutions) {
      if (/^s3\d-ex-/.test(solution.id) || /^s32-(def|rule)-/.test(solution.id) || /^s33-(rule|priority)/.test(solution.id)) {
        expect(solution.answerOrigin, solution.id).toBe('الكتاب');
      }
    }
  });

  it('لا توجد عناصر نائبة أو عبارات «قريباً» في الحلول', () => {
    const bad = /TODO|TBD|قريباً|coming soon|placeholder|ـ\s*$/i;
    const hits = unit2Lesson3TeacherSolutions.filter((solution) =>
      [solution.problem, solution.principle, solution.finalAnswer, ...solution.steps, solution.check ?? '', solution.sourceNote ?? '']
        .some((text) => bad.test(text)),
    );
    expect(hits.map((hit) => hit.id)).toEqual([]);
  });

  it('أي علامة $ مفتوحة بلا إغلاق في النصوص تُكتشف', () => {
    const unbalanced = unit2Lesson3TeacherSolutions.filter((solution) =>
      [solution.problem, solution.principle, solution.finalAnswer, solution.check ?? '', ...solution.steps, solution.sourceNote ?? '']
        .some((text) => (text.match(/\$/g) ?? []).length % 2 === 1),
    );
    expect(unbalanced.map((entry) => entry.id)).toEqual([]);
  });

  it('لا تصل صيغة TeX مزدوجة الشرطة المائلة إلى العرض (کل الشرطات مفردة)', () => {
    // صيغة الكتاب تُكتب بشرطة مائلة واحدة داخل النص؛ تضاعفها يعرض \times كنص.
    const doubled = unit2Lesson3TeacherSolutions.filter((solution) =>
      [solution.problem, solution.principle, solution.finalAnswer, solution.check ?? '', ...solution.steps, solution.sourceNote ?? '']
        .some((text) => text.includes('\\\\')),
    );
    expect(doubled.map((entry) => entry.id)).toEqual([]);
  });

  it('أجوبة مفاتيح الإجابة لا تحوي $ (تُعرض عبر Math الخام)', () => {
    const keys = (unit2Lesson3Data.teacherArea?.answerKeys ?? []).flatMap((group) => group.items);
    expect(keys.length).toBe(56);
    expect(keys.filter((item) => (item.answer ?? '').includes('$') || (item.note ?? '').includes('$')).map((item) => item.ref))
      .toEqual([]);
  });

  it('بنود «تحقّق من فهمك» و«تدرّب» كاملة العدد كما في الجرد المكتشف', () => {
    const checkSubItems = allBlocks
      .filter((block: any) => block.id.startsWith('p34-check-'))
      .flatMap((block: any) => block.subItems ?? []);
    const drillSubItems = allBlocks
      .filter((block: any) => block.id.startsWith('p34-drill-'))
      .flatMap((block: any) => block.subItems ?? []);

    expect(checkSubItems.length).toBe(13);
    expect(drillSubItems.length).toBe(16);

    const solvedCheck = unit2Lesson3TeacherSolutions.filter((solution) => solution.blockId.startsWith('p34-check-'));
    const solvedDrill = unit2Lesson3TeacherSolutions.filter((solution) => solution.blockId.startsWith('p34-drill-'));
    expect(solvedCheck.length).toBe(checkSubItems.length);
    expect(solvedDrill.length).toBe(drillSubItems.length);
  });

  it('كل بند فرعي معروض للطالب له حل، وكل حل يقابل بندًا معروضًا', () => {
    const visibleSubItemKeys = new Set(
      allBlocks.flatMap((block: any) => (block.subItems ?? []).map((_: unknown, index: number) => `${block.id}#${index}`)),
    );
    const solvedSubItemKeys = new Set(
      unit2Lesson3TeacherSolutions.filter((solution) => solution.subIndex !== undefined).map(solutionKey),
    );
    for (const key of solvedSubItemKeys) {
      expect(visibleSubItemKeys.has(key), key).toBe(true);
    }
    expect(allSubItems.length).toBeGreaterThan(0);
  });
});
