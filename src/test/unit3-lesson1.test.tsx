import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { curriculum, getLessonById, getUnitById } from '../data/curriculum';
import { unit3Lesson1Data } from '../data/unit3/lesson01';
import { unit3WarmupData } from '../data/unit3/warmup';
import { unit3Lesson1TeacherSolutions } from '../data/unit3/lesson01TeacherSolutions';
import sourceAudit from '../data/unit3/lesson01.source-audit.json';
import { StepRenderer } from '../components/lesson/StepRenderer';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { OppositeTableLab } from '../components/interactive/OppositeTableLab';
import { OppositeNumberLineExplorer } from '../components/interactive/OppositeNumberLineExplorer';
import { BracketSignFlipperLab } from '../components/interactive/BracketSignFlipperLab';
import { OppositeCycleDiagramLab } from '../components/interactive/OppositeCycleDiagramLab';
import { TestRunner } from '../components/tests/TestRunner';
import { TestSolutions } from '../components/tests/TestSolutions';
import { getTestsByType, questionBank, resolveTest } from '../data/tests/registry';
import { conceptProfileForLesson, resolveConceptReference } from '../data/tests/concepts';
import { blueprintForLesson } from '../data/tests/blueprints';
import { gradeQuestion, scoreTest } from '../data/tests/scoring';
import { unit3Lesson1TestQuestions } from '../data/tests/unit3/lesson-1';
import type { QuestionAnswer } from '../data/tests/types';

const UNIT_ID = 'unit-3';
const LESSON_ID = 'u3-lesson-1';
const TEST_ID = 'u3-test-lesson-1';
const OFFICIAL_TITLE = 'نظير المجموع ونظير الفرق';

const EXPECTED_TEST_ANSWERS: Record<string, QuestionAnswer> = {
  'u3-l1-01': 'b', // -(m + 9) = -m - 9
  'u3-l1-02': false, // opposite of 6 + 5k is -6 - 5k, not -6 + 5k
  'u3-l1-03': 'c', // -(12 - y) = -12 + y
  'u3-l1-04': 'a', // -(-8 - 3n) = 8 + 3n
  'u3-l1-05': true, // a < 0 => -a > 0 (right of O)
  'u3-l1-06': String(-(8 - 13)), // 5
  'u3-l1-07': ['A', 'C'], // -4 - 7d and -7d - 4
  'u3-l1-08': 'c', // -(-11 + 6t) = 11 - 6t
  'u3-l1-09': 'c', // right of O between O and -a
  'u3-l1-10': 'b', // -5x^2 + 8x - 3
  'u3-l1-11': String(-2 - 5 - -11), // 4
  'u3-l1-12': String(-(-18)), // 18
  'u3-l1-13': 'a', // forgot to flip -9x -> +9x
  'u3-l1-14': 'b', // (7x - 4) - (2x - 9) = 5x + 5
  'u3-l1-15': ['A', 'C'], // -(-3a^2+6a-10) and 3a^2-6a+10
  'u3-l1-16': String(-(-(4 - 9) - 12)), // 7
  'u3-l1-17': 'b', // 10 - 3x - 4 + x - 2 = -2x + 4
  'u3-l1-18': 'c', // b > 0 and b farther from O than a
  'u3-l1-19': 'b', // symbolic proof confirms Q = -P for all integers
  'u3-l1-20': ['b', 'd', 'a', 'c'], // x-3, -x+3, -x-5, x+5
};

