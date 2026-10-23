import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { StepRenderer } from '../components/lesson/StepRenderer';
import { SourceContentBlock } from '../components/lesson/SourceContentBlock';
import { TeacherArea } from '../components/teacher/TeacherArea';
import { TestRunner } from '../components/tests/TestRunner';
import { TestSolutions } from '../components/tests/TestSolutions';
import App from '../app/App';
import { unit2Lesson3Data as lesson } from '../data/unit2/lesson03';
import audit from '../data/unit2/lesson03.source-audit.json';
import { resolveTest } from '../data/tests/registry';
import { mathShape, visibleTextOf } from './fixtures/lesson3-exact-math';

const test = resolveTest('u2-test-lesson-3')!;
const blocks = lesson.steps.flatMap((step) => step.blocks);
const safeMath = (container: HTMLElement) => {
  expect(container.querySelector('.katex-error, [data-math-error]')).toBeNull();
  expect(visibleTextOf(container)).not.toMatch(/\$|\\(?:frac|times|left|right|text|begin|ge|ne)\b/);
};

beforeEach(() => { sessionStorage.clear(); window.location.hash = ''; });

describe('Lesson 3 — actual student render and source-note isolation', () => {
  it.each(lesson.steps.map((step, index) => [step.id, step, index] as const))('renders %s with real KaTeX and without teacher editorial notes', (_id, step, index) => {
    const { container } = render(<StepRenderer step={step} stepIndex={index} totalSteps={17} />);
    expect(container.querySelector('.step-title')).toHaveTextContent(step.title);
    expect(container.querySelector('.katex')).not.toBeNull();
    safeMath(container);
    expect(visibleTextOf(container)).not.toMatch(/ملاحظة المصدر|النقل القديم|سجل المطابقة|يحتاج مطابقة|غير مقروء/);
    expect(container.querySelector('.source-ref-tag')).not.toBeNull();
  });

  it.each(audit.exerciseGroups)('reveals and hides all worked answers in $blockId without exposing the editorial audit', (group) => {
    const block = blocks.find((entry) => entry.id === group.blockId)!;
    const { container } = render(<SourceContentBlock block={block} />);
    expect(container.querySelector('.solution-panel')).toBeNull();
    for (const button of screen.getAllByRole('button', { name: 'إظهار الحل والخطوات' })) fireEvent.click(button);
    expect(container.querySelectorAll('.solution-panel')).toHaveLength(group.items.length);
    safeMath(container);
    expect(visibleTextOf(container)).not.toContain('ملاحظة المصدر');
    for (const button of screen.getAllByRole('button', { name: 'إخفاء الحل' })) fireEvent.click(button);
    expect(container.querySelector('.solution-panel')).toBeNull();
  });

  it('routes to a deep lesson step, keeps the lesson-scoped layout hook, and advances normally', () => {
    window.location.hash = '#/unit/unit-2/lesson/u2-lesson-3/5';
    const { container } = render(<App />);
    expect(container.querySelector('.lesson-layout')).toHaveAttribute('data-lesson-id', 'u2-lesson-3');
    expect(container.querySelector('.step-title')).toHaveTextContent(lesson.steps[4].title);
    expect(screen.getByRole('region', { name: 'استوديو القوى' })).toBeInTheDocument();
    fireEvent.click(container.querySelector('.next-btn')!);
    expect(container.querySelector('.step-title')).toHaveTextContent(lesson.steps[5].title);
  });

  // JSDOM has no MathMLElement.style; scope these button queries instead of
  // asking its accessible-name walker to traverse anonymous KaTeX MathML nodes.
  it('uses the existing practice-check confirmation and retry flow with the actual lesson question', () => {
    const block = blocks.find((entry) => entry.id === 'p32-product-predict')!;
    const { container } = render(<SourceContentBlock block={block} />);
    expect(container.querySelector('.pc-check-btn')!).toBeDisabled();
    fireEvent.click(container.querySelectorAll('.pc-choice')[1]);
    expect(container.querySelector('.pc-feedback')).toBeNull();
    fireEvent.click(container.querySelector('.pc-check-btn')!);
    expect(container.querySelector('.pc-feedback')).toHaveTextContent('لنراجع');
    expect(container.querySelector('.pc-feedback')).toHaveTextContent('لا نضرب الأسين');
    fireEvent.click(container.querySelector('.pc-retry')!);
    expect(container.querySelector('.pc-feedback')).toBeNull();
    fireEvent.click(container.querySelectorAll('.pc-choice')[0]);
    fireEvent.click(container.querySelector('.pc-check-btn')!);
    expect(container.querySelector('.pc-feedback')).toHaveTextContent('أحسنت');
    safeMath(container);
  });
});

