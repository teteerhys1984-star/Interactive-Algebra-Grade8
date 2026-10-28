import type { LessonTestBlueprint } from '../types';

export const unit3Lesson6Blueprint: LessonTestBlueprint = {
  lessonId: 'u3-lesson-6',
  sourceSteps: Array.from({ length: 16 }, (_, index) => `step-${index + 1}`),
  concepts: [
    { conceptId: 'u3l6-parentheses', title: 'حذف الأقواس والإشارات', questionCount: 4, skills: ['حذف الأقواس مع الجمع والطرح', 'توزيع إشارة السالب'] },
    { conceptId: 'u3l6-combine-like-terms', title: 'اختزال الحدود المتشابهة', questionCount: 2, skills: ['جمع الحدود المتشابهة', 'اختزال الثوابت'] },
    { conceptId: 'u3l6-substitution', title: 'التعويض وحساب قيمة عبارة', questionCount: 2, skills: ['التعويض بعد الاختزال', 'حساب قيمة العبارة عند قيمة معطاة'] },
    { conceptId: 'u3l6-expansion', title: 'النشر والاختزال', questionCount: 4, skills: ['نشر عامل على قوس', 'اختزال الناتج'] },
    { conceptId: 'u3l6-distributive-property', title: 'خاصية التوزيع والإشارات', questionCount: 4, skills: ['توزيع العامل على كل حد', 'تحديد إشارة الجداء'] },
    { conceptId: 'u3l6-binomial-products', title: 'نشر جداء حدّين', questionCount: 2, skills: ['حساب الجداءات الأربعة', 'جمع الحدود المتشابهة'] },
    { conceptId: 'u3l6-word-model', title: 'صياغة تعبير من مسألة لفظية', questionCount: 1, skills: ['تمثيل عدد الأطفال بـ 40−x', 'الحفاظ على القيم المعطاة في نص المسألة'] },
    { conceptId: 'u3l6-source-fidelity', title: 'النقل الأمين للنص المطبوع', questionCount: 1, skills: ['تمييز النص الحرفي عن التصحيح التحريري'] },
  ],
  difficultyPlan: { basic: 6, intermediate: 7, advanced: 4, reasoning: 3 },
  questionTypePlan: { 'single-choice': 8, numeric: 7, 'true-false': 2, 'error-analysis': 1, matching: 1, 'multi-select': 1 },
  commonMistakes: ['تغيير الإشارات عند حذف الأقواس بصورة غير صحيحة.', 'إغفال حد عند النشر أو الخطأ في إشارة جداء سالبين.', 'استبدال 255 بالقيمة 225 التي ظهرت في عمل الطالب.', 'تصحيح 0.0 317 تخمينًا بدل حفظ النقل الحرفي.'],
};
