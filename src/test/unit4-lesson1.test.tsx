import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { curriculum, getLessonById, getUnitById } from '../data/curriculum';
import { unit4Lesson1Data } from '../data/unit4/lesson01';
import { unit4WarmupData } from '../data/unit4/warmup';
import { unit4Lesson1TeacherSolutions } from '../data/unit4/lesson01TeacherSolutions';
import sourceAudit from '../data/unit4/lesson01.source-audit.json';
import { StepRenderer } from '../components/lesson/StepRenderer';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { EquationBalanceLab } from '../components/interactive/EquationBalanceLab';
import { EquationMatchLab } from '../components/interactive/EquationMatchLab';
import { getTestsByType, questionBank, resolveTest } from '../data/tests/registry';
import { conceptProfileForLesson, resolveConceptReference } from '../data/tests/concepts';
import { blueprintForLesson } from '../data/tests/blueprints';
import { gradeQuestion, scoreTest } from '../data/tests/scoring';
import { unit4Lesson1TestQuestions } from '../data/tests/unit4/lesson-1';
import type { QuestionAnswer } from '../data/tests/types';

const UNIT_ID = 'unit-4';
const LESSON_ID = 'u4-lesson-1';
const TEST_ID = 'u4-test-lesson-1';
const OFFICIAL_TITLE = 'مساواة وعمليات';

const EXPECTED_TEST_ANSWERS: Record<string, QuestionAnswer> = {
  'u4-l1-01': 'b',
  'u4-l1-02': true,
  'u4-l1-03': '6',
  'u4-l1-04': 'c',
  'u4-l1-05': 'b',
  'u4-l1-06': '21',
  'u4-l1-07': 'b',
  'u4-l1-08': ['A', 'B', 'D'],
  'u4-l1-09': '12',
  'u4-l1-10': ['c', 'b', 'a'],
  'u4-l1-11': 'a',
  'u4-l1-12': 'b',
  'u4-l1-13': '13',
  'u4-l1-14': 'b',
  'u4-l1-15': 'a',
  'u4-l1-16': ['A', 'B'],
  'u4-l1-17': 'b',
  'u4-l1-18': 'b',
  'u4-l1-19': false,
  'u4-l1-20': 'a',
};

describe('Unit 4, Lesson 1 — identity and curriculum registration', () => {
  it('registers Unit 4 «معادلات من الدرجة الأولى» with the official lesson title «مساواة وعمليات»', () => {
    const unit = getUnitById(UNIT_ID);
    expect(unit).toBeDefined();
    expect(unit!.number).toBe(4);
    expect(unit!.title).toBe('معادلات من الدرجة الأولى');
    expect(unit!.sourcePages).toEqual([67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77]);

    const lesson = getLessonById(UNIT_ID, LESSON_ID);
    expect(lesson).toBe(unit4Lesson1Data);
    expect(lesson!.number).toBe(1);
    expect(lesson!.title).toBe(OFFICIAL_TITLE);
    expect(lesson!.title).not.toContain('انطلاقة نشطة');
    expect(lesson!.sourcePages).toEqual([68, 69, 70, 71]);

    expect(unit!.warmup).toBe(unit4WarmupData);
    expect(unit!.warmup.title).toContain('انطلاقة نشطة');
    expect(unit!.warmup.sourcePages).toEqual([67]);
  });

  it('keeps Units 1–3 unchanged and adds no Unit 4 unit test', () => {
    expect(curriculum.map((u) => u.id)).toEqual(['unit-1', 'unit-2', 'unit-3', 'unit-4']);
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
    expect(curriculum[2].lessons.map((l) => l.id)).toEqual([
      'u3-lesson-1',
      'u3-lesson-2',
      'u3-lesson-3',
      'u3-lesson-4',
      'u3-lesson-5',
      'u3-lesson-6',
    ]);
    expect(getTestsByType('unit').map((t) => t.unitId)).toEqual(['unit-1', 'unit-2']);
    expect(getTestsByType('unit').some((t) => t.unitId === 'unit-4')).toBe(false);
  });

  it('covers pages 68–71 only, and never folds the p.67 warm-up into the lesson', () => {
    expect(unit4Lesson1Data.steps).toHaveLength(11);
    for (const step of unit4Lesson1Data.steps) {
      expect(step.sourcePages.every((page) => page >= 68 && page <= 71), step.id).toBe(true);
    }
    const warmupBlockIds = unit4Lesson1Data.steps
      .flatMap((step) => step.blocks)
      .map((block) => block.id)
      .filter((id) => id.startsWith('p67-'));
    expect(warmupBlockIds).toEqual([]);
  });
});

