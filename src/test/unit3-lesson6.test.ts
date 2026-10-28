import { describe, expect, it } from 'vitest';
import { curriculum, getLessonById } from '../data/curriculum';

describe('Unit 3 textbook exercises lesson', () => {
  const lesson = getLessonById('unit-3', 'u3-lesson-6');

  it('is registered as the final lesson of Unit 3', () => {
    const unit = curriculum.find((entry) => entry.id === 'unit-3');
    expect(unit?.lessons.map((entry) => entry.id)).toEqual([
      'u3-lesson-1',
      'u3-lesson-2',
      'u3-lesson-3',
      'u3-lesson-4',
      'u3-lesson-5',
      'u3-lesson-6',
    ]);
    expect(lesson?.title).toBe('تمرينات الوحدة الثالثة بالكتاب');
  });

  it('preserves all 16 source questions as ordered steps', () => {
    expect(lesson?.steps).toHaveLength(16);
    expect(lesson?.steps.map((step) => step.sourceLabel)).toEqual(
      Array.from({ length: 16 }, (_, index) => `السؤال ${index + 1}`),
    );
  });

  it('keeps unresolved source notes visible to the teacher', () => {
    const notes = lesson?.teacherArea?.teachingNotes.join(' ') ?? '';
    expect(notes).toContain('المساواة الثانية');
    expect(notes).toContain('0.0 317');
    expect(notes).toContain('255');
    expect(notes).toContain('225');
  });
});
