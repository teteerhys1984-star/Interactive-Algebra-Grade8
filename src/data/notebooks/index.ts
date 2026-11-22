import type { StudentNotebookData } from './types';
import { unit1Lesson1Notebook } from './unit1-lesson1';
import { unit1Lesson4Notebook } from './unit1-lesson4';

/**
 * سجل دفاتر الطالب — طبقة مستقلة عن `LessonData` (لا تعديل على بنية الدروس).
 * الدفتر يرتبط بمعرّف الدرس، والدروس التي لا يتوفر لها دفتر ترجع `undefined`
 * فلا يظهر عنصر «دفتر الطالب» في واجهتها إطلاقًا.
 *
 * مرحلة تجريبية: دفتران نموذجيان فقط (درس نظري + درس تدريبي) من الوحدة الأولى.
 */
const notebooks: StudentNotebookData[] = [unit1Lesson1Notebook, unit1Lesson4Notebook];

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
