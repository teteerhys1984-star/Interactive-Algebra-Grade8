import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PowerOfTenLadder } from '../components/interactive/PowerOfTenLadder';
import { curriculum, getLessonById, getUnitById } from '../data/curriculum';
import { getTestsByType, resolveTest } from '../data/tests/registry';
import { getLessonTestId } from '../data/tests/lessonTests';

/**
 * Regression checks for Unit 2, Lesson 1 (قوى العدد 10).
 * Covers registration, source-page mapping, the interactive ladder, and the
 * rule that no Unit 2 unit test exists until the user declares the unit complete.
 */

describe('Unit 2, Lesson 1 — registration and structure', () => {
  it('is registered in the curriculum with its warm-up and source pages 25–28', () => {
    const unit = getUnitById('unit-2');
    expect(unit).toBeDefined();
    expect(unit!.sourcePages).toEqual([25, 26, 27, 28]);
    expect(unit!.warmup.id).toBe('warmup');
    expect(unit!.warmup.sourcePages).toEqual([25]);
    expect(unit!.lessons.map((lesson) => lesson.id)).toEqual(['u2-lesson-1', 'u2-lesson-2']);
    expect(getLessonById('unit-2', 'u2-lesson-1')?.title).toBe('قوى العدد 10');
  });

  it('keeps Unit 1 unchanged in the curriculum', () => {
    expect(curriculum[0].id).toBe('unit-1');
    expect(curriculum[0].lessons.map((lesson) => lesson.id)).toEqual(['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4']);
  });

  it('gives every step a source page and unique step ids, all within pages 26–28', () => {
    const lesson = getLessonById('unit-2', 'u2-lesson-1')!;
    const ids = lesson.steps.map((step) => step.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const step of lesson.steps) {
      expect(step.sourcePages.length).toBeGreaterThan(0);
      expect(step.sourcePages.every((page) => page >= 26 && page <= 28)).toBe(true);
    }
  });

  it('exposes the textbook items of pages 26–28 as student-visible steps', () => {
    const lesson = getLessonById('unit-2', 'u2-lesson-1')!;
    const sourceBlockIds = lesson.steps.flatMap((step) => step.blocks.map((block) => block.id));
    for (const id of [
      'p26-activity', 'p26-activity-fill', 'p26-def1', 'p26-ex-10-3', 'p26-ex-10-6', 'p26-def2', 'p26-ex-10-minus-3',
      'p27-ex-10-minus-6', 'p27-standard-def', 'p27-standard-ex', 'p27-standard-negative', 'p27-convert-title',
      'p27-ex-2715', 'p27-ex-0075',
      'p28-check-1', 'p28-check-2', 'p28-check-3', 'p28-practice-1', 'p28-practice-2', 'p28-practice-3',
      'p28-practice-4-context', 'p28-practice-4',
    ]) {
      expect(sourceBlockIds, `missing block ${id}`).toContain(id);
    }
  });

  it('has exactly one lesson test and no Unit 2 unit test', () => {
    expect(getLessonTestId('u2-lesson-1')).toBe('u2-test-lesson-1');
    expect(resolveTest('u2-test-lesson-1')!.questionCount).toBe(20);
    expect(getTestsByType('unit').map((test) => test.unitId)).toEqual(['unit-1']);
    expect(getTestsByType('unit').some((test) => test.unitId === 'unit-2')).toBe(false);
  });
});

describe('Unit 2, Lesson 1 — power-of-ten ladder interactive', () => {
  it('starts at 1000 = 10^3 and moves one exponent step per ÷10 / ×10 press', () => {
    render(<PowerOfTenLadder />);
    expect(document.querySelector('.power-ladder-current-value')?.textContent).toBe('1000');

    fireEvent.click(screen.getByRole('button', { name: /÷ 10/ }));
    expect(document.querySelector('.power-ladder-current-value')?.textContent).toBe('100');
    expect(document.querySelector('.power-ladder-exponent-note')?.textContent).toContain('2');

    fireEvent.click(screen.getByRole('button', { name: /× 10/ }));
    expect(document.querySelector('.power-ladder-current-value')?.textContent).toBe('1000');
  });

  it('disables ×10 at the top and ÷10 at the bottom, and resets to the start', () => {
    render(<PowerOfTenLadder />);
    const up = screen.getByRole('button', { name: /× 10/ }) as HTMLButtonElement;
    const down = screen.getByRole('button', { name: /÷ 10/ }) as HTMLButtonElement;
    expect(up.disabled).toBe(true);
    expect(down.disabled).toBe(false);

    for (let i = 0; i < 6; i += 1) fireEvent.click(down);
    expect(document.querySelector('.power-ladder-current-value')?.textContent).toBe('0.001');
    expect((down as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'إعادة' }));
    expect(document.querySelector('.power-ladder-current-value')?.textContent).toBe('1000');
  });
});
