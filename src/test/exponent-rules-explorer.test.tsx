import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ExponentRulesExplorer } from '../components/interactive/ExponentRulesExplorer';

/**
 * Regression tests for the exponent-rules explorer of Unit 2, Lesson 2.
 *
 * They exist because this component once fed Arabic prose containing `$...$`
 * delimiters to the raw KaTeX component, which made KaTeX fail and showed the
 * raw source (`نجمع الأسين: $10^m \times 10^n = 10^{m+n}$`) to the student, and
 * because two more strings printed their `$` literally as plain JSX text.
 *
 * Every case drives the component through its real rule-selection mechanism
 * (clicking a `role="tab"` button) — all four rules, never only the default one.
 * KaTeX output is asserted from the DOM: no `katex-error`, no literal `$`, no
 * raw TeX, no Arabic inside math mode, each formula isolated in LTR, and the
 * fractions of the division and reciprocal rules stacked vertically.
 */

const ARABIC = /[\u0600-\u06FF]/;
/** Invisible characters KaTeX emits around fraction bars. */
const INVISIBLE = /[\s\u200B\u200C\u200D\u2060\uFEFF]/g;

/** The four rules with what the student must actually see for each of them. */
const RULES = [
  {
    tab: 'الضرب',
    lead: 'نجمع الأسين',
    description: '10m×10n=10m+n',
    expression: '103×102=105',
    fractions: 0,
  },
  {
    tab: 'القسمة',
    lead: 'نطرح الأسين',
    description: '10n10m=10m−n',
    expression: '102103=101',
    fractions: 2,
  },
  {
    tab: 'قوة قوة',
    lead: 'نضرب الأسين',
    description: '(10m)n=10m×n',
    expression: '(103)2=106',
    fractions: 0,
  },
  {
    tab: 'المقلوب',
    lead: 'نغيّر إشارة الأس',
    description: '10m1=10−m',
    expression: '1031=10−3',
    fractions: 2,
  },
] as const;

/** Selects a rule the way a student does: by clicking its tab. */
const selectRule = (tab: string): HTMLElement => {
  const button = screen.getByRole('tab', { name: tab });
  fireEvent.click(button);
  return button;
};

/** Text a student reads as prose: the container text with every math isolate removed. */
const proseOf = (element: Element | null): string => {
  if (!element) return '';
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.math-inline-isolated, .math-block-isolated').forEach((node) => node.remove());
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
};

/** Visible text of one KaTeX island, without the hidden MathML copy. */
const formulaOf = (element: Element | null): string => {
  if (!element) return '';
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
  return (clone.textContent ?? '').replace(INVISIBLE, '');
};

const mathIn = (scope: Element | null, selector: string): Element | null =>
  scope ? scope.querySelector(selector) : null;

