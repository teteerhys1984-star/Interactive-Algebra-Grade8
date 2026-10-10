import type { LessonTestBlueprint } from '../types';

/**
 * مخطط اختبار الدرس الرابع من الوحدة الثانية (الجذور التربيعية).
 *
 * مُعدّ من الدرس نفسه (الصفحات 35–37) قبل كتابة الأسئلة: نشاط الجداول والتعريف،
 * والنتيجتان (العدد السالب والصفر)، وخواص الجذور التربيعية الأربع، ومثال التبسيط،
 * ومثال الآلة الحاسبة، ثم «تحقّق من فهمك» و«تدرّب».
 *
 * الأسئلة من تأليف المنصة ولا تنسخ بنود الكتاب: كل الأعداد والسياقات مختلفة عن
 * بنود الصفحات 35–37. البنود التي تحمل «ملاحظة المصدر» (الفاصلة في مثال 0.0256
 * وكلمة الآلة الحاسبة غير الواضحة) لم تُستعمل أساسًا لأي سؤال.
 */
export const unit2Lesson4Blueprint: LessonTestBlueprint = {
  lessonId: 'u2-lesson-4',
  sourceSteps: [
    'step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7',
    'step-8', 'step-9', 'step-10', 'step-11', 'step-12', 'step-13', 'step-14', 'step-15',
  ],
  concepts: [
    {
      conceptId: 'u2l4-root-definition',
      title: 'تعريف الجذر التربيعي للعدد الموجب',
      questionCount: 3,
      skills: [
        'قراءة $\\sqrt{a} = b$ بوصفها $b^{2} = a$ مع $b \\geq 0$',
        'إيجاد الجذر التربيعي لعدد مربع كامل',
      ],
    },
    {
      conceptId: 'u2l4-negative-zero',
      title: 'العدد السالب والصفر والعدد غير المربع',
      questionCount: 2,
      skills: [
        'الحكم بوجود الجذر التربيعي أو عدم وجوده للعدد السالب',
        'تحديد $\\sqrt{0} = 0$',
      ],
    },
    {
      conceptId: 'u2l4-product-rule',
      title: 'الجذر التربيعي لجداء عددين موجبين',
      questionCount: 3,
      skills: [
        'تطبيق $\\sqrt{a\\times b} = \\sqrt{a}\\times\\sqrt{b}$',
        'تمييز الصواب من الخطأ في توزيع الجذر على الجمع',
      ],
    },
    {
      conceptId: 'u2l4-quotient-rule',
      title: 'الجذر التربيعي لنسبة عددين موجبين',
      questionCount: 2,
      skills: [
        'تطبيق $\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$',
        'تصحيح خطأ أخذ جذر البسط وحده',
      ],
    },
    {
      conceptId: 'u2l4-power-rules',
      title: 'قوّة الجذر وجذر قوّة أسها زوجي',
      questionCount: 4,
      skills: [
        'تطبيق $\\left(\\sqrt{b}\\right)^{n} = \\sqrt{b^{n}}$',
        'تطبيق $\\sqrt{b^{n}} = b^{\\frac{n}{2}}$ عند الأس الزوجي',
        'ترتيب خطوات حساب قوّة جذر',
      ],
    },
    {
      conceptId: 'u2l4-simplify',
      title: 'تبسيط الجذور بإخراج العامل المربع الكامل',
      questionCount: 3,
      skills: [
        'إيجاد أكبر عامل مربع كامل يقسم العدد',
        'كتابة الجذر بالصيغة المبسطة $k\\sqrt{m}$',
      ],
    },
    {
      conceptId: 'u2l4-area-calc',
      title: 'مساحة المربع وطول ضلعه والآلة الحاسبة',
      questionCount: 3,
      skills: [
        'حساب طول ضلع المربع من مساحته',
        'حصر الجذر بين عددين صحيحين متتاليين والتقريب إلى جزء من مئة',
      ],
    },
  ],
  difficultyPlan: { basic: 6, intermediate: 7, advanced: 4, reasoning: 3 },
  questionTypePlan: {
    numeric: 6,
    'single-choice': 5,
    'true-false': 3,
    'error-analysis': 2,
    'multi-select': 2,
    ordering: 1,
    matching: 1,
  },
  commonMistakes: [
    'كتابة $\\sqrt{25} = \\pm5$ أو اعتبار $\\sqrt{25}$ عددًا سالبًا.',
    'اعتبار أن للعدد السالب جذرًا تربيعيًا، مثل $\\sqrt{-16} = -4$.',
    'توزيع الجذر على الجمع: $\\sqrt{9+16} = 3+4$.',
    'أخذ جذر البسط وحده في النسبة: $\\sqrt{\\frac{9}{25}} = \\frac{9}{5}$.',
    'اعتبار $\\sqrt{x^{2}} = x$ لكل $x$، مع أن $\\sqrt{(-3)^{2}} = 3$.',
    'تبسيط $\\sqrt{50}$ بإخراج 2 كأنه عامل مربع: $\\sqrt{50} = 2\\sqrt{25}$.',
    'اعتبار أن $\\sqrt{x}$ عدد صحيح دائمًا، فيُحسب $\\sqrt{30}$ كأنه 5.',
    'إغفال وحدة الطول بعد حساب جذر المساحة.',
  ],
};
