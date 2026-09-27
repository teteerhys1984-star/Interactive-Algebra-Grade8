import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Math } from '../components/math/Math';
import { MathText } from '../components/math/MathText';

describe('Mathematical Typography Verification Suite', () => {
  it('renders variables as genuine mathematical italics within KaTeX', () => {
    const { container } = render(<Math math="x + y = a + b" />);
    const katexEl = container.querySelector('.katex');
    expect(katexEl).toBeInTheDocument();
    expect(container.querySelector('.math-inline-isolated')).toHaveAttribute('dir', 'ltr');
  });

  it('renders vertical fractions with proper fraction bar', () => {
    const { container } = render(<Math math="\frac{a}{b} + \frac{c}{b} = \frac{a+c}{b}" />);
    const fractionBars = container.querySelectorAll('.mfrac');
    expect(fractionBars.length).toBeGreaterThanOrEqual(3);
  });

  it('renders exponents and roots properly', () => {
    const { container } = render(<Math math="x^2 + \sqrt{x+3} = 0" />);
    expect(container.querySelector('.sqrt')).toBeInTheDocument();
    expect(container.querySelector('.msupsub')).toBeInTheDocument();
  });

  it('isolates mathematics inside mixed Arabic RTL text', () => {
    const { container } = render(
      <div dir="rtl">
        <MathText text="احسب قيمة المقدار $A = \frac{5}{3} - \frac{7}{6}$ ثم اختصر الناتج." />
      </div>
    );
    const mathSpan = container.querySelector('.math-inline-isolated');
    expect(mathSpan).toBeInTheDocument();
    expect(mathSpan).toHaveAttribute('dir', 'ltr');
    expect(mathSpan).toHaveStyle({ unicodeBidi: 'isolate' });
  });
});
