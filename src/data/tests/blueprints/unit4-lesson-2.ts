import type { LessonTestBlueprint } from '../types';

/**
 * مخطط اختبار الدرس الثاني من الوحدة الرابعة («حل معادلة»، ص72–74).
 */
export const unit4Lesson2Blueprint: LessonTestBlueprint = {
  lessonId: 'u4-lesson-2',
  sourceSteps: ['step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'step-8', 'step-9', 'step-10', 'step-12', 'step-13'],
  concepts: [
    {
      conceptId: 'u4l2-equation-meaning',
      title: 'معنى المعادلة والحلّ والتحقّق',
      questionCount: 2,
      skills: [
        'تمييز الحلّ من بين أعداد معروضة',
        'التحقّق بالتعويض في المعادلة الأصلية',
        'التمييز بين حساب قيمة تركيب وحلّ معادلة',
      ],
    },
    {
      conceptId: 'u4l2-isolate-unknown',
      title: 'حلّ ax + b = cx + d بعزل المجهول',
      questionCount: 4,
      skills: [
        'جمع حدود المجهول في طرف واحد',
        'القسمة على المعامل مع مراعاة الإشارة',
        'تشخيص خطأ في ترتيب خطوات العزل',
      ],
    },
    {
      conceptId: 'u4l2-brackets-equations',
      title: 'حلّ معادلة تحوي أقواسًا بالنشر أولًا',
      questionCount: 5,
      skills: [
        'نشر قوس مسبوق بمعامل موجب',
        'نشر قوس مسبوق بعدد سالب',
        'القسمة على القوس كاملًا لا على حدّ واحد',
      ],
    },
    {
      conceptId: 'u4l2-table-of-values',
      title: 'قراءة حلّ معادلة من جدول قيم تركيب خطّي',
      questionCount: 3,
      skills: [
        'إكمال جدول قيم تركيب خطّي',
        'استخراج الحلّ من الجدول',
        'الحكم على حدود استعمال الجدول',
      ],
    },
    {
      conceptId: 'u4l2-solutions-of-products',
      title: 'معادلات من الدرجة الثانية والجداء المعدوم',
      questionCount: 3,
      skills: [
        'تطبيق قاعدة الجداء المعدوم',
        'إيجاد حلّي فرق مربّعين',
        'حلّ معادلة من الشكل x² = عدد',
      ],
    },
    {
      conceptId: 'u4l2-fraction-equations',
      title: 'معادلات بمعاملات كسرية أو سالبة',
      questionCount: 2,
      skills: [
        'الضرب في المقلوب لمعامل كسري',
        'الحفاظ على الإشارة عند القسمة على عدد سالب',
      ],
    },
    {
      conceptId: 'u4l2-rectangle-model',
      title: 'ترجمة محيط مستطيل إلى معادلة وحلّها بطريقتين',
      questionCount: 1,
      skills: ['ترجمة صيغة المحيط إلى معادلة وحلّها بطريقتين'],
    },
  ],
  difficultyPlan: { basic: 6, intermediate: 7, advanced: 4, reasoning: 3 },
  questionTypePlan: {
    'single-choice': 9,
    numeric: 4,
    'true-false': 2,
    'multi-select': 2,
    'error-analysis': 2,
    ordering: 1,
  },
  commonMistakes: [
    'طرح الثابت بدل إضافته عند نقله، كما في $5x-6=14 \\Rightarrow 5x = 14-6$.',
    'الخطأ في إشارة القسمة على معامل سالب: من $-2x=-9$ استنتاج $x=-\\frac{9}{2}$.',
    'القسمة على العامل قبل نشر القوس فتقع القسمة على الحدّ الأول فقط.',
    'الاكتفاء بحلّ واحد في معادلة الجداء المعدوم أو فرق المربّعين.',
    'الاعتقاد أن جدول القيم يُثبت أنّ الحلّ وحيد.',
  ],
};