describe('Unit 3, Lesson 1 — identity, warm-up integration, and curriculum safety', () => {
  it('registers Unit 3 and Lesson 1 under the official title «نظير المجموع ونظير الفرق» (never «انطلاقة نشطة»)', () => {
    const unit = getUnitById(UNIT_ID);
    expect(unit).toBeDefined();
    expect(unit!.number).toBe(3);
    expect(unit!.title).toBe('الحساب بالرموز');
    // توسيع تكاملي: أضفت الدرس الثاني (حذف الأقواس — ص50–51) إلى الوحدة،
    // فامتدت صفحات المصدر من [46–49] إلى [46–51]. دروس الوحدة السابقة غير متأثرة.
    expect(unit!.sourcePages).toEqual([46, 47, 48, 49, 50, 51]);

    const lesson = getLessonById(UNIT_ID, LESSON_ID);
    expect(lesson).toBe(unit3Lesson1Data);
    expect(lesson!.number).toBe(1);
    expect(lesson!.title).toBe(OFFICIAL_TITLE);
    expect(lesson!.title).not.toContain('انطلاقة نشطة');
    expect(lesson!.sourcePages).toEqual([46, 47, 48, 49]);

    expect(unit!.warmup).toBe(unit3WarmupData);
    expect(unit!.warmup.title).toContain('انطلاقة نشطة');
    expect(unit!.warmup.sourcePages).toEqual([46]);
  });

  it('preserves Unit 1, Unit 2, and does NOT activate any Unit 3 comprehensive unit test', () => {
    expect(curriculum.map((u) => u.id)).toEqual(['unit-1', 'unit-2', 'unit-3']);
    expect(curriculum[0].lessons.map((l) => l.id)).toEqual([
      'lesson-1',
      'lesson-2',
      'lesson-3',
      'lesson-4',
    ]);
    expect(curriculum[1].lessons.map((l) => l.id)).toEqual([
      'u2-lesson-1',
      'u2-lesson-2',
      'u2-lesson-3',
      'u2-lesson-4',
      'u2-lesson-5',
    ]);
    expect(getTestsByType('unit').map((t) => t.unitId)).toEqual(['unit-1', 'unit-2']);
    expect(getTestsByType('unit').some((t) => t.unitId === 'unit-3')).toBe(false);
  });

  it('leads from the 9 ordered «انطلاقة نشطة» items (Steps 1–2, p.46) into main lesson theory (Steps 3–14, pp.47–49)', () => {
    expect(unit3Lesson1Data.steps).toHaveLength(14);
    expect(unit3Lesson1Data.steps[0].sourcePages).toEqual([46]);
    expect(unit3Lesson1Data.steps[1].sourcePages).toEqual([46]);
    expect(unit3Lesson1Data.steps[0].title).toContain('انطلاقة نشطة');
    expect(unit3Lesson1Data.steps[1].title).toContain('انطلاقة نشطة');

    const warmupMcqs = unit3Lesson1Data.steps
      .slice(0, 2)
      .flatMap((s) => s.blocks)
      .filter((b) => b.type === 'mcq');
    expect(warmupMcqs.map((b) => b.id)).toEqual([
      'p46-item-1',
      'p46-item-2',
      'p46-item-3',
      'p46-item-4',
      'p46-item-5',
      'p46-item-6',
      'p46-item-7',
      'p46-item-8',
      'p46-item-9',
    ]);

    for (const step of unit3Lesson1Data.steps.slice(2)) {
      expect(step.sourcePages.every((p) => p >= 47 && p <= 49)).toBe(true);
    }
  });
});

