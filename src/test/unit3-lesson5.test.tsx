import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../app/App';
import { StepRenderer } from '../components/lesson/StepRenderer';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { PRISM_FIGURE_GEOMETRY } from '../components/lesson/Unit3Lesson5Figures';
import { studentClaimValues, Unit3Lesson5SubstitutionLab } from '../components/interactive/Unit3Lesson5SubstitutionLab';
import { TestRunner } from '../components/tests/TestRunner';
import { TestSolutions } from '../components/tests/TestSolutions';
import { getLessonById, getUnitById } from '../data/curriculum';
import { unit3Lesson5Data } from '../data/unit3/lesson05';
import { unit3Lesson5TeacherSolutions } from '../data/unit3/lesson05TeacherSolutions';
import audit from '../data/unit3/lesson05.source-audit.json';
import { blueprintForLesson } from '../data/tests/blueprints';
import { conceptProfileForLesson, resolveConceptReference } from '../data/tests/concepts';
import { auditTestBank, runTestBankAudit } from '../data/tests/audit';
import { getLessonTestId } from '../data/tests/lessonTests';
import { getTestsByType, questionBank, resolveTest } from '../data/tests/registry';
import { gradeQuestion, scoreTest } from '../data/tests/scoring';
import { unit3Lesson5TestQuestions } from '../data/tests/unit3/lesson-5';
import type { QuestionAnswer } from '../data/tests/types';

const blocks = unit3Lesson5Data.steps.flatMap((step) => step.blocks);
const block = (id: string) => {
  const found = blocks.find((entry) => entry.id === id);
  if (!found) throw new Error(`Missing source block ${id}`);
  return found;
};
const sourceBlocks = blocks.filter((entry) => !entry.authored);

// Hand-calculated answers independent of the answer-key implementation.
const expectedAnswers: Record<string, QuestionAnswer> = {
  'u3-l5-01': '2', 'u3-l5-02': 'a', 'u3-l5-03': 'b', 'u3-l5-04': false,
  'u3-l5-05': 'c', 'u3-l5-06': 'a', 'u3-l5-07': '-5', 'u3-l5-08': 'd',
  'u3-l5-09': true, 'u3-l5-10': 'b', 'u3-l5-11': '905', 'u3-l5-12': '400',
  'u3-l5-13': 'c', 'u3-l5-14': '0', 'u3-l5-15': 'd',
  'u3-l5-16': { l1: 'r2', l2: 'r1' }, 'u3-l5-17': '-4.5',
  'u3-l5-18': 'b', 'u3-l5-19': '340', 'u3-l5-20': ['b', 'd'],
};

