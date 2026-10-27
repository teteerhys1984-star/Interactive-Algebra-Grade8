import React, { useId } from 'react';
import type { IndependentFigureKey } from '../../data/independent-tests/types';

/**
 * إعادة إنشاء رسم المسألة الثانية (ورقة الاختبار الأول) بـ SVG.
 *
 * الشكل في المصدر: مستطيل ABCD رؤوسه A أعلى اليسار و B أعلى اليمين و C أسفل
 * اليمين و D أسفل اليسار، وعلى ضلعه العلوي النقطة M (بين A و B) وعلى ضلعه
 * السفلي النقطة N (بين D و C). متوازي الأضلاع MBND مرسوم بخطوط متصلة مع
 * قطريه [MN] و [BD] المتقاطعين في مركزه O، أما أجزاء المستطيل الخارجة عن
 * متوازي الأضلاع (AM و AD و BC و NC) فمرسومة بخطوط متقطعة كما في المصدر.
 *
 * القياسات المطبوعة في المصدر: MB = 5 و NC = 3، و AD = 4 مذكورة في نص
 * المعطيات لا على الرسم، فلم تُضف إلى الشكل. والزاويتان القائمتان معلَّمتان
 * عند A وعند C.
 *
 * الرسم تخطيطي (لا مقياسي بالكامل) لكنه يحفظ نسب المصدر: الامتداد الأفقي
 * للضلع MB نحو 5 وحدات وللجزء NC نحو 3، وارتفاع المستطيل 4 وحدات — وهي
 * القيم نفسها المعطاة في المسألة.
 */

const SCALE = 46;
const PAD_LEFT = 58;
const PAD_RIGHT = 62;
const PAD_TOP = 52;
const PAD_BOTTOM = 66;

/** إحداثيات الرياضيات: D=(0,0) و C=(8,0) و B=(8,4) و A=(0,4). */
const MATH_POINTS = {
  A: { x: 0, y: 4 },
  B: { x: 8, y: 4 },
  C: { x: 8, y: 0 },
  D: { x: 0, y: 0 },
  M: { x: 3, y: 4 },
  N: { x: 5, y: 0 },
  O: { x: 4, y: 2 },
} as const;

const WIDTH = PAD_LEFT + 8 * SCALE + PAD_RIGHT;
const HEIGHT = PAD_TOP + 4 * SCALE + PAD_BOTTOM;

const px = (x: number) => PAD_LEFT + x * SCALE;
const py = (y: number) => PAD_TOP + (4 - y) * SCALE;

const pt = (point: { x: number; y: number }) => ({ x: px(point.x), y: py(point.y) });

const P = {
  A: pt(MATH_POINTS.A),
  B: pt(MATH_POINTS.B),
  C: pt(MATH_POINTS.C),
  D: pt(MATH_POINTS.D),
  M: pt(MATH_POINTS.M),
  N: pt(MATH_POINTS.N),
  O: pt(MATH_POINTS.O),
};

const INK = '#0f172a';
const AUX = '#64748b';
const ACCENT_ALGEBRA = '#0f766e';
const ACCENT_GEOMETRY = '#b45309';

interface SegmentProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  dashed?: boolean;
  width?: number;
  color?: string;
}

const Segment: React.FC<SegmentProps> = ({ from, to, dashed = false, width = 1.8, color = INK }) => (
  <line
    x1={from.x}
    y1={from.y}
    x2={to.x}
    y2={to.y}
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeDasharray={dashed ? '6 5' : undefined}
  />
);

/** علامة الزاوية القائمة: مربع صغير في الزاوية، باتجاه داخل الشكل. */
const RightAngle: React.FC<{ corner: { x: number; y: number }; dx: number; dy: number }> = ({
  corner,
  dx,
  dy,
}) => {
  const size = 13;
  return (
    <polyline
      points={`${corner.x + dx * size},${corner.y} ${corner.x + dx * size},${corner.y + dy * size} ${corner.x},${corner.y + dy * size}`}
      fill="none"
      stroke={INK}
      strokeWidth={1.6}
    />
  );
};

const VertexLabel: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
}> = ({ children, x, y, anchor = 'middle' }) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    dominantBaseline="middle"
    fontSize="17"
    fontStyle="italic"
    fontFamily="'Cambria Math', 'STIX Two Math', 'Times New Roman', serif"
    fill={INK}
  >
    {children}
  </text>
);

const MeasureLabel: React.FC<{ children: React.ReactNode; x: number; y: number }> = ({
  children,
  x,
  y,
}) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    dominantBaseline="middle"
    fontSize="17"
    fontFamily="'Cambria Math', 'STIX Two Math', 'Times New Roman', serif"
    fill={INK}
  >
    {children}
  </text>
);

export interface IndependentFigureProps {
  variant: IndependentFigureKey;
  /** وصف نصّي بديل للقارئ الشاشي. */
  title?: string;
}

