import React, { useId } from 'react';
import { MathText } from '../math/MathText';

/**
 * رسوم الوحدة الرابعة (كتاب الطالب، ص71 وص72 وص74) — SVG متجاوب بلا CSS خارجي،
 * على النمط نفسه المتّبع في رسوم الوحدة الثالثة.
 *
 *  • ص72: مخططات «حساب ذهني» الأربعة. كل حالة سطران: بلاطات صفراء عليها x
 *    (مساحة كلٍّ منها x متر مربع) ومستطيلات بيضاء تحمل عددًا (مساحتها ذلك العدد).
 *  • ص71: مثلث مساحته A = ½ b h، وفيه الارتفاع h عموديًّا على القاعدة b مع
 *    علامة الزاوية القائمة.
 *  • ص74 (تدرّب ⑥): مستطيل بعداه 15 و x، وعليه 2(x+15) = 42.
 *
 * الرسوم تخطيطية كما في المسح، لا مقياسية. كل رسم يحمل role="img" وعنوانًا
 * ووصفًا نصيًّا لقارئ الشاشة، وdir="ltr" كي لا ينقلب ترتيب الرموز اللاتينية.
 */

const mathFont = "'Cambria Math', 'STIX Two Math', 'Times New Roman', serif";
const OUTLINE = '#2f5d4a';
const LABEL = '#12313f';
const TILE = '#f7d774';
const TILE_BORDER = '#c79a2b';
const MEASURE = '#b23b0e';

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

/* ─────────────────────────────── ص72: مخططات الحساب الذهني ─────────────────────────────── */

interface RowSpec {
  /** How many yellow x-tiles the row shows. */
  tiles: number;
  /** The white rectangle value, when the row has one. */
  constant?: number;
  /** White rectangle placed before the tiles instead of after them. */
  constantFirst?: boolean;
}

interface CaseSpec {
  id: string;
  upper: RowSpec;
  lower: RowSpec;
  /** Equation the diagram encodes — printed as a caption under the case. */
  equation: string;
}

export const MENTAL_CASES: CaseSpec[] = [
  { id: '①', upper: { tiles: 3 }, lower: { tiles: 2, constant: 50 }, equation: '3x = 2x+50' },
  { id: '②', upper: { tiles: 5 }, lower: { tiles: 3, constant: 80, constantFirst: true }, equation: '5x = 80+3x' },
  { id: '③', upper: { tiles: 2, constant: 80 }, lower: { tiles: 0, constant: 120 }, equation: '2x+80 = 120' },
  { id: '④', upper: { tiles: 3, constant: 35 }, lower: { tiles: 2, constant: 62 }, equation: '3x+35 = 2x+62' },
];

const TILE_W = 54;
const TILE_H = 46;
const GAP = 3;

/** One diagram row: yellow x-tiles and (optionally) one white numbered rectangle. */
const TileRow: React.FC<{ row: RowSpec; x: number; y: number }> = ({ row, x, y }) => {
  const parts: React.ReactNode[] = [];
  let cursor = x;
  const drawTile = (key: string) => {
    parts.push(
      <g key={key}>
        <rect x={cursor} y={y} width={TILE_W} height={TILE_H} fill={TILE} stroke={TILE_BORDER} strokeWidth={1.6} />
        <text
          x={cursor + TILE_W / 2}
          y={y + TILE_H / 2 + 8}
          fontSize={22}
          fontStyle="italic"
          fill={LABEL}
          textAnchor="middle"
        >
          x
        </text>
      </g>,
    );
    cursor += TILE_W + GAP;
  };
  const drawConstant = (value: number) => {
    const width = 62;
    parts.push(
      <g key={`c-${value}`}>
        <rect x={cursor} y={y} width={width} height={TILE_H} fill="#ffffff" stroke={OUTLINE} strokeWidth={1.6} />
        <text x={cursor + width / 2} y={y + TILE_H / 2 + 7} fontSize={18} fill={LABEL} textAnchor="middle">
          {value}
        </text>
      </g>,
    );
    cursor += width + GAP;
  };

  if (row.constant !== undefined && row.constantFirst) drawConstant(row.constant);
  for (let index = 0; index < row.tiles; index += 1) drawTile(`t-${index}`);
  if (row.constant !== undefined && !row.constantFirst) drawConstant(row.constant);

  return <g>{parts}</g>;
};

