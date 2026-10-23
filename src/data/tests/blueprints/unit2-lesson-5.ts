import type { LessonTestBlueprint } from '../types';

/**
 * مخطط اختبار الدرس الخامس من الوحدة الثانية (تمارين ومسائل الوحدة الثانية).
 *
 * مُعدّ من الدرس نفسه (الأسئلة 1–39) قبل كتابة الأسئلة: سبعة مفاهيم تغطي محطات
 * الدرس الثمانية، بتوزيع 5/3/3/3/2/3/1. الأسئلة من تأليف المنصة ولا تنسخ بنود
 * الكتاب؛ كل الأعداد والسياقات مختلفة عن أسئلة التمارين، والبنود التي تحمل ملاحظة
 * مصدر (9 ① و30 2.①) لم تُستعمل أساسًا في أي سؤال.
 */
export const unit2Lesson5Blueprint: LessonTestBlueprint = {
  lessonId: 'u2-lesson-5',
  sourceSteps: ['q-1', 'q-5', 'q-9', 'q-13', 'q-17', 'q-21', 'q-25', 'q-29', 'q-33', 'q-37', 'q-39'],
  concepts: [
    {
      conceptId: 'u2l5-standard-form',
      title: 'الصيغة المعيارية وشرط 1 ≤ a < 10',
      questionCount: 5,
      skills: [
        'تحديد الأس في الصيغة المعيارية لعدد كبير أو صغير',
        'تمييز الكتابة المعيارية من غيرها',
        'إعادة كتابة عدد بأسّ مطلوب مع تعديل المعامل',
      ],
    },
    {
      conceptId: 'u2l5-power-rules',
      title: 'قواعد قوى العدد 10 (الضرب والقسمة وقوة القوة)',
      questionCount: 3,
      skills: [
        'جمع الأسس في الضرب وطرحها في القسمة',
        'ضرب الأسس في قوة القوة',
      ],
    },
    {
      conceptId: 'u2l5-order-of-operations',
      title: 'أولويات العمليات وإشارة القوة',
      questionCount: 3,
      skills: [
        'تنفيذ القوى قبل الضرب والجمع',
        'التمييز بين $(-a)^{n}$ و$-a^{n}$',
      ],
    },
    {
      conceptId: 'u2l5-addition-subtraction',
      title: 'جمع وطرح أعداد بصيغة a × 10^p',
      questionCount: 3,
      skills: [
        'توحيد القوة قبل الجمع أو الطرح',
        'جمع المعاملات بعد التوحيد',
      ],
    },
    {
      conceptId: 'u2l5-decimal-conversion',
      title: 'التحويل بين الكتابة العشرية وقوى العدد 10',
      questionCount: 2,
      skills: [
        'كتابة عدد عشري بصيغة $a\times10^{p}$',
        'مقارنة أعداد مكتوبة بقوى سالبة',
        'التحقق من التكافؤ بين صيغ مختلفة',
      ],
    },
    {
      conceptId: 'u2l5-applications',
      title: 'تطبيقات المساحة والحجم والوحدات',
      questionCount: 3,
      skills: [
        'حساب طول الضلع أو الحرف من المساحة أو الحجم',
        'الحفاظ على الوحدات والتحويل بينها',
      ],
    },
    {
      conceptId: 'u2l5-mixed-review',
      title: 'مراجعة مختلطة لأعداد بصيغ متعددة',
      questionCount: 1,
      skills: ['ربط عدد بصيغته المعيارية ضمن مجموعة مختلطة'],
    },
  ],
  difficultyPlan: { basic: 6, intermediate: 7, advanced: 4, reasoning: 3 },
  questionTypePlan: {
    numeric: 8,
    'single-choice': 5,
    'true-false': 2,
    'error-analysis': 1,
    'multi-select': 2,
    ordering: 1,
    matching: 1,
  },
  commonMistakes: [
    'جمع الأسس في الجمع: $3\\times10^{5}+4\\times10^{5}\\to7\\times10^{10}$.',
    'اعتبار أي عدد فيه $10^{n}$ معياريًا، مثل $42.6\\times10^{3}$.',
    'الخلط بين $(-3)^{2}=9$ و$-3^{2}=-9$.',
    'نسيان تحويل الوحدات بعد حساب الجذر (متر ← سنتيمتر).',
    'الظن أن $10^{-5}>10^{-2}$ لأن 5 أكبر من 2.',
  ],
};
