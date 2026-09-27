import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { parseInlineMath } from './parseInlineMath';
import { Math } from './Math';
import { MathText } from './MathText';

describe('Math Typography and Parsing', () => {
  it('parses inline and block math correctly', () => {
    const text = 'نجمع الكسرين $\\frac{a}{b}$ و $\\frac{c}{b}$ لنحصل على: $$\\frac{a+c}{b}$$';
    const tokens = parseInlineMath(text);
    expect(tokens).toHaveLength(6);
    expect(tokens[0]).toEqual({ type: 'text', content: 'نجمع الكسرين ' });
    expect(tokens[1]).toEqual({ type: 'math', content: '\\frac{a}{b}', display: false });
    expect(tokens[2]).toEqual({ type: 'text', content: ' و ' });
    expect(tokens[3]).toEqual({ type: 'math', content: '\\frac{c}{b}', display: false });
    expect(tokens[4]).toEqual({ type: 'text', content: ' لنحصل على: ' });
    expect(tokens[5]).toEqual({ type: 'math', content: '\\frac{a+c}{b}', display: true });
  });

  it('renders KaTeX formula within LTR isolated container', () => {
    const { container } = render(<Math math="2x + 5 = 17" />);
    const el = container.querySelector('.math-inline-isolated');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('dir', 'ltr');
    expect(el?.querySelector('.katex')).toBeInTheDocument();
  });

  it('renders MathText with proper inline math typesetting', () => {
    const { container } = render(<MathText text="إذا كان $x = 6$ فإن $2x = 12$" />);
    const mathSpans = container.querySelectorAll('.math-inline-isolated');
    expect(mathSpans.length).toBe(2);
    expect(container.textContent).toContain('إذا كان');
  });
});