describe('Unit 3 Lesson 5 — identity, provenance and source fidelity', () => {
  it('registers the final lesson in order without a sixth lesson or a new comprehensive unit test', () => {
    const unit = getUnitById('unit-3')!;
    expect(unit.lessons.map((lesson) => lesson.id)).toEqual([
      'u3-lesson-1', 'u3-lesson-2', 'u3-lesson-3', 'u3-lesson-4', 'u3-lesson-5', 'u3-lesson-6',
    ]);
    expect(unit.sourcePages).toEqual(Array.from({ length: 15 }, (_, i) => i + 46));
    expect(getLessonById('unit-3', 'u3-lesson-5')).toBe(unit3Lesson5Data);
    expect(getLessonById('unit-3', 'u3-lesson-6')).toBeDefined();
    expect(unit3Lesson5Data.title).toBe('اختبار مساواة رمزية');
    expect(unit3Lesson5Data.number).toBe(5);
    expect(unit3Lesson5Data.sourcePages).toEqual([58, 59, 60]);
    expect(unit3Lesson5Data.steps).toHaveLength(8);
    expect(getTestsByType('unit').some((test) => test.unitId === 'unit-3')).toBe(false);
    for (let number = 1; number <= 4; number += 1) {
      expect(getLessonById('unit-3', `u3-lesson-${number}`)).toBeDefined();
      expect(resolveTest(`u3-test-lesson-${number}`)).toBeDefined();
    }
  });

  it('maps the three actual source-image hashes, pages, ordered book blocks and both figure references', () => {
    expect(audit.sourcePages).toEqual([58, 59, 60]);
    expect(audit.sourceFiles.map(({ file, page, sha256 }) => [file, page, sha256])).toEqual([
      ['image-1.png', 58, '754c9d4e5ebf51fa0fcf927988410e19a818f1bc57fd34b27c26647bf35edd8b'],
      ['image-2.png', 59, '25c7aa822c2be6d689e94c8d516b7e3146635c61d95b1e3f45e3d4ed38393962'],
      ['image-3.png', 60, '0ac0d81c126217cc9d8edbc9f3a0e15addf5ee031886e3d1b9bf1a3703e824cd'],
    ]);
    expect(audit.unresolvedAmbiguities).toEqual([]);
    expect(sourceBlocks.map((entry) => entry.id)).toEqual(audit.bookBlockSequence);
    expect(new Set(blocks.map((entry) => entry.id)).size).toBe(blocks.length);
    for (const step of unit3Lesson5Data.steps) {
      expect(step.sourcePages.every((page) => [58, 59, 60].includes(page))).toBe(true);
      for (const entry of step.blocks) {
        expect(step.sourcePages).toContain(entry.sourceRef.page);
        expect(entry.sourceRef.section.trim()).not.toBe('');
        if (entry.authored) expect(entry.sourceRef.section).toBe('شرح المنصة');
      }
    }
    expect(audit.figureReferences).toEqual([
      { page: 60, blockId: 'p60-prism-statement', component: 'Unit3Lesson5PrismFigure', image: 'image-3.png' },
      { page: 60, blockId: 'p60-lina-figure', component: 'Unit3Lesson5DistributionFigure', image: 'image-3.png' },
    ]);
    expect(block(audit.figureReferences[0].blockId).interactiveType).toBe('u3l5-prism-figure');
    expect(block(audit.figureReferences[1].blockId).interactiveType).toBe('u3l5-distribution-figure');
  });

  it('retains the original inconsistent expressions and separates both platform corrections', () => {
    expect(block('p58-activity-statement').mathFormula).toBe('(3x+1)(x+2)=3x^2+6x+2');
    for (const id of ['p58-first-test', 'p58-second-test']) {
      expect(block(id).subItems![0].text).toContain('$x^2+6x+2$');
      expect(block(id).subItems![0].text).not.toContain('$3x^2+6x+2$');
    }
    expect(block('p58-second-test').subItems![0].solution).toBe('12\\ne9');
    expect(block('p58-second-test').subItems![1].solution).toBe('12\\ne11');
    expect(block('p58-printed-discrepancy').authored).toBe(true);
    expect(block('p58-printed-discrepancy').content).toContain('$x^2+6x+2$');
    expect(block('p58-printed-discrepancy').content).toContain('$3x^2+6x+2$');
    // Keep the x=1 results in the hidden solutions and audit rather than revealing them on step 1.
    expect(block('p58-printed-discrepancy').content).not.toContain('عند $x=1$');
    expect(audit.sourceNotes[0].note).toContain('9');
    expect(audit.sourceNotes[0].note).toContain('11');
    expect(block('p59-example-solution').subItems![1].math).toBe('=x^2+5x+x - +5-6x=x^2+5x+x-6x+5');
    expect(block('p59-example-solution').subItems![1].verifyNote).toContain('- +5');
    expect(block('p59-printed-sign-correction').authored).toBe(true);
    expect(block('p59-printed-sign-correction').mathFormula).toBe('x^2+5x+x+5-6x=x^2+5');
    expect(audit.sourceNotes.filter((note) => note.status.includes('inconsistency') || note.status.includes('discrepancy'))).toHaveLength(2);
  });

  it('covers all printed exercises, exact expressions, values, worked examples and named methods', () => {
    expect(block('p58-your-turn').subItems![0].solution).toBe('3x^2+7x+2');
    expect(block('p58-learn-example').mathFormula).toBe('x^2-3x-(x+2x^2)=3x^2-4x');
    expect(block('p58-learn-solution').content).toContain('1-3-(1+2)=-5');
    expect(block('p58-learn-solution').content).toContain('3-4=-1');
    expect(block('p59-example-question').content).toContain('A=(x+1)(x+5)-6x');
    expect(block('p59-example-solution').subItems![3].math).toBe('A=(-30)^2+5=900+5=905');
    expect(block('p60-hassan-work').content).toContain('(x+3)(x+4)=(1+3)(1+4)=4\\times5=20');
    expect(block('p60-hassan-work').content).toContain('x^2+7x+12=1^2+7\\times1+12=1+7+12=20');
    expect(block('p59-special-case').content).toContain('A=x^2+5(x-20)(x^2-x+5)');
    expect(block('p59-special-case').content).toContain('400+0=400');
    expect(block('p59-check-z').content).toContain('$Z=3(5x-1)-4(-2x+3)$');
    expect(block('p59-check-z').subItems!.map((item) => item.solution)).toEqual(['Z=23x-15', 'Z=-15', 'Z=-38', 'Z=0']);
    expect(block('p59-check-z').subItems![3].text).toContain('\\frac{15}{23}');
    expect(block('p59-check-b').content).toContain('$B=x(-x+3)-3(x^2+2x)$');
    expect(block('p59-check-b').subItems!.map((item) => item.solution)).toEqual(['B=-4x^2-3x', 'B=-1', 'B=-22', 'B=-4.5']);
    expect(block('p59-check-b').subItems![3].text).toContain('-1{,}5');
    expect(block('p60-prism-questions').subItems).toHaveLength(3);
    expect(block('p60-prism-questions').subItems![1].solution).toBe('S=6x^2+32x+30');
    expect(block('p60-prism-questions').subItems![2].solution).toContain('340');
    expect(block('p60-hassan-work').content).toContain('4\\times5=20');
    expect(block('p60-wadah-work').content).toContain('x^2+7x+12');
    expect(block('p60-lina-work').content).toContain('x^2+(4+3)x+12');
  });

  it('links every printed block and sub-item to a complete teacher solution, with honest origin tags', () => {
    const keys = unit3Lesson5TeacherSolutions.map((entry) => `${entry.blockId}#${entry.subIndex ?? 'whole'}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(unit3Lesson5TeacherSolutions.map((entry) => entry.id)).size).toBe(keys.length);
    for (const entry of sourceBlocks) {
      const expected = entry.subItems?.length
        ? entry.subItems.map((_, index) => `${entry.id}#${index}`)
        : [`${entry.id}#whole`];
      for (const key of expected) expect(keys, `missing ${key}`).toContain(key);
    }
    for (const solution of unit3Lesson5TeacherSolutions) {
      const source = block(solution.blockId);
      expect(source.authored).not.toBe(true);
      if (solution.subIndex !== undefined) expect(source.subItems?.[solution.subIndex]).toBeDefined();
      expect(solution.steps.length).toBeGreaterThanOrEqual(2);
      expect(solution.finalAnswer.trim()).not.toBe('');
      expect(solution.principle.trim()).not.toBe('');
      expect(solution.check?.trim()).toBeTruthy();
      expect(['الكتاب', 'مُشتقة من المنصة']).toContain(solution.answerOrigin);
    }
    expect(unit3Lesson5TeacherSolutions.find((entry) => entry.id === 's59-example-line-2')?.answerOrigin).toBe('مُشتقة من المنصة');
    expect(unit3Lesson5TeacherSolutions.find((entry) => entry.id === 's60-identity')?.answerOrigin).toBe('مُشتقة من المنصة');
    expect(unit3Lesson5TeacherSolutions.find((entry) => entry.id === 's58-second-1')?.sourceNote).toContain('معامل 3');
    expect(unit3Lesson5Data.teacherArea?.solutions).toBe(unit3Lesson5TeacherSolutions);
  });

  it('independently checks the numerical values, equivalent polynomials and six-face surface area', () => {
    const product = (x: number) => (3 * x + 1) * (x + 2);
    const studentRhs = (x: number) => 3 * x * x + 6 * x + 2;
    const promptRhs = (x: number) => x * x + 6 * x + 2;
    expect([product(0), promptRhs(0), studentRhs(0)]).toEqual([2, 2, 2]);
    expect([product(1), promptRhs(1), studentRhs(1)]).toEqual([12, 9, 11]);
    for (const x of [-3, -1, 0, 1, 2, 5]) {
      expect(product(x)).toBe(3 * x * x + 7 * x + 2);
      expect(x * x - 3 * x - (x + 2 * x * x)).toBeCloseTo(-x * x - 4 * x);
      expect((x + 1) * (x + 5) - 6 * x).toBe(x * x + 5);
      expect(3 * (5 * x - 1) - 4 * (-2 * x + 3)).toBe(23 * x - 15);
      expect(x * (-x + 3) - 3 * (x * x + 2 * x)).toBeCloseTo(-4 * x * x - 3 * x);
      expect((x + 3) * (x + 4)).toBe(x * x + 7 * x + 12);
    }
    const z = (x: number) => 23 * x - 15;
    const b = (x: number) => -4 * x * x - 3 * x;
    expect([z(0), z(-1), z(15 / 23)]).toEqual([-15, -38, 0]);
    expect([b(-1), b(2), b(-1.5)]).toEqual([-1, -22, -4.5]);
    expect((-30) ** 2 + 5).toBe(905);
    expect(20 ** 2 + 5 * (20 - 20) * (20 ** 2 - 20 + 5)).toBe(400);
    for (const x of [0.5, 1, 2, 5]) {
      const face1 = (x + 5) * (x + 3);
      const face2 = x * (x + 5);
      const face3 = x * (x + 3);
      expect(face1).toBe(x * x + 8 * x + 15);
      expect(face2).toBe(x * x + 5 * x);
      expect(face3).toBe(x * x + 3 * x);
      expect(2 * (face1 + face2 + face3)).toBe(6 * x * x + 32 * x + 30);
    }
    expect(6 * 5 ** 2 + 32 * 5 + 30).toBe(340);
  });
});

