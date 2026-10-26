import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { getLessonById, getUnitById } from '../data/curriculum';
import { unit3Lesson2Data } from '../data/unit3/lesson02';
import { unit3Lesson2TeacherSolutions } from '../data/unit3/lesson02TeacherSolutions';
import sourceAudit from '../data/unit3/lesson02.source-audit.json';
import { StepRenderer } from '../components/lesson/StepRenderer';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { BalanceSituationLab } from '../components/interactive/BalanceSituationLab';
import { BracketCaseLab } from '../components/interactive/BracketCaseLab';
import { SubstitutionCheckerLab } from '../components/interactive/SubstitutionCheckerLab';
import { TestRunner } from '../components/tests/TestRunner';
import { TestSolutions } from '../components/tests/TestSolutions';
import { getTestsByType, questionBank, resolveTest } from '../data/tests/registry';
import { conceptProfileForLesson, resolveConceptReference } from '../data/tests/concepts';
import { blueprintForLesson } from '../data/tests/blueprints';
import { gradeQuestion, scoreTest } from '../data/tests/scoring';
import { unit3Lesson2TestQuestions } from '../data/tests/unit3/lesson-2';
import type { QuestionAnswer } from '../data/tests/types';

const UNIT_ID = 'unit-3';
const LESSON_ID = 'u3-lesson-2';
const TEST_ID = 'u3-test-lesson-2';
const OFFICIAL_TITLE = 'حذف الأقواس';

/**
 * المفاتيح المستقلة (محسوبة يدويًا قبل بناء الأسئلة — لا تُشتق من الحل):
 *  1) m+(n+4)=m+n+4        2) 7-(3-5)=7-3+5 (الطالب كتب 7-3-5: خطأ)
 *  3) (2a+7)-5: + ضمني      4) (9-4+6)-(3-8)=9-4+6-3+8=16
 *  5) -(4x-9)=-4x+9        6) -6.5-(2.5-9)=-6.5-2.5+9=0
 *  7) 12-(m-5)=12-m+5=17-m (ب وج)   8) 5/6-(1/3+2/6)=1/6
 *  9) (38-127)-(43-96)=38-127-43+96=-36
 * 10) D=6x-(2x-3)=4x+3 عند x=1: 6-(-1)=7
 * 11) (5y-2)-(3y+4)=5y-2-3y-4=2y-6 (الطالب أبقى +4)
 * 12) 8600-2300+1500=7800   13) (3x-8)-(x-11)=2x+3
 * 14) -(7/12-5/4)+1/6=-7/12+15/12+2/12=10/12=5/6
 * 15) -(2t-7)+(5t-3)=3t+4  16) 4x-(x-6)=3x+6 رمزيًا؛ التجربة عند x=2 ليست برهانًا
 * 17) F=(a-2b)-(3a+b)=-2a-3b؛ عند a=4,b=-1: -8+3=-5
 * 18) 9-(4x-1)-(2x+3): b→d→a→c (الأصلية، الحذف، جمع x، النتيجة 7-6x)
 * 19) (x+3)-5=x-2           20) 400+(150-260)=400+150-260=290 (صحيح)
 */
const EXPECTED_TEST_ANSWERS: Record<string, QuestionAnswer> = {
  'u3-l2-01': 'b', // m + (n + 4) = m + n + 4
  'u3-l2-02': false, // 7 - (3 - 5) = 7 - 3 + 5، لا 7 - 3 - 5
  'u3-l2-03': 'a', // القوس في بداية النسق: + ضمني
  'u3-l2-04': '16', // 9 - 4 + 6 - 3 + 8 = 16
  'u3-l2-05': 'c', // -(4x - 9) = -4x + 9
  'u3-l2-06': '0', // -6.5 - 2.5 + 9 = 0
  'u3-l2-07': ['B', 'C'], // 12 - m + 5 و 17 - m
  'u3-l2-08': 'a', // 5/6 - 2/6 - 2/6 = 1/6
  'u3-l2-09': '-36', // 38 + 96 = 134؛ 127 + 43 = 170؛ 134 - 170 = -36
  'u3-l2-10': 'a', // 6(1) - (2 - 3) = 6 + 1 = 7 = 4(1) + 3
  'u3-l2-11': 'a', // +4 تُقلب إلى -4؛ الصواب 2y - 6
  'u3-l2-12': '7800', // 8600 - 2300 = 6300؛ + 1500 = 7800
  'u3-l2-13': 'a', // 3x - 8 - x + 11 = 2x + 3
  'u3-l2-14': '5/6', // -7/12 + 15/12 + 2/12 = 10/12 = 5/6
  'u3-l2-15': 'a', // -2t + 7 + 5t - 3 = 3t + 4
  'u3-l2-16': 'a', // تساوي رمزيًا؛ التجربة العددية عند نقطة ليست برهانًا
  'u3-l2-17': '-5', // -2(4) - 3(-1) = -8 + 3 = -5
  'u3-l2-18': ['b', 'd', 'a', 'c'], // الأصلية → الحذف → جمع x → 7 - 6x
  'u3-l2-19': 'b', // (x + 3) - 5 = x - 2
  'u3-l2-20': true, // 400 + (150 - 260) = 400 + 150 - 260 = 290
};

