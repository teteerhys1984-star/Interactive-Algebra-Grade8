import { describe, it, expect } from 'vitest';
import { allNotebooks, getNotebook } from '../data/notebooks';
import type { NotebookSectionKind, StudentNotebookData } from '../data/notebooks/types';
import { curriculum, findLesson } from '../data/curriculum';
import { lesson04Data, lesson04ExerciseGroups } from '../data/unit1/lesson04';

/**
 * سلامة بيانات دفاتر الطالب — يفرض قواعد الإسناد المعلنة في types.ts:
 *  - book/adapted ⇒ مراجع كتابية (≥1) بصفحات تغطيها بيانات المنصة فعلًا.
 *  - platform ⇒ بلا مراجع كتابية (لا إسناد لمعلومة لا يدعمها المصدر).
 * بالإضافة إلى خصوصيات الدفتر التدريبي: بلا أمثلة محلولة، بلا تسريب حلول،
 * وسجل محطات مطابق لبيانات الدرس الفعلية.
 */

const VALID_KINDS: NotebookSectionKind[] = [
  'definitions',
  'rules',
  'formulas',
  'procedures',
  'worked-examples',
  'cautions',
  'exercises-to-copy',
];

/** كل الصفحات التي تغطيها بيانات المنصة في وحدة معينة (دروس + خطوات + كتل). */
function unitAllowedPages(unitId: string): Set<number> {
  const pages = new Set<number>();
  const unit = curriculum.find((u) => u.id === unitId);
  if (!unit) return pages;
  for (const lesson of [unit.warmup, ...unit.lessons]) {
    lesson.sourcePages.forEach((p) => pages.add(p));
    for (const step of lesson.steps) {
      step.sourcePages.forEach((p) => pages.add(p));
      for (const block of step.blocks) {
        if (block.sourceRef?.page) pages.add(block.sourceRef.page);
      }
    }
  }
  return pages;
}

const serialize = (notebook: StudentNotebookData): string => JSON.stringify(notebook);