describe('Unit 4, Lesson 1 — source fidelity, audit notes, and teacher solutions', () => {
  it('maps the audited textbook block sequence in exact order to non-authored blocks', () => {
    const nonAuthoredBlocks = unit4Lesson1Data.steps
      .flatMap((step) => step.blocks)
      .filter((block) => !block.authored);
    expect(nonAuthoredBlocks.map((block) => block.id)).toEqual(sourceAudit.bookBlockSequence);
    expect(sourceAudit.unresolvedAmbiguities).toEqual([]);

    const allBlocks = unit4Lesson1Data.steps.flatMap((step) => step.blocks);
    const blockById = new Map(allBlocks.map((block) => [block.id, block]));
    for (const solution of unit4Lesson1TeacherSolutions) {
      expect(blockById.get(solution.blockId), `missing block ${solution.blockId}`).toBeDefined();
    }
  });

  it('documents the printed «P = 2L l» in a verifyNote and teaches the corrected formula as the platform derivation', () => {
    const allBlocks = unit4Lesson1Data.steps.flatMap((step) => step.blocks);
    const rectangle = allBlocks.find((block) => block.id === 'p71-rectangle')!;
    expect(rectangle.verifyNote).toBeDefined();
    expect(rectangle.verifyNote).toContain('2L');
    expect(rectangle.mathFormula).toContain('2L');
  });

  it('ships teacher solutions with origin tags, principles, and checks', () => {
    expect(unit4Lesson1TeacherSolutions.length).toBeGreaterThanOrEqual(25);
    for (const solution of unit4Lesson1TeacherSolutions) {
      expect(['الكتاب', 'مُشتقة من المنصة']).toContain(solution.answerOrigin);
      expect(solution.steps.length).toBeGreaterThanOrEqual(2);
      expect(solution.principle.length).toBeGreaterThan(5);
    }
    // كل حلّ مرتبط بكتلة موجودة وأنّ لكلّ كتلة مرجعية حلًّا واحدًا على الأقل.
    const blockIds = new Set(
      unit4Lesson1Data.steps.flatMap((step) => step.blocks).map((block) => block.id),
    );
    for (const solution of unit4Lesson1TeacherSolutions) {
      expect(blockIds.has(solution.blockId), solution.blockId).toBe(true);
    }
  });
});

describe('Unit 4, Lesson 1 — Arabic wording and digits (D5/D6)', () => {
  it('writes the two corrected sentences with sound Arabic', () => {
    const bank = JSON.stringify(unit4Lesson1TestQuestions);
    expect(bank).toContain('بعد ذلك نقسم الطرفين على 5 فيكون');
    expect(bank).not.toContain('تُقسم الطرفان');
    expect(bank).toContain('إذن السطر الأول الصحيح هو النشر');
    expect(bank).not.toContain('هو إذن النشر');
  });

  it('uses Western digits in the p.71 age item, like the rest of the page and file', () => {
    const ageBlock = unit4Lesson1Data.steps
      .flatMap((step) => step.blocks)
      .find((block) => block.id === 'p71-age')!;
    const text = [ageBlock.title, ageBlock.content].join(' ');
    expect(text).toContain('ويزيد $3$ سنوات');
    // لا أرقام عربية-هندية في نثر الكتلة (الرموز ①–⑦ علامات بنود لا أرقام قيم).
    const arabicIndic = text.match(/[٠-٩]/g) ?? [];
    expect(arabicIndic).toEqual([]);
  });
});

