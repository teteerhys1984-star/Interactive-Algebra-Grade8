import React, { useId } from 'react';

/** رسما تدرّب ص60: متوازي المستطيلات وأسهم لينا؛ تخطيطيان كما في المسح. */
export const PRISM_FIGURE_GEOMETRY = {
  width: 460, height: 330,
  A: [86, 258], B: [274, 258], C: [350, 182], D: [162, 182],
  E: [86, 146], F: [274, 146], G: [350, 70], H: [162, 70],
} as const;

const figureStyle: React.CSSProperties = {
  margin: '1rem auto', width: '100%', maxWidth: 460, padding: 0,
};
const svgStyle: React.CSSProperties = { width: '100%', height: 'auto', display: 'block', background: '#fff' };
const font = "'Cambria Math', 'STIX Two Math', 'Times New Roman', serif";

export const Unit3Lesson5PrismFigure: React.FC = () => {
  const titleId = useId();
  const descriptionId = useId();
  const { A, B, C, D, E, F, G, H, width, height } = PRISM_FIGURE_GEOMETRY;
  const edge = (from: readonly [number, number], to: readonly [number, number], hidden = false) => (
    <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}
      stroke={hidden ? '#8e91b1' : '#3b4d95'} strokeWidth={hidden ? 1.8 : 2.2}
      strokeDasharray={hidden ? '3 3' : undefined} />
  );
  return (
    <figure className="u3l5-prism-figure" dir="ltr" style={figureStyle}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${titleId} ${descriptionId}`}
        style={svgStyle} fontFamily={font} xmlns="http://www.w3.org/2000/svg">
        <title id={titleId}>متوازي المستطيلات في تدرّب ① ص60</title>
        <desc id={descriptionId}>
          الرؤوس الأمامية A وB وF وE، والخلفية D وC وG وH. طول HG هو x زائد 5،
          والارتفاع AE هو x زائد 3، والعمق EH هو x، بالسنتيمترات. الحواف الخلفية AD وDC وDH منقطة.
        </desc>
        {edge(A, D, true)}{edge(D, C, true)}{edge(D, H, true)}
        {edge(A, B)}{edge(B, F)}{edge(F, E)}{edge(E, A)}
        {edge(E, H)}{edge(H, G)}{edge(G, F)}{edge(G, C)}{edge(C, B)}
        <g fill="#24304e" fontSize="19" fontStyle="italic">
          <text x="70" y="279">A</text><text x="282" y="279">B</text>
          <text x="360" y="190">C</text><text x="143" y="181">D</text>
          <text x="68" y="150">E</text><text x="282" y="160">F</text>
          <text x="359" y="76">G</text><text x="147" y="65">H</text>
        </g>
        <g fill="#b54432" fontSize="20" fontStyle="italic">
          <text x="29" y="207">x + 3</text>
          <text x="105" y="101">x</text>
          <text x="226" y="58">x + 5</text>
        </g>
      </svg>
    </figure>
  );
};

/** الأسهم الأربعة تربط x و3 بكل من x و4، لا سهمين فقط. */
export const Unit3Lesson5DistributionFigure: React.FC = () => {
  const titleId = useId();
  const descriptionId = useId();
  const markerId = useId();
  return (
    <figure className="u3l5-distribution-figure" dir="ltr" style={figureStyle}>
      <svg viewBox="0 0 460 190" role="img" aria-labelledby={`${titleId} ${descriptionId}`}
        style={svgStyle} fontFamily={font} xmlns="http://www.w3.org/2000/svg">
        <title id={titleId}>أسهم لينا لنشر (x+3)(x+4)</title>
        <desc id={descriptionId}>
          أربعة أسهم: من x الأولى إلى x الثانية وإلى 4، ومن 3 إلى x الثانية وإلى 4.
          الجداءات الناتجة x في x، وx في 4، و3 في x، و3 في 4.
        </desc>
        <defs>
          <marker id={markerId} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0 0 L7 3.5 L0 7 Z" fill="#394559" />
          </marker>
        </defs>
        <g fill="none" stroke="#394559" strokeWidth="1.8" markerEnd={`url(#${markerId})`}>
          <path data-product="x-x" d="M 103 75 C 120 27, 189 27, 225 72" />
          <path data-product="x-4" d="M 103 75 C 110 8, 259 8, 284 72" />
          <path data-product="3-x" d="M 160 108 C 170 149, 207 149, 225 108" />
          <path data-product="3-4" d="M 160 108 C 180 169, 260 169, 284 108" />
        </g>
        <g fontSize="30" fontStyle="italic" fill="#24304e" textAnchor="middle">
          <text x="73" y="102">(</text><text x="102" y="102">x</text>
          <text x="130" y="102">+</text><text x="160" y="102" fill="#be3a30">3</text><text x="188" y="102">)</text>
          <text x="201" y="102">(</text><text x="227" y="102" fill="#5262a6">x</text>
          <text x="255" y="102">+</text><text x="285" y="102" fill="#3c8663">4</text><text x="312" y="102">)</text>
        </g>
      </svg>
    </figure>
  );
};
