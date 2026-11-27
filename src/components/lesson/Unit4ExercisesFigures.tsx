import React from 'react';
import { MathText } from '../math/MathText';

export type Unit4ExerciseFigureId =
  | 'u4-ex1-rect'
  | 'u4-ex3-circle'
  | 'u4-ex4-blocks'
  | 'u4-ex6-student-work'
  | 'u4-ex7-triangle'
  | 'u4-ex10-perimeters'
  | 'u4-ex16-cuboid'
  | 'u4-ex17-stamp'
  | 'u4-ex19-cycles'
  | 'u4-ex20-triangles'
  | 'u4-ex21-sketch'
  | 'u4-ex22-rect-triangle'
  | 'u4-ex22-solution-rect';

interface Unit4ExercisesFigureProps {
  figureId: Unit4ExerciseFigureId;
}

const DEG = globalThis.Math.PI / 180;

function sectorPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const x1 = cx + r * globalThis.Math.cos(startDeg * DEG);
  const y1 = cy + r * globalThis.Math.sin(startDeg * DEG);
  const x2 = cx + r * globalThis.Math.cos(endDeg * DEG);
  const y2 = cy + r * globalThis.Math.sin(endDeg * DEG);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

/** Q1 ➍: Rectangle with height x and top segments 5, x, 3. */
const Ex1RectFigure: React.FC = () => (
  <figure
    className="u4-figure u4-ex-figure"
    dir="ltr"
    aria-label="مستطيل عرضه x وطوله مقسم إلى ثلاثة أجزاء: 5 و x و 3"
  >
    <svg viewBox="0 0 320 135" role="img">
      <title>مستطيل السؤال 1 الفرع 4</title>
      <rect x="55" y="38" width="225" height="76" fill="#f5ed76" stroke="#3b4990" strokeWidth="2.4" />
      {/* Division ticks along top edge: 5 (75px), x (95px), 3 (55px) */}
      <line x1="130" y1="33" x2="130" y2="43" stroke="#1e293b" strokeWidth="2.2" />
      <line x1="225" y1="33" x2="225" y2="43" stroke="#1e293b" strokeWidth="2.2" />
      <text x="92" y="25" textAnchor="middle" fill="#dc2626" fontSize="17" fontFamily="KaTeX_Main, serif">5</text>
      <text x="177" y="25" textAnchor="middle" fill="#dc2626" fontSize="18" fontStyle="italic" fontFamily="KaTeX_Math, serif">x</text>
      <text x="252" y="25" textAnchor="middle" fill="#dc2626" fontSize="17" fontFamily="KaTeX_Main, serif">3</text>
      <text x="34" y="81" textAnchor="middle" fill="#dc2626" fontSize="18" fontStyle="italic" fontFamily="KaTeX_Math, serif">x</text>
    </svg>
  </figure>
);

/** Q3: Circle divided into a 160° blue sector and 5 equal yellow sectors labeled x. */
const Ex3CircleFigure: React.FC = () => {
  const cx = 140;
  const cy = 122;
  const r = 98;
  // Blue sector spans -70° to +90° (160° on the right). Five yellow sectors span +90° to +290° (40° each).
  const yellowAngles = [90, 130, 170, 210, 250];
  return (
    <figure
      className="u4-figure u4-ex-figure"
      dir="ltr"
      aria-label="قرص دائري مقسم إلى قطاع أزرق قياسه 160 درجة وخمسة قطاعات صفراء متساوية قياس كل منها x"
    >
      <svg viewBox="0 0 280 244" role="img">
        <title>قرص الزوايا في السؤال 3</title>
        <path d={sectorPath(cx, cy, r, -70, 90)} fill="#c6eaf7" stroke="#3b4990" strokeWidth="2" />
        {yellowAngles.map((start) => {
          const mid = start + 20;
          const lx = cx + r * 0.63 * globalThis.Math.cos(mid * DEG);
          const ly = cy + r * 0.63 * globalThis.Math.sin(mid * DEG);
          return (
            <g key={start}>
              <path d={sectorPath(cx, cy, r, start, start + 40)} fill="#f8f2aa" stroke="#3b4990" strokeWidth="1.9" />
              <text
                x={lx.toFixed(1)}
                y={(ly + 5).toFixed(1)}
                textAnchor="middle"
                fill="#dc2626"
                fontSize="17"
                fontStyle="italic"
                fontFamily="KaTeX_Math, serif"
              >
                x
              </text>
            </g>
          );
        })}
        <text x={cx + 46} y={cy + 14} textAnchor="middle" fill="#dc2626" fontSize="19" fontFamily="KaTeX_Main, serif">
          160°
        </text>
      </svg>
    </figure>
  );
};

