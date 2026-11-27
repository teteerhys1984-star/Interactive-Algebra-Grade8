import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { allNotebooks, getNotebook, hasNotebook } from '../data/notebooks';
import type { NotebookSectionKind, StudentNotebookData } from '../data/notebooks/types';
import { curriculum, findLesson } from '../data/curriculum';
import { lesson04Data, lesson04ExerciseGroups } from '../data/unit1/lesson04';
import { unit2Lesson1Data } from '../data/unit2/lesson01';
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
  it('registers the eight existing notebooks, five Unit 3 notebooks, and three Unit 4 notebooks', () => {
    const notebooks = allNotebooks();
    expect(notebooks).toHaveLength(16);
    expect(
      notebooks.map((n) => `${n.unitId}/${n.lessonId}`).sort(),
    ).toEqual([
      'unit-1/lesson-1',
      'unit-1/lesson-2',
      'unit-1/lesson-3',
      'unit-1/lesson-4',
      'unit-2/u2-lesson-1',
      'unit-2/u2-lesson-2',
      'unit-2/u2-lesson-3',
      'unit-2/u2-lesson-4',
      'unit-3/u3-lesson-1',
      'unit-3/u3-lesson-2',
      'unit-3/u3-lesson-3',
      'unit-3/u3-lesson-4',
      'unit-3/u3-lesson-5',
      'unit-4/u4-lesson-1',
      'unit-4/u4-lesson-2',
      'unit-4/u4-lesson-3',
    ]);
  });

  it('returns undefined for every lesson outside the explicit registry', () => {
    const expectedIds = new Set([
      'unit-1/lesson-1',
      'unit-1/lesson-2',
      'unit-1/lesson-3',
      'unit-1/lesson-4',
      'unit-2/u2-lesson-1',
      'unit-2/u2-lesson-2',
      'unit-2/u2-lesson-3',
      'unit-2/u2-lesson-4',
      'unit-3/u3-lesson-1',
      'unit-3/u3-lesson-2',
      'unit-3/u3-lesson-3',
      'unit-3/u3-lesson-4',
      'unit-3/u3-lesson-5',
      'unit-4/u4-lesson-1',
      'unit-4/u4-lesson-2',
      'unit-4/u4-lesson-3',
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

  it('excludes the Unit 2 exercise lesson (u2-lesson-5) explicitly', () => {
    expect(hasNotebook('unit-2', 'u2-lesson-5')).toBe(false);
    expect(getNotebook('unit-2', 'u2-lesson-5')).toBeUndefined();
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

/** يتحقق أن كل مرجع كتابي داخل الدفتر يقع ضمن نطاق صفحات الدرس المستهدف. */
function expectNotebookPagesWithin(
  notebook: StudentNotebookData,
  minPage: number,
  maxPage: number,
): void {
  for (const section of notebook.sections) {
    for (const entry of section.entries) {
      for (const source of entry.sources) {
        for (const ref of source.refs ?? []) {
          expect(ref.page, `${entry.id}: page ${ref.page}`).toBeGreaterThanOrEqual(minPage);
          expect(ref.page, `${entry.id}: page ${ref.page}`).toBeLessThanOrEqual(maxPage);
        }
      }
    }
  }
}

describe('Powers of ten notebook (unit-2/u2-lesson-1) content contract', () => {
  const notebook = getNotebook('unit-2', 'u2-lesson-1')!;

  it('covers all seven reference section kinds and stays within pages 26–28', () => {
    const kinds = notebook.sections.map((s) => s.kind);
    for (const expected of VALID_KINDS) {
      expect(kinds, `u2-lesson-1 notebook must include a ${expected} section`).toContain(expected);
    }
    expectNotebookPagesWithin(notebook, 26, 28);
  });

  it('includes powers of ten, negative exponents and standard form', () => {
    const serialized = serialize(notebook);
    expect(serialized).toContain('10^{n}');
    expect(serialized).toContain('10^{-n}');
    expect(serialized).toContain('مقلوب');
    expect(serialized).toContain('الصيغة المعيارية');
    expect(serialized).toContain('a\\times10^{n}');
    expect(serialized).toContain('1\\le|a|<10');
  });

  it('does not leak p. 28 exercise solutions or the final assessment explanations', () => {
    const serialized = serialize(notebook);
    for (const leaked of [
      '4\\,500\\,000\\,000\\,000',
      '5.6633\\times10^{3}',
      '0.000\\,000\\,01',
      '2.5\\times10^{-5}',
      '9.8\\times10^{-1}',
    ]) {
      expect(serialized, `leaked ${leaked}`).not.toContain(leaked);
    }
    for (const question of unit2Lesson1Data.finalAssessment?.questions ?? []) {
      expect(serialized).not.toContain(question.explanation);
      if (question.hint) expect(serialized).not.toContain(question.hint);
    }
  });
});

describe('Powers of ten rules notebook (unit-2/u2-lesson-2) content contract', () => {
  const notebook = getNotebook('unit-2', 'u2-lesson-2')!;

  it('covers all seven reference section kinds and stays within pages 29–31', () => {
    const kinds = notebook.sections.map((s) => s.kind);
    for (const expected of VALID_KINDS) {
      expect(kinds, `u2-lesson-2 notebook must include a ${expected} section`).toContain(expected);
    }
    expectNotebookPagesWithin(notebook, 29, 31);
  });

  it('includes the four rules, scientific-notation calculation and bounding', () => {
    const serialized = serialize(notebook);
    expect(serialized).toContain('10^{n+m}');
    expect(serialized).toContain('10^{n-m}');
    expect(serialized).toContain('10^{n\\times m}');
    expect(serialized).toContain('10^{-n}');
    expect(serialized).toContain('9.3\\times10^{-9}');
    expect(serialized).toContain('10^{6}<A<10^{7}');
    expect(serialized).toContain('10^{-2}<B<10^{-1}');
  });

  it('does not leak p. 31 exercise solutions into the notebook', () => {
    const serialized = serialize(notebook);
    for (const leaked of [
      '10^{2-(-4)}=10^{6}',
      '10^{-2\\times4}=10^{-8}',
      '10^{-1}\\times10^{-7}=10^{-8}',
      '10^{2\\times3}\\times10^{4}=10^{6+4}=10^{10}',
      '10^{-1}\\times10^{-8}=10^{-9}',
      '\\frac{10^{10}}{10^{7}}=10^{3}',
      '\\frac{10^{13}}{10^{15}}=10^{-2}',
      '10^{7}\\times10^{-7}',
    ]) {
      expect(serialized, `leaked ${leaked}`).not.toContain(leaked);
    }
  });
});

describe('Integer powers of a rational number notebook (unit-2/u2-lesson-3) content contract', () => {
  const notebook = getNotebook('unit-2', 'u2-lesson-3')!;

  it('covers all seven reference section kinds and stays within pages 32–34', () => {
    const kinds = notebook.sections.map((s) => s.kind);
    for (const expected of VALID_KINDS) {
      expect(kinds, `u2-lesson-3 notebook must include a ${expected} section`).toContain(expected);
    }
    expectNotebookPagesWithin(notebook, 32, 34);
  });

  it('includes the four rules, signs, zero domain and order of operations', () => {
    const serialized = serialize(notebook);
    expect(serialized).toContain('a^{n+m}');
    expect(serialized).toContain('a^{n-m}');
    expect(serialized).toContain('a^{n}\\times b^{n}');
    expect(serialized).toContain('\\frac{a^{n}}{b^{n}}');
    expect(serialized).toContain('أولويات العمليات');
    expect(serialized).toContain('0^{0}');
    expect(serialized).toContain('(-3)^{2}=9');
  });

  it('does not leak p. 34 exercise solutions into the notebook', () => {
    const serialized = serialize(notebook);
    for (const leaked of [
      '-\\frac{125}{8}',
      '\\frac{27}{64}',
      '\\frac{1}{32}',
      '8^{10}',
      '(-4)^{8}',
      '\\left(\\frac{2}{3}\\right)^{12}',
    ]) {
      expect(serialized, `leaked ${leaked}`).not.toContain(leaked);
    }
  });
});

describe('Square roots notebook (unit-2/u2-lesson-4) content contract', () => {
  const notebook = getNotebook('unit-2', 'u2-lesson-4')!;

  it('covers all seven reference section kinds and stays within pages 35–37', () => {
    const kinds = notebook.sections.map((s) => s.kind);
    for (const expected of VALID_KINDS) {
      expect(kinds, `u2-lesson-4 notebook must include a ${expected} section`).toContain(expected);
    }
    expectNotebookPagesWithin(notebook, 35, 37);
  });

  it('includes the definition, the two results and the four root properties', () => {
    const serialized = serialize(notebook);
    expect(serialized).toContain('\\sqrt{a\\times b}=\\sqrt{a}\\times\\sqrt{b}');
    expect(serialized).toContain('\\sqrt{\\frac{a}{b}}=\\frac{\\sqrt{a}}{\\sqrt{b}}');
    expect(serialized).toContain('\\left(\\sqrt{b}\\right)^{n}=\\sqrt{b^{n}}');
    expect(serialized).toContain('\\sqrt{b^{n}}=b^{\\frac{n}{2}}');
    expect(serialized).toContain('ليس للعدد السالب جذر تربيعي');
    expect(serialized).toContain('\\sqrt{0}=0');
  });

  it('does not leak p. 37 exercise solutions into the notebook', () => {
    const serialized = serialize(notebook);
    for (const leaked of [
      '5\\sqrt{3}',
      '4\\sqrt{2}',
      '6\\sqrt{3}',
      '5.48',
      '\\sqrt{225}=15',
      '\\sqrt{15\\,625}',
      '675',
    ]) {
      expect(serialized, `leaked ${leaked}`).not.toContain(leaked);
    }
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

  it('new notebooks (Unit 1 lessons 2–3 and all Unit 2 lessons) contain no literal ** markdown syntax', () => {
    for (const id of ['lesson-2', 'lesson-3']) {
      const nb = getNotebook('unit-1', id)!;
      expect(serialize(nb)).not.toContain('**');
    }
    for (const id of ['u2-lesson-1', 'u2-lesson-2', 'u2-lesson-3', 'u2-lesson-4']) {
      const nb = getNotebook('unit-2', id)!;
      expect(serialize(nb)).not.toContain('**');
    }
  });
});

const unit3Ids = [1, 2, 3, 4, 5].map((i) => `u3-lesson-${i}`);
const unit3Notebooks = unit3Ids.map((id) => getNotebook('unit-3', id)!);

describe('Unit 3 notebook source and content contracts', () => {
  it.each(unit3Notebooks.map((n) => [n.lessonId, n] as const))(
    '%s references real non-authored blocks in this lesson and keeps math out of section titles',
    (id, notebook) => {
      const lesson = findLesson(id)!.lesson;
      const sourceBlocks = lesson.steps.flatMap((step) => step.blocks).filter((block) => !block.authored);
      for (const section of notebook.sections) {
        expect(section.title).not.toMatch(/[$=\\]/);
        for (const entry of section.entries) {
          for (const source of entry.sources) {
            for (const ref of source.refs ?? []) {
              expect(lesson.sourcePages, `${id}/${entry.id}: page ${ref.page}`).toContain(ref.page);
              expect(sourceBlocks.some((b) => b.sourceRef.page === ref.page && b.sourceRef.section === ref.section),
                `${id}/${entry.id}: no book block for ${ref.page}/${ref.section}`).toBe(true);
            }
            if (source.origin === 'platform') expect(source.refs).toBeUndefined();
          }
        }
      }
      expect(serialize(notebook)).not.toContain('**');
    },
  );

  it('keeps the source discrepancies visible and distinguishes platform corrections', () => {
    for (const [index, expected] of [[0, 'verifyNote'], [1, 'verifyNote'], [2, 'verifyNote'], [3, 'verifyNote'], [4, 'verifyNote']] as const) {
      expect(serialize(unit3Notebooks[index])).toContain(expected);
      expect(serialize(unit3Notebooks[index])).toContain('المنصة');
    }
    const last = serialize(unit3Notebooks[4]);
    expect(last).toContain('سؤالَي الحساب');
    expect(last).toContain('عبارة التنبيه مستقلة');
  });

  it('retains important mathematical conditions and leaves textbook exercises unanswered', () => {
    expect(serialize(unit3Notebooks[0])).toContain('(-n)^2');
    expect(serialize(unit3Notebooks[1])).toContain('لا تقسم على صفر');
    expect(serialize(unit3Notebooks[2])).toContain('للأسس الصحيحة غير السالبة');
    expect(serialize(unit3Notebooks[3])).toContain('x>3');
    expect(serialize(unit3Notebooks[4])).toContain('مقامًا صفرًا');
    expect(serialize(unit3Notebooks[4])).toContain('السنتيمتر المربع');
    const prohibited = [
      ['A = 24', 'B = -24', '-x - 2'],
      ['-\\frac{25}{4}', '-x - 8', '-6x - 4'],
      ['23x-15', '-4x^2-3x', '2x^2-13x-4'],
      ['63x^2+551x+440', '6x^3-3x^2-30x', 'x^2+4x'],
      ['23x-15', '-4x^2-3x', '6x^2+32x+30', '340'],
    ];
    const normalize = (s: string) => s.replace(/\s/g, '');
    unit3Notebooks.forEach((nb, i) => {
      const content = normalize(serialize(nb));
      prohibited[i].forEach((answer) => expect(content, `${nb.lessonId}: ${answer}`).not.toContain(normalize(answer)));
      const exercises = nb.sections.find((section) => section.kind === 'exercises-to-copy');
      expect(exercises?.entries.length).toBeGreaterThan(0);
      expect(collectText(exercises)).not.toMatch(/الحل\s*[:：]|النتيجة\s*[:：]/);
    });
  });

  it('original worked example problems do not appear in lessons, teacher solutions or Unit 3 test banks', () => {
    const expressions = [
      '7n^2-13n+19', '(11m-8)-(4m-17)+(-2m+3)', '6q^2+7q-(2q^2-5q+9)',
      '(-7r)(3s)', '(3w-7)(2w+11)', '(2z-7)^2', '2t(t-3)(t+7)',
      '(t+17)^2=t^2+289', '5r^2+(r-13)(7r+2)',
    ];
    const normalize = (s: string) => s.replace(/[\s\\]/g, '');
    const roots = ['src/data/unit3', 'src/data/tests/unit3'];
    const files = roots.flatMap((root) => readdirSync(root).filter((name) => name.endsWith('.ts')).map((name) => join(root, name)));
    for (const expression of expressions) {
      expect(unit3Notebooks.some((nb) => normalize(serialize(nb)).includes(normalize(expression))), expression).toBe(true);
      for (const file of files) {
        expect(normalize(readFileSync(file, 'utf8')), `${file} already contains ${expression}`).not.toContain(normalize(expression));
      }
    }
    for (const nb of unit3Notebooks) {
      const examples = nb.sections.find((section) => section.kind === 'worked-examples')!;
      for (const entry of examples.entries) expect(entry.sources.every((source) => source.origin === 'platform')).toBe(true);
    }
  });

  it('checks the authored example calculations over several values', () => {
    for (const n of [-3, 0, 2, 4]) {
      expect(-(7*n*n-13*n+19)).toBe(-7*n*n+13*n-19);
      expect((11*n-8)-(4*n-17)+(-2*n+3)).toBe(5*n+12);
      expect(6*n*n+7*n-(2*n*n-5*n+9)).toBe(4*n*n+12*n-9);
      expect((-7*n)*(3*n)).toBe(-21*n*n);
      expect((3*n-7)*(2*n+11)).toBe(6*n*n+19*n-77);
      expect((2*n-7)**2).toBe(4*n*n-28*n+49);
      expect(2*n*(n-3)*(n+7)).toBeCloseTo(2*n**3+8*n*n-42*n);
    }
    expect((1+17)**2).toBe(324);
    expect(1**2+289).toBe(290);
    expect(5*13**2+(13-13)*(7*13+2)).toBe(845);
  });

  it('preserves the eight existing notebook files byte-for-byte against the approved baseline', () => {
    const hashes: Record<string, string> = {
      'unit1-lesson1.ts': '965f6c4b7249d0c4d04d9ba3c2d3e6d9289f6faa38e6a3c92355a7c8f9dc8d07',
      'unit1-lesson2.ts': '1957d68ca5d25a900ee15085872fb862abdbb3344956820a387131a18a8ff0a0',
      'unit1-lesson3.ts': '712968a4787203823cdb355812012c16f1f4e235d5b969000bd70632ce099467',
      'unit1-lesson4.ts': '43e154b854ee40f5fbad564223570f176691cb0fec0e031b8b2f196b84793933',
      'unit2-lesson1.ts': '7460337792ca18a58e9339953ff9629a2794d9003775d0130cbad3c8cede7a62',
      'unit2-lesson2.ts': '5419fb6228e2cd29d7b6f09344ed94ec8b93c4465fbc2bbcccdda52230316933',
      'unit2-lesson3.ts': '45b19e77ad1395e83c8dd63ad2f3c2fdf873728aa6b365f09e96d419fb62c8af',
      'unit2-lesson4.ts': '0ce0575c5849af4b25058a421591fd571a625fc7dc635b53aec25652e398c075',
    };
    for (const [file, expected] of Object.entries(hashes)) {
      expect(createHash('sha256').update(readFileSync(join('src/data/notebooks', file))).digest('hex'), file).toBe(expected);
    }
  });
});

const unit4Ids = [1, 2, 3].map((i) => `u4-lesson-${i}`);
const unit4Notebooks = unit4Ids.map((id) => getNotebook('unit-4', id)!);

describe('Unit 4 notebook source and content contracts', () => {
  it.each(unit4Notebooks.map((n) => [n.lessonId, n] as const))(
    '%s references real non-authored blocks in this lesson and keeps math out of section titles',
    (id, notebook) => {
      const lesson = findLesson(id)!.lesson;
      const sourceBlocks = lesson.steps.flatMap((step) => step.blocks).filter((block) => !block.authored);
      for (const section of notebook.sections) {
        expect(section.title).not.toMatch(/[$=\\]/);
        for (const entry of section.entries) {
          for (const source of entry.sources) {
            for (const ref of source.refs ?? []) {
              expect(lesson.sourcePages, `${id}/${entry.id}: page ${ref.page}`).toContain(ref.page);
              // القسم الفرعي لكل مرجع يجب أن يطابق عنوان كتلة كتابية حقيقية
              // في الدرس نفسه — لا أقسام مخترعة ولا دمجًا لأقسام مختلفة.
              expect(
                sourceBlocks.some((block) => block.sourceRef.page === ref.page && block.sourceRef.section === ref.section),
                `${id}/${entry.id}: no book block for ${ref.page}/${ref.section}`,
              ).toBe(true);
            }
            if (source.origin === 'platform') expect(source.refs).toBeUndefined();
          }
        }
      }
      expect(serialize(notebook)).not.toContain('**');
    },
  );

  it('documents the Unit 4 source discrepancies instead of silently correcting them', () => {
    expect(serialize(unit4Notebooks[0])).toContain('c \\neq 0');
    expect(serialize(unit4Notebooks[0])).toContain('بفراغٍ بين $2L$ و $l$');
    expect(serialize(unit4Notebooks[1])).toContain('نحصل على $x = \\frac{9}{2}$ لا');
    expect(serialize(unit4Notebooks[2])).toContain('اختيار المجهول');
  });

  it('leaves the textbook exercises unanswered in the Unit 4 notebooks', () => {
    for (const notebook of unit4Notebooks) {
      const exercises = notebook.sections.find((section) => section.kind === 'exercises-to-copy');
      expect(exercises?.entries.length).toBeGreaterThan(0);
      expect(collectText(exercises)).not.toMatch(/الحل\s*[:：]|النتيجة\s*[:：]/);
    }
  });
});
