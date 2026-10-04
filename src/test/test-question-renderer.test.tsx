import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { QuestionRenderer } from '../components/tests/QuestionRenderer';
import { resolveTest } from '../data/tests/registry';
import type { TestQuestion } from '../data/tests/types';

const unitQuestions = resolveTest('u1-test-unit-1')!.questions;
const questionOfType = (type: TestQuestion['type']) => {
  const question = unitQuestions.find((item) => item.type === type);
  if (!question) throw new Error(`The unit test has no ${type} question.`);
  return question;
};

describe('QuestionRenderer: production question types', () => {
  it('renders and accepts input for all seven question formats with RTL and isolated KaTeX', () => {
    const cases: Array<{
      type: TestQuestion['type'];
      interact: (container: HTMLElement, onChange: ReturnType<typeof vi.fn>) => void;
    }> = [
      {
        type: 'single-choice',
        interact: (container, onChange) => {
          const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
          fireEvent.click(input);
          expect(onChange).toHaveBeenCalledWith(input.value);
        },
      },
      {
        type: 'true-false',
        interact: (container, onChange) => {
          fireEvent.click(container.querySelector('input[value="true"]')!);
          expect(onChange).toHaveBeenCalledWith(true);
        },
      },
      {
        type: 'multi-select',
        interact: (container, onChange) => {
          const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
          fireEvent.click(input);
          const multiQuestion = questionOfType('multi-select');
          if (multiQuestion.type !== 'multi-select') throw new Error('Expected multi-select fixture.');
          expect(onChange).toHaveBeenCalledWith([multiQuestion.options[0].id]);
        },
      },
      {
        type: 'numeric',
        interact: (container, onChange) => {
          const input = container.querySelector('input[type="text"]') as HTMLInputElement;
          fireEvent.change(input, { target: { value: '٣/٤' } });
          expect(onChange).toHaveBeenCalledWith('٣/٤');
        },
      },
      {
        type: 'ordering',
        interact: (_container, onChange) => {
          fireEvent.click(screen.getByRole('button', { name: 'نقل البند 1 إلى الأسفل' }));
          expect(onChange).toHaveBeenCalledWith(expect.any(Array));
        },
      },
      {
        type: 'matching',
        interact: (container, onChange) => {
          const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
          fireEvent.click(input);
          expect(onChange).toHaveBeenCalledTimes(1);
          expect(onChange).toHaveBeenCalledWith(expect.any(Object));
        },
      },
      {
        type: 'error-analysis',
        interact: (container, onChange) => {
          const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
          fireEvent.click(input);
          expect(onChange).toHaveBeenCalledWith(input.value);
        },
      },
    ];

    for (const testCase of cases) {
      const onChange = vi.fn();
      const { container, unmount } = render(
        <QuestionRenderer
          question={questionOfType(testCase.type)}
          questionNumber={1}
          answer={undefined}
          onChange={onChange}
        />,
      );

      expect(container.querySelector('.test-question-body')).toHaveAttribute('dir', 'rtl');
      expect(container.querySelector('.katex')).toBeInTheDocument();
      const math = container.querySelector('.math-inline-isolated');
      expect(math).toHaveAttribute('dir', 'ltr');
      expect((math as HTMLElement).style.unicodeBidi).toBe('isolate');
      testCase.interact(container, onChange);
      unmount();
    }
  });
});
