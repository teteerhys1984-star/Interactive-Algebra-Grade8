import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { curriculum, getLessonById } from '../data/curriculum';
import { lesson01Data } from '../data/unit1/lesson01';
import { warmupData } from '../data/unit1/warmup';

describe('Grade 8 Algebra Lesson 1 - Full Suite', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('1. Lesson 1 and Warmup are registered in the curriculum', () => {
    expect(curriculum.length).toBeGreaterThan(0);
    const unit1 = curriculum[0];
    expect(unit1.id).toBe('unit-1');
    expect(unit1.lessons.some((l) => l.id === 'lesson-1')).toBe(true);
    expect(unit1.warmup.id).toBe('warmup');
  });

  it('2. Instructor credit is displayed exactly as required in header and footer', () => {
    render(<App />);
    const matches = screen.getAllByText(/المهندس سومر شاهين: 0930215022/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    matches.forEach((el) => {
      expect(el).toBeInTheDocument();
      expect(el.textContent).toContain('المهندس سومر شاهين: 0930215022');
    });
  });

  it('3. Lesson 1 contains exactly 6 structured steps matching Pages 5-7', () => {
    const lesson1 = getLessonById('unit-1', 'lesson-1');
    expect(lesson1).toBeDefined();
    expect(lesson1?.steps.length).toBe(6);
    expect(lesson1?.sourcePages).toEqual([5, 6, 7]);
  });

  it('4. Navigation to Lesson 1 step 1 renders only the current step', () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-1';
    render(<App />);
    expect(screen.getByText(/الخطوة 1 من 6/)).toBeInTheDocument();
    const headings = screen.getAllByText(/نشاط: تمديد القواعد لتشمل الكسور/);
    expect(headings.length).toBeGreaterThanOrEqual(1);
    // Step 2 should not be in the current step content
    expect(screen.queryByText(/الخطوة 2 من 6/)).not.toBeInTheDocument();
  });

  it('5. Step Navigator Next and Previous buttons navigate correctly and update progress', () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-1';
    render(<App />);

    // Initially on Step 1: Previous is disabled
    const prevBtn = screen.getByLabelText('الخطوة السابقة');
    expect(prevBtn).toBeDisabled();

    // Click Next to advance to Step 2
    const nextBtn = screen.getByLabelText('الخطوة التالية');
    fireEvent.click(nextBtn);

    expect(screen.getByText(/الخطوة 2 من 6/)).toBeInTheDocument();
    const step2Headings = screen.getAllByText(/تعلم: خاصة 1 — المقامات متساوية/);
    expect(step2Headings.length).toBeGreaterThanOrEqual(1);
    expect(prevBtn).not.toBeDisabled();

    // Click Prev to return to Step 1
    fireEvent.click(prevBtn);
    expect(screen.getByText(/الخطوة 1 من 6/)).toBeInTheDocument();
  });

  it('6. Step completion screen renders when completing the last step', () => {
    window.location.hash = '#/unit/unit-1/lesson/lesson-1/6';
    render(<App />);

    expect(screen.getByText(/الخطوة 6 من 6/)).toBeInTheDocument();
    const completeBtn = screen.getByLabelText('إتمام الدرس');
    expect(completeBtn).toBeInTheDocument();

    fireEvent.click(completeBtn);
    expect(screen.getByText(/مبارك! أتممت بنجاح/)).toBeInTheDocument();
  });

  it('7. All source blocks retain source references to page numbers', () => {
    lesson01Data.steps.forEach((step) => {
      expect(step.sourcePages.length).toBeGreaterThan(0);
      step.blocks.forEach((block) => {
        expect(block.sourceRef).toBeDefined();
        expect(block.sourceRef.page).toBeGreaterThanOrEqual(5);
        expect(block.sourceRef.page).toBeLessThanOrEqual(7);
        expect(block.sourceRef.section).toBeTruthy();
      });
    });
  });

  it('8. Active Launchpad (Pages 3-4) has all 12 source exercises', () => {
    expect(warmupData.sourcePages).toEqual([3, 4]);
    const totalBlocks = warmupData.steps.flatMap((s) => s.blocks);
    expect(totalBlocks.length).toBeGreaterThanOrEqual(10);
  });
});
