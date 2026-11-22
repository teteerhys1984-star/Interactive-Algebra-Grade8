import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { allNotebooks, getNotebook, hasNotebook } from '../data/notebooks';
import type { NotebookSectionKind, StudentNotebookData } from '../data/notebooks/types';
import { curriculum, findLesson } from '../data/curriculum';
import { lesson04Data, lesson04ExerciseGroups } from '../data/unit1/lesson04';
import { MathText } from '../components/math/MathText';

/**
 * سلامة بيانات دفاتر الطالب — يفرض قواعد الإسناد المعلنة في types.ts:
 *  - book/adapted ⇒ مراجع كتابية (≥1) بصفحات تغطيها بيانات المنصة فعلًا.
 *  - platform ⇒ بلا مراجع كتابية (لا إسناد لمعلومة لا يدعمها المصدر).
 * بالإضافة إلى خصوصيات الدفتر التدريبي (lesson-4) وعقود المحتوى وعدم تسرب
 * حلول التمارين في دفاتر الدروس النظرية (lesson-1, lesson-2, lesson-3) وسلامة
 * العرض الرياضي عبر KaTeX في كل الدفاتر المسجلة.
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

const collectText = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(collectText).join('\n');
  if (value && typeof value === 'object') return Object.values(value).map(collectText).join('\n');
  return '';
};

const serialize = (notebook: StudentNotebookData): string => collectText(notebook);

const VISIBLE_TEXT = (html: string): string =>
  html
    .replace(/<annotation[\s\S]*?<\/annotation>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

describe('Notebook registry scope', () => {
  it('registers exactly the four Unit 1 lesson notebooks (lessons 1–4)', () => {
    const notebooks = allNotebooks();
    expect(notebooks).toHaveLength(4);
    expect(
      notebooks.map((n) => `${n.unitId}/${n.lessonId}`).sort(),
    ).toEqual([
      'unit-1/lesson-1',
      'unit-1/lesson-2',
      'unit-1/lesson-3',
      'unit-1/lesson-4',
    ]);
  });

  it('returns undefined for every warmup and every Unit 2 / Unit 3 lesson', () => {
    const expectedIds = new Set([
      'unit-1/lesson-1',
      'unit-1/lesson-2',
      'unit-1/lesson-3',
      'unit-1/lesson-4',
    ]);
    for (const unit of curriculum) {
      for (const lesson of [unit.warmup, ...unit.lessons]) {
        const key = `${unit.id}/${lesson.id}`;
        if (expectedIds.has(key)) {
          expect(hasNotebook(unit.id, lesson.id), key).toBe(true);
          expect(getNotebook(unit.id, lesson.id), key).toBeDefined();
        } else {
          expect(hasNotebook(unit.id, lesson.id), `${key} must NOT have a notebook`).toBe(false);
          expect(getNotebook(unit.id, lesson.id), `${key} must return undefined`).toBeUndefined();
        }
      }
    }
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

describe('Multiplication notebook (unit-1/lesson-2) content contract', () => {
  const notebook = getNotebook('unit-1', 'lesson-2')!;

  it('covers all seven reference section kinds and stays within pages 8–11', () => {
    const kinds = notebook.sections.map((s) => s.kind);
    for (const expected of VALID_KINDS) {
      expect(kinds, `lesson-2 notebook must include a ${expected} section`).toContain(expected);
    }
    for (const section of notebook.sections) {
      for (const entry of section.entries) {
        for (const source of entry.sources) {
          for (const ref of source.refs ?? []) {
            expect(ref.page).toBeGreaterThanOrEqual(8);
            expect(ref.page).toBeLessThanOrEqual(11);
          }
        }
      }
    }
  });

  it('does not copy interactive solutions of تحقق من فهمك / تدرّب or uncertain صيغ مبسطة line', () => {
    const serialized = serialize(notebook);
    // حلول تمارين ص10–11 لا تتسرب إلى الدفتر.
    expect(serialized).not.toContain('\\frac{45}{52}');
    expect(serialized).not.toContain('-\\frac{225}{44}');
    expect(serialized).not.toContain('-40y');
    expect(serialized).not.toContain('-21z');
    expect(serialized).not.toContain('60x');
    expect(serialized).not.toContain('-\\frac{180}{7}');
    expect(serialized).not.toContain('\\frac{15}{8}');
    // البند غير المحسوم في ص9 (verifyNote) لم يُعتمد كنص مرجعي.
    expect(serialized).not.toContain('(-4) \\times (-6)');
  });

  it('documents the verifyNote transparency on تحقق من فهمك ② item ③', () => {
    const exercises = notebook.sections.find((s) => s.kind === 'exercises-to-copy')!;
    const check2 = exercises.entries.find((e) => e.id === 'hw-check-2');
    expect(check2).toBeDefined();
    expect(check2?.sources.some((s) => s.note?.includes('verifyNote') || s.note?.includes('مزدحم الأقواس'))).toBe(true);
  });
});

describe('Division notebook (unit-1/lesson-3) content contract', () => {
  const notebook = getNotebook('unit-1', 'lesson-3')!;

  it('covers all seven reference section kinds and stays within pages 12–16', () => {
    const kinds = notebook.sections.map((s) => s.kind);
    for (const expected of VALID_KINDS) {
      expect(kinds, `lesson-3 notebook must include a ${expected} section`).toContain(expected);
    }
    for (const section of notebook.sections) {
      for (const entry of section.entries) {
        for (const source of entry.sources) {
          for (const ref of source.refs ?? []) {
            expect(ref.page).toBeGreaterThanOrEqual(12);
            expect(ref.page).toBeLessThanOrEqual(16);
          }
        }
      }
    }
  });

  it('includes reciprocal, division, priorities, compound fractions, opposite vs reciprocal, and exact vs approx', () => {
    const serialized = serialize(notebook);
    expect(serialized).toContain('x^{-1}');
    expect(serialized).toContain('\\frac{a}{b} \\div \\frac{d}{c}');
    expect(serialized).toContain('الأولويات');
    expect(serialized).toContain('النظير');
    expect(serialized).toContain('خط الكسر المحاذي للرمز');
    expect(serialized).toContain('القيمة التامة');
  });

  it('does not leak p. 16 exercise solutions into the notebook', () => {
    const serialized = serialize(notebook);
    expect(serialized).not.toContain('\\frac{15}{17}');
    expect(serialized).not.toContain('\\frac{33}{50}');
    expect(serialized).not.toContain('\\frac{28}{15}');
    expect(serialized).not.toContain('\\frac{21}{40}');
    expect(serialized).not.toContain('\\frac{5500}{9}');
    expect(serialized).not.toContain('611.11');
    expect(serialized).not.toContain('-0.5');
    expect(serialized).not.toContain('\\frac{21}{20}');
  });
});

describe('All notebooks — math rendering & control-character safety', () => {
  const COMMAND_NAMES = ['neq', 'qquad', 'quad', 'frac', 'dfrac', 'times', 'div', 'cancel', 'text'];
  const leakedCommand = (name: string) => new RegExp(name.split('').join('\\s*'), 'i');

  it.each(allNotebooks().map((n) => [`${n.unitId}/${n.lessonId}`, n] as const))(
    '%s renders every math and text field cleanly without KaTeX errors or leaked commands',
    (_key, notebook) => {
      const inspectString = (where: string, value: string, display = false) => {
        // كشف أي حرف تحكم ناتج عن هروب خاطئ مثل \f أو \t داخل السلاسل.
        expect(value, `${where} has unexpected control character`).not.toMatch(/[\x00-\x09\x0b-\x1f]/);

        const html = renderToStaticMarkup(React.createElement(MathText, { text: value, display }));
        expect(html, `${where} triggered katex-error`).not.toContain('katex-error');
        const visible = VISIBLE_TEXT(html);
        expect(visible, `${where} leaked raw $`).not.toContain('$');
        expect(visible, `${where} leaked raw backslash`).not.toContain('\\');
        for (const cmd of COMMAND_NAMES) {
          expect(leakedCommand(cmd).test(visible), `${where} leaked \\${cmd} :: ${visible}`).toBe(false);
        }
      };

      inspectString('review.note', notebook.review.note);
      for (const section of notebook.sections) {
        for (const entry of section.entries) {
          if (entry.title) inspectString(`${entry.id}.title`, entry.title);
          if (entry.text) inspectString(`${entry.id}.text`, entry.text);
          if (entry.math) inspectString(`${entry.id}.math`, entry.math, true);
          entry.steps?.forEach((step, idx) => inspectString(`${entry.id}.steps[${idx}]`, step));
        }
      }
    },
  );

  it('new notebooks (lesson-2, lesson-3) contain no literal ** markdown syntax', () => {
    for (const id of ['lesson-2', 'lesson-3']) {
      const nb = getNotebook('unit-1', id)!;
      expect(serialize(nb)).not.toContain('**');
    }
  });
});