const DEFAULT_TITLES: Record<IndependentFigureKey, string> = {
  'mbnd-parallelogram': 'متوازي الأضلاع MBND داخل المستطيل ABCD',
  'mbnd-congruence': 'المثلثان MBD و BDN داخل متوازي الأضلاع MBND',
  'mbnd-symmetry': 'المثلثان AMD و BNC متماثلان بالنسبة إلى المركز O',
};

export const MbndParallelogramFigure: React.FC<IndependentFigureProps> = ({ variant, title }) => {
  const titleId = useId();
  const description = title ?? DEFAULT_TITLES[variant];
  const showRectangleFill = variant === 'mbnd-parallelogram';

  return (
    <figure className="itest-figure">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="itest-figure-svg"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>{description}</title>

        {showRectangleFill && (
          <rect
            x={P.A.x}
            y={P.A.y}
            width={P.C.x - P.A.x}
            height={P.D.y - P.A.y}
            fill="#f1f5f9"
            stroke="none"
          />
        )}

        {variant === 'mbnd-congruence' && (
          <>
            <polygon
              points={`${P.M.x},${P.M.y} ${P.B.x},${P.B.y} ${P.D.x},${P.D.y}`}
              fill={ACCENT_ALGEBRA}
              fillOpacity="0.14"
            />
            <polygon
              points={`${P.B.x},${P.B.y} ${P.D.x},${P.D.y} ${P.N.x},${P.N.y}`}
              fill={ACCENT_GEOMETRY}
              fillOpacity="0.16"
            />
          </>
        )}

        {variant === 'mbnd-symmetry' && (
          <>
            <polygon
              points={`${P.A.x},${P.A.y} ${P.M.x},${P.M.y} ${P.D.x},${P.D.y}`}
              fill={ACCENT_ALGEBRA}
              fillOpacity="0.16"
            />
            <polygon
              points={`${P.B.x},${P.B.y} ${P.N.x},${P.N.y} ${P.C.x},${P.C.y}`}
              fill={ACCENT_GEOMETRY}
              fillOpacity="0.16"
            />
          </>
        )}

        {/* أجزاء المستطيل الخارجة عن متوازي الأضلاع (متقطعة كما في المصدر) */}
        <Segment from={P.A} to={P.M} dashed color={AUX} />
        <Segment from={P.A} to={P.D} dashed color={AUX} />
        <Segment from={P.B} to={P.C} dashed color={AUX} />
        <Segment from={P.N} to={P.C} dashed color={AUX} />

        {/* أضلاع متوازي الأضلاع MBND (متصلة، كما في المصدر) */}
        <Segment from={P.M} to={P.B} width={2.4} />
        <Segment from={P.B} to={P.N} width={2.4} />
        <Segment from={P.N} to={P.D} width={2.4} />
        <Segment from={P.D} to={P.M} width={2.4} />

        {/* القطران [MN] و [BD] المتقاطعان في المركز O */}
        <Segment from={P.M} to={P.N} />
        <Segment from={P.B} to={P.D} />

        <RightAngle corner={P.A} dx={1} dy={1} />
        <RightAngle corner={P.C} dx={-1} dy={-1} />

        <circle cx={P.O.x} cy={P.O.y} r="3.1" fill={INK} />

        <VertexLabel x={P.A.x - 15} y={P.A.y - 13} anchor="middle">A</VertexLabel>
        <VertexLabel x={P.M.x} y={P.M.y - 17}>M</VertexLabel>
        <VertexLabel x={P.B.x + 16} y={P.B.y - 13} anchor="middle">B</VertexLabel>
        <VertexLabel x={P.D.x - 15} y={P.D.y + 17}>D</VertexLabel>
        <VertexLabel x={P.N.x} y={P.N.y + 19}>N</VertexLabel>
        <VertexLabel x={P.C.x + 16} y={P.C.y + 17} anchor="middle">C</VertexLabel>
        <VertexLabel x={P.O.x - 14} y={P.O.y + 20} anchor="middle">O</VertexLabel>

        <MeasureLabel x={(P.M.x + P.B.x) / 2} y={P.M.y - 21}>5</MeasureLabel>
        <MeasureLabel x={(P.N.x + P.C.x) / 2} y={P.N.y + 22}>3</MeasureLabel>
      </svg>
      <figcaption className="itest-figure-caption">
        {variant === 'mbnd-parallelogram' && 'الشكل: متوازي الأضلاع MBND مركزه O داخل المستطيل ABCD.'}
        {variant === 'mbnd-congruence' && 'المثلثان MBD (بالأخضر) و BDN (بالبرتقالي) يشتركان في الضلع [BD].'}
        {variant === 'mbnd-symmetry' && 'المثلث AMD (بالأخضر) والمثلث BNC (بالبرتقالي) متماثلان بالنسبة إلى O.'}
      </figcaption>
    </figure>
  );
};

export default MbndParallelogramFigure;
