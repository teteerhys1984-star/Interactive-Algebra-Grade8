import React, { useState } from 'react';
import { Math } from '../math/Math';
import { Check, Eye, RefreshCw } from 'lucide-react';

export interface FillInBlanksProps {
  prompt?: string;
  expression: string; // e.g. "-\\frac{1}{2} + \\frac{5}{8} = \\frac{[ -4 ]}{8} + \\frac{5}{8} = \\frac{[ 1 ]}{8}"
  solution: string;
}

export const FillInBlanksQuestion: React.FC<FillInBlanksProps> = ({
  prompt,
  solution,
}) => {
  const [showSolution, setShowSolution] = useState<boolean>(false);

  return (
    <div className="interactive-card">
      {prompt && <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{prompt}</p>}

      <div style={{ margin: '1rem 0' }}>
        <Math math={showSolution ? solution : solution.replace(/= \S+$/, '= \\dots')} display />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <button
          className="reveal-btn"
          onClick={() => setShowSolution(!showSolution)}
        >
          {showSolution ? (
            <>
              <RefreshCw size={16} />
              <span>إخفاء الحل</span>
            </>
          ) : (
            <>
              <Eye size={16} />
              <span>إظهار الحل والخطوات</span>
            </>
          )}
        </button>
      </div>

      {showSolution && (
        <div className="solution-panel">
          <div className="solution-panel-header">
            <Check size={18} />
            <span>الحل التفصيلي المعتمد:</span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <Math math={solution} display />
          </div>
        </div>
      )}
    </div>
  );
};

export default FillInBlanksQuestion;
