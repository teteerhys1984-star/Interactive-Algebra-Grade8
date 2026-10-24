import React, { useState } from 'react';
import { Math as TexMath } from '../math/Math';
import { MathText } from '../math/MathText';
import { Compass, RotateCcw } from 'lucide-react';

/**
 * مستكشف المستقيم الموجه والفرجار — الصفحة 47، النشاط 3 (الحالات ①–④).
 *
 * يمثّل الحالات الأربع المرسومة في الكتاب:
 *   ① a و b موجبان
 *   ② a و b سالبان
 *   ③ a سالب و b موجب و a أقرب إلى O من b (|a| < b)
 *   ④ a سالب و b موجب و a أبعد عن O من b (|a| > b)
 * ويعرض خطوة بخطوة:
 *   1) موضعي -a و -b بالتناظر حول المبدأ O (أقواس الفرجار)
 *   2) المجموع a+b ونظيره -(a+b) بالتناظر حول O
 *   3) مجموع النظيرين -a-b = (-a)+(-b) وانطباقه التام على -(a+b)
 *   4) خيار استكشاف الفرق a-b ونظيره -(a-b) = -a+b
 */

export interface NumberLineCasePreset {
  id: 'case-1' | 'case-2' | 'case-3' | 'case-4';
  badge: string;
  title: string;
  defaultA: number;
  defaultB: number;
  note: string;
}

export const NUMBER_LINE_CASES: readonly NumberLineCasePreset[] = [
  {
    id: 'case-1',
    badge: '①',
    title: '$a$ و $b$ موجبان',
    defaultA: 2,
    defaultB: 3,
    note: 'كلا العددين على يمين المبدأ $O$، فنظيراهما $-a$ و$-b$ على يسار $O$، وينطبق $-(a+b)$ مع $-a-b$ على اليسار.',
  },
  {
    id: 'case-2',
    badge: '②',
    title: '$a$ و $b$ سالبان',
    defaultA: -2,
    defaultB: -4,
    note: 'بما أن $a$ و$b$ سالبان (على يسار $O$)، فإن نظيريهما $-a$ و$-b$ عددان موجبان على يمين $O$! لا تنخدع بوجود إشارة الناقص في الرمز $-a$.',
  },
  {
    id: 'case-3',
    badge: '③',
    title: '$a$ سالب و $b$ موجب و $a$ أقرب إلى $O$ من $b$',
    defaultA: -2,
    defaultB: 5,
    note: 'المسافة $|a|$ أصغر من $b$، لذا يقع المجموع $a+b$ على يمين $O$ (موجب)، ويقع نظيره $-(a+b)=-a-b$ على يسار $O$ بالمسافة نفسها.',
  },
  {
    id: 'case-4',
    badge: '④',
    title: '$a$ سالب و $b$ موجب و $a$ أبعد عن $O$ من $b$',
    defaultA: -5,
    defaultB: 2,
    note: 'المسافة $|a|$ أكبر من $b$، لذا يبقى المجموع $a+b$ سالبًا على يسار $O$، ويكون نظيره $-(a+b)=-a-b$ موجبًا على يمين $O$.',
  },
];

type Mode = 'sum' | 'diff';

