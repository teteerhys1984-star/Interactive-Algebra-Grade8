import React, { useId } from 'react';

/**
 * رسوم الدرس الرابع من الوحدة الثالثة (كتاب الطالب، ص54 وص57) — SVG متجاوب
 * بلا اعتماد على CSS خارجي، تمامًا كرسم نشاط الدرس الثالث.
 *
 *  • ص54: مستطيل النشاط (القياسات a و b و c و d)، ثم المستطيلات الأربعة
 *    الملونة في «توضيح هندسي» بمساحات ac و bc و ad و bd.
 *  • ص57 (تدرّب ⑥): السطح الملوّن على شكل L، وهو المستطيل ABCD ناقص
 *    المستطيل غير الملون AEFG، بقياسات x و 1 و 3.
 *
 * الرسوم المطبوعة تخطيطية لا مقياسية؛ حُفظت نسبها المقيسة من المسح مع جعل
 * التسميات أوضح على شاشات الهاتف. كل رسم يحمل viewBox وrole="img" وعنوانًا
 * ووصفًا نصيًا لقارئ الشاشة، وdir="ltr" كي لا ينقلب ترتيب الرموز اللاتينية.
 */

export const RECTANGLE_FIGURE_GEOMETRY = {
  viewBoxWidth: 520,
  viewBoxHeight: 300,
  left: 72,
  right: 444,
  top: 66,
  bottom: 236,
  splitX: 244,
  splitY: 151,
} as const;

export const L_SHAPE_GEOMETRY = {
  viewBoxWidth: 560,
  viewBoxHeight: 340,
  left: 70,
  right: 430,
  top: 86,
  middle: 200,
  bottom: 282,
  notchX: 252,
  tickX: 386,
} as const;

const mathFont = "'Cambria Math', 'STIX Two Math', 'Times New Roman', serif";
const OUTLINE = '#2f5d4a';
const LABEL = '#12313f';
const MEASURE = '#b23b0e';
const DASHED = '#7a8b99';
const YELLOW = '#f5c542';

const figureStyle: React.CSSProperties = {
  margin: '1rem auto',
  padding: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.35rem',
};

const svgStyle: React.CSSProperties = {
  width: '100%',
  height: 'auto',
  display: 'block',
  background: '#ffffff',
};

interface FigureProps {
  maxWidth?: number;
}

/** خط قياس رأسي برأسَي سهم صغيرين (كأقواس الكتاب). */
const VerticalMeasure: React.FC<{ x: number; y0: number; y1: number; label: string }> = ({ x, y0, y1, label }) => (
  <g>
    {/* إزاحة طفيفة للطرفين حتى لا يتقاطع رأسا سهمين عند نقطة التجزئة. */}
    <line x1={x} y1={y0 + 6} x2={x} y2={y1 - 6} stroke={MEASURE} strokeWidth={1.5} />
    <polyline points={`${x - 5},${y0 + 15} ${x},${y0 + 6} ${x + 5},${y0 + 15}`} fill="none" stroke={MEASURE} strokeWidth={1.5} />
    <polyline points={`${x - 5},${y1 - 15} ${x},${y1 - 6} ${x + 5},${y1 - 15}`} fill="none" stroke={MEASURE} strokeWidth={1.5} />
    <text x={x - 14} y={(y0 + y1) / 2 + 6} fontSize={20} fontStyle="italic" fill={MEASURE} textAnchor="middle">
      {label}
    </text>
  </g>
);

/** خط قياس أفقي برأسَي سهم صغيرين. */
const HorizontalMeasure: React.FC<{ y: number; x0: number; x1: number; label: string }> = ({ y, x0, x1, label }) => (
  <g>
    <line x1={x0 + 6} y1={y} x2={x1 - 6} y2={y} stroke={MEASURE} strokeWidth={1.5} />
    <polyline points={`${x0 + 15},${y - 5} ${x0 + 6},${y} ${x0 + 15},${y + 5}`} fill="none" stroke={MEASURE} strokeWidth={1.5} />
    <polyline points={`${x1 - 15},${y - 5} ${x1 - 6},${y} ${x1 - 15},${y + 5}`} fill="none" stroke={MEASURE} strokeWidth={1.5} />
    <text x={(x0 + x1) / 2} y={y - 10} fontSize={20} fontStyle="italic" fill={MEASURE} textAnchor="middle">
      {label}
    </text>
  </g>
);

export type RectangleFigureVariant = 'dimensions' | 'areas';

/**
 * مستطيل ص54: نسخة «القياسات» (نشاط) ونسخة «المساحات» (توضيح هندسي).
 * تسميات الرؤوس مختلفة بين الشكلين في الكتاب، فحُفظت لكل نسخة تسمياتها.
 */