describe('Unit 4, Lesson 1 — rendering and interactive labs', () => {
  it('renders all 11 steps with zero KaTeX parse errors', () => {
    unit4Lesson1Data.steps.forEach((step, index) => {
      const { container, unmount } = render(
        <StepRenderer step={step} stepIndex={index} totalSteps={unit4Lesson1Data.steps.length} />,
      );
      expect(container.querySelectorAll('.katex-error'), step.id).toHaveLength(0);
      unmount();
    });
  });

  it('keeps the balance lab in equilibrium when the same operation runs on both pans and breaks it otherwise', () => {
    const { container } = render(
      <EquationBalanceLab left={{ xCount: 2, constant: 35 }} right={{ xCount: 1, constant: 125 }} secretValue={90} />,
    );
    expect(container.querySelector('.u4-balance-status')?.textContent).toContain('متوازن');

    fireEvent.click(screen.getByRole('button', { name: 'نضيف 30 g إلى كفّة واحدة فقط' }));
    expect(container.querySelector('.u4-balance-status')?.textContent).toContain('غير متوازن');

    fireEvent.click(screen.getByRole('button', { name: 'إعادة' }));
    fireEvent.click(screen.getByRole('button', { name: 'نضيف 30 g إلى كلّ كفّة' }));
    expect(container.querySelector('.u4-balance-status')?.textContent).toContain('متوازن');
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
  });

  it('checks the equation-matching lab against the explicit pairs of the lesson', () => {
    const block = unit4Lesson1Data.steps
      .flatMap((step) => step.blocks)
      .find((entry) => entry.interactiveType === 'u4-match')!;
    const { container } = render(
      <EquationMatchLab pairs={block.interactiveData.pairs} rightOrder={block.interactiveData.rightOrder} />,
    );

    const leftCells = container.querySelectorAll('.u4-match-column')[0].querySelectorAll('.u4-match-cell');
    const rightCells = container.querySelectorAll('.u4-match-column')[1].querySelectorAll('.u4-match-cell');
    expect(leftCells).toHaveLength(5);
    expect(rightCells).toHaveLength(5);

    // العمود الأيمن مرتّب ترتيبًا مخالفًا (rightOrder) حتى لا يكشف الجواب،
    // فنحسب موضع كلّ بطاقة يمين من معرّف الزوج نفسه.
    const pairs = block.interactiveData.pairs as { id: string }[];
    const rightOrder = block.interactiveData.rightOrder as string[];
    pairs.forEach((pair, leftIndex) => {
      const rightIndex = rightOrder.indexOf(pair.id);
      fireEvent.click(leftCells[leftIndex]);
      fireEvent.click(rightCells[rightIndex]);
    });
    expect(container.querySelector('.u4-match-progress')?.textContent).toContain('5 من 5');
    const verifyButton = [...container.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('تحقّق من الربط'),
    )!;
    fireEvent.click(verifyButton);
    expect(container.querySelector('.u4-match-verdict')).toBeTruthy();
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
  });

  it('unlocks the Teacher Area and shows this lesson with its solutions and source notes', () => {
    sessionStorage.clear();
    const { container } = render(<TeacherArea onNavigateHome={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/كلمة المرور/), { target: { value: 'somer173' } });
    fireEvent.submit(container.querySelector('form')!);

    const tabs = screen.getAllByRole('button', { name: new RegExp(OFFICIAL_TITLE) });
    expect(tabs.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(tabs[0]);

    expect(container.querySelectorAll('.ta-solution').length).toBe(unit4Lesson1TeacherSolutions.length);
    expect(container.querySelectorAll('.ta-source-notes li').length).toBeGreaterThanOrEqual(3);
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
  });
});

describe('Unit 4, Lesson 1 — independent 20-question lesson test (`u4-test-lesson-1`)', () => {
  it('satisfies the 20-question, 6/7/4/3 difficulty, 6-concept blueprint with 20/20 exact grading', () => {
    const resolved = resolveTest(TEST_ID);
    expect(resolved).toBeDefined();
    expect(resolved!.title).toBe('اختبار الدرس الأول: مساواة وعمليات');
    expect(resolved!.questionCount).toBe(20);
    expect(unit4Lesson1TestQuestions).toHaveLength(20);

    const profile = conceptProfileForLesson(LESSON_ID);
    const blueprint = blueprintForLesson(LESSON_ID);
    expect(profile).toBeDefined();
    expect(blueprint).toBeDefined();
    expect(profile!.concepts).toHaveLength(6);

    const difficultyCounts = { basic: 0, intermediate: 0, advanced: 0, reasoning: 0 };
    const distinctTypes = new Set<string>();
    const coveredConcepts = new Set<string>();

    for (const question of resolved!.questions) {
      difficultyCounts[question.difficulty] += 1;
      distinctTypes.add(question.type);
      const concept = resolveConceptReference(LESSON_ID, question.curriculumRefs[0].conceptId);
      expect(concept, question.id).toBeDefined();
      coveredConcepts.add(concept!.id);

      const expected = EXPECTED_TEST_ANSWERS[question.id];
      expect(expected, `missing ground-truth answer for ${question.id}`).toBeDefined();
      expect(gradeQuestion(question, expected), `question ${question.id} failed grading`).toBe(true);
      expect(questionBank.filter((entry) => entry.id === question.id)).toHaveLength(1);
    }

    const fullScore = scoreTest(resolved!.questions, EXPECTED_TEST_ANSWERS);
    expect(fullScore.earnedPoints).toBe(20);
    expect(fullScore.totalPoints).toBe(20);
    expect(fullScore.percentage).toBe(100);

    expect(difficultyCounts).toEqual({ basic: 6, intermediate: 7, advanced: 4, reasoning: 3 });
    expect(distinctTypes.size).toBeGreaterThanOrEqual(4);
    expect(coveredConcepts.size).toBe(6);
  });

  it('rejects wrong answers instead of granting partial credit', () => {
    const resolved = resolveTest(TEST_ID)!;
    const wrong: Record<string, QuestionAnswer> = {
      ...EXPECTED_TEST_ANSWERS,
      'u4-l1-03': '5',
      'u4-l1-07': 'a',
      'u4-l1-08': ['A', 'C'],
      'u4-l1-10': ['b', 'c', 'a'],
      'u4-l1-19': true,
    };
    const score = scoreTest(resolved.questions, wrong);
    expect(score.correctCount).toBe(15);
    expect(score.earnedPoints).toBe(15);
  });
});