/** Q4: Two 3D rectangular prism bars of equal volume: 6x + 360 and 4x + 600. */
const Ex4BlocksFigure: React.FC = () => {
  // Exact scale: x = 24px, 360 = 72px, 600 = 120px => both bars have front width 216px!
  const drawBar = (
    ox: number,
    oy: number,
    xCount: number,
    blueWidth: number,
    blueLabel: string,
  ) => {
    const sliceW = 24;
    const h = 64;
    const dx = 18;
    const dy = -11;
    const totalW = xCount * sliceW + blueWidth;
    const yellowTotalW = xCount * sliceW;

    return (
      <g>
        {/* Yellow slices */}
        {Array.from({ length: xCount }, (_, i) => {
          const sx = ox + i * sliceW;
          return (
            <g key={i}>
              <rect x={sx} y={oy} width={sliceW} height={h} fill="#f7f19d" stroke="#1e293b" strokeWidth="1.6" />
              <polygon
                points={`${sx},${oy} ${sx + dx},${oy + dy} ${sx + sliceW + dx},${oy + dy} ${sx + sliceW},${oy}`}
                fill="#fcf8c7"
                stroke="#1e293b"
                strokeWidth="1.4"
              />
              <text
                x={sx + sliceW / 2}
                y={oy + 37}
                textAnchor="middle"
                fill="#dc2626"
                fontSize="14.5"
                fontStyle="italic"
                fontFamily="KaTeX_Math, serif"
              >
                x
              </text>
            </g>
          );
        })}
        {/* Blue block */}
        <rect
          x={ox + yellowTotalW}
          y={oy}
          width={blueWidth}
          height={h}
          fill="#bce6f6"
          stroke="#1e293b"
          strokeWidth="1.7"
        />
        <polygon
          points={`${ox + yellowTotalW},${oy} ${ox + yellowTotalW + dx},${oy + dy} ${ox + totalW + dx},${oy + dy} ${ox + totalW},${oy}`}
          fill="#d9f2fc"
          stroke="#1e293b"
          strokeWidth="1.5"
        />
        <polygon
          points={`${ox + totalW},${oy} ${ox + totalW + dx},${oy + dy} ${ox + totalW + dx},${oy + h + dy} ${ox + totalW},${oy + h}`}
          fill="#a3daf0"
          stroke="#1e293b"
          strokeWidth="1.6"
        />
        <text
          x={ox + yellowTotalW + blueWidth / 2}
          y={oy + 38}
          textAnchor="middle"
          fill="#dc2626"
          fontSize="16"
          fontFamily="KaTeX_Main, serif"
        >
          {blueLabel}
        </text>
      </g>
    );
  };

  return (
    <figure
      className="u4-figure u4-ex-figure u4-ex-figure--wide"
      dir="ltr"
      aria-label="بلاطتان متساويتا الحجم: اليسرى مؤلفة من 6 أجزاء x وجزء حجمه 360، واليمنى مؤلفة من 4 أجزاء x وجزء حجمه 600"
    >
      <svg viewBox="0 0 520 105" role="img">
        <title>البلاطتان المتساويتان في الحجم — السؤال 4</title>
        {drawBar(14, 26, 6, 72, '360')}
        {drawBar(270, 26, 4, 120, '600')}
      </svg>
    </figure>
  );
};

