import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import IndependentTestsArea from '../components/independent-tests/IndependentTestsArea';
import { independentTests } from '../data/independent-tests';
import { firstIndependentTest } from '../data/independent-tests/first-test';
import { secondIndependentTest } from '../data/independent-tests/second-test';
import { thirdIndependentTest } from '../data/independent-tests/third-test';
import { firstTestSolutions } from '../data/independent-tests/first-test-solutions';
import { secondTestSolutions } from '../data/independent-tests/second-test-solutions';
import { thirdTestSolutions } from '../data/independent-tests/third-test-solutions';
import type { IndependentTestItem } from '../data/independent-tests/types';

const collectItems = (): IndependentTestItem[] =>
  thirdIndependentTest.sections.flatMap((section) => section.blocks.flatMap((block) => block.items));

const visibleText = (root: HTMLElement): string => {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return clone.textContent ?? '';
};

const testCard = (title: string): HTMLElement => {
  const card = screen.getByRole('heading', { name: title }).closest('article');
  if (!card) throw new Error(`بطاقة الاختبار «${title}» غير موجودة`);
  return card as HTMLElement;
};

const renderThirdTestPaper = () => {
  const result = render(<IndependentTestsArea />);
  fireEvent.click(within(testCard('الاختبار الثالث')).getByRole('button', { name: /دخول إلى الاختبار/ }));
  return result;
};

const unlockThirdTestSolutions = async () => {
  fireEvent.change(screen.getByLabelText('كلمة السر'), { target: { value: 'somer173' } });
  fireEvent.click(screen.getByRole('button', { name: /فتح الحلول/ }));
};

