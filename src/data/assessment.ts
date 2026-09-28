// Shared type definitions for the comprehensive final assessment and the
// teacher area. These types are additive: Lesson 1 does not use them, so its
// behaviour is completely unaffected.

export type AssessmentQuestionType =
  | 'mcq' // اختيار من متعدد
  | 'numeric' // إدخال رياضي (كسر / عدد / مقدار)
  | 'error-analysis' // تحديد الخطأ
  | 'method-select' // اختيار الطريقة الصحيحة
  | 'transformation' // إتمام تحويل (نشر / تحليل)
  | 'multi-step'; // مسألة متعددة الخطوات

export interface AssessmentChoice {
  id: string;
  /** LaTeX / MathText content shown for the choice. */
  text: string;
}

export interface AssessmentQuestion {
  id: string;
  type: AssessmentQuestionType;
  /** Concept tag used to build the "concepts to review" summary. */
  concept: string;
  /** Index of the lesson step this question reinforces (for review links). */
  relatedStepIndex: number;
  /** Question stem (Arabic + inline math via $...$). */
  prompt: string;
  /** Optional display math shown under the prompt. */
  math?: string;
  /** Choices for mcq / method-select / error-analysis. */
  choices?: AssessmentChoice[];
  /** Correct choice id for choice-based questions. */
  correctId?: string;
  /** Accepted normalized answers for numeric / transformation questions. */
  acceptedAnswers?: string[];
  /** Canonical answer rendered as math in the review panel. */
  answerDisplay?: string;
  /** Explanation shown in the review stage. */
  explanation: string;
  /** Optional gentle hint available before checking. */
  hint?: string;
}

export interface FinalAssessment {
  title: string;
  description: string;
  passThreshold: number; // نسبة النجاح (٪)
  questions: AssessmentQuestion[];
}

/* ----------------------------- Teacher area ----------------------------- */

export interface TeacherAnswerItem {
  ref: string; // مرجع التمرين (مثال: "تدرّب ① ②")
  answer: string; // الحل / الناتج (MathText)
  note?: string;
}

export interface TeacherAnswerGroup {
  section: string; // عنوان المجموعة
  source: string; // المصدر (مثال: "الصفحة 11 • تدرّب")
  items: TeacherAnswerItem[];
}

export interface TeacherCommonMistake {
  mistake: string;
  correction: string;
}

export interface TeacherArea {
  objectives: string[]; // أهداف الدرس
  commonMistakes: TeacherCommonMistake[]; // الأخطاء الشائعة
  remediation: string[]; // اقتراحات المعالجة
  teachingNotes: string[]; // ملاحظات تدريسية
  assessmentGuidance: string[]; // إرشادات التقويم
  answerKeys: TeacherAnswerGroup[]; // مفاتيح الإجابة (الكتاب + الاختبار)
}
