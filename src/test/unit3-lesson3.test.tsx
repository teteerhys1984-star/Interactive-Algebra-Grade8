import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { getLessonById, getUnitById } from '../data/curriculum';
import { unit3Lesson3Data } from '../data/unit3/lesson03';
import { unit3Lesson3TeacherSolutions } from '../data/unit3/lesson03TeacherSolutions';
import sourceAudit from '../data/unit3/lesson03.source-audit.json';
import { StepRenderer } from '../components/lesson/StepRenderer';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { TestRunner } from '../components/tests/TestRunner';
import { TestSolutions } from '../components/tests/TestSolutions';
import { getTestsByType, questionBank, resolveTest } from '../data/tests/registry';
import { conceptProfileForLesson, resolveConceptReference } from '../data/tests/concepts';
import { blueprintForLesson } from '../data/tests/blueprints';
import { gradeQuestion, scoreTest } from '../data/tests/scoring';
import { unit3Lesson3TestQuestions } from '../data/tests/unit3/lesson-3';
import type { QuestionAnswer } from '../data/tests/types';

const UNIT_ID = 'unit-3';
const LESSON_ID = 'u3-lesson-3';
const TEST_ID = 'u3-test-lesson-3';
const OFFICIAL_TITLE = 'اختزال عبارة رمزية';

/**
 * المفاتيح المستقلة (محسوبة يدويًا قبل بناء الأسئلة — لا تُشتق من الحل):
 *  1) 8(x−y)+2x لسطح 10×x نُزع منه 8×y       2) 6x+4−2x+3 = 4x+7
 *  3) 4a×(−3b) = −12ab                        4) 5y×(−2) عند y=3 = −30
 *  5) 3(2m+5) = 6m+15                         6) 2x²+3x مختزلة (غير متشابهين) → صحيح
 *  7) 9x²−4x+2−5x²−7x = 4x²−11x+2            8) −4x²−3x عند x=−2 = −16+6 = −10
 *  9) (x²−6x)−(−3x²+2x−5) = 4x²−8x+5        10) 3(x+4)−2(x−1) = x+14 (لا x+10)
 * 11) 8x−5 عند x=3/4 = 6−5 = 1              12) أ و ب و ج صحيحة، د خطأ (7t² لا 7t)
 * 13) (5+n)−(2n−3) = 8−n → صحيح             14) 10(12)−8(4) = 88
 * 15) [3/4 a²+2/3 a−4]−[1/2 a²+1/3 a+3] = 1/4 a²+1/3 a−7
 * 16) 5(2n−3)−2(n−7) = 8n−1 عند n=4 → 31
 * 17) 4(2x−1)−3(x+2): الأصل → 8x−4−3x−6 → (8x−3x)+(−4−6) → 5x−10
 * 18) (2k−4)−(2k+4) = −8 (لا 0)
 * 19) 5x+3−2x+4→3x+7 ؛ 5x²+3x²−2x²→6x² ؛ 5x−(3x−4)→2x+4 ؛ 3(2x+1)−x→5x+3
 * 20) 2x²×4x×x = 8x⁴
 */
