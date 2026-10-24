import React from 'react';

export interface MathIsolatedProps {
  html: string;
  display?: boolean;
  className?: string;
}

/**
 * الحاوية المعزولة الوحيدة للرياضيات: اتجاه LTR و`unicode-bidi: isolate`
 * حتى لا يعيد سياق RTL العربي ترتيب الرموز. يستخدمها كل من `Math` و`MathText`.
 */
export const MathIsolated: React.FC<MathIsolatedProps> = ({ html, display = false, className = '' }) => {
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

export default MathIsolated;
