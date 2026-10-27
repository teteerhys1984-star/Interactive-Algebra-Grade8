import type { LessonTestBlueprint } from '../types';

/** مبني على الأمثلة والمطالب والقيم والطرائق المطبوعة في الصفحات 58–60. */
export const unit3Lesson5Blueprint: LessonTestBlueprint = {
  lessonId: 'u3-lesson-5',
  sourceSteps: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'step-8'],
  concepts: [
    { conceptId: 'u3l5-substitution-counterexample', title: 'اختبار المساواة بالتعويض والمثال المعاكس', questionCount: 7,
      skills: ['حساب طرفي المساواة عند قيمة محددة', 'التمييز بين العبارتين المطبوعتين في نشاط ص58', 'تحديد ما يثبته المثال المعاكس وما لا تثبته الاختبارات المحدودة'] },
    { conceptId: 'u3l5-correct-expansion', title: 'تصحيح نشر (3x+1)(x+2)', questionCount: 2,
      skills: ['نشر الجداء وجمع الحدود المتشابهة', 'تشخيص الحد المفقود في نتيجة الطالب'] },
    { conceptId: 'u3l5-efficient-evaluation', title: 'اختيار صيغة مناسبة لحساب قيمة عبارة رمزية', questionCount: 3,
      skills: ['اختزال مثال A ثم التعويض عند −30', 'استخدام العامل الصفري في التنبيه عند 20'] },
    { conceptId: 'u3l5-evaluate-z-b', title: 'نشر Z وB واختزالهما وحساب قيمهما', questionCount: 5,
      skills: ['جمع الحدود بعد التوزيع', 'التعويض بالكسر والعدد السالب والعدد العشري'] },
    { conceptId: 'u3l5-prism-surface', title: 'مساحة أوجه متوازي المستطيلات', questionCount: 2,
      skills: ['جمع مساحات الأزواج الثلاثة للأوجه', 'التعويض عند x = 5 مع وحدة المساحة'] },
    { conceptId: 'u3l5-proof-methods', title: 'مقارنة إنجازات حسان ووضاح ولينا', questionCount: 1,
      skills: ['تمييز الاختبار العددي عن البرهان الرمزي بالتوزيع'] },
  ],
  difficultyPlan: { basic: 6, intermediate: 7, advanced: 4, reasoning: 3 },
  questionTypePlan: { 'single-choice': 8, numeric: 7, 'true-false': 2, 'error-analysis': 1, matching: 1, 'multi-select': 1 },
  commonMistakes: [
    'الخلط بين $x^2+6x+2$ في السؤال و$3x^2+6x+2$ في مساواة الطالب.',
    'اعتبار توافق الطرفين عند قيمة واحدة إثباتًا لصحة المساواة لكل القيم.',
    'إهمال $1\times x$ عند نشر $(3x+1)(x+2)$.',
    'نسيان إشارات الطرح عند اختزال $Z$ و$B$ أو تربيع قيمة سالبة.',
    'نسيان أحد أزواج أوجه متوازي المستطيلات أو وحدة المساحة.',
  ],
};