const EXPECTED_TEST_ANSWERS: Record<string, QuestionAnswer> = {
  'u3-l3-01': 'a',
  'u3-l3-02': 'a',
  'u3-l3-03': 'a',
  'u3-l3-04': '-30',
  'u3-l3-05': 'a',
  'u3-l3-06': true,
  'u3-l3-07': 'a',
  'u3-l3-08': '-10',
  'u3-l3-09': 'a',
  'u3-l3-10': 'a',
  'u3-l3-11': '1',
  'u3-l3-12': ['a', 'b', 'c'],
  'u3-l3-13': true,
  'u3-l3-14': 'a',
  'u3-l3-15': 'a',
  'u3-l3-16': '31',
  'u3-l3-17': ['b', 'a', 'd', 'c'],
  'u3-l3-18': 'a',
  'u3-l3-19': { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
  'u3-l3-20': 'a',
};

describe('Unit 3, Lesson 3 — identity, source fidelity, and curriculum safety', () => {
  it('registers Lesson 3 under the official title «اختزال عبارة رمزية» on pages 52–53', () => {
    const unit = getUnitById(UNIT_ID);
    expect(unit).toBeDefined();
    expect(unit!.number).toBe(3);
    expect(unit!.title).toBe('الحساب بالرموز');
    expect(unit!.lessons.map((l) => l.id)).toEqual(['u3-lesson-1', 'u3-lesson-2', 'u3-lesson-3']);

    const lesson = getLessonById(UNIT_ID, LESSON_ID);
    expect(lesson).toBe(unit3Lesson3Data);
    expect(lesson!.number).toBe(3);
    expect(lesson!.title).toBe(OFFICIAL_TITLE);
    expect(lesson!.title).not.toContain('انطلاقة نشطة');
    expect(lesson!.sourcePages).toEqual([52, 53]);
    expect(lesson!.teacherArea).toBeDefined();
  });

  it('keeps the Unit 3 comprehensive unit test disabled (no unit-3 unit test exists)', () => {
    expect(getTestsByType('unit').some((t) => t.unitId === 'unit-3')).toBe(false);
  });

  it('maps the 16 audited textbook blocks (pp.52–53) in exact book order to non-authored blocks', () => {
    expect(sourceAudit.lessonId).toBe(LESSON_ID);
    expect(sourceAudit.sourcePages).toEqual([52, 53]);
    expect(sourceAudit.unresolvedAmbiguities).toEqual([]);

    const nonAuthoredBlocks = unit3Lesson3Data.steps
      .flatMap((s) => s.blocks)
      .filter((b) => !b.authored);
    expect(nonAuthoredBlocks.map((b) => b.id)).toEqual(sourceAudit.bookBlockSequence);

    const allBlocks = unit3Lesson3Data.steps.flatMap((s) => s.blocks);
    const blockById = new Map(allBlocks.map((b) => [b.id, b]));
    for (const sol of unit3Lesson3TeacherSolutions) {
      const block = blockById.get(sol.blockId);
      expect(block, `Missing block ${sol.blockId} referenced by ${sol.id}`).toBeDefined();
      if (sol.subIndex !== undefined) {
        expect(block!.subItems?.[sol.subIndex], `Missing subItem ${sol.blockId}[${sol.subIndex}]`).toBeDefined();
      }
    }
  });

  it('preserves the printed third line of the worked example verbatim, documents the typo, and corrects it', () => {
    const allBlocks = unit3Lesson3Data.steps.flatMap((s) => s.blocks);
    const example = allBlocks.find((b) => b.id === 'p52-example-1')!;
    const thirdLine = example.subItems![2];
    // النص المطبوع في الكتاب حُفظ حرفيًا:
    expect(thirdLine.math).toBe('= 2x^2(-2)x + 1 = 2x^2 - 2x + 1');
    expect(thirdLine.verifyNote).toContain('2x^2(-2)x + 1');
    expect(thirdLine.verifyNote).toContain('2x^2 + (-2)x + 1');

    // التصويب موسوم بـ«شرح المنصة» في الكتلة المباشرة بعده:
    const correction = allBlocks.find((b) => b.id === 'p52-example-1-typo')!;
    expect(correction.authored).toBe(true);
    expect(correction.mathFormula).toContain('2x^2 + (-2)x + 1');

    // حلول المعلّم تحمل المصدر نفسه:
    const sol = unit3Lesson3TeacherSolutions.find((s) => s.id === 's52-ex-line3')!;
    expect(sol.sourceNote).toContain('خطأ مطبعي');
    expect(sol.finalAnswer).toContain('2x^2 + (-2)x + 1');
  });

  it('documents the four printed activity expressions and their verified equivalence', () => {
    const options = unit3Lesson3Data.steps
      .flatMap((s) => s.blocks)
      .find((b) => b.id === 'p52-options')!;
    expect(options.subItems!.map((item) => item.math)).toEqual([
      '8(x - y) + 2x',
      '10x - 8y',
      '2(x + y) + 8x',
      '10(x - y) + 2y',
    ]);
    // ① و ④ قراءتان من الشكل، و② ناتج اختزالهما، و③ وحدها خطأ (10x + 2y).
    expect(sourceAudit.sourceNotes.some((note) => note.blockId === 'p52-options')).toBe(true);
    const verdict = unit3Lesson3Data.steps
      .flatMap((s) => s.blocks)
      .find((b) => b.id === 'p52-options-verdict')!;
    expect(verdict.authored).toBe(true);
    expect(verdict.content).toContain('234');
  });

  it('never leaks Markdown emphasis markers into student-facing lesson text', () => {
    const strings: string[] = [];
    const walk = (value: unknown): void => {
      if (typeof value === 'string') strings.push(value);
      else if (value && typeof value === 'object') Object.values(value as Record<string, unknown>).forEach(walk);
    };
    walk(unit3Lesson3Data.steps);
    expect(strings.filter((text) => text.includes('**'))).toEqual([]);
  });

  it('ships complete teacher solutions (50 textbook + 5 platform-labelled) covering every textbook item', () => {
    const textbookBlocks = unit3Lesson3Data.steps
      .flatMap((s) => s.blocks)
      .filter((b) => !b.authored && b.id !== 'p52-activity-header');

    const coveredBySubIndex = new Set(
      unit3Lesson3TeacherSolutions
        .filter((sol) => sol.subIndex !== undefined)
        .map((sol) => `${sol.blockId}#${sol.subIndex}`),
    );
    const coveredWholeBlocks = new Set(
      unit3Lesson3TeacherSolutions
        .filter((sol) => sol.subIndex === undefined)
        .map((sol) => sol.blockId),
    );

    for (const block of textbookBlocks) {
      if (block.subItems && block.subItems.length > 0) {
        block.subItems.forEach((_, index) => {
          expect(coveredBySubIndex.has(`${block.id}#${index}`), `No solution for ${block.id}[${index}]`).toBe(true);
        });
      } else {
        expect(coveredWholeBlocks.has(block.id), `No solution for ${block.id}`).toBe(true);
      }
    }

    expect(unit3Lesson3TeacherSolutions).toHaveLength(55);
    const textbookSols = unit3Lesson3TeacherSolutions.filter((s) => !s.id.startsWith('s-plat-'));
    const platformSols = unit3Lesson3TeacherSolutions.filter((s) => s.id.startsWith('s-plat-'));
    expect(textbookSols).toHaveLength(50);
    expect(platformSols).toHaveLength(5);

    for (const sol of unit3Lesson3TeacherSolutions) {
      expect(['الكتاب', 'مُشتقة من المنصة']).toContain(sol.answerOrigin);
      expect(sol.steps.length, `${sol.id} needs at least two steps`).toBeGreaterThanOrEqual(2);
      expect(sol.principle.length).toBeGreaterThan(5);
      expect((sol.check ?? '').length).toBeGreaterThan(5);
      expect(sol.problem.trim().length).toBeGreaterThan(5);
      expect(sol.finalAnswer.trim().length).toBeGreaterThan(0);
    }
    for (const sol of platformSols) {
      expect(sol.group).toContain('المنصة');
      expect(sol.answerOrigin).toBe('مُشتقة من المنصة');
    }
  });
});

describe('Unit 3, Lesson 3 — step rendering, interactive widgets, and Teacher Area', () => {
  it('renders all 9 steps with zero KaTeX parse errors and no raw LaTeX, $, or Markdown leaks', () => {
    unit3Lesson3Data.steps.forEach((step, idx) => {
      const { container, unmount } = render(
        <StepRenderer
          step={step}
          stepIndex={idx}
          totalSteps={unit3Lesson3Data.steps.length}
        />,
      );
      expect(container.querySelectorAll('.katex-error'), step.id).toHaveLength(0);
      // النص المرئي فقط: تُحذف حاشية MathML (annotation) التي تحمل TeX الأصلي
      // كما يفعل تدقيق العرض الشامل في math-rendering-audit.
      const visible = container.innerHTML
        .replace(/<annotation[\s\S]*?<\/annotation>/g, '')
        .replace(/<[^>]+>/g, ' ');
      expect(visible, step.id).not.toContain('\\');
      expect(visible, step.id).not.toContain('$');
      expect(visible, step.id).not.toContain('**');
      unmount();
    });
  });

  it('operates the platform practice-check widget end to end', () => {
    const step = unit3Lesson3Data.steps[0];
    const { container, unmount } = render(
      <StepRenderer step={step} stepIndex={0} totalSteps={unit3Lesson3Data.steps.length} />,
    );

    const choices = container.querySelectorAll('.pc-choice');
    expect(choices.length).toBeGreaterThanOrEqual(3);
    fireEvent.click(choices[0]);
    // قبل الضغط على «تحقّق» لا تظهر أي تغذية راجعة:
    expect(container.querySelectorAll('.pc-feedback')).toHaveLength(0);

    fireEvent.click(container.querySelector('.pc-check-btn')!);
    expect(container.querySelector('.pc-feedback-ok')).toBeTruthy();
    expect(container.querySelector('.pc-feedback-ok')?.textContent).toContain('أحسنت');

    // إعادة المحاولة تصفّر الاختيار:
    fireEvent.click(container.querySelector('.pc-retry')!);
    expect(container.querySelectorAll('.pc-feedback')).toHaveLength(0);
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
    unmount();
  });

  it('unlocks TeacherArea and displays the «اختزال عبارة رمزية» tab with all 55 solutions', () => {
    sessionStorage.clear();
    const { container } = render(<TeacherArea onNavigateHome={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/كلمة المرور/), { target: { value: 'somer173' } });
    fireEvent.submit(container.querySelector('form')!);

    const tabs = screen.getAllByRole('button', { name: new RegExp(OFFICIAL_TITLE) });
    expect(tabs.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(tabs[0]);

    expect(container.querySelectorAll('.ta-solution')).toHaveLength(55);
    // ملاحظة المصدر الوحيدة (والموثقة) في هذا الدرس: الخطأ المطبعي في السطر الثالث من المثال.
    expect(container.querySelectorAll('.ta-source-notes li').length).toBeGreaterThanOrEqual(1);
    expect(container.querySelector('.ta-source-notes')?.textContent).toContain('2x^2(-2)x + 1');
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
  });
});

describe('Unit 3, Lesson 3 — independent 20-question lesson test (`u3-test-lesson-3`)', () => {
  it('satisfies the 20-question, 6/7/4/3 difficulty, >=4 types, and 6-concept blueprint with 20/20 exact grading', () => {
    const resolved = resolveTest(TEST_ID);
    expect(resolved).toBeDefined();
    expect(resolved!.title).toBe('اختبار الدرس الثالث: اختزال عبارة رمزية');
    expect(resolved!.questionCount).toBe(20);
    expect(unit3Lesson3TestQuestions).toHaveLength(20);

    const profile = conceptProfileForLesson(LESSON_ID);
    const blueprint = blueprintForLesson(LESSON_ID);
    expect(profile).toBeDefined();
    expect(blueprint).toBeDefined();
    expect(profile!.concepts).toHaveLength(6);

    const diffCounts = { basic: 0, intermediate: 0, advanced: 0, reasoning: 0 };
    const typeCounts: Record<string, number> = {};
    const distinctTypes = new Set<string>();
    const coveredConcepts = new Set<string>();

    for (const question of resolved!.questions) {
      diffCounts[question.difficulty] += 1;
      typeCounts[question.type] = (typeCounts[question.type] ?? 0) + 1;
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
    expect(Object.values(typeCounts).every((count) => count / 20 <= 0.5)).toBe(true);
    expect(coveredConcepts.size).toBe(6);
  });

  it('withholds correctness before submission, scores accurately on submit, and resets cleanly on retry', () => {
    const resolved = resolveTest(TEST_ID)!;
    const { container } = render(
      <TestRunner test={resolved} onReturnToTests={() => {}} onOpenSolutions={() => {}} />,
    );

    // سؤال 1 (اختيار من متعدد) — لا تُكشف الصحة قبل التسليم:
    const optionButtons = container.querySelectorAll('.test-option');
    expect(optionButtons.length).toBe(4);
    fireEvent.click(optionButtons[0]);

    expect(container.querySelectorAll('.is-correct, .is-wrong, .test-review-card')).toHaveLength(0);
    expect(container.querySelector('.test-progress-copy')?.textContent).toContain('إجابات محفوظة: 1');

    fireEvent.click(screen.getByRole('button', { name: /تسليم الاختبار/ }));

    expect(screen.getByText('أحسنت على إكمال الاختبار')).toBeInTheDocument();
    expect(screen.getByLabelText('1 من 20')).toBeInTheDocument();
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);

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
