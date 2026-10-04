import type { LessonTestBlueprint } from '../types';

/**
 * Blueprint of the Lesson 4 test (تمارين الوحدة الأولى).
 *
 * Lesson 4 is the workbook lesson: 47 source exercises (pages 17–24) grouped in
 * ten stations. The blueprint covers the stations the test actually draws on —
 * fraction arithmetic with priorities, literal calculation (expansion and
 * factorization), ratios and percentages, successive percent changes, percent
 * modelling, rates and measurement with unit conversion, and simple equations
 * with fractional coefficients.
 */
export const lesson4Blueprint: LessonTestBlueprint = {
  lessonId: 'lesson-4',
  sourceSteps: [
    'exercise-10', 'exercise-13', 'exercise-14', 'exercise-15',
    'exercise-30', 'exercise-33', 'exercise-34', 'exercise-35',
    'exercise-37', 'exercise-38', 'exercise-39', 'exercise-40',
    'exercise-41', 'exercise-42', 'exercise-43', 'exercise-44',
    'exercise-45', 'exercise-46',
  ],
  concepts: [
    {
      conceptId: 'l4-fraction-arithmetic-review',
      title: 'مراجعة العمليات على الكسور مع مراعاة الأولويات',
      questionCount: 3,
      skills: [
        'إنجاز الضرب قبل الجمع في عبارة كسرية',
        'حل مسألة طرح ثم تقسيم',
        'حساب كسر من فجوة متبقية ثم جمعه',
      ],
    },
    {
      conceptId: 'l4-expand-and-factor',
      title: 'النشر والتحليل وتبسيط العبارات الجبرية',
      questionCount: 4,
      skills: [
        'التحقق من نشر وتبسيط عبارة',
        'ترتيب خطوات النشر وجمع الحدود المتشابهة',
        'تحليل عبارة ثم التحقق من التحليل',
        'تشخيص خطأ في التوزيع',
      ],
    },
    {
      conceptId: 'l4-percent-change',
      title: 'النسبة المئوية للتغير: زيادة ونقصان من المقدار الأصلي',
      questionCount: 4,
      skills: [
        'حساب نسبة التغير من المقدار الأصلي',
        'تحديد المتبقي بعد نقصان نسبي',
        'حساب سعر بعد تخفيض',
        'التحقق من تكامل الأجزاء المئوية',
      ],
    },
    {
      conceptId: 'l4-successive-percent-changes',
      title: 'التغيرات المتتابعة وعوامل الضرب المركّبة',
      questionCount: 3,
      skills: [
        'تركيب عاملي تغير متتابع',
        'مطابقة تغير متتابع بعامل الضرب الكلي',
        'حساب مساحة بعد تغير بعديها بنسبتين',
      ],
    },
    {
      conceptId: 'l4-percent-algebraic-models',
      title: 'النسب المئوية في النمذجة الجبرية للمواقف',
      questionCount: 2,
      skills: ['نمذجة تخفيض نسبي مع أجرة ثابتة', 'جمع حد نسبي مع حد كسري'],
    },
    {
      conceptId: 'l4-rates-and-measurement',
      title: 'المعدلات والكسور من كمية وتحويل الوحدات والمساحات',
      questionCount: 3,
      skills: [
        'حساب معدل بكسور وتحويل الوحدات',
        'استعمال مقياس رسم لإيجاد طول حقيقي',
        'حساب مساحة مستطيل أبعاده كسرية',
      ],
    },
    {
      conceptId: 'l4-fractional-equations',
      title: 'معادلات بسيطة بمعاملات كسرية',
      questionCount: 1,
      skills: ['حل معادلة خطية بمعاملات كسرية'],
    },
  ],
  difficultyPlan: { basic: 6, intermediate: 7, advanced: 4, reasoning: 3 },
  questionTypePlan: {
    'single-choice': 2,
    numeric: 8,
    'true-false': 3,
    'multi-select': 2,
    ordering: 2,
    matching: 1,
    'error-analysis': 2,
  },
  commonMistakes: [
    'جمع حدود غير متشابهة بعد النشر.',
    'حساب النسبة من الباقي بدل المقدار الأصلي.',
    'جمع نسبتين متتابعتين بدل ضرب عامليهما.',
    'نسيان تحويل الوحدات قبل استعمال المعدل.',
  ],
};
