import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import katex from 'katex';
import { IntegerPowerStudio } from '../components/interactive/IntegerPowerStudio';
import { calculatePowerRule, PowerRulesStudio, type PowerRuleId } from '../components/interactive/PowerRulesStudio';
import { OrderOfOperationsLab } from '../components/interactive/OrderOfOperationsLab';
import { CubeVolumeLab } from '../components/interactive/CubeVolumeLab';
import { decimalOf, fractionPower, intPow, normalise, terminatingDecimalDigits } from '../components/interactive/powerMath';
import { exactPower, rational, visibleTextOf, type Rational } from './fixtures/lesson3-exact-math';

const resultIs = (id: string, value: Rational) => {
  const result = screen.getByTestId(id);
  expect(result).toHaveAttribute('data-num', String(value.n));
  expect(result).toHaveAttribute('data-den', String(value.d));
  expect(result.querySelector('.katex')).not.toBeNull();
};
const clickTimes = (label: string, count: number) => {
  for (let index = 0; index < count; index++) fireEvent.click(screen.getByRole('button', { name: label }));
};
const noRawMath = (container: HTMLElement) => {
  expect(container.querySelector('.katex-error, [data-math-error]')).toBeNull();
  expect(visibleTextOf(container)).not.toMatch(/\$|\\(?:frac|times|left|right|text|begin)/);
};

describe('Lesson 3 exact power engine — independent supported-grid calculation', () => {
  it('checks all 130 base/exponent states, rejecting all six undefined zero states', () => {
    const bases = [[3, 1], [5, 1], [-2, 1], [-3, 1], [1, 4], [3, 2], [-2, 3], [-2, 5], [1, 1], [0, 1]];
    let defined = 0, undefinedStates = 0;
    for (const [num, den] of bases) for (let exponent = -5; exponent <= 7; exponent++) {
      if (num === 0 && exponent <= 0) {
        expect(() => fractionPower({ num, den }, exponent)).toThrow(RangeError);
        expect(() => exactPower(rational(num, den), exponent)).toThrow(RangeError);
        undefinedStates++;
      } else {
        const expected = exactPower(rational(num, den), exponent);
        const actual = fractionPower({ num, den }, exponent);
        expect(actual).toEqual({ num: Number(expected.n), den: Number(expected.d) });
        const decimal = decimalOf(actual);
        if (decimal !== null) expect(Number(decimal)).toBeCloseTo(Number(expected.n) / Number(expected.d), 12);
        defined++;
      }
    }
    expect([defined, undefinedStates]).toEqual([124, 6]);
  });

  it('checks all 1,040 supported rule combinations against independent BigInt powers', () => {
    const rules: PowerRuleId[] = ['product', 'quotient', 'product-power', 'quotient-power'];
    let checked = 0;
    for (const rule of rules) for (const a of [2, 3, 5, -2, -3]) {
      for (const b of rule.endsWith('-power') ? [3, 4, 5, 7, -2] : [3]) {
        for (let n = -3; n <= 4; n++) for (const m of rule.endsWith('-power') ? [2] : [-3, -2, -1, 0, 1, 2, 3, 4]) {
          const expected = rule === 'product' ? exactPower(rational(a), n + m)
            : rule === 'quotient' ? exactPower(rational(a), n - m)
              : rule === 'product-power' ? exactPower(rational(a * b), n)
                : exactPower(rational(a, b), n);
          const actual = calculatePowerRule(rule, a, b, n, m);
          expect(actual.result, `${rule}/${a}/${b}/${n}/${m}`).toEqual({ num: Number(expected.n), den: Number(expected.d) });
          expect(actual.verified).toBe(true);
          for (const tex of [actual.leftTex, actual.rightTex, actual.checkTex]) {
            expect(() => katex.renderToString(tex, { throwOnError: true })).not.toThrow();
          }
          checked++;
        }
      }
    }
    expect(checked).toBe(1040);
  });

  it('guards zero denominators, non-integer exponents, overflow and canonical zero', () => {
    expect(() => normalise(1, 0)).toThrow(RangeError);
    expect(() => normalise(Number.MAX_SAFE_INTEGER + 1, 1)).toThrow(RangeError);
    expect(normalise(0, -4)).toEqual({ num: 0, den: 1 });
    expect(normalise(-3, -4)).toEqual({ num: 3, den: 4 });
    expect(() => fractionPower({ num: 2, den: 0 }, 0)).toThrow(RangeError);
    expect(() => fractionPower({ num: 2, den: 1 }, 1.5)).toThrow(RangeError);
    expect(() => intPow(0, 0)).toThrow(RangeError);
    expect(() => intPow(2, -1)).toThrow(RangeError);
    expect(() => intPow(10, 16)).toThrow(RangeError);
    expect(() => terminatingDecimalDigits(0)).toThrow(RangeError);
    expect(() => calculatePowerRule('quotient-power', 2, 0, -1, 2)).toThrow(RangeError);
  });
});

