import type { LessonTestBlueprint } from '../types';

/**
 * Blueprint of the Lesson 2 test (الضرب).
 *
 * Authored from the lesson itself (pages 8–11): the activity that extends the
 * multiplication rule to fractions, the property «بسط × بسط ومقام × مقام» with its
 * five examples (including cancellation), the knowledge block on simplified forms
 * and literal expressions, the sign-of-product rule, expansion with the
 * distributive property, and factorization by taking out the common factor.
 */
export const lesson2Blueprint: LessonTestBlueprint = {
  lessonId: 'lesson-2',
  sourceSteps: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'step-8'],
  concepts: [
    {
      conceptId: 'l2-fraction-times-fraction',
      title: 'خاصة ضرب كسرين عاديين: بسط × بسط ومقام × مقام',
      questionCount: 4,
      skills: [
        'ضرب كسرين وكتابة الناتج بأبسط صورة',
        'حساب جداء ثلاثة عوامل كسرية',
        'حساب كسر من كسر',
        'مطابقة جداء بناتجه المبسّط',
      ],
    },
    {
      conceptId: 'l2-cancellation',
      title: 'الاختصار بين البسط والمقام قبل إنجاز الضرب',
      questionCount: 1,
      skills: ['ترتيب مراحل الاختصار ثم الضرب'],
    },
    {
      conceptId: 'l2-fraction-times-whole',
      title: 'ضرب كسر في عدد صحيح (a = a/1) وكسر من كمية',
      questionCount: 4,
      skills: [
        'ضرب كسر في عدد صحيح ذهنيًا',
        'حساب كسر من كمية معطاة',
        'نمذجة تكرار كمية كسرية',
      ],
    },
    {
      conceptId: 'l2-sign-of-product',
      title: 'إشارة الجداء: عدد العوامل السالبة زوجي أم فردي',
      questionCount: 2,
      skills: ['تحديد إشارة جداء دون حساب', 'التحقق من إشارة جداء محسوب'],
    },
    {
      conceptId: 'l2-literal-multiplication',
      title: 'ضرب المقادير الحرفية وإبقاء الحرف في الناتج',
      questionCount: 2,
      skills: ['ضرب كسر في مقدار حرفي', 'تشخيص إسقاط الحرف من الناتج'],
    },
    {
      conceptId: 'l2-distributive-expansion',
      title: 'النشر: توزيع الضرب على الجمع والطرح ثم جمع الحدود المتشابهة',
      questionCount: 4,
      skills: [
        'نشر عبارة بعامل سالب',
        'تحديد العبارات المكافئة بعد النشر',
        'النشر ثم جمع الحدود المتشابهة',
        'الضرب أولًا ثم تجميع الحدود المتشابهة',
      ],
    },
    {
      conceptId: 'l2-factorization',
      title: 'التحليل: إخراج العامل المشترك',
      questionCount: 3,
      skills: [
        'إخراج العامل المشترك من عبارة',
        'التعرف إلى التحليلات المكافئة',
        'مطابقة نشر بتحليله',
      ],
    },
  ],
  // Deviates from the recommended 6/7/4/3 profile on purpose: the lesson adds two
  // new symbolic skills (expansion and factorization), so an extra intermediate
  // question replaces one reasoning question.
  difficultyPlan: { basic: 6, intermediate: 8, advanced: 4, reasoning: 2 },
  deviationRationale:
    'الدرس يضيف مهارتين رمزيتين جديدتين (النشر والتحليل) تحتاجان تدريبًا متوسطًا إضافيًا، فزاد سؤال متوسط واحد على حساب سؤال تفكير واحد.',
  questionTypePlan: {
    'single-choice': 3,
    numeric: 6,
    'true-false': 2,
    'multi-select': 3,
    ordering: 2,
    matching: 2,
    'error-analysis': 2,
  },
  commonMistakes: [
    'اختصار عددين في البسط معًا بدل اختصار بسط مع مقام.',
    'إهمال عدد العوامل السالبة عند تحديد الإشارة.',
    'عدم توزيع العامل السالب على الحد الثاني داخل القوس.',
    'إخراج العامل المشترك من حد واحد فقط.',
    'إسقاط الحرف من الناتج بعد ضرب المعاملات.',
  ],
};
