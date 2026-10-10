import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SquareNumberTable } from '../components/interactive/SquareNumberTable';
import { SquareRootExplorer } from '../components/interactive/SquareRootExplorer';
import { RootRulesStudio } from '../components/interactive/RootRulesStudio';
import { SquareRootSimplifier, largestSquareFactor } from '../components/interactive/SquareRootSimplifier';

/**
 * أدوات الدرس الرابع التفاعلية (الجذور التربيعية، الصفحات 35–37). كل أداة يغيّرها
 * الطالب بنفسه ويرى أثر التغيير: جدول المربعات، واستكشاف الجذر، وقواعد الجذور،
 * ومبسّط الجذور، وحساب طول الضلع من المساحة.
 */

describe('مبسّط الجذور: أكبر عامل مربع', () => {
  it.each([
    [1, 1],
    [2, 1],
    [8, 2],
    [27, 3],
    [50, 5],
    [72, 6],
    [75, 5],
    [98, 7],
    [108, 6],
    [400, 20],
  ])('أكبر عامل مربع للعدد %i هو جذر %i', (n, root) => {
    expect(largestSquareFactor(n)).toBe(root);
    // التحقق المستقل: الناتج يقسم العدد، ولا يوجد مربع أكبر يقسمه.
    expect(n % (root * root)).toBe(0);
    for (let k = root + 1; k * k <= n; k += 1) expect(n % (k * k)).not.toBe(0);
  });

  it('يعرض التبسيط عند تغيير القيمة، ويطلب عددًا صحيحًا عند الإدخال غير الصالح', () => {
    const { container } = render(<SquareRootSimplifier initialValue={50} />);
    const input = container.querySelector('input[type="number"]') as HTMLInputElement;
    expect(container.querySelector('.root-result')?.textContent).toContain('25');

    fireEvent.change(input, { target: { value: '49' } });
    expect(container.querySelector('.root-result')?.textContent).toContain('مربع كامل');

    fireEvent.change(input, { target: { value: '75' } });
    expect(container.querySelector('.root-result')?.textContent).toContain('75');
    expect(container.querySelector('.root-result')?.textContent).toContain('25');

    fireEvent.change(input, { target: { value: '0' } });
    expect(container.querySelector('.root-hint')?.textContent).toContain('أدخل عددًا صحيحًا');
  });
});

describe('استكشاف الجذر التربيعي وحساب الضلع', () => {
  it('الوضع الجذري: يعطي الجذر الصحيح للمربع الكامل، ويقرّب الجذر لغير المربع', () => {
    const { container } = render(<SquareRootExplorer mode="root" initialValue={16} />);
    const input = container.querySelector('input[type="number"]') as HTMLInputElement;
    expect(container.textContent).toContain('4');

    fireEvent.change(input, { target: { value: '5' } });
    // √5 ≈ 2.236067977، وهي القيمة التي يعرضها الاستوديو تقريبًا لتسعة أرقام عشرية.
    expect(container.textContent).toContain('2.236067977');
  });

  it('وضع المساحة: يحسب طول الضلع من المساحة بالسنتيمتر، مقرّبًا لأقرب جزء من عشرة', () => {
    const { container } = render(<SquareRootExplorer mode="area" initialValue={8} />);
    // √8 ≈ 2.8284 ⇒ 2.8 cm
    expect(container.textContent).toContain('2.828427125');
    expect(container.textContent).toContain('2.8');
  });
});

describe('مختبر قواعد الجذور: تحقّق من تساوي الطرفين', () => {
  it('خاصية الجداء بالقيم الافتراضية: الطرفان متساويان', () => {
    const { container } = render(<RootRulesStudio rules={['product']} />);
    expect(container.querySelector('.root-check')?.textContent).toContain('متساويان');
    expect(container.querySelector('.root-check')).toHaveClass('is-ok');
  });

  it('يتيح تغيير الأعداد ويعرض التحقّق من جديد، وهو متساوٍ لكل زوج موجب', () => {
    const { container } = render(<RootRulesStudio rules={['quotient']} />);
    // كل زرّ اختيار عدد موجب، ويجب أن يبقى التحقّق صحيحًا بعد كل تغيير.
    const buttons = Array.from(container.querySelectorAll('button')).filter((button) => /^\d+$/.test(button.textContent ?? ''));
    expect(buttons.length).toBeGreaterThan(2);
    for (const button of buttons.slice(0, 6)) {
      fireEvent.click(button);
      expect(container.querySelector('.root-check')).toHaveClass('is-ok');
    }
  });

  it('قاعدة قوّة الجذر متحققة بالقيم الافتراضية (الأساس 2 والأس 2)', () => {
    const { container } = render(<RootRulesStudio rules={['power']} />);
    expect(container.querySelector('.root-check')).toHaveClass('is-ok');
  });
});

describe('جدول مربعات الأعداد: تحقّق الخانات', () => {
  it('يحسب الخانات الصحيحة، ويعلّم الخطأ بعد التحقّق فقط', () => {
    const { container } = render(<SquareNumberTable />);
    const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input.root-square-input'));
    expect(inputs).toHaveLength(18);

    // قبل التحقّق لا تظهر أي نتيجة.
    expect(container.textContent).not.toContain('الصحيح:');

    for (const input of inputs) {
      const value = Number(input.getAttribute('aria-label')!.match(/(\d+)$/)![1]);
      fireEvent.change(input, { target: { value: String(value * value) } });
    }
    fireEvent.click(screen.getByRole('button', { name: 'تحقّق من الخانات' }));
    expect(container.textContent).toContain('الصحيح: 18 من 18');
  });

  it('يعدّ الخانة الخاطئة ويقترح مراجعة a² = a × a', () => {
    const { container } = render(<SquareNumberTable />);
    const three = container.querySelector<HTMLInputElement>('input[aria-label="مربع العدد 3"]')!;
    fireEvent.change(three, { target: { value: '6' } }); // خطأ شائع: 3 × 2 بدل 3 × 3
    fireEvent.click(screen.getByRole('button', { name: 'تحقّق من الخانات' }));
    expect(container.textContent).toContain('الصحيح: 0 من 18');
    expect(container.querySelector('.root-square-input.is-wrong')).toBeInTheDocument();
  });
});
