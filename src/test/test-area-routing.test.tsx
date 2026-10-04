import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../app/App';
import { parseHash } from '../app/useHashRoute';
import { getTestsByType, resolveTest } from '../data/tests/registry';

describe('student Test Area routes and regression', () => {
  beforeEach(() => {
    window.location.hash = '';
    window.sessionStorage.clear();
  });

  it('parses catalog, attempt, solutions, and legacy lesson/teacher routes independently', () => {
    expect(parseHash('#/tests')).toEqual({ view: 'tests' });
    expect(parseHash('#/tests/run/u1-test-unit-1')).toEqual({ view: 'test-runner', testId: 'u1-test-unit-1' });
    expect(parseHash('#/tests/solutions/u1-test-lesson-4')).toEqual({ view: 'test-solutions', testId: 'u1-test-lesson-4' });
    expect(parseHash('#/tests/solutions')).toEqual({ view: 'test-solutions', testId: undefined });
    expect(parseHash('#/unit/unit-1/lesson/lesson-4')).toMatchObject({ view: 'lesson', unitId: 'unit-1', lessonId: 'lesson-4' });
    expect(parseHash('#/teacher')).toEqual({ view: 'teacher' });
  });

  it('shows four lesson tests and the 60-question unit test, but no empty comprehensive section', () => {
    window.location.hash = '#/tests';
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { name: 'الاختبارات' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'اختبارات الدروس' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'اختبارات الوحدات' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'اختبارات شاملة' })).not.toBeInTheDocument();
    expect(container.querySelectorAll('.test-card')).toHaveLength(5);
    expect(screen.getAllByRole('button', { name: /بدء الاختبار/ })).toHaveLength(5);
    expect(screen.getByRole('link', { name: 'حلول الاختبارات' })).toHaveAttribute('href', '#/tests/solutions');

    expect(getTestsByType('lesson').map((test) => test.lessonId)).toEqual([
      'lesson-1', 'lesson-2', 'lesson-3', 'lesson-4',
    ]);
    expect(getTestsByType('lesson').every((test) => test.questionIds.length === 20)).toBe(true);
    expect(resolveTest('u1-test-unit-1')?.questionCount).toBe(60);
  });

  it('opens full worked solutions directly, without requiring a prior attempt', async () => {
    window.location.hash = '#/tests/solutions';
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { name: 'حلول الاختبارات' })).toBeInTheDocument();
    const solutionLinks = screen.getAllByRole('button', { name: /عرض الحلول الكاملة/ });
    expect(solutionLinks).toHaveLength(5);
    fireEvent.click(solutionLinks[solutionLinks.length - 1]);

    await waitFor(() => expect(container.querySelectorAll('.test-solution-card')).toHaveLength(5));
    expect(screen.getByRole('heading', { name: /اختبار الوحدة الأولى/ })).toBeInTheDocument();
    expect(container.querySelector('.test-solution-prompt')?.textContent).toContain('بدأ مؤشر مختبر');
    expect(container.querySelectorAll('.test-solution-steps li').length).toBeGreaterThan(5);
    expect(container.querySelector('.test-solutions')).toHaveAttribute('dir', 'rtl');
    expect(container.querySelector('.test-solution-prompt .katex')).toBeInTheDocument();
    expect(container.querySelector('.test-solution-prompt .math-inline-isolated')).toHaveAttribute('dir', 'ltr');
  });

  it('opens an attempt from its hash route and preserves RTL with isolated KaTeX math', () => {
    window.location.hash = '#/tests/run/u1-test-lesson-1';
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { name: 'اختبار الدرس الأول: الجمع والطرح' })).toBeInTheDocument();
    expect(container.querySelector('.test-question-body')).toBeInTheDocument();
    expect(container.querySelector('.test-question-body')).toHaveAttribute('dir', 'rtl');
    expect(container.querySelector('.test-question-prompt .katex')).toBeInTheDocument();
    const math = container.querySelector('.test-question-prompt .math-inline-isolated');
    expect(math).toHaveAttribute('dir', 'ltr');
    expect((math as HTMLElement).style.unicodeBidi).toBe('isolate');
  });

  it('keeps the Lesson 4 route reachable through the persistent Test Area entry point', async () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-4';
    render(<App />);

    expect(screen.getByText(/الخطوة 1 من/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'فتح مساحة الاختبارات' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'اختبارات الدروس' })).toBeInTheDocument());
  });
});