describe('Unit 3, Lesson 1 — source fidelity, audit notes, and teacher solutions', () => {
  it('maps every audited textbook block sequence (27 blocks across pp.46–49) in exact order to non-authored blocks', () => {
    const nonAuthoredBlocks = unit3Lesson1Data.steps
      .flatMap((s) => s.blocks)
      .filter((b) => !b.authored);
    expect(nonAuthoredBlocks.map((b) => b.id)).toEqual(sourceAudit.bookBlockSequence);
    expect(sourceAudit.unresolvedAmbiguities).toEqual([]);

    const allBlocks = unit3Lesson1Data.steps.flatMap((s) => s.blocks);
    const blockById = new Map(allBlocks.map((b) => [b.id, b]));
    for (const sol of unit3Lesson1TeacherSolutions) {
      const block = blockById.get(sol.blockId);
      expect(block, `Missing block ${sol.blockId} referenced by ${sol.id}`).toBeDefined();
      if (!sol.id.startsWith('s-plat-') && sol.subIndex !== undefined) {
        expect(block!.subItems?.[sol.subIndex], `Missing subItem ${sol.blockId}[${sol.subIndex}]`).toBeDefined();
      }
    }
  });

  it('presents the true mathematical solution (A = 2, B = -2) for Example 2 (a=4, b=7, c=-5) and warns about the printed conflict without displaying the erroneous solution as fact', () => {
    const allBlocks = unit3Lesson1Data.steps.flatMap((s) => s.blocks);
    const ex2 = allBlocks.find((b) => b.id === 'p48-example-2')!;
    expect(ex2.authored).toBeFalsy();
    expect(ex2.title).toContain('a = 4');
    expect(ex2.title).toContain('b = 7');
    expect(ex2.title).toContain('c = -5');
    expect(ex2.mathFormula).toBeUndefined();
    expect(ex2.verifyNote).toContain('c = -5');

    const correctBlock = allBlocks.find((b) => b.id === 'p48-example-2-correct-solution')!;
    expect(correctBlock.authored).toBe(true);
    expect(correctBlock.mathFormula).toContain('A &= 4 - 7 - (-5) = -3 + 5 = 2');
    expect(correctBlock.mathFormula).toContain('B &= -4 + 7 + (-5) = 3 - 5 = -2');

    const auditBlock = allBlocks.find((b) => b.id === 'p48-example-2-audit-note')!;
    expect(auditBlock.authored).toBe(true);
    expect(auditBlock.title).toContain('تعارض الحل المطبوع');
    expect(auditBlock.content).toContain('تتعارضان مع المعطى');

    const ex2TeacherSol = unit3Lesson1TeacherSolutions.find((s) => s.id === 's48-ex2')!;
    expect(ex2TeacherSol.answerOrigin).toBe('مُشتقة من المنصة');
    expect(ex2TeacherSol.finalAnswer).toContain('A = 2');
    expect(ex2TeacherSol.finalAnswer).toContain('B = -2');

    const drill3 = allBlocks.find((b) => b.id === 'p49-drill-3')!;
    expect(drill3.title).toContain('بوضع العبارة المناسب');
  });

  it('ships complete teacher solutions (47 textbook + 4 platform-labeled) with origin tags, principles, and checks', () => {
    expect(unit3Lesson1TeacherSolutions).toHaveLength(51);
    const textbookSols = unit3Lesson1TeacherSolutions.filter((s) => !s.id.startsWith('s-plat-'));
    const platformSols = unit3Lesson1TeacherSolutions.filter((s) => s.id.startsWith('s-plat-'));
    expect(textbookSols).toHaveLength(47);
    expect(platformSols).toHaveLength(4);

    for (const sol of unit3Lesson1TeacherSolutions) {
      expect(['الكتاب', 'مُشتقة من المنصة']).toContain(sol.answerOrigin);
      expect(sol.steps.length).toBeGreaterThanOrEqual(2);
      expect(sol.principle.length).toBeGreaterThan(5);
      expect((sol.check ?? '').length).toBeGreaterThan(5);
    }
    for (const sol of platformSols) {
      expect(sol.group).toContain('المنصة');
      expect(sol.answerOrigin).toBe('مُشتقة من المنصة');
    }
  });
});