/** Q6: Student's 4 lines of solution paired with the grader's 4 red notes. */
const Ex6StudentWorkFigure: React.FC = () => {
  const rows = [
    {
      math: '$10x + 12 \\times 2x = 2550$',
      note: '( إلام يرمز $x$ ؟ اشرح ما يرمز إليه $2x$ )',
    },
    {
      math: '$34x = 2550$',
      note: '( اكتب التفاصيل التي أوصلتك إلى هذه المساواة )',
    },
    {
      math: '$x = 2550 - 34$',
      note: '( أنت غير موفق في هذه الخطوة )',
    },
    {
      math: '$x = 2516$',
      note: '( عليك بعد الحصول على قيمة $x$، أن تختم الحلّ بجملة تعبر بها عما كان مطلوباً )',
    },
  ];

  return (
    <div className="u4-ex6-notebook" role="region" aria-label="حل التلميذ وملاحظات المصحح في السؤال 6">
      <div className="u4-ex6-heading">حلّ التلميذ وملاحظات المصحّح:</div>
      <div className="u4-ex6-rows">
        {rows.map((row, idx) => (
          <div key={idx} className="u4-ex6-row">
            <span className="u4-ex6-eq" dir="ltr">
              <MathText text={row.math} />
            </span>
            <span className="u4-ex6-note">
              <MathText text={row.note} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Q7: Triangle with sides 15 dm, 11 dm, 21 dm. */
const Ex7TriangleFigure: React.FC = () => (
  <figure
    className="u4-figure u4-ex-figure"
    dir="ltr"
    aria-label="مثلث أطوال أضلاعه 15 ديسيمتر و 11 ديسيمتر و 21 ديسيمتر"
  >
    <svg viewBox="0 0 320 145" role="img">
      <title>مثلث السؤال 7</title>
      <polygon points="34,110 198,22 282,110" fill="#f9f3a8" stroke="#4753a5" strokeWidth="2.2" />
      <text x="96" y="56" textAnchor="middle" fill="#dc2626" fontSize="16" fontFamily="KaTeX_Main, serif">15 dm</text>
      <text x="262" y="60" textAnchor="middle" fill="#dc2626" fontSize="16" fontFamily="KaTeX_Main, serif">11 dm</text>
      <text x="160" y="133" textAnchor="middle" fill="#dc2626" fontSize="16" fontFamily="KaTeX_Main, serif">21 dm</text>
    </svg>
  </figure>
);

/** Q10: Equilateral triangle of side x + 2 and rectangle of dimensions x and x + 1. */
const Ex10PerimetersFigure: React.FC = () => (
  <figure
    className="u4-figure u4-ex-figure u4-ex-figure--wide"
    dir="ltr"
    aria-label="مثلث متساوي الأضلاع طول ضلعه x + 2 ومستطيل بعداه x و x + 1"
  >
    <svg viewBox="0 0 380 155" role="img">
      <title>المثلث المتساوي الأضلاع والمستطيل في السؤال 10</title>
      {/* Equilateral triangle */}
      <polygon points="46,132 108,24 170,132" fill="#f8fafc" stroke="#5b82b8" strokeWidth="2.1" />
      {/* Equal-side tick marks */}
      <line x1="71" y1="74" x2="83" y2="82" stroke="#334155" strokeWidth="1.8" />
      <line x1="133" y1="82" x2="145" y2="74" stroke="#334155" strokeWidth="1.8" />
      <line x1="104" y1="126" x2="111" y2="138" stroke="#334155" strokeWidth="1.8" />
      <text x="44" y="72" textAnchor="middle" fill="#1e293b" fontSize="16" fontFamily="KaTeX_Math, serif">
        x + 2
      </text>

      {/* Rectangle */}
      <rect x="226" y="48" width="122" height="84" fill="#f8fafc" stroke="#5b82b8" strokeWidth="2.1" />
      {/* Right-angle markers */}
      <polyline points="334,48 334,62 348,62" fill="none" stroke="#5b82b8" strokeWidth="1.5" />
      <polyline points="334,132 334,118 348,118" fill="none" stroke="#5b82b8" strokeWidth="1.5" />
      <text x="210" y="95" textAnchor="middle" fill="#1e293b" fontSize="16" fontStyle="italic" fontFamily="KaTeX_Math, serif">
        x
      </text>
      <text x="287" y="38" textAnchor="middle" fill="#1e293b" fontSize="16" fontFamily="KaTeX_Math, serif">
        x + 1
      </text>
    </svg>
  </figure>
);

/** Q16: 3D cuboid ABCD (6 cm × 9 cm × 3 cm) with shaded prism of base AECF, EC = x. */
const Ex16CuboidFigure: React.FC = () => {
  // Top face: A(48,88), B(112,26), C(292,26), D(228,88) -> AD=180 (9cm), AB=(64,-62) (6cm)
  // Vertical drop h = 48 (3cm)
  // E on [BC]: EC = x = 110 -> E(182, 26). F on [AD]: AF = x = 110 -> F(158, 88)
  return (
    <figure
      className="u4-figure u4-ex-figure u4-ex-figure--wide"
      dir="ltr"
      aria-label="متوازي مستطيلات قاعدته ABCD بعداها 6 سم و 9 سم وارتفاعه 3 سم، بداخله موشور قائم قاعدته متوازي الأضلاع AECF حيث EC يساوي x"
    >
      <svg viewBox="0 0 340 175" role="img">
        <title>مجسم السؤال 16 — قصة المجلدات</title>
        {/* Shaded prism AECF */}
        <polygon points="48,88 182,26 292,26 158,88" fill="#a5e0ee" fillOpacity="0.82" />
        <polygon points="48,88 158,88 158,136 48,136" fill="#d9f3f9" fillOpacity="0.85" />
        <polygon points="158,88 292,26 292,74 158,136" fill="#70cadf" fillOpacity="0.82" />

        {/* Hidden dashed edges of cuboid and prism */}
        <line x1="112" y1="26" x2="112" y2="74" stroke="#475569" strokeWidth="1.4" strokeDasharray="3,3" />
        <line x1="48" y1="136" x2="112" y2="74" stroke="#475569" strokeWidth="1.4" strokeDasharray="3,3" />
        <line x1="112" y1="74" x2="292" y2="74" stroke="#475569" strokeWidth="1.4" strokeDasharray="3,3" />
        <line x1="182" y1="26" x2="182" y2="74" stroke="#334155" strokeWidth="1.4" strokeDasharray="3,3" />
        <line x1="48" y1="136" x2="182" y2="74" stroke="#334155" strokeWidth="1.4" strokeDasharray="3,3" />

        {/* Visible cuboid edges */}
        <polygon points="48,88 112,26 292,26 228,88" fill="none" stroke="#3b4990" strokeWidth="2" />
        <line x1="48" y1="88" x2="48" y2="136" stroke="#3b4990" strokeWidth="2" />
        <line x1="228" y1="88" x2="228" y2="136" stroke="#3b4990" strokeWidth="2" />
        <line x1="292" y1="26" x2="292" y2="74" stroke="#3b4990" strokeWidth="2" />
        <line x1="48" y1="136" x2="228" y2="136" stroke="#3b4990" strokeWidth="2" />
        <line x1="228" y1="136" x2="292" y2="74" stroke="#3b4990" strokeWidth="2" />

        {/* Prism cut edges AE, FC, vertical at F */}
        <line x1="48" y1="88" x2="182" y2="26" stroke="#0f172a" strokeWidth="2.1" />
        <line x1="158" y1="88" x2="292" y2="26" stroke="#0f172a" strokeWidth="2.1" />
        <line x1="158" y1="88" x2="158" y2="136" stroke="#0f172a" strokeWidth="1.9" />

        {/* Equal-segment double red ticks on AF and EC */}
        <line x1="100" y1="83" x2="105" y2="93" stroke="#dc2626" strokeWidth="1.8" />
        <line x1="106" y1="83" x2="111" y2="93" stroke="#dc2626" strokeWidth="1.8" />
        <line x1="234" y1="21" x2="239" y2="31" stroke="#dc2626" strokeWidth="1.8" />
        <line x1="240" y1="21" x2="245" y2="31" stroke="#dc2626" strokeWidth="1.8" />

        {/* 9 cm double arrow along bottom */}
        <line x1="50" y1="149" x2="226" y2="149" stroke="#dc2626" strokeWidth="1.6" />
        <polyline points="58,144 49,149 58,154" fill="none" stroke="#dc2626" strokeWidth="1.6" />
        <polyline points="218,144 227,149 218,154" fill="none" stroke="#dc2626" strokeWidth="1.6" />

        {/* Vertex labels */}
        <text x="35" y="91" fontSize="15" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">A</text>
        <text x="98" y="23" fontSize="15" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">B</text>
        <text x="179" y="20" fontSize="15" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">E</text>
        <text x="299" y="24" fontSize="15" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">C</text>
        <text x="218" y="83" fontSize="15" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">D</text>
        <text x="145" y="105" fontSize="15" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">F</text>

        {/* Dimension labels in red */}
        <text x="64" y="53" fill="#dc2626" fontSize="14.5" fontStyle="italic" fontFamily="KaTeX_Main, serif">6 cm</text>
        <text x="24" y="116" fill="#dc2626" fontSize="14.5" fontStyle="italic" fontFamily="KaTeX_Main, serif" textAnchor="middle">3 cm</text>
        <text x="138" y="167" fill="#dc2626" fontSize="14.5" fontStyle="italic" fontFamily="KaTeX_Main, serif" textAnchor="middle">9 cm</text>
        <text x="237" y="17" fill="#dc2626" fontSize="15.5" fontStyle="italic" fontFamily="KaTeX_Math, serif" textAnchor="middle">x</text>
      </svg>
    </figure>
  );
};

/** Q17: Historical Syrian 2-Piastres 1924–1925 postage stamp vignette. */
const Ex17StampFigure: React.FC = () => (
  <figure
    className="u4-figure u4-ex-figure"
    dir="ltr"
    aria-label="طابع بريدي سوري تاريخي بقيمة قرشين سوريين من عامي 1924 و 1925"
  >
    <svg viewBox="0 0 240 120" role="img">
      <title>طابع بريدي سوري بقيمة قرشين (1924–1925)</title>
      <rect x="14" y="12" width="212" height="96" rx="4" fill="#fdf2f4" stroke="#883344" strokeWidth="2.4" strokeDasharray="5,3" />
      <rect x="24" y="21" width="192" height="78" fill="#f7d6dc" stroke="#b85d6f" strokeWidth="1.6" />
      <text x="120" y="42" textAnchor="middle" fill="#6b1d2f" fontSize="14" fontWeight="700" fontFamily="serif">
        SYRIE • سورية
      </text>
      <text x="120" y="63" textAnchor="middle" fill="#7f1d1d" fontSize="15" fontWeight="700" fontFamily="serif">
        2 Piastres • قرشان
      </text>
      <text x="120" y="84" textAnchor="middle" fill="#883344" fontSize="12" fontFamily="serif">
        POSTES • AVION • 1924–1925
      </text>
    </svg>
  </figure>
);

/** Q19: Two 4-circle hidden-number operation diagrams (left and right). */
const Ex19CyclesFigure: React.FC = () => {
  const renderArrow = (x1: number, y1: number, x2: number, y2: number) => {
    const angle = globalThis.Math.atan2(y2 - y1, x2 - x1);
    const headLen = 9;
    const hx1 = x2 - headLen * globalThis.Math.cos(angle - 0.45);
    const hy1 = y2 - headLen * globalThis.Math.sin(angle - 0.45);
    const hx2 = x2 - headLen * globalThis.Math.cos(angle + 0.45);
    const hy2 = y2 - headLen * globalThis.Math.sin(angle + 0.45);
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#dc2626" strokeWidth="1.8" />
        <polyline
          points={`${hx1.toFixed(1)},${hy1.toFixed(1)} ${x2},${y2} ${hx2.toFixed(1)},${hy2.toFixed(1)}`}
          fill="none"
          stroke="#dc2626"
          strokeWidth="1.8"
        />
      </g>
    );
  };

  // Left diagram center (120, 108); Right diagram center (375, 118)
  const nodes = (cx: number, cy: number) => ({
    top: { x: cx, y: cy - 72 },
    right: { x: cx + 74, y: cy },
    bottom: { x: cx, y: cy + 72 },
    left: { x: cx - 74, y: cy },
  });

  const L = nodes(120, 106);
  const R = nodes(376, 114);
  const rNode = 20;

  return (
    <figure
      className="u4-figure u4-ex-figure u4-ex-figure--wide"
      dir="ltr"
      aria-label="مخططان دائريان للأعداد المخفية: الأيسر يتضمن +5 و ×3 و −6 و ×4، والأيمن يتضمن ÷2 و −3 و ×4 و +6"
    >
      <svg viewBox="0 0 500 222" role="img">
        <title>مخططا الأعداد المخفية في السؤال 19</title>
        {/* Left diagram caption */}
        <text x="120" y="16" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="700">
          المخطط الأيسر
        </text>
        {/* Left diagram circles */}
        {[L.top, L.right, L.bottom, L.left].map((pt, i) => (
          <circle key={`l-${i}`} cx={pt.x} cy={pt.y} r={rNode} fill="#ffffff" stroke="#334155" strokeWidth="2.1" />
        ))}
        {/* Left diagram arrows: Bottom->Left (+5), Left->Top (×3), Top->Right (-6), Bottom->Right (×4) */}
        {renderArrow(L.bottom.x - 16, L.bottom.y - 14, L.left.x + 15, L.left.y + 16)}
        {renderArrow(L.left.x + 15, L.left.y - 16, L.top.x - 16, L.top.y + 14)}
        {renderArrow(L.top.x + 16, L.top.y + 14, L.right.x - 15, L.right.y - 16)}
        {renderArrow(L.bottom.x + 16, L.bottom.y - 14, L.right.x - 15, L.right.y + 16)}
        <text x="58" y="158" textAnchor="middle" fill="#dc2626" fontSize="17" fontFamily="KaTeX_Main, serif">+ 5</text>
        <text x="60" y="64" textAnchor="middle" fill="#dc2626" fontSize="17" fontFamily="KaTeX_Main, serif">× 3</text>
        <text x="182" y="62" textAnchor="middle" fill="#dc2626" fontSize="17" fontFamily="KaTeX_Main, serif">− 6</text>
        <text x="182" y="160" textAnchor="middle" fill="#dc2626" fontSize="17" fontFamily="KaTeX_Main, serif">× 4</text>

        {/* Right diagram caption */}
        <text x="376" y="16" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="700">
          المخطط الأيمن
        </text>
        {/* Right diagram circles */}
        {[R.top, R.right, R.bottom, R.left].map((pt, i) => (
          <circle key={`r-${i}`} cx={pt.x} cy={pt.y} r={rNode} fill="#ffffff" stroke="#334155" strokeWidth="2.1" />
        ))}
        {/* Right diagram arrows: Bottom->Left (÷2), Left->Top (-3), Top->Right (×4), Right->Bottom (+6) */}
        {renderArrow(R.bottom.x - 16, R.bottom.y - 14, R.left.x + 15, R.left.y + 16)}
        {renderArrow(R.left.x + 15, R.left.y - 16, R.top.x - 16, R.top.y + 14)}
        {renderArrow(R.top.x + 16, R.top.y + 14, R.right.x - 15, R.right.y - 16)}
        {renderArrow(R.right.x - 15, R.right.y + 16, R.bottom.x + 16, R.bottom.y - 14)}
        <text x="313" y="168" textAnchor="middle" fill="#dc2626" fontSize="17" fontFamily="KaTeX_Main, serif">÷ 2</text>
        <text x="316" y="72" textAnchor="middle" fill="#dc2626" fontSize="17" fontFamily="KaTeX_Main, serif">− 3</text>
        <text x="438" y="72" textAnchor="middle" fill="#dc2626" fontSize="17" fontFamily="KaTeX_Main, serif">× 4</text>
        <text x="438" y="168" textAnchor="middle" fill="#dc2626" fontSize="17" fontFamily="KaTeX_Main, serif">+ 6</text>
      </svg>
    </figure>
  );
};

/** Q20: Right triangles ABM and DCM on [BC] of length 10 cm, AB = 3 cm, DC = 5 cm. */
const Ex20TrianglesFigure: React.FC = () => (
  <figure
    className="u4-figure u4-ex-figure u4-ex-figure--wide"
    dir="ltr"
    aria-label="مثلثان قائمان ABM و DCM على القطعة BC التي طولها 10 سم، حيث AB يساوي 3 سم و DC يساوي 5 سم"
  >
    <svg viewBox="0 0 350 168" role="img">
      <title>المثلثان ABM و DCM في السؤال 20</title>
      {/* Left triangle ABM: B(64,116), A(64,56), M(168,116) */}
      <polygon points="64,116 64,56 168,116" fill="#dcefd3" stroke="#3b4990" strokeWidth="2.1" />
      <polyline points="64,105 75,105 75,116" fill="none" stroke="#dc2626" strokeWidth="1.5" />

      {/* Right triangle DCM: M(168,116), D(284,22), C(284,116) */}
      <polygon points="168,116 284,22 284,116" fill="#9bd17e" stroke="#3b4990" strokeWidth="2.1" />
      <polyline points="273,116 273,105 284,105" fill="none" stroke="#dc2626" strokeWidth="1.5" />

      {/* 10 cm double-headed arrow under BC */}
      <line x1="66" y1="136" x2="282" y2="136" stroke="#dc2626" strokeWidth="1.5" />
      <polygon points="64,136 75,132 75,140" fill="#dc2626" />
      <polygon points="284,136 273,132 273,140" fill="#dc2626" />

      {/* Vertex labels */}
      <text x="53" y="54" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">A</text>
      <text x="51" y="130" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">B</text>
      <text x="166" y="131" textAnchor="middle" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">M</text>
      <text x="292" y="130" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">C</text>
      <text x="291" y="20" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">D</text>

      {/* Dimension labels */}
      <text x="34" y="91" textAnchor="middle" fill="#dc2626" fontSize="15" fontFamily="KaTeX_Main, serif">3 cm</text>
      <text x="314" y="75" textAnchor="middle" fill="#dc2626" fontSize="15" fontFamily="KaTeX_Main, serif">5 cm</text>
      <text x="174" y="156" textAnchor="middle" fill="#dc2626" fontSize="15" fontFamily="KaTeX_Main, serif">10 cm</text>
    </svg>
  </figure>
);

/** Q21: Hand-drawn style isosceles triangle ABC with AB = AC and BC = 8 cm. */
const Ex21SketchFigure: React.FC = () => (
  <figure
    className="u4-figure u4-ex-figure"
    dir="ltr"
    aria-label="مثلث متساوي الساقين مرسوم يدوياً رؤوسه A و B و C فيه AB يساوي AC و BC يساوي 8 سم"
  >
    <svg viewBox="0 0 230 165" role="img">
      <title>المثلث المرسوم يدوياً في السؤال 21</title>
      <path
        d="M 115 24 L 92 78 L 65 130 L 118 131 L 166 130 L 141 77 Z"
        fill="#ffffff"
        stroke="#1e293b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Double red ticks on AB and AC */}
      <line x1="84" y1="74" x2="96" y2="80" stroke="#dc2626" strokeWidth="1.8" />
      <line x1="81" y1="80" x2="93" y2="86" stroke="#dc2626" strokeWidth="1.8" />
      <line x1="135" y1="80" x2="147" y2="74" stroke="#dc2626" strokeWidth="1.8" />
      <line x1="138" y1="86" x2="150" y2="80" stroke="#dc2626" strokeWidth="1.8" />

      <text x="115" y="17" textAnchor="middle" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">A</text>
      <text x="52" y="135" textAnchor="middle" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">B</text>
      <text x="180" y="135" textAnchor="middle" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">C</text>
      <text x="116" y="150" textAnchor="middle" fill="#dc2626" fontSize="15" fontFamily="KaTeX_Main, serif">8 cm</text>
    </svg>
  </figure>
);

/** Q22: Rectangle ABCD (5 cm × 4 cm) with inscribed yellow triangle EDF. */
const Ex22RectTriangleFigure: React.FC<{ exactSolution?: boolean }> = ({ exactSolution = false }) => {
  // Scale: 1 cm = 36 px -> AB = 180 px (x: 48..228), AD = 144 px (y: 26..170)
  // E on [AB] at AE = 1 cm -> xE = 48 + 36 = 84, yE = 26
  // In general diagram, BF is ~2.4 cm -> yF = 26 + 88 = 114; in exact solution (x = 3 cm), yF = 26 + 108 = 134!
  const yF = exactSolution ? 134 : 114;
  return (
    <figure
      className="u4-figure u4-ex-figure"
      dir="ltr"
      aria-label={
        exactSolution
          ? 'رسم المستطيل ABCD والمثلث الأصفر EDF في الحالة x = 3 cm حيث المساحة تساوي 9.5 سنتيمتر مربع'
          : 'مستطيل أخضر ABCD بداخله المثلث الأصفر EDF حيث E على AB و F على BC وطول BF يساوي x'
      }
    >
      <svg viewBox="0 0 295 198" role="img">
        <title>{exactSolution ? 'رسم السؤال 22 عند x = 3 cm' : 'مستطيل السؤال 22 والمثلث EDF'}</title>
        <rect x="48" y="26" width="180" height="144" fill="#54b948" stroke="#3b4990" strokeWidth="2.3" />
        <polygon points={`84,26 228,${yF} 48,170`} fill="#f8f39e" stroke="#3b4990" strokeWidth="2.2" />

        <text x="35" y="24" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">A</text>
        <text x="84" y="18" textAnchor="middle" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">E</text>
        <text x="239" y="24" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">B</text>
        <text x="242" y={yF + 5} fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">F</text>
        <text x="239" y="184" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">C</text>
        <text x="34" y="184" fontSize="15.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif">D</text>

        {exactSolution ? (
          <>
            <text x="66" y="42" textAnchor="middle" fill="#ffffff" fontSize="12.5" fontWeight="700">1 cm</text>
            <text x="156" y="42" textAnchor="middle" fill="#ffffff" fontSize="12.5" fontWeight="700">4 cm</text>
            <text x="258" y="84" textAnchor="middle" fill="#dc2626" fontSize="14" fontWeight="700">3 cm</text>
            <text x="258" y="156" textAnchor="middle" fill="#1e293b" fontSize="13">1 cm</text>
            <text x="24" y="102" textAnchor="middle" fill="#1e293b" fontSize="13.5">4 cm</text>
            <text x="128" y="114" textAnchor="middle" fill="#854d0e" fontSize="13.5" fontWeight="700">9.5 cm²</text>
          </>
        ) : (
          <text
            x="244"
            y={(26 + yF) / 2 + 4}
            textAnchor="middle"
            fill="#dc2626"
            fontSize="16"
            fontStyle="italic"
            fontFamily="KaTeX_Math, serif"
          >
            x
          </text>
        )}
      </svg>
    </figure>
  );
};

export const Unit4ExercisesFigure: React.FC<Unit4ExercisesFigureProps> = ({ figureId }) => {
  switch (figureId) {
    case 'u4-ex1-rect':
      return <Ex1RectFigure />;
    case 'u4-ex3-circle':
      return <Ex3CircleFigure />;
    case 'u4-ex4-blocks':
      return <Ex4BlocksFigure />;
    case 'u4-ex6-student-work':
      return <Ex6StudentWorkFigure />;
    case 'u4-ex7-triangle':
      return <Ex7TriangleFigure />;
    case 'u4-ex10-perimeters':
      return <Ex10PerimetersFigure />;
    case 'u4-ex16-cuboid':
      return <Ex16CuboidFigure />;
    case 'u4-ex17-stamp':
      return <Ex17StampFigure />;
    case 'u4-ex19-cycles':
      return <Ex19CyclesFigure />;
    case 'u4-ex20-triangles':
      return <Ex20TrianglesFigure />;
    case 'u4-ex21-sketch':
      return <Ex21SketchFigure />;
    case 'u4-ex22-rect-triangle':
      return <Ex22RectTriangleFigure />;
    case 'u4-ex22-solution-rect':
      return <Ex22RectTriangleFigure exactSolution />;
    default:
      return null;
  }
};
