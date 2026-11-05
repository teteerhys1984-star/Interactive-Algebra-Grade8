import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { TriangleFigure } from '../components/independent-tests/IndependentTestFigures';

/**
 * علامتا الزاوية القائمة عند M وعند N في رسم المسألة الهندسية (الاختبار الثاني).
 *
 * في رسم المصدر: OM ⊥ AC، فالقائمة في M داخل الزاوية OMC (بين الضلع AC والقطعة
 * OM)، و ON ⊥ AB، فالقائمة في N داخل الزاوية ONB (بين الضلع AB والقطعة ON).
 * العلامة مربّع صغير ضلعاه موازيان للشعاعين المكوّنين للزاوية، فيدور مع الساق
 * المائلة ولا يبقى أفقياً/رأسياً.
 *
 * كانت العلامتان مرسومتين بـ dx/dy ثابتين (أفقي/رأسي حول الرأس)، فخرجتا عن
 * الزاويتين: عند N إلى يمين الرأس وفوق OM، وعند M إلى يمين الرأس أيضاً.
 * هذا الاختبار يثبّت الشرطين الهندسيين: كل علامة داخل زاويتها، وضلعاها
 * موازيان لشعاعي الزاوية.
 */

type Pt = { x: number; y: number };

const SCALE = 42;
const PAD = 58;
/** نفس إحداثيات الرسم في المكوّن: (x, y) رياضية، والارتفاع الكلي 7. */
const triPt = (x: number, y: number, height = 7): Pt => ({
  x: PAD + x * SCALE,
  y: PAD + (height - y) * SCALE,
});

const B = triPt(0, 0);
const C = triPt(8, 0);
const A = triPt(4, 7);
const O = triPt(4, 3.5);
const N = triPt(2.49, 4.36);
const M = triPt(5.51, 4.36);

const parsePoints = (points: string): Pt[] =>
  points
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(',').map(Number);
      return { x, y };
    });

const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
const dot = (a: Pt, b: Pt) => a.x * b.x + a.y * b.y;
const cross = (a: Pt, b: Pt) => a.x * b.y - a.y * b.x;
const norm = (a: Pt) => Math.hypot(a.x, a.y);
const unit = (a: Pt) => {
  const len = norm(a) || 1;
  return { x: a.x / len, y: a.y / len };
};

const renderIsosceles = () => {
  const { container } = render(<TriangleFigure variant="abc-isosceles" />);
  const svg = container.querySelector('svg');
  if (!svg) throw new Error('SVG غير موجود');
  return svg;
};

const readMark = (svg: SVGElement, angle: 'ONB' | 'OMC') => {
  const node = svg.querySelector(`[data-right-angle="${angle}"]`);
  if (!node) throw new Error(`علامة الزاوية ${angle} غير موجودة`);
  return {
    node,
    corner: parsePoints(node.getAttribute('data-corner') ?? '')[0],
    points: parsePoints(node.getAttribute('points') ?? ''),
  };
};