describe('IntegerPowerStudio — real controls, factors, domains and reset', () => {
  it('updates exact results and parenthesized negative/fraction factors, with a truthful outside-minus comparison', () => {
    const { container } = render(<IntegerPowerStudio />);
    resultIs('power-exact-result', rational(27));
    fireEvent.click(screen.getByRole('button', { name: 'الأساس (−2)' }));
    fireEvent.click(screen.getByRole('button', { name: 'انتقل إلى الأس 2' }));
    resultIs('power-exact-result', rational(4));
    const formulas = [...container.querySelectorAll('annotation')].map((node) => node.textContent ?? '');
    expect(formulas).toContain('\\left(-2\\right)\\times\\left(-2\\right)');
    expect(formulas).toContain('-\\left(2\\right)^{2}=-4');
    fireEvent.click(screen.getByRole('button', { name: 'انتقل إلى الأس -2' }));
    resultIs('power-exact-result', rational(1, 4));
    expect(screen.getByRole('status')).toHaveTextContent('زوجي');
    fireEvent.click(screen.getByRole('button', { name: 'الأساس (−2/3)' }));
    resultIs('power-exact-result', rational(9, 4));
    expect(container.querySelector('.power-studio')!).toHaveAttribute('dir', 'rtl');
    expect(container.querySelector('.power-studio-formula')!).toHaveAttribute('dir', 'ltr');
    noRawMath(container);
  });

  it('handles negative decimals, one, and all zero domain cases without Infinity or a misleading numeric result', () => {
    const { container } = render(<IntegerPowerStudio />);
    fireEvent.click(screen.getByRole('button', { name: 'الأساس (−0.4)' }));
    fireEvent.click(screen.getByRole('button', { name: 'انتقل إلى الأس -2' }));
    clickTimes('إنقاص الأس', 1);
    resultIs('power-exact-result', rational(-125, 8));
    expect(container).toHaveTextContent('-15.625');
    fireEvent.click(screen.getByRole('button', { name: 'الأساس 1' }));
    resultIs('power-exact-result', rational(1));
    fireEvent.click(screen.getByRole('button', { name: 'الأساس 0' }));
    expect(screen.queryByTestId('power-exact-result')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('لا مقلوب للصفر');
    fireEvent.click(screen.getByRole('button', { name: 'انتقل إلى الأس 0' }));
    expect(screen.queryByTestId('power-exact-result')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('غير معرّفة');
    fireEvent.click(screen.getByRole('button', { name: 'انتقل إلى الأس 1' }));
    resultIs('power-exact-result', rational(0));
    expect(visibleTextOf(container)).not.toMatch(/Infinity|NaN/);
    fireEvent.click(screen.getByRole('button', { name: 'إعادة تجربة القوى إلى البداية' }));
    resultIs('power-exact-result', rational(27));
    expect(screen.getByRole('button', { name: 'الأساس 3' })).toHaveAttribute('aria-pressed', 'true');
    noRawMath(container);
  });

  it('enforces both exponent boundaries and keeps the last valid result', () => {
    render(<IntegerPowerStudio />);
    clickTimes('زيادة الأس', 4);
    resultIs('power-exact-result', rational(2187));
    expect(screen.getByRole('button', { name: 'زيادة الأس' })).toBeDisabled();
    clickTimes('زيادة الأس', 1);
    resultIs('power-exact-result', rational(2187));
    clickTimes('إنقاص الأس', 12);
    resultIs('power-exact-result', rational(1, 243));
    expect(screen.getByRole('button', { name: 'إنقاص الأس' })).toBeDisabled();
  });
});

describe('PowerRulesStudio — existing scoped labs, controls and reset', () => {
  it('makes every quotient control effective, handles minus-minus, negative denominators and reset', () => {
    const { container } = render(<PowerRulesStudio rules={['quotient', 'quotient-power']} />);
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    resultIs('rule-exact-result', rational(2));
    clickTimes('إنقاص الأس n', 6);
    clickTimes('زيادة الأس m', 2);
    resultIs('rule-exact-result', rational(1, 128));
    expect(screen.getByRole('button', { name: 'إنقاص الأس n' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'زيادة الأس m' })).toBeDisabled();
    fireEvent.click(screen.getByRole('tab', { name: 'قوة الخارج' }));
    fireEvent.click(screen.getByRole('button', { name: 'الأساس a يساوي 3' }));
    fireEvent.click(screen.getByRole('button', { name: 'الأساس b يساوي -2' }));
    resultIs('rule-exact-result', rational(-8, 27));
    fireEvent.click(screen.getByRole('button', { name: 'إعادة تجربة القواعد إلى البداية' }));
    resultIs('rule-exact-result', rational(2));
    expect(screen.getByRole('tab', { name: 'خارج قسمة قوتين' })).toHaveAttribute('aria-selected', 'true');
    noRawMath(container);
  });

  it('multiplies, rather than adds, equal-exponent bases and resets to the first permitted rule', () => {
    const { container } = render(<PowerRulesStudio rules={['product', 'product-power']} />);
    resultIs('rule-exact-result', rational(32));
    fireEvent.click(screen.getByRole('tab', { name: 'قوة الجداء' }));
    resultIs('rule-exact-result', rational(216));
    expect(container).toHaveTextContent('نضرب الأساسين');
    expect(container).not.toHaveTextContent('نجمع الأساسين');
    fireEvent.click(screen.getByRole('button', { name: 'الأساس a يساوي -2' }));
    fireEvent.click(screen.getByRole('button', { name: 'الأساس b يساوي -2' }));
    resultIs('rule-exact-result', rational(64));
    clickTimes('إنقاص الأس n', 3);
    resultIs('rule-exact-result', rational(1));
    fireEvent.click(screen.getByRole('button', { name: 'إعادة تجربة القواعد إلى البداية' }));
    resultIs('rule-exact-result', rational(32));
    expect(screen.getByRole('tab', { name: 'جداء قوتين' })).toHaveAttribute('aria-selected', 'true');
    noRawMath(container);
  });
});

describe('OrderOfOperationsLab — A/B comparison and all C substitutions', () => {
  it('recomputes all 100 factor/exponent combinations without stale formulas', () => {
    const { container } = render(<OrderOfOperationsLab />);
    const a = screen.getByLabelText('العامل الأول');
    const b = screen.getByLabelText('العامل الثاني');
    const n = screen.getByLabelText('الأس المشترك');
    for (let first = 2; first <= 6; first++) for (let second = 2; second <= 5; second++) for (let power = 0; power <= 4; power++) {
      fireEvent.change(a, { target: { value: String(first) } });
      fireEvent.change(b, { target: { value: String(second) } });
      fireEvent.change(n, { target: { value: String(power) } });
      expect(screen.getByTestId('priority-comparison-A').querySelector('annotation')!.textContent).toContain(`=${(first * second) ** power}`);
      expect(screen.getByTestId('priority-comparison-B').querySelector('annotation')!.textContent).toContain(`=${first * second ** power}`);
      expect(screen.getByTestId('priority-lab-result')).toHaveTextContent(String((first * second) ** power));
    }
    noRawMath(container);
  });

  it('matches initial A/B/C, all 13 x values including zero, and a complete reset', () => {
    const { container } = render(<OrderOfOperationsLab />);
    expect(screen.getByTestId('priority-lab-result')).toHaveTextContent('8000');
    fireEvent.click(screen.getByRole('tab', { name: /الحالة B/ }));
    expect(screen.getByTestId('priority-lab-result')).toHaveTextContent('320');
    fireEvent.click(screen.getByRole('tab', { name: /الحالة C/ }));
    expect(screen.getByTestId('priority-lab-result')).toHaveTextContent('-234');
    const slider = screen.getByLabelText('قيمة المتغير x');
    for (let x = -6; x <= 6; x++) {
      fireEvent.change(slider, { target: { value: String(x) } });
      expect(screen.getByTestId('priority-lab-result').textContent).toBe(String(5 * x ** 3 + 6 * x ** 2 - 10));
      const formulas = [...container.querySelectorAll('.priority-lab-step-math annotation')].map((node) => node.textContent);
      expect(formulas[0]).toBe(`C=5(${x})^3+6(${x})^2-10`);
      expect(formulas[2]).toContain(`5(${x ** 3})=${5 * x ** 3}`);
      expect(formulas[2]).toContain(`6(${x ** 2})=${6 * x ** 2}`);
    }
    fireEvent.click(screen.getByRole('button', { name: 'إعادة تجربة الأولويات إلى البداية' }));
    expect(screen.getByTestId('priority-lab-result').textContent).toBe('8000');
    expect(screen.getByLabelText('العامل الأول')).toHaveValue('5');
    fireEvent.click(screen.getByRole('tab', { name: /الحالة C/ }));
    expect(slider).not.toBeInTheDocument();
    expect(screen.getByLabelText('قيمة المتغير x')).toHaveValue('-4');
    expect(screen.getByTestId('priority-lab-result').textContent).toBe('-234');
    noRawMath(container);
  });
});

describe('CubeVolumeLab — exact conversion paths and genuine scaling', () => {
  it('recomputes all 18 length/scale combinations, changes the proportional SVG, and resets', () => {
    const { container } = render(<CubeVolumeLab />);
    const originalShape = container.querySelector('polygon')!.getAttribute('points');
    expect(screen.getByTestId('cube-volume-result')).toHaveAttribute('data-volume', '3375');
    for (let halves = 1; halves <= 6; halves++) for (const factor of [1, 2, 3]) {
      fireEvent.change(screen.getByLabelText('طول الحرف بالديسيمتر'), { target: { value: String(halves) } });
      fireEvent.click(screen.getByRole('radio', { name: factor === 1 ? 'الحجم الأصلي' : factor === 2 ? 'الحرف مرتان' : 'الحرف ثلاث مرات' }));
      const edgeCm = halves * 5;
      const result = screen.getByTestId('cube-volume-result');
      expect(result).toHaveAttribute('data-volume', String(edgeCm ** 3));
      expect(result).toHaveAttribute('data-scaled-volume', String((edgeCm * factor) ** 3));
      expect(result).toHaveAttribute('data-ratio', String(factor ** 3));
      expect((halves / 2) ** 3 * 1000).toBe(edgeCm ** 3);
      expect(screen.getByRole('img')).toHaveAccessibleName(`مقارنة مكعب حرفه ${edgeCm} سنتيمترًا بمكعب حرفه ${edgeCm * factor} سنتيمترًا`);
    }
    expect(container.querySelector('polygon')!.getAttribute('points')).not.toBe(originalShape);
    fireEvent.click(screen.getByRole('button', { name: 'إعادة تجربة الحجم إلى البداية' }));
    expect(screen.getByLabelText('طول الحرف بالديسيمتر')).toHaveValue('3');
    expect(screen.getByRole('radio', { name: 'الحجم الأصلي' })).toBeChecked();
    expect(screen.getByTestId('cube-volume-result')).toHaveAttribute('data-scaled-volume', '3375');
    noRawMath(container);
  });
});
