import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { LessonExperience } from '../components/lesson/LessonExperience';
import { lesson04Data } from '../data/unit1/lesson04';
import { lesson01Data } from '../data/unit1/lesson01';
import { lesson02Data } from '../data/unit1/lesson02';
import { lesson03Data } from '../data/unit1/lesson03';
import {
  SourceContentBlock,
  isMathDuplicatedInText,
} from '../components/lesson/SourceContentBlock';

const renderStep = (index: number) =>
  render(
    <LessonExperience lesson={lesson04Data} initialStep={index} onNavigateBack={() => {}} />,
  );

describe('Lesson 4 — exercise presentation (Phase 2)', () => {
  it('shows the question header with overall progress and the current station', () => {
    const { container } = renderStep(0);
    expect(screen.getByText(/السؤال 1 من 47/)).toBeInTheDocument();
    expect(
      container.querySelector('.step-group-name')?.textContent,
    ).toContain('المحطة 1');
  });

  it('renders the six-part hierarchy for Q1 with hint and solution hidden by default', () => {
    const { container } = renderStep(0);
    const view = container.querySelector('.exercise-view')!;
    expect(within(view as HTMLElement).getByText('من الكتاب')).toBeInTheDocument();
    expect(within(view as HTMLElement).getByText('كيف نفكر؟')).toBeInTheDocument();
    expect(within(view as HTMLElement).getByText('تلميح')).toBeInTheDocument();
    expect(within(view as HTMLElement).getByText('الحل خطوة بخطوة')).toBeInTheDocument();
    expect(within(view as HTMLElement).getByText('النتيجة')).toBeInTheDocument();

    // Reveals are collapsed until the student asks for them.
    const hintBtn = container.querySelector('.hint-disclosure')!;
    const solutionBtn = container.querySelector('.solution-disclosure')!;
    expect(hintBtn.getAttribute('aria-expanded')).toBe('false');
    expect(solutionBtn.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelectorAll('.exercise-reveal').length).toBe(0);

    fireEvent.click(hintBtn);
    fireEvent.click(solutionBtn);
    expect(container.querySelectorAll('.exercise-reveal').length).toBe(2);
    expect(container.querySelector('.exercise-solution .exercise-reveal')?.textContent).toContain('240');
  });

  it('keeps the verified result visible and unchanged for Q1 and Q47', () => {
    const { container, unmount } = renderStep(0);
    expect(container.querySelector('.exercise-result')?.textContent).toContain('النتيجة النهائية');
    unmount();

    const last = renderStep(46);
    expect(screen.getByText(/السؤال 47 من 47/)).toBeInTheDocument();
    expect(last.container.querySelector('.exercise-result')).toBeTruthy();
  });

  it('still renders the Q15 sailboat SVG inside the source section', () => {
    const { container } = renderStep(14);
    const svg = container.querySelector('.exercise-source .sailboat-visual svg');
    expect(svg).toBeTruthy();
    expect(container.querySelector('.sailboat-visual')?.getAttribute('aria-label')).toContain('القارب');
  });

  it('renders KaTeX fractions and never leaks raw LaTeX delimiters or escapes', () => {
    for (const index of [0, 1, 14, 23, 46]) {
      const { container, unmount } = renderStep(index);
      fireEvent.click(container.querySelector('.hint-disclosure')!);
      fireEvent.click(container.querySelector('.solution-disclosure')!);
      // Visible text only: KaTeX keeps the original TeX inside a hidden
      // MathML annotation, which the student never sees.
      const visible = container.cloneNode(true) as HTMLElement;
      visible.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
      const text = visible.textContent ?? '';
      expect(text).not.toContain('$');
      expect(text).not.toContain('\\n');
      expect(text).not.toMatch(/\brac\b|\bimes\b/);
      unmount();
    }

    const { container } = renderStep(1); // Q2 has fractions in the source line
    expect(container.querySelectorAll('.katex .mfrac').length).toBeGreaterThan(0);
  });

  it('scopes the polished exercise styling to Lesson 4 only', () => {
    const { container, unmount } = renderStep(23); // Q24, a middle question
    expect(container.querySelector('.step-content-view.exercise-mode')).toBeTruthy();
    expect(container.querySelector('.exercise-view')).toBeTruthy();
    unmount();

    const lesson1 = render(
      <LessonExperience lesson={lesson01Data} initialStep={0} onNavigateBack={() => {}} />,
    );
    expect(lesson1.container.querySelector('.step-content-view')).toBeTruthy();
    expect(lesson1.container.querySelector('.exercise-mode')).toBeNull();
    expect(lesson1.container.querySelector('.exercise-view')).toBeNull();
    expect(lesson1.container.querySelector('.step-blocks-list')).toBeTruthy();
  });

  describe('duplicate math display (presentation only)', () => {
    it('shows a genuinely duplicated expression only once', () => {
      // Q2: the same expression appears inline in the text and in mathFormula.
      const source = lesson04Data.steps[1].blocks[0];
      expect(source.content).toContain(source.mathFormula!);
      expect(isMathDuplicatedInText(source.content, source.mathFormula)).toBe(true);

      const { container } = renderStep(1);
      const rendered = Array.from(
        container.querySelectorAll('.exercise-source .katex-mathml annotation'),
      ).map((node) => (node.textContent ?? '').replace(/\s/g, ''));
      const target = source.mathFormula!.replace(/\s/g, '');
      expect(rendered.filter((tex) => tex === target)).toHaveLength(1);
    });

    it('still displays a mathFormula that is not present in the text', () => {
      // Q11: the table expression only exists in mathFormula.
      const source = lesson04Data.steps[10].blocks[0];
      expect(isMathDuplicatedInText(source.content, source.mathFormula)).toBe(false);

      const { container } = renderStep(10);
      const rendered = Array.from(
        container.querySelectorAll('.exercise-source .katex-mathml annotation'),
      ).map((node) => (node.textContent ?? '').replace(/\s/g, ''));
      expect(rendered).toContain(source.mathFormula!.replace(/\s/g, ''));
    });

    it('leaves Lessons 1–3 blocks untouched (no dedupe without the opt-in flag)', () => {
      const candidates = [lesson01Data, lesson02Data, lesson03Data]
        .flatMap((lesson) => lesson.steps)
        .flatMap((step) => step.blocks)
        .filter((block) => isMathDuplicatedInText(block.content, block.mathFormula));

      // Even where a duplicate exists, the default rendering keeps both.
      for (const block of candidates.slice(0, 3)) {
        const { container, unmount } = render(<SourceContentBlock block={block} />);
        const rendered = Array.from(
          container.querySelectorAll('.katex-mathml annotation'),
        ).map((node) => (node.textContent ?? '').replace(/\s/g, ''));
        expect(rendered).toContain(block.mathFormula!.replace(/\s/g, ''));
        unmount();
      }

      // And the block header of untouched lessons is still rendered.
      const plain = lesson01Data.steps[0].blocks[0];
      const { container } = render(<SourceContentBlock block={plain} />);
      expect(container.querySelector('.block-header')).toBeTruthy();
      expect(container.querySelector('.source-content-block.headerless')).toBeNull();
    });
  });
});
