import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { EquationBalanceLab } from '../components/interactive/EquationBalanceLab';
import { EquationMatchLab } from '../components/interactive/EquationMatchLab';
import { EquationStepsLab } from '../components/interactive/EquationStepsLab';

/**
 * اختبارات CSS/DOM لثلاثة إصلاحات في الوحدة الرابعة:
 *  D2 — كفّة الميزان «اليسرى» تُرسم على اليسار البصري فعلًا.
 *  D7 — حلقة تركيز واضحة لعناصر التحكّم، دون إزالة مخطط التركيز الافتراضي.
 *  D8 — احترام `prefers-reduced-motion`.
 *
 * ملاحظة صريحة: هذه اختبارات مصدر CSS/DOM لا لقطات شاشة. التحقّق البصري
 * الحقيقي (موضع الكفّة على الشاشة، ولون حلقة التركيز) يحتاج متصفّحًا وليس jsdom،
 * لأن jsdom لا يحسب أنماط ملفّات CSS الخارجية ولا يطبّق اتجاه flexbox.
 */

const css = readFileSync(resolve(__dirname, '../styles/unit4.css'), 'utf8');

/** يستخرج جسم قاعدة CSS مسطّحة (بلا تعشيش) بالمحدّد المعطى. */
const ruleBody = (selector: string): string => {
  const start = css.indexOf(`${selector} {`);
  expect(start, `missing CSS rule: ${selector}`).toBeGreaterThanOrEqual(0);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  return css.slice(open + 1, close);
};

describe('Unit 4 — balance pans keep their visual sides (D2)', () => {
  it('renders the left pan first and labels it «الكفّة اليسرى»', () => {
    const { container } = render(
      <EquationBalanceLab left={{ xCount: 2, constant: 35 }} right={{ xCount: 1, constant: 125 }} secretValue={90} />,
    );
    const pans = [...container.querySelectorAll('.u4-balance-pan')];
    expect(pans).toHaveLength(2);
    expect(pans[0].classList.contains('u4-balance-pan-left')).toBe(true);
    expect(pans[0].textContent).toContain('الكفّة اليسرى');
    expect(pans[1].classList.contains('u4-balance-pan-right')).toBe(true);
    expect(pans[1].textContent).toContain('الكفّة اليمنى');

    // الحاوية تحمل المعادلة المقابلة: الكفّة الأولى = الطرف الأيسر.
    const equation = container.querySelector('.u4-balance-equation')?.textContent ?? '';
    expect(equation.indexOf('2')).toBeLessThan(equation.indexOf('125'));
  });

  it('fixes the pan row to LTR while each pan keeps Arabic RTL inside it', () => {
    const pans = ruleBody('.u4-balance-pans');
    expect(pans).toMatch(/direction:\s*ltr/);
    const pan = ruleBody('.u4-balance-pan');
    expect(pan).toMatch(/direction:\s*rtl/);
    // لا يُقلب ترتيب الكفّتين بـ row-reverse أو order.
    expect(pans).not.toMatch(/row-reverse/);
    expect(pan).not.toMatch(/(?<![-a-z])order:/);
  });
});

describe('Unit 4 — keyboard focus ring (D7)', () => {
  it('gives every interactive control an explicit :focus-visible outline', () => {
    for (const selector of [
      '.u4-balance-btn:focus-visible',
      '.u4-steps-apply:focus-visible',
      '.u4-steps-field select:focus-visible',
      '.u4-steps-field input:focus-visible',
      '.u4-match-cell:focus-visible',
    ]) {
      expect(css, selector).toContain(selector);
    }

    const block = css.slice(css.indexOf('.u4-balance-btn:focus-visible'));
    const body = block.slice(block.indexOf('{') + 1, block.indexOf('}'));
    expect(body).toMatch(/outline:\s*3px solid var\(--color-primary-400\)/);
    expect(body).toMatch(/outline-offset:\s*2px/);
  });

  it('never removes the browser focus indicator without replacing it', () => {
    // قاعدة عامّة: أي `outline: none` يجب أن يقابله ظلّ تركيز بديل.
    const outlines = [...css.matchAll(/outline:\s*(none|0)/g)];
    expect(outlines, 'unit4.css must not silence focus outlines').toHaveLength(0);
  });

  it('keeps the controls reachable and focusable in the DOM', () => {
    const balance = render(
      <EquationBalanceLab left={{ xCount: 2, constant: 35 }} right={{ xCount: 1, constant: 125 }} secretValue={90} />,
    );
    // كل عمليات الميزان أزرار حقيقية (لا div بنقرات).
    const balanceButtons = [...balance.container.querySelectorAll('button')];
    expect(balanceButtons.length).toBeGreaterThanOrEqual(5);
    for (const button of balanceButtons) expect(button.getAttribute('type')).toBe('button');

    const steps = render(
      <EquationStepsLab left={{ a: { n: 2, d: 1 }, b: { n: 0, d: 1 } }} right={{ a: { n: 0, d: 1 }, b: { n: 8, d: 1 } }} />,
    );
    expect(steps.container.querySelector('select')).toBeTruthy();
    expect(steps.container.querySelector('input[type="text"]')).toBeTruthy();
    expect([...steps.container.querySelectorAll('button')].length).toBeGreaterThanOrEqual(2);

    const match = render(<EquationMatchLab pairs={[{ id: 'p1', left: 'x-5=3', right: 'x=8', reason: '' }]} />);
    const cells = [...match.container.querySelectorAll('.u4-match-cell')];
    expect(cells.length).toBe(2);
    for (const cell of cells) expect(cell.tagName).toBe('BUTTON');
  });
});

describe('Unit 4 — reduced motion (D8)', () => {
  it('disables the lab transitions under prefers-reduced-motion: reduce', () => {
    const start = css.indexOf('@media (prefers-reduced-motion: reduce)');
    expect(start, 'missing prefers-reduced-motion block').toBeGreaterThanOrEqual(0);
    const block = css.slice(start, css.indexOf('\n}', start) + 2);
    for (const selector of [
      '.u4-balance-beam',
      '.u4-balance-pan',
      '.u4-balance-btn',
      '.u4-steps-apply',
      '.u4-match-cell',
    ]) {
      expect(block, selector).toContain(selector);
    }
    expect(block).toMatch(/transition:\s*none/);

    // الانتقالات التي نُعطّلها موجودة فعلًا في القواعد الأساسية (لا قاعدة ميتة).
    for (const selector of ['.u4-balance-beam', '.u4-balance-pan', '.u4-match-cell']) {
      expect(ruleBody(selector)).toMatch(/transition:/);
    }
  });
});
