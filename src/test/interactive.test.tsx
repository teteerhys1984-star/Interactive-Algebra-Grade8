import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultipleChoiceQuestion } from '../components/interactive/MultipleChoiceQuestion';
import { FillInBlanksQuestion } from '../components/interactive/FillInBlanksQuestion';
import { IntruderFinderQuestion } from '../components/interactive/IntruderFinderQuestion';
import { JuiceVisualizer } from '../components/interactive/JuiceVisualizer';

describe('Interactive Components Suite', () => {
  it('MCQ handles option selection and shows explanation', () => {
    const options = [
      { id: '1', label: '①', text: '\\frac{1}{4}', isCorrect: true, explanation: 'صحيحة؛ حصة باسل هي الربع.' },
      { id: '2', label: '②', text: '\\frac{6}{8}', isCorrect: false, explanation: 'غير صحيحة.' },
    ];

    render(<MultipleChoiceQuestion options={options} />);
    const opt1 = screen.getByText('①');
    fireEvent.click(opt1);

    expect(screen.getByText(/إجابة صحيحة!/)).toBeInTheDocument();
    expect(screen.getByText(/حصة باسل هي الربع/)).toBeInTheDocument();
  });

  it('FillInBlanksQuestion reveals and hides solution on toggle', () => {
    render(
      <FillInBlanksQuestion
        prompt="أكمل الفراغ:"
        expression="-\\frac{1}{2} + \\frac{5}{8} = \\frac{[ -4 ]}{8} + \\frac{5}{8} = \\frac{[ 1 ]}{8}"
        solution="-\\frac{1}{2} + \\frac{5}{8} = \\frac{-4}{8} + \\frac{5}{8} = \\frac{1}{8}"
      />
    );

    const toggleBtn = screen.getByText('إظهار الحل والخطوات');
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByText('الحل التفصيلي المعتمد:')).toBeInTheDocument();
    expect(screen.getByText('إخفاء الحل')).toBeInTheDocument();
  });

  it('IntruderFinder identifies odd-one-out fractions with feedback', () => {
    const lists = [
      {
        id: 'list-1',
        label: 'القائمة الأولى:',
        items: [
          { fraction: '\\frac{45}{20}', value: 2.25, isIntruder: false },
          { fraction: '\\frac{19}{14}', value: 1.357, isIntruder: true },
        ],
        explanation: 'الكسر 19/14 دخيل لأن بقية الكسور تساوي 2.25.',
      },
    ];

    const { container } = render(<IntruderFinderQuestion lists={lists} />);
    const buttons = container.querySelectorAll('.intruder-card-btn');
    expect(buttons.length).toBe(2);

    // Click the intruder (second item)
    fireEvent.click(buttons[1]);
    expect(screen.getByText(/أحسنت! هذا هو الكسر الدخيل/)).toBeInTheDocument();
  });

  it('JuiceVisualizer simulates liquid mixing and updates state on button click', () => {
    render(<JuiceVisualizer />);
    expect(screen.getByText(/محاكي خلط العصير التفاعلي/)).toBeInTheDocument();

    const addBtn = screen.getByText(/أضف/);
    fireEvent.click(addBtn);

    expect(screen.getByText(/تمت إضافة عصير الموز/)).toBeInTheDocument();
  });
});
