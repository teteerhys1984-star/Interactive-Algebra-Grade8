import type { StudentNotebookData } from './types';
import { unit1Lesson1Notebook } from './unit1-lesson1';
import { unit1Lesson2Notebook } from './unit1-lesson2';
import { unit1Lesson3Notebook } from './unit1-lesson3';
import { unit1Lesson4Notebook } from './unit1-lesson4';
import { unit2Lesson1Notebook } from './unit2-lesson1';
import { unit2Lesson2Notebook } from './unit2-lesson2';
import { unit2Lesson3Notebook } from './unit2-lesson3';
import { unit2Lesson4Notebook } from './unit2-lesson4';
import { unit3Lesson1Notebook } from './unit3-lesson1';
import { unit3Lesson2Notebook } from './unit3-lesson2';
import { unit3Lesson3Notebook } from './unit3-lesson3';
import { unit3Lesson4Notebook } from './unit3-lesson4';
import { unit3Lesson5Notebook } from './unit3-lesson5';
import { unit4Lesson1Notebook } from './unit4-lesson1';
import { unit4Lesson2Notebook } from './unit4-lesson2';
import { unit4Lesson3Notebook } from './unit4-lesson3';

/**
 * سجل دفاتر الطالب — طبقة مستقلة عن `LessonData` (لا تعديل على بنية الدروس).
 * الدفتر يرتبط بمعرّف الدرس، والدروس التي لا يتوفر لها دفتر ترجع `undefined`
 * فلا يظهر عنصر «دفتر الطالب» في واجهتها إطلاقًا.
 *
 * مسجّل حاليًا لدروس الوحدة الأولى الأربعة (1–4) ولدروس الوحدة الثانية
 * الأربعة الأولى (u2-lesson-1 … u2-lesson-4)، دون الإحماء ودون درس تمارين
 * الوحدة الثانية (u2-lesson-5)، مع دروس الوحدة الثالثة التعليمية الخمسة
 * (u3-lesson-1 … u3-lesson-5) دون إحمائها أو درسها السادس، ومع دروس الوحدة
 * الرابعة التعليمية الثلاثة (u4-lesson-1 … u4-lesson-3) دون إحمائها.
 */
const notebooks: StudentNotebookData[] = [
  unit1Lesson1Notebook,
  unit1Lesson2Notebook,
  unit1Lesson3Notebook,
  unit1Lesson4Notebook,
  unit2Lesson1Notebook,
  unit2Lesson2Notebook,
  unit2Lesson3Notebook,
  unit2Lesson4Notebook,
  unit3Lesson1Notebook,
  unit3Lesson2Notebook,
  unit3Lesson3Notebook,
  unit3Lesson4Notebook,
  unit3Lesson5Notebook,
  unit4Lesson1Notebook,
  unit4Lesson2Notebook,
  unit4Lesson3Notebook,
];

export function getNotebook(unitId: string, lessonId: string): StudentNotebookData | undefined {
  return notebooks.find((n) => n.unitId === unitId && n.lessonId === lessonId);
}

export function hasNotebook(unitId: string, lessonId: string): boolean {
  return getNotebook(unitId, lessonId) !== undefined;
}

/** للاختبارات: كل الدفاتر المسجلة. */
export function allNotebooks(): readonly StudentNotebookData[] {
  return notebooks;
}

export type { StudentNotebookData, NotebookSection, NotebookEntry, NotebookSource, NotebookOrigin, NotebookSectionKind } from './types';