/**
 * مخططات «1. حساب ذهني» — أربع حالات، كل حالة سطران متساويا المساحة.
 * الرسم لا يكشف قيمة x؛ القيمة يكتشفها الطالب من النشاط.
 */
export const Unit4MentalTilesFigure: React.FC<FigureProps> = ({ maxWidth = 520 }) => {
  const titleId = useId();
  const descId = useId();
  const caseHeight = 132;

  return (
    <figure className="u4-tiles-figure" dir="ltr" style={{ ...figureStyle, maxWidth: `${maxWidth}px` }}>
      <svg
        viewBox={`0 0 520 ${caseHeight * MENTAL_CASES.length + 10}`}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        style={svgStyle}
        xmlns="http://www.w3.org/2000/svg"
        fontFamily={mathFont}
      >
        <title id={titleId}>مخططات الحساب الذهني الأربعة — بلاطات x ومستطيلات أعداد</title>
        <desc id={descId}>
          أربع حالات، كل حالة سطران متساويا المساحة: البلاطة الصفراء عليها x مساحتها x متر مربع، والمستطيل الأبيض
          مساحته العدد المكتوب فيه. الحالة الأولى: ثلاثة بلاطات مقابل بلاطتين و50. الثانية: خمس بلاطات مقابل 80
          وثلاث بلاطات. الثالثة: بلاطتان و80 مقابل 120. الرابعة: ثلاث بلاطات و35 مقابل بلاطتين و62.
        </desc>

        {MENTAL_CASES.map((item, index) => {
          const top = index * caseHeight;
          return (
            <g key={item.id}>
              <TileRow row={item.upper} x={72} y={top + 12} />
              <TileRow row={item.lower} x={72} y={top + 12 + TILE_H + 14} />
              <text x={470} y={top + 60} fontSize={22} fill={MEASURE} textAnchor="middle">
                {item.id}
              </text>
              <line
                x1={72}
                y1={top + caseHeight - 26}
                x2={430}
                y2={top + caseHeight - 26}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
            </g>
          );
        })}
      </svg>
      <figcaption style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', textAlign: 'center' }}>
        الشكل نفسه يعرض الطرفين لا الحلّ: قارن مساحتي القطعتين لتستنتج قيمة x.
      </figcaption>
    </figure>
  );
};

/* ─────────────────────────────── ص71: مساحة المثلث ─────────────────────────────── */

/** مثلث مساحته A = ½ b h، مع الارتفاع h عموديًّا على القاعدة b. */
export const Unit4TriangleFigure: React.FC<FigureProps> = ({ maxWidth = 460 }) => {
  const titleId = useId();
  const descId = useId();

  return (
    <figure className="u4-triangle-figure" dir="ltr" style={{ ...figureStyle, maxWidth: `${maxWidth}px` }}>
      <svg
        viewBox="0 0 460 260"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        style={svgStyle}
        xmlns="http://www.w3.org/2000/svg"
        fontFamily={mathFont}
      >
        <title id={titleId}>مثلث قاعدته b وارتفاعه h</title>
        <desc id={descId}>
          مثلث رأسه في الأعلى. القاعدة الأفقية طولها b مميّزة بسهم أخضر مزدوج الرأس أسفل المثلث. الارتفاع h خط
          عمودي أحمر ينزل من الرأس إلى القاعدة، وعند ملتقاهما علامة زاوية قائمة.
        </desc>

        <polygon points="230,40 60,210 400,210" fill="#f2f8f4" stroke={OUTLINE} strokeWidth={2.4} />
        <line x1={230} y1={40} x2={230} y2={210} stroke="#c62828" strokeWidth={2.4} />
        {/* علامة الزاوية القائمة عند القاعدة */}
        <path d="M230 194 h16 v16" fill="none" stroke={OUTLINE} strokeWidth={1.8} />
        <text x={244} y={110} fontSize={24} fontStyle="italic" fill="#c62828">
          h
        </text>

        {/* قياس القاعدة */}
        <line x1={62} y1={232} x2={398} y2={232} stroke="#2e7d32" strokeWidth={1.6} />
        <polyline points="76,226 62,232 76,238" fill="none" stroke="#2e7d32" strokeWidth={1.6} />
        <polyline points="384,226 398,232 384,238" fill="none" stroke="#2e7d32" strokeWidth={1.6} />
        <text x={230} y={254} fontSize={24} fontStyle="italic" fill="#2e7d32" textAnchor="middle">
          b
        </text>
      </svg>
      <figcaption style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', textAlign: 'center' }}>
        مساحة المثلث A = ½ b h — الارتفاع هو المسافة العمودية من الرأس إلى القاعدة.
      </figcaption>
    </figure>
  );
};