describe('Lesson 3 — actual teacher gate and linked worked solutions', () => {
  it('requires the existing teacher gate, then exposes all 54 solutions, the 15 source notes and their math', () => {
    const { container } = render(<TeacherArea onNavigateHome={() => {}} />);
    expect(container.querySelector('.ta-content')).toBeNull();
    fireEvent.change(screen.getByLabelText('كلمة المرور'), { target: { value: 'incorrect' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول' }));
    expect(container.querySelector('.ta-content')).toBeNull();
    fireEvent.change(screen.getByLabelText('كلمة المرور'), { target: { value: 'somer173' } });
    fireEvent.click(screen.getByRole('button', { name: 'دخول' }));
    fireEvent.click(screen.getByRole('button', { name: /الدرس 3: قوى صحيحة لعدد نسبي/ }));
    expect(sessionStorage.getItem('teacher-access-granted')).toBe('true');
    expect(container.querySelectorAll('.ta-solution')).toHaveLength(54);
    expect(container.querySelectorAll('.ta-solution-group')).toHaveLength(13);
    expect(container.querySelectorAll('.ta-source-notes li')).toHaveLength(15);
    expect(container.querySelector('.ta-source-notes')).toHaveTextContent('سبعة عوامل');
    expect(container.querySelector('.ta-source-notes')).toHaveTextContent('النقل القديم');
    expect(container.querySelectorAll('.ta-key-item')).toHaveLength(54);
    const details = container.querySelector('details.ta-solution')!;
    fireEvent.click(details.querySelector('summary')!);
    expect(details.querySelector('.ta-solution-body')).toHaveTextContent('التحقق');
    safeMath(container);
  });
});

describe('Lesson 3 — standalone test: submission-only grading and independent solutions', () => {
  it('does not disclose correctness on either answer, submits real counts, and resets a clean attempt', () => {
    const { container } = render(<TestRunner test={test} onReturnToTests={() => {}} onOpenSolutions={() => {}} />);
    const card = container.querySelector('.test-question-card')!;
    const original = card.textContent;
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '16' } });
    expect(card.textContent).toBe(original);
    fireEvent.change(input, { target: { value: '256' } });
    expect(card.textContent).toBe(original);
    expect(container.querySelector('.test-results, .test-score-line, .is-correct, .is-incorrect')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }));
    const second = container.querySelector('.test-question-card')!.textContent;
    fireEvent.click(container.querySelector('input[value="true"]')!);
    expect(container.querySelector('.test-question-card')!.textContent).toBe(second);
    fireEvent.click(container.querySelector('input[value="false"]')!);
    expect(container.querySelector('.test-question-card')!.textContent).toBe(second);
    expect(container.querySelector('.test-results, .is-correct, .is-incorrect')).toBeNull();
    expect(container.querySelector('.test-solution-steps')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'تسليم الاختبار' }));
    expect(container.querySelector('.test-score-line')!.textContent).toBe('2/20');
    expect([...container.querySelectorAll('.test-count-value')].map((node) => node.textContent)).toEqual(['2', '0', '18']);
    expect(container.querySelector('.test-solution-steps')).toBeNull();
    expect(sessionStorage.getItem('interactive-algebra:test-attempt:u2-test-lesson-3')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'إعادة الاختبار' }));
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(container.querySelector('.test-results')).toBeNull();
    safeMath(container);
  });

  it('renders all 20 independently linked worked test solutions over four pages', () => {
    const { container } = render(<TestSolutions test={test} onReturnToSolutions={() => {}} onReturnToTests={() => {}} />);
    for (let page = 0; page < 4; page++) {
      const cards = [...container.querySelectorAll('.test-solution-card')];
      expect(cards).toHaveLength(5);
      cards.forEach((card, index) => {
        const question = test.questions[page * 5 + index];
        const promptMath = [...card.querySelectorAll('.test-solution-prompt annotation')].map((node) => mathShape(node.textContent!));
        expect(promptMath).toEqual([...question.prompt.matchAll(/\$([^$]+)\$/g)].map((match) => mathShape(match[1])));
        const answerMath = [...card.querySelectorAll('.test-solution-answer annotation')].map((node) => mathShape(node.textContent!));
        expect(answerMath).toEqual([...question.solution.finalAnswer.matchAll(/\$([^$]+)\$/g)].map((match) => mathShape(match[1])));
        expect(card.querySelector('.test-solution-steps li')).not.toBeNull();
        expect(card.querySelector('h3 bdi')!.textContent).toBe(String(page * 5 + index + 1));
        expect(card.querySelector('.test-solution-answer')).not.toBeNull();
      });
      safeMath(container);
      if (page < 3) fireEvent.click(screen.getByRole('button', { name: 'الأسئلة التالية' }));
    }
    expect(screen.getByRole('button', { name: 'الأسئلة التالية' })).toBeDisabled();
  });
});
