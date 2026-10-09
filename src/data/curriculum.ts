import { lesson01Data, LessonData } from './unit1/lesson01';
import { lesson02Data } from './unit1/lesson02';
import { lesson03Data } from './unit1/lesson03';
import { lesson04Data } from './unit1/lesson04';
import { warmupData } from './unit1/warmup';
import { unit2WarmupData } from './unit2/warmup';
import { unit2Lesson1Data } from './unit2/lesson01';

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
    sourcePages: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    warmup: warmupData,
    lessons: [lesson01Data, lesson02Data, lesson03Data, lesson04Data],
  },
  {
    id: 'unit-2',
    number: 2,
    title: 'قوى الأعداد العادية',
    description: 'الوحدة الثانية من كتاب الجبر للصف الثامن: قوى العدد 10 بأسس موجبة وسالبة، والصيغة المعيارية للأعداد العشرية.',
    sourcePages: [25, 26, 27, 28],
    warmup: unit2WarmupData,
    lessons: [unit2Lesson1Data],
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