describe('Notebook registry scope', () => {
  it('registers exactly the two pilot notebooks', () => {
    const notebooks = allNotebooks();
    expect(notebooks).toHaveLength(2);
    expect(
      notebooks.map((n) => `${n.unitId}/${n.lessonId}`).sort(),
    ).toEqual(['unit-1/lesson-1', 'unit-1/lesson-4']);
  });

  it('returns undefined for every lesson without a notebook', () => {
    expect(getNotebook('unit-1', 'lesson-2')).toBeUndefined();
    expect(getNotebook('unit-1', 'lesson-3')).toBeUndefined();
    expect(getNotebook('unit-1', 'warmup')).toBeUndefined();
    expect(getNotebook('unit-2', 'u2-lesson-1')).toBeUndefined();
    expect(getNotebook('unit-3', 'u3-lesson-6')).toBeUndefined();
  });

  it('links each notebook to an existing lesson of the same unit', () => {
    for (const notebook of allNotebooks()) {
      const found = findLesson(notebook.lessonId);
      expect(found, `lesson exists for ${notebook.lessonId}`).toBeDefined();
      expect(found?.unit.id).toBe(notebook.unitId);
      expect(notebook.title).toContain('دفتر الطالب');
      expect(notebook.review.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(notebook.review.note.length).toBeGreaterThan(20);
    }
  });
});

describe('Notebook structure', () => {
  it.each(allNotebooks().map((n) => [`${n.unitId}/${n.lessonId}`, n] as const))(
    '%s has unique ids, valid kinds and no empty sections',
    (_key, notebook) => {
      const sectionIds = new Set<string>();
      const entryIds = new Set<string>();
      expect(notebook.sections.length).toBeGreaterThan(0);

      for (const section of notebook.sections) {
        expect(sectionIds.has(section.id), `duplicate section id ${section.id}`).toBe(false);
        sectionIds.add(section.id);
        expect(VALID_KINDS).toContain(section.kind);
        expect(section.title.trim().length).toBeGreaterThan(0);
        expect(section.entries.length, `section ${section.id} must not be empty`).toBeGreaterThan(0);

        for (const entry of section.entries) {
          expect(entryIds.has(entry.id), `duplicate entry id ${entry.id}`).toBe(false);
          entryIds.add(entry.id);
          // كل مدخل يحمل محتوى فعليًا واحدًا على الأقل.
          const hasContent =
            (entry.text && entry.text.trim().length > 0) ||
            (entry.math && entry.math.trim().length > 0) ||
            (entry.steps && entry.steps.length > 0);
          expect(hasContent, `entry ${entry.id} has no content`).toBe(true);
        }
      }
    },
  );
});

describe('Source attribution rules', () => {
  it.each(allNotebooks().map((n) => [`${n.unitId}/${n.lessonId}`, n] as const))(
    '%s respects book/adapted/platform attribution rules',
    (_key, notebook) => {
      const allowedPages = unitAllowedPages(notebook.unitId);
      let sawBookSource = false;

      for (const section of notebook.sections) {
        for (const entry of section.entries) {
          expect(entry.sources.length, `entry ${entry.id} must declare at least one source`).toBeGreaterThan(0);

          for (const source of entry.sources) {
            if (source.origin === 'book' || source.origin === 'adapted') {
              expect(source.refs?.length, `${entry.id}: ${source.origin} requires refs`).toBeGreaterThanOrEqual(1);
              if (source.origin === 'book') sawBookSource = true;
              // adapted يجب أن يوضح طبيعة التصرف.
              if (source.origin === 'adapted') {
                expect(source.note?.trim().length, `${entry.id}: adapted requires a note`).toBeGreaterThan(0);
              }
              for (const ref of source.refs ?? []) {
                expect(ref.section?.trim().length, `${entry.id}: ref needs a section`).toBeGreaterThan(0);
                // صفحة موجودة فعلًا ضمن ما تغطيه بيانات المنصة لهذه الوحدة،
                // أو بديل display صريح للمصادر غير المرقمة.
                if (!ref.display) {
                  expect(
                    allowedPages.has(ref.page),
                    `${entry.id}: page ${ref.page} is not covered by unit ${notebook.unitId} data`,
                  ).toBe(true);
                }
              }
            } else if (source.origin === 'platform') {
              // لا إسناد كتابي لمحتوى المنصة.
              expect(
                !source.refs || source.refs.length === 0,
                `${entry.id}: platform source must not claim book refs`,
              ).toBe(true);
            } else {
              throw new Error(`unknown origin in ${entry.id}`);
            }
          }
        }
      }

      expect(sawBookSource, 'notebook should contain at least one book-sourced entry').toBe(true);
    },
  );
});

describe('Training notebook (unit-1/lesson-4) guards', () => {
  const notebook = getNotebook('unit-1', 'lesson-4')!;

  it('has no worked-examples section (per the approved decision)', () => {
    expect(notebook.sections.some((s) => s.kind === 'worked-examples')).toBe(false);
  });

  it('does not leak any exercise solution or final result of the 47 exercises', () => {
    const serialized = serialize(notebook);
    const leaked: string[] = [];

    for (const step of lesson04Data.steps) {
      for (const block of step.blocks) {
        if (block.id.startsWith('solution-') || block.id.startsWith('result-') || block.id.startsWith('hint-')) {
          if (block.content && serialized.includes(block.content)) leaked.push(block.id);
        }
      }
    }
    expect(leaked, `notebook leaks content of: ${leaked.join(', ')}`).toEqual([]);
    expect(serialized).not.toContain('النتيجة النهائية');
  });

  it('does not contain the removed example A=4x+3-2x-1 (it is exercise 14)', () => {
    const serialized = serialize(notebook);
    expect(serialized).not.toContain('4x+3-2x-1');
    expect(serialized).not.toContain('2x+2');
  });

  it('station register is derived from and consistent with the actual lesson data', () => {
    const register = notebook.sections.find((s) => s.derivedFrom?.lessonId === 'lesson-4');
    expect(register, 'a derived stations register section must exist').toBeDefined();
    expect(register!.kind).toBe('exercises-to-copy');

    for (const group of lesson04ExerciseGroups) {
      const entry = register!.entries.find((e) => e.id === `station-${group.id}`);
      expect(entry, `register entry for ${group.id}`).toBeDefined();

      // إعادة حساب مستقلة داخل الاختبار من بيانات الدرس الفعلية.
      const numbers = lesson04Data.steps
        .map((s) => /^exercise-(\d+)$/.exec(s.id)?.[1])
        .filter((n): n is string => !!n)
        .map(Number)
        .filter((n) => n >= group.from && n <= group.to)
        .sort((a, b) => a - b);
      expect(numbers.length).toBe(group.to - group.from + 1);

      const pages = Array.from(
        new Set(
          numbers.map((n) => {
            const step = lesson04Data.steps.find((s) => s.id === `exercise-${n}`)!;
            return step.blocks.find((b) => b.id === `source-${n}`)?.sourceRef.page ?? step.sourcePages[0];
          }),
        ),
      ).sort((a, b) => a - b);

      expect(entry!.text).toContain(`${numbers[0]}–${numbers[numbers.length - 1]}`);
      for (const page of pages) {
        expect(entry!.text).toContain(String(page));
      }

      const bookSource = entry!.sources.find((s) => s.origin === 'book');
      expect(bookSource?.refs?.map((r) => r.page).sort((a, b) => a - b)).toEqual(pages);
    }
  });

  it('documents the 37–42 page-numbering discrepancy transparently', () => {
    const serialized = serialize(notebook);
    expect(serialized).toContain('23');
    expect(serialized).toContain('22');
  });
});

describe('Theory notebook (unit-1/lesson-1) content contract', () => {
  const notebook = getNotebook('unit-1', 'lesson-1')!;

  it('covers definitions, rules, formulas, procedures, examples, cautions and exercises', () => {
    const kinds = notebook.sections.map((s) => s.kind);
    for (const expected of [
      'definitions',
      'rules',
      'formulas',
      'procedures',
      'worked-examples',
      'cautions',
      'exercises-to-copy',
    ] as NotebookSectionKind[]) {
      expect(kinds, `lesson-1 notebook must include a ${expected} section`).toContain(expected);
    }
  });

  it('exercises-to-copy states problems only, without the interactive solutions', () => {
    const serialized = serialize(notebook);
    // حلول أنشطة الدرس التفاعلية (fill-blank / subItems solutions) لا تتسرب.
    expect(serialized).not.toContain('\\frac{15}{24} - \\frac{4}{24} = \\frac{11}{24}');
    expect(serialized).not.toContain('\\frac{5}{9} + \\frac{3}{9} = \\frac{8}{9}');
  });
});
