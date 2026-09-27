import React, { useMemo } from 'react';
import { parseInlineMath } from './parseInlineMath';
import { Math } from './Math';

export interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const tokens = useMemo(() => parseInlineMath(text), [text]);

  return (
    <span className={`math-text ${className}`}>
      {tokens.map((token, index) => {
        if (token.type === 'math') {
          return (
            <Math
              key={index}
              math={token.content}
              display={token.display}
            />
          );
        }
        return <span key={index}>{token.content}</span>;
      })}
    </span>
  );
};

export default MathText;
