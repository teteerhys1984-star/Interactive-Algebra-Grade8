import React, { useMemo } from 'react';
import { MathIsolated } from './MathIsolated';
import { MathContent } from './MathContent';
import { renderTexToHtml } from './renderTex';
import { containsDelimitedMath } from './parseInlineMath';

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
 * الحالة الثانية التي ظهرت في مفاتيح إجابة المعلّم: `math` نص مختلط يحوي
 * `$…$` أو `\(…\)` مع كلام عربي. تمريره إلى KaTeX مباشرةً كان يعرض `$` و
 * `\frac` خامًا، لذلك يُحال هنا إلى العارض المشترك `MathContent`.
 */
export const Math: React.FC<MathProps> = ({ math, display = false, className = '' }) => {
  const mixed = useMemo(() => containsDelimitedMath(math), [math]);
  const html = useMemo(() => (mixed ? '' : renderTexToHtml(math, display)), [math, display, mixed]);

  if (mixed) {
    return <MathContent text={math} display={display} className={className} />;
  }

  return <MathIsolated html={html} display={display} className={className} />;
};

export default Math;
