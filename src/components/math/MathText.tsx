import React from 'react';
import { MathContent } from './MathContent';

export interface MathTextProps {
  text: string;
  className?: string;
  /** Only affects a value that is bare TeX end-to-end. */
  display?: boolean;
}

/**
 * نص قد يخلط العربية برياضيات مضمّنة (`$…$` أو `\(…\)`)، أو يكون تعبير TeX
 * خامًا بالكامل (حقول الجواب النهائي في مساحة المعلّم مثلًا). التمييز يتمّ
 * داخل `MathContent` نفسه، فلا يحتاج كل موضع استدعاء إلى معرفة نوع الحقل.
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '', display = false }) => (
  <MathContent text={text} className={className} display={display} />
);

export default MathText;
