import React, { useState } from 'react';
import { Math as TexMath } from '../math/Math';
import { MathText } from '../math/MathText';
import { Check, Eye, RotateCcw } from 'lucide-react';

/**
 * مخطط الانتقالات الدائري — الصفحة 49، تدرّب ③.
 *
 * يحاكي مخطط المستطيلات الخمسة والأسهم الخمسة في الكتاب:
 *   المستطيل العلوي (معطى): x
 *   ← السهم 1 (معطى: نطرح 5) ← المستطيل الأيمن الأوسط: x - 5
 *   ← السهم 2 (معطى: نكتب النظير) ← المستطيل الأيمن السفلي: -x + 5
 *   ← السهم 3 (معطى: نطرح 10) ← المستطيل الأيسر السفلي: -x - 5
 *   ← السهم 4 (معطى: نكتب النظير) ← المستطيل الأيسر الأوسط: x + 5
 *   ← السهم 5 (فراغ منقّط يعود إلى x): نطرح 5
 */

export interface CycleSlotSpec {
  id: 'box-mid-right' | 'box-bot-right' | 'box-bot-left' | 'box-mid-left' | 'arrow-return';
  title: string;
  kind: 'math' | 'text';
  correctId: string;
  options: { id: string; display: string }[];
  explain: string;
}

export const CYCLE_SLOTS: readonly CycleSlotSpec[] = [
  {
    id: 'box-mid-right',
    title: '1) المستطيل الأيمن الأوسط (بعد «نطرح 5» من x)',
    kind: 'math',
    correctId: 'x-5',
    options: [
      { id: 'x-5', display: 'x - 5' },
      { id: '5-x', display: '5 - x' },
      { id: 'x+5', display: 'x + 5' },
    ],
    explain: 'الانطلاق من $x$ وطرح $5$ يعطي $x - 5$.',
  },
  {
    id: 'box-bot-right',
    title: '2) المستطيل الأيمن السفلي (بعد «نكتب النظير»)',
    kind: 'math',
    correctId: '-x+5',
    options: [
      { id: '-x-5', display: '-x - 5' },
      { id: '-x+5', display: '-x + 5' },
      { id: 'x+5', display: 'x + 5' },
    ],
    explain: 'نظير الفرق $x - 5$ هو $-(x - 5) = -x + 5$ (ويكافئ $5 - x$).',
  },
  {
    id: 'box-bot-left',
    title: '3) المستطيل الأيسر السفلي (بعد «نطرح 10»)',
    kind: 'math',
    correctId: '-x-5',
    options: [
      { id: '-x-5', display: '-x - 5' },
      { id: '-x+15', display: '-x + 15' },
      { id: 'x-5', display: 'x - 5' },
    ],
    explain: 'نطرح $10$ من $-x + 5$: $(-x + 5) - 10 = -x + (5 - 10) = -x - 5$.',
  },
  {
    id: 'box-mid-left',
    title: '4) المستطيل الأيسر الأوسط (بعد «نكتب النظير»)',
    kind: 'math',
    correctId: 'x+5',
    options: [
      { id: '-x+5', display: '-x + 5' },
      { id: 'x-5', display: 'x - 5' },
      { id: 'x+5', display: 'x + 5' },
    ],
    explain: 'نظير $-x - 5$ يغيّر إشارة الحدّين السالبين معًا: $-(-x - 5) = x + 5$.',
  },
  {
    id: 'arrow-return',
    title: '5) فراغ الانتقال الأخير (للعودة من المستطيل الأيسر الأوسط إلى x)',
    kind: 'text',
    correctId: 'sub-5',
    options: [
      { id: 'sub-5', display: 'نطرح $5$' },
      { id: 'add-5', display: 'نجمع $5$' },
      { id: 'opp', display: 'نكتب النظير' },
    ],
    explain: 'وصلنا إلى $x + 5$، ولكي نعود إلى $x$ نطرح $5$: $(x + 5) - 5 = x$.',
  },
];

