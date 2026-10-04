import type { LessonTestBlueprint } from '../types';

/**
 * Blueprint of the Lesson 1 test (الجمع والطرح).
 *
 * Authored from the lesson itself (pages 5–7): the activity that extends the
 * grade-7 rules, property 1 (equal denominators), property 2 (unlike
 * denominators), the knowledge block on chains of additions/subtractions, the
 * «تحقق من فهمك» items on multiples and on completing an equality, and the
 * practice set ending with the juice-mixing word problem.
 */
export const lesson1Blueprint: LessonTestBlueprint = {
  lessonId: 'lesson-1',
  sourceSteps: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6'],
  concepts: [
    {
      conceptId: 'l1-equal-denominators',
      title: 'خاصة 1: جمع وطرح كسور مقاماتها متساوية',
      questionCount: 2,
      skills: ['جمع بسطين لهما المقام نفسه', 'طرح بسطين لهما المقام نفسه مع الاختصار'],
    },
    {
      conceptId: 'l1-unlike-denominators',
      title: 'خاصة 2: توحيد المقامات قبل الجمع أو الطرح',
      questionCount: 4,
      skills: [
        'تحويل كسر إلى مقام مشترك مع الحفاظ على قيمته',
        'جمع كسرين مختلفي المقام بإشارة سالبة',
        'استعمال تكافؤ الكسور في الطرح',
        'تشخيص خطأ جمع المقامين وتصحيحه',
      ],
    },
    {
      conceptId: 'l1-common-denominator-choice',
      title: 'اختيار المقام المشترك: المضاعفات والمقام المشترك الأصغر',
      questionCount: 2,
      skills: ['اختيار مقام مشترك مناسب', 'ترتيب خطوات التوحيد قبل الجمع أو الطرح'],
    },
    {
      conceptId: 'l1-operation-chains',
      title: 'سلسلة من عمليات الجمع والطرح وترتيب إنجازها',
      questionCount: 4,
      skills: [
        'حساب سلسلة من ثلاثة حدود',
        'إنجاز الجمع والطرح من اليسار إلى اليمين',
        'احترام ترتيب العمليات داخل سلسلة كسور',
      ],
    },
    {
      conceptId: 'l1-signed-fractions',
      title: 'الإشارات في جمع الكسور وطرحها وطرح عدد سالب',
      questionCount: 3,
      skills: ['تحديد إشارة الناتج', 'تحويل طرح عدد سالب إلى جمع', 'جمع كسور بإشارات مختلفة'],
    },
    {
      conceptId: 'l1-missing-term',
      title: 'إيجاد الحد الناقص في مساواة (انسخ وأكمل)',
      questionCount: 1,
      skills: ['إيجاد الحد الناقص باستعمال العملية العكسية'],
    },
    {
      conceptId: 'l1-word-problems',
      title: 'مسائل لفظية على الكسور: الباقي والمجموع',
      questionCount: 2,
      skills: ['ترجمة مسألة لفظية إلى عملية على الكسور', 'حل مسألة متعددة الخطوات'],
    },
    {
      conceptId: 'l1-mixed-practice',
      title: 'تمارين مختلطة: ربط كل عملية بناتجها المبسّط',
      questionCount: 2,
      skills: ['مطابقة عملية بناتجها المبسّط', 'تتبع رصيد يتغير بكسور موجبة وسالبة'],
    },
  ],
  difficultyPlan: { basic: 6, intermediate: 7, advanced: 4, reasoning: 3 },
  questionTypePlan: {
    'single-choice': 4,
    numeric: 7,
    'true-false': 2,
    'multi-select': 2,
    ordering: 2,
    matching: 1,
    'error-analysis': 2,
  },
  commonMistakes: [
    'جمع المقامات مع البسطين بدل إبقاء المقام.',
    'ضرب البسط وحده عند التحويل إلى المقام المشترك.',
    'إدخال قوس يغيّر إشارة الحد الأخير في السلسلة.',
    'اعتبار طرح كسر سالب طرحًا عاديًا.',
  ],
};