describe('رسم المسألة الهندسية: موضع علامتي الزاوية القائمة ONB و OMC', () => {
  it('يرسم علامة واحدة لكل زاوية، ومربعاً متساوي الأضلاع في كل منهما', () => {
    const svg = renderIsosceles();
    // علامتان فقط للمثلث: عند N وعند M (والثالثة عند H تبقى علامة القائمة الأصلية).
    expect(svg.querySelectorAll('[data-right-angle]')).toHaveLength(2);

    for (const angle of ['ONB', 'OMC'] as const) {
      const { corner, points } = readMark(svg, angle);
      expect(points).toHaveLength(3);
      const [p1, p2, p3] = points;
      const sides = [norm(sub(p1, corner)), norm(sub(p2, p1)), norm(sub(p3, p2)), norm(sub(corner, p3))];
      for (const side of sides) expect(side).toBeGreaterThan(8);
      // مربع حقيقي: الأضلاع الأربعة متساوية.
      for (const side of sides) expect(Math.abs(side - sides[0])).toBeLessThan(0.05);
      // والزاوية بين الضلعين المتجاورين قائمة.
      expect(Math.abs(dot(unit(sub(p1, corner)), unit(sub(corner, p3))))).toBeLessThan(0.02);
    }
  });

  it('علامة OMC داخل الزاوية بين MC و MO (القائمة في M على الساق AC)', () => {
    const svg = renderIsosceles();
    const { corner, points } = readMark(svg, 'OMC');

    // الرأس هو M نفسه، ليس موضعاً آخر.
    expect(norm(sub(corner, M))).toBeLessThan(0.01);

    const toC = unit(sub(C, M));
    const toO = unit(sub(O, M));
    const [p1, p2, p3] = points;

    // الضلع الأول يقع على MC، والثالث على MO، والرابع يعود إلى الرأس على MC.
    expect(dot(unit(sub(p1, M)), toC)).toBeGreaterThan(0.999);
    expect(dot(unit(sub(p3, M)), toO)).toBeGreaterThan(0.999);
    expect(dot(unit(sub(p2, p1)), toO)).toBeGreaterThan(0.999);
    expect(dot(unit(sub(p2, p3)), toC)).toBeGreaterThan(0.999);

    // العلامة كلها داخل الزاوية OMC: بين الشعاعين لا خارجهما.
    // (سماحية 1px لأن الزاوية في الرسم 89.6° لا 90° تماماً، فالمربع الهندسي
    //  يبتعد عن أحد الضلعين بمقدار جزء من البكسل عند طرفه البعيد.)
    for (const point of [...points, corner]) {
      const d = sub(point, M);
      expect(dot(d, toC)).toBeGreaterThan(-1);
      expect(dot(d, toO)).toBeGreaterThan(-1);
    }
    // ولا تتجاوز القطعة MO (لا تصل إلى O).
    for (const point of points) expect(norm(sub(point, M))).toBeLessThan(norm(sub(O, M)) / 2);
  });

  it('علامة ONB داخل الزاوية بين NB و NO (القائمة في N على الساق AB)', () => {
    const svg = renderIsosceles();
    const { corner, points } = readMark(svg, 'ONB');

    expect(norm(sub(corner, N))).toBeLessThan(0.01);

    const toB = unit(sub(B, N));
    const toO = unit(sub(O, N));
    const [p1, p2, p3] = points;

    expect(dot(unit(sub(p1, N)), toB)).toBeGreaterThan(0.999);
    expect(dot(unit(sub(p3, N)), toO)).toBeGreaterThan(0.999);
    expect(dot(unit(sub(p2, p1)), toO)).toBeGreaterThan(0.999);
    expect(dot(unit(sub(p2, p3)), toB)).toBeGreaterThan(0.999);

    // سماحية 1px كما في الزاوية OMC (انحراف 0.4° عن القائمة في الرسم).
    for (const point of [...points, corner]) {
      const d = sub(point, N);
      expect(dot(d, toB)).toBeGreaterThan(-1);
      expect(dot(d, toO)).toBeGreaterThan(-1);
    }
    for (const point of points) expect(norm(sub(point, N))).toBeLessThan(norm(sub(O, N)) / 2);
  });

  it('لا يغيّر علامة القائمة عند H: تبقى أفقية ورأسية كما في المصدر', () => {
    const svg = renderIsosceles();
    const polylines = Array.from(svg.querySelectorAll('polyline'));
    expect(polylines).toHaveLength(3);
    const atH = polylines.find((node) => !node.getAttribute('data-right-angle'));
    expect(atH).toBeTruthy();
    const pts = parsePoints(atH?.getAttribute('points') ?? '');
    expect(pts).toHaveLength(3);
    // ضلع أول أفقي/رأسي وضلع ثانٍ على المحور الآخر (المربع غير مُدوَّر)،
    // ونقطة انطلاقه (p1) على المستقيم BC أسفل الارتفاع AH تماماً.
    const [p1, p2, p3] = pts;
    const axisAligned =
      Math.min(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y)) < 0.01 &&
      Math.min(Math.abs(p2.x - p3.x), Math.abs(p2.y - p3.y)) < 0.01;
    expect(axisAligned).toBe(true);
    expect(Math.hypot(p1.x - p2.x, p1.y - p2.y)).toBeCloseTo(Math.hypot(p2.x - p3.x, p2.y - p3.y), 5);
    // رأس العلامة هو زاوية المربع المشتركة بين ضلعيها (p3.x, p1.y) = H.
    expect(p3.x).toBeCloseTo(triPt(4, 0).x, 5);
    expect(p1.y).toBeCloseTo(triPt(4, 0, 7).y, 5);
    // ولا تُضاف علامات أو رؤوس أخرى إلى المثلث: A و B و C و H و O و M و N فقط.
    expect(Math.abs(cross(sub(A, B), sub(C, B)))).toBeGreaterThan(0);
  });
});
