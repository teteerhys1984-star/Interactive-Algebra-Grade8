import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { getLessonById, getUnitById } from '../data/curriculum';
import { unit4Lesson3Data } from '../data/unit4/lesson03';
import { unit4Lesson3TeacherSolutions } from '../data/unit4/lesson03TeacherSolutions';
import sourceAudit from '../data/unit4/lesson03.source-audit.json';
import { StepRenderer } from '../components/lesson/StepRenderer';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { resolveTest } from '../data/tests/registry';
import { conceptProfileForLesson } from '../data/tests/concepts';
import { blueprintForLesson } from '../data/tests/blueprints';
import { gradeQuestion, scoreTest } from '../data/tests/scoring';
import { unit4Lesson3TestQuestions } from '../data/tests/unit4/lesson-3';
import type { QuestionAnswer } from '../data/tests/types';

const LESSON_ID = 'u4-lesson-3';
const TEST_ID = 'u4-test-lesson-3';
const OFFICIAL_TITLE = 'اصطناع معادلة';

const EXPECTED_TEST_ANSWERS: Record<string, QuestionAnswer> = {
  'u4-l3-01': 'a',
  'u4-l3-02': 'a',
  'u4-l3-03': true,
  'u4-l3-04': '16',
  'u4-l3-05': 'b',
  'u4-l3-06': '9',
  'u4-l3-07': ['c', 'd', 'a', 'b'],
  'u4-l3-08': ['A', 'B'],
  'u4-l3-09': '12',
  'u4-l3-10': 'a',
  'u4-l3-11': 'a',
  'u4-l3-12': '22',
  'u4-l3-13': 'a',
  'u4-l3-14': '16',
  'u4-l3-15': 'a',
  'u4-l3-16': ['A', 'B', 'D'],
  'u4-l3-17': 'a',
  'u4-l3-18': 'a',
  'u4-l3-19': false,
  'u4-l3-20': 'b',
};