describe('ExponentRulesExplorer — the four rules through their real tabs', () => {
  it('renders each rule description as Arabic prose plus a real KaTeX formula', () => {
    const { container } = render(<ExponentRulesExplorer />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((tab) => tab.textContent)).toEqual(['الضرب', 'القسمة', 'قوة قوة', 'المقلوب']);

    for (const rule of RULES) {
      const active = selectRule(rule.tab);
      expect(active, `${rule.tab}: tab must be selected`).toHaveAttribute('aria-selected', 'true');
      for (const other of screen.getAllByRole('tab')) {
        if (other !== active) expect(other, `${rule.tab}: other tabs`).toHaveAttribute('aria-selected', 'false');
      }

      const description = container.querySelector('.exponent-rule-description');
      expect(description, `${rule.tab}: description paragraph`).not.toBeNull();
      // The Arabic lead stays prose, outside the formula.
      expect(proseOf(description), `${rule.tab}: Arabic lead`).toContain(rule.lead);
      // The formula is rendered by KaTeX, not printed as source text.
      const formula = mathIn(description, '.katex');
      expect(formula, `${rule.tab}: KaTeX formula`).not.toBeNull();
      expect(formulaOf(formula), `${rule.tab}: rendered formula`).toBe(rule.description);
      expect(mathIn(description, '.math-inline-isolated'), `${rule.tab}: inline isolate`).not.toBeNull();

      // The result panel shows the rule applied to m = 3, n = 2.
      const expression = mathIn(container.querySelector('.exponent-result-math'), '.katex');
      expect(formulaOf(expression), `${rule.tab}: rendered expression`).toBe(rule.expression);
    }
  });

  it('never shows a literal $, raw TeX source, or a katex-error element', () => {
    const { container } = render(<ExponentRulesExplorer />);

    for (const rule of RULES) {
      selectRule(rule.tab);
      expect(container.querySelector('.katex-error'), `${rule.tab}: katex-error`).toBeNull();
      expect(container.textContent, `${rule.tab}: literal $`).not.toContain('$');

      const prose = proseOf(container);
      expect(prose, `${rule.tab}: raw TeX command`).not.toMatch(/\\(?:times|frac|div|cdot|le|ge|text|dots)/);
      expect(prose, `${rule.tab}: raw TeX syntax`).not.toMatch(/\^\{|_\{|\\/);
      // Non-vacuous: KaTeX really rendered something in this state.
      expect(container.querySelectorAll('.katex').length, `${rule.tab}: formulas`).toBeGreaterThanOrEqual(4);
    }
  });

  it('keeps Arabic outside the math elements and the formulas inside them', () => {
    const { container } = render(<ExponentRulesExplorer />);

    for (const rule of RULES) {
      selectRule(rule.tab);
      const formulas = Array.from(container.querySelectorAll('.katex'));
      expect(formulas.length, `${rule.tab}: formulas present`).toBeGreaterThan(0);
      for (const formula of formulas) {
        // KaTeX output carries the hidden MathML copy; read the visible layer only.
        expect(ARABIC.test(formulaOf(formula)), `${rule.tab}: Arabic inside KaTeX`).toBe(false);
        expect(formulaOf(formula).length, `${rule.tab}: empty formula`).toBeGreaterThan(0);
      }
      // The Arabic prose of the rule survived next to the formula.
      expect(ARABIC.test(proseOf(container.querySelector('.exponent-rule-description')!))).toBe(true);
      expect(proseOf(container), `${rule.tab}: Arabic UI prose`).toContain(rule.lead);
    }
  });
});

describe('ExponentRulesExplorer — result label and hint', () => {
  it('renders «الناتج بالصيغة 10^p» as a formula instead of literal dollar signs', () => {
    const { container } = render(<ExponentRulesExplorer />);
    const label = container.querySelector('.exponent-result-label');

    expect(label, 'result label').not.toBeNull();
    expect(mathIn(label, '.math-inline-isolated'), 'label formula isolate').not.toBeNull();
    expect(formulaOf(mathIn(label, '.katex'))).toBe('10p');
    expect(mathIn(label, '.msupsub'), 'a genuine superscript').not.toBeNull();

    const prose = proseOf(label);
    expect(prose).toContain('الناتج بالصيغة');
    expect(prose).toContain(':');
    expect(prose).not.toContain('$');
    expect(prose).not.toContain('10^p');
    expect(container.querySelector('.katex-error')).toBeNull();
  });

  it('renders the hint equation 10^{-(-3)} = 10^3 with its Arabic prose intact', () => {
    const { container } = render(<ExponentRulesExplorer />);
    const hint = container.querySelector('.exponent-hint');

    expect(hint, 'hint paragraph').not.toBeNull();
    expect(formulaOf(mathIn(hint, '.katex'))).toBe('10−(−3)=103');
    expect(mathIn(hint, '.math-inline-isolated'), 'hint formula isolate').not.toBeNull();
    expect(hint!.querySelector('.katex-error'), 'hint katex-error').toBeNull();

    const prose = proseOf(hint);
    for (const fragment of ['💡', 'جرّب', 'قاعدة المقلوب', 'لتفهم لماذا']) {
      expect(prose, `hint prose must keep "${fragment}"`).toContain(fragment);
    }
    expect(prose).not.toContain('$');
    expect(prose).not.toContain('10^{-(-3)}');
  });
});

describe('ExponentRulesExplorer — direction, isolation and vertical fractions', () => {
  it('isolates every formula in LTR inside the RTL interface', () => {
    const { container } = render(<ExponentRulesExplorer />);

    expect(container.querySelector('.exponent-rules-explorer')).toHaveAttribute('dir', 'rtl');

    for (const rule of RULES) {
      selectRule(rule.tab);
      const isolates = Array.from(
        container.querySelectorAll('.math-inline-isolated, .math-block-isolated'),
      );
      expect(isolates.length, `${rule.tab}: isolates`).toBeGreaterThanOrEqual(4);
      for (const isolate of isolates) {
        expect(isolate, `${rule.tab}: isolate direction`).toHaveAttribute('dir', 'ltr');
        expect((isolate as HTMLElement).style.unicodeBidi, `${rule.tab}: bidi isolation`).toBe('isolate');
      }
      expect(container.querySelector('.exponent-result-math')).toHaveAttribute('dir', 'ltr');
    }
  });

  it('stacks the fractions of the division and reciprocal rules only, and toggles the decimal check', () => {
    const { container } = render(<ExponentRulesExplorer />);

    for (const rule of RULES) {
      selectRule(rule.tab);
      const stacked = container.querySelectorAll('.katex .mfrac').length;
      if (rule.fractions === 0) {
        expect(stacked, `${rule.tab}: no fraction in this rule`).toBe(0);
      } else {
        expect(stacked, `${rule.tab}: description + expression fractions`).toBeGreaterThanOrEqual(rule.fractions);
      }
    }

    // Division: the decimal verification is a plain quotient, still correctly rendered.
    selectRule('القسمة');
    fireEvent.click(screen.getByText('تحقق بالقيم العشرية'));
    const dividePanel = container.querySelector('.exponent-verify-panel');
    expect(dividePanel, 'verification panel').not.toBeNull();
    expect(dividePanel).toHaveAttribute('dir', 'ltr');
    expect(formulaOf(mathIn(dividePanel, '.katex'))).toBe('1000÷100=10');

    // Reciprocal: the verification adds a third stacked fraction (1/1000 = 0.001).
    selectRule('المقلوب');
    const reciprocalPanel = container.querySelector('.exponent-verify-panel');
    expect(reciprocalPanel, 'panel stays open when switching rule').not.toBeNull();
    const reciprocalFormula = formulaOf(mathIn(reciprocalPanel, '.katex'));
    expect(reciprocalFormula).toContain('1000');
    expect(reciprocalFormula).toContain('0.001');
    expect(container.querySelectorAll('.katex .mfrac').length).toBeGreaterThanOrEqual(3);
    expect(mathIn(reciprocalPanel, '.math-block-isolated'), 'display isolate').not.toBeNull();
    expect(container.querySelector('.katex-error')).toBeNull();
    expect(container.textContent).not.toContain('$');

    // The toggle hides the panel again and restores its label.
    fireEvent.click(screen.getByText('إخفاء التحقق العشري'));
    expect(container.querySelector('.exponent-verify-panel')).toBeNull();
    expect(screen.getByText('تحقق بالقيم العشرية')).toBeInTheDocument();
  });
});
