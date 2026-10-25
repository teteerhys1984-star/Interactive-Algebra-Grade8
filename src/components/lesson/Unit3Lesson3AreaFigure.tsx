import React, { useId } from 'react';

/**
 * رسم السطح المركّب في نشاط «استخدام الحساب الرمزي» (كتاب الطالب، ص52).
 *
 * الشكل كما في الكتاب: مستطيل كبير رؤوسه G (أعلى اليسار) وI (أعلى اليمين)
 * وE (أسفل اليمين) وA (أسفل اليسار)، نُزع من أعلاه يمينه مستطيل H-I-F
 * فبقي سطح ملوّن على شكل L. القياسات المطبوعة: قوس x على الضلع العلوي كله
 * GI، وقوس 8 على GD، وقوس 2 على DA، وقوس y على BE، والضلعان HI وIF
 * مرسومان متقطعين لأن المستطيل الذي يحدّانه غير ملوّن.
 *
 * ملاحظة الوفاء للمصدر: الرسم المطبوع تخطيطي لا مقياسي، وقد قيست نسبه من
 * المسح (267×114 بكسل): ارتفاع القسم العلوي 95 والشريط السفلي 19 (أي 8:2)،
 * وعرض الجزء المقصوص 100 من أصل 267 (≈ 0.37 من العرض). حُفظت هذه النسب هنا.
 */

export const AREA_FIGURE_GEOMETRY = {
  viewBoxWidth: 470,
  viewBoxHeight: 265,
  left: 72,
  right: 422,
  top: 58,
  bottom: 208,
  dividerX: 292,
  dividerY: 178,
} as const;

const { left, right, top, bottom, dividerX, dividerY } = AREA_FIGURE_GEOMETRY;

const BLUE_FILL = '#b6d4ee';
const OUTLINE = '#2f5d4a';
const BRACE = '#c1440e';
const BRACE_LABEL = '#8c2f0a';
const VERTEX = '#12313f';
const DASHED = '#7a8b99';

const mathFont = "'Cambria Math', 'STIX Two Math', 'Times New Roman', serif";

interface Unit3Lesson3AreaFigureProps {
  /** حدّ أقصى لعرض الرسم بالسنتيمترات المنطقية؛ يتقلّص تلقائيًا على الهاتف. */
  maxWidth?: number;
}

/**
 * أقواس معقوفة (كالكتاب) مرسومة بمنحنيات تكعيبية، بلا اعتماد على أي CSS خارجي.
 */
const verticalBrace = (x: number, y0: number, y1: number, depth = 9): string => {
  const mid = (y0 + y1) / 2;
  const upper = (y0 + mid) / 2;
  const lower = (mid + y1) / 2;
  return [
    `M ${x} ${y0}`,
    `C ${x - depth} ${y0} ${x - depth} ${y0 + 4} ${x - depth} ${upper}`,
    `C ${x - depth} ${mid - 4} ${x - depth} ${mid} ${x - depth * 2} ${mid}`,
    `C ${x - depth} ${mid} ${x - depth} ${mid + 4} ${x - depth} ${lower}`,
    `C ${x - depth} ${y1 - 4} ${x - depth} ${y1} ${x} ${y1}`,
  ].join(' ');
};

const horizontalBrace = (y: number, x0: number, x1: number, depth = 9): string => {
  const mid = (x0 + x1) / 2;
  const first = (x0 + mid) / 2;
  const second = (mid + x1) / 2;
  return [
    `M ${x0} ${y}`,
    `C ${x0} ${y - depth} ${x0 + 4} ${y - depth} ${first} ${y - depth}`,
    `C ${mid - 4} ${y - depth} ${mid} ${y - depth} ${mid} ${y - depth * 2}`,
    `C ${mid} ${y - depth} ${mid + 4} ${y - depth} ${second} ${y - depth}`,
    `C ${x1 - 4} ${y - depth} ${x1} ${y - depth} ${x1} ${y}`,
  ].join(' ');
};

const horizontalBraceBelow = (y: number, x0: number, x1: number, depth = 9): string => {
  const mid = (x0 + x1) / 2;
  const first = (x0 + mid) / 2;
  const second = (mid + x1) / 2;
  return [
    `M ${x0} ${y}`,
    `C ${x0} ${y + depth} ${x0 + 4} ${y + depth} ${first} ${y + depth}`,
    `C ${mid - 4} ${y + depth} ${mid} ${y + depth} ${mid} ${y + depth * 2}`,
    `C ${mid} ${y + depth} ${mid + 4} ${y + depth} ${second} ${y + depth}`,
    `C ${x1 - 4} ${y + depth} ${x1} ${y + depth} ${x1} ${y}`,
  ].join(' ');
};

