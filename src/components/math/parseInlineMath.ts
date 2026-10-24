export interface MathToken {
  type: 'text' | 'math';
  content: string;
  display?: boolean;
}

/**
 * يطابق أولًا الرياضيات الكتلية `$$…$$` أو `\[…\]` ثم الرياضيات المضمّنة `$…$` أو `\(…\)`.
 * الأقواس الإنجليزية `\(…\)` و`\[…\]` صيغة TeX قياسية ترد في بعض نصوص الكتاب،
 * فكانت سابقًا تُعرض خامًا للطالب لأن المحلّل لم يعرفها.
 */
const DELIMITED_MATH = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g;

/**
 * Parses mixed text containing inline ($...$, \(...\)) and block ($$...$$, \[...\])
 * LaTeX expressions into a structured list of text and math tokens.
 */
export function parseInlineMath(input: string): MathToken[] {
  if (!input) return [];

  const tokens: MathToken[] = [];
  const regex = new RegExp(DELIMITED_MATH.source, 'g');
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        content: input.slice(lastIndex, match.index),
      });
    }

    const raw = match[0];
    if (raw.startsWith('$$') && raw.endsWith('$$')) {
      tokens.push({
        type: 'math',
        content: raw.slice(2, -2).trim(),
        display: true,
      });
    } else if (raw.startsWith('\\[') && raw.endsWith('\\]')) {
      tokens.push({
        type: 'math',
        content: raw.slice(2, -2).trim(),
        display: true,
      });
    } else if (raw.startsWith('\\(') && raw.endsWith('\\)')) {
      tokens.push({
        type: 'math',
        content: raw.slice(2, -2).trim(),
        display: false,
      });
    } else if (raw.startsWith('$') && raw.endsWith('$')) {
      tokens.push({
        type: 'math',
        content: raw.slice(1, -1).trim(),
        display: false,
      });
    }

    lastIndex = regex.lastIndex;
  }

  // Trailing text
  if (lastIndex < input.length) {
    tokens.push({
      type: 'text',
      content: input.slice(lastIndex),
    });
  }

  return tokens;
}

/** True when the string carries at least one delimited math segment. */
export function containsDelimitedMath(input: string): boolean {
  if (!input || (!input.includes('$') && !input.includes('\\(') && !input.includes('\\['))) {
    return false;
  }
  return parseInlineMath(input).some((token) => token.type === 'math');
}

const ARABIC_LETTER = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
/** TeX commands that can never appear in Arabic prose. */
const TEX_COMMAND = /\\[a-zA-Z]+/;
/** Control symbols such as `\;`, `\,`, `\!`, `\ `, `\(`, `\[`. */
const TEX_CONTROL_SYMBOL = /\\[;,!()[\]%&$#_{} ]/;

/**
 * يفرّق بين نص عربي عادي وبين تعبير TeX خام (بلا محددات `$`).
 *
 * بعض حقول البيانات (مثل `finalAnswer` و`math` و`solution`) تحمل TeX خامًا،
 * وبعضها يحمل نصًا عربيًا. تمرير الأول إلى عارض النص الخالص كان يعرض
 * `\frac{1}{4}` و`\qquad` حرفيًا للطالب، وتمرير الثاني إلى KaTeX يعرض أقواسًا
 * غريبة. هذه الدالة هي الفيصل الوحيد، وهي مشتركة بين كل مسارات العرض.
 */
export function looksLikeBareTex(input: string): boolean {
  const text = input.trim();
  if (!text) return false;
  if (text.includes('$')) return false;
  // Arabic outside `\text{...}` means the value is prose, not a formula.
  const withoutTextRuns = text.replace(/\\text\{[^{}]*\}/g, '');
  if (ARABIC_LETTER.test(withoutTextRuns)) return false;
  if (TEX_COMMAND.test(text)) return true;
  if (TEX_CONTROL_SYMBOL.test(text)) return true;
  // Bare exponents/subscripts, e.g. `x^{2}` or `a_{n}`.
  if (/\^\{|_\{/.test(text)) return true;
  return false;
}
