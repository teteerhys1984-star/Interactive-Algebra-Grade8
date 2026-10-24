import React, { useMemo } from 'react';
import { MathIsolated } from './MathIsolated';
import { MathContent } from './MathContent';
import { renderTexToHtml } from './renderTex';
import { containsArabicProse, containsDelimitedMath } from './parseInlineMath';

export interface MathProps {
  math: string;
  display?: boolean;
  className?: string;
}

/**
 * عارض تعبير رياضي واحد.
 *
 * الحالة الشائعة: `math` تعبير TeX خام (بلا `$`)، فيُمرّر إلى KaTeX كما هو.
 *
 * حالتان تعودان إلى العارض المشترك `MathContent` بدل KaTeX:
 *  1. نص مختلط يحوي `$…$` أو `\(…\)` مع كلام عربي — تمريره إلى KaTeX كان
 *     يعرض `$` و`\frac` خامًا.
 *  2. كلام عربي بلا محددات (مثل `answer: 'نعم'` في مفاتيح الإجابة) — تمريره إلى
 *     KaTeX يحوّل نصًا عاديًا إلى «معادلة» بخط رياضي ومقاييس ناقصة.
 */
export const Math: React.FC<MathProps> = ({ math, display = false, className = '' }) => {
  const prose = useMemo(() => containsDelimitedMath(math) || containsArabicProse(math), [math]);
  const html = useMemo(() => (prose ? '' : renderTexToHtml(math, display)), [math, display, prose]);

  if (prose) {
    return <MathContent text={math} display={display} className={className} />;
  }

  return <MathIsolated html={html} display={display} className={className} />;
};

export default Math;