describe('Unit 4, Lesson 3 — identity and source fidelity', () => {
  it('registers «اصطناع معادلة» as lesson 3 over pages 75–77 and closes the unit', () => {
    const unit = getUnitById('unit-4')!;
    expect(unit.lessons.map((lesson) => lesson.id)).toEqual(['u4-lesson-1', 'u4-lesson-2', 'u4-lesson-3']);

    const lesson = getLessonById('unit-4', LESSON_ID)!;
    expect(lesson).toBe(unit4Lesson3Data);
    expect(lesson.number).toBe(3);
    expect(lesson.title).toBe(OFFICIAL_TITLE);
    expect(lesson.unitTitle).toBe('الوحدة الرابعة: معادلات من الدرجة الأولى');
    expect(lesson.sourcePages).toEqual([75, 76, 77]);
    expect(unit4Lesson3Data.steps).toHaveLength(7);
    for (const step of unit4Lesson3Data.steps) {
      expect(step.sourcePages.every((page) => page >= 75 && page <= 77), step.id).toBe(true);
    }
  });

  it('maps the audited block sequence in exact order with no unresolved ambiguity', () => {
    const nonAuthored = unit4Lesson3Data.steps
      .flatMap((step) => step.blocks)
      .filter((block) => !block.authored);
    expect(nonAuthored.map((block) => block.id)).toEqual(sourceAudit.bookBlockSequence);
    expect(sourceAudit.unresolvedAmbiguities).toEqual([]);
    expect(sourceAudit.sourceFiles.map((file) => file.page)).toEqual([75, 76, 77]);
  });

  it('keeps the full worked example (choose unknown → table → equation → check → answer) on p.76', () => {
    const blocks = unit4Lesson3Data.steps.flatMap((step) => step.blocks);
    const worked = blocks.filter((block) => block.sourceRef.page === 76 && !block.authored);
    expect(worked.length).toBeGreaterThanOrEqual(5);
    const ids = worked.map((block) => block.id);
    expect(ids).toEqual(expect.arrayContaining([
      'p76-choose-unknown',
      'p76-table',
      'p76-solve',
      'p76-verify',
      'p76-result',
    ]));
    const joined = worked
      .map((block) => [block.title, block.content, block.mathFormula ?? ''].join(' '))
      .join(' ');
    expect(joined).toContain('x+3');
    expect(joined).toContain('x-4');
    expect(joined).toContain('2(x-4)');
    expect(joined).toContain('11');
  });

  it('renders the p.76 data table as HTML with Arabic headers and no Arabic character-metric warnings', () => {
    const step = unit4Lesson3Data.steps.find((entry) =>
      entry.blocks.some((block) => block.id === 'p76-table'),
    )!;
    const index = unit4Lesson3Data.steps.indexOf(step);

    // الجدول انتقل من بيئة array في KaTeX إلى HTML، فلا تحذيرات مقاييس عربية.
    const warnings: string[] = [];
    const spy = vi.spyOn(console, 'warn').mockImplementation((message?: unknown) => {
      warnings.push(String(message));
    });
    const { container, unmount } = render(
      <StepRenderer step={step} stepIndex={index} totalSteps={unit4Lesson3Data.steps.length} />,
    );
    spy.mockRestore();

    expect(warnings.filter((message) => message.includes('No character metrics'))).toEqual([]);

    // رؤوس الأعمدة والصفوف بالعربية، والقيم الرياضية داخل خلايا الجدول.
    const table = container.querySelector('table.u4-party-table');
    expect(table).toBeTruthy();
    const headers = [...table!.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
    expect(headers).toEqual(['', 'الفتيان', 'الفتيات']);

    // KaTeX يكرّر النصّ مرّتين (MathML + HTML)، فنقرأ مصدر TeX من وسم annotation.
    const rows = [...table!.querySelectorAll('tbody tr')].map((row) => ({
      label: row.querySelector('th')?.textContent?.trim(),
      cells: [...row.querySelectorAll('td')].map(
        (cell) => cell.querySelector('annotation')?.textContent?.trim() ?? '',
      ),
    }));
    expect(rows).toEqual([
      { label: 'في بداية الحفلة', cells: ['x', 'x+3'] },
      { label: 'في نهاية الحفلة', cells: ['x-4', '2(x-4)'] },
    ]);
    // الخلايا الرياضية تُعرض بـ KaTeX (MathText) لا كنصّ خام.
    expect(table!.querySelectorAll('tbody td .katex').length).toBe(4);

    // ولا يبقى للكتلة أيّ صيغة array عربية.
    const block = step.blocks.find((entry) => entry.id === 'p76-table')!;
    expect(block.mathFormula).toBeUndefined();
    expect(block.interactiveType).toBe('u4-party-table');
    unmount();
  });

  it('ships teacher solutions that all resolve to real blocks', () => {
    expect(unit4Lesson3TeacherSolutions).toHaveLength(26);
    const blockIds = new Set(unit4Lesson3Data.steps.flatMap((step) => step.blocks).map((block) => block.id));
    for (const solution of unit4Lesson3TeacherSolutions) {
      expect(['الكتاب', 'مُشتقة من المنصة']).toContain(solution.answerOrigin);
      expect(solution.steps.length).toBeGreaterThanOrEqual(2);
      expect(solution.principle.length).toBeGreaterThan(5);
      expect(blockIds.has(solution.blockId), solution.blockId).toBe(true);
    }
  });
});

describe('Unit 4, Lesson 3 — rendering', () => {
  it('renders all 7 steps with zero KaTeX parse errors', () => {
    unit4Lesson3Data.steps.forEach((step, index) => {
      const { container, unmount } = render(
        <StepRenderer step={step} stepIndex={index} totalSteps={unit4Lesson3Data.steps.length} />,
      );
      expect(container.querySelectorAll('.katex-error'), step.id).toHaveLength(0);
      unmount();
    });
  });

  it('opens in the Teacher Area with its solutions', () => {
    sessionStorage.clear();
    const { container } = render(<TeacherArea onNavigateHome={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/كلمة المرور/), { target: { value: 'somer173' } });
    fireEvent.submit(container.querySelector('form')!);
    const tabs = screen.getAllByRole('button', { name: new RegExp(OFFICIAL_TITLE) });
    fireEvent.click(tabs[0]);
    expect(container.querySelectorAll('.ta-solution').length).toBe(unit4Lesson3TeacherSolutions.length);
  });
});

describe('Unit 4, Lesson 3 — independent 20-question lesson test (`u4-test-lesson-3`)', () => {
  it('satisfies the blueprint and grades all 20 correct answers exactly', () => {
    const resolved = resolveTest(TEST_ID);
    expect(resolved).toBeDefined();
    expect(resolved!.title).toBe('اختبار الدرس الثالث: اصطناع معادلة');
    expect(resolved!.questionCount).toBe(20);
    expect(unit4Lesson3TestQuestions).toHaveLength(20);
    expect(conceptProfileForLesson(LESSON_ID)!.concepts).toHaveLength(6);
    expect(blueprintForLesson(LESSON_ID)).toBeDefined();

    const difficultyCounts = { basic: 0, intermediate: 0, advanced: 0, reasoning: 0 };
    const types = new Set<string>();
    for (const question of resolved!.questions) {
      difficultyCounts[question.difficulty] += 1;
      types.add(question.type);
      expect(gradeQuestion(question, EXPECTED_TEST_ANSWERS[question.id]), question.id).toBe(true);
    }
    expect(difficultyCounts).toEqual({ basic: 6, intermediate: 7, advanced: 4, reasoning: 3 });
    expect(types.size).toBeGreaterThanOrEqual(4);
    expect(scoreTest(resolved!.questions, EXPECTED_TEST_ANSWERS).percentage).toBe(100);
  });

  it('rejects a numeric answer without the accepted value and a reordered sequence', () => {
    const resolved = resolveTest(TEST_ID)!;
    const wrong = { ...EXPECTED_TEST_ANSWERS, 'u4-l3-12': '23', 'u4-l3-07': ['c', 'a', 'd', 'b'] };
    expect(scoreTest(resolved.questions, wrong).correctCount).toBe(18);
  });
});