export const Unit3Lesson4RectangleFigure: React.FC<FigureProps & { variant: RectangleFigureVariant }> = ({
  variant = 'dimensions',
  maxWidth = 520,
}) => {
  const titleId = useId();
  const descId = useId();
  const { left, right, top, bottom, splitX, splitY } = RECTANGLE_FIGURE_GEOMETRY;
  const isAreas = variant === 'areas';

  return (
    <figure className="u3l4-rectangle-figure" dir="ltr" style={{ ...figureStyle, maxWidth: `${maxWidth}px` }}>
      <svg
        viewBox={`0 0 ${RECTANGLE_FIGURE_GEOMETRY.viewBoxWidth} ${RECTANGLE_FIGURE_GEOMETRY.viewBoxHeight}`}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        style={svgStyle}
        xmlns="http://www.w3.org/2000/svg"
        fontFamily={mathFont}
      >
        <title id={titleId}>
          {isAreas ? 'مستطيل مقسوم إلى أربعة مستطيلات ملونة' : 'مستطيل بقياسات a و b و c و d'}
        </title>
        <desc id={descId}>
          {isAreas
            ? 'المستطيل ABCD مقسوم إلى أربعة مستطيلات: ac برتقالي أعلى اليسار، وbc أزرق أعلى اليمين، وad رمادي أسفل اليسار، وbd أصفر أسفل اليمين. الضلع العلوي a ثم b، والضلع الأيسر c ثم d.'
            : 'المستطيل رؤوسه A أعلى اليسار وD أعلى اليمين وB أسفل اليسار وC أسفل اليمين. الضلع العلوي مقسوم إلى c ثم d، والضلع الأيسر إلى a ثم b.'}
        </desc>

        {isAreas && (
          <>
            <rect x={left} y={top} width={splitX - left} height={splitY - top} fill="#f4a261" />
            <rect x={splitX} y={top} width={right - splitX} height={splitY - top} fill="#7fb3d5" />
            <rect x={left} y={splitY} width={splitX - left} height={bottom - splitY} fill="#cbd5e1" />
            <rect x={splitX} y={splitY} width={right - splitX} height={bottom - splitY} fill={YELLOW} />
            <line x1={splitX} y1={top} x2={splitX} y2={bottom} stroke={OUTLINE} strokeWidth={1.8} />
            <line x1={left} y1={splitY} x2={right} y2={splitY} stroke={OUTLINE} strokeWidth={1.8} />
            <text x={(left + splitX) / 2} y={(top + splitY) / 2 + 7} fontSize={22} fill={LABEL} textAnchor="middle">ac</text>
            <text x={(splitX + right) / 2} y={(top + splitY) / 2 + 7} fontSize={22} fill={LABEL} textAnchor="middle">bc</text>
            <text x={(left + splitX) / 2} y={(splitY + bottom) / 2 + 7} fontSize={22} fill={LABEL} textAnchor="middle">ad</text>
            <text x={(splitX + right) / 2} y={(splitY + bottom) / 2 + 7} fontSize={22} fill={LABEL} textAnchor="middle">bd</text>
          </>
        )}

        <rect x={left} y={top} width={right - left} height={bottom - top} fill="none" stroke={OUTLINE} strokeWidth={2.2} />

        {/* علامتا التجزئة على الضلعين (كما في رسم الكتاب) */}
        <line x1={splitX} y1={top - 7} x2={splitX} y2={top + 7} stroke={MEASURE} strokeWidth={2} />
        <line x1={left - 7} y1={splitY} x2={left + 7} y2={splitY} stroke={MEASURE} strokeWidth={2} />

        {/* قياسات الضلع العلوي: c , d في النشاط — a , b في التوضيح الهندسي */}
        <HorizontalMeasure y={top - 26} x0={left} x1={splitX} label={isAreas ? 'a' : 'c'} />
        <HorizontalMeasure y={top - 26} x0={splitX} x1={right} label={isAreas ? 'b' : 'd'} />
        {/* قياسات الضلع الأيسر: a , b في النشاط — c , d في التوضيح الهندسي */}
        <VerticalMeasure x={left - 22} y0={top} y1={splitY} label={isAreas ? 'c' : 'a'} />
        <VerticalMeasure x={left - 22} y0={splitY} y1={bottom} label={isAreas ? 'd' : 'b'} />

        {/* أسماء الرؤوس كما طُبعت (تختلف بين الشكلين) */}
        <text x={left - 6} y={top - 6} fontSize={19} fontStyle="italic" fill={LABEL} textAnchor="end">A</text>
        <text x={right + 8} y={top - 6} fontSize={19} fontStyle="italic" fill={LABEL}>{isAreas ? 'B' : 'D'}</text>
        <text x={left - 6} y={bottom + 20} fontSize={19} fontStyle="italic" fill={LABEL} textAnchor="end">{isAreas ? 'C' : 'B'}</text>
        <text x={right + 8} y={bottom + 20} fontSize={19} fontStyle="italic" fill={LABEL}>{isAreas ? 'D' : 'C'}</text>
      </svg>
    </figure>
  );
};