describe('Unit 3, Lesson 1 — step rendering, interactive widgets, and Teacher Area', () => {
  it('renders all 14 steps with zero KaTeX parse errors', () => {
    unit3Lesson1Data.steps.forEach((step, idx) => {
      const { container, unmount } = render(
        <StepRenderer
          step={step}
          stepIndex={idx}
          totalSteps={unit3Lesson1Data.steps.length}
        />,
      );
      expect(container.querySelectorAll('.katex-error'), step.id).toHaveLength(0);
      unmount();
    });
  });

  it('operates OppositeTableLab, OppositeNumberLineExplorer, BracketSignFlipperLab, and OppositeCycleDiagramLab interactively', () => {
    // 1. OppositeTableLab
    const tableRender = render(<OppositeTableLab />);
    const firstInput = tableRender.container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(firstInput).toBeTruthy();
    fireEvent.change(firstInput, { target: { value: '3' } });
    fireEvent.click(screen.getByText('تحقّق من الجدول'));
    expect(tableRender.container.querySelector('[role="status"]')).toBeTruthy();
    fireEvent.click(screen.getByText('إظهار الحل'));
    expect(screen.getByText('إخفاء الحل')).toBeInTheDocument();
    fireEvent.click(screen.getByText('إعادة'));
    expect(firstInput.value).toBe('');
    expect(tableRender.container.querySelectorAll('.katex-error')).toHaveLength(0);
    tableRender.unmount();

    // 2. OppositeNumberLineExplorer
    const nlRender = render(<OppositeNumberLineExplorer />);
    const caseTabs = nlRender.container.querySelectorAll('.u3-case-tabs button');
    expect(caseTabs.length).toBe(4);
    fireEvent.click(caseTabs[1]); // Case ② (a < 0, b < 0)
    const stageChips = nlRender.container.querySelectorAll('.u3-stage-chip');
    expect(stageChips.length).toBe(3);
    fireEvent.click(stageChips[2]);
    expect(nlRender.container.querySelector('svg')).toBeTruthy();
    expect(nlRender.container.querySelectorAll('.katex-error')).toHaveLength(0);
    nlRender.unmount();

    // 3. BracketSignFlipperLab
    const flipRender = render(<BracketSignFlipperLab />);
    // Default case -(x + 2): pick '-' on both terms
    const term1Group = flipRender.container.querySelector('[aria-label="إشارة الحد 1 بعد حذف القوس"]')!;
    const term2Group = flipRender.container.querySelector('[aria-label="إشارة الحد 2 بعد حذف القوس"]')!;
    fireEvent.click(term1Group.querySelectorAll('button')[1]); // '−'
    fireEvent.click(term2Group.querySelectorAll('button')[1]); // '−'
    fireEvent.click(screen.getByText('تحقّق من الإشارات'));
    expect(flipRender.container.querySelector('.u3-lab-feedback.is-ok')).toBeTruthy();
    expect(flipRender.container.querySelectorAll('.katex-error')).toHaveLength(0);
    flipRender.unmount();

    // 4. OppositeCycleDiagramLab
    const cycleRender = render(<OppositeCycleDiagramLab />);
    fireEvent.click(screen.getByText('إظهار الحل'));
    expect(screen.getByText('إخفاء الحل')).toBeInTheDocument();
    const xSlider = cycleRender.container.querySelector('input[type="range"]') as HTMLInputElement;
    fireEvent.change(xSlider, { target: { value: '12' } });
    expect(xSlider.value).toBe('12');
    expect(cycleRender.container.querySelectorAll('.katex-error')).toHaveLength(0);
    cycleRender.unmount();
  });

  it('unlocks TeacherArea and displays the «نظير المجموع ونظير الفرق» tab with all 51 solutions and source notes', () => {
    sessionStorage.clear();
    const { container } = render(<TeacherArea onNavigateHome={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/كلمة المرور/), { target: { value: 'somer173' } });
    fireEvent.submit(container.querySelector('form')!);

    const tabs = screen.getAllByRole('button', { name: new RegExp(OFFICIAL_TITLE) });
    expect(tabs.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(tabs[0]);

    expect(container.querySelectorAll('.ta-solution')).toHaveLength(51);
    expect(container.querySelectorAll('.ta-source-notes li').length).toBeGreaterThanOrEqual(3);
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
  });
});

describe('Unit 3, Lesson 1 — independent 20-question lesson test (`u3-test-lesson-1`)', () => {
  it('satisfies the 20-question, 6/7/4/3 difficulty, >=4 types, and 7-concept blueprint with 20/20 exact grading', () => {
    const resolved = resolveTest(TEST_ID);
    expect(resolved).toBeDefined();
    expect(resolved!.title).toBe('اختبار الدرس الأول: نظير المجموع ونظير الفرق');
    expect(resolved!.questionCount).toBe(20);
    expect(unit3Lesson1TestQuestions).toHaveLength(20);

    const profile = conceptProfileForLesson(LESSON_ID);
    const blueprint = blueprintForLesson(LESSON_ID);
    expect(profile).toBeDefined();
    expect(blueprint).toBeDefined();
    expect(profile!.concepts).toHaveLength(7);

    const diffCounts = { basic: 0, intermediate: 0, advanced: 0, reasoning: 0 };
    const distinctTypes = new Set<string>();
    const coveredConcepts = new Set<string>();

    for (const question of resolved!.questions) {
      diffCounts[question.difficulty] += 1;
      distinctTypes.add(question.type);
      const concept = resolveConceptReference(LESSON_ID, question.curriculumRefs[0].conceptId);
      expect(concept, question.id).toBeDefined();
      coveredConcepts.add(concept!.id);

      const expected = EXPECTED_TEST_ANSWERS[question.id];
      expect(expected, `Missing ground-truth answer for ${question.id}`).toBeDefined();
      expect(gradeQuestion(question, expected), `Question ${question.id} failed grading`).toBe(true);
      expect(questionBank.filter((q) => q.id === question.id)).toHaveLength(1);
    }

    const fullScore = scoreTest(resolved!.questions, EXPECTED_TEST_ANSWERS);
    expect(fullScore.earnedPoints).toBe(20);
    expect(fullScore.totalPoints).toBe(20);
    expect(fullScore.percentage).toBe(100);

    expect(diffCounts).toEqual({ basic: 6, intermediate: 7, advanced: 4, reasoning: 3 });
    expect(distinctTypes.size).toBeGreaterThanOrEqual(4);
    expect(coveredConcepts.size).toBe(7);
  });

  it('withholds correctness before submission, scores accurately on submit, and resets cleanly on retry', () => {
    const resolved = resolveTest(TEST_ID)!;
    const { container } = render(
      <TestRunner test={resolved} onReturnToTests={() => {}} onOpenSolutions={() => {}} />,
    );

    // Answer Q1 (single-choice, option 2 '-m - 9') — must NOT reveal correctness yet
    const optionButtons = container.querySelectorAll('.test-option');
    expect(optionButtons.length).toBe(4);
    fireEvent.click(optionButtons[1]);

    expect(container.querySelectorAll('.is-correct, .is-wrong, .test-review-card')).toHaveLength(0);
    expect(container.querySelector('.test-progress-copy')?.textContent).toContain('إجابات محفوظة: 1');

    // Submit test
    fireEvent.click(screen.getByRole('button', { name: /تسليم الاختبار/ }));

    // Results view renders score 1 / 20 with zero KaTeX errors
    expect(screen.getByText('أحسنت على إكمال الاختبار')).toBeInTheDocument();
    expect(screen.getByLabelText('1 من 20')).toBeInTheDocument();
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);

    // Retry resets cleanly with zero leaked answers
    fireEvent.click(screen.getByRole('button', { name: /إعادة الاختبار/ }));
    expect(container.querySelector('.test-progress-copy')?.textContent).toContain('إجابات محفوظة: 0');
    expect(container.querySelectorAll('.test-option.is-selected')).toHaveLength(0);
  });

  it('renders all 20 worked solutions in TestSolutions across 4 pages with zero KaTeX errors', () => {
    window.sessionStorage.clear();
    const resolved = resolveTest(TEST_ID)!;
    const { container } = render(
      <TestSolutions test={resolved} onReturnToSolutions={() => {}} onReturnToTests={() => {}} />,
    );

    let totalCardsSeen = container.querySelectorAll('.test-solution-card').length;
    expect(totalCardsSeen).toBe(5);
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);

    for (let page = 2; page <= 4; page += 1) {
      fireEvent.click(screen.getByRole('button', { name: /الأسئلة التالية/ }));
      expect(container.querySelectorAll('.katex-error'), `page ${page}`).toHaveLength(0);
      totalCardsSeen += container.querySelectorAll('.test-solution-card').length;
    }
    expect(totalCardsSeen).toBe(20);
  });
});