export const OppositeCycleDiagramLab: React.FC = () => {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [sampleX, setSampleX] = useState<number>(12);

  const getSlotDisplay = (slotId: CycleSlotSpec['id']): string => {
    const slot = CYCLE_SLOTS.find((s) => s.id === slotId)!;
    const activeId = revealed ? slot.correctId : selected[slotId];
    if (!activeId) return '..........';
    return slot.options.find((o) => o.id === activeId)?.display ?? '..........';
  };

  const getSlotStatus = (slotId: CycleSlotSpec['id']): 'neutral' | 'ok' | 'bad' => {
    if (revealed) return 'ok';
    if (!checked) return 'neutral';
    const slot = CYCLE_SLOTS.find((s) => s.id === slotId)!;
    return selected[slotId] === slot.correctId ? 'ok' : 'bad';
  };

  const correctCount = CYCLE_SLOTS.filter((s) => selected[s.id] === s.correctId).length;
  const allFilled = CYCLE_SLOTS.every((s) => !!selected[s.id]);

  const reset = () => {
    setSelected({});
    setChecked(false);
    setRevealed(false);
    setSampleX(12);
  };

  // القيم العددية عبر الحلقة عند تعويض sampleX
  const vTop = sampleX;
  const vMidRight = sampleX - 5;
  const vBotRight = -sampleX + 5;
  const vBotLeft = -sampleX - 5;
  const vMidLeft = sampleX + 5;

  const boxFill = (status: 'neutral' | 'ok' | 'bad') =>
    status === 'ok' ? '#ecfdf5' : status === 'bad' ? '#fff1f2' : '#f8fafc';
  const boxStroke = (status: 'neutral' | 'ok' | 'bad') =>
    status === 'ok' ? '#10b981' : status === 'bad' ? '#f43f5e' : '#64748b';

  return (
    <section className="u3-lab-card" aria-label="مخطط الانتقالات الدائري لتدرب 3">
      <div className="u3-lab-head">
        <div>
          <span className="u3-lab-eyebrow">مخطط تفاعلي مطابق للكتاب • الصفحة 49 • تدرّب ③</span>
          <h4 className="u3-lab-title">أكمل المستطيلات الأربعة وفراغ الانتقال الأخير لتغلق الحلقة عند <TexMath math="x" /></h4>
        </div>
      </div>

      {/* رسم المخطط التخطيطي بنفس هندسة الكتاب تماماً */}
      <div className="u3-cycle-svg-wrap" dir="ltr">
        <svg
          viewBox="0 0 660 320"
          width="100%"
          height="auto"
          role="img"
          aria-label="مخطط مستطيلات تدرب 3 في الصفحة 49"
        >
          <defs>
            <marker id="u3-cycle-arr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,0 L9,4.5 L0,9 Z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* المستطيل العلوي المعطى: x */}
          <rect x="275" y="16" width="110" height="44" rx="6" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.2" />
          <text x="330" y="45" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1e3a8a">
            x
          </text>

          {/* السهم 1: من x إلى المستطيل الأيمن الأوسط */}
          <line x1="392" y1="40" x2="515" y2="106" stroke="#3b82f6" strokeWidth="1.9" markerEnd="url(#u3-cycle-arr)" />
          <text x="478" y="66" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1e293b">
            نطرح 5
          </text>

          {/* المستطيل الأيمن الأوسط */}
          <rect
            x="455"
            y="112"
            width="150"
            height="46"
            rx="6"
            fill={boxFill(getSlotStatus('box-mid-right'))}
            stroke={boxStroke(getSlotStatus('box-mid-right'))}
            strokeWidth="2"
          />
          <text x="530" y="141" textAnchor="middle" fontSize="17" fontWeight="700" fill="#0f172a">
            {getSlotDisplay('box-mid-right')}
          </text>

          {/* السهم 2: لأسفل (نكتب النظير) */}
          <line x1="530" y1="163" x2="530" y2="228" stroke="#3b82f6" strokeWidth="1.9" markerEnd="url(#u3-cycle-arr)" />
          <text x="582" y="200" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">
            نكتب النظير
          </text>

          {/* المستطيل الأيمن السفلي */}
          <rect
            x="455"
            y="236"
            width="150"
            height="46"
            rx="6"
            fill={boxFill(getSlotStatus('box-bot-right'))}
            stroke={boxStroke(getSlotStatus('box-bot-right'))}
            strokeWidth="2"
          />
          <text x="530" y="265" textAnchor="middle" fontSize="17" fontWeight="700" fill="#0f172a">
            {getSlotDisplay('box-bot-right')}
          </text>

          {/* السهم 3: إلى اليسار (نطرح 10) */}
          <line x1="448" y1="259" x2="214" y2="259" stroke="#3b82f6" strokeWidth="1.9" markerEnd="url(#u3-cycle-arr)" />
          <text x="330" y="246" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1e293b">
            نطرح 10
          </text>

          {/* المستطيل الأيسر السفلي */}
          <rect
            x="55"
            y="236"
            width="150"
            height="46"
            rx="6"
            fill={boxFill(getSlotStatus('box-bot-left'))}
            stroke={boxStroke(getSlotStatus('box-bot-left'))}
            strokeWidth="2"
          />
          <text x="130" y="265" textAnchor="middle" fontSize="17" fontWeight="700" fill="#0f172a">
            {getSlotDisplay('box-bot-left')}
          </text>

          {/* السهم 4: لأعلى (نكتب النظير) */}
          <line x1="130" y1="230" x2="130" y2="165" stroke="#3b82f6" strokeWidth="1.9" markerEnd="url(#u3-cycle-arr)" />
          <text x="74" y="200" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">
            نكتب النظير
          </text>

          {/* المستطيل الأيسر الأوسط */}
          <rect
            x="55"
            y="112"
            width="150"
            height="46"
            rx="6"
            fill={boxFill(getSlotStatus('box-mid-left'))}
            stroke={boxStroke(getSlotStatus('box-mid-left'))}
            strokeWidth="2"
          />
          <text x="130" y="141" textAnchor="middle" fontSize="17" fontWeight="700" fill="#0f172a">
            {getSlotDisplay('box-mid-left')}
          </text>

          {/* السهم 5: من المستطيل الأيسر الأوسط عائداً إلى x مع الفراغ المنقط */}
          <line x1="145" y1="106" x2="268" y2="40" stroke="#3b82f6" strokeWidth="1.9" markerEnd="url(#u3-cycle-arr)" />
          <rect
            x="118"
            y="42"
            width="102"
            height="30"
            rx="5"
            fill={boxFill(getSlotStatus('arrow-return'))}
            stroke={boxStroke(getSlotStatus('arrow-return'))}
            strokeWidth="1.6"
            strokeDasharray="4 3"
          />
          <text x="169" y="62" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a">
            {getSlotDisplay('arrow-return').replace(/\$/g, '')}
          </text>
        </svg>
      </div>

      {/* اختيارات المحطات الخمس */}
      <div className="u3-cycle-slots">
        {CYCLE_SLOTS.map((slot) => {
          const status = getSlotStatus(slot.id);
          return (
            <div key={slot.id} className={`u3-cycle-slot is-${status}`}>
              <div className="u3-cycle-slot-title">{slot.title}</div>
              <div className="u3-cycle-options">
                {slot.options.map((opt) => {
                  const activeId = revealed ? slot.correctId : selected[slot.id];
                  const isPicked = activeId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={revealed}
                      className={`u3-cycle-opt${isPicked ? ' is-picked' : ''}`}
                      onClick={() => {
                        setSelected((prev) => ({ ...prev, [slot.id]: opt.id }));
                        setChecked(false);
                      }}
                    >
                      {slot.kind === 'math' ? <TexMath math={opt.display} /> : <MathText text={opt.display} />}
                    </button>
                  );
                })}
              </div>
              {(checked || revealed) && (
                <p className="u3-cycle-explain">
                  <MathText text={slot.explain} />
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* شريط تجربة عددية حية عبر الحلقة */}
      <div className="u3-cycle-runner">
        <label className="u3-inline-x-picker">
          <span>جرّب عدداً مكان <TexMath math={`x = ${sampleX}`} /> لتتبع الدورة كاملة:</span>
          <input
            type="range"
            min={-8}
            max={20}
            step={1}
            value={sampleX}
            aria-label="قيمة تجريبية للرمز x في المخطط"
            onChange={(e) => setSampleX(Number(e.target.value))}
          />
        </label>
        <div className="u3-cycle-trace" dir="ltr">
          <TexMath
            math={`${vTop} \\xrightarrow{-5} ${vMidRight} \\xrightarrow{\\times(-1)} ${vBotRight} \\xrightarrow{-10} ${vBotLeft} \\xrightarrow{\\times(-1)} ${vMidLeft} \\xrightarrow{-5} ${vTop}`}
          />
        </div>
      </div>

      <div className="u3-lab-actions">
        <button
          type="button"
          className="u3-btn u3-btn-primary"
          disabled={!allFilled || revealed}
          onClick={() => setChecked(true)}
        >
          <Check size={15} />
          <span>تحقّق من المخطط</span>
        </button>

        <button
          type="button"
          className="u3-btn"
          onClick={() => setRevealed((v) => !v)}
        >
          <Eye size={15} />
          <span>{revealed ? 'إخفاء الحل' : 'إظهار الحل'}</span>
        </button>

        <button type="button" className="u3-btn" onClick={reset}>
          <RotateCcw size={15} />
          <span>إعادة</span>
        </button>
      </div>

      {checked && !revealed && (
        <div
          className={`u3-lab-feedback ${correctCount === CYCLE_SLOTS.length ? 'is-ok' : 'is-warn'}`}
          role="status"
          aria-live="polite"
        >
          <MathText
            text={
              correctCount === CYCLE_SLOTS.length
                ? 'ممتاز! اكتمل المخطط الدائري وعادت السلسلة إلى $x$ تمامًا.'
                : `أصبت في ${correctCount} من ${CYCLE_SLOTS.length} مواضع. تذكّر أن نظير $-x - 5$ يقلب إشارة الحدّين معًا ليصبح $x + 5$.`
            }
          />
        </div>
      )}
    </section>
  );
};

export default OppositeCycleDiagramLab;
