import React, { useMemo } from 'react';
import { MathIsolated } from './MathIsolated';
import { renderTexToHtml } from './renderTex';
import { looksLikeBareTex, parseInlineMath } from './parseInlineMath';

export interface MathContentProps {
  /** Can be mixed Arabic prose + delimited math, or a bare TeX expression. */
  text: string;
  /** Only affects a value that is bare TeX end-to-end. */
  display?: boolean;
  className?: string;
}

/**
 * العارض المشترك للمحتوى الرياضي المختلط.
 *
 * يتعامل مع الحالات الأربع التي ترد فعليًا في بيانات المنصة:
 *  1. `$…$` / `$$…$$` مضمّنة في نص عربي (MathText).
 *  2. `\(…\)` / `\[…\]` مضمّنة في نص عربي (بعض بنود الكتاب).
 *  3. TeX خام بلا محددات، مثل `\frac{1}{4}` أو `a - b \qquad a + b`
 *     (حقول `finalAnswer` و`solution` و`math` و`mathFormula`).
 *  4. نص عربي خالص بلا رياضيات.
 *
 * القاعدة الحاكمة: لا يُعرض أي أمر LaTeX أو علامة `$` للطالب، ولا يُمرّر نص
 * عربي إلى KaTeX.
 */
export const MathContent: React.FC<MathContentProps> = ({ text, display = false, className = '' }) => {
  const tokens = useMemo(() => parseInlineMath(text), [text]);
  const html = useMemo(() => (looksLikeBareTex(text) ? renderTexToHtml(text.trim(), display) : null), [text, display]);

  if (html !== null) {
    return <MathIsolated html={html} display={display} className={className} />;
  }

  const hasMath = tokens.some((token) => token.type === 'math');
  if (!hasMath) {
    return <span className={`math-text ${className}`.trim()}>{text}</span>;
  }

  return (
    <span className={`math-text ${className}`.trim()}>
      {tokens.map((token, index) =>
        token.type === 'math' ? (
          <MathIsolated
            key={index}
            html={renderTexToHtml(token.content, token.display)}
            display={token.display}
          />
        ) : (
          <span key={index}>{token.content}</span>
        ),
      )}
    </span>
  );
};

export default MathContent;
