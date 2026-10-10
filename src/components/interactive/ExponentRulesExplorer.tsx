import React, { useMemo, useState } from 'react';
// Aliased so the KaTeX component never shadows the global Math object.
import { Math as Formula } from '../math/Math';
// Mixed Arabic prose + inline $...$ must go through MathText, never raw KaTeX.
import { MathText } from '../math/MathText';

/**
 * ExponentRulesExplorer — interactive explorer for Unit 2, Lesson 2 (pages 29-30).
 *
 * The student picks one of the four rules of powers of 10 and manipulates the
 * exponent(s). The explorer shows both the symbolic rule application and the
 * decimal verification, so the connection between the exponent arithmetic and
 * the actual magnitude of the number stays visible.
 *
 *   1. Multiplication:  10^m x 10^n = 10^(m+n)
 *   2. Division:        10^m / 10^n = 10^(m-n)
 *   3. Power of power:  (10^m)^n    = 10^(m*n)
 *   4. Reciprocal:      1 / 10^m    = 10^(-m)
 *
 * All math is rendered with the project KaTeX component inside dir="ltr"
 * isolates; the surrounding UI is RTL Arabic.
 */

type RuleId = 'multiply' | 'divide' | 'power' | 'reciprocal';

interface RuleConfig {
  id: RuleId;
  label: string;
  description: string;
}

const RULES: RuleConfig[] = [
  {
    id: 'multiply',
    label: 'الضرب',
    description: 'نجمع الأسين: $10^m \\times 10^n = 10^{m+n}$',
  },
  {
    id: 'divide',
    label: 'القسمة',
    description: 'نطرح الأسين: $\\frac{10^m}{10^n} = 10^{m-n}$',
  },
  {
    id: 'power',
    label: 'قوة قوة',
    description: 'نضرب الأسين: $(10^m)^n = 10^{m \\times n}$',
  },
  {
    id: 'reciprocal',
    label: 'المقلوب',
    description: 'نغيّر إشارة الأس: $\\frac{1}{10^m} = 10^{-m}$',
  },
];

const MIN_EXP = -9;
const MAX_EXP = 9;

const clampExp = (value: number): number => Math.max(MIN_EXP, Math.min(MAX_EXP, Math.round(value)));

/** Decimal form of 10^k, guarded against extreme values. */
const decimalOfPower = (k: number): string => {
  if (k > 12 || k < -12) return '\\dots';
  const value = 10 ** k;
  if (k >= 0) return value.toLocaleString('en-US').replace(/,/g, '\\,');
  return value.toFixed(Math.abs(k));
};

const ExponentRulesExplorer: React.FC = () => {
  const [ruleId, setRuleId] = useState<RuleId>('multiply');
  const [m, setM] = useState(3);
  const [n, setN] = useState(2);
  const [showVerification, setShowVerification] = useState(false);

  const rule = useMemo(() => RULES.find((r) => r.id === ruleId) ?? RULES[0], [ruleId]);
  const usesN = ruleId !== 'reciprocal';

  const resultExponent = useMemo(() => {
    switch (ruleId) {
      case 'multiply': return m + n;
      case 'divide': return m - n;
      case 'power': return m * n;
      case 'reciprocal': return -m;
    }
  }, [ruleId, m, n]);

  const expressionTex = useMemo(() => {
    const mPow = `10^{${m}}`;
    const nPow = `10^{${n}}`;
    switch (ruleId) {
      case 'multiply': return `${mPow} \\times ${nPow} = 10^{${resultExponent}}`;
      case 'divide': return `\\frac{${mPow}}{${nPow}} = 10^{${resultExponent}}`;
      case 'power': return `(10^{${m}})^{${n}} = 10^{${resultExponent}}`;
      case 'reciprocal': return `\\frac{1}{${mPow}} = 10^{${resultExponent}}`;
    }
  }, [ruleId, m, n, resultExponent]);

  const verificationTex = useMemo(() => {
    const mDec = decimalOfPower(m);
    const nDec = decimalOfPower(n);
    const resDec = decimalOfPower(resultExponent);
    switch (ruleId) {
      case 'multiply':
        return `${mDec} \\times ${nDec} = ${resDec}`;
      case 'divide':
        return `${mDec} \\div ${nDec} = ${resDec}`;
      case 'power':
        return `(${mDec})^{${n}} = ${resDec}`;
      case 'reciprocal':
        return `\\frac{1}{${mDec}} = ${resDec}`;
    }
  }, [ruleId, m, n, resultExponent]);

  const handleMChange = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    setM(Number.isNaN(parsed) ? 0 : clampExp(parsed));
  };

  const handleNChange = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    setN(Number.isNaN(parsed) ? 0 : clampExp(parsed));
  };

  return (
    <div className="exponent-rules-explorer" dir="rtl">
      <p className="exponent-rules-intro">
        اختر القاعدة، ثم حرّك قيم الأسين لمشاهدة كيف يتغير الناتج. التعبير الرياضي يبقى
        صحيحاً في جميع الحالات.
      </p>

      <div className="exponent-rule-tabs" role="tablist" aria-label="قواعد القوى">
        {RULES.map((r) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={r.id === ruleId}
            className={`exponent-rule-tab ${r.id === ruleId ? 'active' : ''}`}
            onClick={() => setRuleId(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <p className="exponent-rule-description">
        <MathText text={rule.description} />
      </p>

      <div className="exponent-inputs">
        <label className="exponent-input-field">
          <span>قيمة الأس m</span>
          <input
            type="number"
            min={MIN_EXP}
            max={MAX_EXP}
            value={m}
            onChange={(e) => handleMChange(e.target.value)}
            aria-label="قيمة الأس m"
          />
        </label>
        {usesN && (
          <label className="exponent-input-field">
            <span>قيمة الأس n</span>
            <input
              type="number"
              min={MIN_EXP}
              max={MAX_EXP}
              value={n}
              onChange={(e) => handleNChange(e.target.value)}
              aria-label="قيمة الأس n"
            />
          </label>
        )}
      </div>

      <div className="exponent-result-panel">
        <span className="exponent-result-label"><MathText text="الناتج بالصيغة $10^p$:" /></span>
        <div className="exponent-result-math" dir="ltr">
          <Formula math={expressionTex} display />
        </div>
      </div>

      <div className="exponent-verify-row">
        <button
          type="button"
          className="reveal-btn"
          onClick={() => setShowVerification((v) => !v)}
        >
          {showVerification ? 'إخفاء التحقق العشري' : 'تحقق بالقيم العشرية'}
        </button>
        {showVerification && (
          <div className="exponent-verify-panel" dir="ltr">
            <Formula math={verificationTex} display />
          </div>
        )}
      </div>

      <p className="exponent-hint">
        <MathText
          text={
            '💡 عندما يكون الأس سالباً، يكون العدد أصغر من 1؛ وعندما يكون موجباً، يكون أكبر من 1. جرّب m = −3 مع قاعدة المقلوب لتفهم لماذا $10^{-(-3)} = 10^3$.'
          }
        />
      </p>
    </div>
  );
};

export { ExponentRulesExplorer };
export default ExponentRulesExplorer;