describe('Unit 3 Lesson 5 — rendering, figures and interaction', () => {
  it('renders all steps and revealed textbook answers without KaTeX or literal markup errors', () => {
    for (const [index, step] of unit3Lesson5Data.steps.entries()) {
      const view = render(<StepRenderer step={step} stepIndex={index} totalSteps={8} />);
      for (const button of view.container.querySelectorAll('button.reveal-btn')) {
        if (button.textContent?.includes('إظهار الحل والخطوات')) fireEvent.click(button);
      }
      expect(view.container.querySelectorAll('.katex-error'), step.id).toHaveLength(0);
      // KaTeX's MathML annotation contains the source TeX for accessibility; it is not visible text.
      const visible = view.container.cloneNode(true) as HTMLElement;
      visible.querySelectorAll('annotation').forEach((annotation) => annotation.remove());
      expect(visible.textContent, step.id).not.toContain('**');
      expect(visible.textContent, step.id).not.toContain('\\frac');
      expect(visible.textContent, step.id).not.toContain('$');
      view.unmount();
    }
  });

  it('renders Wadah and Lina’s printed working as ordered, separate display lines', () => {
    const view = render(<StepRenderer step={unit3Lesson5Data.steps[7]} stepIndex={7} totalSteps={8} />);
    const formulas = (heading: string) => {
      const article = screen.getByRole('heading', { name: heading }).closest('article')!;
      return Array.from(article.querySelectorAll('.math-block-isolated annotation')).map((node) => node.textContent);
    };
    expect(formulas('2. أنجز وضاح هذه المهمة كما يلي')).toEqual([
      '(x+3)(x+4)=x(x+4)+3(x+4)=x\\times x+x\\times4+3\\times x+3\\times4',
      '=x^2+4x+3x+12=x^2+(4+3)x+12=x^2+7x+12',
    ]);
    expect(formulas('إنجاز لينا والسؤال — عنوان تنظيمي من المنصة')).toEqual([
      '=x\\times x+x\\times4+3\\times x+3\\times4',
      '=x^2+(4+3)x+12',
      '=x^2+7x+12',
    ]);
    expect(view.container.querySelectorAll('.katex-error')).toHaveLength(0);
    view.unmount();
  });

  it('draws the prism with exactly the eight vertices, three dimension labels and three hidden edges', () => {
    const view = render(<StepRenderer step={unit3Lesson5Data.steps[6]} stepIndex={6} totalSteps={8} />);
    const svg = view.container.querySelector('figure.u3l5-prism-figure svg')!;
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${PRISM_FIGURE_GEOMETRY.width} ${PRISM_FIGURE_GEOMETRY.height}`);
    expect((svg as SVGElement).style.width).toBe('100%');
    expect((svg as SVGElement).style.height).toBe('auto');
    const labels = Array.from(svg.querySelectorAll('text')).map((node) => node.textContent);
    for (const vertex of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) expect(labels).toContain(vertex);
    for (const measure of ['x', 'x + 3', 'x + 5']) expect(labels).toContain(measure);
    const dashed = Array.from(svg.querySelectorAll('line[stroke-dasharray]'));
    expect(dashed).toHaveLength(3);
    const hiddenEdges = dashed.map((line) => `${line.getAttribute('x1')},${line.getAttribute('y1')}-${line.getAttribute('x2')},${line.getAttribute('y2')}`);
    const { A, D, C, H } = PRISM_FIGURE_GEOMETRY;
    expect(hiddenEdges).toEqual([`${A.join(',')}-${D.join(',')}`, `${D.join(',')}-${C.join(',')}`, `${D.join(',')}-${H.join(',')}`]);
    expect(svg.querySelector('desc')?.textContent).toContain('بالسنتيمترات');
    view.unmount();
  });

  it('draws all four of Lina’s distribution arrows with accessible description', () => {
    const view = render(<StepRenderer step={unit3Lesson5Data.steps[7]} stepIndex={7} totalSteps={8} />);
    const svg = view.container.querySelector('figure.u3l5-distribution-figure svg')!;
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg.querySelector('title')?.textContent).toContain('لينا');
    expect(svg.querySelector('desc')?.textContent).toContain('أربعة أسهم');
    expect(Array.from(svg.querySelectorAll('path[data-product]')).map((path) => path.getAttribute('data-product')))
      .toEqual(['x-x', 'x-4', '3-x', '3-4']);
    view.unmount();
  });

  it('correctly distinguishes accurate computations from equality in the substitution lab', () => {
    expect(studentClaimValues(0)).toEqual({ left: 2, right: 2 });
    expect(studentClaimValues(1)).toEqual({ left: 12, right: 11 });
    const view = render(<Unit3Lesson5SubstitutionLab />);
    const left = screen.getByLabelText('قيمة الطرف الأيسر في المختبر');
    const right = screen.getByLabelText('قيمة الطرف الأيمن في المختبر');
    fireEvent.change(left, { target: { value: '2' } });
    fireEvent.change(right, { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'تحقّق من الطرفين' }));
    expect(screen.getByRole('status')).toHaveTextContent('متساويان');
    expect(screen.getByRole('status')).toHaveTextContent('لا يثبت المطابقة');
    fireEvent.change(screen.getByLabelText('قيمة x في المختبر'), { target: { value: '1' } });
    expect(left).toHaveValue('');
    expect(right).toHaveValue('');
    fireEvent.change(left, { target: { value: '١٢' } });
    fireEvent.change(right, { target: { value: '١١' } });
    fireEvent.click(screen.getByRole('button', { name: 'تحقّق من الطرفين' }));
    expect(screen.getByRole('status')).toHaveTextContent('حسابك صحيح');
    expect(screen.getByRole('status')).toHaveTextContent('مختلفان');
    expect(screen.getByRole('status')).toHaveTextContent('مثال معاكس');
    fireEvent.change(right, { target: { value: '12' } });
    fireEvent.click(screen.getByRole('button', { name: 'تحقّق من الطرفين' }));
    expect(screen.getByRole('status')).toHaveTextContent('راجع التعويض');
    fireEvent.click(screen.getByRole('button', { name: 'إعادة المحاولة' }));
    expect(screen.queryByRole('status')).toBeNull();
    view.unmount();
  });

  it('shows the new lesson and discrepancy notes in the teacher area', () => {
    sessionStorage.setItem('teacher-access-granted', 'true');
    const view = render(<TeacherArea onNavigateHome={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /الدرس 5: اختبار مساواة رمزية/ }));
    expect(view.container.querySelectorAll('.ta-solution')).toHaveLength(unit3Lesson5TeacherSolutions.length);
    expect(view.container.querySelector('.ta-source-notes')?.textContent).toContain('معامل 3');
    expect(view.container.querySelector('.ta-source-notes')?.textContent).toContain('+5');
    expect(view.container.querySelectorAll('.katex-error')).toHaveLength(0);
    view.unmount();
    sessionStorage.clear();
  });

  it('navigates through every step, completes the lesson, returns to the unit and opens its test', async () => {
    window.location.hash = '#/unit/unit-3/lesson/u3-lesson-5';
    const view = render(<App />);
    expect(screen.getByLabelText('الخطوة السابقة')).toBeDisabled();
    for (let step = 2; step <= 8; step += 1) {
      fireEvent.click(screen.getByLabelText('الخطوة التالية'));
      expect(screen.getByText(new RegExp(`الخطوة ${step} من 8`))).toBeInTheDocument();
      if (step === 7) expect(view.container.querySelector('figure.u3l5-prism-figure')).toBeTruthy();
      if (step === 8) expect(view.container.querySelector('figure.u3l5-distribution-figure')).toBeTruthy();
    }
    fireEvent.click(screen.getByLabelText('الخطوة السابقة'));
    expect(screen.getByText(/الخطوة 7 من 8/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('الخطوة التالية'));
    fireEvent.click(screen.getByLabelText('إتمام الدرس'));
    expect(screen.getByText(/مبارك! أتممت بنجاح: اختبار مساواة رمزية/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'العودة إلى قائمة الوحدة' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'اختبار مساواة رمزية' })).toBeInTheDocument());
    fireEvent.click(screen.getByLabelText('فتح مساحة الاختبارات'));
    const testTitle = await screen.findByRole('heading', { name: 'اختبار الدرس الخامس: اختبار مساواة رمزية' });
    const testCard = testTitle.closest('article')!;
    expect(within(testCard).getByText('20 سؤالًا')).toBeInTheDocument();
    fireEvent.click(within(testCard).getByRole('button', { name: 'بدء الاختبار' }));
    await waitFor(() => expect(window.location.hash).toBe('#/tests/run/u3-test-lesson-5'));
    expect(await screen.findByText(/في نشاط ص58، احسب/)).toBeInTheDocument();
    view.unmount();
    sessionStorage.clear();
  });

  it('opens Lesson 5 from the Unit 3 lesson card and supports its last-step deep link', async () => {
    window.location.hash = '#/unit/unit-3';
    const view = render(<App />);
    const heading = screen.getByRole('heading', { name: 'اختبار مساواة رمزية' });
    const lessonLink = heading.closest('article')!.querySelector('a.lesson-cta')!;
    expect(lessonLink).toHaveAttribute('href', '#/unit/unit-3/lesson/u3-lesson-5');
    fireEvent.click(lessonLink);
    await waitFor(() => expect(view.container.querySelector('[data-lesson-id="u3-lesson-5"]')).toBeTruthy());
    expect(screen.getByText(/الخطوة 1 من 8/)).toBeInTheDocument();
    view.unmount();
    window.location.hash = '#/unit/unit-3/lesson/u3-lesson-5/8';
    const deepLink = render(<App />);
    expect(screen.getByText(/الخطوة 8 من 8/)).toBeInTheDocument();
    expect(deepLink.container.querySelector('figure.u3l5-distribution-figure')).toBeTruthy();
    deepLink.unmount();
  });
});

describe('Unit 3 Lesson 5 — source-based 20-question assessment', () => {
  it('maps each assessment question to existing source blocks/sub-items and the registered concept blueprint', () => {
    expect(getLessonTestId('u3-lesson-5')).toBe('u3-test-lesson-5');
    const test = resolveTest('u3-test-lesson-5')!;
    expect(test.questionCount).toBe(20);
    expect(test.questions).toEqual(unit3Lesson5TestQuestions);
    const sources = audit.assessmentQuestionSources as Record<string, string[]>;
    expect(Object.keys(sources).sort()).toEqual(test.questions.map((item) => item.id).sort());
    for (const question of test.questions) {
      expect(questionBank.filter((entry) => entry.id === question.id)).toHaveLength(1);
      expect(resolveConceptReference('u3-lesson-5', question.curriculumRefs[0].conceptId), question.id).toBeDefined();
      expect(sources[question.id].length).toBeGreaterThan(0);
      for (const reference of sources[question.id]) {
        const [id, subIndex] = reference.split('#');
        const source = block(id);
        expect(source.authored, reference).not.toBe(true);
        if (subIndex !== undefined) expect(source.subItems?.[Number(subIndex)], reference).toBeDefined();
      }
      expect(gradeQuestion(question, expectedAnswers[question.id]), question.id).toBe(true);
    }
    expect(scoreTest(test.questions, expectedAnswers).percentage).toBe(100);
    expect(gradeQuestion(test.questions[16], '-9/2')).toBe(true);
    expect(gradeQuestion(test.questions[2], 'a')).toBe(false); // 9 is the other printed expression.
    expect(gradeQuestion(test.questions[19], ['a', 'b', 'd'])).toBe(false);
    expect(conceptProfileForLesson('u3-lesson-5')?.concepts).toHaveLength(6);
    expect(blueprintForLesson('u3-lesson-5')?.concepts.reduce((sum, concept) => sum + concept.questionCount, 0)).toBe(20);
    expect(auditTestBank()).toEqual([]);
    expect(runTestBankAudit().warnings.filter((warning) => warning.includes('u3-test-lesson-5'))).toEqual([]);
  });

  it('runs the registered assessment without revealing answers before submission and renders all solutions', () => {
    const test = resolveTest('u3-test-lesson-5')!;
    const runner = render(<TestRunner test={test} onReturnToTests={() => {}} onOpenSolutions={() => {}} />);
    expect(runner.container.querySelectorAll('.test-solution-card, .test-results')).toHaveLength(0);
    const input = runner.container.querySelector('input')!;
    fireEvent.change(input, { target: { value: '2' } });
    expect(runner.container.querySelectorAll('.test-results')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: /تسليم الاختبار/ }));
    expect(screen.getByLabelText('1 من 20')).toBeInTheDocument();
    runner.unmount();

    const solutions = render(<TestSolutions test={test} onReturnToSolutions={() => {}} onReturnToTests={() => {}} />);
    let count = solutions.container.querySelectorAll('.test-solution-card').length;
    expect(count).toBe(5);
    for (let page = 2; page <= 4; page += 1) {
      fireEvent.click(screen.getByRole('button', { name: /الأسئلة التالية/ }));
      expect(solutions.container.querySelectorAll('.katex-error')).toHaveLength(0);
      count += solutions.container.querySelectorAll('.test-solution-card').length;
    }
    expect(count).toBe(20);
    solutions.unmount();
  });
});
