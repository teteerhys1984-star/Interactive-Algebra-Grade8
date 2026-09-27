export interface MathToken {
  type: 'text' | 'math';
  content: string;
  display?: boolean;
}

/**
 * Parses mixed text containing inline ($...$) and block ($$...$$) LaTeX expressions
 * into a structured list of text and math tokens.
 */
export function parseInlineMath(input: string): MathToken[] {
  if (!input) return [];

  const tokens: MathToken[] = [];
  // Matches block math $$...$$ first, then inline math $...$
  const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
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