describe('Unit 3, Lesson 2 — identity, source fidelity, and curriculum safety', () => {
  it('registers Lesson 2 under the official title «حذف الأقواس» on pages 50–51', () => {
    const unit = getUnitById(UNIT_ID);
    expect(unit).toBeDefined();
    expect(unit!.number).toBe(3);
    expect(unit!.title).toBe('الحساب بالرموز');
    // إضافة الدرس الخامس امتدت بصفحات الوحدة إلى 60؛ محتوى الدرس الثاني وترتيبه لم يتغيرا.
    expect(unit!.sourcePages).toEqual([46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]);
    expect(unit!.lessons.map((l) => l.id)).toEqual(['u3-lesson-1', 'u3-lesson-2', 'u3-lesson-3', 'u3-lesson-4', 'u3-lesson-5']);

    const lesson = getLessonById(UNIT_ID, LESSON_ID);
    expect(lesson).toBe(unit3Lesson2Data);
    expect(lesson!.number).toBe(2);
    expect(lesson!.title).toBe(OFFICIAL_TITLE);
    expect(lesson!.title).not.toContain('انطلاقة نشطة');
    expect(lesson!.sourcePages).toEqual([50, 51]);
  });

  it('keeps the Unit 3 comprehensive unit test disabled (no unit-3 unit test exists)', () => {
    expect(getTestsByType('unit').map((t) => t.unitId)).toEqual(['unit-1', 'unit-2']);
    expect(getTestsByType('unit').some((t) => t.unitId === 'unit-3')).toBe(false);
  });

  it('maps the 19 audited textbook blocks (pp.50–51) in exact book order to non-authored blocks', () => {
    expect(sourceAudit.lessonId).toBe(LESSON_ID);
    expect(sourceAudit.sourcePages).toEqual([50, 51]);

    const nonAuthoredBlocks = unit3Lesson2Data.steps
      .flatMap((s) => s.blocks)
      .filter((b) => !b.authored);
    expect(nonAuthoredBlocks.map((b) => b.id)).toEqual(sourceAudit.bookBlockSequence);
    expect(sourceAudit.unresolvedAmbiguities).toEqual([]);

    const allBlocks = unit3Lesson2Data.steps.flatMap((s) => s.blocks);
    const blockById = new Map(allBlocks.map((b) => [b.id, b]));
    for (const sol of unit3Lesson2TeacherSolutions) {
      const block = blockById.get(sol.blockId);
      expect(block, `Missing block ${sol.blockId} referenced by ${sol.id}`).toBeDefined();
      if (!sol.id.startsWith('s-plat-') && sol.subIndex !== undefined) {
        expect(block!.subItems?.[sol.subIndex], `Missing subItem ${sol.blockId}[${sol.subIndex}]`).toBeDefined();
      }
    }
  });

  it('preserves the printed third bullet (a + b) − c = a + b + c verbatim, documents the typo, and corrects it in a platform-authored block', () => {
    const allBlocks = unit3Lesson2Data.steps.flatMap((s) => s.blocks);
    const bullets = allBlocks.find((b) => b.id === 'p50-learn-plus-bullets')!;
    const thirdBullet = bullets.subItems![2];
    // النص المطبوع في الكتاب حُفظ حرفيًا:
    expect(thirdBullet.math).toBe('(a + b) - c = a + b + c');
    expect(thirdBullet.verifyNote).toContain('a + b + c');
    expect(thirdBullet.verifyNote).toContain('a + b - c');

    // التصويب موسوم بـ«شرح المنصة» في الكتلة المباشرة بعده:
    const correction = allBlocks.find((b) => b.id === 'p50-bullet3-typo-note')!;
    expect(correction.authored).toBe(true);
    expect(correction.mathFormula).toContain('(a + b) - c = a + b - c');

    // حلول المعلّم تحمل المصدر نفسه:
    const sol = unit3Lesson2TeacherSolutions.find((s) => s.id === 's50-plus-3')!;
    expect(sol.sourceNote).toContain('خطأ مطبعي');
    expect(sol.finalAnswer).toContain('a + b - c');
  });

  it('ships complete teacher solutions (31 textbook + 4 platform-labeled) with origin tags, principles, and checks', () => {
    expect(unit3Lesson2TeacherSolutions).toHaveLength(35);
    const textbookSols = unit3Lesson2TeacherSolutions.filter((s) => !s.id.startsWith('s-plat-'));
    const platformSols = unit3Lesson2TeacherSolutions.filter((s) => s.id.startsWith('s-plat-'));
    expect(textbookSols).toHaveLength(31);
    expect(platformSols).toHaveLength(4);

    for (const sol of unit3Lesson2TeacherSolutions) {
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

describe('Unit 3, Lesson 2 — step rendering, interactive widgets, and Teacher Area', () => {
  it('renders all 9 steps with zero KaTeX parse errors', () => {
    unit3Lesson2Data.steps.forEach((step, idx) => {
      const { container, unmount } = render(
        <StepRenderer
          step={step}
          stepIndex={idx}
          totalSteps={unit3Lesson2Data.steps.length}
        />,
      );
      expect(container.querySelectorAll('.katex-error'), step.id).toHaveLength(0);
      unmount();
    });
  });

  it('operates BalanceSituationLab, BracketCaseLab, and SubstitutionCheckerLab interactively', () => {
    // 1. BalanceSituationLab: أشر ① و④، اكتب عبارتي سلمي، واحسب الرصيدين
    const balance = render(<BalanceSituationLab />);
    const maherOptions = balance.container.querySelectorAll('.u3l2-option');
    expect(maherOptions.length).toBe(4);
    fireEvent.click(maherOptions[0]); // ①
    fireEvent.click(maherOptions[3]); // ④
    fireEvent.click(balance.container.querySelector('[aria-label="تحقق من اختيار ماهر"]')!);
    let feedbacks = balance.container.querySelectorAll('.u3-lab-feedback.is-ok');
    expect(feedbacks.length).toBe(1);

    const salamiInputs = balance.container.querySelectorAll('.u3l2-input');
    fireEvent.change(salamiInputs[0], { target: { value: '1250 - 350 - 225' } });
    fireEvent.change(salamiInputs[1], { target: { value: '1250 - (350 + 225)' } });
    fireEvent.click(balance.container.querySelector('[aria-label="تحقق من عبارات سلمي"]')!);
    fireEvent.change(salamiInputs[2], { target: { value: '1375' } });
    fireEvent.change(salamiInputs[3], { target: { value: '675' } });
    fireEvent.click(balance.container.querySelector('[aria-label="تحقق من الرصيدين"]')!);

    feedbacks = balance.container.querySelectorAll('.u3-lab-feedback.is-ok');
    expect(feedbacks.length).toBe(3);
    expect(balance.container.querySelector('[data-lab-status="complete"]')).toBeTruthy();

    // كشف الإجابات وإعادة الضبط:
    fireEvent.click(balance.container.querySelector('[aria-label="عرض الإجابات"]')!);
    expect(balance.container.querySelector('.u3l2-reveal')).toBeTruthy();
    fireEvent.click(balance.container.querySelector('[aria-label="إعادة ضبط المختبر"]')!);
    expect(balance.container.querySelectorAll('.u3l2-input')).toHaveLength(4);
    expect((balance.container.querySelectorAll('.u3l2-input')[0] as HTMLInputElement).value).toBe('');
    expect(balance.container.querySelectorAll('.u3-lab-feedback')).toHaveLength(0);
    expect(balance.container.querySelectorAll('.katex-error')).toHaveLength(0);
    balance.unmount();

    // 2. BracketCaseLab: الحالة a + (b + c) ثم c - (a + b)
    const bracket = render(<BracketCaseLab />);
    const signGroup = bracket.container.querySelector('[aria-label="الإشارة المسبقة للقوس"]')!;
    fireEvent.click(signGroup.querySelectorAll('button')[0]); // زائد
    fireEvent.click(bracket.container.querySelector('[aria-label="تحقق من الإشارات"]')!);
    expect(bracket.container.querySelector('.u3-lab-feedback.is-ok')).toBeTruthy();

    // تبديل إلى الحالة c - (a + b): ناقص ثم قلب كلا الحدين
    const pills = bracket.container.querySelectorAll('.u3-preset-pill');
    expect(pills.length).toBe(6);
    fireEvent.click(pills[3]); // c - (a + b)
    const signGroup2 = bracket.container.querySelector('[aria-label="الإشارة المسبقة للقوس"]')!;
    fireEvent.click(signGroup2.querySelectorAll('button')[1]); // ناقص
    const termGroups = bracket.container.querySelectorAll('[aria-label^="إشارة الحد"]');
    fireEvent.click(termGroups[0].querySelectorAll('button')[1]); // −
    fireEvent.click(termGroups[1].querySelectorAll('button')[1]); // −
    fireEvent.click(bracket.container.querySelector('[aria-label="تحقق من الإشارات"]')!);
    expect(bracket.container.querySelector('.u3-lab-feedback.is-ok')).toBeTruthy();
    expect(bracket.container.querySelectorAll('.katex-error')).toHaveLength(0);
    bracket.unmount();

    // 3. SubstitutionCheckerLab: المثال عند x = 1 (كلا الطرفين = 5)
    const checker = render(<SubstitutionCheckerLab />);
    const lhsInput = checker.container.querySelector('[aria-label="قيمة الطرف الأيسر"]') as HTMLInputElement;
    const rhsInput = checker.container.querySelector('[aria-label="قيمة الطرف الأيمن"]') as HTMLInputElement;
    fireEvent.change(lhsInput, { target: { value: '5' } });
    fireEvent.change(rhsInput, { target: { value: '5' } });
    fireEvent.click(checker.container.querySelector('[aria-label="تحقق من قيم الطرفين"]')!);
    expect(checker.container.querySelector('.u3-lab-feedback.is-ok')).toBeTruthy();
    expect(checker.container.querySelectorAll('.katex-error')).toHaveLength(0);
    checker.unmount();
  });

  it('unlocks TeacherArea and displays the «حذف الأقواس» tab with all 35 solutions and source notes', () => {
    sessionStorage.clear();
    const { container } = render(<TeacherArea onNavigateHome={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/كلمة المرور/), { target: { value: 'somer173' } });
    fireEvent.submit(container.querySelector('form')!);

    const tabs = screen.getAllByRole('button', { name: new RegExp(OFFICIAL_TITLE) });
    expect(tabs.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(tabs[0]);

    expect(container.querySelectorAll('.ta-solution')).toHaveLength(35);
    // ملاحظة المصدر الوحيدة (والموثقة) في هذا الدرس: الخطأ المطبعي في البند الثالث من «+»
    expect(container.querySelectorAll('.ta-source-notes li').length).toBeGreaterThanOrEqual(1);
    expect(container.querySelector('.ta-source-notes')?.textContent).toContain('a + b + c');
    expect(container.querySelector('.ta-source-notes')?.textContent).toContain('a + b - c');
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
  });
});

describe('Unit 3, Lesson 2 — independent 20-question lesson test (`u3-test-lesson-2`)', () => {
  it('satisfies the 20-question, 6/7/4/3 difficulty, >=4 types, and 6-concept blueprint with 20/20 exact grading', () => {
    const resolved = resolveTest(TEST_ID);
    expect(resolved).toBeDefined();
    expect(resolved!.title).toBe('اختبار الدرس الثاني: حذف الأقواس');
    expect(resolved!.questionCount).toBe(20);
    expect(unit3Lesson2TestQuestions).toHaveLength(20);

    const profile = conceptProfileForLesson(LESSON_ID);
    const blueprint = blueprintForLesson(LESSON_ID);
    expect(profile).toBeDefined();
    expect(blueprint).toBeDefined();
    expect(profile!.concepts).toHaveLength(6);

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
    expect(coveredConcepts.size).toBe(6);
  });

  it('withholds correctness before submission, scores accurately on submit, and resets cleanly on retry', () => {
    const resolved = resolveTest(TEST_ID)!;
    const { container } = render(
      <TestRunner test={resolved} onReturnToTests={() => {}} onOpenSolutions={() => {}} />,
    );

    // Answer Q1 (single-choice, option b '$m + n + 4$') — must NOT reveal correctness yet
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
