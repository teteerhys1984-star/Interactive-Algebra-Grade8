import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { PowerOfTenFrames } from '../components/interactive/PowerOfTenFrames';
import { NegativePowerZoom } from '../components/interactive/NegativePowerZoom';
import { StandardFormLab } from '../components/interactive/StandardFormLab';

/**
 * المكوّنات الثلاثة الجديدة للدرس الأول من الوحدة الثانية.
 * المعيار: إدخال الطالب يجب أن يغيّر الناتج فعلًا، وأن يكون التصحيح مشروطًا
 * بإجابته لا معروضًا سلفًا.
 */

describe('إطارات نشاط قوى العدد 10', () => {
  const fill = (labels: Record<string, string>) => {
    for (const [value, exponent] of Object.entries(labels)) {
      fireEvent.change(screen.getByLabelText(`أس العدد ${value}`), { target: { value: exponent } });
    }
  };

  it('لا يكشف الأس الصحيح قبل الضغط على «تحقّق»', () => {
    render(<PowerOfTenFrames />);
    expect(screen.queryByText(/^صحيح$/)).toBeNull();
    expect(screen.queryByText(/الصحيح 3/)).toBeNull();
    expect(screen.getByRole('button', { name: /تحقّق/ })).toBeDisabled();
  });

  it('يصحّح إجابة خاطئة ويظهر الأس الصحيح في الإطار', () => {
    render(<PowerOfTenFrames />);
    fill({ '1000': '4' });
    fireEvent.click(screen.getByRole('button', { name: /تحقّق/ }));

    expect(screen.getByText('الصحيح 3')).toBeInTheDocument();
    expect(screen.getByText(/راجع الإطارات المعلَّمة بالأحمر/)).toBeInTheDocument();
  });

  it('يقبل الإطارات السبعة الصحيحة ويعلن النمط', () => {
    render(<PowerOfTenFrames />);
    fill({ '1000': '3', '100': '2', '10': '1', '1': '0', '0.1': '-1', '0.01': '-2', '0.001': '-3' });
    fireEvent.click(screen.getByRole('button', { name: /تحقّق/ }));

    expect(screen.getByText(/أكملت الإطارات السبعة/)).toBeInTheDocument();
    expect(screen.getAllByText('صحيح')).toHaveLength(7);
    expect(screen.getByRole('button', { name: /تحقّق/ })).toBeDisabled();
  });

  it('يقبل الإشارة السالبة بكتابتها العربية أيضًا', () => {
    render(<PowerOfTenFrames />);
    fill({ '0.001': '−3' });
    fireEvent.click(screen.getByRole('button', { name: /تحقّق/ }));
    expect(screen.getByText('صحيح')).toBeInTheDocument();
  });
});

describe('مختبر القوة السالبة', () => {
  it('يبدأ من 10^{-3} ويعرض الفاصلة والخانات والتحقق', () => {
    const { container } = render(<NegativePowerZoom />);
    expect(container.querySelector('.neg-zoom-decimal')?.textContent).toBe('0.001');
    expect(container.querySelectorAll('.neg-zoom-place')).toHaveLength(3);
    expect(container.querySelectorAll('.neg-zoom-place.is-one')).toHaveLength(1);
    expect(container.textContent).toContain('0.001×1000=1');
  });

  it('تغيير الأس يغيّر العدد وعدد الخانات وقيمة المقام', () => {
    const { container } = render(<NegativePowerZoom />);
    const picks = container.querySelectorAll('.neg-zoom-pick');
    fireEvent.click(picks[5]); // 10^-6

    expect(container.querySelector('.neg-zoom-decimal')?.textContent).toBe('0.000001');
    expect(container.querySelectorAll('.neg-zoom-place')).toHaveLength(6);
    expect(container.textContent).toContain('0.000001×1000000=1');
    // عدد الأصفار قبل الرقم 1 يساوي n−1 لا n.
    expect(container.textContent).toContain('5');
  });
});

describe('مختبر الصيغة المعيارية', () => {
  const shiftLeft = (times: number) => {
    for (let i = 0; i < times; i += 1) {
      fireEvent.click(screen.getByLabelText('انقل الفاصلة خانة إلى اليسار'));
    }
  };

  const shiftRight = (times: number) => {
    for (let i = 0; i < times; i += 1) {
      fireEvent.click(screen.getByLabelText('انقل الفاصلة خانة إلى اليمين'));
    }
  };

  it('يبدأ بالعدد 2569.8 ويقول إنه ليس بصيغة معيارية', () => {
    const { container } = render(<StandardFormLab />);
    expect((screen.getByLabelText('العدد') as HTMLInputElement).value).toBe('2569.8');
    expect(container.querySelector('.sf-lab-status.is-standard')).toBeNull();
    expect(container.querySelector('.sf-lab-status')?.textContent).toContain('ليست صيغة معيارية');
  });

  it('بعد ثلاث خانات إلى اليسار تصبح الصيغة معيارية والأس 3', () => {
    const { container } = render(<StandardFormLab />);
    shiftLeft(3);
    expect(container.querySelector('.sf-lab-status.is-standard')).toBeInTheDocument();
    expect(container.querySelector('.sf-lab-track')?.textContent).toContain('2.5698');
    const exponent = Array.from(container.querySelectorAll('.sf-lab-track-value')).map((n) => n.textContent);
    expect(exponent).toContain('3');
  });

  it('يقرأ عددًا أدخلَه الطالب ويحسب أسّه الصحيح', () => {
    const { container } = render(<StandardFormLab />);
    fireEvent.change(screen.getByLabelText('العدد'), { target: { value: '0.075' } });
    shiftRight(2); // خانتان إلى اليمين
    expect(container.querySelector('.sf-lab-status.is-standard')).toBeInTheDocument();
    const values = Array.from(container.querySelectorAll('.sf-lab-track-value')).map((n) => n.textContent);
    expect(values).toContain('7.5');
    expect(values).toContain('-2');
  });

  it('يتعامل مع العدد السالب ويُبقي الإشارة أمام a', () => {
    const { container } = render(<StandardFormLab />);
    fireEvent.change(screen.getByLabelText('العدد'), { target: { value: '-2569.8' } });
    shiftLeft(3);
    const values = Array.from(container.querySelectorAll('.sf-lab-track-value')).map((n) => n.textContent);
    expect(values).toContain('-2.5698');
  });

  it('يعرض رسالة بدل الصيغة عند إدخال غير صالح', () => {
    const { container } = render(<StandardFormLab />);
    fireEvent.change(screen.getByLabelText('العدد'), { target: { value: 'abc' } });
    expect(within(container).getByRole('status')).toHaveTextContent('اكتب عددًا صحيحًا أو عشريًا');
  });
});