/* ─────────────────────────────── ص74: مستطيل المسألة ─────────────────────────────── */

/** مستطيل بعداه 15 و x (تدرّب ⑥ ص74)، ومحيطه 2(x+15) = 42. */
export const Unit4RectangleFigure: React.FC<FigureProps> = ({ maxWidth = 460 }) => {
  const titleId = useId();
  const descId = useId();

  return (
    <figure className="u4-rectangle-figure" dir="ltr" style={{ ...figureStyle, maxWidth: `${maxWidth}px` }}>
      <svg
        viewBox="0 0 460 250"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        style={svgStyle}
        xmlns="http://www.w3.org/2000/svg"
        fontFamily={mathFont}
      >
        <title id={titleId}>مستطيل بعداه 15 و x</title>
        <desc id={descId}>
          مستطيل أخضر فاتح. بعده الأعلى 15 مع سهم مزدوج الرأس، وبعده الأيسر x مع سهم رأسي مزدوج الرأس. والمسألة
          تعطي محيطه 2(x+15) = 42.
        </desc>

        <rect x={110} y={60} width={250} height={120} fill="#d8f0dd" stroke="#2f5d4a" strokeWidth={2.4} />

        {/* القياس الأفقي 15 */}
        <line x1={112} y1={44} x2={358} y2={44} stroke={MEASURE} strokeWidth={1.6} />
        <polyline points="126,38 112,44 126,50" fill="none" stroke={MEASURE} strokeWidth={1.6} />
        <polyline points="344,38 358,44 344,50" fill="none" stroke={MEASURE} strokeWidth={1.6} />
        <text x={235} y={32} fontSize={22} fill={MEASURE} textAnchor="middle">
          15
        </text>

        {/* القياس الرأسي x */}
        <line x1={92} y1={62} x2={92} y2={178} stroke={MEASURE} strokeWidth={1.6} />
        <polyline points="86,76 92,62 98,76" fill="none" stroke={MEASURE} strokeWidth={1.6} />
        <polyline points="86,164 92,178 98,164" fill="none" stroke={MEASURE} strokeWidth={1.6} />
        <text x={68} y={126} fontSize={24} fontStyle="italic" fill={MEASURE} textAnchor="middle">
          x
        </text>
      </svg>
      <figcaption style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', textAlign: 'center' }}>
        البعدان 15 و x بالسنتيمتر — والمساواة 2(x+15) = 42 تعني أنّ المحيط 42 cm.
      </figcaption>
    </figure>
  );
};

/* ─────────────────────────── ص76: جدول تنظيم معطيات المسألة ─────────────────────────── */

/**
 * جدول ص76 («لِتسهيل كتابة هذه المعادلة، نقترح تنظيم جدول…») بعناصر HTML بدل
 * بيئة `array` في KaTeX: العربية داخل `\text{…}` تُنتج تحذيرات مقاييس أحرف
 * («No character metrics for 'ح'…») لأن خطوط KaTeX لا تحوي محارف عربية.
 *
 * ترتيب الأعمدة والصفوف مطابق للمطبوع: العمود الأوّل لعناوين الحالتين، ثم
 * الفتيان ثم الفتيات (كما في الكتاب، تُقرأ الأعمدة من اليمين إلى اليسار).
 */
export const Unit4PartyTable: React.FC = () => {
  const captionId = useId();

  return (
    <figure className="u4-party-table-figure">
      <table className="u4-party-table" aria-labelledby={captionId}>
        <caption id={captionId} className="u4-party-table-caption">
          جدول معطيات مسألة الحفلة (ص76): عدد الفتيان والفتيات في بداية الحفلة ونهايتها.
        </caption>
        <thead>
          <tr>
            <th scope="col" aria-hidden="true"></th>
            <th scope="col">الفتيان</th>
            <th scope="col">الفتيات</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">في بداية الحفلة</th>
            <td><MathText text="$x$" /></td>
            <td><MathText text="$x+3$" /></td>
          </tr>
          <tr>
            <th scope="row">في نهاية الحفلة</th>
            <td><MathText text="$x-4$" /></td>
            <td><MathText text="$2(x-4)$" /></td>
          </tr>
        </tbody>
      </table>
    </figure>
  );
};
