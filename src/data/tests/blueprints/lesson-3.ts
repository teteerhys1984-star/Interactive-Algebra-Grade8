import type { LessonTestBlueprint } from '../types';

/**
 * Blueprint of the Lesson 3 test (القسمة).
 *
 * Authored from the lesson itself (pages 12–16): the three opening activities
 * (reciprocal, division as multiplication by the reciprocal, exact versus
 * approximate quotient), the two «تعلّم» blocks on the reciprocal and on dividing
 * two rational numbers, the knowledge blocks on priorities, on dividing by a
 * non-zero number and opposite versus reciprocal, and on the calculator with
 * compound expressions.
 */
export const lesson3Blueprint: LessonTestBlueprint = {
  lessonId: 'lesson-3',
  sourceSteps: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'step-8'],
  concepts: [
    {
      conceptId: 'l3-reciprocal',
      title: 'مقلوب عدد عادي: تبديل البسط والمقام دون تغيير الإشارة',
      questionCount: 4,
      skills: [
        'كتابة مقلوب كسر موجب أو سالب',
        'التعرف إلى زوجين حاصل ضربهما واحد',
        'تبرير أنه لا مقلوب للصفر',
      ],
    },
    {
      conceptId: 'l3-division-by-reciprocal',
      title: 'القسمة هي الضرب بمقلوب المقسوم عليه',
      questionCount: 5,
      skills: [
        'تحويل قسمة إلى ضرب بالمقلوب',
        'تحديد العدد الذي يُقلب',
        'اختصار الناتج بعد القسمة',
        'مطابقة قسمة بخارجها المبسّط',
      ],
    },
    {
      conceptId: 'l3-division-meaning',
      title: 'معنى القسمة: القياس والعملية العكسية للضرب',
      questionCount: 2,
      skills: ['تفسير قسمة على أنها قياس', 'إيجاد المقسوم بالعملية العكسية'],
    },
    {
      conceptId: 'l3-sign-of-quotient',
      title: 'إشارة خارج القسمة',
      questionCount: 1,
      skills: ['تحديد إشارة خارج قسمة دون حساب'],
    },
    {
      conceptId: 'l3-opposite-vs-reciprocal',
      title: 'الفرق بين النظير الجمعي والمقلوب',
      questionCount: 2,
      skills: ['التمييز بين النظير والمقلوب', 'كتابة النظير والمقلوب لعدد سالب'],
    },
    {
      conceptId: 'l3-zero-in-division',
      title: 'الصفر في القسمة: صفر ÷ عدد = صفر، والقسمة على صفر غير معرّفة',
      questionCount: 1,
      skills: ['تصحيح خلط بين 0 ÷ a و a ÷ 0'],
    },
    {
      conceptId: 'l3-exact-vs-approximate',
      title: 'القيمة التامة مقابل القيمة التقريبية واستعمال الآلة الحاسبة',
      questionCount: 1,
      skills: ['التمييز بين القيمة التامة والمعروضة على الآلة'],
    },
    {
      conceptId: 'l3-order-of-operations',
      title: 'مراعاة الأولويات في عبارة تضم قسمة وجمعًا أو طرحًا',
      questionCount: 2,
      skills: ['إنجاز القسمة قبل الجمع أو الطرح', 'تشخيص خطأ ترتيب العمليات'],
    },
    {
      conceptId: 'l3-compound-expressions',
      title: 'العبارات المركّبة والكسور المركّبة',
      questionCount: 2,
      skills: ['حساب كسر مركّب', 'إنجاز قسمة متتابعة'],
    },
  ],
  difficultyPlan: { basic: 6, intermediate: 7, advanced: 4, reasoning: 3 },
  questionTypePlan: {
    'single-choice': 3,
    numeric: 7,
    'true-false': 2,
    'multi-select': 2,
    ordering: 2,
    matching: 1,
    'error-analysis': 3,
  },
  commonMistakes: [
    'قلب المقسوم بدل المقسوم عليه.',
    'تغيير إشارة الكسر عند كتابة مقلوبه.',
    'الخلط بين النظير الجمعي والمقلوب.',
    'إنجاز الجمع قبل القسمة خلافًا لترتيب العمليات.',
    'اعتبار القسمة على صفر مساوية لصفر.',
  ],
};
