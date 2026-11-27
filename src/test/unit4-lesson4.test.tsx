import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { getLessonById, getUnitById } from '../data/curriculum';
import { unit4Lesson4Data } from '../data/unit4/lesson04';
import { unit4ExerciseQuestions } from '../data/unit4/lesson04Questions';
import sourceAudit from '../data/unit4/source-audit-lesson04.json';
import {
  gradeCycleNodes,
  gradeLinearEquation,
  gradeLinearExpression,
  gradeRationalInput,
  parseFlexibleRational,
  parseLinearExpression,
  rationalEquals,
} from '../data/unit4/lesson04Grading';
import { getTestsByType, resolveTest } from '../data/tests/registry';
import { conceptProfileForLesson } from '../data/tests/concepts';
import { blueprintForLesson } from '../data/tests/blueprints';
import { gradeQuestion, scoreTest } from '../data/tests/scoring';
import { unit4Lesson4TestQuestions } from '../data/tests/unit4/lesson-4';
import type { QuestionAnswer } from '../data/tests/types';
import { LessonExperience } from '../components/lesson/LessonExperience';
import { TeacherArea } from '../components/teacher/TeacherArea';

const EXPECTED_SUB_COUNTS: Record<number, number> = {
  1: 6,
  2: 6,
  3: 2,
  4: 2,
  5: 2,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 2,
  11: 0,
  12: 0,
  13: 2,
  14: 2,
  15: 2,
  16: 0,
  17: 0,
  18: 0,
  19: 2,
  20: 3,
  21: 2,
  22: 5,
};

