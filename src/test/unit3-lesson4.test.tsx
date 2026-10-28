import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../app/App';
import { getLessonById, getUnitById } from '../data/curriculum';
import { unit3Lesson4Data } from '../data/unit3/lesson04';
import { unit3Lesson4TeacherSolutions } from '../data/unit3/lesson04TeacherSolutions';
import sourceAudit from '../data/unit3/lesson04.source-audit.json';
import { StepRenderer } from '../components/lesson/StepRenderer';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { TestRunner } from '../components/tests/TestRunner';
import { TestSolutions } from '../components/tests/TestSolutions';
import { L_SHAPE_GEOMETRY, RECTANGLE_FIGURE_GEOMETRY } from '../components/lesson/Unit3Lesson4Figures';
import { getTestsByType, questionBank, resolveTest } from '../data/tests/registry';
import { conceptProfileForLesson, resolveConceptReference } from '../data/tests/concepts';
import { blueprintForLesson } from '../data/tests/blueprints';
import { gradeQuestion, scoreTest } from '../data/tests/scoring';
import { unit3Lesson4TestQuestions } from '../data/tests/unit3/lesson-4';
import type { QuestionAnswer } from '../data/tests/types';

const UNIT_ID = 'unit-3';
const LESSON_ID = 'u3-lesson-4';
const TEST_ID = 'u3-test-lesson-4';
const OFFICIAL_TITLE = 'نشر (a+b)(c+d)';

/**
 * مفاتيح مستقلة محسوبة يدويًا قبل كتابة الأسئلة (لا تُشتق من الحل):
 *  1) a×d = ad                              2) (a+b)(c+d)
 *  3) 8+10+12+15 = 45                       4) (a+b)k = ak+bk
 *  5) صحيح (k = c+d)                        6) صحيح (مطابقة)
 *  7) نشر 3(x+5) أولًا                      8) 2−3(9) = −25
 *  9) لم يقلب إشارة 15                     10) 2x²+x−10
 * 11) b = −3                               12) 3x²−x−14
 * 13) أ، ب، د                              14) −16x²−8x−1
 * 15) x²+2x+1                             16) −12
 * 17) 6x³−3x²−30x                         18) s4 → s1 → s2 → s3
 * 19) l1→r1, l2→r2, l3→r3, l4→r4        20) x(2x+1)−x(x−3)
 */
