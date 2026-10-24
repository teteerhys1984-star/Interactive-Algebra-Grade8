import katex from 'katex';

/** Escapes a raw string so it can be embedded in the error fallback markup. */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * يحوّل TeX إلى HTML عبر KaTeX. هذه هي النقطة الوحيدة التي تُستدعى فيها KaTeX،
 * فيمرّ كل عرض رياضي في المنصة من المسار نفسه.
 */
export function renderTexToHtml(tex: string, display = false): string {
  try {
    return katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      strict: false,
      output: 'htmlAndMathml',
    });
  } catch {
    return `<span class="katex-error">${escapeHtml(tex)}</span>`;
  }
}