const EXPECTED_TEST_ANSWERS: Record<string, QuestionAnswer> = {
  'u4-l4-01': 'a',
  'u4-l4-02': '-7',
  'u4-l4-03': '-5/6',
  'u4-l4-04': 'a',
  'u4-l4-05': '66',
  'u4-l4-06': true,
  'u4-l4-07': ['s1', 's2', 's3', 's4'],
  'u4-l4-08': '20',
  'u4-l4-09': 'a',
  'u4-l4-10': 'a',
  'u4-l4-11': 'a',
  'u4-l4-12': 'a',
  'u4-l4-13': true,
  'u4-l4-14': ['A', 'C', 'D'],
  'u4-l4-15': '90',
  'u4-l4-16': '6000',
  'u4-l4-17': ['A', 'B', 'D'],
  'u4-l4-18': '5',
  'u4-l4-19': 'a',
  'u4-l4-20': 'a',
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('Unit 4, Lesson 4 (تمارين الوحدة الرابعة) — source audit & curriculum integrity', () => {
  it('registers u4-lesson-4 under unit-4 without introducing missing /book/ page assets', () => {
    const unit = getUnitById('unit-4');
    expect(unit).toBeDefined();
    expect(unit!.lessons.map((l) => l.id)).toEqual([
      'u4-lesson-1',
      'u4-lesson-2',
      'u4-lesson-3',
      'u4-lesson-4',
    ]);
    expect(unit!.sourcePages).toEqual([67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77]);

    const found = getLessonById('unit-4', 'u4-lesson-4');
    expect(found).toBeDefined();
    expect(found!.title).toBe('تمارين الوحدة الرابعة');
    expect(found!.sourcePages).toEqual([]);
    expect(found!.sourceLabel).toContain('1–22');
  });

  it('matches the 14-scan source audit across all 22 main questions, 38 sub-questions, and 47 solvable parts', () => {
    expect(sourceAudit.sourceFiles).toHaveLength(14);
    expect(sourceAudit.totalMainQuestions).toBe(22);
    expect(sourceAudit.totalSubQuestions).toBe(38);
    expect(sourceAudit.standaloneMainQuestions).toEqual([6, 7, 8, 9, 11, 12, 16, 17, 18]);
    expect(sourceAudit.numberingColorScheme).toEqual({
      mainQuestionNumber: 'green',
      subQuestionNumber: 'blue',
    });

    expect(unit4ExerciseQuestions).toHaveLength(22);
    expect(unit4Lesson4Data.steps).toHaveLength(22);
    expect(unit4Lesson4Data.teacherArea?.solutions).toHaveLength(22);

    const blockIds = new Set(
      unit4Lesson4Data.steps.flatMap((step) => step.blocks).map((block) => block.id),
    );
    for (const sol of unit4Lesson4Data.teacherArea!.solutions!) {
      expect(blockIds.has(sol.blockId), sol.blockId).toBe(true);
      expect(sol.steps.length).toBeGreaterThanOrEqual(1);
    }

    const actualMainNumbers = unit4ExerciseQuestions.map((q) => q.n);
    expect(actualMainNumbers).toEqual(Array.from({ length: 22 }, (_, i) => i + 1));

    let totalSubItems = 0;
    let totalCheckItems = 0;
    for (const q of unit4ExerciseQuestions) {
      const expectedSubs = EXPECTED_SUB_COUNTS[q.n];
      const actualSubs = q.subItems?.length ?? 0;
      expect(actualSubs, `Q${q.n} subItems length`).toBe(expectedSubs);

      if (expectedSubs > 0) {
        expect(q.checkData.items.length, `Q${q.n} checkData items`).toBe(expectedSubs);
        q.checkData.items.forEach((item, idx) => {
          expect(item.subNumber, `Q${q.n} subNumber[${idx}]`).toBe(String(idx + 1));
        });
      } else {
        expect(q.checkData.items.length, `Q${q.n} standalone checkData item`).toBe(1);
        expect(q.checkData.items[0].subNumber).toBeUndefined();
      }

      totalSubItems += actualSubs;
      totalCheckItems += q.checkData.items.length;
    }

    expect(totalSubItems).toBe(38);
    expect(totalCheckItems).toBe(47);
  });

  it('registers the 20-question standalone test u4-test-lesson-4 and grades all 20 items to 100%', () => {
    const testMeta = getTestsByType('lesson').find((t) => t.lessonId === 'u4-lesson-4');
    expect(testMeta).toBeDefined();
    expect(testMeta!.id).toBe('u4-test-lesson-4');

    const resolved = resolveTest('u4-test-lesson-4');
    expect(resolved).toBeDefined();
    expect(resolved!.questionCount).toBe(20);
    expect(unit4Lesson4TestQuestions).toHaveLength(20);
    expect(conceptProfileForLesson('u4-lesson-4')!.concepts).toHaveLength(6);
    expect(blueprintForLesson('u4-lesson-4')).toBeDefined();

    const difficultyCounts = { basic: 0, intermediate: 0, advanced: 0, reasoning: 0 };
    const types = new Set<string>();
    for (const question of resolved!.questions) {
      difficultyCounts[question.difficulty] += 1;
      types.add(question.type);
      expect(gradeQuestion(question, EXPECTED_TEST_ANSWERS[question.id]), question.id).toBe(true);
    }
    expect(difficultyCounts).toEqual({ basic: 6, intermediate: 7, advanced: 4, reasoning: 3 });
    expect(types.size).toBe(6);
    expect(scoreTest(resolved!.questions, EXPECTED_TEST_ANSWERS).percentage).toBe(100);
  });
});

describe('Unit 4, Lesson 4 — exact algebraic & rational grading engine', () => {
  it('parses and grades exact rationals across fractions, decimals, signs, and Arabic-Indic numerals', () => {
    expect(
      rationalEquals(parseFlexibleRational('29/5')!, { numerator: 29n, denominator: 5n }),
    ).toBe(true);
    expect(gradeRationalInput('5.8', '29/5').ok).toBe(true);
    expect(gradeRationalInput('٥٫٨', '29/5').ok).toBe(true);
    expect(gradeRationalInput('٢٩/٥', '29/5').ok).toBe(true);
    expect(gradeRationalInput('a = 29/5', '29/5', { variable: 'a' }).ok).toBe(true);
    expect(gradeRationalInput('−13/3', '-13/3').ok).toBe(true);
    expect(gradeRationalInput('-١٣/٣', '-13/3').ok).toBe(true);
    expect(gradeRationalInput('-26/6', '-13/3').ok).toBe(true);
    expect(gradeRationalInput('6.25', '25/4').ok).toBe(true);
    expect(gradeRationalInput('6,25', '25/4').ok).toBe(true);
    expect(gradeRationalInput('-1.25', '-5/4').ok).toBe(true);
    expect(gradeRationalInput('1.2', '6/5').ok).toBe(true);

    expect(gradeRationalInput('-4.33', '-13/3').ok).toBe(false);
    expect(gradeRationalInput('13/3', '-13/3').ok).toBe(false);
    expect(gradeRationalInput('1/0', '0').ok).toBe(false);
    expect(gradeRationalInput('', '0').reason).toBe('empty');
  });

  it('grades equivalent linear expressions in x (Q20 & Q22 area formulas)', () => {
    expect(gradeLinearExpression('1.5x', '(3/2)x', 'x').ok).toBe(true);
    expect(gradeLinearExpression('3x/2', '1.5x', 'x').ok).toBe(true);
    expect(gradeLinearExpression('(3 * x) / 2', '1.5x', 'x').ok).toBe(true);

    expect(gradeLinearExpression('25 - 2.5x', '25 - (5/2)x', 'x').ok).toBe(true);
    expect(gradeLinearExpression('(50 - 5x)/2', '25 - 2.5x', 'x').ok).toBe(true);

    // Q22 sub-item 3: both unsimplified subtraction and simplified form are equivalent
    expect(gradeLinearExpression('20 - (12 - 0.5x)', '8 + 0.5x', 'x').ok).toBe(true);
    expect(gradeLinearExpression('20 - (2 + 2x + 10 - 2.5x)', '8 + 0.5x', 'x').ok).toBe(true);
    expect(gradeLinearExpression('8 + x/2', '8 + 0.5x', 'x').ok).toBe(true);

    // Sign mistake 8 - 0.5x must fail
    expect(gradeLinearExpression('8 - 0.5x', '8 + 0.5x', 'x').ok).toBe(false);
    expect(parseLinearExpression('x * x', 'x').error).toBe('nonlinear');
    expect(parseLinearExpression('2y + 8', 'x').error).toBe('wrong-variable');
  });

  it('grades linear equation writing and distinguishes unisolated models from bare x = k answers', () => {
    expect(gradeLinearEquation('5x + 160 = 360', '5x + 160 = 360', 'x').ok).toBe(true);
    expect(gradeLinearEquation('160 + 5x = 360', '5x + 160 = 360', 'x').ok).toBe(true);

    expect(
      gradeLinearEquation('2(x + 15) = 44', '2(x + 15) = 44', 'x', {
        forbidIsolatedVariable: true,
      }).ok,
    ).toBe(true);
    expect(
      gradeLinearEquation('2x + 30 = 44', '2(x + 15) = 44', 'x', {
        forbidIsolatedVariable: true,
      }).ok,
    ).toBe(true);
    const isolatedAttempt = gradeLinearEquation('x = 7', '2(x + 15) = 44', 'x', {
      forbidIsolatedVariable: true,
    });
    expect(isolatedAttempt.ok).toBe(false);
    expect(isolatedAttempt.reason).toBe('already-solved');

    // Q5 (2): accepts choosing either smaller dimension x or larger dimension x
    expect(
      gradeLinearEquation('2(x + 3x) = 28', ['2(x + 3x) = 28', '2(x + x/3) = 28'], 'x').ok,
    ).toBe(true);
    expect(
      gradeLinearEquation('2(x + x/3) = 28', ['2(x + 3x) = 28', '2(x + x/3) = 28'], 'x').ok,
    ).toBe(true);

    expect(gradeLinearEquation('2x + 30', '2x + 30 = 44', 'x').reason).toBe('missing-equals');
    expect(gradeLinearEquation('2x + 4 = 2(x + 2)', '2x + 30 = 44', 'x').reason).toBe(
      'not-in-variable',
    );
  });

  it('grades 4-node arithmetic cycles accurately (Q19 right & left cycles)', () => {
    expect(gradeCycleNodes(['0', '0', '6', '3'], ['0', '0', '6', '3']).ok).toBe(true);
    expect(gradeCycleNodes(['٤٢', '٣٦', '٩', '١٤'], ['42', '36', '9', '14']).ok).toBe(true);

    const wrongSlot = gradeCycleNodes(['42', '36', '9', '12'], ['42', '36', '9', '14']);
    expect(wrongSlot.ok).toBe(false);
    expect(wrongSlot.cellOk).toEqual([true, true, true, false]);
  });
});

describe('Unit 4, Lesson 4 — UI rendering, green/blue numbering, anti-spoiler gating, and interactive checks', () => {
  it('renders all 22 steps inside LessonExperience with data-lesson-id="u4-lesson-4", zero KaTeX errors, zero metric warnings, green main badges, and blue sub badges', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      const { container } = render(
        <LessonExperience lesson={unit4Lesson4Data} onNavigateBack={vi.fn()} />,
      );

      expect(container.querySelector('.lesson-layout')).toHaveAttribute(
        'data-lesson-id',
        'u4-lesson-4',
      );

      for (let idx = 0; idx < 22; idx++) {
        const qNum = idx + 1;
        const expectedSubs = EXPECTED_SUB_COUNTS[qNum];

        expect(container.querySelectorAll('.katex-error').length, `Step ${qNum} .katex-error`).toBe(0);

        // Anti-spoiler invariant: solution panel & result are deferred before student reveals
        expect(container.querySelector(`#u4-l4-step-${qNum}-solution-panel`)).toBeNull();
        expect(container.querySelector('.exercise-result-deferred')).toBeTruthy();

        // Green main question badge is present in the interactive verifier header
        const mainBadges = container.querySelectorAll('[data-number-role="main"]');
        expect(mainBadges.length, `Step ${qNum} main badge`).toBeGreaterThanOrEqual(1);
        mainBadges.forEach((badge) => {
          expect(badge.textContent?.trim()).toBe(String(qNum));
          expect(badge.classList.contains('u4-main-num-badge')).toBe(true);
        });

        // Blue sub-question badges match exact sub-question count (in source card + verifier)
        const subBadges = container.querySelectorAll('[data-number-role="sub"]');
        if (expectedSubs > 0) {
          expect(subBadges.length, `Step ${qNum} blue sub badges`).toBe(expectedSubs * 2);
        } else {
          expect(subBadges.length, `Step ${qNum} standalone has zero blue sub badges`).toBe(0);
        }

        // Open hint + worked solution and verify zero KaTeX errors on revealed panels
        const hintBtn = container.querySelector('button.hint-disclosure') as HTMLButtonElement;
        expect(hintBtn).toBeTruthy();
        fireEvent.click(hintBtn);

        const solBtn = container.querySelector('button.solution-disclosure') as HTMLButtonElement;
        expect(solBtn).toBeTruthy();
        fireEvent.click(solBtn);

        expect(container.querySelector(`#u4-l4-step-${qNum}-solution-panel`)).toBeTruthy();
        expect(container.querySelectorAll('.katex-error').length, `Step ${qNum} revealed .katex-error`).toBe(0);

        if (idx < 21) {
          const nextBtns = screen.getAllByRole('button', { name: /التالي/ });
          fireEvent.click(nextBtns[nextBtns.length - 1]);
        }
      }

      const allLogged = [
        ...warnSpy.mock.calls.map((c) => c.join(' ')),
        ...errSpy.mock.calls.map((c) => c.join(' ')),
      ].join('\n');
      expect(allLogged).not.toContain('No character metrics');
    } finally {
      warnSpy.mockRestore();
      errSpy.mockRestore();
    }
  }, 30_000);

  it('interactively grades Q1 (6 MCQs), Q2 (6 rationals), Q5 (equation writing), Q6 (notebook), Q19 (cycles), and Q22 (geometry + area expressions)', () => {
    const mountQuestion = (n: number) => {
      localStorage.clear();
      return render(
        <LessonExperience
          lesson={unit4Lesson4Data}
          initialStep={n - 1}
          onNavigateBack={vi.fn()}
        />,
      );
    };

    // ── Step 1 (Q1): 6 MCQ subcards → correct choices: ③, ①, ①, ②, ①, ② ──
    {
      const { container, unmount } = mountQuestion(1);
      const q1Verifier = container.querySelector('section.u4-ex-verifier') as HTMLElement;
      expect(q1Verifier).toBeTruthy();
      const q1CorrectChoices = ['③', '①', '①', '②', '①', '②'];
      const q1Subcards = Array.from(q1Verifier.querySelectorAll('.u4-ex-subcards-list > *'));
      expect(q1Subcards).toHaveLength(6);
      q1Subcards.forEach((card, i) => {
        const btn = Array.from(card.querySelectorAll('button.u4-ex-choice-btn')).find((b) =>
          b.textContent?.includes(q1CorrectChoices[i]),
        )!;
        fireEvent.click(btn);
        fireEvent.click(card.querySelector('button.u4-ex-check-btn')!);
      });
      expect(q1Verifier.querySelectorAll('.u4-ex-feedback.is-success')).toHaveLength(6);
      unmount();
    }

    // ── Step 2 (Q2): 6 rational equations ──
    {
      const { container, unmount } = mountQuestion(2);
      const q2Verifier = container.querySelector('section.u4-ex-verifier') as HTMLElement;
      const q2Subcards = Array.from(q2Verifier.querySelectorAll('.u4-ex-subcards-list > *'));
      expect(q2Subcards).toHaveLength(6);
      ['29/5', '-13/3', '-7', '12', '-1.25', '6/5'].forEach((val, i) => {
        const inp = q2Subcards[i].querySelector('input.u4-ex-input')!;
        fireEvent.change(inp, { target: { value: val } });
        fireEvent.click(q2Subcards[i].querySelector('button.u4-ex-check-btn')!);
      });
      expect(q2Verifier.querySelectorAll('.u4-ex-feedback.is-success')).toHaveLength(6);
      unmount();
    }

    // ── Step 5 (Q5): Writing equations from text ──
    {
      const { container, unmount } = mountQuestion(5);
      const q5Verifier = container.querySelector('section.u4-ex-verifier') as HTMLElement;
      const q5Subcards = Array.from(q5Verifier.querySelectorAll('.u4-ex-subcards-list > *'));
      expect(q5Subcards).toHaveLength(2);
      fireEvent.change(q5Subcards[0].querySelector('input.u4-ex-input')!, {
        target: { value: 'x = 7' },
      });
      fireEvent.click(q5Subcards[0].querySelector('button.u4-ex-check-btn')!);
      expect(q5Subcards[0].querySelector('.u4-ex-feedback.is-error')).toBeTruthy();

      fireEvent.change(q5Subcards[0].querySelector('input.u4-ex-input')!, {
        target: { value: '2(x + 15) = 44' },
      });
      fireEvent.click(q5Subcards[0].querySelector('button.u4-ex-check-btn')!);
      fireEvent.change(q5Subcards[1].querySelector('input.u4-ex-input')!, {
        target: { value: '2(x + 3x) = 28' },
      });
      fireEvent.click(q5Subcards[1].querySelector('button.u4-ex-check-btn')!);
      expect(q5Verifier.querySelectorAll('.u4-ex-feedback.is-success')).toHaveLength(2);
      unmount();
    }

    // ── Step 6 (Q6): Reviewer notebook figure + minor (75) & adult (150) fields ──
    {
      const { container, unmount } = mountQuestion(6);
      expect(container.querySelector('.u4-ex6-notebook')).toBeTruthy();
      const q6Verifier = container.querySelector('section.u4-ex-verifier') as HTMLElement;
      const q6Inputs = q6Verifier.querySelectorAll('input.u4-ex-input');
      expect(q6Inputs).toHaveLength(2);
      // Stopping at 75 for the adult ticket fails
      fireEvent.change(q6Inputs[0], { target: { value: '75' } });
      fireEvent.change(q6Inputs[1], { target: { value: '75' } });
      fireEvent.click(q6Verifier.querySelector('button.u4-ex-check-btn')!);
      expect(q6Verifier.querySelector('.u4-ex-feedback.is-error')).toBeTruthy();
      // Entering 75 for x and 150 for adult ticket succeeds
      fireEvent.change(q6Inputs[1], { target: { value: '150' } });
      fireEvent.click(q6Verifier.querySelector('button.u4-ex-check-btn')!);
      expect(q6Verifier.querySelector('.u4-ex-feedback.is-success')).toBeTruthy();
      unmount();
    }

    // ── Step 19 (Q19): Two 4-node cycles ──
    {
      const { container, unmount } = mountQuestion(19);
      const q19Verifier = container.querySelector('section.u4-ex-verifier') as HTMLElement;
      const q19Subcards = Array.from(q19Verifier.querySelectorAll('.u4-ex-subcards-list > *'));
      expect(q19Subcards).toHaveLength(2);
      const fillCycle = (
        card: Element,
        [top, right, bottom, left]: [string, string, string, string],
      ) => {
        fireEvent.change(card.querySelector('.u4-cycle-slot--top input')!, {
          target: { value: top },
        });
        fireEvent.change(card.querySelector('.u4-cycle-slot--right input')!, {
          target: { value: right },
        });
        fireEvent.change(card.querySelector('.u4-cycle-slot--bottom input')!, {
          target: { value: bottom },
        });
        fireEvent.change(card.querySelector('.u4-cycle-slot--left input')!, {
          target: { value: left },
        });
        fireEvent.click(card.querySelector('button.u4-ex-check-btn')!);
      };
      fillCycle(q19Subcards[0], ['0', '0', '6', '3']);
      fillCycle(q19Subcards[1], ['42', '36', '9', '14']);
      expect(q19Verifier.querySelectorAll('.u4-ex-feedback.is-success')).toHaveLength(2);
      unmount();
    }

    // ── Step 22 (Q22): Rectangle + inscribed triangle EDF (5 subcards + solution figure) ──
    {
      const { container, unmount } = mountQuestion(22);
      const q22Verifier = container.querySelector('section.u4-ex-verifier') as HTMLElement;
      const q22Subcards = Array.from(q22Verifier.querySelectorAll('.u4-ex-subcards-list > *'));
      expect(q22Subcards).toHaveLength(5);

      fireEvent.change(q22Subcards[0].querySelector('input.u4-ex-input')!, {
        target: { value: '2' },
      });
      fireEvent.click(q22Subcards[0].querySelector('button.u4-ex-check-btn')!);

      // Subcard 2: area of EBF = 2x and area of DFC = 5(4-x)/2 (equivalent to 10 - 2.5x!)
      const sub2Inputs = q22Subcards[1].querySelectorAll('input.u4-ex-input');
      fireEvent.change(sub2Inputs[0], { target: { value: '2x' } });
      fireEvent.change(sub2Inputs[1], { target: { value: '5*(4 - x)/2' } });
      fireEvent.click(q22Subcards[1].querySelector('button.u4-ex-check-btn')!);

      // Subcard 3: proof step MCQ (choice ①)
      const sub3FirstBtn = q22Subcards[2].querySelectorAll('button.u4-ex-choice-btn')[0];
      fireEvent.click(sub3FirstBtn);
      fireEvent.click(q22Subcards[2].querySelector('button.u4-ex-check-btn')!);

      // Subcard 4: x = 3
      fireEvent.change(q22Subcards[3].querySelector('input.u4-ex-input')!, {
        target: { value: '3' },
      });
      fireEvent.click(q22Subcards[3].querySelector('button.u4-ex-check-btn')!);

      // Subcard 5: geometric placement MCQ → reveals solution figure!
      const sub5CorrectBtn = Array.from(
        q22Subcards[4].querySelectorAll('button.u4-ex-choice-btn'),
      ).find((b) => b.textContent?.includes('BF = 3'))!;
      fireEvent.click(sub5CorrectBtn);
      fireEvent.click(q22Subcards[4].querySelector('button.u4-ex-check-btn')!);

      expect(q22Verifier.querySelectorAll('.u4-ex-feedback.is-success')).toHaveLength(5);
      expect(
        container.querySelector('figure[aria-label*="في الحالة x = 3 cm"]'),
      ).toBeTruthy();
      unmount();
    }
  }, 30_000);

  it('verifies all 47 solvable parts across all 22 questions grade green end-to-end in the UI', () => {
    let solvedSubcardsCount = 0;

    for (const q of unit4ExerciseQuestions) {
      localStorage.clear();
      const { container, unmount } = render(
        <LessonExperience
          lesson={unit4Lesson4Data}
          initialStep={q.n - 1}
          onNavigateBack={vi.fn()}
        />,
      );

      const verifier = container.querySelector('section.u4-ex-verifier') as HTMLElement;
      expect(verifier, `Q${q.n} verifier`).toBeTruthy();

      const subcards = Array.from(verifier.querySelectorAll('.u4-ex-subcards-list > *'));
      expect(subcards.length, `Q${q.n} subcard count`).toBe(q.checkData.items.length);

      q.checkData.items.forEach((item, idx) => {
        const card = subcards[idx];
        if (item.kind === 'mcq') {
          const choiceBtns = card.querySelectorAll('button.u4-ex-choice-btn');
          fireEvent.click(choiceBtns[item.correctChoiceIndex!]);
        } else if (item.kind === 'rational') {
          const inputs = card.querySelectorAll('input.u4-ex-input');
          item.rationalFields!.forEach((f, fIdx) => {
            fireEvent.change(inputs[fIdx], { target: { value: f.expected } });
          });
        } else if (item.kind === 'linear-expr') {
          const inputs = card.querySelectorAll('input.u4-ex-input');
          item.exprFields!.forEach((f, fIdx) => {
            fireEvent.change(inputs[fIdx], { target: { value: f.expectedExpr } });
          });
        } else if (item.kind === 'linear-eq') {
          const eqStr = Array.isArray(item.acceptedEquations)
            ? item.acceptedEquations[0]
            : item.acceptedEquations!;
          fireEvent.change(card.querySelector('input.u4-ex-input')!, {
            target: { value: eqStr },
          });
        } else if (item.kind === 'cycle') {
          const [top, right, bottom, left] = item.expectedCycleNodes!;
          fireEvent.change(card.querySelector('.u4-cycle-slot--top input')!, {
            target: { value: top },
          });
          fireEvent.change(card.querySelector('.u4-cycle-slot--right input')!, {
            target: { value: right },
          });
          fireEvent.change(card.querySelector('.u4-cycle-slot--bottom input')!, {
            target: { value: bottom },
          });
          fireEvent.change(card.querySelector('.u4-cycle-slot--left input')!, {
            target: { value: left },
          });
        }

        fireEvent.click(card.querySelector('button.u4-ex-check-btn')!);
        expect(
          card.querySelector('.u4-ex-feedback.is-success'),
          `Q${q.n} sub-item ${item.subNumber ?? 'main'} should succeed`,
        ).toBeTruthy();
        solvedSubcardsCount += 1;
      });

      unmount();
    }

    expect(solvedSubcardsCount).toBe(47);
  }, 30_000);

  it('opens in the Teacher Area with all 22 structured solutions and zero KaTeX errors', () => {
    const { container } = render(<TeacherArea onNavigateHome={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/كلمة المرور/), { target: { value: 'somer173' } });
    fireEvent.submit(container.querySelector('form')!);
    const tabs = screen.getAllByRole('button', { name: /تمارين الوحدة الرابعة/ });
    fireEvent.click(tabs[0]);
    expect(container.querySelectorAll('.ta-solution')).toHaveLength(22);
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
  }, 30_000);
});