export const Unit3Lesson3AreaFigure: React.FC<Unit3Lesson3AreaFigureProps> = ({ maxWidth = 560 }) => {
  const titleId = useId();
  const descId = useId();

  const blueArea = [
    `M ${left} ${top}`,
    `H ${dividerX}`,
    `V ${dividerY}`,
    `H ${right}`,
    `V ${bottom}`,
    `H ${left}`,
    'Z',
  ].join(' ');

  return (
    <figure
      className="u3l3-area-figure"
      dir="ltr"
      style={{
        margin: '1rem auto',
        padding: 0,
        width: '100%',
        maxWidth: `${maxWidth}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.35rem',
      }}
    >
      <svg
        viewBox={`0 0 ${AREA_FIGURE_GEOMETRY.viewBoxWidth} ${AREA_FIGURE_GEOMETRY.viewBoxHeight}`}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        style={{ width: '100%', height: 'auto', display: 'block', background: '#ffffff' }}
        xmlns="http://www.w3.org/2000/svg"
        fontFamily={mathFont}
      >
        <title id={titleId}>سطح مركّب في نشاط استخدام الحساب الرمزي</title>
        <desc id={descId}>
          مستطيل كبير رؤوسه G و I و E و A. نُزع من أعلى يمينه مستطيل H-I-F بخطوط متقطعة،
          فبقي سطح ملوّن بالأزرق على شكل L: قطعة علوية ارتفاعها 8 وعرضها G-H، وشريط سفلي
          ارتفاعه 2 يمتد على العرض كله A-E. قوس x على الضلع العلوي G-I، وقوس y على الضلع
          السفلي B-E، والقياسان 8 و2 على الضلع الأيسر (G-D ثم D-A).
        </desc>

        {/* السطح الملوّن على شكل L */}
        <path d={blueArea} fill={BLUE_FILL} stroke={OUTLINE} strokeWidth={2.2} strokeLinejoin="round" />

        {/* خطّ D-F الفاصل بين القطعة العلوية والشريط السفلي */}
        <line
          x1={left}
          y1={dividerY}
          x2={dividerX}
          y2={dividerY}
          stroke={OUTLINE}
          strokeWidth={1.8}
        />

        {/* حدود المستطيل غير الملوّن H-I-F (متقطعة كما في الكتاب) */}
        <line x1={dividerX} y1={top} x2={right} y2={top} stroke={DASHED} strokeWidth={1.6} strokeDasharray="7 5" />
        <line x1={right} y1={top} x2={right} y2={dividerY} stroke={DASHED} strokeWidth={1.6} strokeDasharray="7 5" />

        {/* قوس x على الضلع العلوي كله G-I */}
        <path d={horizontalBrace(top - 14, left + 8, right - 8)} fill="none" stroke={BRACE} strokeWidth={1.5} />
        <text x={(left + right) / 2} y={top - 36} fontSize={20} fontStyle="italic" fill={BRACE_LABEL} textAnchor="middle">
          x
        </text>

        {/* قوس 8 على G-D وقوس 2 على D-A */}
        <path d={verticalBrace(left - 18, top + 8, dividerY - 12)} fill="none" stroke={BRACE} strokeWidth={1.5} />
        <text x={left - 46} y={(top + dividerY) / 2 + 6} fontSize={20} fontStyle="italic" fill={BRACE_LABEL} textAnchor="middle">
          8
        </text>
        <path d={verticalBrace(left - 18, dividerY + 12, bottom - 6, 7)} fill="none" stroke={BRACE} strokeWidth={1.5} />
        <text x={left - 46} y={(dividerY + bottom) / 2 + 6} fontSize={20} fontStyle="italic" fill={BRACE_LABEL} textAnchor="middle">
          2
        </text>

        {/* قوس y على B-E */}
        <path d={horizontalBraceBelow(bottom + 12, dividerX + 6, right - 6)} fill="none" stroke={BRACE} strokeWidth={1.5} />
        <text x={(dividerX + right) / 2} y={bottom + 44} fontSize={20} fontStyle="italic" fill={BRACE_LABEL} textAnchor="middle">
          y
        </text>

        {/* أسماء الرؤوس كما في الكتاب */}
        <text x={left - 6} y={top - 6} fontSize={18} fontStyle="italic" fill={VERTEX} textAnchor="end">G</text>
        <text x={dividerX - 8} y={top - 6} fontSize={18} fontStyle="italic" fill={VERTEX} textAnchor="end">H</text>
        <text x={right + 10} y={top + 4} fontSize={18} fontStyle="italic" fill={VERTEX}>I</text>
        <text x={left - 4} y={dividerY - 10} fontSize={18} fontStyle="italic" fill={VERTEX} textAnchor="end">D</text>
        <text x={right + 10} y={dividerY - 6} fontSize={18} fontStyle="italic" fill={VERTEX}>F</text>
        <text x={left - 4} y={bottom + 18} fontSize={18} fontStyle="italic" fill={VERTEX} textAnchor="end">A</text>
        <text x={dividerX - 4} y={bottom + 18} fontSize={18} fontStyle="italic" fill={VERTEX} textAnchor="end">B</text>
        <text x={right + 10} y={bottom + 18} fontSize={18} fontStyle="italic" fill={VERTEX}>E</text>
      </svg>
    </figure>
  );
};