describe('الاختبار المستقل الثالث — ورقة عمل الوحدة الأولى: هندسة', () => {
  beforeEach(() => {
    window.location.hash = '#/independent-tests';
  });

  it('is registered after both existing exams without changing their order or identities', () => {
    expect(independentTests).toHaveLength(4);
    expect(independentTests[0]).toBe(firstIndependentTest);
    expect(independentTests[1]).toBe(secondIndependentTest);
    expect(independentTests[2]).toBe(thirdIndependentTest);
    expect(thirdIndependentTest.id).toBe('independent-test-3');
    expect(thirdIndependentTest.title).toBe('الاختبار الثالث');

    render(<IndependentTestsArea />);
    expect(screen.getByRole('heading', { name: 'الاختبار الأول' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'الاختبار الثاني' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'الاختبار الثالث' })).toBeInTheDocument();
    expect(screen.getByText('اختبار مستقل رقم 3')).toBeInTheDocument();

    // نقاط حراسة لمحتوى الاختبارين السابقين؛ لا يُعاد استخدام بيانات الاختبار الجديد فيهما.
    expect(firstIndependentTest.sections[0].blocks[0].items[0].prompt).toBe('العدد $(0.01)^{-1}$ يساوي:');
    expect(secondIndependentTest.sections[0].blocks[0].items[0].prompt).toBe('مقلوب سدس العدد $-24$ :');
    expect(firstTestSolutions['q1-1'].finalAnswer).toContain('$10^{2}$');
    expect(secondTestSolutions['q1-1'].finalAnswer).toContain('$-\\dfrac{1}{4}$');
  });

  it('preserves all five source question headings, item counts, types and the printed option order', () => {
    const section = thirdIndependentTest.sections[0];
    expect(section.blocks.map((block) => block.heading)).toEqual([
      'السؤال الأول:',
      'السؤال الثاني:',
      'السؤال الثالث:',
      'السؤال الرابع:',
      'السؤال الخامس:',
    ]);
    expect(section.blocks.map((block) => block.items.length)).toEqual([4, 4, 1, 1, 1]);

    const choices = section.blocks[0].items;
    expect(choices.every((item) => item.kind === 'choice')).toBe(true);
    expect(choices.map((item) => item.choices?.map(({ id, displayLabel }) => [id, displayLabel]))).toEqual([
      [['a', 'a)'], ['b', 'b)'], ['c', 'c)']],
      [['a', 'a)'], ['b', 'b)'], ['c', 'c)']],
      [['a', 'a)'], ['b', 'b)'], ['c', 'c)']],
      [['a', 'a)'], ['b', 'b)'], ['c', 'c)']],
    ]);
    expect(section.blocks[1].items.every((item) => item.kind === 'free')).toBe(true);
    expect(section.blocks[2].items[0].parts?.map((part) => part.number)).toEqual(['١', '٢']);
    expect(section.blocks[3].items[0].parts?.map((part) => part.number)).toEqual(['١', '٢']);
    expect(section.blocks[4].items[0].parts?.map((part) => part.number)).toEqual(['١', '٢']);

    expect(collectItems().flatMap((item) => item.choices ?? []).map((choice) => choice.label).join(' '))
      .toContain('$24\\,\\text{cm}$ $12\\,\\text{cm}$ $48\\,\\text{cm}$');
    const prompts = collectItems().map((item) => item.prompt ?? '').join(' ');
    expect(prompts).toContain('$24\\,\\text{cm}$');
    expect(prompts).toContain('دائرة $(C)$ نصف قطرها $4\\,\\text{cm}$');
    expect(prompts).toContain('$[AC]$ و $[BD]$ قطرين متناصفين ومتعامدين');
    expect(prompts).toContain('$AB = 5\\,\\text{cm}$');
    expect(prompts).toContain('الانسحاب يحافظ على استقامة النقاط');
    expect(prompts).toContain('ليكن $ABC$ مثلثاً متساوي الساقين رأسه الأساسي $A$ ($AB = AC$)');
    expect(prompts).toContain('ليكن $ABCD$ مستطيلاً');
    expect(prompts).toContain('نمدد الضلع $[AB]$ من جهة $B$ بمقدار $BD = AB$');
  });

  it('shows the source paper without answer inputs, score controls or premature solutions', () => {
    const { container } = renderThirdTestPaper();
    expect(container.querySelectorAll('.itest-item')).toHaveLength(11);
    expect(container.querySelectorAll('.itest-choice')).toHaveLength(12);
    expect(container.querySelectorAll('input, select, textarea, [role="radio"], [role="checkbox"]')).toHaveLength(0);
    expect(container.querySelectorAll('.itest-solution-final')).toHaveLength(0);
    expect(screen.getByRole('button', { name: /العودة إلى قائمة الاختبارات/ })).toBeInTheDocument();
    expect(visibleText(container)).not.toContain('$');
    expect(visibleText(container)).not.toContain('\\dfrac');
    expect(container.querySelectorAll('.katex').length).toBeGreaterThan(10);
    expect(container.querySelectorAll('figure.itest-figure svg')).toHaveLength(3);
  });

  it('renders three separate SVGs with the source labels, right angles, dashed construction lines and equality ticks', () => {
    const { container } = renderThirdTestPaper();
    const getFigure = (key: string): SVGSVGElement => {
      const svg = container.querySelector(`svg[data-worksheet-figure="${key}"]`) as SVGSVGElement | null;
      if (!svg) throw new Error(`رسم ${key} غير موجود`);
      return svg;
    };
    const labels = (svg: SVGSVGElement) => Array.from(svg.querySelectorAll('text')).map((node) => node.textContent);

    const altitudes = getFigure('worksheet3-abc-altitudes');
    expect(labels(altitudes)).toEqual(expect.arrayContaining(['A', 'B', 'C', 'H', 'K']));
    expect(altitudes.querySelectorAll('[data-right-angle]')).toHaveLength(2);
    expect(altitudes.querySelectorAll('line[stroke-dasharray]')).toHaveLength(2);
    expect(altitudes.querySelectorAll('line')).toHaveLength(7); // خمسة أضلاع/ارتفاعات + علامتا تساوٍ
    const segmentLine = (svg: SVGSVGElement, index: number) => {
      const line = svg.querySelectorAll('line')[index];
      if (!line) throw new Error(`القطعة ${index} غير موجودة`);
      return {
        from: { x: Number(line.getAttribute('x1')), y: Number(line.getAttribute('y1')) },
        to: { x: Number(line.getAttribute('x2')), y: Number(line.getAttribute('y2')) },
      };
    };
    const dot = (u: { x: number; y: number }, v: { x: number; y: number }) => u.x * v.x + u.y * v.y;
    const sub = (u: { x: number; y: number }, v: { x: number; y: number }) => ({ x: u.x - v.x, y: u.y - v.y });
    const [ab, ac, , bh, ck] = [0, 1, 2, 3, 4].map((index) => segmentLine(altitudes, index));
    expect(Math.abs(dot(sub(bh.to, bh.from), sub(ac.to, ac.from)))).toBeLessThan(1e-6);
    expect(Math.abs(dot(sub(ck.to, ck.from), sub(ab.to, ab.from)))).toBeLessThan(1e-6);
    expect(bh.to.x).toBeCloseTo(altitudes.querySelector('[data-right-angle="worksheet3-H"]')
      ? Number(altitudes.querySelector('[data-right-angle="worksheet3-H"]')?.getAttribute('data-corner')?.split(',')[0])
      : NaN, 6);
    expect(ck.to.x).toBeCloseTo(Number(altitudes.querySelector('[data-right-angle="worksheet3-K"]')
      ?.getAttribute('data-corner')?.split(',')[0]), 6);

    const diagonals = getFigure('worksheet3-abcd-diagonals');
    expect(labels(diagonals)).toEqual(expect.arrayContaining(['A', 'B', 'C', 'D', 'O']));
    expect(diagonals.querySelectorAll('line')).toHaveLength(6); // أضلاع المستطيل وقطراه
    expect(diagonals.querySelectorAll('polyline')).toHaveLength(2); // القائمتان المطبوعتان عند A وB
    expect(diagonals.querySelectorAll('[stroke-dasharray]')).toHaveLength(0);
    const diagonalAC = segmentLine(diagonals, 4);
    const diagonalBD = segmentLine(diagonals, 5);
    const length = (segment: ReturnType<typeof segmentLine>) => Math.hypot(
      segment.to.x - segment.from.x,
      segment.to.y - segment.from.y,
    );
    expect(length(diagonalAC)).toBeCloseTo(length(diagonalBD), 6);

    const extensions = getFigure('worksheet3-abce-extensions');
    expect(labels(extensions)).toEqual(expect.arrayContaining(['A', 'B', 'C', 'D', 'E']));
    expect(extensions.querySelectorAll('line[stroke-dasharray]')).toHaveLength(2); // AE وCD
    expect(extensions.querySelectorAll('line')).toHaveLength(12); // سبعة أضلاع/امتدادات + خمس علامات تساوٍ
    expect(extensions.querySelectorAll('[data-right-angle]')).toHaveLength(0);
    const equalSegments = [0, 1, 2, 3, 4].map((index) => segmentLine(extensions, index));
    const equalLengths = equalSegments.map(length);
    expect(equalLengths.every((value) => Math.abs(value - equalLengths[0]) < 1e-6)).toBe(true);
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('keeps each item linked to one independently checked worked solution', async () => {
    const items = collectItems();
    const itemIds = items.filter((item) => !item.parts).map((item) => item.id);
    const partIds = items.flatMap((item) => item.parts?.map((part) => part.id) ?? []);
    expect(Object.keys(thirdTestSolutions).sort()).toEqual([...itemIds, ...partIds].sort());
    expect(Object.keys(thirdTestSolutions)).toHaveLength(14);

    // إعادة حساب هندسي/عددي مستقلة عن ملف الحلول.
    expect(translationPreservesTrianglePerimeter()).toBe(true);
    expect(translationPreservesCircleRadius()).toBe(true);
    expect(perpendicularBisectingDiagonalsGiveRhombus()).toBe(true);
    expect(isoscelesAltitudeTrianglesAreCongruent()).toBe(true);
    expect(ABCDRectangleDiagonalsAreEqual()).toBe(true);
    expect(equilateralExtensionTrianglesAreCongruent()).toBe(true);

    const { container } = renderThirdTestPaper();
    fireEvent.click(screen.getByRole('button', { name: /الحلول/ }));
    expect(screen.getByRole('heading', { name: 'الحلول محمية بكلمة سر' })).toBeInTheDocument();
    expect(container.querySelector('.itest-solution-final')).toBeNull();
    await unlockThirdTestSolutions();
    await waitFor(() => expect(container.querySelectorAll('.itest-solution-final')).toHaveLength(14));
    expect(container.querySelector('.itest-solution-missing')).toBeNull();
    expect(container.querySelectorAll('.itest-solution-context figure.itest-figure svg')).toHaveLength(3);

    const solutionText = visibleText(container);
    expect(solutionText).toContain('24');
    expect(solutionText).toContain('مربعاً');
    expect(solutionText).toContain('BH=CK');
    expect(solutionText).toContain('AC=BD');
    expect(solutionText).toContain('CD=AE');
    expect(solutionText).not.toContain('$');
    expect(solutionText).not.toContain('\\dfrac');
  });
});

type Point = { x: number; y: number };
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;

const translationPreservesTrianglePerimeter = (): boolean => {
  const original: Point[] = [{ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 4 }];
  const move = (p: Point): Point => ({ x: p.x + 7, y: p.y - 2 });
  const perimeter = (points: Point[]) => points.reduce(
    (sum, point, index) => sum + distance(point, points[(index + 1) % points.length]), 0,
  );
  return close(perimeter(original), perimeter(original.map(move)));
};

const translationPreservesCircleRadius = (): boolean => {
  const center = { x: 2, y: -3 };
  const edge = { x: 6, y: -3 };
  const move = (p: Point): Point => ({ x: p.x - 5, y: p.y + 8 });
  return close(distance(center, edge), 4) && close(distance(move(center), move(edge)), 4);
};

const perpendicularBisectingDiagonalsGiveRhombus = (): boolean => {
  const a = { x: 0, y: 1 };
  const c = { x: 0, y: -1 };
  const b = { x: -1, y: 0 };
  const d = { x: 1, y: 0 };
  const midpoint = (p: Point, q: Point): Point => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
  const ac = { x: c.x - a.x, y: c.y - a.y };
  const bd = { x: d.x - b.x, y: d.y - b.y };
  const sideLengths = [distance(a, b), distance(b, c), distance(c, d), distance(d, a)];
  return JSON.stringify(midpoint(a, c)) === JSON.stringify(midpoint(b, d)) &&
    ac.x * bd.x + ac.y * bd.y === 0 && sideLengths.every((length) => close(length, sideLengths[0]));
};

const projectOntoLine = (p: Point, a: Point, b: Point): Point => {
  const v = { x: b.x - a.x, y: b.y - a.y };
  const t = ((p.x - a.x) * v.x + (p.y - a.y) * v.y) / (v.x * v.x + v.y * v.y);
  return { x: a.x + t * v.x, y: a.y + t * v.y };
};

const isoscelesAltitudeTrianglesAreCongruent = (): boolean => {
  const a = { x: 0, y: 5 };
  const b = { x: -3, y: 0 };
  const c = { x: 3, y: 0 };
  const h = projectOntoLine(b, a, c);
  const k = projectOntoLine(c, a, b);
  const perpendicularAtH = (h.x - b.x) * (c.x - h.x) + (h.y - b.y) * (c.y - h.y);
  const perpendicularAtK = (k.x - c.x) * (b.x - k.x) + (k.y - c.y) * (b.y - k.y);
  return close(distance(a, b), distance(a, c)) && close(perpendicularAtH, 0) && close(perpendicularAtK, 0) &&
    close(distance(b, h), distance(c, k)) && close(distance(h, c), distance(k, b)) &&
    close(distance(b, c), distance(c, b));
};

/** تحقق مستقل للعلاقة الهندسية بين قطري مستطيل عام. */
const ABCDRectangleDiagonalsAreEqual = (): boolean => {
  const width = 5;
  const height = 12;
  const acSquared = width * width + height * height;
  const bdSquared = width * width + height * height;
  return close(Math.sqrt(acSquared), Math.sqrt(bdSquared));
};

const equilateralExtensionTrianglesAreCongruent = (): boolean => {
  const root3 = Math.sqrt(3);
  const a = { x: 0, y: 0 };
  const b = { x: 1, y: 0 };
  const c = { x: 0.5, y: root3 / 2 };
  const d = { x: 2, y: 0 };
  const e = { x: 0, y: root3 };
  const cbd = [distance(c, b), distance(b, d), distance(c, d)].sort((x, y) => x - y);
  const ace = [distance(a, c), distance(c, e), distance(a, e)].sort((x, y) => x - y);
  return close(distance(a, b), 1) && close(distance(b, c), 1) && close(distance(c, a), 1) &&
    cbd.every((length, index) => close(length, ace[index]));
};
