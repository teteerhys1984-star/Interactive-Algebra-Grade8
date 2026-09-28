import React, { useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SignProductExplorerProps {
  initial?: number[];
}

export const SignProductExplorer: React.FC<SignProductExplorerProps> = ({
  initial = [-24, -33.3, -20, -3, 20.87, -5],
}) => {
  const [values, setValues] = useState<number[]>(initial);
  const [revealed, setRevealed] = useState(false);
  const [prediction, setPrediction] = useState<'pos' | 'neg' | null>(null);

  const toggleSign = (i: number) => {
    setValues((prev) => prev.map((v, idx) => (idx === i ? -v : v)));
    setRevealed(false);
    setPrediction(null);
  };

  const negativeCount = useMemo(() => values.filter((v) => v < 0).length, [values]);
  const isPositive = negativeCount % 2 === 0;
  const actualSign: 'pos' | 'neg' = isPositive ? 'pos' : 'neg';
  const predictionCorrect = prediction !== null && prediction === actualSign;

  return (
    <div className="interactive-card sp-explorer">
      <p className="sp-hint">اضغط على أي عدد لتقلب إشارته، ثم توقّع إشارة الجداء قبل الكشف.</p>

      <div className="sp-numbers" dir="ltr">
        {values.map((v, i) => (
          <button
            key={i}
            type="button"
            className={`sp-num ${v < 0 ? 'sp-neg' : 'sp-pos'}`}
            onClick={() => toggleSign(i)}
            aria-label={`العدد ${v}`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="sp-predict">
        <span>توقّعك:</span>
        <button
          type="button"
          className={`sp-predict-btn ${prediction === 'pos' ? 'active' : ''}`}
          onClick={() => setPrediction('pos')}
        >
          موجب
        </button>
        <button
          type="button"
          className={`sp-predict-btn ${prediction === 'neg' ? 'active' : ''}`}
          onClick={() => setPrediction('neg')}
        >
          سالب
        </button>
        <button type="button" className="reveal-btn" onClick={() => setRevealed((r) => !r)}>
          {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>{revealed ? 'إخفاء' : 'اكشف الإشارة'}</span>
        </button>
      </div>

      {revealed && (
        <div className={`sp-result ${isPositive ? 'sp-result-pos' : 'sp-result-neg'}`}>
          <div className="sp-result-line">
            عدد الأعداد السالبة = <strong>{negativeCount}</strong> ({negativeCount % 2 === 0 ? 'زوجي' : 'فردي'})
          </div>
          <div className="sp-result-sign">
            إشارة الجداء: <strong>{isPositive ? 'موجبة' : 'سالبة'}</strong>
          </div>
          {prediction !== null && (
            <div className="sp-feedback-inline">
              {predictionCorrect ? 'توقّعك مطابق ✔' : 'راجع القاعدة: زوجيّ السوالب موجب، وفرديّها سالب.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SignProductExplorer;
