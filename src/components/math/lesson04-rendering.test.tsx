import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { lesson04Data } from '../../data/unit1/lesson04';
import { SourceContentBlock } from '../lesson/SourceContentBlock';

const block = (stepIndex: number, blockId: string) => {
  const found = lesson04Data.steps[stepIndex].blocks.find((candidate) => candidate.id === blockId);
  if (!found) throw new Error(`Missing Lesson 4 block: ${blockId}`);
  return found;
};

const visibleTextWithoutKatexSource = (container: HTMLElement) => {
  const clone = container.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('annotation').forEach((annotation) => annotation.remove());
  return clone.textContent ?? '';
};

describe('Lesson 4 LaTeX rendering regression', () => {
  it('keeps LaTeX commands intact at runtime instead of control-character escapes', () => {
    const sourceWithFractions = block(1, 'source-2');
    const sourceWithProducts = block(0, 'source-1');

    expect(sourceWithFractions.content).toContain('$\\frac{7}{3}-\\frac{-5}{3}$');
    expect(sourceWithFractions.mathFormula).toBe('\\frac{7}{3}-\\frac{-5}{3}');
    expect(sourceWithProducts.content).toContain('$5\\times(-2)\\times6');
    expect(sourceWithProducts.mathFormula).toBe('5\\times(-2)\\times6\\times(-4)\\times(-1)');

    const renderedLessonText = lesson04Data.steps
      .flatMap((step) => step.blocks)
      .flatMap((lessonBlock) => [lessonBlock.content, lessonBlock.mathFormula, lessonBlock.explanation])
      .filter((value): value is string => Boolean(value))
      .join('\n');

    expect(renderedLessonText).not.toContain('\f');
    expect(renderedLessonText).not.toContain('\t');
  });

  it('renders Lesson 4 source fractions through KaTeX without exposing raw delimiters', () => {
    const sourceWithFractions = block(1, 'source-2');
    const { container } = render(<SourceContentBlock block={sourceWithFractions} />);

    const visibleText = visibleTextWithoutKatexSource(container);

    expect(container.querySelectorAll('.katex .mfrac').length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector('.katex-error')).not.toBeInTheDocument();
    expect(visibleText).not.toContain('\\frac');
    expect(visibleText).not.toContain('$');
    expect(visibleText).not.toContain('\f');
  });

  it('strips math delimiters before passing single-expression results to display KaTeX', () => {
    const solutionWithSingleResult = block(2, 'solution-3');

    expect(solutionWithSingleResult.mathFormula).toBe('\\frac{7}{8}');
    expect(solutionWithSingleResult.mathFormula).not.toContain('$');

    const { container } = render(<SourceContentBlock block={solutionWithSingleResult} />);
    expect(container.querySelector('.math-block-isolated .katex .mfrac')).toBeInTheDocument();
    expect(container.querySelector('.katex-error')).not.toBeInTheDocument();
  });

  it('does not treat mixed prose or multiple inline results as one display formula', () => {
    const mixedResultSolution = block(12, 'solution-13');
    const mixedResultBlock = block(12, 'result-13');

    expect(mixedResultSolution.mathFormula).toBeUndefined();

    const { container } = render(<SourceContentBlock block={mixedResultBlock} />);
    expect(container.querySelectorAll('.math-inline-isolated .katex').length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector('.math-block-isolated')).not.toBeInTheDocument();
    expect(container.querySelector('.katex-error')).not.toBeInTheDocument();
  });
});