/** السطح الملوّن على شكل L في تدرّب ⑥ (ص57). */
export const Unit3Lesson4LShapeFigure: React.FC<FigureProps> = ({ maxWidth = 560 }) => {
  const titleId = useId();
  const descId = useId();
  const { left, right, top, middle, bottom, notchX, tickX } = L_SHAPE_GEOMETRY;

  const yellowShape = [
    `M ${notchX} ${top}`,
    `H ${right}`,
    `V ${bottom}`,
    `H ${left}`,
    `V ${middle}`,
    `H ${notchX}`,
    'Z',
  ].join(' ');

  return (
    <figure className="u3l4-lshape-figure" dir="ltr" style={{ ...figureStyle, maxWidth: `${maxWidth}px` }}>
      <svg
        viewBox={`0 0 ${L_SHAPE_GEOMETRY.viewBoxWidth} ${L_SHAPE_GEOMETRY.viewBoxHeight}`}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        style={svgStyle}
        xmlns="http://www.w3.org/2000/svg"
        fontFamily={mathFont}
      >
        <title id={titleId}>سطح ملوّن على شكل L في تمرين ص57</title>
        <desc id={descId}>
          المستطيل الكبير ABCD عرضه 2x+1 وارتفاعه x؛ نُزع من أعلاه يساره المستطيل غير الملون AEFG
          الذي عرضه x وارتفاعه x ناقص 3، فبقي السطح الأصفر. القياسات: x على AE، وx على جزء من EB،
          و1 على الجزء الأخير من EB، وx على BC، و3 على GD.
        </desc>

        <path d={yellowShape} fill={YELLOW} stroke={OUTLINE} strokeWidth={2.2} strokeLinejoin="round" />

        {/* حدود المستطيل غير الملون AEFG (متقطعة كما في الكتاب) */}
        <line x1={left} y1={top} x2={notchX} y2={top} stroke={DASHED} strokeWidth={1.7} strokeDasharray="7 5" />
        <line x1={left} y1={top} x2={left} y2={middle} stroke={DASHED} strokeWidth={1.7} strokeDasharray="7 5" />
        <line x1={left} y1={middle} x2={notchX} y2={middle} stroke={DASHED} strokeWidth={1.7} strokeDasharray="7 5" />
        <line x1={notchX} y1={top} x2={notchX} y2={middle} stroke={OUTLINE} strokeWidth={1.8} />

        {/* قياسات الضلع العلوي: x على AE، ثم x على جزء EB، ثم 1 على الجزء الأخير */}
        <HorizontalMeasure y={top - 24} x0={left} x1={notchX} label="x" />
        <HorizontalMeasure y={top - 24} x0={notchX} x1={tickX} label="x" />
        <line x1={tickX} y1={top - 30} x2={tickX} y2={top - 8} stroke={MEASURE} strokeWidth={1.5} />
        <text x={(tickX + right) / 2} y={top - 32} fontSize={20} fontStyle="italic" fill={MEASURE} textAnchor="middle">1</text>

        {/* القياس الرأسي x على BC والقياس 3 على GD */}
        <VerticalMeasure x={right + 34} y0={top} y1={bottom} label="x" />
        <VerticalMeasure x={left - 24} y0={middle} y1={bottom} label="3" />

        {/* حرف x المطبوع بالأحمر على الحافة اليمنى (كما في الكتاب) */}
        <text x={right - 14} y={(top + bottom) / 2 + 6} fontSize={22} fontStyle="italic" fill={MEASURE} textAnchor="middle">x</text>

        {/* أسماء الرؤوس */}
        <text x={left - 8} y={top - 6} fontSize={19} fontStyle="italic" fill={LABEL} textAnchor="end">A</text>
        <text x={notchX - 6} y={top - 6} fontSize={19} fontStyle="italic" fill={LABEL} textAnchor="end">E</text>
        <text x={right + 8} y={top - 6} fontSize={19} fontStyle="italic" fill={LABEL}>B</text>
        <text x={left - 8} y={middle + 6} fontSize={19} fontStyle="italic" fill={LABEL} textAnchor="end">G</text>
        <text x={notchX - 6} y={middle + 6} fontSize={19} fontStyle="italic" fill={LABEL} textAnchor="end">F</text>
        <text x={left - 8} y={bottom + 20} fontSize={19} fontStyle="italic" fill={LABEL} textAnchor="end">D</text>
        <text x={right + 8} y={bottom + 20} fontSize={19} fontStyle="italic" fill={LABEL}>C</text>
      </svg>
    </figure>
  );
};

export default Unit3Lesson4RectangleFigure;
