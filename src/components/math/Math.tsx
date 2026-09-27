import React, { useMemo } from 'react';
import katex from 'katex';

export interface MathProps {
  math: string;
  display?: boolean;
  className?: string;
}

export const Math: React.FC<MathProps> = ({ math, display = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml',
      });
    } catch {
      return `<span class="katex-error">${math}</span>`;
    }
  }, [math, display]);

  if (display) {
    return (
      <div
        className={`math-block-isolated ${className}`}
        dir="ltr"
        style={{ direction: 'ltr', unicodeBidi: 'isolate', textAlign: 'center' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`math-inline-isolated ${className}`}
      dir="ltr"
      style={{ direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Math;
