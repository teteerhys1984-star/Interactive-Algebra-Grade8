import { lesson01Data, LessonData } from './unit1/lesson01';
import { warmupData } from './unit1/warmup';

export interface UnitData {
  id: string;
  number: number;
  title: string;
  description: string;
  sourcePages: number[];
  warmup: LessonData;
  lessons: LessonData[];
}

export const curriculum: UnitData[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'الأعداد العادية والعمليات عليها',
    description: 'الوحدة الأولى من كتاب الجبر للصف الثامن: الكسور العادية، العمليات الحسابية، التبسيط والمقارنة.',
    sourcePages: [3, 4, 5, 6, 7],
    warmup: warmupData,
    lessons: [lesson01Data],
  },
];

export function getUnitById(id: string): UnitData | undefined {
  return curriculum.find((u) => u.id === id);
}

export function getLessonById(unitId: string, lessonId: string): LessonData | undefined {
  const unit = getUnitById(unitId);
  if (!unit) return undefined;
  if (lessonId === 'warmup') return unit.warmup;
  return unit.lessons.find((l) => l.id === lessonId);
}

export function findLesson(lessonId: string): { unit: UnitData; lesson: LessonData } | undefined {
  for (const unit of curriculum) {
    if (lessonId === 'warmup') {
      return { unit, lesson: unit.warmup };
    }
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      return { unit, lesson };
    }
  }
  return undefined;
}