export const OppositeNumberLineExplorer: React.FC = () => {
  const [activeCaseId, setActiveCaseId] = useState<NumberLineCasePreset['id']>('case-1');
  const [a, setA] = useState<number>(NUMBER_LINE_CASES[0].defaultA);
  const [b, setB] = useState<number>(NUMBER_LINE_CASES[0].defaultB);
  const [stage, setStage] = useState<1 | 2 | 3>(3);
  const [mode, setMode] = useState<Mode>('sum');

  const activePreset = NUMBER_LINE_CASES.find((c) => c.id === activeCaseId) ?? NUMBER_LINE_CASES[0];

  const selectCase = (preset: NumberLineCasePreset) => {
    setActiveCaseId(preset.id);
    setA(preset.defaultA);
    setB(preset.defaultB);
    setStage(3);
  };

  const handleReset = () => {
    setA(activePreset.defaultA);
    setB(activePreset.defaultB);
    setStage(3);
    setMode('sum');
  };

  const negA = -a;
  const negB = -b;
  const targetVal = mode === 'sum' ? a + b : a - b;
  const oppTarget = -targetVal;
  const algTarget = mode === 'sum' ? -a - b : -a + b;

  // مجال المستقيم الموجه من -12 إلى +12 ليغطي كل قيمة لـ a, b في [-6, 6]
  const minTick = -12;
  const maxTick = 12;
  const svgW = 680;
  const svgH = 215;
  const padX = 36;
  const axisY = 122;
  const toX = (val: number) =>
    padX + ((val - minTick) / (maxTick - minTick)) * (svgW - 2 * padX);
  const originX = toX(0);

  // قوس فرجار متناظر حول O بين v و -v
  const compassArcPath = (val: number, radiusScale = 0.34): string | null => {
    if (val === 0) return null;
    const x1 = toX(val);
    const x2 = toX(-val);
    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    const rx = (right - left) / 2;
    const ry = Math.min(62, Math.max(18, rx * radiusScale));
    return `M ${left} ${axisY} A ${rx} ${ry} 0 0 1 ${right} ${axisY}`;
  };

  const arcA = compassArcPath(a, 0.28);
  const arcB = compassArcPath(b, 0.34);
  const arcTarget = compassArcPath(targetVal, 0.42);

  return (
    <section className="u3-lab-card" aria-label="مستكشف المستقيم الموجه والنظائر">
      <div className="u3-lab-head">
        <div>
          <span className="u3-lab-eyebrow">تمثيل هندسي بالفرجار • الصفحة 47</span>
          <h4 className="u3-lab-title">توضيع النقاط ونظائرها على المستقيم الموجه</h4>
        </div>
        <div className="u3-mode-switch" role="group" aria-label="نوع العملية">
          <button
            type="button"
            className={`u3-mode-btn${mode === 'sum' ? ' is-active' : ''}`}
            onClick={() => setMode('sum')}
          >
            نظير المجموع <TexMath math="-(a+b)" />
          </button>
          <button
            type="button"
            className={`u3-mode-btn${mode === 'diff' ? ' is-active' : ''}`}
            onClick={() => setMode('diff')}
          >
            نظير الفرق <TexMath math="-(a-b)" />
          </button>
        </div>
      </div>

      {/* أزرار الحالات الأربع كما وردت في الكتاب */}
      <div className="u3-case-tabs" role="tablist" aria-label="حالات إشارتي a و b في الكتاب">
        {NUMBER_LINE_CASES.map((preset) => (
          <button
            key={preset.id}
            type="button"
            role="tab"
            aria-selected={preset.id === activeCaseId}
            className={`u3-case-tab${preset.id === activeCaseId ? ' is-active' : ''}`}
            onClick={() => selectCase(preset)}
          >
            <span className="u3-case-badge">{preset.badge}</span>
            <MathText text={preset.title} />
          </button>
        ))}
      </div>

      {/* مراحل الإنشاء بالفرجار */}
      <div className="u3-stage-bar" role="group" aria-label="مراحل الرسم على المستقيم الموجه">
        <button
          type="button"
          className={`u3-stage-chip${stage >= 1 ? ' is-on' : ''}`}
          onClick={() => setStage(1)}
        >
          1. تناظر <TexMath math="-a" /> و<TexMath math="-b" /> حول <TexMath math="O" />
        </button>
        <button
          type="button"
          className={`u3-stage-chip${stage >= 2 ? ' is-on' : ''}`}
          onClick={() => setStage(2)}
        >
          2. {mode === 'sum' ? <>المجموع <TexMath math="a+b" /> ونظيره</> : <>الفرق <TexMath math="a-b" /> ونظيره</>}
        </button>
        <button
          type="button"
          className={`u3-stage-chip${stage === 3 ? ' is-on' : ''}`}
          onClick={() => setStage(3)}
        >
          3. انطباق <TexMath math={mode === 'sum' ? '-a-b' : '-a+b'} />
        </button>
      </div>

      {/* رسم المستقيم الموجه */}
      <div className="u3-svg-wrap" dir="ltr">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          width="100%"
          height="auto"
          role="img"
          aria-label="المستقيم الموجه مع المبدأ O والنقاط ونظائرها"
        >
          <defs>
            <marker id="u3-axis-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,0 L9,4.5 L0,9 Z" fill="#1e3a8a" />
            </marker>
            <marker id="u3-vec-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#059669" />
            </marker>
          </defs>

          {/* أقواس الفرجار حول O */}
          {stage >= 1 && arcA && (
            <path d={arcA} fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="4 4" />
          )}
          {stage >= 1 && arcB && (
            <path d={arcB} fill="none" stroke="#cbd5e1" strokeWidth="1.4" strokeDasharray="4 4" />
          )}
          {stage >= 2 && arcTarget && (
            <path d={arcTarget} fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 4" />
          )}

          {/* المحور الموجه */}
          <line
            x1={padX - 10}
            y1={axisY}
            x2={svgW - padX + 14}
            y2={axisY}
            stroke="#1e3a8a"
            strokeWidth="2.4"
            markerEnd="url(#u3-axis-arrow)"
          />

          {/* تدريجات الأعداد الصحيحة */}
          {Array.from({ length: maxTick - minTick + 1 }, (_, idx) => minTick + idx).map((tick) => {
            const tx = toX(tick);
            const isOrigin = tick === 0;
            const isMajor = tick % 2 === 0;
            return (
              <g key={tick}>
                <line
                  x1={tx}
                  y1={axisY - (isOrigin ? 9 : isMajor ? 6 : 4)}
                  x2={tx}
                  y2={axisY + (isOrigin ? 9 : isMajor ? 6 : 4)}
                  stroke={isOrigin ? '#dc2626' : '#64748b'}
                  strokeWidth={isOrigin ? 2.4 : 1.2}
                />
                {isMajor && (
                  <text
                    x={tx}
                    y={axisY + 24}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isOrigin ? '800' : '600'}
                    fill={isOrigin ? '#dc2626' : '#475569'}
                  >
                    {tick === 0 ? 'O (0)' : tick}
                  </text>
                )}
              </g>
            );
          })}

          {/* في المرحلة 3 نرسم متجه الانتقال من -a بمقدار -b (أو +b في حالة الفرق) */}
          {stage === 3 && (
            <g>
              <line
                x1={toX(negA)}
                y1={axisY + 46}
                x2={toX(algTarget)}
                y2={axisY + 46}
                stroke="#059669"
                strokeWidth="2.4"
                markerEnd="url(#u3-vec-arrow)"
              />
              <line
                x1={toX(negA)}
                y1={axisY}
                x2={toX(negA)}
                y2={axisY + 46}
                stroke="#059669"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <line
                x1={toX(algTarget)}
                y1={axisY}
                x2={toX(algTarget)}
                y2={axisY + 46}
                stroke="#059669"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <text
                x={(toX(negA) + toX(algTarget)) / 2}
                y={axisY + 64}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#047857"
              >
                {mode === 'sum' ? `(-a) + (-b) = ${algTarget}` : `(-a) + b = ${algTarget}`}
              </text>
            </g>
          )}

          {/* المبدأ O */}
          <circle cx={originX} cy={axisY} r={5} fill="#dc2626" />

          {/* النقطتان المعطاتان a و b كما في الكتاب */}
          <g>
            <circle cx={toX(a)} cy={axisY} r={5.5} fill="#dc2626" />
            <text x={toX(a)} y={axisY - 14} textAnchor="middle" fontSize="13" fontWeight="800" fill="#b91c1c">
              a
            </text>
          </g>
          <g>
            <circle cx={toX(b)} cy={axisY} r={5.5} fill="#dc2626" />
            <text
              x={toX(b)}
              y={a === b ? axisY - 28 : axisY - 14}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill="#b91c1c"
            >
              b
            </text>
          </g>

          {/* المرحلة 1: النظيران -a و -b */}
          {stage >= 1 && (
            <>
              <g>
                <circle cx={toX(negA)} cy={axisY} r={5} fill="#6366f1" />
                <text x={toX(negA)} y={axisY + 39} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#4338ca">
                  -a
                </text>
              </g>
              <g>
                <circle cx={toX(negB)} cy={axisY} r={5} fill="#8b5cf6" />
                <text
                  x={toX(negB)}
                  y={negA === negB ? axisY + 53 : axisY + 39}
                  textAnchor="middle"
                  fontSize="12.5"
                  fontWeight="700"
                  fill="#6d28d9"
                >
                  -b
                </text>
              </g>
            </>
          )}

          {/* المرحلة 2: المجموع/الفرق ونظيره حول O */}
          {stage >= 2 && (
            <>
              <g>
                <circle cx={toX(targetVal)} cy={axisY} r={6} fill="#0284c7" />
                <text x={toX(targetVal)} y={axisY - 30} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0369a1">
                  {mode === 'sum' ? 'a+b' : 'a-b'}
                </text>
              </g>
              <g>
                <circle cx={toX(oppTarget)} cy={axisY} r={7.5} fill="#0ea5e9" opacity={0.28} />
                <circle cx={toX(oppTarget)} cy={axisY} r={5.5} fill="#0284c7" />
                <text x={toX(oppTarget)} y={axisY - 30} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0369a1">
                  {mode === 'sum' ? '-(a+b)' : '-(a-b)'}
                </text>
              </g>
            </>
          )}

          {/* المرحلة 3: حلقة انطباق -a-b أو -a+b على نفس النقطة */}
          {stage === 3 && (
            <g>
              <circle
                cx={toX(algTarget)}
                cy={axisY}
                r={9.5}
                fill="none"
                stroke="#059669"
                strokeWidth="2.6"
              />
              <text x={toX(algTarget)} y={axisY - 46} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#047857">
                {mode === 'sum' ? '-a-b' : '-a+b'}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* أشرطة تحكم بقيمتي a و b */}
      <div className="u3-sliders-grid">
        <label className="u3-slider-field">
          <span>
            قيمة <TexMath math={`a = ${a}`} /> (نظيرها <TexMath math={`-a = ${negA}`} />)
          </span>
          <input
            type="range"
            min={-6}
            max={6}
            step={1}
            value={a}
            aria-label="تغيير قيمة a"
            onChange={(e) => setA(Number(e.target.value))}
          />
        </label>

        <label className="u3-slider-field">
          <span>
            قيمة <TexMath math={`b = ${b}`} /> (نظيرها <TexMath math={`-b = ${negB}`} />)
          </span>
          <input
            type="range"
            min={-6}
            max={6}
            step={1}
            value={b}
            aria-label="تغيير قيمة b"
            onChange={(e) => setB(Number(e.target.value))}
          />
        </label>
      </div>

      {/* بطاقة القراءة الحسابية والتناظر */}
      <div className="u3-nl-readout">
        <div className="u3-nl-formula">
          {mode === 'sum' ? (
            <TexMath
              math={`-(a+b) = -(${a >= 0 ? a : `(${a})`} + ${b >= 0 ? b : `(${b})`}) = -(${targetVal}) = ${oppTarget} = (${negA}) + (${negB}) = -a - b`}
            />
          ) : (
            <TexMath
              math={`-(a-b) = -(${a >= 0 ? a : `(${a})`} - ${b >= 0 ? b : `(${b})`}) = -(${targetVal}) = ${oppTarget} = (${negA}) + (${b}) = -a + b`}
            />
          )}
        </div>
        <p className="u3-nl-note">
          <Compass size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <MathText text={activePreset.note} />
        </p>
      </div>

      <div className="u3-lab-actions">
        <button type="button" className="u3-btn" onClick={handleReset}>
          <RotateCcw size={15} />
          <span>إعادة إلى أعداد الحالة</span>
        </button>
      </div>
    </section>
  );
};

export default OppositeNumberLineExplorer;