const EXPECTED_TEST_ANSWERS: Record<string, QuestionAnswer> = {
  'u3-l4-01': 'a',
  'u3-l4-02': 'a',
  'u3-l4-03': '45',
  'u3-l4-04': 'a',
  'u3-l4-05': true,
  'u3-l4-06': true,
  'u3-l4-07': 'a',
  'u3-l4-08': '-25',
  'u3-l4-09': 'a',
  'u3-l4-10': 'a',
  'u3-l4-11': '-3',
  'u3-l4-12': 'a',
  'u3-l4-13': ['a', 'b', 'd'],
  'u3-l4-14': 'a',
  'u3-l4-15': 'a',
  'u3-l4-16': '-12',
  'u3-l4-17': 'a',
  'u3-l4-18': ['s4', 's1', 's2', 's3'],
  'u3-l4-19': { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
  'u3-l4-20': 'a',
};

const allBlocks = () => unit3Lesson4Data.steps.flatMap((step) => step.blocks);
const sourceBlocks = () => allBlocks().filter((block) => !block.authored);

describe('Unit 3, Lesson 4 — identity, source fidelity, and curriculum safety', () => {
  it('registers Lesson 4 under the official title «نشر (a+b)(c+d)» on pages 54–57', () => {
    const unit = getUnitById(UNIT_ID);
    expect(unit).toBeDefined();
    expect(unit!.number).toBe(3);
    expect(unit!.title).toBe('الحساب بالرموز');
    expect(unit!.lessons.map((l) => l.id)).toEqual([
      'u3-lesson-1', 'u3-lesson-2', 'u3-lesson-3', 'u3-lesson-4', 'u3-lesson-5', 'u3-lesson-6',
    ]);
    expect(unit!.sourcePages).toEqual([46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]);

    const lesson = getLessonById(UNIT_ID, LESSON_ID);
    expect(lesson).toBe(unit3Lesson4Data);
    expect(lesson!.number).toBe(4);
    expect(lesson!.title).toBe(OFFICIAL_TITLE);
    expect(lesson!.sourcePages).toEqual([54, 55, 56, 57]);
    expect(lesson!.steps).toHaveLength(10);
    expect(lesson!.teacherArea).toBeDefined();
  });

  it('keeps the earlier Unit 3 lessons and their tests intact', () => {
    for (const id of ['u3-lesson-1', 'u3-lesson-2', 'u3-lesson-3']) {
      expect(getLessonById(UNIT_ID, id)).toBeDefined();
    }
    expect(resolveTest('u3-test-lesson-1')).toBeDefined();
    expect(resolveTest('u3-test-lesson-2')).toBeDefined();
    expect(resolveTest('u3-test-lesson-3')).toBeDefined();
    expect(getTestsByType('unit').some((test) => test.unitId === 'unit-3')).toBe(false);
  });

  it('maps every audited textbook block (pp.54–57) in exact book order to non-authored blocks', () => {
    expect(sourceAudit.lessonId).toBe(LESSON_ID);
    expect(sourceAudit.sourcePages).toEqual([54, 55, 56, 57]);
    expect(sourceAudit.sourceFiles.map((file) => file.page)).toEqual([54, 55, 56, 57]);
    expect(sourceAudit.unresolvedAmbiguities).toEqual([]);
    expect(sourceAudit.bookBlockSequence.length).toBe(31);
    expect(sourceBlocks().map((block) => block.id)).toEqual(sourceAudit.bookBlockSequence);

    const blockById = new Map(allBlocks().map((block) => [block.id, block]));
    for (const solution of unit3Lesson4TeacherSolutions) {
      const block = blockById.get(solution.blockId);
      expect(block, `Missing block ${solution.blockId} referenced by ${solution.id}`).toBeDefined();
      if (solution.subIndex !== undefined) {
        expect(block!.subItems?.[solution.subIndex], `Missing subItem ${solution.blockId}[${solution.subIndex}]`).toBeDefined();
      }
    }
  });

  it('keeps all four pages in order: activity → proof → learn → examples → check → drills → geometry', () => {
    const ids = sourceBlocks().map((block) => block.id);
    const position = (id: string) => ids.indexOf(id);
    expect(position('p54-activity-header')).toBeLessThan(position('p54-proof-1'));
    expect(position('p54-proof-3')).toBeLessThan(position('p54-learn-rule'));
    expect(position('p54-learn-rule')).toBeLessThan(position('p55-example-1'));
    expect(position('p55-example-1')).toBeLessThan(position('p55-example-2'));
    expect(position('p55-example-2-solution')).toBeLessThan(position('p55-example-3'));
    expect(position('p55-example-3')).toBeLessThan(position('p56-example-4'));
    expect(position('p56-example-4')).toBeLessThan(position('p56-check-1'));
    expect(position('p56-drill-1')).toBeLessThan(position('p56-drill-2'));
    expect(position('p56-drill-2')).toBeLessThan(position('p57-drill-2-q1'));
    expect(position('p57-drill-6')).toBe(ids.length - 1);

    // كل خطوة تشير إلى صفحة من صفحات المصدر، وكل كتلة تحمل مرجعًا للصفحة.
    for (const step of unit3Lesson4Data.steps) {
      expect(step.sourcePages.every((page) => [54, 55, 56, 57].includes(page))).toBe(true);
      for (const block of step.blocks) {
        expect(block.sourceRef.page).toBeGreaterThanOrEqual(54);
        expect(block.sourceRef.page).toBeLessThanOrEqual(57);
        expect(block.sourceRef.section.trim()).not.toBe('');
      }
    }
  });

  it('preserves the printed typo on p.56 verbatim, documents it, and corrects it in an authored block', () => {
    const example = allBlocks().find((block) => block.id === 'p56-example-4')!;
    const lastLine = example.subItems![example.subItems!.length - 1];
    expect(lastLine.math).toBe('A = 2x^2 - 3x + 2');
    expect(lastLine.verifyNote).toContain('x^2 - 3x + 2');

    const correction = allBlocks().find((block) => block.id === 'p56-example-4-typo')!;
    expect(correction.authored).toBe(true);
    expect(correction.mathFormula).toContain('x^2 - 3x + 2');

    const solution = unit3Lesson4TeacherSolutions.find((item) => item.id === 's56-ex4-6')!;
    expect(solution.sourceNote).toContain('خطأ مطبعي');
    expect(solution.finalAnswer).toContain('x^2 - 3x + 2');
    expect(sourceAudit.sourceNotes.some((note) => note.blockId === 'p56-example-4')).toBe(true);
  });

  it('keeps the printed item D = (7x + 55)(8 + 9x) and its verified expansion', () => {
    const drill = allBlocks().find((block) => block.id === 'p56-drill-1')!;
    expect(drill.subItems![3].math).toBe('(7x+55)(8+9x)');
    expect(drill.subItems![3].solution).toBe('63x^2 + 551x + 440');
    expect(sourceAudit.sourceNotes.find((note) => note.blockId === 'p56-drill-1')?.status).toBe('clarified-by-user');
  });

  it('covers every printed exercise item with the exact expressions from the book', () => {
    const byId = (id: string) => allBlocks().find((block) => block.id === id)!;
    expect(byId('p56-check-2').subItems!.map((item) => item.math)).toEqual([
      '(x+5)(x-3)', '(3x-7)(2+x)', '(5x-1)(2x-3)', '(4x-2)(5x-3)',
    ]);
    expect(byId('p56-drill-1').subItems!).toHaveLength(6);
    expect(byId('p57-drill-3').subItems!).toHaveLength(4);
    expect(byId('p57-drill-4').subItems!).toHaveLength(4);
    expect(byId('p57-drill-5').subItems!).toHaveLength(5);
    expect(byId('p57-drill-6').subItems!).toHaveLength(3);
    expect(byId('p57-drill-6').subItems![2].math).toBe('A = (x+1)(x-3) + 3(2x+1)');
    expect(byId('p57-remember').mathFormula).toContain('(a-b)^2 = (a-b)(a-b)');
  });

  it('never leaks Markdown emphasis markers into student-facing lesson text', () => {
    const strings: string[] = [];
    const walk = (value: unknown): void => {
      if (typeof value === 'string') strings.push(value);
      else if (value && typeof value === 'object') Object.values(value as Record<string, unknown>).forEach(walk);
    };
    walk(unit3Lesson4Data.steps);
    expect(strings.filter((text) => text.includes('**'))).toEqual([]);
  });

  it('ships a complete worked solution for every textbook block and sub-item', () => {
    const bySubIndex = new Set(
      unit3Lesson4TeacherSolutions
        .filter((solution) => solution.subIndex !== undefined)
        .map((solution) => `${solution.blockId}#${solution.subIndex}`),
    );
    const wholeBlocks = new Set(
      unit3Lesson4TeacherSolutions
        .filter((solution) => solution.subIndex === undefined)
        .map((solution) => solution.blockId),
    );

    for (const block of sourceBlocks()) {
      if (block.subItems?.length) {
        block.subItems.forEach((_, index) => {
          expect(bySubIndex.has(`${block.id}#${index}`), `No solution for ${block.id}[${index}]`).toBe(true);
        });
      } else {
        expect(wholeBlocks.has(block.id), `No solution for ${block.id}`).toBe(true);
      }
    }

    const expected = sourceBlocks().reduce(
      (sum, block) => sum + (block.subItems?.length ? block.subItems.length : 1),
      0,
    ) + 3; // بنود ورشة المنصة الثلاثة
    expect(unit3Lesson4TeacherSolutions).toHaveLength(expected);
    const platform = unit3Lesson4TeacherSolutions.filter((solution) => solution.id.startsWith('s-plat-'));
    expect(platform).toHaveLength(3);
    for (const solution of platform) {
      expect(solution.group).toContain('المنصة');
      expect(solution.answerOrigin).toBe('مُشتقة من المنصة');
    }
    for (const solution of unit3Lesson4TeacherSolutions) {
      expect(['الكتاب', 'مُشتقة من المنصة']).toContain(solution.answerOrigin);
      expect(solution.steps.length, `${solution.id} needs at least two steps`).toBeGreaterThanOrEqual(2);
      expect(solution.principle.length).toBeGreaterThan(5);
      expect((solution.check ?? '').length).toBeGreaterThan(5);
      expect(solution.finalAnswer.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('Unit 3, Lesson 4 — rendering, figures, widgets, and Teacher Area', () => {
  it('renders all 10 steps with zero KaTeX errors and no raw LaTeX, $, or Markdown leaks', () => {
    unit3Lesson4Data.steps.forEach((step, index) => {
      const { container, unmount } = render(
        <StepRenderer step={step} stepIndex={index} totalSteps={unit3Lesson4Data.steps.length} />,
      );
      expect(container.querySelectorAll('.katex-error'), step.id).toHaveLength(0);
      const visible = container.innerHTML
        .replace(/<annotation[\s\S]*?<\/annotation>/g, '')
        .replace(/<[^>]+>/g, ' ');
      expect(visible, step.id).not.toContain('\\');
      expect(visible, step.id).not.toContain('$');
      expect(visible, step.id).not.toContain('**');
      unmount();
    });
  });

  it('draws the p.54 rectangle in both variants as accessible, responsive SVGs with book labels', () => {
    const dimensions = allBlocks().find((block) => block.id === 'p54-activity-figure')!;
    const areas = allBlocks().find((block) => block.id === 'p54-geometry-note')!;
    expect(dimensions.interactiveType).toBe('u3l4-rectangle-dimensions');
    expect(areas.interactiveType).toBe('u3l4-rectangle-areas');

    const { container, unmount } = render(
      <StepRenderer step={unit3Lesson4Data.steps[0]} stepIndex={0} totalSteps={10} />,
    );
    const figures = container.querySelectorAll('figure.u3l4-rectangle-figure');
    expect(figures).toHaveLength(1);
    const svg = figures[0].querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-labelledby')).toBeTruthy();
    expect(svg.getAttribute('viewBox')).toBe(
      `0 0 ${RECTANGLE_FIGURE_GEOMETRY.viewBoxWidth} ${RECTANGLE_FIGURE_GEOMETRY.viewBoxHeight}`,
    );
    expect((svg as SVGElement).style.width).toBe('100%');
    expect((svg as SVGElement).style.height).toBe('auto');
    expect(figures[0].getAttribute('dir')).toBe('ltr');
    const labels = Array.from(svg.querySelectorAll('text')).map((node) => node.textContent);
    for (const label of ['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd']) {
      expect(labels, `missing label ${label}`).toContain(label);
    }
    unmount();

    const { container: areaContainer, unmount: unmountAreas } = render(
      <StepRenderer step={unit3Lesson4Data.steps[2]} stepIndex={2} totalSteps={10} />,
    );
    const areaSvg = areaContainer.querySelector('figure.u3l4-rectangle-figure svg')!;
    const areaLabels = Array.from(areaSvg.querySelectorAll('text')).map((node) => node.textContent);
    for (const label of ['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd', 'ac', 'bc', 'ad', 'bd']) {
      expect(areaLabels, `missing area label ${label}`).toContain(label);
    }
    expect(areaSvg.querySelectorAll('rect').length).toBeGreaterThanOrEqual(5);
    unmountAreas();
  });

  it('draws the p.57 L-shape with dashed cut-out, measures x / 1 / 3, and all seven vertices', () => {
    const block = allBlocks().find((item) => item.id === 'p57-drill-6')!;
    expect(block.interactiveType).toBe('u3l4-lshape-figure');

    const { container, unmount } = render(
      <StepRenderer step={unit3Lesson4Data.steps[9]} stepIndex={9} totalSteps={10} />,
    );
    const figure = container.querySelector('figure.u3l4-lshape-figure')!;
    expect(figure).toBeTruthy();
    const svg = figure.querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${L_SHAPE_GEOMETRY.viewBoxWidth} ${L_SHAPE_GEOMETRY.viewBoxHeight}`);
    expect((svg as SVGElement).style.width).toBe('100%');
    expect((svg as SVGElement).style.height).toBe('auto');
    const labels = Array.from(svg.querySelectorAll('text')).map((node) => node.textContent);
    for (const vertex of ['A', 'E', 'B', 'G', 'F', 'D', 'C']) {
      expect(labels, `missing vertex ${vertex}`).toContain(vertex);
    }
    for (const measure of ['x', '1', '3']) {
      expect(labels, `missing measure ${measure}`).toContain(measure);
    }
    const dashed = Array.from(svg.querySelectorAll('line')).filter(
      (line) => line.getAttribute('stroke-dasharray') !== null,
    );
    expect(dashed).toHaveLength(3); // حدود المستطيل غير الملوّن AEFG
    expect(svg.querySelector('desc')?.textContent).toContain('2x+1');
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
    unmount();
  });

  it('keeps figure proportions consistent with the printed scans', () => {
    const { left, right, top, bottom, splitX, splitY } = RECTANGLE_FIGURE_GEOMETRY;
    expect(splitX).toBeGreaterThan(left);
    expect(splitX).toBeLessThan(right);
    expect(splitY).toBeGreaterThan(top);
    expect(splitY).toBeLessThan(bottom);

    const { left: l, right: r, top: t, middle, bottom: b, notchX, tickX } = L_SHAPE_GEOMETRY;
    expect(notchX).toBeGreaterThan(l);
    expect(tickX).toBeGreaterThan(notchX);
    expect(tickX).toBeLessThan(r);
    expect(middle).toBeGreaterThan(t);
    expect(middle).toBeLessThan(b);
    // القطعة غير الملونة أعلى اليسار، والشريط السفلي ارتفاعه 3.
    expect(b - middle).toBeLessThan(middle - t);
  });

  it('operates the platform practice-check widget end to end', () => {
    const { container, unmount } = render(
      <StepRenderer step={unit3Lesson4Data.steps[0]} stepIndex={0} totalSteps={10} />,
    );
    const firstQuestion = container.querySelector('.pc-question')!;
    const choices = firstQuestion.querySelectorAll('.pc-choice');
    expect(choices.length).toBe(4);

    // إجابة خاطئة أولًا: تغذية راجعة تصحيحية، لا «أحسنت».
    fireEvent.click(choices[0]);
    expect(firstQuestion.querySelectorAll('.pc-feedback')).toHaveLength(0);
    fireEvent.click(firstQuestion.querySelector('.pc-check-btn')!);
    expect(firstQuestion.querySelector('.pc-feedback-info')).toBeTruthy();
    expect(firstQuestion.querySelector('.pc-feedback-ok')).toBeNull();

    // إعادة المحاولة ثم الإجابة الصحيحة (الخيار الثالث = 4 جداءات).
    fireEvent.click(firstQuestion.querySelector('.pc-retry')!);
    expect(firstQuestion.querySelectorAll('.pc-feedback')).toHaveLength(0);
    fireEvent.click(firstQuestion.querySelectorAll('.pc-choice')[2]);
    fireEvent.click(firstQuestion.querySelector('.pc-check-btn')!);
    expect(firstQuestion.querySelector('.pc-feedback-ok')).toBeTruthy();
    expect(firstQuestion.querySelector('.pc-feedback-ok')?.textContent).toContain('أحسنت');
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
    unmount();
  });

  it('unlocks TeacherArea and displays the «نشر (a+b)(c+d)» tab with all worked solutions', () => {
    sessionStorage.clear();
    const { container } = render(<TeacherArea onNavigateHome={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/كلمة المرور/), { target: { value: 'somer173' } });
    fireEvent.submit(container.querySelector('form')!);
    const tabs = screen.getAllByRole('button', { name: /نشر \(a\+b\)\(c\+d\)/ });
    expect(tabs.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(tabs[0]);
    expect(container.querySelectorAll('.ta-solution')).toHaveLength(unit3Lesson4TeacherSolutions.length);
    expect(container.querySelectorAll('.ta-source-notes li').length).toBeGreaterThanOrEqual(1);
    expect(container.querySelector('.ta-source-notes')?.textContent).toContain('خطأ مطبعي');
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);
  });
});

describe('Unit 3, Lesson 4 — navigation in the real app', () => {
  it('opens the lesson from the unit page and returns to the unit without breaking earlier lessons', () => {
    window.location.hash = `#/unit/${UNIT_ID}/lesson/${LESSON_ID}`;
    const { container, unmount } = render(<App />);
    expect(screen.getByText(/الخطوة 1 من 10/)).toBeInTheDocument();
    expect(container.querySelector('.step-title')?.textContent).toContain('نشاط');
    unmount();

    window.location.hash = `#/unit/${UNIT_ID}`;
    const { container: unitContainer } = render(<App />);
    const links = Array.from(unitContainer.querySelectorAll('a[href*="/lesson/"]')) as HTMLAnchorElement[];
    expect(links).toHaveLength(6);
    expect(links[5].getAttribute('href')).toBe(`#/unit/${UNIT_ID}/lesson/u3-lesson-6`);
    expect(links[4].getAttribute('href')).toBe(`#/unit/${UNIT_ID}/lesson/u3-lesson-5`);
    expect(links[3].getAttribute('href')).toBe(`#/unit/${UNIT_ID}/lesson/${LESSON_ID}`);
    expect(links[2].getAttribute('href')).toBe(`#/unit/${UNIT_ID}/lesson/u3-lesson-3`);
    expect(screen.getByRole('link', { name: /العودة إلى الوحدات/ })).toHaveAttribute('href', '#/');
  });

  it('keeps a direct deep link to a middle step working', () => {
    window.location.hash = `#/unit/${UNIT_ID}/lesson/${LESSON_ID}/9`;
    render(<App />);
    expect(screen.getByText(/الخطوة 9 من 10/)).toBeInTheDocument();
  });
});

describe('Unit 3, Lesson 4 — independent 20-question lesson test (`u3-test-lesson-4`)', () => {
  it('satisfies the 20-question, 6/7/4/3 difficulty, >=4 types, and 6-concept blueprint with 20/20 exact grading', () => {
    const resolved = resolveTest(TEST_ID);
    expect(resolved).toBeDefined();
    expect(resolved!.title).toBe('اختبار الدرس الرابع: نشر (a+b)(c+d)');
    expect(resolved!.questionCount).toBe(20);
    expect(unit3Lesson4TestQuestions).toHaveLength(20);

    const profile = conceptProfileForLesson(LESSON_ID);
    const blueprint = blueprintForLesson(LESSON_ID);
    expect(profile).toBeDefined();
    expect(blueprint).toBeDefined();
    expect(profile!.concepts).toHaveLength(6);
    expect(blueprint!.concepts.reduce((sum, concept) => sum + concept.questionCount, 0)).toBe(20);

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
      expect(questionBank.filter((item) => item.id === question.id)).toHaveLength(1);
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
    const optionButtons = container.querySelectorAll('.test-option');
    expect(optionButtons.length).toBe(4);
    fireEvent.click(optionButtons[0]);
    expect(container.querySelector('.test-question-card')).toBeTruthy();
    expect(container.querySelector('.test-results')).toBeNull();
    expect(container.querySelectorAll('.test-solution-steps, .test-solution-card, .test-solutions')).toHaveLength(0);
    expect(container.querySelector('.test-progress-copy')?.textContent).toContain('إجابات محفوظة: 1');

    fireEvent.click(screen.getByRole('button', { name: /تسليم الاختبار/ }));
    expect(screen.getByText('أحسنت على إكمال الاختبار')).toBeInTheDocument();
    expect(screen.getByLabelText('1 من 20')).toBeInTheDocument();
    expect(container.querySelector('.test-results')).toBeTruthy();
    expect(container.querySelectorAll('.test-solution-steps, .test-solution-card')).toHaveLength(0);
    expect(container.querySelectorAll('.katex-error')).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: /إعادة الاختبار/ }));
    expect(container.querySelector('.test-progress-copy')?.textContent).toContain('إجابات محفوظة: 0');
    expect(container.querySelectorAll('.test-option.is-selected')).toHaveLength(0);
    expect(container.querySelector('.test-question-card')).toBeTruthy();
    expect(container.querySelector('.test-results')).toBeNull();
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
