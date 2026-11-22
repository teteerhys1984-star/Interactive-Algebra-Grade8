import type { SourceRef } from '../unit1/lesson01';

/**
 * «دفتر الطالب» — مساحة تدوين منظمة مرتبطة بمعرف الدرس، مستقلة عن بنية
 * `LessonData` (لا تعديل عليها). المحتوى مؤلف ومراجع تربويًا لكل درس على حدة.
 *
 * قواعد الإسناد (يفرضها `src/test/notebook-data-integrity.test.ts`):
 *  - `book`: منقول من الكتاب — يجب أن يحمل `refs` (≥1) بصفحة تغطيها بيانات المنصة فعلًا.
 *  - `adapted`: معاد تأليفه انطلاقًا من الكتاب — يجب أن يحمل `refs` الأصل + `note` يوضح طبيعة التصرف.
 *  - `platform`: مضاف من المنصة — ممنوع أن يحمل `refs` كتابية (لا إسناد لمعلومة لا يدعمها المصدر).
 */

export type NotebookOrigin = 'book' | 'adapted' | 'platform';

export interface NotebookSource {
  origin: NotebookOrigin;
  /**
   * إلزامي (≥1) عندما `origin` هو `book` أو `adapted`، وممنوع عندما يكون
   * `platform`. نفس `SourceRef` القائم في بيانات الدروس — توافق كامل.
   */
  refs?: SourceRef[];
  /** وصف إعادة الصياغة أو الأساس التعليمي (مثل: «صياغة مختصرة انطلاقًا من مثال ص6»). */
  note?: string;
}

export interface NotebookEntry {
  id: string;
  title?: string;
  /** نص عربي قد يتضمن رياضيات مضمّنة (`$…$`) — يُعرض عبر MathText. */
  text?: string;
  /** صيغة TeX خام تُعرض مستقلة (display) — مثل صيغ القواعد. */
  math?: string;
  /** خطوات مرقمة (منهجية حل، أو قائمة تعبيرات تمرين مطلوب نسخه). */
  steps?: string[];
  /** ≥1 دائمًا: كل مدخل مسؤول عن إسناد نفسه. */
  sources: NotebookSource[];
}

export type NotebookSectionKind =
  | 'definitions'
  | 'rules'
  | 'formulas'
  | 'procedures'
  | 'worked-examples'
  | 'cautions'
  | 'exercises-to-copy';

export interface NotebookSection {
  id: string;
  kind: NotebookSectionKind;
  title: string;
  /** لا يُسمح بقسم بلا مدخلات. */
  entries: NotebookEntry[];
  /**
   * يوثّق أن القسم مشتق برمجيًا من بيانات درس فعلي (مثل سجل محطات تمارين
   * الدرس الرابع) وليس مؤلفًا يدويًا — يبقى متزامنًا مع أي تصحيح للبيانات.
   */
  derivedFrom?: { lessonId: string };
}

export interface StudentNotebookData {
  unitId: string;
  lessonId: string;
  title: string;
  /** سجل المراجعة التربوية: متى روجع المحتوى وعلى أي أساس. */
  review: { date: string; note: string };
  sections: NotebookSection[];
}
